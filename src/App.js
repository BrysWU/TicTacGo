import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Container,
  Fade,
  Button,
  Stack,
  AppBar,
  Toolbar,
  Dialog,
  IconButton
} from "@mui/material";
import Queue from "./Queue";
import Board from "./Board";
import logo from "./assets/logo.svg";
import { useAuth } from "./AuthContext";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import Leaderboard from "./Leaderboard";
import PersonIcon from "@mui/icons-material/Person";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

function App() {
  const { user, logout } = useAuth();
  const [nickname, setNickname] = useState(() => localStorage.getItem("guestNickname") || "");
  const [gameState, setGameState] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  if (user && nickname) {
    setNickname("");
    localStorage.removeItem("guestNickname");
  }

  const handleLogout = () => {
    logout();
    setNickname("");
    localStorage.removeItem("guestNickname");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #002147 70%, #133566 100%)",
        color: "white",
        pb: 4,
      }}
    >
      <AppBar position="static" sx={{ background: "#002147" }}>
        <Toolbar>
          <img
            src={logo}
            alt="Tic Tac Toe"
            width={34}
            style={{ filter: "invert(1)", marginRight: 12 }}
          />
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 900, letterSpacing: 2 }}
          >
            TicTacGo
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            {user && (
              <Stack direction="row" alignItems="center" spacing={1} sx={{
                bgcolor: "rgba(255,255,255,0.08)",
                borderRadius: 2,
                px: 2,
                py: 0.5,
                mr: 1,
              }}>
                <MonetizationOnIcon sx={{ color: "#ffb300", fontSize: 22, mr: 0.2 }} />
                <Typography sx={{
                  fontWeight: 700,
                  fontSize: 18,
                  color: "#ffb300",
                  letterSpacing: 0.5,
                  userSelect: "none"
                }}>
                  {typeof user.points === "number" ? user.points : "—"}
                </Typography>
              </Stack>
            )}
            <Button color="inherit" onClick={() => setShowLeaderboard(true)}>
              Leaderboard
            </Button>
            {user ? (
              <>
                <IconButton color="inherit" onClick={() => setShowProfile(true)}>
                  <PersonIcon />
                </IconButton>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => setLoginOpen(true)}>
                  Login
                </Button>
                <Button color="inherit" onClick={() => setRegisterOpen(true)}>
                  Sign up
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Fade in timeout={1400}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pt: 6,
              pb: 1,
            }}
          >
            <img
              src={logo}
              alt="Tic Tac Go!"
              width={70}
              style={{ filter: "invert(1)", marginBottom: 12 }}
            />
            <Typography
              variant="h2"
              align="center"
              sx={{ fontWeight: 900, letterSpacing: 2 }}
            >
              Tic Tac Go!
            </Typography>
            <Typography
              align="center"
              sx={{ opacity: 0.7, fontSize: 18, fontWeight: 400, mt: 1 }}
            >
              Play Tic Tac Toe &amp; chat with others in real-time!
            </Typography>
          </Box>
        </Fade>
        <Paper
          elevation={7}
          sx={{
            mt: 3,
            p: { xs: 2, md: 4 },
            borderRadius: 4,
            background: "rgba(0,0,0,0.40)",
            backdropFilter: "blur(4px)",
          }}
        >
          {!gameState ? (
            <Queue
              onGameStart={setGameState}
              asGuest={!user}
              guestNickname={nickname}
              setGuestNickname={(name) => {
                setNickname(name);
                localStorage.setItem("guestNickname", name);
              }}
            />
          ) : (
            <Board
              gameState={gameState}
              setGameState={setGameState}
              onPlayAgain={() => setGameState(null)}
            />
          )}
        </Paper>
      </Container>
      <Box sx={{ textAlign: "center", mt: 6, opacity: 0.5, fontSize: 14 }}>
        &copy; {new Date().getFullYear()} Tic Tac Go! | Made with 💙 and MUI by KHK
      </Box>
      {showProfile && user && (
        <Profile onClose={() => setShowProfile(false)} />
      )}
      {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
      <Dialog open={loginOpen} onClose={() => setLoginOpen(false)}>
        <Login
          onSwitch={() => {
            setLoginOpen(false);
            setRegisterOpen(true);
          }}
          onBack={() => setLoginOpen(false)}
          onLoginSuccess={() => setLoginOpen(false)}
        />
      </Dialog>
      <Dialog open={registerOpen} onClose={() => setRegisterOpen(false)}>
        <Register
          onSwitch={() => {
            setRegisterOpen(false);
            setLoginOpen(true);
          }}
          onBack={() => setRegisterOpen(false)}
          onSignupSuccess={() => setRegisterOpen(false)}
        />
      </Dialog>
    </Box>
  );
}

export default App;
