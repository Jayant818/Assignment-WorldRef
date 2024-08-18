# Task Management App

This project is a full-stack Task Management App built with React, Redux, TailwindCSS on the frontend, and Express.js, PostgreSQL, Prisma, and Zod on the backend. The app supports real-time deadline updates, progress scoring, user authentication with JWT and cookies, and profile management with image upload via Cloudinary.

## Features

- **Task Management:** Add, edit, delete tasks with title, description, due date, and status (To Do, In Progress, Done).
- **Real-Time Deadline Updates:** Displays time remaining for each task and updates in real-time.
- **Filtering and Sorting:** Filter tasks by deadlines and overdue status, and sort them by soonest or latest deadlines.
- **Progress Scoring:** Tracks task completion and calculates progress score based on deadlines.
- **User Authentication:** Register and login with email and password. Authentication managed via cookies and JWT.
- **Profile Management:** Users can upload and display their profile picture.
- **State Management:** Global state managed with Redux Toolkit, and component-specific state with Context API.
- **Responsive UI:** Built with Material-UI and TailwindCSS ensuring responsiveness and accessibility.

## Project Structure

- `/frontend`: Contains the React frontend code.
- `/backend`: Contains the Express.js backend code.

## Tech Stack

### Frontend

- **React**
- **Redux Toolkit**
- **TailwindCSS**
- **Material-UI**

### Backend

- **Express.js**
- **PostgreSQL**
- **Prisma**
- **Zod**
- **Cloudinary** (for image upload)
- **JWT & Cookies** (for authentication)

## Setup Instructions

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Change the BACKEND_URL - at `constants/index.ts`

### Backend Setup

1. Get your database connection URL from [Neon DB](https://neon.tech/).

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run Prisma migrations to set up the database schema:

   ```bash
   npx prisma migrate dev --name init_schema
   ```

4. Thinks Marked with "ONLY FOR DEVELOPMENT" uncomment them.

5. Compile the TypeScript code:

   ```bash
   tsc -b
   ```

6. Start the backend server:

   ```bash
   node dist/index.js
   ```
