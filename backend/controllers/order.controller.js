import Order from "../models/order.model.js";
import Customer from "../models/customer.model.js";
import Joi from "joi";

const itemSchema = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    price: Joi.number().min(0).required()
});

const schema = Joi.object({
    customer_id: Joi.string().required(),
    amount: Joi.number().required(),
    date: Joi.date().required(),
    items: Joi.array().items(itemSchema).min(1).required()
});

export const createOrder = async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        // Check if customer exists
        const customer = await Customer.findById(req.body.customer_id);
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        const order = new Order(req.body);
        await order.save();
        
        // Update customer stats
        await updateCustomerStats(req.body.customer_id);
        
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getOrdersByCustomer = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        
        // Check if customer exists
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }
        
        const orders = await Order.find({ customer_id: customerId }).sort({ date: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Helper function to update customer stats based on their orders
async function updateCustomerStats(customerId) {
    try {
        // Get all orders for this customer
        const customerOrders = await Order.find({ customer_id: customerId });
        
        // Calculate total spent
        const totalSpent = customerOrders.reduce((sum, order) => sum + order.amount, 0);
        
        // Calculate total visits (order count)
        const totalVisits = customerOrders.length;
        
        // Find the most recent order date
        let lastOrderDate = null;
        if (totalVisits > 0) {
            lastOrderDate = customerOrders.reduce((latest, order) => {
                return order.date > latest ? order.date : latest;
            }, new Date(0));
        }
        
        // Update the customer document
        await Customer.findByIdAndUpdate(customerId, {
            lifetime_spend: totalSpent,
            visits: totalVisits,
            last_order_date: lastOrderDate
        });
        
        return true;
    } catch (error) {
        console.error(`Error updating customer stats for ID ${customerId}:`, error);
        return false;
    }
}
