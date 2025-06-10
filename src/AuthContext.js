import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://ttgback.onrender.com";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  async function login(username, password) {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/login`, { username, password });
      setUser(data.user);
      setToken(data.token);
      setLoading(false);
      return { ok: true };
    } catch (e) {
      setLoading(false);
      return { ok: false, error: e.response?.data?.error || "Login failed" };
    }
  }

  async function signup(username, password) {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/signup`, { username, password });
      setUser(data.user);
      setToken(data.token);
      setLoading(false);
      return { ok: true };
    } catch (e) {
      setLoading(false);
      return { ok: false, error: e.response?.data?.error || "Signup failed" };
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
  }

  async function refreshProfile() {
    if (!token) return;
    try {
      const { data } = await axios.get(`${API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(data);
    } catch (e) {
      logout();
    }
  }

  async function uploadAvatar(file) {
    if (!token) return { ok: false };
    const formData = new FormData();
    formData.append("avatar", file);
    const { data } = await axios.post(`${API_URL}/api/me/avatar`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await refreshProfile();
    return { ok: true, url: `${API_URL}${data.url}` };
  }

  return (
    <AuthContext.Provider value={{
      user, token, loading, login, signup, logout, refreshProfile, uploadAvatar
    }}>
      {children}
    </AuthContext.Provider>
  );
}