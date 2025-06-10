import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Link,
} from "@mui/material";
import { useAuth } from "./AuthContext";

export default function Login({ onSwitch, onBack, onLoginSuccess }) {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    const res = await login(username, password);
    if (!res.ok) setErr(res.error);
    else if (onLoginSuccess) onLoginSuccess();
  }

  return (
    <Box sx={{ p: 3, minWidth: 320 }}>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          autoFocus
          sx={{ mb: 2 }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Password"
          fullWidth
          type="password"
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {err && (
          <Typography color="error" sx={{ mb: 2 }}>
            {err}
          </Typography>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>
      </form>
      <Typography sx={{ mt: 2 }}>
        Don't have an account?{" "}
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSwitch();
          }}
        >
          Sign up
        </Link>
      </Typography>
      <Button sx={{ mt: 2 }} onClick={onBack} color="inherit" fullWidth>
        Back
      </Button>
    </Box>
  );
}