// src/services/employeeService.js
import api from "./api";

export async function getEmployees() {
  // Manager role: GET /employees
  const response = await api.get("/employees");
  return response.data; // array of employees
}

export async function getEmployeeProfile() {
  // Manager role: GET /employees/profile
  const response = await api.get(`/employees/profile`);
  return response.data; // employee
}

export async function createEmployee(employeeData) {
  // POST /employees
  const response = await api.post("/employees", employeeData)
  return response.data; // { message: 'Employee created' } or similar
}
export async function loginEmployee(employeeLoginData) {
  // POST /employees
  const response = await api.post("/employees/login", employeeLoginData);
  return response.data; // { message: 'Employee created' } or similar
}
export async function updateEmployee(employeeId, employeeData) {
  // PUT /employees/{id}
  const response = await api.put(`/employees/${employeeId}`, employeeData);
  return response.data; // { message: 'Employee updated' }
}

export async function deleteEmployee(employeeId) {
  // DELETE /employees/{id}
  const response = await api.delete(`/employees/${employeeId}`);
  return response.data; // { message: 'Employee deleted' }
}
