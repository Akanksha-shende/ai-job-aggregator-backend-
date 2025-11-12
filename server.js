const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Import the library
const Job = require('./models/Job');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize the AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// MongoDB connection string
const uri = "mongodb+srv://user88:user1111@cluster0.oirfx2r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(uri)
    .then(() => console.log("MongoDB connection established!"))
    .catch(err => console.error("MongoDB connection error:", err));

// API Route to save job listings (POST)
app.post('/api/jobs', async (req, res) => {
    try {
        const jobs = req.body;
        if (!Array.isArray(jobs) || jobs.length === 0) {
            return res.status(400).json({ message: "No jobs provided." });
        }
        await Job.insertMany(jobs);
        res.status(201).json({ message: "Job listings saved successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error saving job listings.", error: error.message });
    }
});

// API Route to get all job listings (GET)
app.get('/api/jobs', async (req, res) => {
    try {
        const jobs = await Job.find({});
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching job listings.", error: error.message });
    }
});

// NEW: API Route for AI analysis
app.post('/api/analyze-job', async (req, res) => {
    try {
        const { description } = req.body;
        const prompt = `Analyze the following job description. Provide a summary, key responsibilities, and a list of skills required. Format your response in plain text.

        Job Description:
        ${description}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        res.status(200).json({ analysis: text });
    } catch (error) {
        console.error("AI analysis error:", error);
        res.status(500).json({ message: "Error performing AI analysis.", error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});