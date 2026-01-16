import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { personalData as defaultData } from '../data';
import { useNavigate } from 'react-router-dom';
import { getAuditLogs, exportAuditData, createDataSnapshot, getSnapshots, AUDIT_EVENTS, addAuditEntry } from '../services/audit';
import { showToast } from '../utils/toast';
import AdminFeatures from './AdminFeatures';

const AdminPanel = ({ onLogout }) => {
  const { data, updateData, resetData } = useData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(data);
  const [activeTab, setActiveTab] = useState('personal');
  const [avatarPreview, setAvatarPreview] = useState(data.avatar || '');
  const [newSocial, setNewSocial] = useState({ platform: '', url: '' });
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditEventFilter, setAuditEventFilter] = useState('');
  const [snapshots, setSnapshots] = useState([]);
  const [snapshotLoading, setSnapshotLoading] = useState(false);

  const cloneValue = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)));

  useEffect(() => {
    const updatedData = { ...data };
    // Ensure stats array exists
    if (!updatedData.about.stats || !Array.isArray(updatedData.about.stats)) {
      updatedData.about.stats = [
        { label: "Years Experience", value: "2+" },
        { label: "Projects Completed", value: "10+" },
        { label: "Happy Clients", value: "5+" },
        { label: "Support", value: "24/7" }
      ];
    }
    setFormData(updatedData);
    setAvatarPreview(data.avatar || '');
    setNewSocial({ platform: '', url: '' });
  }, [data]);

  useEffect(() => {
    if (activeTab === 'audit') {
      loadSnapshots();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'audit') {
      loadAudit();
    }
  }, [auditEventFilter]);

  const handleChange = (e, section, field) => {
    const val = e.target.value;
    if (!section && field === 'newsletterReasons') {
      const lines = val.split('\n').map((p) => p.trim()).filter(Boolean);
      setFormData({
        ...formData,
        newsletterReasons: lines,
      });
      return;
    }
    if (section === 'about' && field === 'description') {
      setFormData({
        ...formData,
        about: {
          ...formData.about,
          description: val.split('\n').map((p) => p.trim()).filter(Boolean),
        },
      });
      return;
    }

    if (section) {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: val
        }
      });
    } else {
      setFormData({
        ...formData,
        [field]: val
      });
    }
  };

  const handleArrayChange = (e, index, section, field) => {
    const newArray = [...formData[section]];
    newArray[index] = { ...newArray[index], [field]: e.target.value };
    setFormData({ ...formData, [section]: newArray });
  };

  const handleNestedChange = (e, section, subSection, field) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [subSection]: {
          ...formData[section][subSection],
          [field]: e.target.value
        }
      }
    });
  };

  const handleSkillChange = (index, value) => {
    const skills = [...formData.skills];
    skills[index] = value;
    setFormData({ ...formData, skills });
  };

  const addSkill = () => setFormData({ ...formData, skills: [...formData.skills, ''] });

  const removeSkill = (index) => {
    const skills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills });
  };

  const updateStat = (index, field, value) => {
    const stats = Array.isArray(formData.about.stats) ? [...formData.about.stats] : [];
    stats[index] = { ...stats[index], [field]: value };
    setFormData({ ...formData, about: { ...formData.about, stats } });
  };

  const addStat = () => {
    setFormData({
      ...formData,
      about: { ...formData.about, stats: [...formData.about.stats, { label: '', value: '' }] }
    });
  };

  const removeStat = (index) => {
    const stats = formData.about.stats.filter((_, i) => i !== index);
    setFormData({ ...formData, about: { ...formData.about, stats } });
  };

  const updateSocial = (platform, url) => {
    setFormData({
      ...formData,
      contact: {
        ...formData.contact,
        social: { ...formData.contact.social, [platform]: url }
      }
    });
  };

  const removeSocial = (platform) => {
    const { [platform]: _, ...rest } = formData.contact.social || {};
    setFormData({
      ...formData,
      contact: {
        ...formData.contact,
        social: rest
      }
    });
  };

  const addSocial = () => {
    const platform = newSocial.platform.trim();
    const url = newSocial.url.trim();
    if (!platform || !url) return;
    updateSocial(platform, url);
    setNewSocial({ platform: '', url: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ensure stats are properly formatted
    const cleanedData = {
      ...formData,
      about: {
        ...formData.about,
        stats: formData.about.stats
          .map(stat => ({
            label: String(stat.label || '').trim(),
            value: String(stat.value || '').trim()
          }))
          .filter(stat => stat.label && stat.value)
      }
    };
    
    updateData(cleanedData);
    showToast.success('Portfolio updated successfully!');
    console.log('Updated stats:', cleanedData.about.stats);
  };

  const addExperience = () => {
    const newExperience = { title: '', company: '', period: '', description: '' };
    setFormData({ ...formData, experience: [...formData.experience, newExperience] });
  };

  const removeExperience = (index) => {
    const updated = formData.experience.filter((_, i) => i !== index);
    setFormData({ ...formData, experience: updated });
  };

  const addProject = () => {
    const newProject = { title: '', description: '', tech: [], link: '', image: '' };
    setFormData({ ...formData, projects: [...formData.projects, newProject] });
  };

  const removeProject = (index) => {
    const updated = formData.projects.filter((_, i) => i !== index);
    setFormData({ ...formData, projects: updated });
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setFormData({ ...formData, avatar: dataUrl });
      setAvatarPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const resetActiveSection = () => {
    switch (activeTab) {
      case 'personal':
        setFormData((prev) => ({
          ...prev,
          name: defaultData.name,
          role: defaultData.role,
          heroTagline: defaultData.heroTagline,
          avatar: defaultData.avatar,
          newsletterUrl: defaultData.newsletterUrl,
          newsletterReasons: cloneValue(defaultData.newsletterReasons),
          cta: cloneValue(defaultData.cta),
        }));
        setAvatarPreview(defaultData.avatar || '');
        break;
      case 'about':
        setFormData((prev) => ({
          ...prev,
          about: cloneValue(defaultData.about),
          skills: cloneValue(defaultData.skills),
        }));
        break;
      case 'experience':
        setFormData((prev) => ({ ...prev, experience: cloneValue(defaultData.experience) }));
        break;
      case 'projects':
        setFormData((prev) => ({ ...prev, projects: cloneValue(defaultData.projects) }));
        break;
      case 'certifications':
        setFormData((prev) => ({ ...prev, certifications: cloneValue(defaultData.certifications) }));
        break;
      case 'contact':
        setFormData((prev) => ({ ...prev, contact: cloneValue(defaultData.contact) }));
        setNewSocial({ platform: '', url: '' });
        break;
      case 'sections':
        setFormData((prev) => ({
          ...prev,
          sectionVisibility: cloneValue(defaultData.sectionVisibility),
          sectionCopy: cloneValue(defaultData.sectionCopy),
        }));
        break;
      default:
        break;
    }
  };

  const loadAudit = async () => {
    setAuditLoading(true);
    try {
      const logs = await getAuditLogs({ eventType: auditEventFilter || undefined, limit: 100 });
      setAuditLogs(logs);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    } finally {
      setAuditLoading(false);
    }
  };

  const handleExportAudit = async () => {
    try {
      const logs = await exportAuditData();
      const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'audit-logs.json';
      link.click();
      URL.revokeObjectURL(url);
      addAuditEntry(AUDIT_EVENTS.EXPORT, { summary: 'Exported audit logs', count: logs.length });
    } catch (err) {
      console.error('Export audit failed', err);
    }
  };

  const loadSnapshots = async () => {
    setSnapshotLoading(true);
    try {
      const snaps = await getSnapshots();
      setSnapshots(snaps);
    } catch (err) {
      console.error('Failed to load snapshots', err);
    } finally {
      setSnapshotLoading(false);
    }
  };

  const handleCreateSnapshot = async () => {
    try {
      await createDataSnapshot(data, 'Manual snapshot');
      await loadSnapshots();
      await loadAudit();
    } catch (err) {
      console.error('Snapshot failed', err);
    }
  };

  const handleRestoreSnapshot = async (snap) => {
    try {
      if (!snap?.details?.data) return;
      updateData(snap.details.data);
      addAuditEntry(AUDIT_EVENTS.RESTORE, { snapshotId: snap.id, summary: snap.details.description || 'Restored snapshot' });
      await loadAudit();
    } catch (err) {
      console.error('Restore failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-800">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-6 bg-gray-800 text-white">
          <h1 className="text-2xl font-bold">Portfolio Admin Panel</h1>
          <div className="flex gap-3">
            {onLogout && (
              <button 
                onClick={() => onLogout()}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
              >
                Logout
              </button>
            )}
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              View Portfolio
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-200 p-4 border-r border-gray-300">
            <nav className="space-y-2">
              {['personal', 'about', 'experience', 'projects', 'certifications', 'contact', 'features', 'sections', 'audit'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-4 py-2 rounded capitalize ${
                    activeTab === tab ? 'bg-blue-600 text-white' : 'hover:bg-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-8">
            <form onSubmit={handleSubmit}>
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b pb-2">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange(e, null, 'name')}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Role</label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => handleChange(e, null, 'role')}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Availability Badge</label>
                      <input
                        type="text"
                        value={formData.availability || ''}
                        onChange={(e) => handleChange(e, null, 'availability')}
                        className="w-full p-2 border rounded"
                        placeholder="Available for remote collaborations"
                      />
                      <p className="text-xs text-gray-500 mt-1">Shown as a badge at the top of the hero section</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Hero Tagline</label>
                      <textarea
                        value={formData.heroTagline || ''}
                        onChange={(e) => handleChange(e, null, 'heroTagline')}
                        className="w-full p-2 border rounded h-20"
                        placeholder="Short intro line shown under your name"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">LinkedIn Newsletter URL</label>
                      <input
                        type="text"
                        value={formData.newsletterUrl || ''}
                        onChange={(e) => handleChange(e, null, 'newsletterUrl')}
                        className="w-full p-2 border rounded"
                        placeholder="https://www.linkedin.com/newsletters/..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Newsletter Reasons (one per line)</label>
                      <textarea
                        value={(formData.newsletterReasons || []).join('\n')}
                        onChange={(e) => handleChange(e, null, 'newsletterReasons')}
                        className="w-full p-2 border rounded h-28"
                        placeholder={`Why subscribe...\nCase studies...\nEarly looks...`}
                      />
                      <p className="mt-1 text-xs text-gray-500">Leave empty to hide the reasons block.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Profile Image URL</label>
                      <input
                        type="text"
                        value={formData.avatar || ''}
                        onChange={(e) => handleChange(e, null, 'avatar')}
                        className="w-full p-2 border rounded"
                        placeholder="https://.../your-photo.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Upload Profile Image (stored locally)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFile}
                        className="w-full p-2 border rounded"
                      />
                      {avatarPreview && (
                        <img
                          src={avatarPreview}
                          alt="Profile preview"
                          className="mt-3 w-24 h-24 object-cover rounded-full border"
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Primary Button Label</label>
                      <input
                        type="text"
                        value={formData.cta?.primaryLabel || ''}
                        onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, primaryLabel: e.target.value } })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Primary Button Link</label>
                      <input
                        type="text"
                        value={formData.cta?.primaryHref || ''}
                        onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, primaryHref: e.target.value } })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Secondary Button Label</label>
                      <input
                        type="text"
                        value={formData.cta?.secondaryLabel || ''}
                        onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, secondaryLabel: e.target.value } })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Secondary Button Link</label>
                      <input
                        type="text"
                        value={formData.cta?.secondaryHref || ''}
                        onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, secondaryHref: e.target.value } })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Resume Button Label</label>
                      <input
                        type="text"
                        value={formData.cta?.resumeLabel || ''}
                        onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, resumeLabel: e.target.value } })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Resume Button Link</label>
                      <input
                        type="text"
                        value={formData.cta?.resumeHref || ''}
                        onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, resumeHref: e.target.value } })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, cta: {} })}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
                    >
                      Clear CTA Buttons
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, cta: data.cta })}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
                    >
                      Revert CTA to Current
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <AdminFeatures formData={formData} setFormData={setFormData} />
              )}

              {activeTab === 'sections' && (
                <div className="space-y-8">
                  <h2 className="text-xl font-bold border-b pb-2">Sections</h2>

                  {['experience', 'certifications', 'projects', 'blog', 'contact'].map((sectionKey) => (
                    <div key={sectionKey} className="p-4 border rounded bg-gray-50 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold capitalize">{sectionKey}</h3>
                          <p className="text-sm text-gray-600">Control visibility and headings</p>
                        </div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <input
                            type="checkbox"
                            checked={!!formData.sectionVisibility?.[sectionKey]}
                            onChange={(e) => setFormData({
                              ...formData,
                              sectionVisibility: {
                                ...formData.sectionVisibility,
                                [sectionKey]: e.target.checked
                              }
                            })}
                          />
                          Show section
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Eyebrow</label>
                          <input
                            type="text"
                            value={formData.sectionCopy?.[sectionKey]?.eyebrow || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              sectionCopy: {
                                ...formData.sectionCopy,
                                [sectionKey]: {
                                  ...formData.sectionCopy?.[sectionKey],
                                  eyebrow: e.target.value
                                }
                              }
                            })}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Title</label>
                          <input
                            type="text"
                            value={formData.sectionCopy?.[sectionKey]?.title || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              sectionCopy: {
                                ...formData.sectionCopy,
                                [sectionKey]: {
                                  ...formData.sectionCopy?.[sectionKey],
                                  title: e.target.value
                                }
                              }
                            })}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Subtitle</label>
                          <input
                            type="text"
                            value={formData.sectionCopy?.[sectionKey]?.subtitle || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              sectionCopy: {
                                ...formData.sectionCopy,
                                [sectionKey]: {
                                  ...formData.sectionCopy?.[sectionKey],
                                  subtitle: e.target.value
                                }
                              }
                            })}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'about' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b pb-2">About Section</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description (one paragraph per line)</label>
                    <textarea
                      value={Array.isArray(formData.about.description) ? formData.about.description.join('\n') : formData.about.description}
                      onChange={(e) => handleChange(e, 'about', 'description')}
                      className="w-full p-2 border rounded h-32"
                    />
                  </div>
                  
                  <h3 className="font-bold mt-4">Skills</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => handleSkillChange(index, e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addSkill}
                    className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    Add Skill
                  </button>

                  <h3 className="font-bold mt-8">Stats</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.about.stats.map((stat, index) => (
                      <div key={index} className="p-3 border rounded bg-gray-50 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-700">Stat {index + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeStat(index)}
                            className="text-sm text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => updateStat(index, 'label', e.target.value)}
                          className="w-full p-2 border rounded"
                          placeholder="Label"
                        />
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => updateStat(index, 'value', e.target.value)}
                          className="w-full p-2 border rounded"
                          placeholder="Value"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addStat}
                    className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    Add Stat
                  </button>
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="space-y-8">
                  <h2 className="text-xl font-bold border-b pb-2">Experience</h2>
                  {formData.experience.map((exp, index) => (
                    <div key={index} className="p-4 border rounded bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-semibold text-gray-700">Role {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleArrayChange(e, index, 'experience', 'company')}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Role / Title</label>
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => handleArrayChange(e, index, 'experience', 'title')}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Period</label>
                          <input
                            type="text"
                            value={exp.period}
                            onChange={(e) => handleArrayChange(e, index, 'experience', 'period')}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => handleArrayChange(e, index, 'experience', 'description')}
                          className="w-full p-2 border rounded h-24"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addExperience}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    Add Experience
                  </button>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-8">
                  <h2 className="text-xl font-bold border-b pb-2">Projects</h2>
                  {formData.projects.map((project, index) => (
                    <div key={index} className="p-4 border rounded bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-semibold text-gray-700">Project {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeProject(index)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Title</label>
                          <input
                            type="text"
                            value={project.title}
                            onChange={(e) => handleArrayChange(e, index, 'projects', 'title')}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Link</label>
                          <input
                            type="text"
                            value={project.link}
                            onChange={(e) => handleArrayChange(e, index, 'projects', 'link')}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Image URL</label>
                        <input
                          type="text"
                          value={project.image || ''}
                          onChange={(e) => handleArrayChange(e, index, 'projects', 'image')}
                          className="w-full p-2 border rounded"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          value={project.description}
                          onChange={(e) => handleArrayChange(e, index, 'projects', 'description')}
                          className="w-full p-2 border rounded h-24"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Technologies (comma separated)</label>
                        <input
                          type="text"
                          value={project.tech.join(', ')}
                          onChange={(e) => {
                            const newProjects = [...formData.projects];
                            newProjects[index] = { 
                              ...newProjects[index], 
                              tech: e.target.value.split(',').map(t => t.trim()) 
                            };
                            setFormData({ ...formData, projects: newProjects });
                          }}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addProject}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    Add Project
                  </button>
                </div>
              )}

              {activeTab === 'certifications' && (
                <div className="space-y-8">
                  <h2 className="text-xl font-bold border-b pb-2">Certifications</h2>
                  {formData.certifications.map((cert, index) => (
                    <div key={index} className="p-4 border rounded bg-gray-50 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700">Certification {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.certifications.filter((_, i) => i !== index);
                            setFormData({ ...formData, certifications: updated });
                          }}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Name</label>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => {
                              const next = [...formData.certifications];
                              next[index] = { ...next[index], name: e.target.value };
                              setFormData({ ...formData, certifications: next });
                            }}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Organization</label>
                          <input
                            type="text"
                            value={cert.organization}
                            onChange={(e) => {
                              const next = [...formData.certifications];
                              next[index] = { ...next[index], organization: e.target.value };
                              setFormData({ ...formData, certifications: next });
                            }}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Issue Month</label>
                          <input
                            type="text"
                            value={cert.issueMonth}
                            onChange={(e) => {
                              const next = [...formData.certifications];
                              next[index] = { ...next[index], issueMonth: e.target.value };
                              setFormData({ ...formData, certifications: next });
                            }}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Issue Year</label>
                          <input
                            type="text"
                            value={cert.issueYear}
                            onChange={(e) => {
                              const next = [...formData.certifications];
                              next[index] = { ...next[index], issueYear: e.target.value };
                              setFormData({ ...formData, certifications: next });
                            }}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Expiration Month</label>
                          <input
                            type="text"
                            value={cert.expirationMonth}
                            onChange={(e) => {
                              const next = [...formData.certifications];
                              next[index] = { ...next[index], expirationMonth: e.target.value };
                              setFormData({ ...formData, certifications: next });
                            }}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Expiration Year</label>
                          <input
                            type="text"
                            value={cert.expirationYear}
                            onChange={(e) => {
                              const next = [...formData.certifications];
                              next[index] = { ...next[index], expirationYear: e.target.value };
                              setFormData({ ...formData, certifications: next });
                            }}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Credential ID</label>
                          <input
                            type="text"
                            value={cert.credentialId}
                            onChange={(e) => {
                              const next = [...formData.certifications];
                              next[index] = { ...next[index], credentialId: e.target.value };
                              setFormData({ ...formData, certifications: next });
                            }}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Credential URL</label>
                          <input
                            type="text"
                            value={cert.credentialUrl}
                            onChange={(e) => {
                              const next = [...formData.certifications];
                              next[index] = { ...next[index], credentialUrl: e.target.value };
                              setFormData({ ...formData, certifications: next });
                            }}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, certifications: [...formData.certifications, { name: '', organization: '', issueMonth: '', issueYear: '', expirationMonth: '', expirationYear: '', credentialId: '', credentialUrl: '' }] })}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    Add Certification
                  </button>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b pb-2">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="text"
                        value={formData.contact.email}
                        onChange={(e) => handleChange(e, 'contact', 'email')}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Location</label>
                      <input
                        type="text"
                        value={formData.contact.location}
                        onChange={(e) => handleChange(e, 'contact', 'location')}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  
                  <h3 className="font-bold mt-4">Social Links</h3>
                  <div className="space-y-3">
                    {Object.entries(formData.contact.social).map(([platform, link]) => (
                      <div key={platform} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                        <div className="md:col-span-1">
                          <label className="block text-sm font-medium mb-1 capitalize">{platform}</label>
                        </div>
                        <div className="md:col-span-2 flex gap-2 items-center">
                          <input
                            type="text"
                            value={link}
                            onChange={(e) => updateSocial(platform, e.target.value)}
                            className="w-full p-2 border rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeSocial(platform)}
                            className="text-sm text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-4 border rounded bg-gray-50 space-y-3">
                    <h4 className="font-semibold text-gray-700">Add Social Link</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                      <input
                        type="text"
                        placeholder="platform (e.g., dribbble)"
                        value={newSocial.platform}
                        onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                      <input
                        type="text"
                        placeholder="https://..."
                        value={newSocial.url}
                        onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                      <button
                        type="button"
                        onClick={addSocial}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'audit' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold border-b pb-2">Audit Logs</h2>
                    <div className="flex gap-3">
                      <select
                        value={auditEventFilter}
                        onChange={(e) => setAuditEventFilter(e.target.value)}
                        className="p-2 border rounded"
                      >
                        <option value="">All Events</option>
                        {Object.values(AUDIT_EVENTS).map((evt) => (
                          <option key={evt} value={evt}>{evt}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={loadAudit}
                        disabled={auditLoading}
                        className={`px-4 py-2 text-white rounded ${auditLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                      >
                        Refresh
                      </button>
                      <button
                        type="button"
                        onClick={handleExportAudit}
                        disabled={auditLoading}
                        className={`px-4 py-2 border border-gray-300 text-gray-700 rounded ${auditLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                      >
                        Export JSON
                      </button>
                    </div>
                  </div>

                  <div className="border rounded p-4 bg-gray-50">
                    {auditLoading ? (
                      <p>Loading audit logs...</p>
                    ) : auditLogs.length === 0 ? (
                      <p className="text-gray-600">No audit events yet.</p>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-auto">
                        {auditLogs.map((log) => (
                          <div key={log.id} className="p-3 border rounded bg-white">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span className="font-semibold text-gray-800">{log.eventType}</span>
                              <span>{new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="text-sm text-gray-700 mt-1">User: {log.user}</div>
                            {log.details?.summary && (
                              <div className="text-sm text-gray-700">Summary: {log.details.summary}</div>
                            )}
                            {Array.isArray(log.details?.sectionsChanged) && log.details.sectionsChanged.length > 0 && (
                              <div className="text-xs text-gray-600">Sections: {log.details.sectionsChanged.join(', ')}</div>
                            )}
                            {typeof log.details?.totalChanges === 'number' && (
                              <div className="text-xs text-gray-600">Changes: {log.details.totalChanges}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Snapshots</h3>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleCreateSnapshot}
                        disabled={snapshotLoading}
                        className={`px-4 py-2 text-white rounded ${snapshotLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                      >
                        Create Snapshot
                      </button>
                      <button
                        type="button"
                        onClick={loadSnapshots}
                        disabled={snapshotLoading}
                        className={`px-4 py-2 border border-gray-300 text-gray-700 rounded ${snapshotLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                      >
                        Refresh
                      </button>
                    </div>
                  </div>

                  <div className="border rounded p-4 bg-gray-50">
                    {snapshotLoading ? (
                      <p>Loading snapshots...</p>
                    ) : snapshots.length === 0 ? (
                      <p className="text-gray-600">No snapshots yet.</p>
                    ) : (
                      <div className="space-y-3 max-h-64 overflow-auto">
                        {snapshots.map((snap) => (
                          <div key={snap.id} className="p-3 border rounded bg-white">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span className="font-semibold text-gray-800">{snap.details?.description || 'Snapshot'}</span>
                              <span>{new Date(snap.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="text-xs text-gray-600">ID: {snap.id}</div>
                            <div className="mt-2 flex gap-3">
                              <button
                                type="button"
                                onClick={() => handleRestoreSnapshot(snap)}
                                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                              >
                                Restore
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={resetActiveSection}
                    className="px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded shadow-sm hover:bg-gray-100"
                  >
                    Reset This Section
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetData();
                    }}
                    className="px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded shadow-sm hover:bg-gray-100"
                  >
                    Reset to Defaults
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded shadow transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;