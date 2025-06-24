import React, { useState, useRef } from "react";
import { Modal, Box, Typography, Avatar, Button, Stack, TextField, IconButton } from "@mui/material";
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
                <IconButton color="primary" size="small" onClick={() => setEditName(true)} sx={{ ml: -0.5 }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Stack>
            )}
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<UploadIcon />}
              onClick={() => fileRef.current.click()}
              disabled={uploading}
              sx={{ mt: 1 }}
            >Change Avatar</Button>
            <input type="file" ref={fileRef} accept="image/*" style={{ display: "none" }} onChange={handleAvatar} />
            {uploadMsg && <Typography sx={{ color: "success.main", mt: 1 }}>{uploadMsg}</Typography>}
          </Box>
        </Stack>
        {nameMsg && <Typography sx={{ color: nameMsg.includes("updated") ? "success.main" : "error.main", mb: 1 }}>{nameMsg}</Typography>}
        <Button onClick={onClose} sx={{ mt: 2, width: "100%" }} variant="contained" color="primary">Close</Button>
      </Box>
    </Modal>
  );
}
