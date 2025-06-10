import React, { useState } from "react";
import {
  Box, Typography, Paper, Button, TextField, Stack, Fade, Link
} from "@mui/material";
import logo from "./assets/logo.svg";

export default function GuestEntry({ onGuest, onLogin, onSignup }) {
  const [nickname, setNickname] = useState("");
  const [err, setErr] = useState("");

  function handleGuest(e) {
    e.preventDefault();
    if (!nickname.trim()) {
      setErr("Please enter a nickname.");
      return;
    }
    if (nickname.trim().length > 24) {
      setErr("Nickname too long (max 24 chars).");
      return;
    }
    onGuest(nickname.trim());
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #002147 70%, #133566 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Fade in timeout={700}>
        <Paper elevation={8} sx={{ p: 4, borderRadius: 4, minWidth: 340, maxWidth: 400 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img src={logo} width={58} style={{ filter: "invert(1)", marginBottom: 12 }}/>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>Play as Guest</Typography>
            <Typography sx={{ opacity: 0.7, fontSize: 16, mb: 2 }}>
              Enter a nickname to play as a guest. Or{" "}
              <Link href="#" onClick={e => { e.preventDefault(); onLogin(); }}>Sign in</Link>{" "}
              or{" "}
              <Link href="#" onClick={e => { e.preventDefault(); onSignup(); }}>Sign up</Link>{" "}
              for stats &amp; profile.
            </Typography>
            <form onSubmit={handleGuest} style={{ width: "100%" }}>
              <Stack spacing={2}>
                <TextField
                  label="Nickname"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  inputProps={{ maxLength: 24 }}
                  fullWidth
                  autoFocus
                  required
                />
                {err && <Typography color="error">{err}</Typography>}
                <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ fontWeight: 800, py: 1.5 }}>
                  Play as Guest
                </Button>
              </Stack>
            </form>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}