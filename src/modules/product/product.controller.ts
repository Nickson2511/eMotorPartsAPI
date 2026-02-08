import Product from "./product.model";
import cloudinary from "../../config/cloudinary";
import { ApiError } from "../../utils/ApiError";

/**
 * ADMIN: Create product
 */
export const createProduct = async (req: any, res: any) => {
    try {
        const imageUrls: string[] = [];
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No images uploaded" });
        }

        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path);
            imageUrls.push(result.secure_url);
        }

        const {
            price,
            oldPrice,
            ...rest
        } = req.body;

        // extra guard (optional but good)
        if (oldPrice && Number(oldPrice) <= Number(price)) {
            return res.status(400).json({
                message: "Old price must be greater than price",
            });
        }

        const product = await Product.create({
            ...rest,
            price: Number(price),
            oldPrice: oldPrice ? Number(oldPrice) : undefined,
            images: imageUrls,
            createdBy: req.user.id,
        });

        res.status(201).json(product);
    } catch (error: any) {
        console.error("CREATE PRODUCT ERROR:", error);
        res.status(500).json({
            message: "Product creation failed",
            error: error.message || error,
        });
    }
};

/**
 * CUSTOMER: Get all active products (search, filter, sort)
 */
export const getProducts = async (req: any, res: any) => {
    const {
        search,
        category,
        brand,
        minPrice,
        maxPrice,
        sortBy,
    } = req.query;

    const filter: any = { isActive: true };

    if (search) {
        filter.name = { $regex: search, $options: "i" };
    }

    if (category) filter.category = category;
    if (brand) filter.brand = brand;

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let query = Product.find(filter);

    if (sortBy) {
        const sortMap: any = {
            price_asc: { price: 1 },
            price_desc: { price: -1 },
            newest: { createdAt: -1 },
        };
        query = query.sort(sortMap[sortBy]);
    }

    //const products = await query;
    const products = await query.populate("category", "name").populate("subCategory", "name");
    res.json(products);
};




/**
 * CUSTOMER: Get product by ID
 */
export const getProductById = async (req: any, res: any) => {
    //const product = await Product.findById(req.params.id);
    const product = await Product.findById(req.params.id)
        .populate("category", "name")
        .populate("subCategory", "name");

    if (!product || !product.isActive) {
        throw new ApiError(404, "Product not found");
    }

    res.json(product);
};

/**
 * ADMIN: Update product
 */

/**
 * ADMIN: Update product (PATCH)
 */

export const updateProduct = async (req: any, res: any) => {
    try {
        const productId = req.params.id;
        const files = req.files as Express.Multer.File[];
        const updates: any = { ...req.body }; // Only fields sent

        // Remove category/subCategory from updates to prevent BSON errors
        delete updates.category;
        delete updates.subCategory;

        // Convert numeric fields safely
        if (updates.price !== undefined) updates.price = Number(updates.price);
        if (updates.oldPrice !== undefined) updates.oldPrice = Number(updates.oldPrice);
        if (updates.stock !== undefined) updates.stock = Number(updates.stock);

        // Validate oldPrice > price
        if (
            updates.price !== undefined &&
            updates.oldPrice !== undefined &&
            updates.oldPrice <= updates.price
        ) {
            return res.status(400).json({
                message: "Old price must be greater than price",
            });
        }

        // Handle images if any
        if (files && files.length > 0) {
            const imageUrls: string[] = [];
            for (const file of files) {
                const result = await cloudinary.uploader.upload(file.path);
                imageUrls.push(result.secure_url);
            }
            updates.images = imageUrls;
        }

        
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $set: updates },
            { new: true, runValidators: true }
        )
            .populate("category", "name")
            .populate("subCategory", "name");

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(updatedProduct);
    } catch (error: any) {
        console.error("UPDATE PRODUCT ERROR:", error);
        res.status(500).json({
            message: "Failed to update product",
            error: error.message || error,
        });
    }
};




/**
 * ADMIN: Delete product
 */
export const deleteProduct = async (req: any, res: any) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) throw new ApiError(404, "Product not found");

    res.json({ message: "Product deleted successfully" });
};

/**
 * ADMIN: Get all products (even inactive)
 */
export const getAllProductsAdmin = async (req: any, res: any) => {
    const products = await Product.find();
    res.json(products);
};
