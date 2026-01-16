import React, { useState, useEffect } from 'react';
import { showToast } from '../utils/toast';
import { getContactSubmissions, getAnalytics } from '../services/supabase';

const AdminFeatures = ({ formData, setFormData }) => {
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const loadContactSubmissions = async () => {
    setLoadingSubmissions(true);
    const result = await getContactSubmissions();
    if (result.success) {
      setContactSubmissions(result.data);
      showToast.success('Contact submissions loaded');
    } else {
      showToast.error('Failed to load submissions');
    }
    setLoadingSubmissions(false);
  };

  const loadAnalyticsData = async () => {
    setLoadingAnalytics(true);
    const result = await getAnalytics(30);
    if (result.success) {
      setAnalytics(result.data);
      showToast.success('Analytics loaded');
    } else {
      showToast.error('Failed to load analytics');
    }
    setLoadingAnalytics(false);
  };

  // Theme Settings
  const updateTheme = (field, value) => {
    setFormData(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [field]: value
      }
    }));
  };

  const updateThemeAnimation = (field, value) => {
    setFormData(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        animations: {
          ...prev.theme.animations,
          [field]: value
        }
      }
    }));
  };

  // Blog Management
  const addBlogPost = () => {
    const newPost = {
      id: Date.now().toString(),
      title: 'New Article',
      excerpt: '',
      content: '',
      author: formData.name,
      date: new Date().toISOString().split('T')[0],
      tags: [],
      published: false,
      image: ''
    };
    setFormData(prev => ({
      ...prev,
      blog: [...(prev.blog || []), newPost]
    }));
  };

  const updateBlogPost = (index, field, value) => {
    setFormData(prev => {
      const blog = [...(prev.blog || [])];
      blog[index] = { ...blog[index], [field]: value };
      return { ...prev, blog };
    });
  };

  const updateBlogTags = (index, tagsString) => {
    const tags = tagsString.split(',').map(t => t.trim()).filter(Boolean);
    updateBlogPost(index, 'tags', tags);
  };

  const removeBlogPost = (index) => {
    setFormData(prev => ({
      ...prev,
      blog: prev.blog.filter((_, i) => i !== index)
    }));
  };

  // Contact Form Settings
  const updateContactForm = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contactForm: {
        ...prev.contactForm,
        [field]: value
      }
    }));
  };

  // Project Image Management
  const updateProjectImage = (index, image) => {
    setFormData(prev => {
      const projects = [...prev.projects];
      projects[index] = { ...projects[index], image };
      return { ...prev, projects };
    });
  };

  return (
    <div className="space-y-8">
      {/* Theme Settings */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
          <span className="text-2xl">🎨</span>
          Theme & UI Settings
        </h3>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.theme?.allowUserToggle || false}
                onChange={(e) => updateTheme('allowUserToggle', e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-gray-800">Allow users to toggle theme</span>
            </label>
            <p className="text-xs text-gray-600 mt-2 ml-8">Users can switch between dark and light modes</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.theme?.smoothScroll || false}
                onChange={(e) => updateTheme('smoothScroll', e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-gray-800">Enable smooth scrolling</span>
            </label>
            <p className="text-xs text-gray-600 mt-2 ml-8">Smooth scroll behavior for navigation links</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-blue-100">
            <label className="block text-sm font-bold text-gray-800 mb-3">Animation Settings</label>
            <div className="space-y-3 pl-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.theme?.animations?.enabled || false}
                  onChange={(e) => updateThemeAnimation('enabled', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-gray-800">Enable animations</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.theme?.animations?.fadeIn || false}
                  onChange={(e) => updateThemeAnimation('fadeIn', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-gray-800">Fade-in on scroll</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Management */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            Blog Articles
          </h3>
          <button
            onClick={addBlogPost}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            + Add Article
          </button>
        </div>

        <div className="space-y-6">
          {(formData.blog || []).map((post, index) => (
            <div key={post.id} className="bg-white border-2 border-purple-100 rounded-xl p-5 space-y-4 shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">#{index + 1}</span>
                  Article
                </h4>
                <div className="flex items-center gap-3">
                  <label className="flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={post.published || false}
                      onChange={(e) => updateBlogPost(index, 'published', e.target.checked)}
                      className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-sm font-semibold text-green-800">Published</span>
                  </label>
                  <button
                    onClick={() => removeBlogPost(index)}
                    className="px-4 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 font-semibold shadow-sm hover:shadow-md transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <input
                type="text"
                value={post.title}
                onChange={(e) => updateBlogPost(index, 'title', e.target.value)}
                placeholder="Article Title"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-gray-900 font-semibold"
              />

              <input
                type="text"
                value={post.image || ''}
                onChange={(e) => updateBlogPost(index, 'image', e.target.value)}
                placeholder="Image URL (https://...)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-gray-700"
              />

              <textarea
                value={post.excerpt}
                onChange={(e) => updateBlogPost(index, 'excerpt', e.target.value)}
                placeholder="Short excerpt (displayed on cards)..."
                rows="2"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-gray-700"
              />

              <textarea
                value={post.content}
                onChange={(e) => updateBlogPost(index, 'content', e.target.value)}
                placeholder="Full article content (displayed in modal)..."
                rows="6"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-gray-700 font-mono text-sm"
              />

              <input
                type="text"
                value={(post.tags || []).join(', ')}
                onChange={(e) => updateBlogTags(index, e.target.value)}
                placeholder="Tags (comma-separated: React, JavaScript, Tutorial)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-gray-700"
              />

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Date</label>
                  <input
                    type="date"
                    value={post.date}
                    onChange={(e) => updateBlogPost(index, 'date', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-gray-700"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Author</label>
                  <input
                    type="text"
                    value={post.author}
                    onChange={(e) => updateBlogPost(index, 'author', e.target.value)}
                    placeholder="Author Name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-gray-700"
                  />
                </div>
              </div>
            </div>
          ))}
          {(formData.blog || []).length === 0 && (
            <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-purple-200">
              <p className="text-gray-500 text-sm">No articles yet. Click "+ Add Article" to create your first blog post!</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Form Settings */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
          <span className="text-2xl">📧</span>
          Contact Form Settings
        </h3>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-green-100">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.contactForm?.enabled || false}
                onChange={(e) => updateContactForm('enabled', e.target.checked)}
                className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
              />
              <span className="text-sm font-bold text-gray-800">Enable contact form</span>
            </label>
            <p className="text-xs text-gray-600 mt-2 ml-8">Allow visitors to send messages through the contact form</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-green-100">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.contactForm?.saveToSupabase || false}
                onChange={(e) => updateContactForm('saveToSupabase', e.target.checked)}
                className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
              />
              <span className="text-sm font-bold text-gray-800">Save submissions to Supabase</span>
            </label>
            <p className="text-xs text-gray-600 mt-2 ml-8">Store all form submissions in your database</p>
          </div>

          <div className="pt-4">
            <button
              onClick={loadContactSubmissions}
              disabled={loadingSubmissions}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loadingSubmissions ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                '📬 View All Submissions'
              )}
            </button>
          </div>

          {contactSubmissions.length > 0 && (
            <div className="mt-4 space-y-3 max-h-96 overflow-y-auto bg-white p-4 rounded-lg border-2 border-green-100">
              <h4 className="font-bold text-gray-900 mb-3 sticky top-0 bg-white pb-2 border-b border-green-200">
                Recent Submissions ({contactSubmissions.length})
              </h4>
              {contactSubmissions.map((sub, idx) => (
                <div key={idx} className="border border-green-100 rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-green-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-gray-900">{sub.name}</div>
                    <span className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded-full">
                      {new Date(sub.submitted_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-blue-600 mb-2">{sub.email}</div>
                  <div className="text-sm text-gray-700 bg-white p-3 rounded border border-green-100">{sub.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Analytics (Last 30 Days)
          </h3>
          <button
            onClick={loadAnalyticsData}
            disabled={loadingAnalytics}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loadingAnalytics ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              '🔄 Refresh Analytics'
            )}
          </button>
        </div>

        {analytics ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">👁️</span>
                <svg className="w-8 h-8 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="text-4xl font-bold mb-1">{analytics.pageViews}</div>
              <div className="text-sm font-semibold text-blue-100">Page Views</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">🎯</span>
                <svg className="w-8 h-8 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="text-4xl font-bold mb-1">{analytics.projectClicks}</div>
              <div className="text-sm font-semibold text-green-100">Project Clicks</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">⚡</span>
                <svg className="w-8 h-8 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="text-4xl font-bold mb-1">{analytics.total}</div>
              <div className="text-sm font-semibold text-purple-100">Total Events</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-indigo-200">
            <span className="text-6xl mb-4 block">📊</span>
            <p className="text-gray-600 font-semibold mb-2">No analytics data loaded</p>
            <p className="text-gray-500 text-sm">Click "Refresh Analytics" to view your stats</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeatures;
