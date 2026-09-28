# State Hostel Portal

A beginner-friendly hostel management portal built with Next.js App Router, MongoDB, Mongoose, and plain JavaScript.

## Overview

This application allows students to register, log in, apply for hostel accommodation, upload required documents, and monitor application status. Admin users can review applications, approve or reject them, and allocate rooms.

## Technologies Used

- Next.js 16 App Router
- JavaScript only
- MongoDB
- Mongoose
- JWT-based authentication
- Plain CSS styling

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file based on `.env.example`.
3. Start MongoDB locally or use a cloud MongoDB connection string.
4. Run the app:
   ```bash
   npm run dev
   ```

## MongoDB Setup

Ensure MongoDB is running locally on:

```bash
mongodb://127.0.0.1:27017/state-hostel-portal
```

You can also use a MongoDB Atlas connection string in `MONGODB_URI`.

## Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/state-hostel-portal
JWT_SECRET=your_super_secure_secret
```

## Seed the Database

Run:

```bash
node scripts/seed.js
```

This creates:

- 1 admin account
- 1 student account
- 2 hostels
- 10+ rooms

## Demo Login Credentials

### Student
- Email: `student@statehostel.edu`
- Password: `student123`

### Admin
- Email: `admin@statehostel.edu`
- Password: `admin123`

## Project Structure

```text
app/
  admin/
  api/
  login/
  register/
  student/
components/
lib/
models/
public/
scripts/
```

## Main API Routes

### Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`

### Student
- GET `/api/student/profile`
- POST `/api/applications`
- GET `/api/applications/my`
- GET `/api/applications/:id`
- PUT `/api/applications/:id`

### Admin
- GET `/api/admin/dashboard`
- GET `/api/admin/applications`
- GET `/api/admin/applications/:id`
- PUT `/api/admin/applications/:id/status`
- POST `/api/admin/rooms/allocate`

### Hostels and Rooms
- GET `/api/hostels`
- GET `/api/rooms`

## Notes

- Passwords are hashed using bcrypt before saving.
- Students can only access their own applications.
- Admin users can review applications and allocate rooms.
- The UI uses clean, responsive card layouts and beginner-friendly forms.
