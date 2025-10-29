import { createContext, useContext } from "react";
import type { CartItem } from "../types/cart";

interface CartContextType {
  CartItem: CartItem[];
  totalAmount: number;
  addToCart: (productId: string) => void;
  updateIteminCart: (productId: string, quantity: number) => void;
  RemoveIteminCart: (productId: string) => void;
  clearCart:() => void;
}

export const CartContext = createContext<CartContextType>({
  CartItem: [],
  totalAmount: 0,
  addToCart: () => {},
  updateIteminCart: () => {},
  RemoveIteminCart: () => {},
  clearCart: () => {}
});

export const useCart = () => useContext(CartContext);
