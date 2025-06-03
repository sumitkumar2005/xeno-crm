# Xeno CRM System

A comprehensive Customer Relationship Management system designed to help businesses manage customer data, track orders, and create targeted marketing campaigns.

## Overview

Xeno CRM is a full-stack application that provides businesses with powerful tools to manage customer relationships, analyze sales data, and execute targeted marketing campaigns. The system enables businesses to filter customers based on specific criteria and create personalized communication strategies.

## System Architecture

The application follows a modern client-server architecture:

- **Frontend**: React.js application built with Vite
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ORM

### Directory Structure

```
/xeno-crm
├── /frontend           # React.js client application
│   ├── /public         # Static assets
│   ├── /src            # React components and logic
│   └── vite.config.js  # Vite configuration
│
├── /backend            # Node.js server application
│   ├── /configs        # Configuration files
│   ├── /controllers    # Route controllers
│   ├── /middleware     # Express middleware
│   ├── /models         # Mongoose data models
│   ├── /routes         # API routes
│   ├── /scripts        # Utility scripts
│   └── app.js          # Express application entry point
```

## Key Features

### Customer Management
- Store and manage customer profiles
- Track customer spending and visit history
- View customer order history

### Campaign Management
- Create targeted marketing campaigns
- Advanced customer filtering based on specific rules:
  - Filter by customer spending amounts
  - Filter by number of visits
  - Filter by days of inactivity
- Combine multiple rules using logical operators (AND/OR)
- Support for various comparison operators (>, <, >=, <=, ==)

### Order Tracking
- Track and manage customer orders
- View order history and details
- Calculate lifetime customer value

### User Authentication
- Secure user authentication
- Role-based access control

### AI Integration
- AI-powered insights and recommendations

## Setup and Installation

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the server:
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Usage Guide

### Creating Campaigns
1. Navigate to the Campaigns section
2. Click "Create New Campaign"
3. Define campaign rules using the rule builder:
   - Select customer attributes (spend, visits, inactive_days)
   - Choose comparison operators (>, <, >=, <=, ==)
   - Set threshold values
   - Combine rules with logical operators (AND/OR)
4. Compose your campaign message
5. Review the filtered customer list
6. Save and launch the campaign

### Managing Customers
1. Navigate to the Customers section
2. View the list of all customers
3. Click on a customer to view their details
4. Edit customer information as needed
5. View order history and communication logs

### Tracking Orders
1. Navigate to the Orders section
2. View all orders or filter by customer
3. Click on an order to view details
4. Update order status as needed

## API Documentation

The backend provides a RESTful API for interacting with the system:

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get authentication token

### Customer Endpoints
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create a new customer
- `GET /api/customers/:id` - Get customer details
- `PUT /api/customers/:id` - Update customer information

### Campaign Endpoints
- `GET /api/campaigns` - Get all campaigns
- `POST /api/campaigns` - Create a new campaign
- `GET /api/campaigns/:id` - Get campaign details
- `PUT /api/campaigns/:id` - Update campaign information

### Order Endpoints
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Get order details

## Technologies Used

### Frontend
- React.js
- Vite
- React Router
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication


## Development Utilities

### Data Seeders

The application includes powerful seeder scripts to populate the database with realistic test data for development and testing purposes.

#### Customer Seeder

The `seedCustomers.js` script generates a comprehensive set of dummy customer records with diverse profiles:

- Creates 50+ customer profiles with varied attributes
- Each customer has name, email, phone, last_order_date, lifetime_spend, and visits
- Spending ranges from ₹2,800 to ₹24,700
- Visit counts range from 3 to 37
- Order dates span across different months

To run the customer seeder:
```
cd backend
node script/seedCustomers.js
```

#### Order Seeder

The `seedOrders.js` script creates realistic order data and updates customer statistics:

- Generates 50-100 random orders
- Includes mock product data for 15 different products with realistic price ranges
- Each order contains 1-3 unique items with random quantities
- Order dates are distributed between January and June 2025
- Automatically calculates total order amounts based on item prices and quantities
- Updates each customer's lifetime_spend, visit count, and last_order_date based on their orders

To run the order seeder (after seeding customers):
```
cd backend
node script/seedOrders.js
```


