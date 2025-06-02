import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    campaign_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    customer_email: String,
    status: { type: String, enum: ['SENT', 'FAILED'] },
    message: String,
    created_at: { type: Date, default: Date.now }
});

export default mongoose.model('CommunicationLog', logSchema);
