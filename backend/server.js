import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import supabase from './db.js';

// Controllers
import { signupController } from './AuthControllers/SignUpControllers.js';
import { loginController } from './AuthControllers/LogInControllers.js';

// Routes
import otpRoutes from './Routes/OtpRoutes.js';
import notesRoutes from './Routes/NoteRoutes.js';
import profileRoutes from './Routes/ProfileRoutes.js';

// DB init functions
import createSignUpTable from './AuthDBSchema/SignUpDB.js';
import createLogInTable from './AuthDBSchema/LogInDB.js';
import createEmailOtpTable from './AuthDBSchema/EmailOtpDB.js';
import createResetPasswordOtpTable from './AuthDBSchema/ResetPasswordOtpDB.js';
import createNotesInfoTable from './NoteDBSchema/NotesDB.js';
import createLikesTable from './NoteDBSchema/LikesDB.js';

dotenv.config();

const app = express();


// ----------------------
// CORS CONFIG (FIXED)
// ----------------------
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://uni-notes-b896.vercel.app" 
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


// ----------------------
// Middleware
// ----------------------
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ----------------------
// Health Check Route
// ----------------------
app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});


// ----------------------
// API Routes
// ----------------------
app.post('/signup', signupController);
app.post('/login', loginController);

app.use('/otp', otpRoutes);
app.use('/notes', notesRoutes);
app.use('/profile', profileRoutes);


// ----------------------
// DB Connection Check
// ----------------------
const checkDatabaseConnection = async () => {
  try {
    const { error } = await supabase
      .from('signup')
      .select('id')
      .limit(1);

    if (error) {
      console.log('Supabase connection error:', error.message);
    } else {
      console.log('Connected to Supabase successfully');
    }
  } catch (err) {
    console.log('DB connection failed:', err.message);
  }
};


// ----------------------
// Safe Table Init
// ----------------------
const initDatabase = async () => {
  try {
    await createSignUpTable();
    await createLogInTable();
    await createEmailOtpTable();
    await createResetPasswordOtpTable();
    await createNotesInfoTable();
    await createLikesTable();

    console.log("Database tables initialized");
  } catch (err) {
    console.log("Table init skipped or already exists:", err.message);
  }
};


// ----------------------
// Start Server
// ----------------------
const startServer = async () => {
  try {
    await initDatabase();

    const PORT = process.env.PORT || 5001;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    await checkDatabaseConnection();

  } catch (err) {
    console.log("Server startup error:", err.message);
  }
};

startServer();