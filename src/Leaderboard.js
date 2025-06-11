import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Avatar, Stack, CircularProgress } from "@mui/material";
import axios from "axios";

const AVATAR_URL = "https://ttgback.onrender.com/avatars/";

export default function Leaderboard({ onClose }) {
  const [players, setPlayers] = useState(null);

  useEffect(() => {
    async function fetchLB() {
      const { data } = await axios.get("https://ttgback.onrender.com/api/leaderboard");
      setPlayers(data);
    }
    fetchLB();
  }, []);

  return (
    <Modal open onClose={onClose}>
      <Box sx={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        bgcolor: "#232f4b", p: 4, borderRadius: 4, minWidth: 350, boxShadow: 24
      }}>
        <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>Leaderboard</Typography>
        {!players ? <CircularProgress /> :
          <Box>
            {players.map((p, i) => (
              <Stack key={p.id} direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                <Typography sx={{ width: 24, fontWeight: 900 }}>{i + 1}</Typography>
                <Avatar src={p.avatar ? `${AVATAR_URL}${p.avatar}` : undefined} sx={{ bgcolor: "#ffb300" }}>{!p.avatar && p.username[0]}</Avatar>
                <Typography sx={{ fontWeight: 700, flex: 1 }}>{p.username}</Typography>
                <Typography color="success.main" sx={{ fontWeight: 800, mr: 2 }}>🏆 {p.wins}</Typography>
                <Typography color="error.main" sx={{ fontWeight: 800 }}>❌ {p.losses}</Typography>
              </Stack>
            ))}
          </Box>
        }
        <Box sx={{ mt: 2 }}>
          <button onClick={onClose} style={{ padding: 8, width: "100%", borderRadius: 6, background: "#ffb300", fontWeight: 700, fontSize: 16, border: 0 }}>
            Close
          </button>
        </Box>
      </Box>
    </Modal>
  );
}
