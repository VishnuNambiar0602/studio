
"use client";

import type { Part } from "@/lib/types";
import { createContext, useContext, useState, ReactNode, useMemo } from "react";

export interface CartItem extends Part {
  purchaseQuantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (part: Part, quantity: number) => void;
  removeFromCart: (partId: string) => void;
  updateCartItemQuantity: (partId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (part: Part, quantity: number) => {
    setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex(item => item.id === part.id);
        if (existingItemIndex > -1) {
            const newCart = [...prevCart];
            const newQuantity = newCart[existingItemIndex].purchaseQuantity + quantity;
            newCart[existingItemIndex].purchaseQuantity = Math.min(newQuantity, part.quantity); // Cap at available stock
            return newCart;
        } else {
            return [...prevCart, { ...part, purchaseQuantity: quantity }];
        }
    });
  };

  const removeFromCart = (partId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== partId));
  };

  const updateCartItemQuantity = (partId: string, quantity: number) => {
    setCart((prevCart) => {
        return prevCart.map(item => {
            if (item.id === partId) {
                // Ensure quantity is at least 1 and not more than available stock
                const newQuantity = Math.max(1, Math.min(quantity, item.quantity));
                return { ...item, purchaseQuantity: newQuantity };
            }
            return item;
        }).filter(item => item.purchaseQuantity > 0); // Remove if quantity becomes 0 or less
    });
  };
  
  const clearCart = () => {
    setCart([]);
  }

  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * item.purchaseQuantity), 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, total, clearCart, updateCartItemQuantity }}>
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
