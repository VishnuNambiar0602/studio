"use client";

import type { Part } from "@/lib/types";
import { createContext, useContext, useState, ReactNode, useMemo } from "react";

interface CartContextType {
  cart: Part[];
  addToCart: (part: Part) => void;
  removeFromCart: (partId: string) => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Part[]>([]);

  const addToCart = (part: Part) => {
    setCart((prevCart) => {
        // Check if item already exists
        const existingItem = prevCart.find(item => item.id === part.id);
        if (existingItem) {
            // For simplicity, we don't handle quantity. We just won't add it again.
            return prevCart;
        }
        return [...prevCart, part];
    });
  };

  const removeFromCart = (partId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== partId));
  };
  
  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price, 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
