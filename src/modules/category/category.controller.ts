import Category from "./category.model";

/**
 * ADMIN: Create category
 */
export const createCategory = async (req: any, res: any) => {
    const category = await Category.create(req.body);
    res.status(201).json(category);
};

/**
 * PUBLIC: Get all categories
 */
export const getCategories = async (_req: any, res: any) => {
    const categories = await Category.find({ isActive: true });
    res.json(categories);
};
