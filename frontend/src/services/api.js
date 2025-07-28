import axios from '../api/axios';

// Spaces API
export const spacesAPI = {
  getAll: () => axios.get('/api/spaces'),
  getById: (id) => axios.get(`/api/spaces/${id}`),
  create: (data) => axios.post('/api/spaces', data),
  update: (id, data) => axios.put(`/api/spaces/${id}`, data),
  delete: (id) => axios.delete(`/api/spaces/${id}`)
};

// Pages API
export const pagesAPI = {
  getAll: (params) => axios.get('/api/pages', { params }),
  getById: (id) => axios.get(`/api/pages/${id}`),
  create: (data) => axios.post('/api/pages', data),
  update: (id, data) => axios.put(`/api/pages/${id}`, data),
  delete: (id) => axios.delete(`/api/pages/${id}`),
  search: (query, spaceId) => axios.get('/api/pages/search', { params: { q: query, spaceId } }),
  getVersions: (id) => axios.get(`/api/pages/${id}/versions`)
};

// Comments API
export const commentsAPI = {
  getByPage: (pageId) => axios.get(`/api/comments/page/${pageId}`),
  create: (data) => axios.post('/api/comments', data),
  update: (id, data) => axios.put(`/api/comments/${id}`, data),
  delete: (id) => axios.delete(`/api/comments/${id}`)
};

// Templates API
export const templatesAPI = {
  getAll: (params) => axios.get('/api/templates', { params }),
  getById: (id) => axios.get(`/api/templates/${id}`),
  create: (data) => axios.post('/api/templates', data),
  update: (id, data) => axios.put(`/api/templates/${id}`, data),
  delete: (id) => axios.delete(`/api/templates/${id}`),
  use: (id) => axios.post(`/api/templates/${id}/use`)
};

// Activities API
export const activitiesAPI = {
  getAll: (params) => axios.get('/api/activities', { params })
};

// Admin API
export const adminAPI = {
  getUsers: () => axios.get('/api/admin/users'),
  getStats: () => axios.get('/api/admin/stats'),
  getActivities: () => axios.get('/api/admin/activities'),
  updateUserRole: (userId, role) => axios.put(`/api/admin/users/${userId}/role`, { role }),
  deleteUser: (userId) => axios.delete(`/api/admin/users/${userId}`)
};