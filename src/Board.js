import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, Avatar, Fade, Stack, Slide } from "@mui/material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import Chat from "./Chat";

const winningColors = {
  X: "#ffb300",
  O: "#00e5ff"
};

const Board = ({ gameState, setGameState, onPlayAgain }) => {
  const { socket, symbol, board: initialBoard, turn, gameId, you, opponent } = gameState;
  const [board, setBoard] = useState(initialBoard);
  const [currentTurn, setTurn] = useState(turn);
  const [winner, setWinner] = useState(null);
  const [players, setPlayers] = useState({ X: symbol === "X" ? you : opponent, O: symbol === "O" ? you : opponent });
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [animateCell, setAnimateCell] = useState(Array(9).fill(false));

  useEffect(() => {
    const handleUpdate = ({ board, turn, winner, players }) => {
      setBoard([...board]);
      setTurn(turn);
      setWinner(winner);
      setPlayers(players || {});
      if (winner) setAnimateCell(Array(9).fill(false));
    };
    socket.on("gameUpdate", handleUpdate);
    socket.on("opponentLeft", () => setOpponentLeft(true));

    return () => {
      socket.off("gameUpdate", handleUpdate);
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

  const handlePlayAgainClick = () => {
    if (typeof onPlayAgain === "function") onPlayAgain();
  };

  const Xplayer = players.X || you;
  const Oplayer = players.O || opponent;

  return (
    <Fade in timeout={600}>
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={4} sx={{ mb: 3 }}>
          <Box sx={{ textAlign: "center" }}>
            <Avatar
              src={Xplayer.avatar ? `https://ttgback.onrender.com${Xplayer.avatar}` : undefined}
              sx={{ bgcolor: "#232f4b", mx: "auto", mb: 1, fontWeight: 700, width: 48, height: 48, fontSize: 26 }}
            >{!Xplayer.avatar && Xplayer.username[0]}</Avatar>
            <Typography sx={{ fontWeight: 700 }}>
              {Xplayer.username} <span style={{ color: "#ffb300" }}>[X]</span>
            </Typography>
            {symbol === "X" && <Typography sx={{ fontSize: 13, opacity: 0.7 }}>(You)</Typography>}
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 900, opacity: 0.5, mt: 2 }}>VS</Typography>
          <Box sx={{ textAlign: "center" }}>
            <Avatar
              src={Oplayer.avatar ? `https://ttgback.onrender.com${Oplayer.avatar}` : undefined}
              sx={{ bgcolor: "#232f4b", mx: "auto", mb: 1, fontWeight: 700, width: 48, height: 48, fontSize: 26 }}
            >{!Oplayer.avatar && Oplayer.username[0]}</Avatar>
            <Typography sx={{ fontWeight: 700 }}>
              {Oplayer.username} <span style={{ color: "#00e5ff" }}>[O]</span>
            </Typography>
            {symbol === "O" && <Typography sx={{ fontSize: 13, opacity: 0.7 }}>(You)</Typography>}
          </Box>
        </Stack>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
          {opponentLeft ? (
            <Fade in>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Typography variant="h5" sx={{ color: "#ffb300", fontWeight: 900 }}>
                  Opponent left the game.
                </Typography>
                <Button variant="contained" color="secondary" sx={{ mt: 3, fontWeight: 700 }} onClick={handlePlayAgainClick}>
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
                    <EmojiEventsIcon sx={{ fontSize: 60, color: winningColors[symbol === "X" ? "O" : "X"] }} />
                    <Typography variant="h5" sx={{ fontWeight: 900, mt: 1 }}>
                      You lose! Winner: <span style={{ color: winningColors[symbol === "X" ? "O" : "X"] }}>{(symbol === "X" ? Oplayer.username : Xplayer.username)}</span>
                    </Typography>
                  </>
                )}
                <Button variant="contained" color="secondary" sx={{ mt: 3, fontWeight: 700 }} onClick={handlePlayAgainClick}>
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
                    : `${(currentTurn === "X" ? Xplayer.username : Oplayer.username)}'s turn`}
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
            opponent={opponent}
            disabled={!!(winner || opponentLeft)}
          />
        </Paper>
      </Box>
    </Fade>
  );
};

export default Board;