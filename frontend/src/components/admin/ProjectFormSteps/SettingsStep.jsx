import React, { useState } from 'react';
import { PlusIcon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';

const SettingsStep = ({ formData, onChange, errors = {} }) => {
  const [newTag, setNewTag] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newLearning, setNewLearning] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  const addArrayItem = (field, value) => {
    if (value.trim()) {
      onChange({
        ...formData,
        [field]: [...(formData[field] || []), value.trim()]
      });
    }
  };

  const removeArrayItem = (field, index) => {
    onChange({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };

  const handleSeoChange = (field, value) => {
    onChange({
      ...formData,
      seo: {
        ...formData.seo,
        [field]: value
      }
    });
  };

  const generateAutoContent = () => {
    // Smart suggestions based on existing data
    const suggestions = {
      tags: generateTagsFromTitle(formData.title),
      features: generateFeaturesFromDescription(formData.longDescription),
      keywords: generateKeywordsFromContent(formData.title, formData.shortDescription)
    };

    onChange({
      ...formData,
      tags: [...new Set([...formData.tags, ...suggestions.tags])],
      features: [...new Set([...formData.features, ...suggestions.features])],
      seo: {
        ...formData.seo,
        keywords: [...new Set([...(formData.seo.keywords || []), ...suggestions.keywords])]
      }
    });
  };

  const generateTagsFromTitle = (title) => {
    if (!title) return [];
    const words = title.toLowerCase().split(' ');
    const commonTags = ['web', 'app', 'website', 'portfolio', 'project', 'mern', 'react', 'nodejs'];
    return words.filter(word => word.length > 2).concat(commonTags).slice(0, 5);
  };

  const generateFeaturesFromDescription = (description) => {
    if (!description) return [];
    const featureWords = ['responsive', 'modern', 'fast', 'secure', 'scalable', 'user-friendly', 'intuitive'];
    return featureWords.filter(feature => description.toLowerCase().includes(feature));
  };

  const generateKeywordsFromContent = (title, description) => {
    const content = `${title} ${description}`.toLowerCase();
    const techKeywords = ['react', 'javascript', 'nodejs', 'mongodb', 'express', 'mern', 'fullstack', 'frontend', 'backend'];
    return techKeywords.filter(keyword => content.includes(keyword));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sky-500/20 to-cyan-400/20 border border-white/10 backdrop-blur-sm mb-4">
          <span className="text-2xl">⚡</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Settings & Metadata</h2>
        <p className="text-white/60">Final details and SEO optimization</p>
      </div>

      {/* Auto-Generate Button */}
      <div className="bg-gradient-to-r from-sky-500/10 to-cyan-400/10 border border-sky-500/20 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
              <SparklesIcon className="h-4 w-4 text-sky-400" />
              Smart Suggestions
            </h3>
            <p className="text-xs text-white/60">
              Auto-generate tags, features, and keywords based on your content
            </p>
          </div>
          <button
            onClick={generateAutoContent}
            className="px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-400 text-white rounded-lg hover:from-sky-600 hover:to-cyan-500 transition-all duration-300 text-sm font-medium flex items-center gap-2"
          >
            <SparklesIcon className="h-4 w-4" />
            Generate
          </button>
        </div>
      </div>

      {/* Tags Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>🏷️</span> Project Tags
        </h3>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('tags', newTag, setNewTag))}
              placeholder="Add a tag..."
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-sky-500/50 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/20 transition-all duration-300"
            />
            <button
              onClick={() => addArrayItem('tags', newTag, setNewTag)}
              className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.tags?.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-sky-500/20 to-cyan-400/20 border border-sky-500/30 rounded-full text-sm text-sky-300 group hover:from-sky-500/30 hover:to-cyan-400/30 transition-all duration-300"
              >
                #{tag}
                <button
                  onClick={() => removeArrayItem('tags', index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
            {(!formData.tags || formData.tags.length === 0) && (
              <p className="text-sm text-white/40 italic">No tags added yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>✨</span> Key Features
        </h3>

        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('features', newFeature, setNewFeature))}
              placeholder="Add a feature..."
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-sky-500/50 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/20 transition-all duration-300"
            />
            <button
              onClick={() => addArrayItem('features', newFeature, setNewFeature)}
              className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-2">
            {formData.features?.map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm group hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full" />
                  <span className="text-white text-sm">{feature}</span>
                </div>
                <button
                  onClick={() => removeArrayItem('features', index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-400 hover:text-red-300"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            {(!formData.features || formData.features.length === 0) && (
              <p className="text-sm text-white/40 italic text-center py-4">No features added yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Learnings Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>🎓</span> Key Learnings
        </h3>

        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newLearning}
              onChange={(e) => setNewLearning(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('learnings', newLearning, setNewLearning))}
              placeholder="What did you learn from this project?"
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-sky-500/50 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/20 transition-all duration-300"
            />
            <button
              onClick={() => addArrayItem('learnings', newLearning, setNewLearning)}
              className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-2">
            {formData.learnings?.map((learning, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm group hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full mt-2" />
                <span className="text-white text-sm flex-1">{learning}</span>
                <button
                  onClick={() => removeArrayItem('learnings', index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-400 hover:text-red-300"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            {(!formData.learnings || formData.learnings.length === 0) && (
              <p className="text-sm text-white/40 italic text-center py-4">No learnings added yet</p>
            )}
          </div>
        </div>
      </div>

      {/* SEO Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>🔍</span> SEO Optimization
        </h3>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Meta Title</label>
            <input
              type="text"
              value={formData.seo?.metaTitle || ''}
              onChange={(e) => handleSeoChange('metaTitle', e.target.value)}
              placeholder="SEO title (60 chars max)"
              maxLength={60}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-sky-500/50 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/20 transition-all duration-300"
            />
            <p className="text-xs text-white/40 mt-1">
              {formData.seo?.metaTitle?.length || 0}/60 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Meta Description</label>
            <textarea
              value={formData.seo?.metaDescription || ''}
              onChange={(e) => handleSeoChange('metaDescription', e.target.value)}
              placeholder="SEO description (160 chars max)"
              maxLength={160}
              rows={3}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-sky-500/50 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/20 transition-all duration-300 resize-none"
            />
            <p className="text-xs text-white/40 mt-1">
              {formData.seo?.metaDescription?.length || 0}/160 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Keywords</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSeoChange('keywords', [...(formData.seo?.keywords || []), newKeyword.trim()]))}
                placeholder="Add SEO keyword..."
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-sky-500/50 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/20 transition-all duration-300"
              />
              <button
                onClick={() => handleSeoChange('keywords', [...(formData.seo?.keywords || []), newKeyword.trim()])}
                className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.seo?.keywords?.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm text-white/80 group hover:bg-white/20 transition-all duration-300"
                >
                  {keyword}
                  <button
                    onClick={() => handleSeoChange('keywords', (formData.seo?.keywords || []).filter((_, i) => i !== index))}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsStep;