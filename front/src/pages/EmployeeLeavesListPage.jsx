// src/pages/EmployeeLeavesPage.js
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, CircularProgress } from "@mui/material";
import AppHeader from "../components/layout/AppHeader";
import {
  getEmployeeLeaves,
  createEmployeeLeave,
  updateEmployeeLeave,
  deleteEmployeeLeave,
} from "../services/employeeLeavesService";
import EmployeeLeavesTable from "../components/employee-leaves/EmployeeLeavesTable";
import EmployeeLeavesFormDialog from "../components/employee-leaves//EmployeeLeavesFormDialog";
import toast from "react-hot-toast";

export default function EmployeeLeavesListPage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editLeave, setEditLeave] = useState(null);

  // Load employee leaves on mount
  useEffect(() => {
    fetchEmployeeLeaves();
  }, []);

  const fetchEmployeeLeaves = async () => {
    try {
      setLoading(true);
      const data = await getEmployeeLeaves();
      setLeaves(data);
    } catch (err) {
      setError("Failed to load employee leaves");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditLeave(null);
    setDialogOpen(true);
  };

  const handleEdit = (leave) => {
    setEditLeave(leave);
    setDialogOpen(true);
  };

  const handleDelete = async (leaveId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteEmployeeLeave(leaveId);
      setLeaves((prev) => prev.filter((l) => l.id !== leaveId));
      toast.success("Leave deleted successfully!");
    } catch (err) {
      toast.error("Delete failed.");
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editLeave) {
        // update mode
        await updateEmployeeLeave(editLeave.id, formData);
        setLeaves((prev) =>
          prev.map((l) => (l.id === editLeave.id ? { ...l, ...formData } : l))
        );
        toast.success("Leave updated successfully!");
      } else {
        // create mode
        await createEmployeeLeave(formData);
        toast.success("Leave created successfully!");
        // reload full list or push new item
        fetchEmployeeLeaves();
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error("Save failed.");
    }
  };

  return (
    <>
      <AppHeader title="Manage Employee Leaves" />
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          
            <Typography variant="h5">Employee Leaves ({leaves?.length})</Typography>
             <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddClick}>
            Add Leave
            </Button>
          </Box>
            
          {error && <Typography color="error">{error}</Typography>}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <EmployeeLeavesTable
              leaves={leaves}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
         
        </Paper>
      </Box>

      {/* Dialog for create/edit */}
      <EmployeeLeavesFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initialData={editLeave || {}}
      />
    </>
  );
}
