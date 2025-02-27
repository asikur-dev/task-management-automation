import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, CircularProgress } from "@mui/material";
import AppHeader from "../components/layout/AppHeader";
import { getTasks, createTask, updateTask, deleteTask } from "../services/taskService";
import TaskTable from "../components/tasks/TaskTable";
import TaskFormDialog from "../components/tasks/TaskFormDialog";
import toast from "react-hot-toast";

export default function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data?.tasks || []);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditTask(null);
    setDialogOpen(true);
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setDialogOpen(true);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteTask(taskId);
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      } catch (err) {
        toast.error("Delete failed.");
      }
    }
  };
  const handleSave = async (formData) => {
    try {
      if (editTask) {
        await updateTask(editTask.id, formData);
        setTasks((prev) =>
          prev.map((t) => (t.id === editTask.id ? { ...t, ...formData } : t))
        );
        toast.success("Task updated successfully!");
      } else {
        await createTask(formData);
        fetchTasks();
        toast.success("Task created successfully!");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error("Save failed.");
    }
  };

  return (
    <>
      <AppHeader title="Manage Tasks" />
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5">Tasks List ({tasks?.length})</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddClick}>
              + Add Task
            </Button>
          </Box>
          {error && <Typography color="error">{error}</Typography>}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TaskTable tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </Paper>
      </Box>

      {/* Dialog for create/edit */}
      <TaskFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initialData={editTask || {}}
      />
    </>
  );
}
