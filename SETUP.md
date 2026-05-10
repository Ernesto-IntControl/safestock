# Setup Guide

## Prerequisites

- Node.js 14+ installed
- MySQL 5.7+ installed
- Git installed

## Backend Setup

1. Navigate to backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create `.env` file in backend directory:
   ```
   DATABASE_URL="mysql://username:password@localhost:3306/safestock"
   JWT_SECRET="your_jwt_secret_key_here"
   PORT=5000
   ```

4. Update MySQL credentials and create database:
   ```sql
   CREATE DATABASE safestock;
   ```

5. Initialize Prisma schema:
   ```
   npx prisma migrate dev --name init
   ```

6. Start backend server:
   ```
   npm run dev
   ```

Backend will run on `http://localhost:5000`

## Frontend Setup

1. Navigate to frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create `.env` file in frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start frontend development server:
   ```
   npm start
   ```

Frontend will run on `http://localhost:3000`

## Testing the Application

1. Open `http://localhost:3000` in your browser
2. Register a new user or login
3. Start using the application

### Test Credentials (after registration)
- Email: admin@safestock.com
- Password: password123
- Role: Administrateur

## Database Setup

The database will be automatically initialized with Prisma migrations. Tables created:
- utilisateurs (Users)
- produits (Products)
- lots_stock (Stock Lots)
- mouvements (Stock Movements)

## Troubleshooting

### Port already in use
- Backend: Change PORT in .env
- Frontend: Change port with `npm start -- --port 3001`

### Database connection error
- Verify MySQL is running
- Check DATABASE_URL credentials
- Ensure database exists: `CREATE DATABASE safestock;`

### CORS errors
- Ensure CORS is enabled in backend (should be by default)
- Check REACT_APP_API_URL is correct

## Building for Production

### Backend:
```
npm run build  # if applicable
npm start      # runs production server
```

### Frontend:
```
npm run build  # creates optimized build
```

Serve the `build/` folder with a static server.
