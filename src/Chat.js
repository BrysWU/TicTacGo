import React, { useEffect, useState, useRef } from "react";
import { Box, TextField, IconButton, Typography, Stack, Fade, Avatar } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function Chat({ socket, gameId, you, opponent, disabled }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    setMessages([]); // clear chat when gameId changes
  }, [gameId]);

  useEffect(() => {
    const handleMsg = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on("chatMessage", handleMsg);
    return () => {
      socket.off("chatMessage", handleMsg);
    };
  }, [socket]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    socket.emit("chatMessage", {
      gameId,
      senderId: you.id,
      text: text.trim()
    });
    setText("");
  };

  function getUser(id) {
    return id === you.id ? you : opponent;
  }

  return (
    <Fade in timeout={600}>
      <Box>
        <Typography sx={{ fontWeight: 700, mb: 1, fontSize: 16 }}>
          Game Chat
        </Typography>
        <Box sx={{ minHeight: 70, maxHeight: 110, overflowY: "auto", mb: 1, pr: 1 }}>
          {messages.length === 0 && (
            <Typography sx={{ opacity: 0.5, fontSize: 13, mt: 1 }}>
              Say hello to your opponent!
            </Typography>
          )}
          {messages.map((msg, i) => {
            const isMe = msg.senderId === you.id;
            const user = getUser(msg.senderId);
            return (
              <Stack
                key={i}
                direction="row"
                spacing={1}
                sx={{ mb: 0.5, alignItems: "flex-end", justifyContent: isMe ? "flex-end" : "flex-start" }}
              >
                {!isMe && <Avatar src={user.avatar ? `https://ttgback.onrender.com${user.avatar}` : undefined} sx={{ width: 24, height: 24, fontSize: 14, bgcolor: "#00e5ff" }}>{!user.avatar && user.username[0]}</Avatar>}
                <Box
                  sx={{
                    bgcolor: isMe ? "#ffb300" : "#00e5ff",
                    color: "#002147",
                    px: 1.5,
                    py: 0.7,
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: 14,
                    maxWidth: "70%",
                    wordBreak: "break-word",
                    boxShadow: 1
                  }}
                >
                  {msg.text}
                </Box>
                {isMe && <Avatar src={user.avatar ? `https://ttgback.onrender.com${user.avatar}` : undefined} sx={{ width: 24, height: 24, fontSize: 14, bgcolor: "#ffb300" }}>{!user.avatar && user.username[0]}</Avatar>}
              </Stack>
            );
          })}
          <div ref={chatEndRef} />
        </Box>
        <form onSubmit={handleSend} style={{ display: "flex", alignItems: "center" }}>
          <TextField
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type a message..."
            size="small"
            fullWidth
            disabled={disabled}
            sx={{
              bgcolor: "rgba(255,255,255,0.07)",
              input: { color: "#fff" }
            }}
            InputProps={{ style: { color: "#fff" } }}
          />
          <IconButton
            color="secondary"
            type="submit"
            disabled={disabled || !text.trim()}
            sx={{ ml: 1 }}
          >
            <SendIcon />
          </IconButton>
        </form>
      </Box>
    </Fade>
  );
}
