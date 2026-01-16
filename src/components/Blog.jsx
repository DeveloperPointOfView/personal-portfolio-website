import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/animations';

const Blog = () => {
  const { data } = useData();
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);

  if (!data.sectionVisibility?.blog) return null;

  const blog = Array.isArray(data.blog) ? data.blog.filter(article => article.published) : [];
  if (blog.length === 0) return null;

  const copy = data.sectionCopy?.blog || {};

  // Get all unique tags
  const allTags = ['all', ...new Set(blog.flatMap(article => article.tags || []))];

  // Filter articles by tag
  const filteredArticles = selectedTag === 'all' 
    ? blog 
    : blog.filter(article => article.tags?.includes(selectedTag));

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <section id="blog" className="py-20 bg-gradient-to-b from-[#0a1220] to-[#0c1528] text-gray-200">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16 space-y-3"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs uppercase tracking-[0.3em]">
            {copy.eyebrow}
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight">
            {copy.title}
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">{copy.subtitle}</p>
        </motion.div>

        {/* Tag Filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {allTags.map(tag => (
            <motion.button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              variants={fadeInUp}
              className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                selectedTag === tag
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10'
              }`}
            >
              {tag}
            </motion.button>
          ))}
        </motion.div>

        {/* Articles Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {filteredArticles.map((article) => (
            <motion.article
              key={article.id}
              variants={fadeInUp}
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              {article.image && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              )}
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{formatDate(article.date)}</span>
                  <span className="uppercase tracking-wider">{article.author}</span>
                </div>
                
                <h3 className="text-xl font-heading font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {article.tags?.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-white/10 border border-white/10 text-xs font-semibold rounded-full text-gray-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4 flex items-center text-[#38bdf8] text-sm font-semibold group-hover:translate-x-2 transition-transform">
                  Read More →
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No articles found for this tag.</p>
          </div>
        )}
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedArticle(null)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0c1528] border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedArticle.image && (
              <img 
                src={selectedArticle.image} 
                alt={selectedArticle.title}
                className="w-full h-64 object-cover"
              />
            )}
            
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {selectedArticle.tags?.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-white/10 border border-white/10 text-xs font-semibold rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">
                {selectedArticle.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{selectedArticle.author}</span>
                <span>•</span>
                <span>{formatDate(selectedArticle.date)}</span>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {selectedArticle.content}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Blog;
