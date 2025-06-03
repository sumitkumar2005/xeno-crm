import express from 'express';
import CommunicationLog from '../models/comunicationLogs.model.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/logs/:campaignId — Fetch logs by campaign
router.get('/:campaignId', verifyToken, async (req, res) => {
    try {
        const logs = await CommunicationLog.find({
            campaign_id: req.params.campaignId,
        }).sort({ created_at: -1 });

        res.json(logs);
    } catch (err) {
        console.error('Error fetching logs:', err);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

export default router;
