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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { ScrollableBox } from "../ScrollableBox";
import moment from "moment-timezone";

export default function EmployeeLeavesTable({ leaves, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("id"); // Default sort column
  const [orderDirection, setOrderDirection] = useState("asc"); // Default sort direction

  // Handle search filtering
  const filteredLeaves = leaves.filter((leave) =>
    Object.values(leave).some(
      (value) =>
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Handle sorting
  const sortedLeaves = [...filteredLeaves].sort((a, b) => {
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

  return (
    <Box sx={{ width: "100%" }}>
      {/* Search Bar */}
      <Box sx={{ m: 2 }}>
        <TextField
placeholder="Search..."
                  value={searchTerm}
                  label="Search.."
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
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
                  active={orderBy === "employee_id"}
                  direction={orderBy === "employee_id" ? orderDirection : "asc"}
                  onClick={() => handleSort("employee_id")}
                >
                  Employee ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "start_date"}
                  direction={orderBy === "start_date" ? orderDirection : "asc"}
                  onClick={() => handleSort("start_date")}
                >
                  Start Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "end_date"}
                  direction={orderBy === "end_date" ? orderDirection : "asc"}
                  onClick={() => handleSort("end_date")}
                >
                  End Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedLeaves.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell>{leave.id}</TableCell>
                <TableCell>{leave.employee_id}</TableCell>
                <TableCell>{moment(leave.start_date).format("YYYY-MM-DD")}</TableCell>
                <TableCell>{moment(leave.end_date).format("YYYY-MM-DD")}</TableCell>
                <TableCell>{leave.reason}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => onEdit(leave)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => onDelete(leave.id)}>
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
