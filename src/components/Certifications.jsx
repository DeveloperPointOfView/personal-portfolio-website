import React from 'react';
import { useData } from '../context/DataContext';

const Certifications = () => {
  const { data } = useData();
  if (!data.sectionVisibility?.certifications) return null;

  const copy = data.sectionCopy?.certifications || {};
  const items = Array.isArray(data.certifications) ? data.certifications : [];

  return (
    <section id="certifications" className="py-20 bg-gradient-to-b from-[#0b1324] via-[#0b1426] to-[#0a1222] text-gray-200">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14 space-y-3">
          <span className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs uppercase tracking-[0.3em]">{copy.eyebrow}</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight">{copy.title}</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">{copy.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {items.map((cert, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-xl font-heading font-bold text-white">{cert.name}</h3>
                  <p className="text-sm text-gray-300">{cert.organization}</p>
                </div>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs uppercase tracking-[0.2em] text-gray-200">Credential</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm text-gray-300">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-[0.2em]">Issued</p>
                  <p className="font-semibold text-white">{[cert.issueMonth, cert.issueYear].filter(Boolean).join(' ')}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-[0.2em]">Expires</p>
                  <p className="font-semibold text-white">{[cert.expirationMonth, cert.expirationYear].filter(Boolean).join(' ') || 'N/A'}</p>
                </div>
                {cert.credentialId && (
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-[0.2em]">Credential ID</p>
                    <p className="font-semibold text-white break-all">{cert.credentialId}</p>
                  </div>
                )}
                {cert.credentialUrl && (
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-[0.2em]">Credential URL</p>
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#38bdf8] hover:text-white transition-colors break-all"
                    >
                      View Credential
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
