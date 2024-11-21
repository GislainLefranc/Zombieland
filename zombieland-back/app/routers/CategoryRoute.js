import express from 'express';
import { getAllCategories, getOneCategory, createCategory, updateCategory, deleteCategory } from '../controllers/CategoryController.js';


export const router = express.Router();

router.get('/', getAllCategories);

router.get('/:id', getOneCategory);

router.post('/', createCategory);

router.patch('/:id', updateCategory);

router.delete('/:id', deleteCategory);