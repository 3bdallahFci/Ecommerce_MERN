import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import type { CartItem } from "../types/cart";
import { CartContext } from "./CartContext";
import { BASE_URL } from "../constants/BaseUrl";
import { useAuth } from "./AuthContext";

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const { token } = useAuth();
  const [CartItem, setCartItem] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [error, setError] = useState<any>();

  useEffect(() => {
    if (!token) return;
    const fetchdata = async () => {
      try {
        const response = await fetch(`${BASE_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setError(error || "Failed to fetch cart , please try again!");
        }
        const cart = await response.json();

        const CartItemsMapped = cart.items.map(
          ({
            product,
            quantity,
            unitPrice,
          }: {
            product: any;
            quantity: number;
            unitPrice: number;
          }) => ({
            productId: product._id,
            title: product.title,
            image: product.image,
            quantity,
            unitPrice,
          })
        );
        console.log(CartItemsMapped);

        setCartItem(CartItemsMapped);
        setTotalAmount(cart.totalAmount);
      } catch (error) {
        setError(error || "Failed to fetch cart , please try again!");
      }
    };

    fetchdata();
  }, [token]);
  const addToCart = async (productId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/item`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        setError("failed to add to cart , please try again!");
      }
      const cart = await response.json();
      if (!cart) {
        setError("failed to parse cart data");
      }

      const CartItemsMapped = cart.items.map(
        ({
          product,
          quantity,
          unitPrice,
        }: {
          product: any;
          quantity: number;
          unitPrice: number;
        }) => ({
          productId: product._id,
          title: product.title,
          image: product.image,
          quantity,
          unitPrice,
        })
      );
      setCartItem([...CartItemsMapped]);
      setTotalAmount(cart.totalAmount);
    } catch (error) {
      setError(error);
    }
  };

  const updateIteminCart = async (productId: string, quantity: number) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/item`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      if (!response.ok) {
        setError("failed to update Item in cart , please try again!");
      }
      const cart = await response.json();
      if (!cart) {
        setError("failed to parse cart data");
      }

      const CartItemsMapped = cart.items.map(
        ({
          product,
          quantity,
          unitPrice,
        }: {
          product: any;
          quantity: number;
          unitPrice: number;
        }) => ({
          productId: product._id,
          title: product.title,
          image: product.image,
          quantity,
          unitPrice,
        })
      );
      setCartItem([...CartItemsMapped]);
      setTotalAmount(cart.totalAmount);
    } catch (error) {
      setError(error);
    }
  };
  const RemoveIteminCart = async (productId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/item/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      });

      if (!response.ok) {
        setError("failed to Remove item , please try again!");
      }
      const cart = await response.json();
      if (!cart) {
        setError("failed to parse cart data");
      }

      const CartItemsMapped = cart.items.map(
        ({
          product,
          quantity,
          unitPrice,
        }: {
          product: any;
          quantity: number;
          unitPrice: number;
        }) => ({
          productId: product._id,
          title: product.title,
          image: product.image,
          quantity,
          unitPrice,
        })
      );
      setCartItem([...CartItemsMapped]);
      setTotalAmount(cart.totalAmount);
    } catch (error) {
      setError(error);
    }
  };
  return (
    <CartContext.Provider
      value={{ CartItem, totalAmount, addToCart, updateIteminCart,RemoveIteminCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
