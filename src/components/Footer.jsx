import React from 'react';
import { useData } from '../context/DataContext';

const Footer = () => {
  const { data } = useData();
  const newsletterUrl = data.newsletterUrl || '';
  const visibility = data.sectionVisibility || {};
  
  return (
    <footer className="bg-[#0a0f1c] text-gray-300 py-12 border-t border-white/10">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-6">
          <a href="/#hero" className="text-2xl font-heading font-bold text-white tracking-widest uppercase hover:text-gray-200 transition-colors">
            {data.name.split(' ').map(n => n[0]).join('')}<span className="text-gray-400">.</span>
          </a>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {visibility.about !== false && (
            <a href="/#about" className="text-sm uppercase tracking-wider hover:text-white transition-colors">About</a>
          )}
          {visibility.experience !== false && (
            <a href="/#experience" className="text-sm uppercase tracking-wider hover:text-white transition-colors">Experience</a>
          )}
          {visibility.projects !== false && (
            <a href="/#projects" className="text-sm uppercase tracking-wider hover:text-white transition-colors">Projects</a>
          )}
          {visibility.contact !== false && (
            <a href="/#contact" className="text-sm uppercase tracking-wider hover:text-white transition-colors">Contact</a>
          )}
          {newsletterUrl && (
            <a
              href={newsletterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm uppercase tracking-wider hover:text-white transition-colors"
            >
              Subscribe
            </a>
          )}
        </div>
        
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} {data.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
