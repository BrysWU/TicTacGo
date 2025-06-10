import React, { useState, useEffect } from "react";
import { Box, Button, Typography, CircularProgress, Fade, Stack } from "@mui/material";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";

const Queue = ({ onGameStart }) => {
  const socket = useSocket();
  const { token } = useAuth();
  const [waiting, setWaiting] = useState(false);
  const [queueCount, setQueueCount] = useState(0);
  const [err, setErr] = useState("");

  useEffect(() => {
    socket.on("queueCount", setQueueCount);

    socket.on("gameStart", (data) => {
      onGameStart({ ...data, socket });
      setWaiting(false);
    });

    socket.on("opponentLeft", () => setWaiting(false));

    socket.on("authError", msg => setErr(msg));

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
    socket.emit("joinQueue", token);
    setWaiting(true);
  };

  return (
    <Fade in timeout={900}>
      <Box>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          Ready to play?
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
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
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mb: 1 }}>
          <PeopleAltIcon sx={{ color: "#fff" }} />
          <Typography component="span" sx={{ fontWeight: 700 }}>
            {queueCount}
          </Typography>
          <Typography component="span" sx={{ opacity: 0.7, fontSize: 14, ml: 0.5 }}>
            {queueCount === 1 ? "player in queue" : "players in queue"}
          </Typography>
        </Stack>
        {waiting
          ? <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
              <CircularProgress color="secondary" />
              <Typography sx={{ mt: 2, fontWeight: 600 }}>Waiting for opponent...</Typography>
            </Box>
          : <Typography sx={{ opacity: 0.6, mt: 2 }}>Click Play to join the queue!</Typography>
        }
        {err && <Typography color="error" sx={{ mt: 2 }}>{err}</Typography>}
      </Box>
    </Fade>
  );
};

export default Queue;