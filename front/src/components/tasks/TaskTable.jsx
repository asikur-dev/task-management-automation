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
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function TaskTable({ tasks, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("task_title"); // Default sort column
  const [orderDirection, setOrderDirection] = useState("asc"); // Default sort direction
  const [filterStatus, setFilterStatus] = useState(""); // Status filter

  const navigate = useNavigate();
  // Handle search filtering
  const filteredTasks = tasks.filter((task) =>
    Object.values(task).some(
      (value) =>
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Apply status filter
  const statusFilteredTasks = filterStatus
    ? filteredTasks.filter((task) => task.status === filterStatus)
    : filteredTasks;

  // Handle sorting
  const sortedTasks = [...statusFilteredTasks].sort((a, b) => {
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

  const onView = (id, sessionType) => {
    console.log("Viewing task with ID:", id);
    navigate(`/chat/${id}/${sessionType}`);
  };
  console.log({tasks});
  return (
    <Box sx={{ width: "100%" }}>
      {/* Search Bar */}
      <Box sx={{ my: 2, display: "flex", gap: 2 }}>
        <TextField
          // fullWidth
          placeholder="Search..."
          label="Search Tasks"
          variant="outlined"
          // size="small"
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

        {/* Status Filter Dropdown */}
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ minWidth: 150 }}
          displayEmpty
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
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
                  active={orderBy === "task_title"}
                  direction={orderBy === "task_title" ? orderDirection : "asc"}
                  onClick={() => handleSort("task_title")}
                >
                  Task Title
                </TableSortLabel>
              </TableCell>
              <TableCell>Task Details</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "checkin_session_id"}
                  direction={orderBy === "checkin_session_id" ? orderDirection : "asc"}
                  onClick={() => handleSort("checkin_session_id")}
                >
                  Session ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? orderDirection : "asc"}
                  onClick={() => handleSort("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? orderDirection : "asc"}
                  onClick={() => handleSort("name")}
                >
                  User Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "email"}
                  direction={orderBy === "email" ? orderDirection : "asc"}
                  onClick={() => handleSort("email")}
                >
                  User Email
                </TableSortLabel>
              </TableCell>
             
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.task_title}</TableCell>
                <TableCell>{task.task_details}</TableCell>
                <TableCell>{task.checkin_session_id}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task?.employee?.name}</TableCell>
                <TableCell>{task?.employee?.email}</TableCell>
                <TableCell sx={{ display: "flex", gap: 1 }}>
                  <IconButton color="primary" onClick={() => onEdit(task)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => onDelete(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    color="info"
                    onClick={() =>
                      onView(task.checkin_session_id, task.session?.session_type)
                    }
                  >
                    <Visibility />
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
