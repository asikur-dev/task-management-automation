import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";

export default function TaskFormDialog({ open, onClose, onSave, initialData = {} }) {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [status, setStatus] = useState("pending");
  const [sessionId, setSessionId] = useState(""); // State for Session ID

  useEffect(() => {
    if (open) {
      setTaskTitle(initialData.task_title || "");
      setTaskDetails(initialData.task_details || "");
      setStatus(initialData.status || "pending");
      setSessionId(initialData.session_id || ""); // Set Session ID from initialData
    }
  }, [open, initialData]);

  const handleSave = () => {
    const data = {
      session_id: sessionId, // Include session_id in the data object
      task_title: taskTitle,
      task_details: taskDetails,
      status,
    };
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData.id ? "Edit Task" : "Add Task"}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {/* Session ID Field */}
          {!initialData.id && (
            <TextField
              label="Session ID"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              required
              helperText="Enter the session ID for this task."
            />
          )}

          {/* Read-Only Session ID for Editing */}
          {initialData.id && (
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Session ID: {initialData.session_id}
            </Typography>
          )}

          <TextField
            label="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
          />
          <TextField
            label="Task Details"
            multiline
            rows={3}
            value={taskDetails}
            onChange={(e) => setTaskDetails(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="blocked">Blocked</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
