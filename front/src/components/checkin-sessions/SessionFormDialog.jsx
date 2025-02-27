import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

export default function SessionFormDialog({ open, onClose, onSave, editData = null }) {
  // State variables for form fields
  const [employeeId, setEmployeeId] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [sessionDate, setSessionDate] = useState("");

  // Populate form fields when dialog opens or editData changes
  useEffect(() => {
    if (open && editData) {
      setEmployeeId(editData.employeeId || "");
      setSessionType(editData.session_type || "");
      setSessionDate(editData.session_date || "");
    } else if (open) {
      setEmployeeId("");
      setSessionType("");
      setSessionDate("");
    }
  }, [open, editData]);

  // Handle saving the form data
  const handleSave = () => {
    onSave({ employeeId, session_type: sessionType, session_date: sessionDate });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editData ? "Edit Session" : "Add Session"}</DialogTitle>
      <DialogContent>
        {/* Employee ID Field (Hidden in Edit Mode) */}
        {!editData && (
          <TextField
            label="Employee ID"
            fullWidth
            sx={{ mb: 2, mt: 1 }}
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
          />
        )}

        {/* Session Type Select Field */}
        <TextField
          select
          label="Session Type"
          fullWidth
          sx={{ mb: 2 }}
          value={sessionType}
          onChange={(e) => setSessionType(e.target.value)}
          required
        >
          <MenuItem value="morning">Morning</MenuItem>
          <MenuItem value="evening">Evening</MenuItem>
        </TextField>

        {/* Session Date Field */}
        <TextField
          label="Session Date"
          type="date"
          fullWidth
          sx={{ mb: 2 }}
          value={sessionDate}
          onChange={(e) => setSessionDate(e.target.value)}
          InputLabelProps={{
            shrink: true, // Ensures the label shrinks properly for date input
          }}
          required
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
