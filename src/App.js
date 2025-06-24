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
  IconButton,
  Modal,
  Slide,
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
import CloseIcon from "@mui/icons-material/Close";

function BuyPointsPopup({ open, onClose, user }) {
  const [showShop, setShowShop] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const pointOptions = [
    { label: "Small Pack", points: 100, price: "$0.99" },
    { label: "Medium Pack", points: 500, price: "$3.99" },
    { label: "Large Pack", points: 2000, price: "$12.99" },
    { label: "Mega Pack", points: 10000, price: "$49.99" },
  ];

  if (!open) return null;

  if (redirect) {
    return (
      <Modal open={open} onClose={onClose}>
        <Box sx={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#232f4b", p: 5, borderRadius: 4,
          minWidth: 340, boxShadow: 24, color: "#fff", textAlign: "center"
        }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            You can't buy what doesn't exist
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ fontWeight: 700, mt: 2, borderRadius: 3, px: 5 }}
            onClick={onClose}
          >
            Close
          </Button>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Slide in={open} direction="down">
        <Box sx={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#232f4b", color: "#fff", borderRadius: 4,
          boxShadow: 24, minWidth: 340, px: 4, py: 4,
          minHeight: showShop ? 420 : 230,
          display: "flex", flexDirection: "column", alignItems: "center",
          transition: "min-height 0.3s",
        }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute", top: 12, right: 12,
              color: "#fff", bgcolor: "#233", "&:hover": { bgcolor: "#223" }
            }}
          >
            <CloseIcon />
          </IconButton>
          <MonetizationOnIcon sx={{ color: "#ffb300", fontSize: 50, mb: 0.5 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, mb: 1 }}>
            Your Points
          </Typography>
          <Typography sx={{
            fontSize: 36, fontWeight: 900, color: "#ffb300", mb: 2,
            textShadow: "0 2px 12px #000"
          }}>
            {typeof user?.points === "number" ? user.points : "—"}
          </Typography>
          {!showShop ? (
            <Button
              variant="contained"
              color="secondary"
              sx={{ fontWeight: 700, borderRadius: 3, px: 5, fontSize: 18, mt: 2 }}
              onClick={() => setShowShop(true)}
            >
              Buy Points
            </Button>
          ) : (
            <Box sx={{
              width: "100%",
              mt: 2,
              borderTop: "1px solid #333",
              pt: 2
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Shop Options
              </Typography>
              {pointOptions.map(opt => (
                <Box
                  key={opt.label}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: "rgba(255,255,255,0.06)",
                    px: 3, py: 2, borderRadius: 2, mb: 1.5,
                  }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 17 }}>{opt.label}</Typography>
                    <Typography sx={{ color: "#ffb300", fontWeight: 700 }}>
                      {opt.points} Points
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="warning"
                    sx={{ fontWeight: 900, borderRadius: 2, px: 4 }}
                    onClick={() => setRedirect(true)}
                  >
                    {opt.price}
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Slide>
    </Modal>
  );
}

function App() {
  const { user, logout } = useAuth();
  const [nickname, setNickname] = useState(() => localStorage.getItem("guestNickname") || "");
  const [gameState, setGameState] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [showPointsPopup, setShowPointsPopup] = useState(false);

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
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  bgcolor: "rgba(255,255,255,0.08)",
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  mr: 1,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.14)" }
                }}
                onClick={() => setShowPointsPopup(true)}
                tabIndex={0}
                aria-label="Show Points"
              >
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
      <BuyPointsPopup open={showPointsPopup} onClose={() => setShowPointsPopup(false)} user={user} />
    </Box>
  );
}

export default App;
