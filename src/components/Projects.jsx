import React from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/animations';
import { trackProjectClick } from '../services/supabase';

const Projects = () => {
  const { data } = useData();
  const projects = Array.isArray(data.projects) ? data.projects : [];
  if (!data.sectionVisibility?.projects || projects.length === 0) return null;

  const copy = data.sectionCopy?.projects || {};
  const githubLink = data.contact?.social?.github?.trim();

  const handleProjectClick = (project) => {
    trackProjectClick(project.title);
  };

  return (
    <section id="projects" className="py-20 bg-[#0b1220] text-gray-200">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16 space-y-3"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs uppercase tracking-[0.3em]">{copy.eyebrow}</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight">{copy.title}</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">{copy.subtitle}</p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {projects.map((project, index) => {
            const link = project.link?.trim();
            const hasLink = Boolean(link);
            const hasImage = Boolean(project.image?.trim());
            return (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="h-44 relative overflow-hidden">
                  {hasImage ? (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-white/10 via-[#38bdf8]/10 to-[#fbbf24]/20">
                      <div className="absolute inset-0 flex items-center justify-center text-white/20 text-4xl font-heading">{project.title.slice(0, 1)}</div>
                    </div>
                  )}
                  {hasLink && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleProjectClick(project)}
                        className="px-4 py-2 bg-white text-black text-xs font-semibold uppercase tracking-wider rounded shadow hover:scale-105 transition-transform"
                      >
                        Open
                      </a>
                    </div>
                  )}
                </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-heading font-bold text-white">{project.title}</h3>
                  <span className="text-xs uppercase tracking-[0.2em] text-gray-400">#{index + 1}</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">{project.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-3 py-1 bg-white/10 border border-white/10 text-xs font-semibold rounded-full text-gray-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
          })}
        </motion.div>
        
        {githubLink && (
          <motion.div 
            className="mt-16 text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-white text-black font-bold uppercase tracking-wider rounded-lg shadow hover:-translate-y-1 transition-all duration-300"
            >
              View More on GitHub
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;
