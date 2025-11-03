import React from 'react';

const BasicInfoStep = ({ formData, onChange, errors = {} }) => {
  const categories = ['E-commerce', 'Social Media', 'SaaS', 'Portfolio', 'API', 'Dashboard', 'Mobile App', 'Other'];
  const projectTypes = ['Full Stack', 'Frontend', 'Backend', 'Mobile App', 'API'];
  const statuses = ['completed', 'in-progress', 'maintained'];

  const handleInputChange = (e) => {
    if (!e || !e.target) {
      console.error('Invalid event object', e);
      return;
    }

    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    onChange({
      ...formData,
      [name]: newValue
    });
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-sky-500/20 to-cyan-400/20 border border-white/10 backdrop-blur-sm mb-2 sm:mb-3">
          <span className="text-lg sm:text-xl">📝</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Basic Information</h2>
        <p className="text-white/60 text-xs sm:text-sm">Let's start with the essential details about your project</p>
      </div>

      {/* Form Content */}
      <div className="space-y-3 sm:space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Project Title <span className="text-sky-400">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Enter your project name"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 backdrop-blur-sm transition-all duration-300 focus:border-sky-500/50 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/20"
            style={{
              color: '#ffffff',
              WebkitTextFillColor: '#ffffff',
              caretColor: '#ffffff',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              opacity: 1
            }}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-400">{errors.title}</p>
          )}
          <p className="mt-2 text-xs text-white/50">
            A clear, descriptive title for your project
          </p>
        </div>

        {/* Category and Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Category <span className="text-sky-400">*</span>
            </label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className={`
                  w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                  text-white placeholder-white/40 backdrop-blur-sm transition-all duration-300
                  focus:border-sky-500/50 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/20
                  ${errors.category ? 'border-red-500/50' : ''}
                `}
                style={{ color: 'white' }}
              >
                <option value="" className="bg-slate-800">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-red-400">{errors.category}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Project Type <span className="text-sky-400">*</span>
            </label>
            <div className="relative">
              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleInputChange}
                required
                className={`
                  w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                  text-white placeholder-white/40 backdrop-blur-sm transition-all duration-300
                  focus:border-sky-500/50 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/20
                  ${errors.projectType ? 'border-red-500/50' : ''}
                `}
                style={{ color: 'white' }}
              >
                <option value="" className="bg-slate-800">Select type</option>
                {projectTypes.map(type => (
                  <option key={type} value={type} className="bg-slate-800">{type}</option>
                ))}
              </select>
              {errors.projectType && (
                <p className="mt-1 text-xs text-red-400">{errors.projectType}</p>
              )}
            </div>
          </div>
        </div>

        {/* Duration and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="e.g., 3 months, 6 weeks"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 backdrop-blur-sm transition-all duration-300 focus:border-sky-500/50 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/20"
              style={{
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                caretColor: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                opacity: 1
              }}
            />
            <p className="mt-2 text-xs text-white/50">
              How long did this project take to complete?
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Status
            </label>
            <div className="relative">
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 backdrop-blur-sm transition-all duration-300 focus:border-sky-500/50 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/20"
                style={{ color: 'white' }}
              >
                {statuses.map(status => (
                  <option key={status} value={status} className="bg-slate-800">
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Short Description <span className="text-sky-400">*</span>
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              required
              placeholder="Brief one-liner about your project"
              maxLength={200}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 backdrop-blur-sm transition-all duration-300 focus:border-sky-500/50 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/20"
              style={{
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                caretColor: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                opacity: 1
              }}
            />
            {errors.shortDescription && (
              <p className="mt-1 text-xs text-red-400">{errors.shortDescription}</p>
            )}
            <div className="flex justify-between mt-2">
              <p className="text-xs text-white/50">
                A brief summary that will appear in project listings
              </p>
              <span className="text-xs text-white/40">
                {formData.shortDescription?.length || 0}/200
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Detailed Description <span className="text-sky-400">*</span>
            </label>
            <div className="relative">
              <textarea
                name="longDescription"
                value={formData.longDescription}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder="Describe your project in detail..."
                className={`
                  w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                  text-white placeholder-white/40 backdrop-blur-sm transition-all duration-300
                  focus:border-sky-500/50 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/20
                  resize-none
                  ${errors.longDescription ? 'border-red-500/50' : ''}
                `}
                style={{ color: 'white' }}
              />
              {errors.longDescription && (
                <p className="mt-1 text-xs text-red-400">{errors.longDescription}</p>
              )}
            </div>
            <p className="mt-2 text-xs text-white/50">
              Provide comprehensive details about the project, challenges, and solutions
            </p>
          </div>
        </div>

        {/* Featured and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-400/20">
                <span className="text-sm">⭐</span>
              </div>
              <div>
                <label className="text-sm font-medium text-white">Featured Project</label>
                <p className="text-xs text-white/50">Showcase on homepage</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleInputChange({ target: { name: 'featured', type: 'checkbox', checked: !formData.featured } })}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
                ${formData.featured ? 'bg-sky-500' : 'bg-white/10'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
                  ${formData.featured ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Priority
            </label>
            <input
              type="number"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              min="0"
              max="10"
              placeholder="0-10"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 backdrop-blur-sm transition-all duration-300 focus:border-sky-500/50 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/20"
              style={{
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
                caretColor: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                opacity: 1
              }}
            />
            <p className="mt-2 text-xs text-white/50">
              Higher priority projects appear first
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;