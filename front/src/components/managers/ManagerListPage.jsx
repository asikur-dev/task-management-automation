import React, { useState, useEffect } from "react";
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
  CircularProgress,
  TextField,
  InputAdornment,
  TableSortLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; // Icon for delete
import EditIcon from "@mui/icons-material/Edit"; // Icon for update/edit
import LockResetIcon from "@mui/icons-material/LockReset"; // Icon for password reset
import AppHeader from "../layout/AppHeader";
import {
  getManagers,
  addManager,
  deactivateManager,
  resetManagerPassword,
  deleteManager,
  updateManager,
} from "../../services/managerService";
import ManagerFormDialog from "./ManagerFormDialog";
import toast from "react-hot-toast";

import moment from "moment-timezone";
export default function ManagerListPage() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("name"); // Default sort column
  const [orderDirection, setOrderDirection] = useState("asc"); // Default sort direction
  const [filterActive, setFilterActive] = useState(""); // Active status filter ("" for all, "1" for active, "0" for inactive)

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      const data = await getManagers();
      setManagers(data);
    } catch (err) {
      setError("Failed to load managers");
    } finally {
      setLoading(false);
    }
  };

  // Handle search filtering
  const filteredManagers = managers.filter((mgr) =>
    Object.values(mgr).some(
      (value) =>
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Apply active status filter
  const activeFilteredManagers = filterActive
    ? filteredManagers.filter((mgr) => mgr.is_active === (filterActive === "1"))
    : filteredManagers;

  // Handle sorting
  const sortedManagers = [...activeFilteredManagers].sort((a, b) => {
    if (orderDirection === "desc") {
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

  const handleAddManager = () => {
    setEditData(null);
    setDialogOpen(true);
  };

  const handleSaveManager = async ({ name, email, password }) => {
    try {
      if (editData) {
        await updateManager(editData.id, { name, email, password });
        toast.success("Manager updated successfully");
      } else {
        await addManager({ name, email, password });
        toast.success("Manager added successfully");
      }
      setDialogOpen(false);
      fetchManagers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save manager");
    }
  };

  const handleDeleteManager = async (managerId) => {
    if (!window.confirm("Are you sure you want to delete this manager?")) return;

    try {
      await deleteManager(managerId);
      setManagers((prev) => prev.filter((m) => m.id !== managerId));
      toast.success("Manager deleted successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete manager");
    }
  };

  const handleToggleActive = async (managerId, isActive) => {
    const actionMessage = isActive ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${actionMessage} this manager?`))
      return;

    try {
      await deactivateManager(managerId);
      setManagers((prev) =>
        prev.map((m) => (m.id === managerId ? { ...m, is_active: !m.is_active } : m))
      );
      toast.success(
        `${actionMessage.charAt(0).toUpperCase() + actionMessage.slice(1)} successful`
      );
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          `${actionMessage.charAt(0).toUpperCase() + actionMessage.slice(1)} failed`
      );
    }
  };

  const handleResetPassword = async (managerId) => {
    const newPassword = prompt("Enter new password:");
    if (!newPassword) return;

    try {
      await resetManagerPassword(managerId, newPassword);
      toast.success("Password reset successful");
    } catch (err) {
      toast.error("Password reset failed");
    }
  };

  return (
    <>
      <AppHeader />
      <Box sx={{ padding: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mb: 2,
          }}
        >
          <Typography variant="h5">
            Company Managers ({sortedManagers?.length})
          </Typography>
          {/* Add Manager Button */}
          <Button variant="contained" startIcon={<EditIcon />} onClick={handleAddManager}>
            Add Manager
          </Button>
        </Box>
        {error && <Typography color="error">{error}</Typography>}
        {/* Search Bar */}
        <TextField
          placeholder="Search managers..."
          label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
          }}
          sx={{ marginBottom: 2 }}
        />
        {/* Active Status Filter Dropdown */}
        <Select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          variant="outlined"
          label="Filter by Status"
          sx={{ minWidth: 150, marginBottom: 2, ml: 2 }}
          displayEmpty
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="1">Active</MenuItem>
          <MenuItem value="0">Inactive</MenuItem>
        </Select>

        {/* Loading Indicator */}
        {loading ? (
          <CircularProgress />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? orderDirection : "asc"}
                    onClick={() => handleSort("name")}
                  >
                    Manager Name
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
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "created_at"}
                    direction={orderBy === "created_at" ? orderDirection : "asc"}
                    onClick={() => handleSort("created_at")}
                  >
                    created_at
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "updated_at"}
                    direction={orderBy === "updated_at" ? orderDirection : "asc"}
                    onClick={() => handleSort("updated_at")}
                  >
                    updated_at
                  </TableSortLabel>
                </TableCell>

                <TableCell>Active?</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedManagers.map((mgr) => (
                <TableRow key={mgr.id}>
                  <TableCell>{mgr.name}</TableCell>
                  <TableCell>{mgr.email}</TableCell>
                  <TableCell>{moment(mgr.created_at).format("YYYY-MM-DD")}</TableCell>
                  <TableCell>{moment(mgr.updated_at).format("YYYY-MM-DD")}</TableCell>
                  <TableCell>{mgr.is_active ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {/* Update Button */}
                    <IconButton
                      title="Edit Manager"
                      onClick={() => {
                        setEditData(mgr);
                        setDialogOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    {/* Delete Button */}
                    <IconButton
                      title="Delete Manager"
                      onClick={() => handleDeleteManager(mgr.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    {/* Reset Password Button */}
                    <IconButton
                      title="Reset Password"
                      onClick={() => handleResetPassword(mgr.id)}
                    >
                      <LockResetIcon />
                    </IconButton>
                    {/* Activate/Deactivate Button */}
                    <IconButton
                      title={mgr.is_active ? "Deactivate Manager" : "Activate Manager"}
                      onClick={() => handleToggleActive(mgr.id, mgr.is_active)}
                    >
                      {mgr.is_active ? (
                        <span style={{ color: "red" }}>❌</span>
                      ) : (
                        <span style={{ color: "green" }}>✅</span>
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
      {/* Manager Form Dialog for adding or editing */}
      <ManagerFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveManager}
        editData={editData}
      />
    </>
  );
}
