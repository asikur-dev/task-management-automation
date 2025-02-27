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
  InputLabel,
  FormControl,
  Select,
  Menu,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import moment from "moment-timezone";
import { KeyboardArrowDown } from "@mui/icons-material";

export default function EmployeeFormDialog({ open, onClose, onSave, initialData = {} }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  // Popular time zones to show initially
  const popularTimeZones = [
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo",
    "Asia/Dubai",
    "Asia/Dhaka",
    "Australia/Sydney",
  ];
  const allTimeZones = moment.tz.names();

  // Filtered time zones based on search
  const filteredTimeZones = searchQuery
    ? allTimeZones.filter((zone) =>
        zone.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : popularTimeZones;

  useEffect(() => {
    if (open) {
      setName(initialData.name || "");
      setEmail(initialData.email || "");
      setPassword("");
      setTimeZone(initialData.time_zone || "");
      setCheckInTime(initialData.check_in_time || "");
      setCheckOutTime(initialData.check_out_time || "");
      setSearchQuery(""); // Reset search field
    }
  }, [open, initialData]);

  const handleSave = () => {
    const data = {
      name,
      email,
      password,
      time_zone: timeZone,
      check_in_time: checkInTime,
      check_out_time: checkOutTime,
    };
    onSave(data);
  };

  const handleTimeZoneClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleTimeZoneClose = () => {
    setAnchorEl(null);
  };

  const handleTimeZoneSelect = (zone) => {
    setTimeZone(zone);
    handleTimeZoneClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData.id ? "Edit Employee" : "Add Employee"}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!initialData.id}
          />

          {/* Time Zone Selection with Search */}
          <FormControl fullWidth required>
            <Button
              variant="outlined"
              onClick={handleTimeZoneClick}
              sx={{ textAlign: "left", justifyContent: "space-between", height: "56px" }}
            >
              {timeZone || "Select Time Zone"}  <KeyboardArrowDown sx={{ ml: 1,textAlign: "right", justifyContent: "flex-end" }} />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleTimeZoneClose}
              PaperProps={{
                style: { maxHeight: 350, width: "300px", overflowY: "auto" },
              }}
            >
              <Box sx={{ p: 1 }}>
                <TextField
                  placeholder="Search time zones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                  autoFocus
                />
              </Box>
              <List sx={{ maxHeight:300, overflowY: "auto" }}>
                {filteredTimeZones.map((zone) => (
                  <ListItemButton key={zone} onClick={() => handleTimeZoneSelect(zone)}>
                    <ListItemText primary={zone} />
                  </ListItemButton>
                ))}
              </List>
            </Menu>
          </FormControl>

          <TextField
            label="Check-In Time"
            type="time"
            value={checkInTime}
            onChange={(e) => setCheckInTime(e.target.value)}
            required
          />
          <TextField
            label="Check-Out Time"
            type="time"
            value={checkOutTime}
            onChange={(e) => setCheckOutTime(e.target.value)}
            required
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
