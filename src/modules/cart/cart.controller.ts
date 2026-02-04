import Cart from "./cart.model";
import Product from "../product/product.model";
import { ApiError } from "../../utils/ApiError";

/**
 * Add to cart (guest or user)
 */
export const addToCart = async (req: any, res: any) => {
    const { productId, quantity, cartId } = req.body;

    if (!cartId) throw new ApiError(400, "cartId is required");

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
        throw new ApiError(404, "Product not found");
    }

    if (product.stock < quantity) {
        throw new ApiError(400, "Not enough stock");
    }

    let cart = await Cart.findOne({ cartId });

    if (!cart) {
        cart = await Cart.create({
            cartId,
            items: [{
                product: product._id,
                quantity,
                price: product.discountPrice || product.price,
            }]
        });
    } else {
        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({
                product: product._id,
                quantity,
                price: product.discountPrice || product.price,
            });
        }

        await cart.save();
    }

    res.json(cart);
};

/**
 * Get cart
 */
export const getCart = async (req: any, res: any) => {
    const { cartId } = req.query;

    if (!cartId) throw new ApiError(400, "cartId is required");

    const cart = await Cart.findOne({ cartId }).populate("items.product");

    if (!cart) return res.json({ items: [] });

    res.json(cart);
};

/**
 * Update quantity
 */
export const updateCartItem = async (req: any, res: any) => {
    const { cartId, productId, quantity } = req.body;

    const cart = await Cart.findOne({ cartId });
    if (!cart) throw new ApiError(404, "Cart not found");

    const item = cart.items.find(
        (item) => item.product.toString() === productId
    );

    if (!item) throw new ApiError(404, "Item not in cart");

    item.quantity = quantity;
    await cart.save();

    res.json(cart);
};

/**
 * Remove item
 */
export const removeFromCart = async (req: any, res: any) => {
    const { cartId, productId } = req.body;

    const cart = await Cart.findOne({ cartId });
    if (!cart) throw new ApiError(404, "Cart not found");

    cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.json(cart);
};

/**
 * Clear cart
 */
export const clearCart = async (req: any, res: any) => {
    const { cartId } = req.body;

    await Cart.findOneAndDelete({ cartId });

    res.json({ message: "Cart cleared" });
};
