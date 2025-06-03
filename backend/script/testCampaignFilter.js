import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Customer from '../models/customer.model.js';

dotenv.config();

// Helper function to apply the operator between two values (same as in campaign.routes.js)
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

// Filter customers based on campaign rules (same logic as in campaign.routes.js)
function filterCustomersByRules(customers, rules) {
  if (!rules || rules.length === 0) {
    return customers;
  }

  return customers.filter(customer => {
    let result = true;
    let previousLogical = 'AND';

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      
      if (!rule.field || !rule.operator || rule.value === undefined || rule.value === null) {
        continue;
      }

      if (i > 0 && previousLogical === 'OR') {
        if (result) continue;
        result = true;
      }

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
          if (customer[rule.field] !== undefined) {
            ruleResult = applyOperator(customer[rule.field], rule.operator, value);
          }
      }

      if (previousLogical === 'AND') {
        result = result && ruleResult;
      } else {
        result = result || ruleResult;
      }

      previousLogical = rule.logical || 'AND';

      if (previousLogical === 'AND' && !result) break;
    }

    return result;
  });
}

// Test function to show campaign rule filtering in action
async function testCampaignFilters() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log('MongoDB connected');

    // Get all customers
    const allCustomers = await Customer.find();
    console.log(`Total customers: ${allCustomers.length}`);

    // Test different campaign rules
    const testCases = [
      {
        name: "High Spenders",
        rules: [{ field: "spend", operator: ">", value: 15000, logical: "AND" }]
      },
      {
        name: "Frequent Shoppers",
        rules: [{ field: "visits", operator: ">=", value: 5, logical: "AND" }]
      },
      {
        name: "Recently Active",
        rules: [{ field: "inactive_days", operator: "<", value: 30, logical: "AND" }]
      },
      {
        name: "High Spenders OR Frequent Shoppers",
        rules: [
          { field: "spend", operator: ">", value: 15000, logical: "OR" },
          { field: "visits", operator: ">=", value: 10, logical: "AND" }
        ]
      },
      {
        name: "High Spenders AND Recently Active",
        rules: [
          { field: "spend", operator: ">", value: 12000, logical: "AND" },
          { field: "inactive_days", operator: "<", value: 45, logical: "AND" }
        ]
      }
    ];

    // Test each rule set
    for (const testCase of testCases) {
      const filtered = filterCustomersByRules(allCustomers, testCase.rules);
      console.log(`\n${testCase.name}:`);
      console.log(`Matched ${filtered.length} out of ${allCustomers.length} customers`);
      
      // Show the first 3 matches with relevant details
      if (filtered.length > 0) {
        console.log("Sample matches:");
        filtered.slice(0, 3).forEach(customer => {
          const lastOrderDate = customer.last_order_date ? 
            customer.last_order_date.toISOString().split('T')[0] : 'Never';
          const inactiveDays = customer.last_order_date ?
            Math.floor((new Date() - new Date(customer.last_order_date)) / (1000 * 60 * 60 * 24)) :
            'N/A';
          
          console.log(`  - ${customer.name}: ₹${customer.lifetime_spend || 0} spent, ${customer.visits || 0} visits, last order: ${lastOrderDate} (${inactiveDays} days ago)`);
        });
        
        if (filtered.length > 3) {
          console.log(`  ...and ${filtered.length - 3} more`);
        }
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error testing campaign filters:', error);
    process.exit(1);
  }
}

// Run the test
testCampaignFilters();
