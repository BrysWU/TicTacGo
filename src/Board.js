import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Button, Paper, Avatar, Fade, Stack, Slide, Modal, IconButton } from "@mui/material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
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
  const [bettingOpen, setBettingOpen] = useState(gameState.bettingOpen ?? false);
  const [bets, setBets] = useState(gameState.bets ?? { X: 0, O: 0 });
  const [locked, setLocked] = useState({ X: false, O: false });
  const [myBet, setMyBet] = useState(0);
  const [betError, setBetError] = useState("");
  const [bettingClosed, setBettingClosed] = useState(false);
  const [bettingTimer, setBettingTimer] = useState(10);
  const [betEdit, setBetEdit] = useState(false);
  const betInputRef = useRef();

  useEffect(() => {
    const handleUpdate = ({ board, turn, winner, players, bets: newBets }) => {
      setBoard([...board]);
      setTurn(turn);
      setWinner(winner);
      setPlayers(players || {});
      if (newBets) {
        setBets(newBets);
        if (newBets.locked) setLocked(newBets.locked);
      }
      if (winner) setAnimateCell(Array(9).fill(false));
    };
    const handleBettingClosed = (b) => {
      setBettingOpen(false);
      setBettingClosed(true);
      setBets(b);
      if (b.locked) setLocked(b.locked);
    };
    const handleBetUpdate = (b) => {
      setBets(b);
      if (b.locked) setLocked(b.locked);
    };
    const handleBetError = (err) => setBetError(err);

    socket.on("gameUpdate", handleUpdate);
    socket.on("opponentLeft", () => setOpponentLeft(true));
    socket.on("bettingClosed", handleBettingClosed);
    socket.on("betUpdate", handleBetUpdate);
    socket.on("betError", handleBetError);

    return () => {
      socket.off("gameUpdate", handleUpdate);
      socket.off("opponentLeft");
      socket.off("bettingClosed", handleBettingClosed);
      socket.off("betUpdate", handleBetUpdate);
      socket.off("betError", handleBetError);
    };
  }, [socket]);

  // Betting timer
  useEffect(() => {
    if (bettingOpen) {
      setBettingClosed(false);
      setBetError("");
      setBets({ X: 0, O: 0, locked: { X: false, O: false } });
      setLocked({ X: false, O: false });
      setBettingTimer(10);
      setMyBet(0);
      const interval = setInterval(() => {
        setBettingTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [bettingOpen, gameId]);

  const canEditBet = bettingOpen && you.points > 0 && !locked[symbol];

  const handlePlaceBet = () => {
    const amt = parseInt(myBet, 10);
    if (isNaN(amt) || amt < 0) {
      setBetError("Invalid bet amount.");
      return;
    }
    if (amt > (you.points ?? 0)) {
      setBetError("Not enough points.");
      return;
    }
    socket.emit("placeBet", { gameId, amount: amt });
    setBetError("");
  };

  // For the bet input: allow up/down, and also allow clicking the number and typing
  const handleArrowUp = () => {
    if (!canEditBet) return;
    setMyBet((b) => Math.min((you.points ?? 0), Number(b) + 1));
  };
  const handleArrowDown = () => {
    if (!canEditBet) return;
    setMyBet((b) => Math.max(0, Number(b) - 1));
  };
  const handleBetNumberClick = () => {
    if (!canEditBet) return;
    setBetEdit(true);
    setTimeout(() => {
      if (betInputRef.current) betInputRef.current.focus();
    }, 50);
  };
  const handleBetInputBlur = () => {
    setBetEdit(false);
  };
  const handleBetInputChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val === "") val = "0";
    val = Math.max(0, Math.min(Number(val), you.points ?? 0));
    setMyBet(val);
  };

  const handleClick = (idx) => {
    if (winner || board[idx] || currentTurn !== symbol || bettingOpen) return;
    socket.emit("makeMove", { gameId, index: idx, symbol });
    const newAnim = Array(9).fill(false);
    newAnim[idx] = true;
    setAnimateCell(newAnim);
  };

  const renderCell = (idx) => (
    <Slide
      in={true}
      direction={animateCell[idx] ? "down" : "up"}
      key={idx}
    >
      <Paper
        elevation={3}
        sx={{
          width: 70,
          height: 70,
          fontSize: 40,
          fontWeight: 700,
          bgcolor: board[idx] ? (board[idx] === "X" ? "#ffd54f" : "#4dd0e1") : "#232f4b",
          color: board[idx] ? "#002147" : "#cfd8dc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          m: 0.5,
          cursor: !board[idx] && !winner && currentTurn === symbol && !bettingOpen ? "pointer" : "default",
          transition: "background 0.2s"
        }}
        onClick={() => handleClick(idx)}
      >
        {board[idx]}
      </Paper>
    </Slide>
  );

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
            <Typography sx={{ fontSize: 13, opacity: 0.7 }}>
              Points: {Xplayer.points ?? "N/A"}
            </Typography>
            {Xplayer.isGuest && <Typography sx={{ fontSize: 13, opacity: 0.7 }}>(Guest)</Typography>}
            {!Xplayer.isGuest && <Typography sx={{ fontSize: 13, opacity: 0.7 }}>(User)</Typography>}
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
            <Typography sx={{ fontSize: 13, opacity: 0.7 }}>
              Points: {Oplayer.points ?? "N/A"}
            </Typography>
            {Oplayer.isGuest && <Typography sx={{ fontSize: 13, opacity: 0.7 }}>(Guest)</Typography>}
            {!Oplayer.isGuest && <Typography sx={{ fontSize: 13, opacity: 0.7 }}>(User)</Typography>}
          </Box>
        </Stack>

        {/* BETTING DIALOG */}
        <Modal open={bettingOpen}>
          <Box sx={{
            bgcolor: "#232f4b", color: "white", p: 4, borderRadius: 3,
            boxShadow: 24, minWidth: 350, maxWidth: 400, mx: "auto", mt: "20vh", textAlign: "center"
          }}>
            <HourglassTopIcon sx={{ mb: 2, fontSize: 40 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Place your bet!</Typography>
            <Typography sx={{ mb: 2 }}>Betting Ends in {bettingTimer} seconds.<br /></Typography>
            <Typography sx={{ mb: 2 }}>Winner takes the pot. Each win gives +25 points bonus.<br />If only one player bets, all bets are cancelled.</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 1 }}>
              <IconButton aria-label="Up" onClick={handleArrowUp} disabled={!canEditBet} size="large">
                <ArrowDropUpIcon sx={{ fontSize: 40 }} />
              </IconButton>
              {betEdit ? (
                <input
                  ref={betInputRef}
                  style={{
                    fontSize: 36,
                    fontWeight: "bold",
                    color: "#fff",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    width: "90px",
                    textAlign: "center"
                  }}
                  type="text"
                  value={myBet}
                  onChange={handleBetInputChange}
                  onBlur={handleBetInputBlur}
                  maxLength={7}
                  disabled={!canEditBet}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              ) : (
                <Typography
                  sx={{
                    fontSize: 36,
                    fontWeight: "bold",
                    color: "#fff",
                    minWidth: 90,
                    cursor: canEditBet ? "pointer" : "default",
                    userSelect: "none",
                  }}
                  onClick={handleBetNumberClick}
                  tabIndex={canEditBet ? 0 : -1}
                  aria-label="Edit bet amount"
                >
                  {myBet}
                </Typography>
              )}
              <IconButton aria-label="Down" onClick={handleArrowDown} disabled={!canEditBet} size="large">
                <ArrowDropDownIcon sx={{ fontSize: 40 }} />
              </IconButton>
            </Box>
            <Box>
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePlaceBet}
                disabled={you.points <= 0 || locked[symbol]}
                sx={{ mt: 1, fontWeight: 700, fontSize: 18, borderRadius: 3 }}
              >
                {locked[symbol] ? "Locked" : "Bet"}
              </Button>
            </Box>
            {locked[symbol] && <Typography sx={{ color: "lime", mt: 2 }}>Bet locked in. Waiting for other player...</Typography>}
            {betError && <Typography sx={{ color: "red", mt: 1 }}>{betError}</Typography>}
            {you.points <= 0 && <Typography sx={{ color: "orange", mt: 2 }}>You have no points left. Play & win to earn more!</Typography>}
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontSize: 14 }}>Current bets:</Typography>
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 1 }}>
                <Typography>X: {bets.X ?? "—"}{locked.X ? " 🔒" : ""}</Typography>
                <Typography>O: {bets.O ?? "—"}{locked.O ? " 🔒" : ""}</Typography>
              </Stack>
            </Box>
          </Box>
        </Modal>

        {/* Game board */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3, mt: 2 }}>
          <Box>
            <Stack direction="row">
              {[0, 1, 2].map(renderCell)}
            </Stack>
            <Stack direction="row">
              {[3, 4, 5].map(renderCell)}
            </Stack>
            <Stack direction="row">
              {[6, 7, 8].map(renderCell)}
            </Stack>
          </Box>
        </Box>

        {/* Pot/Bets info */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, opacity: 0.8 }}>
            Pot: {(bets.X || 0) + (bets.O || 0)}
          </Typography>
          {bettingClosed && (
            <Typography sx={{ color: "#ffb300", fontWeight: 700, mt: 1 }}>
              {bets.X && bets.O
                ? "Bets locked in! Winner takes the pot + 25 bonus!"
                : (bets.X || bets.O)
                  ? "Only one player bet. All bets cancelled."
                  : "No bets placed."}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
          {opponentLeft ? (
            <Fade in>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Typography variant="h5" sx={{ color: "#ffb300", fontWeight: 900 }}>
                  Opponent left the game.
                </Typography>
                <Button variant="contained" color="secondary" sx={{ mt: 3, fontWeight: 700 }} onClick={onPlayAgain}>
                  Play Again
                </Button>
              </Box>
            </Fade>
          ) : winner ? (
            <Fade in>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                {winner === "draw" ? (
                  <>
                    <Typography variant="h5" sx={{ color: "#00e5ff", fontWeight: 900 }}>
                      It's a draw!
                    </Typography>
                    <Typography sx={{ mt: 2 }}>Your points: {you.points}</Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="h5" sx={{ color: winningColors[winner], fontWeight: 900 }}>
                      {players[symbol].username === players[winner].username ? "You win!" : "You lose!"}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>Your points: {players[symbol].points}</Typography>
                  </>
                )}
                <Button variant="contained" color="secondary" sx={{ mt: 3, fontWeight: 700 }} onClick={onPlayAgain}>
                  Play Again
                </Button>
              </Box>
            </Fade>
          ) : null}
        </Box>

        {/* Chat */}
        <Paper elevation={2} sx={{ p: 2, mt: 2, mb: 1, bgcolor: "#19213a" }}>
          <Chat
            socket={socket}
            gameId={gameId}
            you={you}
            opponent={opponent}
            disabled={!!winner}
          />
        </Paper>
      </Box>
    </Fade>
  );
};

export default Board;
