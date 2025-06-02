import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

console.log("Google OAuth Client initialized with client ID:", process.env.GOOGLE_CLIENT_ID);
console.log("JWT Secret:", process.env.JWT_SECRET);
router.post('/google', async (req, res) => {
    const { token, email, name, picture } = req.body;

    try {
        // Step 1: Verify the ID token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (payload.email !== email) {
            return res.status(401).json({ error: "Token and email mismatch" });
        }

        // Step 2: Check if user exists or create new
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, name, picture });
            await user.save();
        }

        // Step 3: Generate JWT token
        const appToken = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '3d' }
        );

        res.json({ token: appToken, user });
    } catch (err) {
        console.error("OAuth login failed:", err);
        res.status(401).json({ error: 'Authentication failed' });
    }
});

export default router;
