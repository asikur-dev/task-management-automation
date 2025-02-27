import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, CircularProgress } from "@mui/material";
import AppHeader from "../components/layout/AppHeader";
import {
  getCheckinSessions,
  createCheckinSession,
  updateCheckinSession,
  deleteCheckinSession,
} from "../services/checkinSessionService";
import CheckinSessionTable from "../components/checkin-sessions/SessionListPage"; // Updated table component
import CheckinSessionFormDialog from "../components/checkin-sessions/SessionFormDialog"; // Updated dialog component
import toast from "react-hot-toast";

export default function SessionListPage() {
  const [checkinSessions, setCheckinSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSession, setEditSession] = useState(null); // Renamed from editTask to editSession

  // Fetch check-in sessions
  useEffect(() => {
    fetchCheckinSessions();
  }, []);

  const fetchCheckinSessions = async () => {
    try {
      setLoading(true);
      const data = await getCheckinSessions(); // Updated API call
      setCheckinSessions(data?.sessions || []);
    } catch (err) {
      setError("Failed to load check-in sessions");
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new session
  const handleAddClick = () => {
    setEditSession(null);
    setDialogOpen(true);
  };

  // Handle editing an existing session
  const handleEdit = (session) => {
    setEditSession(session);
    setDialogOpen(true);
  };

  // Handle deleting a session
  const handleDelete = async (sessionId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteCheckinSession(sessionId); // Updated API call
        setCheckinSessions((prev) => prev.filter((s) => s.id !== sessionId)); // Updated variable name
        toast.success("Session deleted successfully!");
      } catch (err) {
        toast.error("Delete failed.");
      }
    }
  };

  // Handle saving a session (create or update)
  const handleSave = async (formData) => {
    try {
      if (editSession) {
        // Update existing session
        await updateCheckinSession(editSession.id, formData); // Updated API call
        setCheckinSessions(
          (prev) => prev.map((s) => (s.id === editSession.id ? { ...s, ...formData } : s)) // Updated variable name
        );
        toast.success("Session updated successfully!");
      } else {
        // Create new session
        await createCheckinSession(formData); // Updated API call
        fetchCheckinSessions();
        toast.success("Session created successfully!");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed.");
    }
  };

  return (
    <>
      <AppHeader title="Manage Check-In Sessions" />
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h5">
            Check-In Sessions List ({checkinSessions?.length})
          </Typography>
          {/* <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddClick}>
            Add Check-In Session
            </Button> */}
          </Box>
          {error && <Typography color="error">{error}</Typography>}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <CheckinSessionTable
              checkinSessions={checkinSessions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </Paper>
      </Box>

      {/* Dialog for create/edit */}
      <CheckinSessionFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initialData={editSession || {}}
      />
    </>
  );
}
