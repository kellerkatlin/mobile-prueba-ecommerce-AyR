// stores/useCartStore.ts
import {
  addToCart,
  checkoutCart,
  clearCart,
  getCartItems,
  removeCartItem,
  updateCartItem,
} from "@/api/orderService";
import { create } from "zustand";

type CartItem = {
  producto_id: number;
  cantidad: number;
  producto: {
    id: number;
    descripcion: string;
    precioVenta: number;
    fotoUrl?: string;
  };
};

type CartStore = {
  items: CartItem[];
  loading: boolean;
  error: string | null;

  loadCart: () => Promise<void>;
  addProduct: (productoId: number, cantidad: number) => Promise<void>;
  updateQuantity: (productoId: number, cantidad: number) => Promise<void>;
  removeProduct: (productoId: number) => Promise<void>;
  clear: () => Promise<void>;
  checkout: () => Promise<void>;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  loadCart: async () => {
    try {
      set({ loading: true, error: null });
      const items = await getCartItems();
      set({ items, loading: false });
    } catch (err) {
      set({ error: "Error al cargar el carrito", loading: false });
    }
  },

  addProduct: async (productoId, cantidad) => {
    try {
      await addToCart(productoId, cantidad);
      await get().loadCart();
      console.log("Producto agregado al carrito");
    } catch {
      set({ error: "Error al agregar producto" });
    }
  },

  updateQuantity: async (productoId, cantidad) => {
    try {
      await updateCartItem(productoId, cantidad);
      await get().loadCart();
    } catch {
      set({ error: "Error al actualizar cantidad" });
    }
  },

  removeProduct: async (productoId) => {
    try {
      await removeCartItem(productoId);
      await get().loadCart();
    } catch {
      set({ error: "Error al eliminar producto" });
    }
  },

  clear: async () => {
    try {
      await clearCart();
      set({ items: [] });
    } catch {
      set({ error: "Error al vaciar carrito" });
    }
  },

  checkout: async () => {
    try {
      await checkoutCart();
      set({ items: [] });
    } catch {
      set({ error: "Error al finalizar el pedido" });
    }
  },
}));
