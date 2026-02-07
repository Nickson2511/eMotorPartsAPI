import SubCategory from "./subcategory.model";

/**
 * ADMIN: Create subcategory
 */
export const createSubCategory = async (req: any, res: any) => {
    const subCategory = await SubCategory.create(req.body);
    res.status(201).json(subCategory);
};

/**
 * PUBLIC: Get subcategories by category
 */
export const getSubCategoriesByCategory = async (req: any, res: any) => {
    const { categoryId } = req.params;

    const subcategories = await SubCategory.find({
        category: categoryId,
        isActive: true,
    });

    res.json(subcategories);
};
