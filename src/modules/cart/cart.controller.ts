import Cart from "./cart.model";
import Product from "../product/product.model";
import { ApiError } from "../../utils/ApiError";

/**
 * Helper: always return populated cart
 */
const populateCart = async (cart: any) => {
    await cart.populate("items.product");
    return cart;
};

/**
 * Add to cart
 */
export const addToCart = async (req: any, res: any) => {
    const { productId, quantity, cartId } = req.body;

    if (!cartId) throw new ApiError(400, "cartId is required");
    if (!productId || quantity < 1)
        throw new ApiError(400, "Invalid payload");

    const product = await Product.findById(productId);
    if (!product || !product.isActive)
        throw new ApiError(404, "Product not found");

    if (product.stock < quantity)
        throw new ApiError(400, "Not enough stock");

    let cart = await Cart.findOne({ cartId });

    if (!cart) {
        cart = await Cart.create({
            cartId,
            items: [{
                product: product._id,
                quantity,
                price: product.price,
            }]
        });
    } else {
        const item = cart.items.find(
            (i) => i.product.toString() === productId
        );

        if (item) {
            if (item.quantity + quantity > product.stock)
                throw new ApiError(400, "Stock exceeded");

            item.quantity += quantity;
        } else {
            cart.items.push({
                product: product._id,
                quantity,
                price: product.price,
            });
        }

        await cart.save();
    }

    await populateCart(cart);
    res.json(cart);
};

/**
 * Get cart
 */
export const getCart = async (req: any, res: any) => {
    const { cartId } = req.query;
    if (!cartId) throw new ApiError(400, "cartId is required");

    const cart = await Cart.findOne({ cartId }).populate("items.product");

    if (!cart) {
        return res.json({
            cartId,
            items: [],
            totalAmount: 0,
        });
    }

    res.json(cart);
};

/**
 * Update quantity
 */
export const updateCartItem = async (req: any, res: any) => {
    const { cartId, productId, quantity } = req.body;

    if (!cartId || !productId)
        throw new ApiError(400, "Invalid payload");

    const cart = await Cart.findOne({ cartId });
    if (!cart) throw new ApiError(404, "Cart not found");

    const item = cart.items.find(
        (i) => i.product.toString() === productId
    );

    if (!item) throw new ApiError(404, "Item not found");

    if (quantity <= 0) {
        cart.items = cart.items.filter(
            (i) => i.product.toString() !== productId
        );
    } else {
        const product = await Product.findById(productId);
        if (!product) throw new ApiError(404, "Product not found");

        if (quantity > product.stock)
            throw new ApiError(400, "Stock exceeded");

        item.quantity = quantity;
    }

    await cart.save();
    await populateCart(cart);

    res.json(cart);
};

/**
 * Remove item
 */
export const removeFromCart = async (req: any, res: any) => {
    const { cartId, productId } = req.body;

    if (!cartId || !productId)
        throw new ApiError(400, "Invalid payload");

    const cart = await Cart.findOne({ cartId });
    if (!cart) throw new ApiError(404, "Cart not found");

    cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
    );

    await cart.save();
    await populateCart(cart);

    res.json(cart);
};

/**
 * Clear cart
 */
export const clearCart = async (req: any, res: any) => {
    const { cartId } = req.body;
    if (!cartId) throw new ApiError(400, "cartId required");

    await Cart.findOneAndDelete({ cartId });

    res.json({
        cartId,
        items: [],
        totalAmount: 0,
    });
};
