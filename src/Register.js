import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Link,
  Stack,
} from "@mui/material";
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
    <Box
      sx={{
        bgcolor: "#232f4b",
        p: 4,
        borderRadius: 4,
        minWidth: 330,
        boxShadow: 24,
        mx: "auto",
        my: 4,
        color: "#fff",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: "#fff" }}>
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Username"
            fullWidth
            autoFocus
            sx={{
              "& .MuiInputBase-root": { color: "#fff" },
              "& .MuiInputLabel-root": { color: "#fff" },
              input: { color: "#fff" },
            }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            InputLabelProps={{ style: { color: "#fff" } }}
          />
          <TextField
            label="Password"
            fullWidth
            type="password"
            sx={{
              "& .MuiInputBase-root": { color: "#fff" },
              "& .MuiInputLabel-root": { color: "#fff" },
              input: { color: "#fff" },
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputLabelProps={{ style: { color: "#fff" } }}
          />
          {err && (
            <Typography color="error" sx={{ mb: 1 }}>
              {err}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            disabled={loading}
            sx={{ fontWeight: 800, py: 1.2, borderRadius: 3, mt: 1 }}
          >
            {loading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>
        </Stack>
      </form>
      <Typography sx={{ mt: 2, color: "#fff" }}>
        Already have an account?{" "}
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSwitch();
          }}
          sx={{ color: "#ffb300", fontWeight: 700 }}
        >
          Login
        </Link>
      </Typography>
      <Button
        sx={{
          mt: 2,
          fontWeight: 800,
          borderRadius: 2,
          bgcolor: "#3a4971",
          color: "#fff",
          "&:hover": { bgcolor: "#334166" },
        }}
        onClick={onBack}
        fullWidth
      >
        Back
      </Button>
    </Box>
  );
}
