// src/components/managers/ManagerFormDialog.js
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

export default function ManagerFormDialog({ open, onClose, onSave, editData = null }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (open && editData) {
      setName(editData.name || "");
      setEmail(editData.email || "");
      // For reset password, you might handle differently. Let's just show a new password field
      setPassword("");
    } else if (open) {
      setName("");
      setEmail("");
      setPassword("");
    }
  }, [open, editData]);

  const handleSave = () => {
    onSave({ name, email, password });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editData ? "Edit Manager" : "Add Manager"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          fullWidth
          sx={{ mb: 2, mt: 1 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={!editData} // maybe optional if editing
        />
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
