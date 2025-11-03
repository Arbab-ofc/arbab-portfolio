import React, { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const TechnologiesStep = ({ formData, onChange, errors = {} }) => {
  const [newTech, setNewTech] = useState('');
  const [activeCategory, setActiveCategory] = useState('frontend');

  const techCategories = {
    frontend: { name: 'Frontend', icon: '🎨', color: 'from-blue-500/20 to-cyan-400/20' },
    backend: { name: 'Backend', icon: '⚙️', color: 'from-green-500/20 to-emerald-400/20' },
    database: { name: 'Database', icon: '🗄️', color: 'from-purple-500/20 to-pink-400/20' },
    devops: { name: 'DevOps', icon: '🚀', color: 'from-orange-500/20 to-red-400/20' },
    tools: { name: 'Tools', icon: '🛠️', color: 'from-indigo-500/20 to-purple-400/20' }
  };

  const addTech = (category) => {
    if (newTech.trim()) {
      const currentTechs = formData.technologies[category] || [];
      if (!currentTechs.includes(newTech.trim())) {
        onChange({
          ...formData,
          technologies: {
            ...formData.technologies,
            [category]: [...currentTechs, newTech.trim()]
          }
        });
      }
      setNewTech('');
    }
  };

  const removeTech = (category, index) => {
    const currentTechs = formData.technologies[category] || [];
    onChange({
      ...formData,
      technologies: {
        ...formData.technologies,
        [category]: currentTechs.filter((_, i) => i !== index)
      }
    });
  };

  const handleLinkChange = (linkType, value) => {
    onChange({
      ...formData,
      links: {
        ...formData.links,
        [linkType]: value
      }
    });
  };

  const commonTechs = {
    frontend: ['React', 'Vue.js', 'Angular', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap'],
    backend: ['Node.js', 'Express.js', 'Django', 'Flask', 'Ruby on Rails', 'PHP', 'Java', 'Python', 'Go', 'Rust'],
    database: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'Supabase', 'SQLite', 'Oracle', 'Elasticsearch'],
    devops: ['Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'Vercel', 'Netlify', 'GitHub Actions', 'CI/CD', 'Nginx'],
    tools: ['Git', 'VS Code', 'Figma', 'Postman', 'MongoDB Compass', 'Chrome DevTools', 'Webpack', 'Vite', 'ESLint']
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sky-500/20 to-cyan-400/20 border border-white/10 backdrop-blur-sm mb-4">
          <span className="text-2xl">⚙️</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Technologies & Links</h2>
        <p className="text-white/60">Showcase the tech stack and connect your project</p>
      </div>

      {/* Technologies Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🛠️</span> Technologies Used
          </h3>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(techCategories).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`
                  px-4 py-2 rounded-xl border transition-all duration-300 flex items-center gap-2
                  ${activeCategory === key
                    ? 'bg-white/10 border-white/30 text-white shadow-lg shadow-white/10'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20'
                  }
                `}
              >
                <span>{config.icon}</span>
                <span className="text-sm font-medium">{config.name}</span>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                  {formData.technologies[key]?.length || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Add Technology */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTech(activeCategory)}
                placeholder={`Add ${techCategories[activeCategory].name.toLowerCase()} technology...`}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-sky-500/50 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/20 transition-all duration-300"
              />
              <button
                onClick={() => addTech(activeCategory)}
                className="px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-400 text-white rounded-lg hover:from-sky-600 hover:to-cyan-500 transition-all duration-300 flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add
              </button>
            </div>

            {/* Common Technologies Suggestions */}
            <div className="mt-3">
              <p className="text-xs text-white/50 mb-2">Common technologies:</p>
              <div className="flex flex-wrap gap-1">
                {commonTechs[activeCategory].slice(0, 8).map(tech => (
                  <button
                    key={tech}
                    onClick={() => {
                      const currentTechs = formData.technologies[activeCategory] || [];
                      if (!currentTechs.includes(tech)) {
                        onChange({
                          ...formData,
                          technologies: {
                            ...formData.technologies,
                            [activeCategory]: [...currentTechs, tech]
                          }
                        });
                      }
                    }}
                    className="px-2 py-1 text-xs bg-white/5 border border-white/10 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300"
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Technologies List */}
          <div className="space-y-3">
            {Object.entries(techCategories).map(([category, config]) => {
              const techs = formData.technologies[category] || [];
              if (techs.length === 0) return null;

              return (
                <div key={category} className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span>{config.icon}</span>
                    <h4 className="font-medium text-white">{config.name}</h4>
                    <span className="text-xs text-white/50">({techs.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {techs.map((tech, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-white/10 to-white/5 border border-white/10 rounded-full text-sm text-white group hover:from-white/15 hover:to-white/10 transition-all duration-300"
                      >
                        <span>{tech}</span>
                        <button
                          onClick={() => removeTech(category, index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <XMarkIcon className="h-3 w-3 text-white/60 hover:text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>🔗</span> Project Links
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'live', label: 'Live Demo', icon: '🌐', placeholder: 'https://your-project.com' },
            { key: 'github', label: 'GitHub', icon: '💻', placeholder: 'https://github.com/username/repo' },
            { key: 'demo', label: 'Demo Video', icon: '🎥', placeholder: 'https://youtu.be/...' },
            { key: 'caseStudy', label: 'Case Study', icon: '📄', placeholder: 'https://medium.com/...' },
            { key: 'apiDocs', label: 'API Docs', icon: '📚', placeholder: 'https://docs.your-api.com' }
          ].map(link => (
            <div key={link.key} className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <span>{link.icon}</span>
                <label className="text-sm font-medium text-white">{link.label}</label>
              </div>
              <input
                type="url"
                value={formData.links[link.key] || ''}
                onChange={(e) => handleLinkChange(link.key, e.target.value)}
                placeholder={link.placeholder}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-sky-500/50 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/20 transition-all duration-300 text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnologiesStep;