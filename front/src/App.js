import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import LoginPage from "./pages/LoginPage";
import ManagerDashboard from "./pages/ManagerDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import EmployeeListPage from "./pages/EmployeeListPage";
import NotFoundPage from "./pages/NoFoundPage";
import ChatOnly from "./pages/ChatOnlyPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import ManagerListPage from "./components/managers/ManagerListPage";
import NonWorkingDaysPage from "./pages/NonWorkingDaysPage";
import CompanySettingPage from "./pages/CompanySettingPage";
import TaskListPage from "./pages/TaskListPage";
import EmployeeLeavesListPage from "./pages/EmployeeLeavesListPage";
import { useUser } from "./hooks/useUser";
import LoginEmployeePage from "./pages/LoginEmployeePage";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import SessionListPage from "./pages/SessionListPage";
import SessionTasksDisplayPage from "./pages/Session_Tasks_Display_Page";
import ManagerSettingPage from "./pages/ManagerSettingPage";
import EmployeeSettingPage from "./pages/EmployeeSettingPage";
import EmployeeTaskListPage from "./pages/EmployeeTaskListPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/employee/login" element={<LoginEmployeePage />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route
            path="/employee/settings"
            element={
              <ProtectedRoute allowedRoles={["employee", "manager"]}>
                <EmployeeSettingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/tasks"
            element={
              <ProtectedRoute allowedRoles={["employee", "manager"]}>
                <EmployeeTaskListPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/dashboard"
            element={
              <ProtectedRoute allowedRoles={["company"]}>
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />
          {/* Protected Routes */}
          <Route
            path="/manager/employees"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <EmployeeListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/managers"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ManagerListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/tasks"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <TaskListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/sessions"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <SessionListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/settings"
            element={
              <ProtectedRoute allowedRoles={["manager", "company"]}>
                <ManagerSettingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/session/:sessionId"
            element={
              <ProtectedRoute allowedRoles={["manager", "employee"]}>
                <SessionTasksDisplayPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/employee-leaves"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <EmployeeLeavesListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/employees"
            element={
              <ProtectedRoute allowedRoles={["manager", "company"]}>
                <EmployeeListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/non-working-days"
            element={
              <ProtectedRoute allowedRoles={["company"]}>
                <NonWorkingDaysPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/managers"
            element={
              <ProtectedRoute allowedRoles={["company"]}>
                <ManagerListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/settings"
            element={
              <ProtectedRoute allowedRoles={["company"]}>
                <CompanySettingPage />
              </ProtectedRoute>
            }
          />
          {/* Public Routes */}
          <Route path="/chat" element={<ChatOnly />} />
          <Route path="/chat/:sessionId/:sessionType" element={<ChatPage />} />

          {/* Not found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

// Wrapper Component for Role-Based Access
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useUser();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (!user) {
  //     navigate("/");
  //   } else if (!allowedRoles.includes(user.role)) {
  //     navigate(`/${user.role}/dashboard`); // Replace with your "Not Found" or "Access Denied" page
  //   }
  // }, [user, navigate, allowedRoles]);

  // return user && allowedRoles.includes(user.role) ? children : null;

  return children;
};

export default App;
