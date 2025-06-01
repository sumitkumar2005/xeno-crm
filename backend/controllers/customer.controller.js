import Customer from "../models/customer.model.js";
import Joi from "joi";

const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string(),
    last_order_date: Joi.date(),
    lifetime_spend: Joi.number().required(),
    visits: Joi.number(),
});

export const createCustomer = async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json(customer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
