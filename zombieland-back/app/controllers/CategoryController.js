import Category from "../models/Category.js";

export const getAllCategories = async (req, res)=>{
    try {
        const categories = await Category.findAll();

        if(!categories.length){
            return res.status(404).json({message: 'Categories not found'});
        }
        res.status(200).json(categories);
    } catch (error) {
        console.error('Server error while fetching categories', error);
        res.status(500).json({message: 'Server error while fetching categories'});
        
    }
};

export const getOneCategory = async (req, res)=> {
    try {
        const categoryId = req.params.id;
        const category = await Category.findByPk(categoryId);
        if(!category){
            return res.status(404).json({message: 'Category not found'})
        }
        res.status(200).json(category);
    } catch (error) {
        console.error('Server error while fetching categories', error);
        res.status(500).json({message: 'Server error while fetching categories'});
    }
};

export const createCategory = async (req, res) =>{
    try {
        const {name} = req.body;
        if(!name){
            return res.status(400).json({message: "A category must have a name"})
        }
        const newCategory = await Category.create({name});
        if (!newCategory){
            return res.status(500).json({message: 'Something went wrong'})
        }

        res.status(201).json(newCategory)
    } catch (error) {
        console.error('Server error while creating category', error);
        res.status(500).json({message: 'Server error while creating category'});
    }
};

export const updateCategory = async(req, res) =>{
    try {
        const categoryId = req.params.id;
        const{name} = req.body;
        const category = await Category.findByPk(categoryId);
        if(!category){
            return res.status(404).json({message : 'Category not found'});
        }
        category.name = name;
        await category.save();
        res.status(204).json(category);
    } catch (error) {
        console.error('Server error while updating category', error);
        res.status(500).json({message: 'Server error while updating category'});
    }
};

export const deleteCategory = async (req, res) =>{
    try {
        const categoryId = req.params.id;
        const category = await Category.findByPk(categoryId);
        if(!category){
            return res.status(404).json({message: 'Category not found'});
        }

        await category.destroy();
        res.status(204).json({message: 'Category is destroyed'})
    } catch (error) {
        console.error('Server error while deleting category', error);
        res.status(500).json({message: 'Server error while deleting category'});
    }
}