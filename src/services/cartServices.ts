import { cartModel,type Icart } from "../models/cartModel.js";

interface createCartForUser {
  userId: string;
}

export const createCartForUser = async ({ userId }: createCartForUser) => {
  const cart = await cartModel.create({ userId });
  await cart.save();
  return cart;
};

interface getActiveCartForUser {
  userId: string;
}

export const getActiveCartForUser = async ({
  userId,
}: getActiveCartForUser) => {
  let cart = await cartModel.findOne({
    userId,
    status: "active",
  });
  if (!cart) {
    cart = await createCartForUser({ userId });
  }
  return cart;
};

interface addItemtoCart {
  userId: string;
  productId: string;
  quantity: number;
}

import { productModel } from "../models/productModels.js";

export const addItemtoCart = async ({
  userId,
  productId,
  quantity,
}: addItemtoCart) => {
  try {
    const cart = await getActiveCartForUser({ userId });
    if (!cart) return { data: "Cart not found", statusCode: 500 };
    const existInCart = cart.items.find(
      (p) => p.product.toString() === productId
    );
    if (existInCart) {
      return { data: "Item already exists in cart", statusCode: 400 };
    }
    const product = await productModel.findById(productId);
    if (!product) {
      return { data: "product Not Found", statusCode: 400 };
    }
    if (Number(product.stock) < quantity) {
      return { data: "Product is Out Of Stock", statusCode: 400 };
    }
    cart.items.push({
      product: product,
      unitPrice: Number(product.price),
      quantity,
    });
    cart.totalAmount = Number(cart.totalAmount) + Number(product.price) * quantity;
    const updatedCart = await cart.save();
    return { data: updatedCart, statusCode: 201 };
  } catch (error) {
    return { data: "Failed to add item to cart", statusCode: 500 };
  }
};

interface updateItemsInCart {
  userId: string;
  quantity: number;
  productId: any;
}

export const updateItemsInCart = async ({
  productId,
  quantity,
  userId,
}: updateItemsInCart) => {
  try {
    const cart = await getActiveCartForUser({ userId });
    if (!cart) return { data: "Cart not found", statusCode: 500 };
    const existInCart = cart.items.find(
      (p) => p.product.toString() === productId
    );
    if (!existInCart) {
      return { data: "product Not Found in the cart", statusCode: 400 };
    }
    const product = await productModel.findById(productId);
    if (!product) {
      return { data: "product Not Found", statusCode: 400 };
    }
    if (Number(product.stock) < quantity) {
      return { data: "Product is Out Of Stock", statusCode: 400 };
    }
    existInCart.quantity = quantity;
    cart.totalAmount = cart.items.reduce(
      (sum, i) => sum + i.unitPrice * i.quantity,
      0
    );
    const updatedCart = await cart.save();
    return { data: updatedCart, statusCode: 201 };
  } catch (error) {
    return { data: "Failed to update cart", statusCode: 500 };
  }
};

interface deleteItemFromCart {
  userId: string;
  productId: any;
}

export const deleteItemFromCart = async ({
  userId,
  productId,
}: deleteItemFromCart) => {
  try {
    const cart = await getActiveCartForUser({ userId });
    if (!cart) return { data: "Cart not found", statusCode: 500 };
    const existInCart = cart.items.find(
      (p) => p.product.toString() === productId
    );
    if (!existInCart) {
      return { data: "product Not Found in the cart", statusCode: 400 };
    }
    cart.items = cart.items.filter((p) => p.product.toString() !== productId);
    cart.totalAmount = cart.items.reduce(
      (sum, i) => sum + i.unitPrice * i.quantity,
      0
    );
    await cart.save();
    return { data: cart, statusCode: 200 };
  } catch (error) {
    return { data: "Failed to delete item from cart", statusCode: 500 };
  }
};

interface clearCart {
  userId: string;
}

export const clearCart = async ({ userId }: clearCart) => {
  try {
    const cart = await getActiveCartForUser({ userId });
    if (!cart) return { data: "Cart not found", statusCode: 500 };
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    return { data: cart, statusCode: 200 };
  } catch (error) {
    return { data: "Failed to clear cart", statusCode: 500 };
  }
};
