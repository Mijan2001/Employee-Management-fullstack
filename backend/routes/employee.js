import express from 'express';
import multer from 'multer';
import authMiddleware from '../middleware/authMiddleware.js';
import {
    getAllEmployees,
    addEmployee,
    deleteEmployee,
    getEmployeeById,
    updateEmployee
} from '../controllers/employeeController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', authMiddleware, getAllEmployees);
router.get('/:id', authMiddleware, getEmployeeById);
router.post('/add', authMiddleware, upload.single('image'), addEmployee);
router.put('/:id', authMiddleware, upload.single('image'), updateEmployee);
router.delete('/:id', authMiddleware, deleteEmployee);

export default router;
