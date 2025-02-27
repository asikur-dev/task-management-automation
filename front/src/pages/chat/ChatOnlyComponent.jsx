import React, { useState, useEffect, useRef, useCallback } from "react";
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
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import "react-chat-elements/dist/main.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import { atomOneDark, atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Brightness4Icon from "@mui/icons-material/Brightness4"; // Dark mode icon
import Brightness7Icon from "@mui/icons-material/Brightness7"; // Light mode icon
import SyntaxHighlighter from "react-syntax-highlighter";
import toast from "react-hot-toast";

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

export default function ChatComponent() {
  const [messages, setMessages] = useState([{
    id: 1,
    position: "left",
    type: "text",
    text: "Hello! How can I help you today?",
    date: new Date(),
    role: "assistant",
  }]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [themeMode, setThemeMode] = useState(localStorage.getItem("themeMode")|| "light"); // Dynamic theme mode
  const [copiedMessageId, setCopiedMessageId] = useState(); // Track copied messages
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    localStorage.setItem("themeMode", themeMode === "light" ? "dark" : "light");
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  // Function to save messages to localStorage
  const saveMessagesToLocalStorage = (msgs) => {
    const latestMessages = msgs.slice(-10); // Keep only the latest 10 messages
    localStorage.setItem("chatHistory", JSON.stringify(latestMessages));
  };

  // Function to load messages from localStorage
  const loadMessagesFromLocalStorage = () => {
    const storedMessages = localStorage.getItem("chatHistory");
    return storedMessages ? JSON.parse(storedMessages) : [];
  };

  // Load messages from localStorage on component mount
  useEffect(() => {
    const storedMessages = loadMessagesFromLocalStorage();
    if(storedMessages.length > 0) {
      setMessages(storedMessages);
    }else{
      setMessages([{
        id: 1,
        position: "left",
        type: "text",
        text: "Hello! How can I help you today?",
        date: new Date(),
        role: "assistant"
      }]);
    }
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setShowScrollButton(scrollHeight - scrollTop > clientHeight + 10);
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
      return () => chatContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleSend = useCallback(async (text) => {
    if (!inputValue.trim() && !text.trim()) return;

    const userMsg = {
      id: Date.now(), // Unique ID for the user message
      position: "right",
      type: "text",
      text: inputValue,
      date: new Date(),
      role: "user",
    };

    // Add the new message to the state
    setMessages((prev) => {
      const updatedMessages = [...prev, userMsg];
      saveMessagesToLocalStorage(updatedMessages); // Save messages to localStorage
      return updatedMessages;
    });

    setInputValue("");

    const assistantMsgPlaceholder = {
      id: Date.now() + 1, // Unique ID for the assistant message
      position: "left",
      type: "text",
      text: "",
      date: new Date(),
      role: "assistant",
    };

    setMessages((prev) => {
      const updatedMessages = [...prev, assistantMsgPlaceholder];
      saveMessagesToLocalStorage(updatedMessages); // Save messages to localStorage
      return updatedMessages;
    });

    scrollToBottom();
    setLoading(true);

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/openai/chat-only", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          messages: [...messages.map((m)=>({role: m.role, content: m.text})), { role: "user", content: inputValue }].slice(-10), // Pass only the latest 10 messages
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullReply = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullReply += chunk;

        setMessages((prev) => {
          const updatedMessages = [...prev];
          const lastMessageIndex = updatedMessages.length - 1;
          if (updatedMessages[lastMessageIndex].position === "left") {
            updatedMessages[lastMessageIndex] = {
              ...updatedMessages[lastMessageIndex],
              text: fullReply,
              role: "assistant",
            };
          }
          saveMessagesToLocalStorage(updatedMessages); // Save messages to localStorage
          return updatedMessages;
        });

        scrollToBottom();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => {
        const updatedMessages = [...prev];
        const lastMessageIndex = updatedMessages.length - 1;
        if (updatedMessages[lastMessageIndex].position === "left") {
          updatedMessages[lastMessageIndex] = {
            ...updatedMessages[lastMessageIndex],
            text: "An error occurred while generating the response.",
            role: "assistant",
          };
        }
        saveMessagesToLocalStorage(updatedMessages); // Save messages to localStorage
        return updatedMessages;
      });
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }, [inputValue, messages]);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedMessageId(id); // Mark this message as copied
        toast.success("Copied to clipboard!");
        setTimeout(
          () =>
            setCopiedMessageId(null
            ),
          2000
        ); // Reset after 2 seconds
      },
      (err) => console.error("Failed to copy text:", err)
    );
  };

  const handleReply = (text) => {
    // setInputValue(`${inputValue}\n\n${text}`);
    handleSend(text);
    scrollToBottom();
  };

  return (
    <ThemeProvider theme={themeMode === "light" ? lightTheme : darkTheme}>
      <Paper
        sx={{
          p: [1, 2, 3, 4],
          height: "100%",
          maxWidth: "100vw",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Theme Toggle Button */}
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
          {messages
            .filter((msg) => msg.text.trim())
            .map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.position === "right" ? "flex-end" : "flex-start",
                  my: 1,
                }}
              >
                <Box
                  sx={{
                    maxWidth: "80%",
                    p: 2,
                    borderRadius: "10px",
                    backgroundColor:
                      msg.position === "right"
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
                  <IconButton
                    onClick={() => handleReply(msg.text)}
                    sx={{
                      color: themeMode === "light" ? "#000000" : "#ffffff",
                      backgroundColor: themeMode === "light" ? "#e0e0e0" : "#444444",
                      "&:hover": {
                        backgroundColor: themeMode === "light" ? "#bdbdbd" : "#666666",
                      },
                    }}
                  >
                    <SettingsBackupRestoreIcon fontSize="small" />
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
              {/* <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="rectangular" width={150} height={40} /> */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} />
                <Typography variant="body2" color="textSecondary" fontWeight="bold">
                  AI is thinking.....
                </Typography>
              </Box>
            </Box>
          )}
          <div ref={messagesEndRef} style={{ float: "left", clear: "both" }} />
        </Box>

        {/* Chat Input */}
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
            maxWidth: ["100%", "50%"],
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
            disabled={loading}
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
            placeholder="Message ChatGPT..."
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            {/* <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >

              <Badge>Reason</Badge>
            </Box> */}
            <IconButton
              onClick={handleSend}
              disabled={loading || !inputValue.trim()}
              sx={{
                backgroundColor: themeMode === "light" ? "#673ab7" : "#bb86fc",
                color: "#ffffff",
                borderRadius: "50%",
                p: 1.2,
              }}
            >
              {loading ? <CircularProgress size={26} color="primary" /> : <SendIcon />}
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </ThemeProvider>
  );
}