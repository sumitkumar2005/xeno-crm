import Order from "../models/order.model.js";
import Joi from "joi";

const schema = Joi.object({
    customer_email: Joi.string().email().required(),
    order_date: Joi.date().required(),
    amount: Joi.number().required(),
    items: Joi.array().items(Joi.string()).required(),
});

export const createOrder = async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
