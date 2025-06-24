import React from "react";
import { Box, Paper, Stack, Typography, Avatar, Modal, Fade } from "@mui/material";

export default function Board({
  board,
  handleClick,
  currentTurn,
  symbol,
  winner,
  players,
  you,
  opponent,
  bettingOpen
}) {
  // AVATAR LOGIC: use base64 or undefined for Avatar src
  const getAvatarSrc = (user) => user.avatar || undefined;

  const Xplayer = players.X || you;
  const Oplayer = players.O || opponent;

  return (
    <Fade in timeout={600}>
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={4} sx={{ mb: 3 }}>
          <Box sx={{ textAlign: "center" }}>
            <Avatar
              src={getAvatarSrc(Xplayer)}
              sx={{ bgcolor: "#232f4b", mx: "auto", mb: 1, fontWeight: 700, width: 48, height: 48, fontSize: 26 }}
            >{!Xplayer.avatar && Xplayer.username[0]}</Avatar>
            <Typography sx={{ fontWeight: 700 }}>
              {Xplayer.username} <span style={{ color: "#ffb300" }}>[X]</span>
            </Typography>
            <Typography sx={{ fontSize: 13, opacity: 0.7 }}>
              Points: {Xplayer.points ?? "N/A"}
            </Typography>
            {Xplayer.isGuest && <Typography sx={{ fontSize: 13, opacity: 0.7 }}>(Guest)</Typography>}
            {!Xplayer.isGuest && <Typography sx={{ fontSize: 13, opacity: 0.7 }}>(User)</Typography>}
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 900, opacity: 0.5, mt: 2 }}>VS</Typography>
          <Box sx={{ textAlign: "center" }}>
            <Avatar
              src={getAvatarSrc(Oplayer)}
              sx={{ bgcolor: "#232f4b", mx: "auto", mb: 1, fontWeight: 700, width: 48, height: 48, fontSize: 26 }}
            >{!Oplayer.avatar && Oplayer.username[0]}</Avatar>
            <Typography sx={{ fontWeight: 700 }}>
              {Oplayer.username} <span style={{ color: "#00e5ff" }}>[O]</span>
            </Typography>
            <Typography sx={{ fontSize: 13, opacity: 0.7 }}>
              Points: {Oplayer.points ?? "N/A"}
            </Typography>
            {Oplayer.isGuest && <Typography sx={{ fontSize: 13, opacity: 0.7 }}>(Guest)</Typography>}
            {!Oplayer.isGuest && <Typography sx={{ fontSize: 13, opacity: 0.7 }}>(User)</Typography>}
          </Box>
        </Stack>
        <Stack direction="row" justifyContent="center" spacing={0.5} sx={{ mb: 2 }}>
          {board.map((cell, idx) => (
            <Paper
              key={idx}
              sx={{
                width: 70,
                height: 70,
                fontSize: 40,
                fontWeight: 700,
                bgcolor: board[idx] ? (board[idx] === "X" ? "#ffd54f" : "#4dd0e1") : "#232f4b",
                color: board[idx] ? "#002147" : "#cfd8dc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                m: 0.5,
                cursor: !board[idx] && !winner && currentTurn === symbol && !bettingOpen ? "pointer" : "default",
                transition: "background 0.2s"
              }}
              onClick={() => handleClick(idx)}
            >
              {board[idx]}
            </Paper>
          ))}
        </Stack>
        {/* BETTING DIALOG */}
        <Modal open={bettingOpen}>
          <Box sx={{
            bgcolor: "#232f4b", color: "white", p: 4, borderRadius: 3,
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            minWidth: 300, textAlign: "center"
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Betting is Open</Typography>
            <Typography sx={{ mb: 2 }}>Place your bets!</Typography>
          </Box>
        </Modal>
      </Box>
    </Fade>
  );
}
