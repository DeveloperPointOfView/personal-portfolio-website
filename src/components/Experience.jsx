import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const Experience = () => {
  const { data } = useData();
  const [selectedExperience, setSelectedExperience] = useState(null);
  
  if (!data.sectionVisibility?.experience) return null;

  const copy = data.sectionCopy?.experience || {};

  // Function to check if text is longer than a certain character limit
  const isLongDescription = (text) => text.length > 150;

  // Function to truncate text
  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    // Find the last space before maxLength to avoid cutting words
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
  };

  return (
    <>
      <section id="experience" className="py-20 bg-gradient-to-b from-[#0a1222] via-[#0b1426] to-[#0c1020] text-gray-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <span className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs uppercase tracking-[0.3em]">{copy.eyebrow}</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight">{copy.title}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{copy.subtitle}</p>
          </div>
          
          <div className="max-w-3xl mx-auto relative">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-noir-700"></div>
            
            <div className="space-y-12">
              {data.experience.map((exp, index) => (
                <div key={index} className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} items-center md:items-start`}>
                  <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full border-4 border-[#0c1020] z-10 mt-1.5"></div>
                  <div className="hidden md:block w-1/2"></div>
                  <div className={`w-full md:w-1/2 pl-8 md:pl-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-xl backdrop-blur-lg hover:border-[#38bdf8]/40 transition-all duration-300">
                      {/* Header with Company and Period */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <span className="text-sm font-semibold text-white tracking-wide">
                          {exp.company}
                        </span>
                        <span className="inline-flex px-3 py-1 bg-white/10 border border-white/10 text-xs font-bold rounded-full text-gray-100 w-fit">
                          {exp.period}
                        </span>
                      </div>
                      
                      {/* Job Title */}
                      <h3 className="text-xl font-bold text-white mb-3">{exp.title}</h3>
                      
                      {/* Description Box with consistent height */}
                      <div className="min-h-[100px]">
                        <p className="text-sm leading-relaxed text-gray-300 line-clamp-3">
                          {isLongDescription(exp.description) ? truncateText(exp.description) : exp.description}
                        </p>
                        
                        {/* Read More Button for long descriptions */}
                        {isLongDescription(exp.description) && (
                          <button
                            onClick={() => setSelectedExperience(exp)}
                            className="mt-2 text-sm text-[#38bdf8] hover:text-[#7dd3fc] font-semibold transition-colors duration-200 flex items-center gap-1"
                          >
                            Read More
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal for full description */}
      {selectedExperience && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedExperience(null)}
        >
          <div 
            className="bg-[#0a1222] border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedExperience(null)}
              className="float-right text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Modal Content */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-white/10">
                <h3 className="text-2xl font-bold text-white">{selectedExperience.company}</h3>
                <span className="inline-flex px-3 py-1 bg-white/10 border border-white/10 text-xs font-bold rounded-full text-gray-100 w-fit">
                  {selectedExperience.period}
                </span>
              </div>
              
              <h4 className="text-xl font-semibold text-[#38bdf8]">{selectedExperience.title}</h4>
              
              <p className="text-base leading-relaxed text-gray-300 whitespace-pre-line">
                {selectedExperience.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Experience;
