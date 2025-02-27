import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  TableSortLabel,
  Select,
  CircularProgress,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AppHeader from "../components/layout/AppHeader";
import {
  getNonWorkingDays,
  addNonWorkingDay,
  deleteNonWorkingDay,
} from "../services/nonWorkingDaysService";
import toast from "react-hot-toast";

import moment from "moment-timezone";
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function NonWorkingDaysPage() {
  const [nonWorkingDays, setNonWorkingDays] = useState([]);
  const [dateValue, setDateValue] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("date_value");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [filterDayOfWeek, setFilterDayOfWeek] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNWD = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNonWorkingDays();
      setNonWorkingDays(data);
      setError("");
    } catch {
      setError("Failed to load non-working days");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNWD();
  }, [fetchNWD]);

  const filteredSortedNWD = useMemo(() => {
    let data = nonWorkingDays;
    if (searchTerm) {
      data = data.filter((nwd) =>
        Object.values(nwd).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    if (filterDayOfWeek) {
      data = data.filter((nwd) => nwd.day_of_week === parseInt(filterDayOfWeek, 10));
    }
    return [...data].sort((a, b) =>
      orderDirection === "asc"
        ? (a[orderBy] ?? "") > (b[orderBy] ?? "")
          ? 1
          : -1
        : (a[orderBy] ?? "") < (b[orderBy] ?? "")
        ? 1
        : -1
    );
  }, [nonWorkingDays, searchTerm, filterDayOfWeek, orderBy, orderDirection]);

  const handleAdd = async () => {
    if (!dateValue && !dayOfWeek) {
      toast.error("Please specify either a date or a day of the week.");
      return;
    }
    try {
      const payload = {
        date_value: dateValue || null,
        day_of_week: dayOfWeek && !dateValue ? parseInt(dayOfWeek, 10) : null,
        description,
      };
      console.log("Sending payload:", payload); // Debugging line
      await addNonWorkingDay(payload);
      setDateValue("");
      setDayOfWeek("");
      setDescription("");
      fetchNWD();
      toast.success("Non-working day added successfully.");
    } catch {
      toast.error("Failed to add non-working day.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteNonWorkingDay(id);
      setNonWorkingDays((prev) => prev.filter((x) => x.id !== id));
      toast.success("Deleted successfully.");
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <>
      <AppHeader title="Non-Working Days" />
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" mb={2}>
            Add New Non-Working Day
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Date (yyyy-mm-dd)"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Select
                fullWidth
                value={dayOfWeek}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  console.log("Selected Day of Week:", selectedValue); // Debugging line
                  setDayOfWeek(selectedValue);
                }}
                displayEmpty
              >
                <MenuItem value="">Select Day</MenuItem>
                {daysOfWeek.map((day, index) => (
                  <MenuItem key={index} value={index}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleAdd}>
                Add Non-Working Day
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" mb={2}>
            Manage Non-Working Days ({filteredSortedNWD.length})
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  placeholder="Search..."
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Select
                  value={filterDayOfWeek}
                  onChange={(e) => setFilterDayOfWeek(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">All Days</MenuItem>
                  {daysOfWeek.map((day, index) => (
                    <MenuItem key={index} value={index}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Table>
                <TableHead>
                  <TableRow>
                    {["Date", "Day of Week", "Description", ""].map((col, index) => (
                      <TableCell key={index}>
                        <TableSortLabel
                          active={orderBy === col.toLowerCase().replace(" ", "_")}
                          direction={
                            orderBy === col.toLowerCase().replace(" ", "_")
                              ? orderDirection
                              : "asc"
                          }
                          onClick={() => setOrderBy(col.toLowerCase().replace(" ", "_"))}
                        >
                          {col}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSortedNWD.map((nwd) => (
                    <TableRow key={nwd.id}>
                      <TableCell>{moment(nwd.date_value || "")?.format("YYYY-MM-DD")}</TableCell>
                      <TableCell>
                        {daysOfWeek[nwd.day_of_week] || "Sunday"}
                      </TableCell>{" "}
                      <TableCell>{nwd.description}</TableCell>
                      <TableCell>
                        <IconButton color="error" onClick={() => handleDelete(nwd.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </Paper>
      </Box>
    </>
  );
}
