import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button, Paper, Avatar, Fade, Stack, Slide
} from "@mui/material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import Chat from "./Chat";

const winningColors = {
  X: "#ffb300",
  O: "#00e5ff"
};

const Board = ({ gameState, setGameState }) => {
  const { socket, symbol, board: initialBoard, turn, gameId, nicknames, you } = gameState;
  const [board, setBoard] = useState(initialBoard);
  const [currentTurn, setTurn] = useState(turn);
  const [winner, setWinner] = useState(null);
  const [winnerNickname, setWinnerNickname] = useState(null);
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [animateCell, setAnimateCell] = useState(Array(9).fill(false));

  const opponentSymbol = symbol === "X" ? "O" : "X";
  const opponentNickname = nicknames[opponentSymbol];

  useEffect(() => {
    socket.on("gameUpdate", ({ board, turn, winner, winnerNickname }) => {
      setBoard([...board]);
      setTurn(turn);
      setWinner(winner);
      setWinnerNickname(winnerNickname);
      if (winner) {
        setAnimateCell(Array(9).fill(false));
      }
    });

    socket.on("opponentLeft", () => {
      setOpponentLeft(true);
    });

    return () => {
      socket.off("gameUpdate");
      socket.off("opponentLeft");
    };
  }, [socket]);

  const handleClick = (idx) => {
    if (winner || board[idx] || currentTurn !== symbol) return;
    socket.emit("makeMove", { gameId, index: idx, symbol });
    const newAnim = Array(9).fill(false);
    newAnim[idx] = true;
    setAnimateCell(newAnim);
  };

  const renderCell = (idx) => (
    <Slide
      in={true}
      direction={animateCell[idx] ? "down" : "up"}
      timeout={animateCell[idx] ? 600 : 300}
      key={idx}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 40,
          fontWeight: 900,
          color: board[idx] === "X" ? "#ffb300" : (board[idx] === "O" ? "#00e5ff" : "#fff"),
          border: "1.5px solid #ffffff33",
          cursor: board[idx] || winner || currentTurn !== symbol ? "not-allowed" : "pointer",
          background: board[idx] ? "#ffffff14" : "#ffffff05",
          borderRadius: 3,
          transition: "background 0.2s, color 0.2s"
        }}
        onClick={() => handleClick(idx)}
      >
        {board[idx] || ""}
      </Box>
    </Slide>
  );

  const reset = () => window.location.reload();

  return (
    <Fade in timeout={600}>
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={4} sx={{ mb: 3 }}>
          <Box sx={{ textAlign: "center" }}>
            <Avatar sx={{ bgcolor: "#232f4b", mx: "auto", mb: 1, fontWeight: 700 }}>
              {nicknames[symbol][0] || symbol}
            </Avatar>
            <Typography sx={{ fontWeight: 700 }}>
              {nicknames[symbol]} <span style={{ color: symbol === "X" ? "#ffb300" : "#00e5ff" }}>[{symbol}]</span>
            </Typography>
            <Typography sx={{ fontSize: 13, opacity: 0.7 }}>(You)</Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 900, opacity: 0.5, mt: 2 }}>VS</Typography>
          <Box sx={{ textAlign: "center" }}>
            <Avatar sx={{ bgcolor: "#232f4b", mx: "auto", mb: 1, fontWeight: 700 }}>
              {opponentNickname[0] || opponentSymbol}
            </Avatar>
            <Typography sx={{ fontWeight: 700 }}>
              {opponentNickname} <span style={{ color: opponentSymbol === "X" ? "#ffb300" : "#00e5ff" }}>[{opponentSymbol}]</span>
            </Typography>
            <Typography sx={{ fontSize: 13, opacity: 0.7 }}>(Opponent)</Typography>
          </Box>
        </Stack>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
          {opponentLeft ? (
            <Fade in>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Typography variant="h5" sx={{ color: "#ffb300", fontWeight: 900 }}>
                  Opponent left the game.
                </Typography>
                <Button variant="contained" color="secondary" sx={{ mt: 3, fontWeight: 700 }} onClick={reset}>
                  Play Again
                </Button>
              </Box>
            </Fade>
          ) : winner ? (
            <Fade in>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                {winner === "draw" ? (
                  <>
                    <EmojiEventsIcon sx={{ fontSize: 60, color: "#ffb300" }} />
                    <Typography variant="h5" sx={{ fontWeight: 900, mt: 1 }}>
                      It's a draw!
                    </Typography>
                  </>
                ) : winner === symbol ? (
                  <>
                    <EmojiEventsIcon sx={{ fontSize: 60, color: winningColors[symbol] }} />
                    <Typography variant="h5" sx={{ fontWeight: 900, mt: 1 }}>
                      You win! 🎉
                    </Typography>
                  </>
                ) : (
                  <>
                    <EmojiEventsIcon sx={{ fontSize: 60, color: winningColors[opponentSymbol] }} />
                    <Typography variant="h5" sx={{ fontWeight: 900, mt: 1 }}>
                      You lose! Winner: <span style={{ color: winningColors[opponentSymbol] }}>{winnerNickname || opponentNickname}</span>
                    </Typography>
                  </>
                )}
                <Button variant="contained" color="secondary" sx={{ mt: 3, fontWeight: 700 }} onClick={reset}>
                  Play Again
                </Button>
              </Box>
            </Fade>
          ) : (
            <Fade in>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <HourglassTopIcon sx={{ fontSize: 32, color: "#ffb300", mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 900, color: "#fff" }}>
                  {currentTurn === symbol
                    ? "Your turn"
                    : `${opponentNickname}'s turn`}
                </Typography>
                <Typography sx={{ opacity: 0.6 }}>
                  {currentTurn === symbol
                    ? "Place your piece!"
                    : "Wait for your opponent..."}
                </Typography>
              </Box>
            </Fade>
          )}
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            mb: 3,
            justifyContent: "center",
            alignItems: "center",
            width: 260,
            mx: "auto"
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(renderCell)}
        </Box>
        <Paper elevation={3} sx={{
          p: 2, mb: 2, borderRadius: 3, background: "rgba(255,255,255,0.05)", color: "#fff"
        }}>
          <Chat
            socket={socket}
            gameId={gameId}
            you={you}
            nicknames={nicknames}
            disabled={!!(winner || opponentLeft)}
          />
        </Paper>
      </Box>
    </Fade>
  );
};

export default Board;