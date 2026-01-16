const AUDIT_STORAGE_KEY = 'portfolioAuditLogs';
const AUDIT_DB_NAME = 'portfolio-audit-db';
const AUDIT_DB_VERSION = 1;
const AUDIT_STORE = 'logs';
const RETENTION = 1000;

export const AUDIT_EVENTS = {
  DATA_UPDATED: 'DATA_UPDATED',
  DATA_RESET: 'DATA_RESET',
  LOGIN: 'ADMIN_LOGIN',
  LOGOUT: 'ADMIN_LOGOUT',
  SNAPSHOT: 'DATA_SNAPSHOT',
  RESTORE: 'DATA_RESTORED',
  EXPORT: 'EXPORT_REQUESTED',
  ERROR: 'ERROR_EVENT',
};

const getTimestamp = () => new Date().toISOString();

const getUserIdentifier = () => {
  const isAuthed = localStorage.getItem('adminAuthed') === 'true';
  return isAuthed ? 'admin' : 'unknown';
};

let dbPromise;

const openDb = () => {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(AUDIT_DB_NAME, AUDIT_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(AUDIT_STORE)) {
        db.createObjectStore(AUDIT_STORE);
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
    const tx = db.transaction(AUDIT_STORE, 'readonly');
    const store = tx.objectStore(AUDIT_STORE);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
};

const idbSet = async (key, value) => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(AUDIT_STORE, 'readwrite');
    const store = tx.objectStore(AUDIT_STORE);
    const req = store.put(value, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

const idbDelete = async (key) => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(AUDIT_STORE, 'readwrite');
    const store = tx.objectStore(AUDIT_STORE);
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

const loadFromLocalStorage = () => {
  const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveToLocalStorage = (logs) => {
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
};

export const loadAuditLogs = async () => {
  try {
    const fromIdb = await idbGet(AUDIT_STORAGE_KEY);
    if (fromIdb) return Array.isArray(fromIdb) ? fromIdb : [];
  } catch (err) {
    console.warn('Failed to load audit logs from IndexedDB:', err);
  }
  return loadFromLocalStorage();
};

export const saveAuditLogs = async (logs) => {
  const trimmed = Array.isArray(logs) ? logs.slice(0, RETENTION) : [];
  try {
    await idbSet(AUDIT_STORAGE_KEY, trimmed);
  } catch (err) {
    console.warn('Failed to save audit logs to IndexedDB, using localStorage:', err);
    saveToLocalStorage(trimmed);
  }
};

const makeId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `audit-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const addAuditEntry = async (eventType, details = {}) => {
  const logs = await loadAuditLogs();
  const entry = {
    id: makeId(),
    timestamp: getTimestamp(),
    user: getUserIdentifier(),
    eventType,
    details,
    ip: 'local',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
  };

  const nextLogs = [entry, ...logs].slice(0, RETENTION);
  await saveAuditLogs(nextLogs);
  return entry;
};

export const getAuditLogs = async (options = {}) => {
  const { eventType, startDate, endDate, limit = 50, offset = 0 } = options;
  let logs = await loadAuditLogs();

  if (eventType) logs = logs.filter((log) => log.eventType === eventType);
  if (startDate) {
    const start = new Date(startDate);
    logs = logs.filter((log) => new Date(log.timestamp) >= start);
  }
  if (endDate) {
    const end = new Date(endDate);
    logs = logs.filter((log) => new Date(log.timestamp) <= end);
  }

  logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return logs.slice(offset, offset + limit);
};

export const clearAuditLogs = async () => {
  try {
    await idbDelete(AUDIT_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear audit logs from IndexedDB:', err);
  }
  localStorage.removeItem(AUDIT_STORAGE_KEY);
};

export const getObjectDifferences = (oldObj, newObj, path = '') => {
  const differences = [];
  const allKeys = new Set([
    ...Object.keys(oldObj || {}),
    ...Object.keys(newObj || {})
  ]);

  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key;
    const oldValue = oldObj?.[key];
    const newValue = newObj?.[key];

    const bothObjects = typeof oldValue === 'object' && typeof newValue === 'object' && oldValue !== null && newValue !== null;
    const bothArrays = Array.isArray(oldValue) && Array.isArray(newValue);

    if (bothObjects && !bothArrays) {
      differences.push(...getObjectDifferences(oldValue, newValue, currentPath));
    } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      differences.push({ path: currentPath, oldValue, newValue });
    }
  }

  return differences;
};

export const createDataSnapshot = async (data, description = 'Snapshot') => {
  const logs = await loadAuditLogs();
  const snapshot = {
    id: makeId(),
    timestamp: getTimestamp(),
    user: getUserIdentifier(),
    eventType: AUDIT_EVENTS.SNAPSHOT,
    details: {
      description,
      data: JSON.parse(JSON.stringify(data)),
    },
  };

  const nextLogs = [snapshot, ...logs].slice(0, RETENTION);
  await saveAuditLogs(nextLogs);
  return snapshot;
};

export const getSnapshots = async () => {
  const logs = await loadAuditLogs();
  return logs.filter((log) => log.eventType === AUDIT_EVENTS.SNAPSHOT);
};

export const exportAuditData = async () => {
  const logs = await loadAuditLogs();
  return logs;
};