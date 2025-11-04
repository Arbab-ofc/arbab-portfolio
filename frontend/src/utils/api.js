import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getOne: (slug) => api.get(`/projects/${slug}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  incrementView: (id) => api.post(`/projects/${id}/view`),
  like: (id) => api.post(`/projects/${id}/like`),
};

export const blogsAPI = {
  getAll: (params) => api.get('/blogs', { params }),
  getAllForAdmin: (params) => api.get('/blogs/admin/all', { params }),
  getOne: (slug) => api.get(`/blogs/${slug}`),
  create: (data) => {
    // If data is FormData, let the browser set the content-type boundary
    if (data instanceof FormData) {
      return api.post('/blogs', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.post('/blogs', data);
  },
  update: (id, data) => {
    // If data is FormData, let the browser set the content-type boundary
    if (data instanceof FormData) {
      return api.put(`/blogs/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.put(`/blogs/${id}`, data);
  },
  delete: (id) => api.delete(`/blogs/${id}`),
  addComment: (id, data) => api.post(`/blogs/${id}/comments`, data),
};

export const skillsAPI = {
  getAll: () => api.get('/skills'),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
};

export const experienceAPI = {
  getAll: () => api.get('/experience'),
  create: (data) => api.post('/experience', data),
  update: (id, data) => api.put(`/experience/${id}`, data),
  delete: (id) => api.delete(`/experience/${id}`),
};

export const contactAPI = {
  send: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  updateStatus: (id, status) => api.put(`/contact/${id}`, { status }),
};

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  refreshToken: () => api.post('/auth/refresh'),
  getProfile: () => api.get('/auth/profile'),
};

export const newsletterAPI = {
  subscribe: (email) => api.post('/newsletter/subscribe', { email }),
};

export const guestbookAPI = {
  getAll: () => api.get('/guestbook'),
  create: (data) => api.post('/guestbook', data),
};

export const testimonialsAPI = {
  getAll: () => api.get('/testimonials'),
  create: (data) => api.post('/testimonials', data),
};

export const quotesAPI = {
  getAll: (params) => api.get('/quotes', { params }),
  getOne: (id) => api.get(`/quotes/${id}`),
  create: (data) => api.post('/quotes', data),
  update: (id, data) => api.put(`/quotes/${id}`, data),
  delete: (id) => api.delete(`/quotes/${id}`),
  getFeatured: (params) => api.get('/quotes/featured', { params }),
  getStats: () => api.get('/quotes/stats'),
};

export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview'),
  getVisitors: () => api.get('/analytics/visitors'),
};

export const resumeAPI = {
  upload: (formData) => {
    const formDataWithFile = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'resume') {
        formDataWithFile.append(key, formData[key]);
      }
    });
    formDataWithFile.append('resume', formData.resume);

    return api.post('/resume/upload', formDataWithFile, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getAll: (params) => api.get('/resume', { params }),
  getOne: (id) => api.get(`/resume/${id}`),
  getActive: () => api.get('/resume/active'),
  update: (id, data) => api.put(`/resume/${id}`, data),
  delete: (id) => api.delete(`/resume/${id}`),
  toggleStatus: (id) => api.patch(`/resume/${id}/toggle`),
};

export default api;
