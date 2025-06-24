import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Fade,
  Stack,
  TextField,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";

const Queue = ({
  onGameStart,
  asGuest,
  guestNickname,
  setGuestNickname,
}) => {
  const socket = useSocket();
  const { token, user } = useAuth();
  const [waiting, setWaiting] = useState(false);
  const [queueCount, setQueueCount] = useState(0);
  const [err, setErr] = useState("");
  const [nicknameInput, setNicknameInput] = useState(guestNickname || "");

  useEffect(() => {
    setNicknameInput(guestNickname || "");
  }, [guestNickname]);

  useEffect(() => {
    const handleQueueCount = (count) => setQueueCount(count);
    const handleGameStart = (data) => {
      setWaiting(false);
      onGameStart({ ...data, socket });
    };
    const handleAuthError = (msg) => {
      setErr(msg);
      setWaiting(false);
    };

    socket.on("queueCount", handleQueueCount);
    socket.on("gameStart", handleGameStart);
    socket.on("authError", handleAuthError);

    return () => {
      socket.off("queueCount", handleQueueCount);
      socket.off("gameStart", handleGameStart);
      socket.off("authError", handleAuthError);
    };
  }, [socket, onGameStart]);

  const handlePlay = () => {
    setErr("");
    setWaiting(true);
    if (asGuest) {
      if (!nicknameInput.trim() || nicknameInput.trim().length < 2) {
        setErr("Nickname must be at least 2 characters.");
        setWaiting(false);
        return;
      }
      setGuestNickname(nicknameInput.trim());
      socket.emit("joinQueue", { nickname: nicknameInput.trim() });
    } else {
      socket.emit("joinQueue", { token });
    }
  };

  return (
    <Fade in timeout={600}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 360,
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 900, mb: 2, mt: 1, textAlign: "center" }}
          align="center"
        >
          Ready to play?
        </Typography>
        <Typography
          variant="body1"
          sx={{ opacity: 0.7, mb: 3, textAlign: "center" }}
          align="center"
        >
          Click Play to join the queue!
        </Typography>

        {asGuest && (
          <TextField
            label="Enter nickname"
            variant="outlined"
            value={nicknameInput}
            onChange={e => setNicknameInput(e.target.value.slice(0, 24))}
            sx={{
              mb: 2,
              background: "#fff",
              borderRadius: 2,
              width: "100%",
              maxWidth: 270,
            }}
            inputProps={{ maxLength: 24 }}
            autoFocus
            disabled={waiting}
          />
        )}

        <Button
          variant="contained"
          color="secondary"
          sx={{ fontWeight: 700, fontSize: 18, px: 6, py: 1.5, borderRadius: 3 }}
          onClick={handlePlay}
          disabled={waiting}
        >
          {waiting ? <CircularProgress size={22} color="inherit" /> : "Play"}
        </Button>

        {err && (
          <Typography sx={{ color: "red", mt: 2, textAlign: "center" }}>
            {err}
          </Typography>
        )}

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 4 }}>
          <PeopleAltIcon sx={{ color: "#ffb300" }} />
          <Typography sx={{ fontWeight: 700 }}>
            {queueCount} player{queueCount === 1 ? "" : "s"} in queue
          </Typography>
        </Stack>
      </Box>
    </Fade>
  );
};

export default Queue;
