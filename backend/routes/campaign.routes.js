import express from 'express';
import Campaign from '../models/campaign.model.js';
import Customer from '../models/customer.model.js';
import CommunicationLog from '../models/comunicationLogs.model.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/campaigns
router.post('/', verifyToken, async (req, res) => {
    const { rules, message } = req.body;

    try {
        const campaign = new Campaign({ rules, message });
        await campaign.save();

        // Get customers (you can filter later based on rules)
        const customers = await Customer.find().limit(5); // Simulate limited delivery

        // Simulate delivery
        const logs = customers.map(cust => {
            const isSuccess = Math.random() < 0.9; // 90% success rate
            return {
                campaign_id: campaign._id,
                customer_email: cust.email,
                status: isSuccess ? 'SENT' : 'FAILED',
                message: message.replace('{{name}}', cust.name)
            };
        });

        await CommunicationLog.insertMany(logs);

        res.status(201).json({ campaign_id: campaign._id, delivered_to: logs.length ,rules, message });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/campaigns
router.get('/', async (req, res) => {
    try {
        const campaigns = await Campaign.find().sort({ created_at: -1 });

        const enriched = await Promise.all(
            campaigns.map(async campaign => {
                const logs = await CommunicationLog.find({ campaign_id: campaign._id });
                const sent = logs.filter(l => l.status === 'SENT').length;
                const failed = logs.filter(l => l.status === 'FAILED').length;
                return {
                    _id: campaign._id,
                    message: campaign.message,
                    created_at: campaign.created_at,
                    audience: logs.length,
                    sent,
                    failed
                };
            })
        );

        res.json(enriched);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
