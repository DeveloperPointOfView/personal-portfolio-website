import React, { createContext, useState, useEffect, useContext } from 'react';
import { personalData as defaultData } from '../data';
import * as db from '../services/db';
import { addAuditEntry, AUDIT_EVENTS, getObjectDifferences } from '../services/audit';

const DataContext = createContext();

const computeYearsFromExperience = (experience = []) => {
  const startYears = experience
    .map((exp) => {
      const match = /(?:19|20)\d{2}/.exec(exp.period || '');
      return match ? Number(match[0]) : null;
    })
    .filter(Boolean);
  if (!startYears.length) return null;
  const earliest = Math.min(...startYears);
  const now = new Date().getFullYear();
  const total = Math.max(1, now - earliest + 1);
  return `${total}+`;
};

const normalizeData = (candidate) => {
  const safe = { ...defaultData, ...(candidate || {}) };
  safe.name = typeof safe.name === 'string' ? safe.name : defaultData.name;
  safe.role = typeof safe.role === 'string' ? safe.role : defaultData.role;
  safe.heroTagline = typeof safe.heroTagline === 'string' ? safe.heroTagline.trim() : defaultData.heroTagline;
  safe.avatar = typeof safe.avatar === 'string' ? safe.avatar : defaultData.avatar;
  safe.newsletterUrl = typeof safe.newsletterUrl === 'string' ? safe.newsletterUrl.trim() : defaultData.newsletterUrl;
  const rawReasons = candidate?.newsletterReasons;
  safe.newsletterReasons = Array.isArray(rawReasons)
    ? rawReasons.map((item) => (typeof item === 'string' ? item.trim() : '')).filter(Boolean)
    : defaultData.newsletterReasons;
  safe.cta = {
    ...defaultData.cta,
    ...(candidate?.cta || {}),
  };

  const about = candidate?.about || {};
  const hasCandidateStats = Array.isArray(about.stats);
  safe.about = {
    ...defaultData.about,
    ...about,
    description: Array.isArray(about.description)
      ? about.description
      : typeof about.description === 'string'
        ? [about.description]
        : defaultData.about.description,
    stats: hasCandidateStats ? about.stats : defaultData.about.stats,
  };

  const stats = Array.isArray(safe.about.stats)
    ? safe.about.stats
        .map((stat) => ({
          label: typeof stat?.label === 'string' ? stat.label.trim() : '',
          value: typeof stat?.value === 'string' ? stat.value.trim() : '',
        }))
        .filter((stat) => stat.label && stat.value)
    : [];
  safe.about.stats = hasCandidateStats ? stats : (stats.length ? stats : defaultData.about.stats);

  const skills = Array.isArray(candidate?.skills)
    ? candidate.skills.map((skill) => (typeof skill === 'string' ? skill.trim() : '')).filter(Boolean)
    : defaultData.skills;
  safe.skills = skills.length ? skills : defaultData.skills;

  const sectionVisibility = { ...defaultData.sectionVisibility, ...(candidate?.sectionVisibility || {}) };
  Object.keys(sectionVisibility).forEach((key) => {
    sectionVisibility[key] = Boolean(sectionVisibility[key]);
  });
  safe.sectionVisibility = sectionVisibility;

  const sectionCopy = { ...defaultData.sectionCopy, ...(candidate?.sectionCopy || {}) };
  const normalizeCopy = (block, fallback) => ({
    eyebrow: typeof block?.eyebrow === 'string' ? block.eyebrow.trim() : fallback.eyebrow,
    title: typeof block?.title === 'string' ? block.title.trim() : fallback.title,
    subtitle: typeof block?.subtitle === 'string' ? block.subtitle.trim() : fallback.subtitle,
  });
  safe.sectionCopy = {
    experience: normalizeCopy(sectionCopy.experience, defaultData.sectionCopy.experience),
    certifications: normalizeCopy(sectionCopy.certifications, defaultData.sectionCopy.certifications),
    projects: normalizeCopy(sectionCopy.projects, defaultData.sectionCopy.projects),
    contact: normalizeCopy(sectionCopy.contact, defaultData.sectionCopy.contact),
  };

  const experience = Array.isArray(candidate?.experience)
    ? candidate.experience
        .map((exp) => {
          const title = (exp?.title || exp?.role || '').toString().trim();
          const company = (exp?.company || '').toString().trim();
          const period = (exp?.period || '').toString().trim();
          const description = (exp?.description || '').toString().trim();
          return { title, company, period, description };
        })
        .filter((exp) => exp.title || exp.company || exp.period || exp.description)
    : defaultData.experience;
  safe.experience = experience.length ? experience : defaultData.experience;

  // Note: Removed auto-computation of years experience to allow manual editing from admin panel

  if (Array.isArray(candidate?.projects)) {
    const projects = candidate.projects
      .map((project) => {
        const title = (project?.title || '').toString().trim();
        const description = (project?.description || '').toString().trim();
        const tech = Array.isArray(project?.tech)
          ? project.tech.map((t) => (t ? t.toString().trim() : '')).filter(Boolean)
          : [];
        const link = (project?.link || '').toString().trim();
        return { title, description, tech, link };
      })
      .filter((project) => project.title || project.description || project.tech.length || project.link);
    safe.projects = projects;
  } else {
    safe.projects = defaultData.projects;
  }

  const certifications = Array.isArray(candidate?.certifications)
    ? candidate.certifications
        .map((cert) => ({
          name: (cert?.name || '').toString().trim(),
          organization: (cert?.organization || '').toString().trim(),
          issueMonth: (cert?.issueMonth || '').toString().trim(),
          issueYear: (cert?.issueYear || '').toString().trim(),
          expirationMonth: (cert?.expirationMonth || '').toString().trim(),
          expirationYear: (cert?.expirationYear || '').toString().trim(),
          credentialId: (cert?.credentialId || '').toString().trim(),
          credentialUrl: (cert?.credentialUrl || '').toString().trim(),
        }))
        .filter((cert) => cert.name || cert.organization || cert.issueYear || cert.credentialUrl)
    : defaultData.certifications;
  safe.certifications = certifications.length ? certifications : defaultData.certifications;

  const contact = candidate?.contact || {};
  const hasCandidateSocial = contact.social && typeof contact.social === 'object';
  const socialSource = hasCandidateSocial ? contact.social : defaultData.contact.social;
  const sanitizedSocial = Object.entries(socialSource || {})
    .map(([platform, href]) => ({ platform: platform.trim(), href: typeof href === 'string' ? href.trim() : '' }))
    .filter(({ platform, href }) => platform && href)
    .reduce((acc, { platform, href }) => ({ ...acc, [platform]: href }), {});

  safe.contact = {
    ...defaultData.contact,
    ...contact,
    social: hasCandidateSocial ? sanitizedSocial : (Object.keys(sanitizedSocial).length ? sanitizedSocial : defaultData.contact.social),
  };
  return safe;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const diffSummary = (prev, next) => {
    const sections = ['name', 'role', 'heroTagline', 'avatar', 'newsletterUrl', 'newsletterReasons', 'cta', 'about', 'skills', 'experience', 'projects', 'certifications', 'contact', 'sectionVisibility', 'sectionCopy'];
    const sectionsChanged = sections.filter((key) => JSON.stringify(prev?.[key]) !== JSON.stringify(next?.[key]));
    const fieldDiffs = getObjectDifferences(prev || {}, next || {});
    return {
      sectionsChanged,
      totalChanges: fieldDiffs.length || sectionsChanged.length,
      fields: fieldDiffs.slice(0, 50),
    };
  };

  useEffect(() => {
    let active = true;
    const hydrate = async () => {
      try {
        const saved = await db.loadData();
        if (active) {
          setData(normalizeData(saved || defaultData));
        }
      } catch (error) {
        console.error('Error hydrating data store:', error);
        if (active) {
          setData(normalizeData(defaultData));
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    hydrate();
    return () => { active = false; };
  }, []);

  const persist = async (next) => {
    try {
      await db.saveData(next);
    } catch (err) {
      console.error('Persist error:', err);
    }
  };

  const updateData = (newData) => {
    const prev = data;
    const normalized = normalizeData(newData);
    setData(normalized);
    persist(normalized);
    addAuditEntry(AUDIT_EVENTS.DATA_UPDATED, diffSummary(prev, normalized));
  };

  const resetData = () => {
    const prev = data;
    setData(defaultData);
    persist(defaultData);
    db.resetData().catch((err) => console.error('Reset error:', err));
    addAuditEntry(AUDIT_EVENTS.DATA_RESET, diffSummary(prev, defaultData));
  };

  return (
    <DataContext.Provider value={{ data: data || defaultData, updateData, resetData, loading }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f1c] via-[#0c1324] to-[#0a1222]">
          <div className="text-white text-xl">Loading...</div>
        </div>
      ) : typeof children === 'function' ? children({ data: data || defaultData, updateData, resetData, loading }) : children}
    </DataContext.Provider>
  );
};
