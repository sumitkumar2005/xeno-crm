# Xeno CRM System

A mini full-stack Customer Relationship Management (CRM) platform built to streamline customer insights, order tracking, and personalized marketing campaigns.

---

## 🚀 Overview

Xeno CRM empowers businesses to:

* Manage and analyze customer data
* Launch targeted, rule-based marketing campaigns
* Track customer orders and engagement
* Personalize messages using AI suggestions

### 🧱 Tech Stack

* **Frontend:** React.js (Vite, Tailwind CSS)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** Google OAuth + JWT
* **AI:** Gemini-powered message generation

---

## 🗂️ Directory Structure

```bash
/xeno-crm
├── /frontend           # React application
│   ├── /src/pages      # Pages (Login, Dashboard, Campaigns, etc.)
│   └── vite.config.js  # Vite configuration
│
├── /backend            # Node.js Express server
│   ├── /models         # Mongoose schemas
│   ├── /routes         # API endpoints
│   ├── /middleware     # Auth middleware
│   ├── /controllers    # Logic for routes
│   ├── /scripts        # Seeder utilities
│   └── app.js          # App entry point
```

---

## ✨ Key Features

### 👥 Customer Management

* View, filter, and manage customers
* Track lifetime spend, last visit, and order history

### 📢 Campaign Builder

* Rule-based campaign targeting (spend, visits, inactivity)
* Support for logical operators (AND/OR) and comparison operators (>, <, >=, <=, ==)
* AI-generated campaign message suggestions (using Gemini API)
* Real-time preview and delivery tracking

### 📦 Order Management

* Manage and filter customer orders
* Track order totals and frequency
* Update customer stats post-order

### 🔒 Authentication

* Secure Google OAuth login
* Token-based route protection

---

## 🛠️ Setup Instructions

### 📦 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_CONNECTION_STRING=your_mongo_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
PORT=5000
```

Run the server:

```bash
npm start
```

### 💻 Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `/frontend`:

```env
VITE_API_URL=https://your-backend-url.vercel.app/api
```

Start the frontend locally:

```bash
npm run dev
```

---

## 🧪 Data Seeder Scripts

### 1. Seed Customers

```bash
cd backend
node script/seedCustomers.js
```

* Adds 50+ mock customers
* Varied spending, visits, and order dates

### 2. Seed Orders

```bash
cd backend
node script/seedOrders.js
```

* Generates realistic orders using mock products
* Updates customer lifetime spend and visits

---

## 💡 Usage Guide

### ➕ Create Campaign

1. Go to "Create Campaign"
2. Add rules: `spend > 10000`, `inactive_days < 30`, etc.
3. Use AI button to auto-generate message
4. Launch and see delivery summary with status per customer

### 👁️ View Campaigns

* Dashboard shows recent and total campaigns
* Each card links to detailed logs

### 📇 Manage Customers

* Navigate to "Customers"
* View or search customer list
* See past orders and spend

### 📃 View Orders

* View full order history
* Filter by customer or date

---

## 🔗 API Endpoints (REST)

### 🔐 Authentication

* `POST /api/auth/google` - Google login

### 👥 Customers

* `GET /api/customers`
* `POST /api/customers`
* `GET /api/customers/:id`

### 📢 Campaigns

* `POST /api/campaigns`
* `GET /api/campaigns`
* `GET /api/campaigns/:id`

### 🧠 AI Suggestions

* `POST /api/ai/generate-message`

### 📨 Communication Logs

* `GET /api/logs/:campaignId`

### 📦 Orders

* `GET /api/orders`
* `POST /api/orders`
* `GET /api/orders/:id`

---

## 🧠 AI Message Generation

The campaign builder includes an AI-powered prompt:

* Uses rules to suggest messages
* Personalized with `{{name}}`
* Under 200 characters

Example:

> "Hey {{name}}, we noticed you've been active! Enjoy 20% off on your next visit this week!"

---

## 📦 Deployment Notes

* Frontend hosted on Vercel (React/Vite)
* Backend deployed to Vercel as a separate project (Express)
* Google OAuth configured with:

    * **Authorized JavaScript Origins:** `https://your-frontend.vercel.app`
    * **Authorized Redirect URIs:** `https://your-backend.vercel.app/api/auth/google/callback` (if using redirect)

---


## 👨‍💻 Author

Sumit Kumar Jha
