import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
    rules: [{ field: String, operator: String, value: mongoose.Schema.Types.Mixed, logical: String }],
    message: String,
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Campaign', campaignSchema);
