import api from "./api";

export async function registerCompany({ companyName, adminEmail, password, subscription }) {
  console.log({ companyName, adminEmail, password, subscription });
  const response = await api.post("/auth/company/register", {
    company_name: companyName,
    admin_email: adminEmail,
    password: password,
    subscription_plan: subscription,
  });
  return response.data; // { token: '...' }
}
export async function loginCompany(email, password) {
  const response = await api.post("/auth/company/login", {
    admin_email: email,
    password,
  });
  return response.data; // { token: '...' }
}

export async function loginManager(email, password) {
  const response = await api.post("/auth/manager/login", { email, password });
  return response.data; // { token: '...' }
}

export function logout() {
  localStorage.removeItem("role");
  localStorage.removeItem("token");
}
