/**
 * 
 * 
 * Create task
 * {
  "sessionId": 0,
  "task_title": "string",
  "task_details": "string"
}
 */

import api from "./api";

export async function getCheckinSessions() {
  const response = await api.get(`/checkin-sessions`);
  return response.data;
}

export async function getCheckinSessionsByEmployee(employeeId) {
  const response = await api.get(`/checkin-sessions/employee/${employeeId}`);
  return response.data; // array of tasks
}

export async function createCheckinSession(createData) {
    console.log({ createData });
  const response = await api.post("/checkin-sessions/create", createData);
  return response.data; // { id: 0 }
}

export async function startCheckin(data) {
  const response = await api.post(`/checkin-sessions/start`, data);
  return response.data; // { id: 0 }
}

export async function endCheckin(data) {
  const response = await api.delete(`/checkin-sessions/end`, data);
  return response.data; // { id: 0 }
}


export const updateCheckinSession = async (sessionId, updateData) => {
  const response = await api.put(`/checkin-sessions/${sessionId}`, updateData);
  return response.data; // { id: 0 }
};
export const deleteCheckinSession = async (sessionId) => {
  const response = await api.delete(`/checkin-sessions/${sessionId}`);
  return response.data; // { id: 0 }
};