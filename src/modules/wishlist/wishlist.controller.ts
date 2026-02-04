import Wishlist from "./wishlist.model";
import Product from "../product/product.model";
import { ApiError } from "../../utils/ApiError";

/**
 * Get my wishlist
 */
export const getMyWishlist = async (req: any, res: any) => {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate("products");

    if (!wishlist) {
        wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    res.json(wishlist);
};

/**
 * Add product to wishlist
 */
export const addToWishlist = async (req: any, res: any) => {
    const { productId } = req.body;

    if (!productId) throw new ApiError(400, "productId is required");

    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
        wishlist = await Wishlist.create({
            user: req.user.id,
            products: [productId],
        });
    } else {
        if (wishlist.products.includes(productId)) {
            throw new ApiError(400, "Product already in wishlist");
        }
        wishlist.products.push(productId);
        await wishlist.save();
    }

    res.status(201).json(wishlist);
};

/**
 * Remove product from wishlist
 */
export const removeFromWishlist = async (req: any, res: any) => {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) throw new ApiError(404, "Wishlist not found");

    wishlist.products = wishlist.products.filter(
        (p) => p.toString() !== productId
    );

    await wishlist.save();

    res.json(wishlist);
};

/**
 * Clear wishlist
 */
export const clearWishlist = async (req: any, res: any) => {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) throw new ApiError(404, "Wishlist not found");

    wishlist.products = [];
    await wishlist.save();

    res.json({ message: "Wishlist cleared" });
};
