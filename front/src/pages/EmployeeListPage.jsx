import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, CircularProgress, Stack } from "@mui/material";
import AppHeader from "../components/layout/AppHeader";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/employeeService";
import EmployeeTable from "../components/employees/EmployeeTable";
import EmployeeFormDialog from "../components/employees/EmployeeFormDialog";
import toast from "react-hot-toast";

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);

  // Load employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditEmployee(null);
    setDialogOpen(true);
  };

  const handleEdit = (emp) => {
    setEditEmployee(emp);
    setDialogOpen(true);
  };

  const handleDelete = async (empId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteEmployee(empId);
      setEmployees((prev) => prev.filter((e) => e.id !== empId));
    } catch (err) {
      toast.error("Delete failed.");
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editEmployee) {
        await updateEmployee(editEmployee.id, formData);
        setEmployees((prev) =>
          prev.map((e) => (e.id === editEmployee.id ? { ...e, ...formData } : e))
        );
        toast.success("Employee updated successfully!");
      } else {
        await createEmployee(formData);
        toast.success("Employee created successfully!");
        fetchEmployees();
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed.");
    }
  };

  return (
    <>
      <AppHeader title="Manage Employees" />
      <Box sx={{ p: 3, maxWidth: "1600px", margin: "0 auto" }}>
        <Paper sx={{ p: 3, mb: 3, boxShadow: 3, borderRadius: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography variant="h5" fontWeight={600}>
              Employee List ({employees.length})
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: "none" }}
              onClick={handleAddClick}
            >
              + Add Employee
            </Button>
          </Stack>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <EmployeeTable
              employees={employees}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </Paper>
      </Box>

      {/* Dialog for create/edit */}
      <EmployeeFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initialData={editEmployee || {}}
      />
    </>
  );
}
