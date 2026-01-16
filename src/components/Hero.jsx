import React from 'react';
import { useData } from '../context/DataContext';

const Hero = () => {
  const { data } = useData();
  const avatarSrc = data.avatar || 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=600&q=80';
  const availability = data.availability || 'Available for remote collaborations';
  const newsletterUrl = data.newsletterUrl || '';
  const newsletterReasons = Array.isArray(data.newsletterReasons)
    ? data.newsletterReasons.filter((item) => typeof item === 'string' && item.trim()).map((item) => item.trim())
    : [];
  const cta = data.cta || {};
  const primaryLabel = cta.primaryLabel || 'View Work';
  const primaryHref = cta.primaryHref || '/#projects';
  const secondaryLabel = cta.secondaryLabel || 'Contact Me';
  const secondaryHref = cta.secondaryHref || '/#contact';
  const resumeLabel = cta.resumeLabel || 'Resume / LinkedIn';
  const resumeHref = cta.resumeHref || 'https://www.linkedin.com';
  const heroTagline = data.heroTagline || 'Crafting immersive digital experiences with a balance of clean code, thoughtful UX, and performance-first engineering.';
  
  return (
    <section id="hero" className="relative min-h-screen flex items-center bg-gradient-to-br from-[#0a0f1c] via-[#0c1324] to-[#0a1222] overflow-hidden text-white">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#1e293b] rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
        <div className="absolute -top-10 right-0 w-96 h-96 bg-[#0ea5e9] rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-10 w-96 h-96 bg-[#f59e0b] rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs uppercase tracking-[0.3em] text-gray-200">
              {availability}
            </span>
            <div className="space-y-4">
              <p className="text-gray-300 text-lg">Hello, I am</p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#38bdf8] to-[#fbbf24]">
                  {data.name}
                </span>
              </h1>
              <h2 className="text-xl md:text-2xl text-gray-300 font-light tracking-wide uppercase">{data.role}</h2>
              <p className="text-gray-300 max-w-2xl leading-relaxed">
                {heroTagline}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={primaryHref} 
                className="px-8 py-4 bg-white text-black font-semibold uppercase tracking-wider rounded-lg shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {primaryLabel}
              </a>
              <a 
                href={secondaryHref} 
                className="px-8 py-4 border border-white/40 text-white font-semibold uppercase tracking-wider rounded-lg hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                {secondaryLabel}
              </a>
              <a 
                href={resumeHref} 
                target="_blank" 
                rel="noreferrer" 
                className="px-8 py-4 bg-gradient-to-r from-[#38bdf8] to-[#fbbf24] text-black font-semibold uppercase tracking-wider rounded-lg shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {resumeLabel}
              </a>
              {newsletterUrl && (
                <a
                  href={newsletterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white/10 border border-white/30 text-white font-semibold uppercase tracking-wider rounded-lg hover:bg-white/20 hover:-translate-y-1 transition-all duration-300"
                >
                  Subscribe Newsletter
                </a>
              )}
            </div>

            {newsletterUrl && newsletterReasons.length > 0 && (
              <div className="mt-3 text-sm text-gray-300 space-y-1">
                <div className="font-semibold uppercase tracking-[0.2em] text-white/80">Why subscribe</div>
                <ul className="list-disc list-inside space-y-1 text-gray-200/90">
                  {newsletterReasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className={`grid gap-4 items-stretch mx-auto ${
              data.about.stats.length === 1 ? 'grid-cols-1 max-w-xs' :
              data.about.stats.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-md' :
              data.about.stats.length === 3 ? 'grid-cols-1 sm:grid-cols-3 max-w-2xl' :
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-5xl'
            }`}>
              {data.about.stats.map((stat, index) => (
                <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm h-full hover:bg-white/10 transition-all duration-300">
                  <p className="text-3xl font-heading font-bold text-white">{stat.value}</p>
                  <p className="text-sm uppercase tracking-wide text-gray-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-white/10 via-[#38bdf8]/20 to-[#fbbf24]/20 blur-3xl opacity-60"></div>
            <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="flex justify-center">
                <img
                  src={avatarSrc}
                  alt={`${data.name} portrait`}
                  className="w-32 h-32 rounded-full border-4 border-white/40 object-cover shadow-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-6 text-gray-200">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-2">Location</p>
                  <p className="text-lg font-semibold">{data.contact.location}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-2">Email</p>
                  <p className="text-lg font-semibold break-all">{data.contact.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-3">Skills Snapshot</p>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.slice(0, 8).map((skill, index) => (
                      <span key={index} className="px-3 py-2 bg-white/10 rounded-full text-xs font-semibold border border-white/10">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="/#about" className="text-gray-200 hover:text-white transition-colors">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Hero;
