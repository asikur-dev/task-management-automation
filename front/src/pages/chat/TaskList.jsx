import React from "react";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Check, Hourglass, X } from "lucide-react";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 3; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const getStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case "completed":
      return <Check color="green" />;
    case "in progress":
      return <Hourglass color="orange" />;
    case "not started":
      return <X color="red" />;
    default:
      return null;
  }
};

export const TaskList = ({ tasks, currentTaskIndex }) => (
  <Box sx={{ overflowY: "auto", overflowX: "hidden" }}>
    <Typography variant="h6" gutterBottom sx={{ p: 2 }}>
      Tasks
    </Typography>
    <List sx={{}}>
      {tasks.map((task, index) => (
        <ListItem
          key={task.id}
          sx={{
            backgroundColor: getRandomColor(),
            borderRadius: "4px",
            mx: 1,
            my: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ListItemText
            primary={task.task_title}
            secondary={task.status}
            sx={{ color: "white" }}
          />
          {getStatusIcon(task.status)}
        </ListItem>
      ))}
    </List>
  </Box>
);
