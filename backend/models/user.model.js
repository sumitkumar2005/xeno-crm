import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    name: String,
    picture: String,
}, { timestamps: true });

export default mongoose.model('User', userSchema);
