# Student Performance & Article Analytics Dashboard

This is a MERN stack project built to help teachers create learning articles and monitor how students interact with them. Students can read articles, highlight important content, and their reading activity is automatically tracked.

The project has separate dashboards for Teachers and Students with role-based authentication using JWT.

## Technologies Used

### Frontend

1. React
2. TypeScript
3. Vite
4. Material UI
5. React Router
6. Axios
7. Chart.js

### Backend

1. Node.js
2. Express.js
3. MongoDB
4. Mongoose
5. JWT Authentication

---

## Features

### Teacher

1. Secure Login and Registration
2. Dashboard with analytics charts
3. Create new articles
4. Edit existing articles
5. Delete articles
6. View article statistics
7. Category-wise analytics
8. Daily article views

### Student

1. Secure Login and Registration
2. Browse available articles
3. Search articles
4. Filter articles by category
5. Read articles
6. Reading time tracking
7. Highlight important text
8. Save personal notes
9. Dashboard showing reading activity

---

## Installation

### Clone the repository

```bash
git clone <repository-url>
```

### Install Backend

1. Navigate to the backend folder.

```bash
cd backend
npm install
```

2. Start the backend server.

```bash
npm run dev
```

### Install Frontend

1. Navigate to the frontend folder.

```bash
cd frontend
npm install
```

2. Start the frontend server.

```bash
npm run dev
```

---

## Environment Variables

### Backend (.env)

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

---

## Run the Project

1. Start the backend server.

```bash
cd backend
npm run dev
```

2. Start the frontend server.

```bash
cd frontend
npm run dev
```

3. Open the application in your browser.

```
http://localhost:5173
```

---

## API Routes

### Authentication

1. `POST /api/auth/register`
2. `POST /api/auth/login`

### Articles

1. `GET /api/articles`
2. `POST /api/articles`
3. `PUT /api/articles/:id`
4. `DELETE /api/articles/:id`

### Analytics

1. `GET /api/analytics`
2. `GET /api/analytics/student`

### Tracking

1. `POST /api/tracking`

### Highlights

1. `GET /api/student/highlights`
2. `POST /api/student/highlights`

---

## Screens

### Teacher

1. Login
2. Dashboard
3. Articles
4. Create Article
5. Analytics

### Student

1. Login
2. Dashboard
3. Article List
4. Article Reader
5. Highlights

---

## Future Improvements

1. Image upload using AWS S3
2. Export analytics reports
3. Rich text editor
4. Notifications
5. Dark mode
6. Responsive mobile layout
---
## Author
Krishnakanth

This project was developed as a MERN stack learning project to practice JWT authentication, CRUD operations, analytics dashboards, student activity tracking, and role-based access control.
