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
    socket.on("queueCount", setQueueCount);

    socket.on("gameStart", (data) => {
      onGameStart({ ...data, socket });
      setWaiting(false);
    });

    socket.on("opponentLeft", () => setWaiting(false));

    socket.on("authError", (msg) => setErr(msg));

    socket.on("disconnect", () => setWaiting(false));

    return () => {
      socket.off("queueCount", setQueueCount);
      socket.off("gameStart");
      socket.off("opponentLeft");
      socket.off("authError");
      socket.off("disconnect");
    };
  }, [onGameStart, socket]);

  const joinQueue = () => {
    setErr("");
    if (!user) {
      if (!nicknameInput.trim()) {
        setErr("Please enter a nickname.");
        return;
      }
      if (nicknameInput.trim().length > 24) {
        setErr("Nickname too long (max 24 chars).");
        return;
      }
      setGuestNickname(nicknameInput.trim());
      socket.emit("joinQueue", { nickname: nicknameInput.trim() });
    } else {
      socket.emit("joinQueue", { token });
    }
    setWaiting(true);
  };

  return (
    <Fade in timeout={900}>
      <Box>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, textAlign: "center" }}>
          Ready to play?
        </Typography>
        {!user && (
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
            <TextField
              label="Nickname"
              variant="outlined"
              size="small"
              autoFocus
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              disabled={waiting}
              sx={{
                input: { color: "white" },
                label: { color: "#fff" },
                width: 160,
              }}
              InputLabelProps={{ style: { color: "#fff" } }}
            />
          </Stack>
        )}
        {user && (
          <Typography
            sx={{
              mb: 1,
              fontWeight: 600,
              fontSize: 17,
              color: "#ffb300",
              textAlign: "center",
            }}
          >
            Playing as: {user.username}
          </Typography>
        )}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={joinQueue}
            disabled={waiting}
            sx={{ fontWeight: 800, boxShadow: 2, px: 5 }}
          >
            Play
          </Button>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{ mb: 1 }}
        >
          <PeopleAltIcon sx={{ color: "#fff" }} />
          <Typography component="span" sx={{ fontWeight: 700 }}>
            {queueCount}
          </Typography>
          <Typography
            component="span"
            sx={{ opacity: 0.7, fontSize: 14, ml: 0.5 }}
          >
            {queueCount === 1 ? "player in queue" : "players in queue"}
          </Typography>
        </Stack>
        {waiting ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 2,
            }}
          >
            <CircularProgress color="secondary" />
            <Typography sx={{ mt: 2, fontWeight: 600 }}>
              Waiting for opponent...
            </Typography>
          </Box>
        ) : (
          <Typography sx={{ opacity: 0.6, mt: 2, textAlign: "center" }}>
            Click Play to join the queue!
          </Typography>
        )}
        {err && (
          <Typography color="error" sx={{ mt: 2 }}>
            {err}
          </Typography>
        )}
      </Box>
    </Fade>
  );
};

export default Queue;
