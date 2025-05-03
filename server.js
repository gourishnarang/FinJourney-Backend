import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import User from "./models/userModel.js"
import cors from "cors"
dotenv.config();

const app = express(); 

connectDB(); 

const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Server is running...!");
}
);

app.get("/users/email", (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    res.status(200).json({ message: `Email stored successfully: ${email}` });
}
);

app.post("/api/users/email", async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        
        // Check if user with this email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }
        
        // Create new user with earlyAccess set to true
        const newUser = await User.create({
            email,
            earlyAccess: true
        });
        
        res.status(201).json({
            message: "User created successfully",
            user: newUser
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get all users
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            count: users.length,
            users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);