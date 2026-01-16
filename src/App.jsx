import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { DataProvider, useData } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Certifications from './components/Certifications';
import Projects from './components/Projects';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import { addAuditEntry, AUDIT_EVENTS } from './services/audit';
import { trackPageView } from './services/supabase';
import { enableSmoothScroll } from './utils/animations';

const Portfolio = () => {
  const { data } = useData();
  
  useEffect(() => {
    // Enable smooth scrolling if configured
    if (data?.theme?.smoothScroll) {
      enableSmoothScroll();
    }
    
    // Track page view
    trackPageView('home');
  }, [data]);

  return (
    <div className="font-sans bg-white dark:bg-[#0a0f1c] text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
      <Header />
      <main>
        <Hero />
        <About />
        <Experience />
        <Certifications />
        <Projects />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  const ADMIN_PASSWORD = 'admin123';
  const [isAuthed, setIsAuthed] = useState(() => localStorage.getItem('adminAuthed') === 'true');

  useEffect(() => {
    localStorage.setItem('adminAuthed', String(isAuthed));
  }, [isAuthed]);

  const handleLogin = (password) => {
    const ok = password === ADMIN_PASSWORD;
    setIsAuthed(ok);
    addAuditEntry(ok ? AUDIT_EVENTS.LOGIN : AUDIT_EVENTS.ERROR, {
      summary: ok ? 'Admin login success' : 'Admin login failed',
    });
    return ok;
  };

  const handleLogout = () => {
    setIsAuthed(false);
    addAuditEntry(AUDIT_EVENTS.LOGOUT, { summary: 'Admin logged out' });
  };

  return (
    <DataProvider>
      {({ data }) => (
        <ThemeProvider themeConfig={data?.theme}>
          <Router>
            <Toaster />
            <Routes>
              <Route path="/" element={<Portfolio />} />
              <Route 
                path="/admin" 
                element={isAuthed ? <AdminPanel onLogout={handleLogout} /> : <AdminLogin onLogin={handleLogin} />} 
              />
            </Routes>
          </Router>
        </ThemeProvider>
      )}
    </DataProvider>
  );
}

export default App;
