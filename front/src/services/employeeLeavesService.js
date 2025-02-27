

import api from "./api";

export async function getEmployeeLeaves() {
  const response = await api.get(`/employee-leaves`);
  return response.data;
}
// {
//   "employee_id": 0,
//   "start_date": "2025-02-06",
//   "end_date": "2025-02-06",
//   "reason": "string"
// }
export async function createEmployeeLeave(leavesData) {
  // console.log({ leavesData });
  const response = await api.post("/employee-leaves", leavesData);
  return response.data; // 
}

export async function updateEmployeeLeave(employeeId,leavesData) {
  const response = await api.put(`/employee-leaves/${employeeId}`, leavesData);
  return response.data; // 
}

export async function deleteEmployeeLeave(employeeId) {
  const response = await api.delete(`/employee-leaves/${employeeId}`);
  return response.data; // 
}

