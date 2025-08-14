# Ailhsan Metro Hotel - Full Stack MVP

A complete hotel management system with booking integration, user authentication, and admin dashboard.

## 🏨 Features

### Frontend (React)
- **Home Page**: Landing section, about, rooms, gallery, reviews, map
- **User Authentication**: Login/signup with JWT
- **User Dashboard**: View bookings, rate rooms
- **Admin Dashboard**: Manage rooms, images, reviews
- **Responsive Design**: Mobile-friendly interface

### Backend (Node.js + Express + PostgreSQL)
- **Authentication**: JWT-based with role management
- **Room Management**: CRUD operations
- **Booking Integration**: Booking.com Partner API
- **Review System**: User ratings and comments
- **Image Upload**: Admin photo management
- **User Management**: Account operations

## 🎨 Theme Colors
- **Background**: White
- **Footer**: Black
- **Primary**: Blue (#007BFF) - 20%
- **Warning**: Red (#FF4B4B) - 15%
- **Accent**: Gold (#FFD700) - 5%

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- PostgreSQL
- Booking.com Partner API key

### Installation

1. **Clone and install dependencies**
   ```bash
   npm run install-all
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database and API credentials.

3. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb ailhsan_hotel
   
   # Run migrations
   cd backend && npm run migrate
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

### Environment Variables
Create a `.env` file in the root directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ailhsan_hotel
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key

# Booking.com API
BOOKING_API_KEY=your_booking_api_key
BOOKING_API_URL=https://distribution-xml.booking.com/json/bookings

# Server
PORT=5000
NODE_ENV=development
```

## 📁 Project Structure

```
hotel-app/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS files
│   └── package.json
├── backend/                 # Node.js API
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── uploads/           # Image uploads
│   └── server.js          # Main server file
├── .env.example           # Environment template
└── package.json           # Root package.json
```

## 🔧 Available Scripts

- `npm run dev` - Start both frontend and backend in development
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run build` - Build frontend for production
- `npm start` - Start production server

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `DELETE /api/auth/delete` - Delete account

### Rooms
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create room (admin)
- `PUT /api/rooms/:id` - Update room (admin)
- `DELETE /api/rooms/:id` - Delete room (admin)

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create review
- `DELETE /api/reviews/:id` - Delete review

### Images
- `POST /api/upload` - Upload image (admin)
- `GET /api/images` - Get all images

## 🔐 Admin Access

Default admin credentials (change after first login):
- Email: admin@ailhsan.com
- Password: admin123

## 📱 Booking.com Integration

The app integrates with Booking.com Partner API for:
- Real-time room availability
- Direct booking redirects
- Booking management

## 🛠️ Tech Stack

- **Frontend**: React, React Router, Axios, Bootstrap
- **Backend**: Node.js, Express, JWT, Multer
- **Database**: PostgreSQL, Sequelize ORM
- **Maps**: Google Maps Embed API
- **Booking**: Booking.com Partner API

## 📄 License

MIT License - see LICENSE file for details


