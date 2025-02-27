import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import AppHeader from "../components/layout/AppHeader";
import { getEmployeeProfile, updateEmployee } from "../services/employeeService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: 600,
  borderRadius: 12,
  boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.12)",
  background: "#fff",
}));

const StyledButton = styled(Button)({
  textTransform: "none",
  fontWeight: "bold",
  borderRadius: 12,
  padding: "12px 24px",
  fontSize: "16px",
  transition: "all 0.3s",
  ":hover": {
    transform: "translateY(-2px)",
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
  },
});

export default function EmployeeSettingPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [timeZone, setTimeZone] = useState(moment.tz.guess());
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getEmployeeProfile();
      console.log({ data });

      const userTimeZone = data.time_zone || moment.tz.guess();

      setName(data.name || "");
      setEmail(data.email || "");
      setTimeZone(userTimeZone);

      // Convert check-in/check-out from UTC to user's timezone
      setCheckInTime(
        data.check_in_time
          ? moment.utc(data.check_in_time, "HH:mm").tz(userTimeZone).format("hh:mm A")
          : ""
      );
      setCheckOutTime(
        data.check_out_time
          ? moment.utc(data.check_out_time, "HH:mm").tz(userTimeZone).format("hh:mm A")
          : ""
      );

      // Convert timestamps to user's timezone
      setCreatedAt(
        moment.utc(data.created_at).tz(userTimeZone).format("YYYY-MM-DD hh:mm A z")
      );
      setUpdatedAt(
        moment.utc(data.updated_at).tz(userTimeZone).format("YYYY-MM-DD hh:mm A z")
      );
    } catch (err) {
      setError("Failed to load employee profile");
      toast.error("Failed to load employee profile");
    } finally {
      setLoading(false);
    }
  };


  const handleSave = async () => {
    try {
      setError("");
      await updateEmployee({
        name,
        email,
        password,
        time_zone: timeZone,
      });
      toast.success("Profile updated successfully");
      navigate("/employee/dashboard");
    } catch (err) {
      toast.error("Save failed.");
      setError("Save failed");
    }
  };

  return (
    <>
      <AppHeader title="Employee Settings" />
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <StyledPaper>
          <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
            Employee Profile
          </Typography>
          <Divider sx={{ mb: 3 }} />
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {error && (
                <Typography color="error" mb={2} textAlign="center">
                  {error}
                </Typography>
              )}
              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  variant="outlined"
                  required
                />
                <TextField
                  label="Email"
                  value={email}
                  fullWidth
                  variant="outlined"
                  type="email"
                  disabled
                  aria-disabled
                />
                <TextField
                  label="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  variant="outlined"
                  type="password"
                  helperText="Leave blank to keep the current password."
                />
                <TextField
                  label="Time Zone"
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  fullWidth
                  variant="outlined"
                                      helperText="e.g. UTC+5:30"
                                      aria-readonly
                                      disabled
                                      aria-disabled
                />
                <TextField
                  label="Check-In Time"
                  value={checkInTime}
                  fullWidth
                  variant="outlined"
                  type="text"
                  InputLabelProps={{ shrink: true }}
                  disabled
                  aria-disabled
                />
                <TextField
                  label="Check-Out Time"
                  value={checkOutTime}
                  fullWidth
                  variant="outlined"
                  type="text"
                  InputLabelProps={{ shrink: true }}
                  disabled
                  aria-disabled
                />
                <TextField
                  label="Created At"
                  value={createdAt}
                  fullWidth
                  variant="outlined"
                  disabled
                  aria-disabled
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Updated At"
                  value={updatedAt}
                  fullWidth
                  variant="outlined"
                  disabled
                  aria-disabled
                  InputLabelProps={{ shrink: true }}
                />
                <StyledButton
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  Save Changes
                </StyledButton>
              </Box>
            </>
          )}
        </StyledPaper>
      </Box>
    </>
  );
}
