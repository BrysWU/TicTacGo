import React, { useState, useRef } from "react";
import { Modal, Box, Typography, Avatar, Button, CircularProgress, Stack, LinearProgress } from "@mui/material";
import { useAuth } from "./AuthContext";
import UploadIcon from "@mui/icons-material/Upload";

export default function Profile({ onClose }) {
  const { user, uploadAvatar, loading } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const fileRef = useRef();

  async function handleAvatar(e) {
    setUploading(true);
    setUploadMsg("");
    const file = e.target.files[0];
    if (!file) return;
    const { ok } = await uploadAvatar(file);
    setUploading(false);
    setUploadMsg(ok ? "Avatar updated!" : "Upload failed");
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
            src={user.avatar ? `https://ttgback.onrender.com${user.avatar}` : undefined}
            sx={{ width: 70, height: 70, fontSize: 30, bgcolor: "#ffb300" }}
          >
            {!user.avatar && user.username[0]}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 700 }}>{user.username}</Typography>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<UploadIcon />}
              onClick={() => fileRef.current.click()}
              disabled={uploading}
              sx={{ mt: 1 }}
            >Change Avatar</Button>
            <input ref={fileRef} type="file" hidden accept="image/*" onChange={handleAvatar} />
          </Box>
        </Stack>
        {uploading && <LinearProgress sx={{ mb: 2 }} />}
        {uploadMsg && <Typography color="success.main" sx={{ mb: 2 }}>{uploadMsg}</Typography>}
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2 }}>Stats</Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 1, mb: 2 }}>
          <Box><b>Wins:</b> {user.wins}</Box>
          <Box><b>Losses:</b> {user.losses}</Box>
          <Box><b>Draws:</b> {user.draws}</Box>
        </Stack>
        <Button variant="contained" color="secondary" fullWidth onClick={onClose}>Close</Button>
      </Box>
    </Modal>
  );
}