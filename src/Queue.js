import React, { useState, useEffect } from "react";
import {
  Box, Button, TextField, Typography, CircularProgress, Fade, Stack
} from "@mui/material";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useSocket } from "./SocketContext";

const Queue = ({ onGameStart, presetNickname }) => {
  const socket = useSocket();
  const [nickname, setNickname] = useState(presetNickname || "");
  const [waiting, setWaiting] = useState(false);
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    setNickname(presetNickname || "");
  }, [presetNickname]);

  useEffect(() => {
    socket.on("queueCount", setQueueCount);

    socket.on("gameStart", (data) => {
      onGameStart({ ...data, socket });
    });

    socket.on("disconnect", () => {
      setWaiting(false);
    });

    return () => {
      socket.off("queueCount", setQueueCount);
      socket.off("gameStart");
      socket.off("disconnect");
    };
  }, [onGameStart, socket]);

  const joinQueue = () => {
    socket.emit("joinQueue", nickname || undefined);
    setWaiting(true);
  };

  return (
    <Fade in timeout={900}>
      <Box>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          Ready to play?
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
          <TextField
            label="Nickname"
            variant="outlined"
            size="small"
            autoFocus
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            disabled={waiting || !!presetNickname}
            sx={{ input: { color: 'white' }, label: { color: "#fff" }, width: 160 }}
            InputLabelProps={{ style: { color: "#fff" } }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={joinQueue}
            disabled={waiting || !nickname}
            sx={{ fontWeight: 800, boxShadow: 2 }}
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
          : <Typography sx={{ opacity: 0.6, mt: 2 }}>Join the queue to start playing!</Typography>
        }
      </Box>
    </Fade>
  );
};

export default Queue;