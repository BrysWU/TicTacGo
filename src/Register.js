import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper, CircularProgress, Link } from "@mui/material";
import { useAuth } from "./AuthContext";

export default function Register({ onSwitch, onBack, onSignupSuccess }) {
  const { signup, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    const res = await signup(username, password);
    if (!res.ok) setErr(res.error);
    else if (onSignupSuccess) onSignupSuccess();
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #002147 70%, #133566 100%)" }}>
      <Paper elevation={8} sx={{ p: 4, borderRadius: 4, minWidth: 320 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>Sign Up</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Username" fullWidth autoFocus sx={{ mb: 2 }} value={username} onChange={e => setUsername(e.target.value)} required />
          <TextField label="Password" fullWidth type="password" sx={{ mb: 2 }} value={password} onChange={e => setPassword(e.target.value)} required />
          {err && <Typography color="error" sx={{ mb: 2 }}>{err}</Typography>}
          <Button type="submit" fullWidth variant="contained" color="secondary" disabled={loading}>{loading ? <CircularProgress size={24} /> : "Sign Up"}</Button>
        </form>
        <Typography sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link href="#" onClick={e => { e.preventDefault(); onSwitch(); }}>Login</Link>
        </Typography>
        <Button sx={{ mt: 2 }} onClick={onBack} color="inherit" fullWidth>Back</Button>
      </Paper>
    </Box>
  );
}