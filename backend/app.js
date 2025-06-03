import express from 'express';
import cors from 'cors';
import connect from "./configs/mongodbConfig.js"
import orderRoutes from './routes/order.routes.js';
import customerRoutes from './routes/customer.routes.js';
import campaignRoutes from "./routes/campaign.routes.js";
import authRoutes from "./routes/auth.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import logRoutes from "./routes/log.routes.js";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
connect();
app.use('/api/orders',orderRoutes)
app.use('/api/customers',customerRoutes)
app.use('/api/campaigns', campaignRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/logs', logRoutes);
app.get('/', (req, res) => res.send('Xeno CRM API running'));

app.listen(PORT, () => console.log('Backend running on port 5000'));
