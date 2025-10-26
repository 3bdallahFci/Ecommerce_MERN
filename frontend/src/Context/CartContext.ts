import { createContext, useContext } from "react";
import type { CartItem } from "../types/cart";

interface CartContextType{
    CartItem: CartItem[];
    totalAmount:number;
    addToCart: (productId: string) => void;
}

export const CartContext = createContext<CartContextType>({
    CartItem:[],
    totalAmount:0,
    addToCart: () => {}
})


export const useCart = () => useContext(CartContext);