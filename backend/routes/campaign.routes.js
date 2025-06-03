import express from 'express';
const router = express.Router();
import Campaign from '../models/campaign.model.js';
import Customer from '../models/customer.model.js';
import CommunicationLog from '../models/comunicationLogs.model.js';
import { verifyToken } from '../middleware/auth.middleware.js';


router.post('/', verifyToken, async (req, res) => {
    const { rules, message } = req.body;

    try {
        const campaign = new Campaign({
            rules,
            message,
            created_by: req.user.userId
        });

        await campaign.save();

        // Fetch all customers
        const customers = await Customer.find();

        // Filter customers based on rules
        const selected = filterCustomersByRules(customers, rules);

        const logs = selected.map(cust => {
            const personalizedMessage = message.replace('{{name}}', cust.name);
            const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';

            return {
                campaign_id: campaign._id,
                customer_name: cust.name,
                customer_email: cust.email,
                message: personalizedMessage,
                status
            };
        });

        await CommunicationLog.insertMany(logs);

        res.status(201).json({
            message: "Campaign created and messages sent",
            campaign_id: campaign._id,
            targeted_customers: logs
        });
    } catch (err) {
        console.error("Error creating campaign:", err);
        res.status(500).json({ error: err.message });
    }
});


// GET /api/campaigns
router.get("/", verifyToken, async (req, res) => {
    try {
        const campaigns = await Campaign.find({ created_by: req.user.userId }).sort({ createdAt: -1 });
        res.json(campaigns);
    } catch (err) {
        console.error("Error fetching campaigns:", err);
        res.status(500).json({ message: "Server error" });
    }
})

// Preview campaign targeting without creating the campaign
router.post('/preview', verifyToken, async (req, res) => {
    const { rules } = req.body;
    
    try {
        // Fetch all customers
        const allCustomers = await Customer.find();
        
        // Apply filtering based on rules
        const matchedCustomers = filterCustomersByRules(allCustomers, rules);
        
        // Return preview data
        res.json({
            total_customers: allCustomers.length,
            matched_customers: matchedCustomers.slice(0, 50), // Limit to 50 customers for performance
            matched_count: matchedCustomers.length
        });
    } catch (error) {
        console.error('Error previewing campaign:', error);
        res.status(500).json({ message: error.message });
    }
});

// Helper function to filter customers based on campaign rules
function filterCustomersByRules(customers, rules) {
    if (!rules || rules.length === 0) {
        return customers; // If no rules, return all customers
    }

    return customers.filter(customer => {
        // Start with true and apply each rule
        let result = true;
        let previousLogical = 'AND'; // Default logical operator

        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            
            // Skip incomplete rules
            if (!rule.field || !rule.operator || rule.value === undefined || rule.value === null) {
                continue;
            }

            // Apply logical operator from previous rule
            if (i > 0 && previousLogical === 'OR') {
                if (result) continue; // If previous result is true with OR, no need to check further
                result = true; // Reset for this new condition group
            }

            // Apply rule based on field
            let ruleResult = false;
            const value = rule.value;

            switch(rule.field) {
                case 'spend':
                    ruleResult = applyOperator(customer.lifetime_spend || 0, rule.operator, Number(value));
                    break;
                case 'visits':
                    ruleResult = applyOperator(customer.visits || 0, rule.operator, Number(value));
                    break;
                case 'inactive_days':
                    const inactiveDays = customer.last_order_date 
                        ? Math.floor((new Date() - new Date(customer.last_order_date)) / (1000 * 60 * 60 * 24))
                        : Number.MAX_SAFE_INTEGER;
                    ruleResult = applyOperator(inactiveDays, rule.operator, Number(value));
                    break;
                default:
                    // Handle any custom fields that might be added in the future
                    if (customer[rule.field] !== undefined) {
                        ruleResult = applyOperator(customer[rule.field], rule.operator, value);
                    }
            }

            // Apply current rule result based on logical operator
            if (previousLogical === 'AND') {
                result = result && ruleResult;
            } else { // OR
                result = result || ruleResult;
            }

            // Store the logical operator for the next iteration
            previousLogical = rule.logical || 'AND';

            // If using AND and already false, no need to check further
            if (previousLogical === 'AND' && !result) break;
        }

        return result;
    });
}

// Helper function to apply the operator between two values
function applyOperator(a, operator, b) {
    switch(operator) {
        case '>':
            return a > b;
        case '<':
            return a < b;
        case '>=':
            return a >= b;
        case '<=':
            return a <= b;
        case '==':
            return a == b;
        default:
            return false;
    }
}

export default router;
