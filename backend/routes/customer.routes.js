
import express from 'express';
import { createCustomer } from '../controllers/customer.controller.js';
const router = express.Router();
router.post('/', createCustomer);
export default router;
