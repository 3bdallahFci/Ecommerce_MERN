import orderModel, {type IorderItem } from "../models/orderModel.js";
import { getActiveCartForUser } from "./cartServices.js";
import { productModel } from "../models/productModels.js";

interface checkout {
  userId: string;
  address: string;
}

export const checkout = async ({ userId, address }: checkout) => {
  try {
    const cart = await getActiveCartForUser({ userId });
    if (!cart) return { data: "Cart not found", statusCode: 500 };
    const orderItems: IorderItem[] = [];
    for (const item of cart.items) {
      const product = await productModel.findById(item.product);
      if (!product) {
        return {
          data: "Product not found to complete checkout",
          statusCode: 400,
        };
      }
      const orderItem: IorderItem = {
        productTitle: product?.title,
        productImage: product?.image,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      };
      orderItems.push(orderItem);
    }
    const order = await orderModel.create({
      orderItems,
      total: cart.totalAmount,
      address,
      userId,
    });
    await order.save();
    cart.status = "completed";
    await cart.save();
    return { data: order, statusCode: 200 };
  } catch (error) {
    return { data: "Checkout failed", statusCode: 500 };
  }
};
