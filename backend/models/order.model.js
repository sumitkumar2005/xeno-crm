import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customer_email: String,
    order_date: Date,
    amount: Number,
    items: [String], // array of product names or IDs
});

export default mongoose.model("Order", orderSchema);
