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
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ScrollableBox } from "../ScrollableBox";

export default function CheckinSessionTable({ checkinSessions, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("session_date"); // Default sort column
  const [orderDirection, setOrderDirection] = useState("asc"); // Default sort direction
  const [filterSessionType, setFilterSessionType] = useState(""); // Session type filter
  const navigate = useNavigate();

  // Handle search filtering
  const filteredSessions = checkinSessions.filter((session) =>
    Object.values(session).some(
      (value) =>
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Apply session type filter
  const typeFilteredSessions = filterSessionType
    ? filteredSessions.filter((session) => session.session_type === filterSessionType)
    : filteredSessions;

  // Handle sorting
  const sortedSessions = [...typeFilteredSessions].sort((a, b) => {
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

  const onView = (id) => {
    console.log("Viewing session with ID:", id);
    navigate(`/session/${id}`);
  };

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
           {/* Search Bar */}
       <Box sx={{ my: 2, display: "flex", gap: 2 }}>
         <TextField
           placeholder="Search..."
           label="Search Sessions"
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
         {/* Session Type Filter Dropdown */}
         <Select
           value={filterSessionType}
           onChange={(e) => setFilterSessionType(e.target.value)}
           variant="outlined"
           size="small"
           sx={{ minWidth: 150 }}
           displayEmpty
         >
           <MenuItem value="">All Types</MenuItem>
           <MenuItem value="morning">Morning</MenuItem>
           <MenuItem value="evening">Evening</MenuItem>
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
                active={orderBy === "session_type"}
                direction={orderBy === "session_type" ? orderDirection : "asc"}
                onClick={() => handleSort("session_type")}
              >
                Session Type
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "session_date"}
                direction={orderBy === "session_date" ? orderDirection : "asc"}
                onClick={() => handleSort("session_date")}
              >
                Session Date
              </TableSortLabel>
            </TableCell>
            <TableCell>Email Sending Time</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell>Fill Time (Seconds)</TableCell>
            <TableCell>Morning IP Address</TableCell>
            <TableCell>Morning Device Info</TableCell>
            <TableCell>Morning Created Time</TableCell>
            <TableCell>Evening IP Address</TableCell>
            <TableCell>Evening Device Info</TableCell>
            <TableCell>Evening Created Time</TableCell>
            <TableCell>Employee Name</TableCell>
            <TableCell>Employee Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedSessions.map((session) => {
            // Extract morning and evening device info
            const morningDeviceInfo = session.device_info.find(
              (info) => info.session_type === "morning"
            );
            const eveningDeviceInfo = session.device_info.find(
              (info) => info.session_type === "evening"
            );

            return (
              <TableRow key={session.id}>
                <TableCell>{session.id}</TableCell>
                <TableCell>{session.session_type}</TableCell>
                <TableCell>
                  {new Date(session.session_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {session.email_sending_time
                    ? new Date(session.email_sending_time).toLocaleString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {session.session_start_time
                    ? new Date(session.session_start_time).toLocaleString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {session.session_end_time
                    ? new Date(session.session_end_time).toLocaleString()
                    : "N/A"}
                </TableCell>
                <TableCell>{session.fill_time_seconds || "N/A"}</TableCell>
                <TableCell>
                  {morningDeviceInfo?.device_info?.ipAddress || "N/A"}
                </TableCell>
                <TableCell>
                  {morningDeviceInfo
                    ? JSON.stringify(morningDeviceInfo.device_info)
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {morningDeviceInfo
                    ? new Date(morningDeviceInfo.created_at).toLocaleString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {eveningDeviceInfo?.device_info?.ipAddress || "N/A"}
                </TableCell>
                <TableCell>
                  {eveningDeviceInfo
                    ? JSON.stringify(eveningDeviceInfo.device_info)
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {eveningDeviceInfo
                    ? new Date(eveningDeviceInfo.created_at).toLocaleString()
                    : "N/A"}
                </TableCell>
                <TableCell>{session.employee?.name || "N/A"}</TableCell>
                <TableCell>{session.employee?.email || "N/A"}</TableCell>
                <TableCell>
                  {/* <IconButton onClick={() => onEdit(session)}>
                    <EditIcon />
                  </IconButton> */}
                  <IconButton onClick={() => onDelete(session.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => onView(session.id)}>
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        </Table>
      </ScrollableBox>
    </Box>
  );
}
