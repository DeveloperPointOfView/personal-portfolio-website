import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Save contact form submission
export const saveContactSubmission = async (formData) => {
  if (!supabase) {
    console.warn('[Contact] Supabase not configured');
    return { success: false, error: 'Database not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          submitted_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;

    console.log('[Contact] Submission saved:', data);
    return { success: true, data };
  } catch (error) {
    console.error('[Contact] Save error:', error);
    return { success: false, error: error.message };
  }
};

// Get all contact submissions (admin only)
export const getContactSubmissions = async () => {
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('[Contact] Fetch error:', error);
    return { success: false, error: error.message };
  }
};

// Track page view analytics
export const trackPageView = async (page) => {
  if (!supabase) return;

  try {
    await supabase.from('analytics').insert([
      {
        event_type: 'page_view',
        page,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent
      }
    ]);
  } catch (error) {
    console.error('[Analytics] Track error:', error);
  }
};

// Track project click
export const trackProjectClick = async (projectTitle) => {
  if (!supabase) return;

  try {
    await supabase.from('analytics').insert([
      {
        event_type: 'project_click',
        data: { project: projectTitle },
        timestamp: new Date().toISOString()
      }
    ]);
  } catch (error) {
    console.error('[Analytics] Track error:', error);
  }
};

// Get analytics data
export const getAnalytics = async (days = 30) => {
  if (!supabase) return { success: false, error: 'Database not configured' };

  try {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .gte('timestamp', fromDate.toISOString())
      .order('timestamp', { ascending: false });

    if (error) throw error;

    // Aggregate data
    const pageViews = data.filter(d => d.event_type === 'page_view').length;
    const projectClicks = data.filter(d => d.event_type === 'project_click').length;

    return {
      success: true,
      data: {
        total: data.length,
        pageViews,
        projectClicks,
        raw: data
      }
    };
  } catch (error) {
    console.error('[Analytics] Fetch error:', error);
    return { success: false, error: error.message };
  }
};
