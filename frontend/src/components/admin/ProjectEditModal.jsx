import React, { useState, useEffect } from 'react';
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import { projectsAPI } from '../../utils/api';
import CloudinaryUploadService from '../../services/CloudinaryUploadService';

// Import step components
import ProgressIndicator from '../ui/ProgressIndicator';
import BasicInfoStep from './ProjectFormSteps/BasicInfoStep';
import TechnologiesStep from './ProjectFormSteps/TechnologiesStep';
import MediaStep from './ProjectFormSteps/MediaStep';
import SettingsStep from './ProjectFormSteps/SettingsStep';

const ProjectEditModal = ({ isOpen, onClose, project, onSave, isLoading = false }) => {

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    longDescription: '',
    category: 'Portfolio',
    projectType: 'Full Stack',
    featured: false,
    status: 'completed',
    priority: 0,
    tags: [],
    technologies: {
      frontend: [],
      backend: [],
      database: [],
      devops: [],
      tools: []
    },
    links: {
      live: '',
      github: '',
      demo: '',
      caseStudy: '',
      apiDocs: ''
    },
    features: [],
    learnings: [],
    duration: '',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      ogImage: ''
    },
    images: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);

  const totalSteps = 4;
  const categories = ['E-commerce', 'Social Media', 'SaaS', 'Portfolio', 'API', 'Dashboard', 'Mobile App', 'Other'];
  const projectTypes = ['Full Stack', 'Frontend', 'Backend', 'Mobile App', 'API'];
  const statuses = ['completed', 'in-progress', 'maintained'];

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        shortDescription: project.shortDescription || '',
        longDescription: project.longDescription || '',
        category: project.category || 'Portfolio',
        projectType: project.projectType || 'Full Stack',
        featured: project.featured || false,
        status: project.status || 'completed',
        priority: project.priority || 0,
        tags: project.tags || [],
        technologies: {
          frontend: project.technologies?.frontend || [],
          backend: project.technologies?.backend || [],
          database: project.technologies?.database || [],
          devops: project.technologies?.devops || [],
          tools: project.technologies?.tools || []
        },
        links: {
          live: project.links?.live || '',
          github: project.links?.github || '',
          demo: project.links?.demo || '',
          caseStudy: project.links?.caseStudy || '',
          apiDocs: project.links?.apiDocs || ''
        },
        features: project.features || [],
        learnings: project.learnings || [],
        duration: project.duration || '',
        seo: {
          metaTitle: project.seo?.metaTitle || '',
          metaDescription: project.seo?.metaDescription || '',
          keywords: project.seo?.keywords || [],
          ogImage: project.seo?.ogImage || ''
        }
      });
      setImages(project?.images || []);
    } else {
      // Reset form for new project
      setFormData({
        title: '',
        shortDescription: '',
        longDescription: '',
        category: 'Portfolio',
        projectType: 'Full Stack',
        featured: false,
        status: 'completed',
        priority: 0,
        tags: [],
        technologies: {
          frontend: [],
          backend: [],
          database: [],
          devops: [],
          tools: []
        },
        links: {
          live: '',
          github: '',
          demo: '',
          caseStudy: '',
          apiDocs: ''
        },
        features: [],
        learnings: [],
        duration: '',
        seo: {
          metaTitle: '',
          metaDescription: '',
          keywords: [],
          ogImage: ''
        },
        images: []
      });
      setImages([]);
    }
    setCurrentStep(1);
    setErrors({});
  }, [project]);

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          newErrors.title = 'Project title is required';
        }
        if (!formData.shortDescription.trim()) {
          newErrors.shortDescription = 'Short description is required';
        }
        if (!formData.longDescription.trim()) {
          newErrors.longDescription = 'Long description is required';
        }
        if (!formData.category) {
          newErrors.category = 'Category is required';
        }
        if (!formData.projectType) {
          newErrors.projectType = 'Project type is required';
        }
        break;
      case 2:
        // Technologies and links are optional
        break;
      case 3:
        // Images are optional
        break;
      case 4:
        // Settings are optional
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStepChange = (step) => {
    if (step < currentStep || step > currentStep) {
      if (validateStep(currentStep)) {
        setCurrentStep(step);
      }
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormChange = (newData) => {
    setFormData(newData);
    // Sync images state if formData.images is updated
    if (newData.images !== undefined && newData.images !== formData.images) {
      setImages(newData.images);
    }
    // Clear errors for the field that was changed
    if (errors.title && newData.title) {
      setErrors(prev => ({ ...prev, title: '' }));
    }
    if (errors.shortDescription && newData.shortDescription) {
      setErrors(prev => ({ ...prev, shortDescription: '' }));
    }
    if (errors.longDescription && newData.longDescription) {
      setErrors(prev => ({ ...prev, longDescription: '' }));
    }
    if (errors.category && newData.category) {
      setErrors(prev => ({ ...prev, category: '' }));
    }
    if (errors.projectType && newData.projectType) {
      setErrors(prev => ({ ...prev, projectType: '' }));
    }
  };

  // Function to generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .replace(/--+/g, '-')
      || 'untitled-project';
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        images: formData.images || images,
        slug: generateSlug(formData.title)
      };
      await onSave(submissionData);
    } catch (error) {
      console.error('Error saving project:', error);
      setErrors({ submit: 'Failed to save project. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} onChange={handleFormChange} errors={errors} />;
      case 2:
        return <TechnologiesStep formData={formData} onChange={handleFormChange} errors={errors} />;
      case 3:
        return <MediaStep formData={{ ...formData, images }} onChange={handleFormChange} errors={errors} />;
      case 4:
        return <SettingsStep formData={formData} onChange={handleFormChange} errors={errors} />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 z-50"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 xs:p-3 sm:p-4 pointer-events-none">
        <div className="relative w-full max-w-3xl xl:max-w-4xl transform transition-all duration-300 pointer-events-auto mx-2 xs:mx-0">
          {/* Modal Content */}
          <div className="relative bg-slate-900 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden pointer-events-auto">
            {/* Header */}
            <div className="relative bg-gradient-to-br from-sky-500/10 via-slate-900/95 to-cyan-400/10 border-b border-white/10">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-cyan-400/5" />
              <div className="relative px-3 py-3 sm:px-4 sm:py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      {project ? 'Edit Project' : 'Create New Project'}
                    </h2>
                    <p className="text-white/60 text-xs sm:text-sm">
                      {project ? 'Update your project details' : 'Add a new project to your portfolio'}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="p-2 rounded-lg bg-white/10 border border-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="px-3 py-3 sm:px-4 sm:py-4 bg-slate-900/50 border-b border-white/5">
              <ProgressIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
                onStepClick={handleStepChange}
              />
            </div>

            {/* Form Content */}
            <div className="px-3 py-3 sm:px-4 sm:py-4 bg-slate-900/30">
              <div className="min-h-[250px] sm:min-h-[300px] max-h-[40vh] sm:max-h-[45vh] overflow-y-auto pr-2">
                {renderStepContent()}
              </div>
            </div>

            {/* Footer */}
            <div className="px-3 py-3 sm:px-4 sm:py-4 bg-slate-900/50 border-t border-white/10">
              <div className="flex flex-col gap-3 xs:flex-row xs:items-center xs:justify-between">
                <div className="order-2 xs:order-1">
                  {errors.submit && (
                    <p className="text-sm text-rose-400 flex items-center gap-2">
                      <span>⚠️</span> {errors.submit}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 xs:gap-3 order-1 xs:order-2">
                  {/* Previous Button */}
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 1 || isSubmitting}
                    className={`
                      px-3 xs:px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-1 xs:gap-2 text-xs xs:text-sm
                      ${currentStep === 1 || isSubmitting
                        ? 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
                        : 'bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 hover:text-white'
                      }
                    `}
                  >
                    <ArrowLeftIcon className="h-3 w-3 xs:h-4 xs:w-4" />
                    <span className="hidden xs:inline">Previous</span>
                    <span className="xs:hidden">Prev</span>
                  </button>

                  {/* Next/Submit Button */}
                  {currentStep < totalSteps ? (
                    <button
                      onClick={handleNext}
                      className="px-4 xs:px-6 py-2 bg-gradient-to-r from-sky-500 to-cyan-400 text-white rounded-xl font-medium hover:from-sky-600 hover:to-cyan-500 transition-all duration-300 flex items-center gap-1 xs:gap-2 shadow-lg shadow-sky-500/25 text-xs xs:text-sm"
                    >
                      Next
                      <ArrowRightIcon className="h-3 w-3 xs:h-4 xs:w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || isLoading}
                      className="px-4 xs:px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-500 transition-all duration-300 flex items-center gap-1 xs:gap-2 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-xs xs:text-sm"
                    >
                      {isSubmitting || isLoading ? (
                        <>
                          <div className="h-3 w-3 xs:h-4 xs:w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="hidden xs:inline">Saving...</span>
                          <span className="xs:hidden">...</span>
                        </>
                      ) : (
                        <>
                          <CheckIcon className="h-3 w-3 xs:h-4 xs:w-4" />
                          <span className="hidden xs:inline">{project ? 'Update Project' : 'Create Project'}</span>
                          <span className="xs:hidden">{project ? 'Update' : 'Create'}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectEditModal;