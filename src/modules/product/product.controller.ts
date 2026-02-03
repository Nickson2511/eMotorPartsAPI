import Product from "./product.model";
import cloudinary from "../../config/cloudinary";

export const createProduct = async (req: any, res: any) => {
    try {
        const imageUrls: string[] = [];

        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path);
            imageUrls.push(result.secure_url);
        }

        const product = await Product.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            discountPrice: req.body.discountPrice,
            stock: req.body.stock,
            category: req.body.category,
            brand: req.body.brand,
            condition: req.body.condition,
            sku: req.body.sku,
            images: imageUrls,
            createdBy: req.user.id, // ADMIN ID
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: "Product creation failed", error });
    }
};

export const getProducts = async (req: any, res: any) => {
    const products = await Product.find();
    res.json(products);
};
