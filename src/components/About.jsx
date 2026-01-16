import React from 'react';
import { useData } from '../context/DataContext';

const About = () => {
  const { data } = useData();
  const stats = data.about.stats;

  return (
    <section id="about" className="py-20 bg-[#0b1220] text-gray-200">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <span className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs uppercase tracking-[0.3em]">{data.about.title}</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight">Building purposeful, polished experiences</h2>
            <p className="text-gray-400 max-w-3xl mx-auto">A mix of engineering discipline and product thinking—paired with a love for clean interfaces and resilient systems.</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            <div className="lg:col-span-2 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#38bdf8]/20 via-white/10 to-[#fbbf24]/20 rounded-2xl blur" aria-hidden></div>
              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl h-full space-y-6">
                {data.about.description.map((paragraph, index) => (
                  <p key={index} className="text-lg leading-relaxed text-gray-200">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-4">
              <h3 className="text-xl font-heading font-semibold text-white">Technical Stack</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-2 bg-white/10 border border-white/10 rounded-full text-xs font-semibold text-gray-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={`grid gap-6 mx-auto ${
            stats.length === 1 ? 'grid-cols-1 max-w-xs' :
            stats.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl' :
            stats.length === 3 ? 'grid-cols-1 sm:grid-cols-3 max-w-3xl' :
            'grid-cols-2 md:grid-cols-4 max-w-5xl'
          }`}>
            {stats.map((stat, index) => (
              <div key={index} className="p-6 bg-white/5 border border-white/10 rounded-xl text-center backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
                <h4 className="text-4xl font-heading font-bold text-white mb-1">{stat.value}</h4>
                <p className="text-xs uppercase tracking-[0.25em] text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
