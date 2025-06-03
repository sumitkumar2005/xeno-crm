
import express from 'express';
import { createOrder, getOrdersByCustomer, getAllOrders } from '../controllers/order.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a new order (protected)
router.post('/', verifyToken, createOrder);

// Get orders for a specific customer (protected)
router.get('/customer/:customerId', verifyToken, getOrdersByCustomer);

// Get all orders (protected)
router.get('/', verifyToken, getAllOrders);

export default router;
