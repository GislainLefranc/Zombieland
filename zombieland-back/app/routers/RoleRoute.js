import express from 'express';
import { getAllRoles, getRole, createRole, updateRole, deleteRole } from '../controllers/RoleController.js';

export const router = express.Router();

router.get('/', getAllRoles);

router.get('/:id', getRole);

router.post('/', createRole);

router.patch ('/:id', updateRole);

router.delete ('/:id', deleteRole);