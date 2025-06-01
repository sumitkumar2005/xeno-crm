import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    last_order_date: Date,
    lifetime_spend: Number,
    visits: Number,
});

export default mongoose.model("Customer", customerSchema);
