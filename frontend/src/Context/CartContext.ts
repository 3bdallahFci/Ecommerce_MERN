import { createContext, useContext } from "react";
import type { CartItem } from "../types/cart";

interface CartContextType{
    CartItem: CartItem[];
    totalamount:number;
    addToCart: (productId: string) => void;
}

export const CartContext = createContext<CartContextType>({
    CartItem:[],
    totalamount:0,
    addToCart: () => {}
})


export const useCart = () => useContext(CartContext);