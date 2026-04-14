import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://nqhuy.info/sqliteapi/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userMessage.content }),
      });

      let text = "";
      try {
        const data = await res.json();
        text = data?.answer || JSON.stringify(data);
      } catch {
        text = await res.text();
      }

      const botMessage: Message = {
        id: Date.now().toString() + "_bot",
        role: "assistant",
        content: text || "(no response)",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "_err",
          role: "assistant",
          content: "API lỗi rồi bro",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 120px)",
        maxWidth: "calc(100vw - 280px)",
        width: "100%",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #333",
        bgcolor: "#232323",
      }}
    >
      {/* Chat area */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          // remove flex-end to allow full scroll
          // justifyContent: "flex-end",
          gap: 1.5,
          bgcolor: "#232323",
        }}
      >
        {/* spacer to push messages to bottom when short */}
        <Box sx={{ flexGrow: 1 }} />

        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              justifyContent:
                msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 1.5,
                maxWidth: "70%",
                bgcolor: msg.role === "user" ? "primary.main" : "#2f2f2f",
                color: msg.role === "user" ? "white" : "#e5e5e5",
                borderRadius: 2,
              }}
            >
              <Typography variant="body2">{msg.content}</Typography>
            </Paper>
          </Box>
        ))}

        {loading && (
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={16} />
            <Typography variant="body2" color="#ccc">
              Đang trả lời...
            </Typography>
          </Box>
        )}

        <div ref={bottomRef} />
      </Box>

      {/* Input */}
      <Box
        sx={{
          display: "flex",
          p: 1,
          borderTop: "1px solid #333",
          gap: 1,
          bgcolor: "#232323",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Hỏi gì về SQLite cũng được..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#555" },
              "&:hover fieldset": { borderColor: "#888" },
              "&.Mui-focused fieldset": { borderColor: "#aaa" },
            },
          }}
        />

        <IconButton
          color="primary"
          onClick={sendMessage}
          disabled={loading}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default AIChat;
