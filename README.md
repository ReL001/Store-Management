# College Store Management System

A full-stack application for managing college store inventory and requests.

## Features

- Role-based authentication (Store Manager and HOD)
- Product management
- Request management
- Email notifications
- Input validation
- Secure API endpoints

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI
- Formik and Yup for form handling
- React Router for navigation
- Framer Motion for animations

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer for email notifications
- Express Validator for input validation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd college-store-management
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Configure environment variables:
- Copy `.env.example` to `.env` in the backend directory
- Update the variables with your values

4. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd frontend
npm start
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Products
- GET /api/products - Get all products
- POST /api/products - Create a new product
- GET /api/products/:id - Get a single product
- PUT /api/products/:id - Update a product
- DELETE /api/products/:id - Delete a product
- PATCH /api/products/:id/status - Update product status

### Requests
- GET /api/requests - Get all requests
- POST /api/requests - Create a new request
- GET /api/requests/:id - Get a single request
- PUT /api/requests/:id - Update a request
- DELETE /api/requests/:id - Delete a request
- PATCH /api/requests/:id/status - Update request status

### Users
- GET /api/users - Get all users
- GET /api/users/:id - Get a single user
- PUT /api/users/:id - Update a user
- DELETE /api/users/:id - Delete a user
- GET /api/users/me - Get current user

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 