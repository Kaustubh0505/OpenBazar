# OpenBazar

A modern, full-stack e-commerce marketplace built with Next.js and Express.js. OpenBazar features a sleek, premium fashion-forward design with comprehensive shopping capabilities, admin management, and a unique thrift marketplace for buying and selling pre-owned items.

![OpenBazar](https://img.shields.io/badge/OpenBazar-E--Commerce-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)

## 🌟 Features

### Customer Features
- **Browse & Shop**: Elegant product catalog with advanced filtering and search
- **Shopping Cart**: Seamless cart management with real-time updates
- **Secure Checkout**: Integrated Razorpay payment gateway for safe transactions
- **User Authentication**: 
  - Email/Password registration and login
  - Google OAuth integration
  - Password reset with OTP verification
- **Order Management**: Track order history and status
- **Thrift Marketplace**: Buy and sell pre-owned items with integrated Cloudinary image uploads

### Seller Features
- **Product Listings**: Create and manage product listings
- **Dashboard**: Monitor sales and pending products
- **Image Management**: Upload product images via Cloudinary

### Admin Features
- **Banner Management**: Create and manage promotional banners
- **User Management**: Oversee user accounts and roles
- **Order Oversight**: Monitor all platform transactions

### Design Highlights
- **Premium Aesthetic**: Clean, minimal, editorial-style design
- **Responsive Layout**: Seamless experience across all devices
- **Smooth Animations**: Framer Motion powered micro-interactions
- **Modern UI**: Earthy color palette with sophisticated typography

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1 (React 19)
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Authentication**: Google OAuth (@react-oauth/google)
- **Notifications**: Sonner (toast notifications)

### Backend
- **Runtime**: Node.js with Express 5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Email Service**: Nodemailer with Mailtrap
- **Payment Gateway**: Razorpay
- **Image Storage**: Cloudinary
- **CORS**: Enabled for cross-origin requests

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Kaustubh0505/OpenBazar.git
cd OpenBazar
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# Server
PORT=5001

# Authentication
JWT_SECRET=your_jwt_secret_key

# Email Service
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
# Backend API URL
NEXT_PUBLIC_BACKENDURL=http://localhost:5001

# Cloudinary
NEXT_PUBLIC_CLOUDINARYAPI=your_cloudinary_upload_url

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 4. Seed Database (Optional)

Populate the database with sample products and categories:

```bash
cd backend
node seedDatabase.js
# or
node seedProducts.js
```

### 5. Create Admin User (Optional)

Promote a user to admin role:

```bash
cd backend
node promote_to_admin.js
```

## 🏃‍♂️ Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm run dev  # or: nodemon server.js
```
The backend server will start on `http://localhost:5001`

**Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:3000`

### Production Mode

**Backend:**
```bash
cd backend
node server.js
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

## 📁 Project Structure

```
OpenBazar/
├── backend/
│   ├── config/          # Database and Razorpay configuration
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Auth middleware
│   ├── models/          # MongoDB schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── ThriftItem.js
│   │   ├── Banner.js
│   │   └── Category.js
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   ├── server.js        # Express app entry point
│   └── .env             # Environment variables
│
└── frontend/
    ├── app/
    │   ├── admin/       # Admin panel pages
    │   ├── auth/        # Authentication pages
    │   ├── cart/        # Shopping cart
    │   ├── checkout/    # Checkout flow
    │   ├── components/  # Reusable components
    │   ├── context/     # React context providers
    │   ├── homePage/    # Landing page
    │   ├── product/     # Product details
    │   ├── products/    # Product listing
    │   ├── sell-item/   # Thrift item creation
    │   ├── seller/      # Seller dashboard
    │   └── thrift-store/ # Thrift marketplace
    ├── public/          # Static assets
    └── .env             # Environment variables
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (seller)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order by ID

### Thrift Marketplace
- `GET /api/thrift` - Get all thrift items
- `POST /api/thrift` - Create thrift item
- `POST /api/thrift/purchase/:id` - Purchase thrift item

### Admin
- `GET /api/admin/pending-products` - Get products pending approval
- `PUT /api/admin/approve/:id` - Approve product
- `PUT /api/admin/reject/:id` - Reject product

### Banners
- `GET /api/banners` - Get all banners
- `POST /api/banners` - Create banner (admin)
- `DELETE /api/banners/:id` - Delete banner

### Payment
- `POST /api/payment/verify` - Verify Razorpay payment


## 🔐 Security Features

- JWT-based authentication
- bcrypt password hashing
- Protected API routes with middleware
- CORS configuration for authorized origins
- Environment variable protection

## 🌐 Deployment

### Backend
The backend is deployed at: `https://openbazarapi.kaustubh.codes`

### Frontend
The frontend is deployed at: `https://openbazar.kaustubh.codes`

## 📝 Environment Variables Reference

### Backend Required Variables
| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `PORT` | Server port (default: 5001) |
| `JWT_SECRET` | Secret key for JWT signing |
| `EMAIL_USER` | Email service username |
| `EMAIL_PASS` | Email service password |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `RAZORPAY_KEY_ID` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API key secret |

### Frontend Required Variables
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_BACKENDURL` | Backend API URL |
| `NEXT_PUBLIC_CLOUDINARYAPI` | Cloudinary upload endpoint |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay key for frontend |

Contributions are welcome!

**Made with ❤️ by Kaustubh Hiwanj**
