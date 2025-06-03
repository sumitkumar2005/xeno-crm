
import express from 'express';
import { createCustomer } from '../controllers/customer.controller.js';
import Customer from '../models/customer.model.js';
import { verifyToken } from '../middleware/auth.middleware.js';
const router = express.Router();
router.post('/', createCustomer);
// GET /api/customers
router.get("/", verifyToken, async (req, res) => {
    try {
        const customers = await Customer.find().sort({ name: 1 });
        res.json(customers);
    } catch (err) {
        console.error("Error fetching customers:", err);
        res.status(500).json({ message: "Failed to fetch customers" });
    }
});

export default router;
