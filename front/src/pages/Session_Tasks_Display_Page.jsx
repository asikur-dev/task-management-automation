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
  Button,
} from "@mui/material";
import toast from "react-hot-toast";
import { getTaskBySessionId } from "../services/taskService";
import { useNavigate, useParams } from "react-router-dom";
import { ScrollableBox } from "../components/ScrollableBox";

const SessionTasksDisplayPage = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch task history for the session
  const fetchTaskHistory = async () => {
    try {
      setLoading(true);
      const response = await getTaskBySessionId(sessionId);
      console.log({ response });

      // Format the tasks data
      const formattedTasks = response.tasks?.map((task) => ({
        id: task.id,
        taskTitle: task.task_title,
        taskDetails: task.task_details || "N/A",
        status: task.status,
        createdAt: new Date(task.created_at).toLocaleString(),
        updatedAt: new Date(task.updated_at).toLocaleString(),
        employeeName: task.employee?.name || "N/A",
        employeeEmail: task.employee?.email || "N/A",
      }));

      setTasks(formattedTasks);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch tasks. Please try again."
      );
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskHistory();
  }, [sessionId]);

  return (
    <ScrollableBox>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>
          Tasks for Session ID: {sessionId}
        </Typography>

        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Typography>Loading tasks...</Typography>
          </Box>
        ) : (
          <>
            {/* Table for Displaying Tasks */}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Task Title</TableCell>
                  <TableCell>Task Details</TableCell>
                  <TableCell>Status</TableCell>

                  <TableCell>Employee Name</TableCell>
                  <TableCell>Employee Email</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Updated At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.id}</TableCell>
                      <TableCell>{task.taskTitle}</TableCell>
                      <TableCell>{task.taskDetails}</TableCell>
                      <TableCell>{task.status}</TableCell>

                      <TableCell>{task.employeeName}</TableCell>
                      <TableCell>{task.employeeEmail}</TableCell>
                      <TableCell>{task.createdAt}</TableCell>
                      <TableCell>{task.updatedAt}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No tasks found for this session.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Back Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(-1)}
              sx={{ mt: 2 }}
            >
              Go Back
            </Button>
          </>
        )}
      </Paper>
    </ScrollableBox>
  );
};

export default SessionTasksDisplayPage;
