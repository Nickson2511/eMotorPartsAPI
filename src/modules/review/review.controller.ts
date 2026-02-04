import Review from "./review.model";
import Product from "../product/product.model";
import { ApiError } from "../../utils/ApiError";

/**
 * Helper: recalculate product rating
 */
const updateProductRating = async (productId: string) => {
    const reviews = await Review.find({ product: productId });

    const numReviews = reviews.length;
    const rating =
        numReviews === 0
            ? 0
            : reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews;

    await Product.findByIdAndUpdate(productId, {
        numReviews,
        rating,
    });
};

/**
 * CREATE review
 */
export const createReview = async (req: any, res: any) => {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
        throw new ApiError(400, "All fields are required");
    }

    const existing = await Review.findOne({
        user: req.user.id,
        product: productId,
    });

    if (existing) {
        throw new ApiError(400, "You already reviewed this product");
    }

    const review = await Review.create({
        user: req.user.id,
        product: productId,
        rating,
        comment,
    });

    await updateProductRating(productId);

    res.status(201).json(review);
};

/**
 * GET reviews for a product
 */
export const getReviewsByProduct = async (req: any, res: any) => {
    const reviews = await Review.find({ product: req.params.productId })
        .populate("user", "name")
        .sort({ createdAt: -1 });

    res.json(reviews);
};

/**
 * UPDATE review
 */
export const updateReview = async (req: any, res: any) => {
    const review = await Review.findById(req.params.id);

    if (!review) throw new ApiError(404, "Review not found");

    if (review.user.toString() !== req.user.id) {
        throw new ApiError(403, "Not allowed");
    }

    review.rating = req.body.rating ?? review.rating;
    review.comment = req.body.comment ?? review.comment;
    await review.save();

    await updateProductRating(review.product.toString());

    res.json(review);
};

/**
 * DELETE review
 */
export const deleteReview = async (req: any, res: any) => {
    const review = await Review.findById(req.params.id);

    if (!review) throw new ApiError(404, "Review not found");

    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
        throw new ApiError(403, "Not allowed");
    }

    const productId = review.product.toString();
    await review.deleteOne();

    await updateProductRating(productId);

    res.json({ message: "Review deleted" });
};

/**
 * ADMIN: get all reviews
 */
export const getAllReviews = async (req: any, res: any) => {
    const reviews = await Review.find()
        .populate("user", "name email")
        .populate("product", "name");

    res.json(reviews);
};
