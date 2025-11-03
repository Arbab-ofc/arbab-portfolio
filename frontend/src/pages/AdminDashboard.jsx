import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsAPI, projectsAPI, blogsAPI, contactAPI, skillsAPI, experienceAPI } from '../utils/api';
import ProjectEditModal from '../components/admin/ProjectEditModal';
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
  HiDatabase,
  HiPlus,
  HiSparkles,
  HiPencil,
  HiTrash,
} from 'react-icons/hi';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
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

  // Project management state
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectSubmitting, setProjectSubmitting] = useState(false);

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
  { id: 'manage', label: 'Manage', icon: HiCog },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, projectsRes, blogsRes, contactsRes, skillsRes, experienceRes] = await Promise.all([
        fetchWithRetry(() => analyticsAPI.getOverview()).catch(() => ({ data: { totalVisits: 0, uniqueVisitors: 0, deviceStats: [], topPages: [] } })),
        fetchWithRetry(() => projectsAPI.getAll()),
        fetchWithRetry(() => blogsAPI.getAll()),
        fetchWithRetry(() => contactAPI.getAll()),
        fetchWithRetry(() => skillsAPI.getAll()),
        fetchWithRetry(() => experienceAPI.getAll())
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
      return;
    }

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
    setFormError('');
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
      } else if (createType === 'blog') {
        const title = sanitizeString(formData.title);
        const excerpt = sanitizeString(formData.excerpt);
        const content = formData.content?.trim();
        const category = formData.category;
        const slugSource = formData.slug || title;
        const slug = generateSlug(slugSource);

        if (!title || !excerpt || !content || !category) {
          setFormError('Title, excerpt, category, and content are required.');
          setSubmitting(false);
          return;
        }

        if (!slug) {
          setFormError('Unable to generate a slug. Please provide a valid title or slug.');
          setSubmitting(false);
          return;
        }

        const payload = {
          title,
          slug,
          excerpt,
          content,
          category,
          tags: formData.tags ? parseListField(formData.tags) : [],
          featured: !!formData.featured,
          published: !!formData.published,
        };

        if (payload.published && !formData.publishedAt) {
          payload.publishedAt = new Date().toISOString();
        }

        const seoMeta = {
          metaTitle: sanitizeString(formData.seoTitle),
          metaDescription: sanitizeString(formData.seoDescription),
          keywords: formData.seoKeywords ? parseListField(formData.seoKeywords) : [],
        };

        if (seoMeta.metaTitle || seoMeta.metaDescription || (seoMeta.keywords && seoMeta.keywords.length)) {
          payload.seo = {
            ...(seoMeta.metaTitle ? { metaTitle: seoMeta.metaTitle } : {}),
            ...(seoMeta.metaDescription ? { metaDescription: seoMeta.metaDescription } : {}),
            ...(seoMeta.keywords && seoMeta.keywords.length ? { keywords: seoMeta.keywords } : {}),
          };
        }

        const response = await blogsAPI.create(payload);
        const newBlog = response.data?.data;

        if (newBlog) {
          setBlogs(prev => sortBlogsList([...(prev || []), newBlog]));
        } else {
          await fetchDashboardData();
        }

        setShowCreateModal(false);
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
              <div key={blog._id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white/80">{blog.title}</p>
                  <p className="text-xs text-white/50">Published {new Date(blog.createdAt).toLocaleDateString()}</p>
                </div>
                <HiDocumentText className="text-lg text-white/40" />
              </div>
            ))}
            {blogs.length > 5 && (
              <p className="text-xs text-white/60">...and {blogs.length - 5} more stories</p>
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

  const ManageSection = () => (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Content Controls</h2>
        <p className="text-sm text-white/60">Create, curate, and refine portfolio entities.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl shadow-lg">
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
              <div key={skill._id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-sm text-white/80">{skill.name}</span>
                <button className="text-xs text-sky-200 transition hover:text-sky-100">Manage</button>
              </div>
            ))}
            {skills.length === 0 && <p className="text-xs text-white/60">No skills yet.</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl shadow-lg">
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
              <div key={exp._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white/80">{exp.position}</p>
                    <p className="text-xs text-white/50">{exp.company}</p>
                  </div>
                  <span className="text-xs text-white/50">{formatExperienceRange(exp.startDate, exp.endDate, exp.current)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-white/50">
                  <span>{calculateExperienceDuration(exp.startDate, exp.endDate, exp.current)}</span>
                  <span>{exp.location || 'Remote'}</span>
                </div>
              </div>
            ))}
            {experiences.length === 0 && <p className="text-xs text-white/60">No experience entries yet.</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl shadow-lg">
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
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white/70">
                      <Icon className="text-base" />
                    </span>
                    {action.label}
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
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:border-white/30 hover:bg-white/10"
            >
              <HiArrowSmRight className="text-lg" />
              <span>Log out</span>
            </button>
          </div>
          <div className="border-t border-white/10" />
          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard title="Total Projects" value={projects.length} icon={HiViewGrid} accent="from-sky-500/80 to-cyan-400/50" />
            <StatCard title="Published Blogs" value={blogs.length} icon={HiDocumentText} accent="from-purple-500/80 to-fuchsia-400/50" />
            <StatCard title="Skills" value={skills.length} icon={HiUsers} accent="from-emerald-500/80 to-teal-400/50" />
            <StatCard title="Experience" value={experiences.length} icon={HiBriefcase} accent="from-orange-500/80 to-amber-400/50" />
            <StatCard title="Messages" value={contacts.length} icon={HiMail} accent="from-rose-500/80 to-pink-400/50" />
            <StatCard title="Total Visitors" value={analytics?.totalVisits || 0} icon={HiChartBar} accent="from-indigo-500/80 to-blue-400/50" />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-10">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
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
                  {isActive && (
                    <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs text-sky-100">Active</span>
                  )}
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
              <h3 className="text-lg font-semibold text-white">Create New {createType}</h3>
              <button
                onClick={() => setShowCreateModal(false)}
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

                {formError && <p className="text-sm text-rose-300">{formError}</p>}

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:from-sky-400 hover:to-cyan-400 ${submitting ? 'cursor-not-allowed opacity-60' : ''}`}
                  >
                    {submitting ? 'Creating...' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
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
