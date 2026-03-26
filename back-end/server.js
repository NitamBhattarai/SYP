import express from "express"; 
import cors from "cors"; 
import authRoutes from "./routes/authRoutes.js"; 
import panditRoutes from "./routes/panditRoutes.js"; 
import bookingRoutes from "./routes/bookingRoutes.js"; 
import lookupRoutes from "./routes/lookupRoutes.js"; 
import adminRoutes from './routes/adminRoutes.js'; 
import reviewRoutes from "./routes/reviewRoutes.js"; 
import messageRoutes from './routes/messageRoutes.js'; 
import notificationRoutes from './routes/notificationRoutes.js'; 


// Sequelize is not used; connection configuration lives in config/db.js 

const app = express(); // ensure essential env vars are set 
if (!process.env.DB_NAME || !process.env.DB_USER || 
  !process.env.DB_PASSWORD || !process.env.JWT_SECRET) 
  { console.warn("Warning: one or more required environment variables are missing. Check .env file."); } 
// FIX: restrict CORS to your frontend origin in production 

const corsOptions = { 
  origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true, 
};

app.use(cors(corsOptions)); 
app.use(express.json()); 
app.use("/api/auth", authRoutes); 
app.use("/api/pandit", panditRoutes); 
app.use("/api/bookings", bookingRoutes); 
app.use("/api/lookup", lookupRoutes); 
app.use('/api/admin', adminRoutes); 
app.use("/api/reviews", reviewRoutes); 
app.use('/api/messages', messageRoutes); 
app.use('/api/notifications', notificationRoutes); 

const PORT = process.env.PORT || 5000; 

app.listen(5000, () => console.log("Server running on port 5000"));