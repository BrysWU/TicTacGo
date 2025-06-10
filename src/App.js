import React, { useState } from "react";
import { Box, Typography, Paper, Container, Fade } from "@mui/material";
import Queue from "./Queue";
import Board from "./Board";
import logo from "./assets/logo.svg";

function App() {
  const [gameState, setGameState] = useState(null);

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
            <img src={logo} alt="Tic Tac Toe" width={70} style={{ filter: "invert(1)", marginBottom: 12 }}/>
            <Typography variant="h2" align="center" sx={{ fontWeight: 900, letterSpacing: 2 }}>
              Tic Tac Toe Live
            </Typography>
            <Typography align="center" sx={{ opacity: 0.7, fontSize: 18, fontWeight: 400, mt: 1 }}>
              Play real-time with others &amp; chat!
            </Typography>
          </Box>
        </Fade>
        <Paper elevation={7} sx={{
          mt: 3, p: { xs: 2, md: 4 }, borderRadius: 4, background: "rgba(0,0,0,0.40)", backdropFilter: "blur(4px)"
        }}>
          {!gameState
            ? <Queue onGameStart={setGameState} />
            : <Board gameState={gameState} setGameState={setGameState} />}
        </Paper>
      </Container>
      <Box sx={{ textAlign: "center", mt: 6, opacity: 0.5, fontSize: 14 }}>
        &copy; {new Date().getFullYear()} Tic Tac Toe Live | Made with 💙 and MUI
      </Box>
    </Box>
  );
}

export default App;