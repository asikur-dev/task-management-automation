
// ## **3.1. `src/services/nonWorkingDaysService.js`**

// src/services/nonWorkingDaysService.js
import api from './api';

// GET /non-working-days
export async function getNonWorkingDays() {
  const response = await api.get('/non-working-days');
  return response.data; // array of { id, date_value, day_of_week, description }
}

// POST /non-working-days
export async function addNonWorkingDay(data) {
  const response = await api.post('/non-working-days', data);
  return response.data;
}

// DELETE /non-working-days/:id
export async function deleteNonWorkingDay(id) {
  const response = await api.delete(`/non-working-days/${id}`);
  return response.data;
}