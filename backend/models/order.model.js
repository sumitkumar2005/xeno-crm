import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    items: [
        {
            name: String,
            quantity: Number,
            price: Number,
        },
    ],
});

export default mongoose.model("Order", orderSchema);
