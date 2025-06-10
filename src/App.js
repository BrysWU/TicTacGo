import React, { useState } from "react";
import {
  Box, Typography, Paper, Container, Fade, Button, Stack, AppBar, Toolbar, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import Queue from "./Queue";
import Board from "./Board";
import logo from "./assets/logo.svg";
import { useAuth } from "./AuthContext";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import Leaderboard from "./Leaderboard";
import GuestEntry from "./GuestEntry";

function App() {
  const { user, logout } = useAuth();
  const [guest, setGuest] = useState(() => {
    const g = localStorage.getItem("guestNickname");
    return g ? { nickname: g } : null;
  });
  const [gameState, setGameState] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // If not a user or guest, show guest entry screen
  if (!user && !guest) {
    return (
      <GuestEntry
        onGuest={(nickname) => {
          setGuest({ nickname });
          localStorage.setItem("guestNickname", nickname);
        }}
        onLogin={() => setShowLogin(true)}
        onSignup={() => setShowRegister(true)}
      />
    );
  }

  // Show login/register dialog if requested
  if (!user && showLogin) {
    return (
      <Login
        onSwitch={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
        onBack={() => setShowLogin(false)}
        onLoginSuccess={() => setGuest(null)}
      />
    );
  }
  if (!user && showRegister) {
    return (
      <Register
        onSwitch={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
        onBack={() => setShowRegister(false)}
        onSignupSuccess={() => setGuest(null)}
      />
    );
  }

  // If user just logged in, clear guest session
  if (user && guest) {
    setGuest(null);
    localStorage.removeItem("guestNickname");
  }

  const isGuest = !user && guest;
  const nickname = guest?.nickname;

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #002147 70%, #133566 100%)", color: "white", pb: 4 }}>
      <AppBar position="static" sx={{ background: "#002147" }}>
        <Toolbar>
          <img src={logo} alt="Tic Tac Go!" width={34} style={{ filter: "invert(1)", marginRight: 12 }}/>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 900, letterSpacing: 2 }}>
            TicTacGo
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button color="inherit" onClick={() => setShowLeaderboard(true)}>Leaderboard</Button>
            <Button color="inherit" disabled={isGuest} onClick={() => setShowProfile(true)}>Profile</Button>
            {user
              ? <Button color="inherit" onClick={logout}>Logout</Button>
              : <Button color="inherit" onClick={() => {
                  setGuest(null);
                  localStorage.removeItem("guestNickname");
                }}>Change Nickname</Button>
            }
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Fade in timeout={1400}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 6, pb: 1 }}>
            <img src={logo} alt="Tic Tac Toe" width={70} style={{ filter: "invert(1)", marginBottom: 12 }}/>
            <Typography variant="h2" align="center" sx={{ fontWeight: 900, letterSpacing: 2 }}>
              Tic Tac Go!
            </Typography>
            <Typography align="center" sx={{ opacity: 0.7, fontSize: 18, fontWeight: 400, mt: 1 }}>
              Play Tic Tac Toe &amp; chat with others in real-time!
            </Typography>
          </Box>
        </Fade>
        <Paper elevation={7} sx={{
          mt: 3, p: { xs: 2, md: 4 }, borderRadius: 4, background: "rgba(0,0,0,0.40)", backdropFilter: "blur(4px)"
        }}>
          {!gameState
            ? <Queue
                onGameStart={setGameState}
                asGuest={isGuest}
                guestNickname={nickname}
              />
            : <Board
                gameState={gameState}
                setGameState={setGameState}
                onPlayAgain={() => setGameState(null)}
              />}
        </Paper>
      </Container>
      <Box sx={{ textAlign: "center", mt: 6, opacity: 0.5, fontSize: 14 }}>
        &copy; {new Date().getFullYear()} Tic Tac Go! | Made with 💙 and MUI by KHK
      </Box>
      {showProfile && user && <Profile onClose={() => setShowProfile(false)} />}
      {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
    </Box>
  );
}

export default App;