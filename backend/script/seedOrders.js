import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Customer from '../models/customer.model.js';
import Order from '../models/order.model.js';

dotenv.config();

// The actual seeding will be done in the seed function which has the proper MongoDB connection

// Mock product data for generating random items
const mockProducts = [
  { name: "Wireless Headphones", priceRange: [1200, 6000] },
  { name: "Smartphone", priceRange: [8000, 80000] },
  { name: "Laptop", priceRange: [35000, 150000] },
  { name: "Smart Watch", priceRange: [2000, 35000] },
  { name: "Bluetooth Speaker", priceRange: [800, 8000] },
  { name: "Fitness Tracker", priceRange: [1500, 12000] },
  { name: "Tablet", priceRange: [8000, 60000] },
  { name: "Power Bank", priceRange: [600, 3000] },
  { name: "Wireless Earbuds", priceRange: [1000, 20000] },
  { name: "Gaming Console", priceRange: [25000, 50000] },
  { name: "Digital Camera", priceRange: [5000, 80000] },
  { name: "Smart Home Hub", priceRange: [3000, 15000] },
  { name: "External Hard Drive", priceRange: [2500, 12000] },
  { name: "Portable Monitor", priceRange: [8000, 25000] },
  { name: "Wireless Keyboard", priceRange: [1000, 8000] }
];

// Generate a random number between min and max
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// Generate a random date between start and end
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate random items for an order
const generateOrderItems = (itemCount) => {
  const items = [];
  const usedProductIndices = new Set();
  
  for (let i = 0; i < itemCount; i++) {
    let productIndex;
    // Ensure we don't add the same product twice in an order
    do {
      productIndex = randomNumber(0, mockProducts.length - 1);
    } while (usedProductIndices.has(productIndex));
    
    usedProductIndices.add(productIndex);
    
    const product = mockProducts[productIndex];
    const price = randomNumber(product.priceRange[0], product.priceRange[1]);
    const quantity = randomNumber(1, 3);
    
    items.push({
      name: product.name,
      price: price,
      quantity: quantity
    });
  }
  
  return items;
};

// Calculate total amount from items
const calculateOrderAmount = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Update customer stats based on orders
const updateCustomerStats = async (customerId) => {
  try {
    // Get all orders for this customer
    const customerOrders = await Order.find({ customer_id: customerId });
    
    // Calculate total spent
    const totalSpent = customerOrders.reduce((sum, order) => sum + order.amount, 0);
    
    // Calculate total visits (order count)
    const totalVisits = customerOrders.length;
    
    // Find the most recent order date
    let lastOrderDate = null;
    if (totalVisits > 0) {
      lastOrderDate = customerOrders.reduce((latest, order) => {
        return order.date > latest ? order.date : latest;
      }, new Date(0));
    }
    
    // Update the customer document
    await Customer.findByIdAndUpdate(customerId, {
      lifetime_spend: totalSpent,
      visits: totalVisits,
      last_order_date: lastOrderDate
    });
    
    console.log(`Updated stats for customer ID: ${customerId}`);
  } catch (error) {
    console.error(`Error updating customer stats for ID ${customerId}:`, error);
  }
};

// Seed orders function
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log('MongoDB connected');
    
    // Clear existing orders
    await Order.deleteMany({});
    console.log('✅ Cleared existing orders');
    
    // Get all customers
    const customers = await Customer.find({});
    console.log(`✅ Found ${customers.length} customers`);
    
    if (customers.length === 0) {
      console.log('❌ No customers found. Please seed customers first.');
      process.exit(1);
    }
    
    // Generate 50-100 orders
    const orderCount = randomNumber(50, 100);
    console.log(`✅ Generating ${orderCount} orders...`);
    
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-06-01');
    
    // Create orders
    const orderPromises = [];
    
    for (let i = 0; i < orderCount; i++) {
      // Select a random customer
      const randomCustomer = customers[randomNumber(0, customers.length - 1)];
      
      // Generate 1-3 items
      const itemCount = randomNumber(1, 3);
      const items = generateOrderItems(itemCount);
      
      // Calculate total amount
      const amount = calculateOrderAmount(items);
      
      // Generate a random date
      const date = randomDate(startDate, endDate);
      
      // Create the order
      const order = new Order({
        customer_id: randomCustomer._id,
        amount: amount,
        date: date,
        items: items
      });
      
      orderPromises.push(order.save());
    }
    
    // Save all orders
    await Promise.all(orderPromises);
    console.log(`✅ ${orderCount} orders created successfully`);
    
    // Update all customers' stats
    const customerIds = customers.map(customer => customer._id);
    for (const customerId of customerIds) {
      await updateCustomerStats(customerId);
    }
    
    console.log('✅ All customer stats updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding orders:', error);
    process.exit(1);
  }
};

// Execute the seed function
seed();
