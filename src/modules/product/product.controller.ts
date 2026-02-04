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
        

        const product = await Product.create({
            ...req.body,
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

    const products = await query;
    res.json(products);
};

/**
 * CUSTOMER: Get product by ID
 */
export const getProductById = async (req: any, res: any) => {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
        throw new ApiError(404, "Product not found");
    }

    res.json(product);
};

/**
 * ADMIN: Update product
 */
export const updateProduct = async (req: any, res: any) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    if (!product) throw new ApiError(404, "Product not found");

    res.json(product);
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
