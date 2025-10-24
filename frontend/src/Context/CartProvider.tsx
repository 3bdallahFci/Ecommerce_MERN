import { useState, type FC, type PropsWithChildren } from "react";
import type { CartItem } from "../types/cart";
import { CartContext } from "./CartContext";

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [CartItem, setCartItem] = useState<CartItem[]>([]);
  const [totalamount, setTotalamount] = useState<number>(0);

  const addToCart = (productId: string) => {
    console.log(productId);
  };
  return (
    <CartContext.Provider value={{ CartItem, totalamount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
