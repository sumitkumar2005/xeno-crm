import express from 'express';
import cors from 'cors';
import connect from "./configs/mongodbConfig.js"
const app = express();
app.use(cors());
app.use(express.json());
connect();
app.get('/', (req, res) => res.send('Xeno CRM API running'));
app.listen(5000, () => console.log('Backend running on port 5000'));
