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

export async function getTasks() {
  const response = await api.get(`/tasks`);
  return response.data;
}

export async function createTask(task) {
  const response = await api.post("/tasks", task);
  return response.data; // { id: 0 }
}


export async function updateTask(id,task) {
  const response = await api.put(`/tasks/${id}`, task);
  return response.data; // { id: 0 }
}


export async function deleteTask(sessionId) {
  const response = await api.delete(`/tasks/${sessionId}`);
  return response.data; // { id: 0 }
}


export async function getTaskBySessionId(sessionId) {
  const response = await api.get(`/tasks/session/${sessionId}`);
  return response.data; // array of tasks
}
