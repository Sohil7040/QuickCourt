# QuickCourt - Sports Court Booking Platform

A full-stack web application for booking sports courts and venues online.

### Video Link : https://drive.google.com/drive/folders/13FJ8pi4RMRzzf5BGheGWvGTlbaoyUuDL?usp=drive_link

## 🚀 Features

- **User Authentication**: Secure login/register system with JWT
- **Venue Management**: Owners can list and manage their sports venues
- **Booking System**: Users can book courts with real-time availability
- **Admin Dashboard**: Admin panel for managing users, venues, and bookings
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Live booking status and availability

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **Multer** for file uploads
- **Cloudinary** for image storage

### Frontend
- **React** with **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```bash
# Edit .env file with your MongoDB URI and JWT secret
MONGODB_URI=mongodb://localhost:27017/quickcourt
JWT_SECRET=your_secret_key
```

5. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend/QuickCourt
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
# Create .env file in frontend/QuickCourt/
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm run dev
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Venues
- `GET /api/venues` - Get all venues
- `GET /api/venues/:id` - Get venue by ID
- `POST /api/venues` - Create new venue (owner only)
- `PUT /api/venues/:id` - Update venue (owner only)
- `DELETE /api/venues/:id` - Delete venue (owner only)
- `GET /api/venues/owner/my-venues` - Get owner's venues

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/cancel` - Cancel booking

## 🎯 Usage

### For Users
1. Register as a user
2. Browse available venues
3. Book courts for desired time slots
4. Manage your bookings from dashboard

### For Venue Owners
1. Register as an owner
2. Add your sports venues with details
3. Manage venue availability and pricing
4. View and manage bookings

### For Admins
1. Access admin dashboard
2. Approve/reject venue listings
3. Manage all users and bookings
4. View platform analytics

## 🔧 Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend/QuickCourt
npm test
```

### Code Formatting
```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend/QuickCourt
npm run lint
```

## 🚀 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Deploy to services like Heroku, Railway, or DigitalOcean
3. Ensure MongoDB connection is properly configured

### Frontend Deployment
1. Build the frontend:
```bash
cd frontend/QuickCourt
npm run build
```
2. Deploy to services like Vercel, Netlify, or AWS S3

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support
For support, email support@quickcourt.com or join our Slack channel.
