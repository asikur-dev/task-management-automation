"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Paper,
  IconButton,
  CircularProgress,
  Fab,
  Typography,
  ThemeProvider,
  createTheme,
  TextareaAutosize,
  List,
  ListItem,
  ListItemText,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import MenuIcon from "@mui/icons-material/Menu";
import "react-chat-elements/dist/main.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createChat } from "../../services/chatService";
import { atomOneDark, atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SyntaxHighlighter from "react-syntax-highlighter";
import toast from "react-hot-toast";
import { getTaskBySessionId, updateTask } from "../../services/taskService";
const SPECIAL_CHARACTERS = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;

// Define Light and Dark Themes
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#673ab7",
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
    text: {
      primary: "#000000",
      secondary: "#424242",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#673ab7",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0bec5",
    },
  },
});

// Dummy tasks for testing
const dummyTasks = [
  { id: 1, task_title: "Complete project proposal" },
  { id: 2, task_title: "Review pull requests" },
  { id: 3, task_title: "Update documentation" },
  { id: 4, task_title: "Attend team meeting" },
];

// Special commands
const SPECIAL_COMMANDS = {
  "/help": "Show available commands",
  "/clear": "Clear the chat",
  "/tasks": "Show current tasks",
};


const TaskList = ({ tasks, currentTaskIndex }) => {
  // Define a list of random emojis for visual appeal
  // const emojis = ["🌟", "🔥", "🚀", "💡", "🎯", "📌", "📋", "✨", "🎉", "🌈"];

  return (
    <Box
      sx={{
        overflowY: "auto",
        overflowX: "hidden",
        maxHeight: "80vh",
        bgcolor: "background.paper",
        borderRadius: 2,
        p: 1,
        "&::-webkit-scrollbar": { width: "5px" },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: "rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          px: 2,
          py: 1,
          fontWeight: "bold",
          borderBottom: "1px solid #ddd",
        }}
      >
        Tasks
      </Typography>
      <List sx={{ p: 0 }}>
        {tasks.map((task, index) => {
          // Assign an emoji based on the index (cycling through the emojis array)
          // const emoji = emojis[index % emojis.length];
          const textColor = index === currentTaskIndex ? "white" : "text.primary";

          return (
            <ListItem
              key={task.id}
              sx={{
                // backgroundColor:
                //   index === currentTaskIndex ? "" : "transparent",
                // color: textColor,
                borderRadius: "4px",
                mx: 1,
                my: 0.5,
                transition: "0.3s ease-in-out",
                "&:hover": {
                  backgroundColor:
                    index === currentTaskIndex ? "action.hover" : "action.hover",
                  cursor: "pointer",
                },
                borderBottom: "1px solid #ddd",
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <span style={{ marginRight: "8px", fontSize: "16px" }}>##{index} - </span>
                    {/* <span style={{ marginRight: "8px", fontSize: "16px" }}>{emoji}</span> */}
                    {task.task_title}
                  </Box>
                }
                secondary={task.status}
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};



export default function ChatComponent({ sessionId, sessionType }) {
  const [tasks, setTasks] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(-1);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [themeMode, setThemeMode] = useState(
    localStorage.getItem("themeMode") || "light"
  );
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [messages, setMessages] = useState([]);
  const tasksEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [hasCreated, setHasCreated] = useState(false);
  const toggleTheme = () => {
    localStorage.setItem("themeMode", themeMode === "light" ? "dark" : "light");
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const addMessage = useCallback((text, isUser = false) => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, text, isUser },
    ]);
  }, []);

  const fetchTasks = useCallback(async () => {
    if (sessionType === "evening") {
      setLoading(true);
      try {
        // For testing, we'll use dummy tasks instead of fetching from the server
        // const fetchedTasks = dummyTasks.map((task) => ({ ...task, status: "Pending" }));
        const { tasks: fetchedTasks } = await getTaskBySessionId(sessionId);
        setTasks(fetchedTasks);
        setCurrentTaskIndex(0);
        if (fetchedTasks.length === 0) {
          addMessage(
            "No tasks found for today. Did you forget to add tasks this morning?"
          );
        } else {
          if (messages.length === 0) {
            addMessage(
              `Good evening! You have ${fetchedTasks.length} tasks for today. Let's update your tasks`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to fetch tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    } else if (sessionType === "morning" && messages.length === 0) {
      try {
        const morningTasks = await getTaskBySessionId(sessionId);
        setTasks(morningTasks?.tasks || []);
        addMessage(
          tasks?.length || morningTasks?.tasks.length > 0
            ? `You have Submitted ${
                tasks.length || morningTasks?.tasks.length
              } tasks for today.Do you have any other tasks for today?`
            : "Good morning! What tasks do you have for today?",false
        );
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to fetch morning tasks. Please try again."
        );
      }
      // setTasks([]); // Reset tasks for morning session
    }
  }, [sessionType, addMessage, messages.length, sessionId, tasks.length]);

  useEffect(() => {
    fetchTasks();
  }, [hasCreated]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      tasksEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setShowScrollButton(scrollHeight - scrollTop > clientHeight + 10);
  }, []);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
      return () => chatContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]); // Updated useEffect dependency

  const handleSpecialCommand = useCallback(
    (command) => {
      switch (command) {
        case "/help":
          addMessage(
            "Available commands:\n" +
              Object.entries(SPECIAL_COMMANDS)
                .map(([cmd, desc]) => `${cmd}: ${desc}`)
                .join("\n")
          );
          break;
        case "/clear":
          setMessages([]);
          addMessage("Chat cleared.");
          break;
        case "/tasks":
          if (tasks.length > 0) {
            addMessage(
              "Current tasks:\n" +
                tasks.map((task) => `- ${task.task_title}: ${task.status}`).join("\n")
            );
          } else {
            addMessage("No tasks found.");
          }
          break;
        default:
          addMessage(`Unknown command: ${command}`);
      }
    },
    [tasks, addMessage]
  );

  const parseUserInput = (input) => {
    const lowerCaseInput = input.toLowerCase();
    const completionCommands = [
      "done",
      "create",
      "completed",
      "submitted",
      "submit",
      "submit tasks",
      "ok",
      "no",
      "yes",
    ];
    const isCompletionCommand = completionCommands.includes(lowerCaseInput)
    return {
      isCompletionCommand,
      text: input.trim(),
    };
  };

  const handleSend = useCallback(async () => {
    if (!inputValue.trim()) return;

    // Parse user input
    const { isCompletionCommand, text } = parseUserInput(inputValue);

    // Add the latest user input to the messages array
    const newMessage ={
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      isUser: true,
    }
    // const splitedText = text.split(SPECIAL_CHARACTERS);
    // setMessages((prev) => [...prev, newMessage]);
    // console.log({messages});

    // Handle special commands
    if (text.startsWith("/")) {
      handleSpecialCommand(text);
    } else if (sessionType === "morning") {
      // Morning session logic remains unchanged
      if (isCompletionCommand) {
        // if (tasks.length === 0) {
        //   addMessage(
        //     "No tasks have been created yet. Please add some tasks before completing."
        //   );
        // } 
        try {
          
          
          setLoading(true);
          const res = await createChat({
            sessionId,
            sessionType,
            messages: messages.filter((m)=>m.isUser).map((m) => ({
              role: m.isUser ? "user" : "assistant",
              content: m.text,
            })),
          });
          // setMessages([]);
          addMessage(
            `${
              res?.message || "Task creation completed"
            }. Here's a summary of your tasks: ${res?.tasks?.map(
              (task) => `\n - ${task.task_title}`
            )}`
          );
          
          // tasks.forEach((task) => addMessage(`- ${task.task_title}`));
          addMessage(
            "Do you have any more tasks to add? If not, type 'DONE' to complete task creation."
          );
          setHasCreated(true);
          toast.success(res?.message || "Tasks created successfully!");
          setTasks(res?.tasks?.length > 0 ? res?.tasks : tasks)
              scrollToBottom();

        } catch (error) {
          toast.error(
            error?.response?.data?.message || "Failed to create task. Please try again."
          );
          addMessage(
            error?.response?.data?.message || "Failed to create task. Please try again."
          );
        } finally {
          setLoading(false);
              scrollToBottom();

        }
        
        // }
      } else  {
        try {
          setLoading(true);
              setMessages((prev) => [...prev, newMessage]);

          const newTasks = text
            .split(SPECIAL_CHARACTERS)
            .map((part) => ({
              id: Date.now() + Math.random(),
              task_title: part.trim(),
              status: "pending",
            }))
            .filter((task) => task.task_title);
          // setTasks((prev) => [...newTasks, ...prev]);
          newTasks.forEach((task) => {
            addMessage(`Task added - ${task.task_title}`, false);
          });
          addMessage(
            "Do you have any more tasks to add? If not, type 'DONE' to complete task creation."
          );
              scrollToBottom();

        } catch (error) {
          console.error("Error creating task:", error);
          toast.error(
            error?.response?.data?.message || "Failed to create task. Please try again."
          );
          addMessage(
            error?.response?.data?.message || "Failed to create task. Please try again."
          );
        } finally {

          setLoading(false);
          scrollToBottom();

        }
      }
    } else if (sessionType === "evening" ) {
      // Evening session logic
      try {
        setLoading(true);

        // Ensure the latest message is included in the messages array
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
            scrollToBottom();


        // Call the backend with the updated messages array
        const res = await createChat({
          sessionId,
          sessionType,
          messages: updatedMessages.map((m) => ({
            role: m.isUser ? "user" : "assistant",
            content: m.text,
          })),
        });

        // Clear messages or provide feedback
        addMessage(
          `Task update completed. Here's a summary of your tasks: ${res?.updatedTasks?.map(
            (task) => `\n - ${task.task_title} - ${task.status}`
          )}`
        );
        // tasks.forEach((task) => addMessage(`- ${task.task_title}`));
        setHasCreated(true);
        toast.success(res?.message || "Tasks updated successfully!");
                  setTasks(res?.updatedTasks?.length > 0 ? res?.updatedTasks : tasks);
    scrollToBottom();

      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to update task. Please try again."
        );
        addMessage(
          error?.response?.data?.message || "Failed to update task. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    // Clear the input field and scroll to the bottom
    setInputValue("");
    scrollToBottom();
  }, [
    inputValue,
    sessionType,
    tasks, //if add this then multiple , comma separted tasks wont be creat
    addMessage,
    handleSpecialCommand,
    scrollToBottom,
    messages,
    sessionId,
  ]);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedMessageId(id);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopiedMessageId(null), 2000);
      },
      (err) => console.error("Failed to copy text:", err)
    );
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };
  useEffect(() => {
    if (hasCreated) {
      setTimeout(() => {
        // setHasCreated(false);
        // setMessages([]);
      }, 2000);
    }
  }, [hasCreated]);

  return (
    <ThemeProvider theme={themeMode === "light" ? lightTheme : darkTheme}>
      <Box sx={{ display: "flex", height: "100%" }}>
        {!isMobile && (
          <Paper
            elevation={3}
            sx={{
              width: "300px",
              minWidth: "300px",
              overflowY: "auto",
              padding: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TaskList tasks={tasks} currentTaskIndex={currentTaskIndex} />
          </Paper>
        )}

        {/* Chat Area */}
        <Paper
          sx={{
            flexGrow: 1,
            p: [1, 2, 3, 4],
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {isMobile && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: ["3%"],
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <IconButton onClick={toggleDrawer(true)} sx={{}}>
                <MenuIcon />
              </IconButton>
            </Box>
          )}
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: ["5%", "3%"],
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <IconButton onClick={toggleTheme}>
              {themeMode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Box>
          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            <TaskList tasks={tasks} currentTaskIndex={currentTaskIndex} />
          </Drawer>
          <Box
            className="custom-scrollbar"
            ref={chatContainerRef}
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              position: "relative",
              mb: [2, 3],
              pb: [3, 4],
              p: 1,
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#e0e0e0",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#673ab7",
                borderRadius: "10px",
                transition: "background 0.3s ease-in-out",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#512da8",
              },
            }}
          >
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.isUser ? "flex-end" : "flex-start",
                  my: 1,
                }}
              >
                <Box
                  sx={{
                    maxWidth: "80%",
                    p: 2,
                    borderRadius: "10px",
                    backgroundColor: msg.isUser
                      ? themeMode === "light"
                        ? "#e0e0e0"
                        : "#000000"
                      : themeMode === "light"
                      ? "#e0e0e0"
                      : "#333333",
                    color: themeMode === "light" ? "#000000" : "#ffffff",
                    position: "relative",
                  }}
                >
                  <ReactMarkdown
                    children={msg.text}
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <Box
                            sx={{
                              position: "relative",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <SyntaxHighlighter
                              children={String(children).replace(/\n$/, "")}
                              language={match[1]}
                              style={themeMode === "light" ? atomOneLight : atomOneDark}
                              PreTag="div"
                              {...props}
                            />
                            <IconButton
                              onClick={() => handleCopy(msg.id, String(children))}
                              sx={{
                                position: "absolute",
                                top: 5,
                                right: 5,
                                color: "#ffffff",
                                backgroundColor: "#444444",
                                "&:hover": { backgroundColor: "#666666" },
                              }}
                            >
                              {copiedMessageId === msg.id ? (
                                <CheckIcon fontSize="small" />
                              ) : (
                                <ContentCopyIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Box>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <IconButton
                    onClick={() => handleCopy(msg.id, msg.text)}
                    sx={{
                      color: themeMode === "light" ? "#000000" : "#ffffff",
                      backgroundColor: themeMode === "light" ? "#e0e0e0" : "#444444",
                      "&:hover": {
                        backgroundColor: themeMode === "light" ? "#bdbdbd" : "#666666",
                      },
                    }}
                  >
                    {copiedMessageId === msg.id ? (
                      <CheckIcon fontSize="small" />
                    ) : (
                      <ContentCopyIcon fontSize="small" />
                    )}
                  </IconButton>
                </Box>
              </Box>
            ))}
            {loading && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 1,
                  justifyContent: "flex-start",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" color="textSecondary" fontWeight="bold">
                    AI is thinking.....
                  </Typography>
                </Box>
              </Box>
            )}
            <div ref={tasksEndRef} style={{ float: "left", clear: "both" }} />
          </Box>

          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "end",
              justifyContent: "space-between",
              gap: 1,
              borderRadius: "10px",
              p: 1.5,
              m: 1,
              backgroundColor: themeMode === "light" ? "#ffffff" : "#333333",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
              border: `1px solid ${themeMode === "light" ? "#e0e0e0" : "#333333"}`,
              maxWidth: ["100%", "80%"],
              width: "100%",
              mx: "auto",
            }}
          >
            {showScrollButton && (
              <Fab
                size="medium"
                color="primary"
                sx={{
                  position: "absolute",
                  right: "50%",
                  top: "-10px",
                  transform: "translate(50%, -50%)",
                  zIndex: 10,
                  backgroundColor: themeMode === "light" ? "#ffffff" : "#444444",
                  color: themeMode === "light" ? "#000000" : "#ffffff",
                  "&:hover": {
                    backgroundColor: themeMode === "light" ? "#e0e0e0" : "#666666",
                  },
                  transition: "background-color 0.3s ease",
                }}
                onClick={scrollToBottom}
              >
                <KeyboardArrowDownIcon />
              </Fab>
            )}
            <TextareaAutosize
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={
                loading || (sessionType === "evening" && currentTaskIndex >= tasks.length)
              }
              minRows={3}
              maxRows={8}
              style={{
                fontSize: "16px",
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                outline: "none",
                flex: 1,
                backgroundColor: themeMode === "light" ? "#ffffff" : "#333333",
                color: themeMode === "light" ? "#000000" : "#ffffff",
                resize: "none",
              }}
              placeholder={
                sessionType === "morning"
                  ? "Enter new task or command..."
                  : "Enter task status..."
              }
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <IconButton
                onClick={handleSend}
                disabled={
                  loading ||
                  !inputValue.trim() ||
                  (sessionType === "evening" && currentTaskIndex >= tasks.length)
                }
                sx={{
                  backgroundColor: themeMode === "light" ? "#673ab7" : "#bb86fc",
                  color: themeMode === "light" ? "#ffffff" : "#000000",
                  borderRadius: "50%",
                  p: 1.2,
                  ":hover": {
                    backgroundColor: themeMode === "light" ? "#673ab777" : "#bb86fccc",
                  },
                  transition: "background-color 0.3s ease",
                }}
              >
                {loading ? <CircularProgress size={26} color="primary" /> : <SendIcon />}
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
