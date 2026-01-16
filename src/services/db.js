import { isRemoteEnabled, loadRemoteData, saveRemoteData, resetRemoteData } from './remote';

const STORAGE_KEY = 'portfolioData';
const DB_NAME = 'portfolio-db';
const DB_VERSION = 1;
const STORE_NAME = 'data';

let dbPromise;

const openDb = () => {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
};

const idbGet = async (key) => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
};

const idbSet = async (key, value) => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(value, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

const idbDelete = async (key) => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

// Fallback helpers
const loadFromLocalStorage = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const saveToLocalStorage = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const resetLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const loadData = async () => {
  if (isRemoteEnabled()) {
    try {
      const remote = await loadRemoteData();
      if (remote) {
        // Cache remotely loaded data locally for offline fallback
        try {
          await idbSet(STORAGE_KEY, remote);
        } catch {
          saveToLocalStorage(remote);
        }
        return remote;
      }
    } catch (err) {
      console.warn('Remote load failed, falling back to local cache', err);
    }
  }

  try {
    const fromIdb = await idbGet(STORAGE_KEY);
    if (fromIdb) return fromIdb;
  } catch (err) {
    console.warn('IDB load failed, falling back to localStorage', err);
  }
  return loadFromLocalStorage();
};

export const saveData = async (data) => {
  if (isRemoteEnabled()) {
    try {
      await saveRemoteData(data);
    } catch (err) {
      console.warn('Remote save failed, caching locally', err);
    }
  }

  try {
    await idbSet(STORAGE_KEY, data);
  } catch (err) {
    console.warn('IDB save failed, falling back to localStorage', err);
    saveToLocalStorage(data);
  }
};

export const resetData = async () => {
  if (isRemoteEnabled()) {
    try {
      await resetRemoteData();
    } catch (err) {
      console.warn('Remote reset failed, clearing local only', err);
    }
  }

  try {
    await idbDelete(STORAGE_KEY);
  } catch (err) {
    console.warn('IDB reset failed, falling back to localStorage', err);
  }
  resetLocalStorage();
};
