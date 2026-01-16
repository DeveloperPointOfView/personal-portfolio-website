import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const Header = () => {
  const { data } = useData();
  const { theme, toggleTheme, allowToggle } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const visibility = data.sectionVisibility || {};
  const navLinks = [
    { name: 'About', href: '/#about', key: 'about' },
    { name: 'Experience', href: '/#experience', key: 'experience' },
    { name: 'Certifications', href: '/#certifications', key: 'certifications' },
    { name: 'Projects', href: '/#projects', key: 'projects' },
    { name: 'Contact', href: '/#contact', key: 'contact' },
  ].filter((link) => visibility[link.key] !== false);

  // Get initials from name
  const initials = data.name.split(' ').map(n => n[0]).join('');

  return (
    <header className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-gradient-to-r from-[#0a1222]/90 to-[#0c152c]/90 backdrop-blur-md py-4 shadow-lg border-b border-white/10' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="/#hero" className="text-2xl font-heading font-bold text-white tracking-widest uppercase hover:text-gray-300 transition-colors">
          {initials}<span className="text-gray-500">.</span>
        </a>
        
        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium text-gray-200 hover:text-white tracking-wider uppercase transition duration-300 relative group">
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          {allowToggle && (
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-white/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 backdrop-blur-sm"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <FiSun className="w-5 h-5 text-yellow-300" />
              ) : (
                <FiMoon className="w-5 h-5 text-blue-300" />
              )}
            </button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0a1222] border-t border-white/10 absolute w-full shadow-2xl">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="block px-8 py-4 text-gray-200 hover:bg-white/5 hover:text-white uppercase text-sm tracking-wider"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
          {allowToggle && (
            <div className="px-8 py-4 border-t border-white/10">
              <button
                onClick={() => {
                  toggleTheme();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-white/30 transition-all duration-300"
              >
                <span className="text-gray-200 uppercase text-sm tracking-wider">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
                {theme === 'dark' ? (
                  <FiSun className="w-5 h-5 text-yellow-300" />
                ) : (
                  <FiMoon className="w-5 h-5 text-blue-300" />
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
