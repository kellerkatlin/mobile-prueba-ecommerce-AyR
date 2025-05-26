// lib/cart.ts
import api from "@/lib/api";

export const getCart = async () => {
  const res = await api.get("/cart");
  return res.data;
};

export const getCartItems = async () => {
  const res = await api.get("/cart/items");
  return res.data;
};

export const addToCart = async (productoId: number, cantidad: number) => {
  const res = await api.post("/cart/items", { productoId, cantidad });
  return res.data;
};

export const updateCartItem = async (productoId: number, cantidad: number) => {
  const res = await api.put(`/cart/items/${productoId}`, { cantidad });
  return res.data;
};

export const removeCartItem = async (productoId: number) => {
  const res = await api.delete(`/cart/items/${productoId}`);
  return res.data;
};

export const clearCart = async () => {
  const res = await api.delete("/cart/clear");
  return res.data;
};

export const checkoutCart = async () => {
  const res = await api.post("/cart/checkout");
  return res.data;
};
