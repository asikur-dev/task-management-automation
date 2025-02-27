// ## **4.1. `src/services/companyService.js`**

// src/services/companyService.js
import api from './api';

// GET /company/profile
export async function getCompanyProfile() {
  const response = await api.get('/company/profile');
  return response.data;
}

// PUT /company/profile
export async function updateCompanyProfile(profileData) {
  const response = await api.put('/company/profile', profileData);
  return response.data; // { message: 'Profile updated' }
}