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
import { SqliteUtil } from "../../webcore/sqlite";
import { baseAIUrl, sqliteModel } from "../../webcore/constant";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AIChatProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

type OllamaRequestBody = {
  model: string;
  prompt: string;
  stream: boolean;
  temperature?: number;
};


function buildOllamaBody(
  schema: string,
  question: string,
): OllamaRequestBody {
  return {
    model: sqliteModel,
    stream: false,
    temperature:  0,
    prompt: `
      You are an expert in SQLite.

      Given the database schema and a user question, write a valid SQLite query.

      Rules:
      - Only return the SQL query
      - Do not explain anything
      - Do not include markdown
      - Use only SQLite syntax

      Schema:
        ${schema}

      Question:
        ${question}
    `
  };
}

const AIChat: React.FC<AIChatProps> = ({ messages, setMessages }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [schema, setSchema] = useState<string | null>("");

  useEffect(() => {
   
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    var scm = schema
    if(!scm) {
      scm = SqliteUtil.exportSchemaForLLM();
      setSchema(scm);
    }

    if(!scm) {
      return
    }

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
      const body = buildOllamaBody(scm, userMessage.content);
      const res = await fetch(`${baseAIUrl}api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      let text = "";
      try {
        const data = await res.json();
        console.log(data)
        text = data?.response || JSON.stringify(data);
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
          content: "server error",
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
          gap: 1.5,
          bgcolor: "#232323",
        }}
      >
        {/* spacer */}
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
          placeholder="You can ask anything about SQLite."
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