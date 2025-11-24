# Minimal E-Commerce - MERN Stack

A fully functional, minimal and aesthetic e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- 🛍️ Product catalog with beautiful product cards
- 🔍 Product detail pages
- 🛒 Shopping cart functionality
- 💳 Complete checkout process
- 👤 User authentication with signup/login
- 📦 Order management
- 🎨 Minimal, aesthetic design

## Tech Stack

**Frontend:**
- React 19
- React Router DOM
- Axios
- Vite

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=super_secure_key
```

For MongoDB Atlas, use:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=super_secure_key
```

4. Start MongoDB (if using local installation):
```bash
mongod
```

5. Start the backend server:
```bash
npm run dev
```

6. Seed initial products:
   - The backend includes a `/api/products/seed` endpoint that will populate the database with initial products.
   - You can call this endpoint using a tool like Postman or curl:
```bash
curl -X POST http://localhost:5000/api/products/seed
```

Or simply open in browser: `http://localhost:5000/api/products/seed`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `frontend` directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Frontend Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   └── ProductCard.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── OrderConfirmation.jsx
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── utils/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── App.css
├── public/
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `POST /api/products/seed` - Seed initial products

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id` - Update order status

### Auth
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and receive JWT
- `GET /api/auth/me` - Retrieve the authenticated user profile

## Development

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000`
- Vite proxy is configured to forward `/api` requests to the backend

## Build for Production

### Frontend
```bash
npm run build
```

### Backend
The backend can be run in production mode with:
```bash
npm start
```

Make sure to set appropriate environment variables for production.

## License

MIT
