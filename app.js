require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors()); // Enable CORS for frontend API calls
app.use(express.static('public')); // Serve frontend files

const token = process.env.GITHUB_TOKEN;
const username = process.env.GITHUB_USERNAME;

if (!token || !username) {
    console.error("❌ Missing GitHub credentials in .env file.");
    process.exit(1); // Stop execution if credentials are missing
}

// ✅ Route to fetch GitHub profile data
app.get('/api/github-profile', async (req, res) => {
    try {
        const response = await axios.get(`https://api.github.com/users/${username}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        res.json(response.data);
    } catch (error) {
        console.error("❌ Error fetching GitHub data:", error.message);
        res.status(500).json({ error: "Couldn't fetch GitHub profile." });
    }
});

// ✅ Route to fetch GitHub repositories
app.get('/api/github-repos', async (req, res) => {
    try {
        console.log("Fetching repositories...");

        const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status !== 200) {
            throw new Error(`GitHub API error: ${response.statusText}`);
        }

        console.log("✅ Successfully fetched repositories.");
        res.json(response.data);
    } catch (error) {
        console.error("❌ Error fetching GitHub repos:", error.message);
        res.status(500).json({ error: "Couldn't fetch repositories." });
    }
});

// Serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
