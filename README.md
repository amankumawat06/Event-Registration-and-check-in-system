# Setup Instructions

## Prerequisites
- Install Node.js and npm.
- Make sure MongoDB is running locally or use a MongoDB Atlas connection.

## Setup

### 1. Extract the Project
- Extract the ZIP file.
- Open the extracted `Event Management web App` folder in VS Code.
- Open the terminal using **Terminal → New Terminal**.

### 2. Setup the Backend

From the main project folder, run:

```bash
cd server
npm install
```

Create the `.env` file and add the following variables:

```env
PORT=7000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

**Important:** Keep `PORT=7000` because the frontend is configured to connect to the backend on this port. Replace the MongoDB connection string and JWT secret with valid values.

Start the backend:

```bash
npm start
```

Keep this terminal running.

### 3. Setup the Frontend

Open a **second terminal** in VS Code. Make sure the terminal is in the main project folder, then run:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed in the terminal to access the application.

### 4. Important Notes
- Keep both frontend and backend terminals running while using the application.
- Ensure MongoDB is connected and the `.env` values are configured correctly.
- Keep the backend port at `7000` and ensure the frontend API URL and backend CORS configuration match.
 
