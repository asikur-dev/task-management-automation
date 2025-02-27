// src/services/managerService.js
import api from './api';

// GET all managers for the company
export async function getManagers() {
  const response = await api.get('/managers'); // GET /managers
  return response.data; // array of managers
}

// GET manager profile
export async function getManagerProfile() {
  const response = await api.get(`/managers/profile`); // GET /managers/:id
  return response.data; // manager
}

// POST /managers/add => add a manager
export async function addManager({ name, email, password }) {
  const response = await api.post('/managers/add', { name, email, password });
  return response.data; // { message: 'Manager created' }
}

// PUT /managers/deactivate/:id => deactivate
export async function deactivateManager(managerId) {
  const response = await api.put(`/managers/deactivate/${managerId}`);
  return response.data; // { message: 'Manager deactivated' }
}

// PUT /managers/reset-password/:id => reset password
export async function resetManagerPassword(managerId, newPassword) {
  const response = await api.put(`/managers/reset-password/${managerId}`, { newPassword });
  return response.data; // { message: 'Manager password reset' }
}

// PUT /managers/:id => update manager
export async function updateManager(managerId, updatedData) {
  const response = await api.put(`/managers/${managerId}`, updatedData);
  return response.data; // { message: 'Manager updated' }
}

// DELETE /managers/:id => delete manager
export async function deleteManager(managerId) {
  const response = await api.delete(`/managers/${managerId}`);
  return response.data; // { message: 'Manager deleted' }
}