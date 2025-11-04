import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsAPI, projectsAPI, blogsAPI, contactAPI, skillsAPI, experienceAPI, quotesAPI, resumeAPI } from '../utils/api';
import ProjectEditModal from '../components/admin/ProjectEditModal';
import ResumeUpload from '../components/admin/ResumeUpload'; // Fixed HiDocument import
import PremiumThemeToggle from '../components/ui/PremiumThemeToggle';
import ThemeToggle from '../components/ui/ThemeToggle';
import {
  HiViewGrid,
  HiChartBar,
  HiClipboardList,
  HiChatAlt2,
  HiCog,
  HiArrowSmRight,
  HiBriefcase,
  HiDocumentText,
  HiUsers,
  HiMail,
  HiCloudUpload,
  HiPaperAirplane,
  HiPencil,
  HiTrash,
  HiEye,
  HiDatabase,
  HiDocument,
  HiPlus,
  HiSparkles,
  HiHome,
  HiPhotograph,
  HiX,
} from 'react-icons/hi';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState('');
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Project management state
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectSubmitting, setProjectSubmitting] = useState(false);

  // Blog management state
  const [editingBlog, setEditingBlog] = useState(null);

  const experienceTypes = ['Full-time', 'Part-time', 'Freelance', 'Contract', 'Internship'];
  const blogCategories = ['Tutorial', 'Best Practices', 'Case Study', 'Tech Review', 'Career', 'Other'];

  const initialFormData = {
    experience: {
      position: '',
      company: '',
      location: '',
      type: 'Full-time',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      responsibilities: '',
      achievements: '',
      technologies: '',
      website: '',
      order: '',
    },
    blog: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Tutorial',
      tags: '',
      featured: false,
      published: true,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
    },
    quote: {
      text: '',
      author: '',
      field: '',
      category: 'programming',
      command: '',
      featured: false,
      tags: '',
      source: '',
      context: '',
      priority: 0,
      active: true,
    },
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchWithRetry = async (fn, retries = 2, backoff = 500) => {
    try {
      return await fn();
    } catch (error) {
      if (error?.response?.status === 429 && retries > 0) {
        await delay(backoff);
        return fetchWithRetry(fn, retries - 1, backoff * 2);
      }
      throw error;
    }
  };

  const formatDateLabel = (value) => {
    if (!value) return 'Present';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Present';
    return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
  };

  const calculateExperienceDuration = (start, end, current) => {
    if (!start) return '';
    const startDate = new Date(start);
    if (Number.isNaN(startDate.getTime())) return '';

    let endDate = null;
    if (current || !end) {
      endDate = new Date();
    } else {
      endDate = new Date(end);
    }

    if (Number.isNaN(endDate.getTime())) return '';

    let months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());

    if (months < 0) return '';

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    const parts = [];

    if (years > 0) {
      parts.push(`${years} yr${years > 1 ? 's' : ''}`);
    }

    if (remainingMonths > 0) {
      parts.push(`${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`);
    }

    if (parts.length === 0) {
      return 'Less than a month';
    }

    return parts.join(' ');
  };

  const formatExperienceRange = (start, end, current) => {
    const startLabel = formatDateLabel(start);
    const endLabel = current ? 'Present' : formatDateLabel(end);
    return `${startLabel} - ${endLabel}`;
  };

  const parseListField = (value) =>
    value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

  const generateSlug = (value = '') =>
    value
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

  const sanitizeString = (value) =>
    typeof value === 'string' ? value.trim() : value;

  const sortExperiencesList = (items = []) => {
    const clone = [...items];
    clone.sort((a, b) => {
      const startA = a?.startDate ? new Date(a.startDate).getTime() : 0;
      const startB = b?.startDate ? new Date(b.startDate).getTime() : 0;

      if (startA !== startB) {
        return startB - startA;
      }

      const orderA = typeof a?.order === 'number' ? a.order : 0;
      const orderB = typeof b?.order === 'number' ? b.order : 0;
      return orderA - orderB;
    });
    return clone;
  };

  const sortBlogsList = (items = []) => {
    const clone = [...items];
    clone.sort((a, b) => {
      const publishedA = a?.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const publishedB = b?.publishedAt ? new Date(b.publishedAt).getTime() : 0;

      if (publishedA !== publishedB) {
        return publishedB - publishedA;
      }

      const createdA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const createdB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;

      return createdB - createdA;
    });
    return clone;
  };

  const tabs = [
  { id: 'overview', label: 'Overview', icon: HiViewGrid },
  { id: 'analytics', label: 'Analytics', icon: HiChartBar },
  { id: 'content', label: 'Content', icon: HiClipboardList },
  { id: 'messages', label: 'Messages', icon: HiChatAlt2 },
  { id: 'resume', label: 'Resume', icon: HiDocument },
  { id: 'manage', label: 'Manage', icon: HiCog },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, projectsRes, blogsRes, contactsRes, skillsRes, experienceRes, quotesRes, resumesRes] = await Promise.all([
        fetchWithRetry(() => analyticsAPI.getOverview()).catch(() => ({ data: { totalVisits: 0, uniqueVisitors: 0, deviceStats: [], topPages: [] } })),
        fetchWithRetry(() => projectsAPI.getAll()),
        fetchWithRetry(() => blogsAPI.getAllForAdmin()),
        fetchWithRetry(() => contactAPI.getAll()),
        fetchWithRetry(() => skillsAPI.getAll()),
        fetchWithRetry(() => experienceAPI.getAll()),
        fetchWithRetry(() => quotesAPI.getAll()),
        fetchWithRetry(() => resumeAPI.getAll()).catch(() => ({ data: { data: [] } })) // Resume API might fail initially
      ]);

      setAnalytics(analyticsRes.data);
      setProjects(projectsRes.data?.data || []);
      setBlogs(sortBlogsList(blogsRes.data?.data || []));
      setContacts(contactsRes.data?.data || []);
      const flatSkills = Array.isArray(skillsRes.data?.list)
        ? skillsRes.data.list
        : Object.values(skillsRes.data?.data || {}).flat();
      setSkills(flatSkills);
      setExperiences(sortExperiencesList(experienceRes.data?.data || []));
      setQuotes(quotesRes.data?.data || []);
      setResumes(resumesRes.data?.data || []);
    } catch (err) {
      const message =
        err?.response?.status === 429
          ? 'Too many requests. Please wait a moment and try again.'
          : err.message;
      setError(message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showCreateModal) {
      setFormData({});
      setFormError('');
      setSlugManuallyEdited(false);
      setEditingBlog(null); // Clear editing blog when modal is closed
      setEditMode(false);
      resetImageState();
      return;
    }

    // Only set form data if not in edit mode (edit mode data is set by edit button)
    if (!editingBlog) {
      if (createType === 'experience') {
        setFormData({ ...initialFormData.experience });
        setSlugManuallyEdited(false);
      } else if (createType === 'blog') {
        setFormData({ ...initialFormData.blog });
        setSlugManuallyEdited(false);
      } else {
        setFormData({});
        setSlugManuallyEdited(false);
      }
    }
    setFormError('');
    resetImageState();
  }, [showCreateModal, createType]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;

    setFormData(prev => {
      const updated = { ...prev, [name]: nextValue };

      if (createType === 'blog') {
        if (name === 'title') {
          const previousAuto = generateSlug(prev.title || '');
          const currentSlug = prev.slug || '';
          if (!slugManuallyEdited || currentSlug === previousAuto) {
            updated.slug = generateSlug(nextValue);
          }
        } else if (name === 'slug') {
          updated.slug = generateSlug(nextValue);
        }
      }

      return updated;
    });

    if (createType === 'blog' && name === 'slug') {
      setSlugManuallyEdited(true);
    }
  };

  // Image handling functions
  const resetImageState = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setUploadingImage(false);
    // Don't clear editingBlog here - it should only be cleared when modal is closed
    // Reset the file input
    const fileInput = document.getElementById('cover-image-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    resetImageState();
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setFormError('');

    try {
      if (createType === 'experience') {
        const payload = {
          position: sanitizeString(formData.position),
          company: sanitizeString(formData.company),
          location: sanitizeString(formData.location) || undefined,
          type: formData.type,
          startDate: formData.startDate,
          endDate: formData.current ? undefined : formData.endDate || undefined,
          current: !!formData.current,
          description: sanitizeString(formData.description),
          responsibilities: formData.responsibilities ? parseListField(formData.responsibilities) : [],
          achievements: formData.achievements ? parseListField(formData.achievements) : [],
          technologies: formData.technologies ? parseListField(formData.technologies) : [],
          website: sanitizeString(formData.website) || undefined,
        };

        if (formData.order !== '') {
          payload.order = Number(formData.order);
        }

        Object.keys(payload).forEach(key => {
          if (
            payload[key] === undefined ||
            (Array.isArray(payload[key]) && payload[key].length === 0) ||
            payload[key] === ''
          ) {
            delete payload[key];
          }
        });

        const response = await experienceAPI.create(payload);
        const newExperience = response.data?.data;

        if (newExperience) {
          setExperiences(prev => sortExperiencesList([...(prev || []), newExperience]));
        } else {
          await fetchDashboardData();
        }

        setShowCreateModal(false);
        resetImageState();
      } else if (createType === 'blog') {
        const title = sanitizeString(formData.title);
        const excerpt = sanitizeString(formData.excerpt);
        const content = formData.content?.trim();
        const category = formData.category;
        const slugSource = formData.slug || title;
        const slug = generateSlug(slugSource);

        // Valid categories from Blog model
        const validCategories = ['Tutorial', 'Best Practices', 'Case Study', 'Tech Review', 'Career', 'Other'];

        // Enhanced validation
        if (!title || title.trim().length < 3) {
          setFormError('Title is required and must be at least 3 characters long.');
          setSubmitting(false);
          return;
        }

        if (!excerpt || excerpt.trim().length < 10) {
          setFormError('Excerpt is required and must be at least 10 characters long.');
          setSubmitting(false);
          return;
        }

        if (excerpt.length > 300) {
          setFormError('Excerpt cannot exceed 300 characters.');
          setSubmitting(false);
          return;
        }

        if (!content || content.trim().length < 50) {
          setFormError('Content is required and must be at least 50 characters long.');
          setSubmitting(false);
          return;
        }

        if (!category) {
          setFormError('Category is required.');
          setSubmitting(false);
          return;
        }

        if (!validCategories.includes(category)) {
          setFormError(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
          setSubmitting(false);
          return;
        }

        if (!slug || slug.trim().length < 3) {
          setFormError('Unable to generate a valid slug. Please provide a valid title or custom slug (minimum 3 characters).');
          setSubmitting(false);
          return;
        }

        // Validate cover image requirement - only required for new blogs, not updates
        if (!editingBlog && !selectedFile) {
          setFormError('Cover image is required. Please upload an image for your blog post.');
          setSubmitting(false);
          return;
        }

        // Create FormData for file upload
        const formDataToSend = new FormData();

        // Add all blog fields
        formDataToSend.append('title', title);
        formDataToSend.append('slug', slug);
        formDataToSend.append('excerpt', excerpt);
        formDataToSend.append('content', content);
        formDataToSend.append('category', category);
        formDataToSend.append('featured', !!formData.featured);
        formDataToSend.append('published', !!formData.published);

        if (formData.tags) {
          formDataToSend.append('tags', JSON.stringify(parseListField(formData.tags)));
        }

        if (formData.published && !formData.publishedAt && !editingBlog) {
          formDataToSend.append('publishedAt', new Date().toISOString());
        }

        // Add SEO metadata if provided
        const seoMeta = {
          metaTitle: sanitizeString(formData.seoTitle),
          metaDescription: sanitizeString(formData.seoDescription),
          keywords: formData.seoKeywords ? parseListField(formData.seoKeywords) : [],
        };

        if (seoMeta.metaTitle || seoMeta.metaDescription || (seoMeta.keywords && seoMeta.keywords.length)) {
          formDataToSend.append('seo', JSON.stringify({
            ...(seoMeta.metaTitle ? { metaTitle: seoMeta.metaTitle } : {}),
            ...(seoMeta.metaDescription ? { metaDescription: seoMeta.metaDescription } : {}),
            ...(seoMeta.keywords && seoMeta.keywords.length ? { keywords: seoMeta.keywords } : {}),
          }));
        }

        // Add cover image if selected (for both create and update)
        if (selectedFile) {
          formDataToSend.append('coverImage', selectedFile);
        }

        try {
          setUploadingImage(true);

          let response;
          let updatedBlog;

          if (editingBlog) {
            // Update existing blog
            response = await blogsAPI.update(editingBlog._id, formDataToSend);
            updatedBlog = response.data?.data;

            if (updatedBlog) {
              setBlogs(prev => sortBlogsList(prev.map(blog =>
                blog._id === editingBlog._id ? updatedBlog : blog
              )));
            } else {
              await fetchDashboardData();
            }
          } else {
            // Create new blog
            response = await blogsAPI.create(formDataToSend);
            updatedBlog = response.data?.data;

            if (updatedBlog) {
              setBlogs(prev => sortBlogsList([...(prev || []), updatedBlog]));
            } else {
              await fetchDashboardData();
            }
          }

          setShowCreateModal(false);
          resetImageState();
        } catch (apiError) {
          console.error('Blog operation API error:', apiError);

          // Enhanced error handling
          if (apiError.response) {
            // Server responded with error status
            const { status, data } = apiError.response;

            if (status === 400) {
              // Validation error
              if (data?.message) {
                setFormError(`Validation error: ${data.message}`);
              } else if (data?.errors) {
                const errorMessages = Object.values(data.errors).flat();
                setFormError(`Validation failed: ${errorMessages.join(', ')}`);
              } else {
                setFormError('Invalid blog data. Please check all fields and try again.');
              }
            } else if (status === 409) {
              // Conflict (duplicate slug)
              setFormError('A blog with this slug already exists. Please use a different title or slug.');
            } else if (status === 413) {
              // Payload too large
              setFormError('Blog content is too large. Please reduce the content length.');
            } else {
              setFormError(`Server error (${status}): ${data?.message || 'Unknown error occurred'}`);
            }
          } else if (apiError.request) {
            // Network error
            setFormError('Network error. Please check your internet connection and try again.');
          } else {
            // Other error
            setFormError(`Unexpected error: ${apiError.message}`);
          }

          setSubmitting(false);
          setUploadingImage(false);
          return;
        }
      } else if (createType === 'quote') {
        const payload = {
          text: sanitizeString(formData.text),
          author: sanitizeString(formData.author),
          field: sanitizeString(formData.field),
          category: formData.category || 'programming',
          command: sanitizeString(formData.command) || undefined,
          featured: !!formData.featured,
          tags: formData.tags ? parseListField(formData.tags) : [],
          source: sanitizeString(formData.source) || undefined,
          context: sanitizeString(formData.context) || undefined,
          priority: Number(formData.priority) || 0,
          active: formData.active !== undefined ? !!formData.active : true,
        };

        Object.keys(payload).forEach(key => {
          if (
            payload[key] === undefined ||
            (Array.isArray(payload[key]) && payload[key].length === 0) ||
            payload[key] === ''
          ) {
            delete payload[key];
          }
        });

        if (editMode && editItem) {
          // Update existing quote
          const response = await quotesAPI.update(editItem._id, payload);
          const updatedQuote = response.data?.data;

          if (updatedQuote) {
            setQuotes(prev => prev.map(q => q._id === editItem._id ? updatedQuote : q));
          } else {
            await fetchDashboardData();
          }
        } else {
          // Create new quote
          const response = await quotesAPI.create(payload);
          const newQuote = response.data?.data;

          if (newQuote) {
            setQuotes(prev => [...(prev || []), newQuote]);
          } else {
            await fetchDashboardData();
          }
        }

        setShowCreateModal(false);
        resetImageState();
      } else {
        setFormError('Creation flow for this content type is not implemented yet.');
      }
    } catch (err) {
      console.error('Error creating content:', err);
      const message = err.response?.data?.message || err.message || 'Failed to create content.';
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin-secret-login-portal');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  // Project management functions
  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowProjectModal(true);
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await projectsAPI.delete(projectId);
      setProjects(prev => prev.filter(p => p._id !== projectId));
      // You could add a success toast notification here
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const handleDeleteQuote = async (quoteId) => {
    if (!window.confirm('Are you sure you want to delete this quote? This action cannot be undone.')) {
      return;
    }

    try {
      await quotesAPI.delete(quoteId);
      setQuotes(prev => prev.filter(q => q._id !== quoteId));
      // You could add a success toast notification here
    } catch (error) {
      console.error('Error deleting quote:', error);
      alert('Failed to delete quote. Please try again.');
    }
  };

  const handleProjectSave = async (projectData) => {
    setProjectSubmitting(true);
    try {
      if (editingProject) {
        // Update existing project
        const response = await projectsAPI.update(editingProject._id, projectData);
        setProjects(prev => prev.map(p => p._id === editingProject._id ? response.data.data : p));
      } else {
        // Create new project
        const response = await projectsAPI.create(projectData);
        setProjects(prev => [response.data.data, ...prev]);
      }
      setShowProjectModal(false);
      setEditingProject(null);
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert(`Failed to save project. ${error.response?.data?.message || error.response?.data?.error || error.message || 'Please try again.'}`);
    } finally {
      setProjectSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 px-10 py-12 backdrop-blur-xl">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-transparent" />
          <p className="text-sm font-medium text-white/70">Preparing your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/10 p-8 text-center shadow-lg backdrop-blur-xl">
          <div className="mx-auto h-14 w-14 rounded-full border border-rose-500/40 bg-rose-500/20 text-rose-300/90 flex items-center justify-center text-2xl">
            !
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Error Loading Dashboard</h2>
            <p className="mt-2 text-sm text-white/70">{error}</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:from-sky-400 hover:to-cyan-400"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, accent = 'from-sky-500/80 to-cyan-400/60' }) => (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1 hover:bg-white/10">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white/70">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-white/20 to-white/5 text-white/90">
          {Icon && <Icon className="text-2xl" />}
        </div>
      </div>
      <div className={`absolute inset-x-4 bottom-2 h-px rounded-full bg-gradient-to-r ${accent}`} />
    </div>
  );

  const OverviewSection = () => (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-white/10 bg-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Latest Highlights</h3>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
            <HiSparkles className="text-base" />
            Live
          </span>
        </div>
        <div className="mt-6 space-y-4">
            {[
              {
                title: 'Analytics Refreshed',
                description: 'Visitor insights updated with the most recent tracking data.',
                icon: HiChartBar,
              },
              {
                title: 'Content Ready',
                description: 'Projects and blog posts are primed for the next publishing cycle.',
                icon: HiClipboardList,
              },
              {
                title: 'Community Pulse',
                description: `You have ${contacts.length} new conversations waiting for a response.`,
                icon: HiChatAlt2,
              },
            ].map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sky-200">
                  <Icon className="text-lg" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white/90">{item.title}</p>
                  <p className="text-xs text-white/60">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-lg">
        <h3 className="text-xl font-semibold text-white">Performance Snapshot</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-widest text-white/50">Visitor Growth</p>
            <p className="mt-3 text-2xl font-semibold text-white">{analytics?.totalVisits || 0}</p>
            <p className="mt-2 text-xs text-emerald-300/80">+18% vs last month</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-widest text-white/50">Conversion Rate</p>
            <p className="mt-3 text-2xl font-semibold text-white">4.2%</p>
            <p className="mt-2 text-xs text-emerald-300/80">Steady performance</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-widest text-white/50">Newsletter Growth</p>
            <p className="mt-3 text-2xl font-semibold text-white">127</p>
            <p className="mt-2 text-xs text-emerald-300/80">+9 new subscribers</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-widest text-white/50">Content Velocity</p>
            <p className="mt-3 text-2xl font-semibold text-white">{blogs.length} posts</p>
            <p className="mt-2 text-xs text-emerald-300/80">Latest post published recently</p>
          </div>
        </div>
      </div>
    </section>
  );

  const AnalyticsSection = () => (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Analytics Overview</h2>
        <span className="text-xs text-white/60">Updated {new Date().toLocaleDateString()}</span>
      </div>

      {analytics ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-lg">
            <h3 className="text-lg font-semibold text-white">Visitor Statistics</h3>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="space-y-1">
                  <p className="text-sm text-white/60">Total Visits</p>
                  <p className="text-2xl font-semibold text-white">{analytics.totalVisits}</p>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-200">+12.4%</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="space-y-1">
                  <p className="text-sm text-white/60">Unique Visitors</p>
                  <p className="text-2xl font-semibold text-white">{analytics.uniqueVisitors}</p>
                </div>
                <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs text-sky-200">+8.1%</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-lg">
            <h3 className="text-lg font-semibold text-white">Device Breakdown</h3>
            <div className="mt-6 space-y-3">
              {analytics.deviceStats?.length ? (
                analytics.deviceStats.map(device => (
                  <div key={device._id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                    <span className="text-sm font-medium text-white/80 capitalize">{device._id || 'Unknown'}</span>
                    <span className="text-sm text-white/60">{device.count} visitors</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/60">No device data available.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-lg lg:col-span-2">
            <h3 className="text-lg font-semibold text-white">Top Pages</h3>
            <div className="mt-6 space-y-4">
              {analytics.topPages?.length ? (
                analytics.topPages.slice(0, 5).map((page, index) => (
                  <div key={page._id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex items-center gap-4">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sm font-semibold text-white/80">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white/90">{page._id}</p>
                        <p className="text-xs text-white/60">{page.views} total views</p>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-200">+3.2%</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/60">No page data available.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 text-center text-white/70 backdrop-blur-xl">
          Analytics data not available yet.
        </div>
      )}
    </section>
  );

  const ContentSection = () => (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Content Management</h2>
          <p className="text-sm text-white/60">Review and curate your public-facing work.</p>
        </div>
        <button
          onClick={() => {
            setCreateType('blog');
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:from-purple-400 hover:to-fuchsia-400"
        >
          <HiPlus className="text-base" />
          New Blog Post
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Projects</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setEditingProject(null);
                  setShowProjectModal(true);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/10"
              >
                <HiPlus className="text-sm" />
                Add Project
              </button>
              <span className="text-xs text-white/60">{projects.length} total</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {projects.slice(0, 5).map(project => (
              <div key={project._id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white/80">{project.title}</p>
                  <p className="text-xs text-white/50">{project.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setShowProjectModal(true);
                    }}
                    className="rounded-full border border-sky-400/40 bg-sky-500/15 p-2 text-sky-200 transition hover:border-sky-300/60 hover:bg-sky-500/25"
                    title="Edit project"
                  >
                    <HiPencil className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="rounded-full border border-red-400/40 bg-red-500/15 p-2 text-red-200 transition hover:border-red-300/60 hover:bg-red-500/25"
                    title="Delete project"
                  >
                    <HiTrash className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
            {projects.length > 5 && (
              <p className="text-xs text-white/60">...and {projects.length - 5} more projects</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Blog Posts</h3>
            <span className="text-xs text-white/60">{blogs.length} total</span>
          </div>
          <div className="mt-6 space-y-3">
            {blogs.slice(0, 5).map(blog => (
              <div key={blog._id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 group hover:bg-white/10 transition-colors duration-200">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white/80 group-hover:text-white/90 transition-colors">
                    {blog.title}
                  </p>
                  <p className="text-xs text-white/50">
                    {blog.published ? 'Published' : 'Draft'} {new Date(blog.createdAt || blog.publishedAt).toLocaleDateString()}
                  </p>
                  {blog.category && (
                    <span className="inline-block px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full mt-1">
                      {blog.category}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {/* View Blog */}
                  <button
                    onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 hover:text-white/90 transition-all duration-200"
                    title="View blog"
                  >
                    <HiEye className="w-4 h-4" />
                  </button>

                  {/* Edit Blog */}
                  <button
                    onClick={() => {
                      setEditingBlog(blog);
                      setEditMode(true);
                      setCreateType('blog');
                      // Pre-fill form data with blog data
                      const blogFormData = {
                        title: blog.title || '',
                        slug: blog.slug || '',
                        excerpt: blog.excerpt || '',
                        content: blog.content || '',
                        category: blog.category || 'Tutorial',
                        tags: blog.tags?.join(', ') || '',
                        featured: blog.featured || false,
                        published: blog.published || false,
                        seoTitle: blog.seo?.metaTitle || '',
                        seoDescription: blog.seo?.metaDescription || '',
                        seoKeywords: blog.seo?.keywords?.join(', ') || '',
                        publishedAt: blog.publishedAt || blog.createdAt || '',
                      };
                      setFormData(blogFormData);
                      setSlugManuallyEdited(true); // Don't auto-generate slug when editing
                      setShowCreateModal(true);
                    }}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-blue-500/20 border border-white/20 text-white/70 hover:text-blue-400 transition-all duration-200"
                    title="Edit blog"
                  >
                    <HiPencil className="w-4 h-4" />
                  </button>

                  {/* Delete Blog */}
                  <button
                    onClick={() => {
                      setDeleteTarget(blog);
                      setShowDeleteModal(true);
                    }}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/20 border border-white/20 text-white/70 hover:text-red-400 transition-all duration-200"
                    title="Delete blog"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {blogs.length > 5 && (
              <p className="text-xs text-white/60 text-center py-2">
                ...and {blogs.length - 5} more stories
                {blogs.length > 5 && (
                  <button
                    onClick={() => navigate('/admin/blog-management')}
                    className="text-amber-400 hover:text-amber-300 underline ml-2"
                  >
                    View all
                  </button>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  const MessagesSection = () => (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Inbox</h2>
          <p className="text-sm text-white/60">Stay connected with prospects and collaborators.</p>
        </div>
        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-100">
          {contacts.length} total messages
        </span>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-lg">
        <div className="space-y-4">
          {contacts.slice(0, 10).map(contact => (
            <div key={contact._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white/90">{contact.name}</p>
                  <p className="text-xs text-white/50">{contact.email}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                  <button className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-emerald-100 transition hover:border-emerald-300/60 hover:bg-emerald-500/25">
                    Mark Read
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm text-white/70">{contact.message}</p>
            </div>
          ))}
          {contacts.length === 0 && (
            <p className="py-10 text-center text-sm text-white/60">No new messages yet.</p>
          )}
        </div>
      </div>
    </section>
  );

  const ResumeSection = () => (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Resume Management</h2>
        <p className="text-sm text-white/60">Upload and manage your resume PDFs.</p>
      </div>

      <ResumeUpload resumes={resumes} onRefresh={fetchDashboardData} />
    </section>
  );

  const ManageSection = () => (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Content Controls</h2>
        <p className="text-sm text-white/60">Create, curate, and refine portfolio entities.</p>
      </div>

      <div className="grid gap-4 xs:gap-5 sm:gap-6 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-4 xs:p-5 sm:p-6 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Skills</h3>
            <button
              onClick={() => {
                setCreateType('skill');
                setShowCreateModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/10"
            >
              <HiPlus className="text-sm" />
              Add Skill
            </button>
          </div>
          <div className="mt-6 space-y-3">
            {skills.slice(0, 5).map(skill => (
              <div key={skill._id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 xs:px-4 py-3">
                <span className="text-sm text-white/80 truncate flex-1 mr-3">{skill.name}</span>
                <button className="text-xs text-sky-200 transition hover:text-sky-100 flex-shrink-0 px-2 py-1 rounded-lg hover:bg-sky-500/10">Manage</button>
              </div>
            ))}
            {skills.length === 0 && <p className="text-xs text-white/60">No skills yet.</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-4 xs:p-5 sm:p-6 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Experience</h3>
            <button
              onClick={() => {
                setCreateType('experience');
                setShowCreateModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/10"
            >
              <HiPlus className="text-sm" />
              Add Role
            </button>
          </div>
          <div className="mt-6 space-y-3">
            {experiences.slice(0, 3).map(exp => (
              <div key={exp._id} className="rounded-2xl border border-white/10 bg-white/5 p-3 xs:p-4">
                <div className="flex flex-col gap-2 xs:flex-row xs:items-start xs:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white/80 truncate">{exp.position}</p>
                    <p className="text-xs text-white/50 truncate">{exp.company}</p>
                  </div>
                  <span className="text-xs text-white/50 whitespace-nowrap xs:ml-2">{formatExperienceRange(exp.startDate, exp.endDate, exp.current)}</span>
                </div>
                <div className="mt-2 flex flex-col gap-1 xs:flex-row xs:items-center xs:justify-between text-xs text-white/50">
                  <span className="truncate">{calculateExperienceDuration(exp.startDate, exp.endDate, exp.current)}</span>
                  <span className="truncate">{exp.location || 'Remote'}</span>
                </div>
              </div>
            ))}
            {experiences.length === 0 && <p className="text-xs text-white/60">No experience entries yet.</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-4 xs:p-5 sm:p-6 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Quotes</h3>
            <button
              onClick={() => {
                setCreateType('quote');
                setShowCreateModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/10"
            >
              <HiPlus className="text-sm" />
              Add Quote
            </button>
          </div>
          <div className="mt-6 space-y-3">
            {quotes.slice(0, 5).map(quote => (
              <div key={quote._id} className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 xs:p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white/80 line-clamp-2">"{quote.text}"</p>
                  <p className="text-xs text-white/50 truncate mt-1">- {quote.author}</p>
                </div>
                <div className="flex items-center gap-2 xs:gap-3 flex-shrink-0">
                  <button
                    onClick={() => {
                      setEditItem(quote);
                      setEditMode(true);
                      setCreateType('quote');
                      setShowCreateModal(true);
                    }}
                    className="rounded-full border border-sky-400/40 bg-sky-500/15 p-2.5 text-sky-200 transition hover:border-sky-300/60 hover:bg-sky-500/25"
                    title="Edit quote"
                  >
                    <HiPencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuote(quote._id)}
                    className="rounded-full border border-red-400/40 bg-red-500/15 p-2.5 text-red-200 transition hover:border-red-300/60 hover:bg-red-500/25"
                    title="Delete quote"
                  >
                    <HiTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {quotes.length === 0 && <p className="text-xs text-white/60">No quotes yet.</p>}
            {quotes.length > 5 && (
              <p className="text-xs text-white/60">...and {quotes.length - 5} more quotes</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-4 xs:p-5 sm:p-6 backdrop-blur-xl shadow-lg">
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          <div className="mt-6 space-y-3">
            {[
              { label: 'Export Analytics', hint: 'Download', icon: HiCloudUpload },
              { label: 'Send Newsletter', hint: 'Campaign', icon: HiPaperAirplane },
              { label: 'Backup Data', hint: 'Secure', icon: HiDatabase },
            ].map(action => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 xs:px-4 py-3 xs:py-4 text-left text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 xs:h-11 xs:w-11 items-center justify-center rounded-xl bg-white/10 text-white/70">
                      <Icon className="text-base xs:text-lg" />
                    </span>
                    <span className="text-sm xs:text-base">{action.label}</span>
                  </span>
                  <span className="text-xs text-white/50">{action.hint}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsSection />;
      case 'content':
        return <ContentSection />;
      case 'messages':
        return <MessagesSection />;
      case 'resume':
        return <ResumeSection />;
      case 'manage':
        return <ManageSection />;
      case 'overview':
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(236,72,153,0.18),transparent_65%)]" />
        <div className="absolute inset-y-0 right-[-30%] h-[120%] w-[60%] rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Control Center</p>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">Portfolio Command Dashboard</h1>
              <p className="max-w-xl text-sm text-white/70">
                Monitor performance, publish updates, and stay connected with your audience.
              </p>
            </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Home Button */}
              <button
                onClick={handleGoHome}
                className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-white/10 bg-white/5 px-4 sm:px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:border-white/30 hover:bg-white/10 hover:shadow-emerald-500/30"
              >
                <HiHome className="text-base sm:text-lg" />
                <span className="text-xs sm:text-sm">Home</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-white/10 bg-white/5 px-4 sm:px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:border-white/30 hover:bg-white/10 hover:shadow-sky-500/30"
              >
                <HiArrowSmRight className="text-base sm:text-lg" />
                <span className="text-xs sm:text-sm">Logout</span>
              </button>
            </div>
          </div>
          <div className="border-t border-white/10" />
          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard title="Total Projects" value={projects.length} icon={HiViewGrid} accent="from-sky-500/80 to-cyan-400/50" />
            <StatCard title="Published Blogs" value={blogs.length} icon={HiDocumentText} accent="from-purple-500/80 to-fuchsia-400/50" />
            <StatCard title="Skills" value={skills.length} icon={HiUsers} accent="from-emerald-500/80 to-teal-400/50" />
            <StatCard title="Experience" value={experiences.length} icon={HiBriefcase} accent="from-orange-500/80 to-amber-400/50" />
            <StatCard title="Quotes" value={quotes.length} icon={HiSparkles} accent="from-teal-500/80 to-cyan-400/50" />
            <StatCard title="Messages" value={contacts.length} icon={HiMail} accent="from-rose-500/80 to-pink-400/50" />
            <StatCard title="Total Visitors" value={analytics?.totalVisits || 0} icon={HiChartBar} accent="from-indigo-500/80 to-blue-400/50" />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-10">
          <div className="grid gap-3 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {tabs.map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10 ${isActive ? 'border-sky-400/60 bg-sky-500/10 shadow-lg shadow-sky-500/20' : ''}`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${isActive ? 'bg-sky-500/25 text-sky-200' : 'bg-white/10 text-white/70'}`}>
                      <TabIcon className="text-lg" />
                    </span>
                    <span className="text-sm font-semibold text-white/90">{tab.label}</span>
                  </span>
                  </button>
              );
            })}
          </div>
        </div>

        <main className="mt-10 flex-1 space-y-10">
          {renderActiveTab()}
        </main>

      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-10 backdrop-blur-md">
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4">
              <h3 className="text-lg font-semibold text-white">
                {editingBlog ? 'Edit Blog Post' : createType === 'blog' ? 'Create New Blog Post' : `Create New ${createType}`}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetImageState();
                }}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
              <form className="space-y-6" onSubmit={handleCreateSubmit}>
                {createType === 'project' && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Project Title"
                      className="md:col-span-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    />
                    <textarea
                      placeholder="Project Description"
                      rows="3"
                      className="md:col-span-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    ></textarea>
                    <input
                      type="text"
                      placeholder="Category"
                      className="md:col-span-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                )}

                {createType === 'blog' && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Blog Title"
                      name="title"
                      value={formData.title || ''}
                      onChange={handleInputChange}
                      required
                      className="md:col-span-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Slug (auto-generated)"
                      name="slug"
                      value={formData.slug || ''}
                      onChange={handleInputChange}
                      className="md:col-span-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    />
                    <textarea
                      placeholder="Short Excerpt"
                      name="excerpt"
                      value={formData.excerpt || ''}
                      onChange={handleInputChange}
                      rows="3"
                      required
                      className="md:col-span-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    ></textarea>
                    <select
                      name="category"
                      value={formData.category || 'Tutorial'}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    >
                      <option value="">Select Category</option>
                      {blogCategories.map(option => (
                        <option key={option} value={option} className="text-black">
                          {option}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Tags (comma separated)"
                      name="tags"
                      value={formData.tags || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    />
                    <div className="md:col-span-2 flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <label className="flex items-center gap-2 text-sm text-white/70">
                        <input
                          type="checkbox"
                          name="published"
                          checked={!!formData.published}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-white/20 bg-transparent text-sky-500 focus:ring-sky-500"
                        />
                        Published
                      </label>
                      <label className="flex items-center gap-2 text-sm text-white/70">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={!!formData.featured}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-white/20 bg-transparent text-sky-500 focus:ring-sky-500"
                        />
                        Featured
                      </label>
                    </div>
                    <textarea
                      placeholder="Full Content"
                      name="content"
                      value={formData.content || ''}
                      onChange={handleInputChange}
                      rows="6"
                      required
                      className="md:col-span-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    ></textarea>
                    <input
                      type="text"
                      placeholder="SEO Meta Title"
                      name="seoTitle"
                      value={formData.seoTitle || ''}
                      onChange={handleInputChange}
                      className="md:col-span-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    />
                    <textarea
                      placeholder="SEO Meta Description"
                      name="seoDescription"
                      value={formData.seoDescription || ''}
                      onChange={handleInputChange}
                      rows="2"
                      className="md:col-span-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    ></textarea>
                    <input
                      type="text"
                      placeholder="SEO Keywords (comma separated)"
                      name="seoKeywords"
                      value={formData.seoKeywords || ''}
                      onChange={handleInputChange}
                      className="md:col-span-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    />

                    {/* Cover Image Upload */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Cover Image {editingBlog ? '(Optional - leave empty to keep current)' : <span className="text-red-400">*</span>}
                      </label>
                      <div className="space-y-4">
                        {/* Current Image Display (for editing) */}
                        {editingBlog && editingBlog.coverImage?.url && !imagePreview && (
                          <div className="relative">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-white/60">Current cover image:</span>
                            </div>
                            <img
                              src={editingBlog.coverImage.url}
                              alt="Current cover"
                              className="w-full h-48 object-cover rounded-xl border border-white/10"
                            />
                          </div>
                        )}

                        {/* File Input */}
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                            id="cover-image-upload"
                            required={!editingBlog}
                          />
                          <label
                            htmlFor="cover-image-upload"
                            className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-white/40 transition-colors duration-200 bg-white/5 hover:bg-white/10"
                          >
                            <div className="flex items-center gap-3">
                              <HiPhotograph className="w-5 h-5 text-white/60" />
                              <span className="text-sm text-white/80">
                                {selectedFile ? selectedFile.name : (editingBlog ? 'Choose new cover image (optional)' : 'Choose cover image')}
                              </span>
                            </div>
                          </label>
                        </div>

                        {/* Image Preview */}
                        {imagePreview && (
                          <div className="relative">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-white/60">New cover image preview:</span>
                              <button
                                type="button"
                                onClick={handleImageRemove}
                                className="text-xs text-red-400 hover:text-red-300"
                              >
                                Remove new image
                              </button>
                            </div>
                            <img
                              src={imagePreview}
                              alt="New cover preview"
                              className="w-full h-48 object-cover rounded-xl border border-white/10"
                            />
                            {uploadingImage && (
                              <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                                <div className="flex items-center gap-2 text-white">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-sm">Uploading...</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <p className="text-xs text-white/60">
                          {editingBlog
                            ? 'Optional: Upload a new cover image to replace the current one. Accepted formats: JPG, PNG, GIF, WebP. Max size: 5MB.'
                            : 'Required: Upload a cover image for your blog post. Accepted formats: JPG, PNG, GIF, WebP. Max size: 5MB.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {createType === 'skill' && (
                  <div className="grid gap-4">
                    <input
                      type="text"
                      placeholder="Skill Name"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    />
                    <select className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none">
                      <option value="" className="text-black">Select Category</option>
                      <option value="frontend" className="text-black">Frontend</option>
                      <option value="backend" className="text-black">Backend</option>
                      <option value="tools" className="text-black">Tools</option>
                      <option value="other" className="text-black">Other</option>
                    </select>
                  </div>
                )}

                {createType === 'experience' && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Position"
                      name="position"
                      value={formData.position || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      name="company"
                      value={formData.company || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      name="location"
                      value={formData.location || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    />
                    <select
                      name="type"
                      value={formData.type || 'Full-time'}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    >
                      {experienceTypes.map(option => (
                        <option key={option} value={option} className="text-black">
                          {option}
                        </option>
                      ))}
                    </select>
                    <div className="md:col-span-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                      <input
                        type="checkbox"
                        id="current-role"
                        name="current"
                        checked={!!formData.current}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-white/20 bg-transparent text-sky-500 focus:ring-sky-500"
                      />
                      <label htmlFor="current-role">This is my current role</label>
                    </div>
                    <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-white/60">From</span>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate || ''}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-white/60">To</span>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate || ''}
                          onChange={handleInputChange}
                          disabled={!!formData.current}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white disabled:opacity-60 focus:border-sky-400 focus:outline-none"
                        />
                      </div>
                    </div>
                    <textarea
                      placeholder="Role Description"
                      name="description"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      rows="3"
                      required
                      className="md:col-span-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    ></textarea>
                    <textarea
                      placeholder="Responsibilities (comma separated)"
                      name="responsibilities"
                      value={formData.responsibilities || ''}
                      onChange={handleInputChange}
                      rows="2"
                      className="md:col-span-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    ></textarea>
                    <textarea
                      placeholder="Key Achievements (comma separated)"
                      name="achievements"
                      value={formData.achievements || ''}
                      onChange={handleInputChange}
                      rows="2"
                      className="md:col-span-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    ></textarea>
                    <textarea
                      placeholder="Technologies (comma separated)"
                      name="technologies"
                      value={formData.technologies || ''}
                      onChange={handleInputChange}
                      rows="2"
                      className="md:col-span-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    ></textarea>
                    <input
                      type="url"
                      placeholder="Company Website"
                      name="website"
                      value={formData.website || ''}
                      onChange={handleInputChange}
                      className="md:col-span-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Display Order (optional)"
                      name="order"
                      value={formData.order || ''}
                      onChange={handleInputChange}
                      className="md:col-span-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                )}

                {createType === 'quote' && (
                  <div className="grid gap-4">
                    <textarea
                      placeholder="Quote Text *"
                      name="text"
                      value={formData.text || ''}
                      onChange={handleInputChange}
                      rows="3"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    ></textarea>
                    <input
                      type="text"
                      placeholder="Author *"
                      name="author"
                      value={formData.author || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Field/Category"
                      name="field"
                      value={formData.field || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    />
                    <select
                      name="category"
                      value={formData.category || 'programming'}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    >
                      <option value="programming" className="text-black">Programming</option>
                      <option value="development" className="text-black">Development</option>
                      <option value="technology" className="text-black">Technology</option>
                      <option value="innovation" className="text-black">Innovation</option>
                      <option value="design" className="text-black">Design</option>
                      <option value="leadership" className="text-black">Leadership</option>
                      <option value="ai" className="text-black">AI</option>
                      <option value="web" className="text-black">Web</option>
                      <option value="software" className="text-black">Software</option>
                      <option value="other" className="text-black">Other</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Code Command (optional)"
                      name="command"
                      value={formData.command || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    />
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm text-white/70">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={!!formData.featured}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-white/20 bg-transparent text-sky-500 focus:ring-sky-500"
                        />
                        Featured
                      </label>
                      <label className="flex items-center gap-2 text-sm text-white/70">
                        <input
                          type="checkbox"
                          name="active"
                          checked={formData.active !== undefined ? !!formData.active : true}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-white/20 bg-transparent text-green-500 focus:ring-green-500"
                        />
                        <span className="flex items-center gap-1.5 font-mono">
                          <span className="text-green-400">●</span>
                          <span>Enable</span>
                        </span>
                      </label>
                    </div>
                    <input
                      type="number"
                      placeholder="Priority (0 = highest priority)"
                      name="priority"
                      value={formData.priority || 0}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Tags (comma separated)"
                      name="tags"
                      value={formData.tags || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Source (optional)"
                      name="source"
                      value={formData.source || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    />
                    <textarea
                      placeholder="Context (optional)"
                      name="context"
                      value={formData.context || ''}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    ></textarea>
                  </div>
                )}

                {formError && <p className="text-sm text-rose-300">{formError}</p>}

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:from-sky-400 hover:to-cyan-400 ${submitting ? 'cursor-not-allowed opacity-60' : ''}`}
                  >
                    {submitting ? (editingBlog ? 'Updating...' : 'Creating...') : (editingBlog ? 'Update Blog Post' : 'Create Blog Post')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetImageState();
                    }}
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <HiTrash className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Blog Post
              </h3>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete "{deleteTarget.title}"? This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await blogsAPI.delete(deleteTarget._id);
                    setBlogs(prev => prev.filter(blog => blog._id !== deleteTarget._id));
                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                  } catch (error) {
                    console.error('Error deleting blog:', error);
                    // You could show an error message here
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Edit Modal */}
      <ProjectEditModal
        isOpen={showProjectModal}
        onClose={() => {
          setShowProjectModal(false);
          setEditingProject(null);
        }}
        project={editingProject}
        onSave={handleProjectSave}
        isLoading={projectSubmitting}
      />
    </div>
  );
};

export default AdminDashboard;
