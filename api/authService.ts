// lib/auth.ts
import api from "@/lib/api";
import { LoginRequest, RegisterRequest } from "@/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async (credentials: LoginRequest) => {
  const res = await api.post("/auth/login-client", credentials);
  await AsyncStorage.setItem("token", res.data.access_token);
  return res.data;
};

export const register = async (credentials: RegisterRequest) => {
  const res = await api.post("/auth/register-client", credentials);
  await AsyncStorage.setItem("token", res.data.access_token);
  return res.data;
};

export const logout = async () => {
  await AsyncStorage.removeItem("token");
};

export const getProfile = async () => {
  const res = await api.get("/auth/me-client");
  return res.data;
};
