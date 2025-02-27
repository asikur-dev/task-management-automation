import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  TableSortLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { ScrollableBox } from "../ScrollableBox";
import moment from "moment-timezone";
export default function EmployeeTable({ employees, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("name"); // Default sort column
  const [orderDirection, setOrderDirection] = useState("asc"); // Default sort direction
  const [filterTimeZone, setFilterTimeZone] = useState(""); // Time zone filter

  // Handle search filtering
  const filteredEmployees = employees.filter((emp) =>
    Object.values(emp).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Apply time zone filter
  const timeZoneFilteredEmployees = filterTimeZone
    ? filteredEmployees.filter((emp) => emp.time_zone === filterTimeZone)
    : filteredEmployees;

  // Handle sorting
  const sortedEmployees = [...timeZoneFilteredEmployees].sort((a, b) => {
    if (orderDirection === "asc") {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    } else {
      return a[orderBy] < b[orderBy] ? 1 : -1;
    }
  });

  // Toggle sort direction and column
  const handleSort = (column) => {
    const isAsc = orderBy === column && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  // Unique time zones for the filter dropdown
  const uniqueTimeZones = [
    "",
    ...new Set(employees.map((emp) => emp.time_zone)),
  ].filter(Boolean);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Search Bar */}
      <Box sx={{ my: 2, display: "flex", gap: 2 }}>
        <TextField
          placeholder="Search..."
          label="Search Employee"
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

        {/* Time Zone Filter Dropdown */}
        <Select
          value={filterTimeZone}
          onChange={(e) => setFilterTimeZone(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ minWidth: 150 }}
          displayEmpty
        >
          <MenuItem value="">All Time Zones</MenuItem>
          {uniqueTimeZones.map((tz) => (
            <MenuItem key={tz} value={tz}>
              {tz}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Table */}
      <ScrollableBox>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "id"}
                  direction={orderBy === "id" ? orderDirection : "asc"}
                  onClick={() => handleSort("id")}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? orderDirection : "asc"}
                  onClick={() => handleSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "email"}
                  direction={orderBy === "email" ? orderDirection : "asc"}
                  onClick={() => handleSort("email")}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>Time Zone</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "check_in_time"}
                  direction={orderBy === "check_in_time" ? orderDirection : "asc"}
                  onClick={() => handleSort("check_in_time")}
                >
                  Check In
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "check_out_time"}
                  direction={orderBy === "check_out_time" ? orderDirection : "asc"}
                  onClick={() => handleSort("check_out_time")}
                >
                  Check Out
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "created_at"}
                  direction={orderBy === "created_at" ? orderDirection : "asc"}
                  onClick={() => handleSort("created_at")}
                >
                  Created At
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedEmployees.map((emp) => (
              <TableRow key={emp.id}>
                {" "}
                <TableCell>{emp.id}</TableCell>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.time_zone}</TableCell>
                <TableCell>{emp.check_in_time}</TableCell>
                <TableCell>{emp.check_out_time}</TableCell>
                <TableCell>{moment(emp.created_at).format("YYYY-MM-DD")}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => onEdit(emp)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => onDelete(emp.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollableBox>
    </Box>
  );
}