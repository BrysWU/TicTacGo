import React, { useState } from "react";
import { Box, Typography, Paper, Container, Fade } from "@mui/material";
import Queue from "./Queue";
import Board from "./Board";
import logo from "./assets/logo.svg";

function App() {
  const [gameState, setGameState] = useState(null);
  const [nickname, setNickname] = useState("");

  // After a game, continue using the same nickname
  const handleGameStart = (state) => {
    setGameState(state);
    setNickname(state.nicknames[state.symbol]);
  };

  const handlePlayAgain = () => {
    setGameState(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #002147 70%, #133566 100%)",
        color: "white",
        pb: 4
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={1400}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 6, pb: 1 }}>
            <img src={logo} alt="Tic Tac Go!" width={70} style={{ filter: "invert(1)", marginBottom: 12 }}/>
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
            ? <Queue onGameStart={handleGameStart} presetNickname={nickname} />
            : <Board gameState={gameState} setGameState={setGameState} onPlayAgain={handlePlayAgain} nickname={nickname} />}
        </Paper>
      </Container>
      <Box sx={{ textAlign: "center", mt: 6, opacity: 0.5, fontSize: 14 }}>
        &copy; {new Date().getFullYear()} Tic Tac Go! | Made with 💙 and MUI by KHK
      </Box>
    </Box>
  );
}

export default App;