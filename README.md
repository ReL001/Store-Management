# College Store Management System

A web-based application for managing college store inventory and purchase requests. The system allows store managers to add products and HODs to review and approve/reject purchase requests.

## Features

- User Authentication (Store Manager and HOD roles)
- Product Management
- Purchase Request Workflow
- Email Notifications
- Responsive Design

## Tech Stack

- Frontend:
  - React with TypeScript
  - Material-UI
  - React Router
  - Formik & Yup for form handling
  - Axios for API calls

- Backend:
  - Node.js with Express
  - MongoDB
  - JWT for authentication
  - Nodemailer for email notifications

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd college-store-management
```

2. Install Frontend Dependencies:
```bash
cd frontend
npm install
```

3. Install Backend Dependencies:
```bash
cd ../backend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

5. Start the Backend Server:
```bash
cd backend
npm run dev
```

6. Start the Frontend Development Server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
college-store-management/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── types/
│   │   └── context/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 