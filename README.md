# Student Success Progression System

A MERN stack application for tracking and managing student academic progress and success.

## Features
- Student profile management
- Academic progress tracking
- Course management
- Performance analytics
- Goal setting and tracking

## Tech Stack
- MongoDB: Database
- Express.js: Backend framework
- React.js: Frontend framework
- Node.js: Runtime environment

## Project Structure
```
student_succession/
├── client/             # React frontend
├── server/             # Node.js backend
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create .env file and add:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/student_succession
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Students
- GET /api/students - Get all students
- GET /api/students/:id - Get student by ID
- POST /api/students - Create new student
- PUT /api/students/:id - Update student
- DELETE /api/students/:id - Delete student

### Courses
- GET /api/courses - Get all courses
- GET /api/courses/:id - Get course by ID
- POST /api/courses - Create new course
- PUT /api/courses/:id - Update course
- DELETE /api/courses/:id - Delete course

## License
MIT 