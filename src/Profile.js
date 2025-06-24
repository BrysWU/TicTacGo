import React, { useState, useRef } from "react";
import { Modal, Box, Typography, Avatar, Button, CircularProgress, Stack, LinearProgress, TextField, IconButton } from "@mui/material";
import { useAuth } from "./AuthContext";
import UploadIcon from "@mui/icons-material/Upload";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export default function Profile({ onClose }) {
  const { user, uploadAvatar, loading, updateUsername } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const fileRef = useRef();
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState(user.username);
  const [nameMsg, setNameMsg] = useState("");
  const [nameLoading, setNameLoading] = useState(false);

  async function handleAvatar(e) {
    setUploading(true);
    setUploadMsg("");
    const file = e.target.files[0];
    if (!file) return;
    const { ok } = await uploadAvatar(file);
    setUploading(false);
    setUploadMsg(ok ? "Avatar updated!" : "Upload failed");
  }

  async function handleNameSave() {
    if (!nameInput.trim() || nameInput === user.username) {
      setEditName(false);
      setNameMsg("");
      return;
    }
    setNameLoading(true);
    const res = await updateUsername(nameInput.trim());
    setNameLoading(false);
    if (res.ok) {
      setEditName(false);
      setNameMsg("Username updated!");
    } else {
      setNameMsg(res.error);
    }
  }

  return (
    <Modal open onClose={onClose}>
      <Box sx={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        bgcolor: "#232f4b", p: 4, borderRadius: 4, minWidth: 330, boxShadow: 24
      }}>
        <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>Your Profile</Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Avatar
            src={user.avatar || undefined}
            sx={{ width: 70, height: 70, fontSize: 30, bgcolor: "#ffb300" }}
          >
            {!user.avatar && user.username[0]}
          </Avatar>
          <Box>
            {editName ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  size="small"
                  disabled={nameLoading}
                  sx={{
                    bgcolor: "#19213a",
                    input: { color: "#fff", fontWeight: 700 }
                  }}
                  InputProps={{
                    style: { color: "#fff", fontWeight: 700 }
                  }}
                />
                <IconButton color="success" onClick={handleNameSave} disabled={nameLoading}>
                  <CheckIcon />
                </IconButton>
                <IconButton color="error" onClick={() => { setEditName(false); setNameInput(user.username); }}>
                  <CloseIcon />
                </IconButton>
              </Stack>
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontWeight: 700, fontSize: 20 }}>{user.username}</Typography>
                <IconButton size="small" onClick={() => setEditName(true)} sx={{ color: "#ffb300" }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Stack>
            )}
            {nameMsg && <Typography sx={{ color: "#ffb300", fontSize: 13 }}>{nameMsg}</Typography>}
          </Box>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadIcon />}
            sx={{
              bgcolor: "#ffb300",
              color: "#002147",
              fontWeight: 700,
              "&:hover": { bgcolor: "#ffc947" }
            }}
            disabled={uploading}
          >
            Upload Avatar
            <input hidden accept="image/*" type="file" ref={fileRef} onChange={handleAvatar} />
          </Button>
          {uploading && <CircularProgress size={24} sx={{ color: "#ffb300" }} />}
          {uploadMsg && <Typography sx={{ color: "#ffb300", fontSize: 13 }}>{uploadMsg}</Typography>}
        </Stack>
        <Box sx={{ mt: 2 }}>
          <Button
            onClick={onClose}
            sx={{
              padding: 1.5,
              width: "100%",
              borderRadius: 6,
              background: "#ffb300",
              fontWeight: 700,
              fontSize: 16,
              border: 0,
              color: "#002147",
              "&:hover": { background: "#ffc947" }
            }}
          >
            Close
          </Button>
        </Box>
        {loading && <LinearProgress sx={{ mt: 2, bgcolor: "#19213a" }} />}
      </Box>
    </Modal>
  );
}
