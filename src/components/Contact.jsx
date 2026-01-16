import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { fadeInUp } from '../utils/animations';
import { saveContactSubmission } from '../services/supabase';
import { showToast } from '../utils/toast';

const Contact = () => {
  const { data } = useData();
  if (!data.sectionVisibility?.contact) return null;

  const copy = data.sectionCopy?.contact || {};
  const newsletterUrl = data.newsletterUrl || '';
  const contactFormConfig = data.contactForm || {};
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.message) {
      showToast.error('Please fill in all fields before sending.');
      return;
    }

    if (!contactFormConfig.enabled) {
      showToast.error('Contact form is currently disabled.');
      return;
    }

    setIsSubmitting(true);

    if (contactFormConfig.saveToSupabase) {
      const result = await saveContactSubmission(form);
      
      if (result.success) {
        showToast.success('Thanks! Your message has been sent. I will get back to you soon.');
        setForm({ name: '', email: '', message: '' });
      } else {
        showToast.error('Failed to send message. Please try emailing directly.');
      }
    } else {
      // Fallback: just show success message without saving
      showToast.success('Thanks! Your message is noted. I will get back soon.');
      setForm({ name: '', email: '', message: '' });
    }

    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-[#0c1020] via-[#0b1324] to-[#0b1528] text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16 space-y-3"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="inline-flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-full text-xs uppercase tracking-[0.3em]">{copy.eyebrow}</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight">{copy.title}</h2>
            <p className="text-gray-100 max-w-2xl mx-auto">{copy.subtitle}</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white/10 rounded border border-white/20 text-white shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Email</h3>
                  <a href={`mailto:${data.contact.email}`} className="text-white hover:text-gray-200 transition-colors">
                    {data.contact.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white/10 rounded border border-white/20 text-white shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Location</h3>
                  <p className="text-white">{data.contact.location}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white/10 rounded border border-white/20 text-white shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Social</h3>
                  <div className="flex space-x-4 mt-2">
                    {Object.entries(data.contact.social).map(([platform, link]) => (
                      <a key={platform} href={link} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 transition-colors capitalize">
                        {platform}
                      </a>
                    ))}
                    {newsletterUrl && (
                      <a
                        href={newsletterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-gray-200 transition-colors"
                      >
                        Subscribe Newsletter
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-white/50 transition-colors"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-white/50 transition-colors"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Message</label>
                <textarea 
                  id="message" 
                  rows="4" 
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-white/50 transition-colors"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Your message..."
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full px-8 py-4 bg-white text-black font-bold uppercase tracking-wider rounded-lg shadow hover:-translate-y-1 transition-all duration-300 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
