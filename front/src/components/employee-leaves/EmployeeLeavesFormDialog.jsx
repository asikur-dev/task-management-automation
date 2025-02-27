import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";

export default function EmployeeLeavesFormDialog({ open, onClose, onSave, initialData = {} }) {
  const [employeeId, setEmployeeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");
    console.log({initialData})

  useEffect(() => {
  if (open) {
    setEmployeeId(initialData.employee_id || "");
    setStartDate(initialData.start_date ? initialData.start_date.split("T")[0] : ""); // Extract YYYY-MM-DD
    setEndDate(initialData.end_date ? initialData.end_date.split("T")[0] : ""); // Extract YYYY-MM-DD
    setReason(initialData.reason || "");
  }
}, [open, initialData]);


  const handleSave = () => {
    const data = {
      employee_id: employeeId,
      start_date: startDate,
      end_date: endDate,
      reason,
    };
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData.id ? "Edit Leave Request" : "Add Leave Request"}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Employee ID"
            type="string"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            rows={3}
            required
            fullWidth
          />
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
