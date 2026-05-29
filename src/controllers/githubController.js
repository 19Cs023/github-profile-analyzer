const axios = require('axios');
const db = require('../config/db');

// @desc    Analyze public GitHub profile and store insights
// @route   POST /api/profiles/analyze
// @access  Public
const analyzeProfile = async (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ error: 'GitHub username is required' });
    }

    try {
        // Fetch user data from GitHub public API
        const response = await axios.get(`https://api.github.com/users/${username}`);
        const data = response.data;

        const profileData = {
            username: data.login,
            name: data.name,
            bio: data.bio,
            public_repos: data.public_repos,
            followers: data.followers,
            following: data.following,
            profile_url: data.html_url,
            avatar_url: data.avatar_url
        };

        // Insert or update DB with the fetched insights
        const [result] = await db.query(
            `INSERT INTO profiles 
             (username, name, bio, public_repos, followers, following, profile_url, avatar_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
             name=VALUES(name), bio=VALUES(bio), public_repos=VALUES(public_repos), 
             followers=VALUES(followers), following=VALUES(following), 
             profile_url=VALUES(profile_url), avatar_url=VALUES(avatar_url)`,
            [
                profileData.username,
                profileData.name,
                profileData.bio,
                profileData.public_repos,
                profileData.followers,
                profileData.following,
                profileData.profile_url,
                profileData.avatar_url
            ]
        );

        res.status(201).json({ 
            message: 'Profile successfully analyzed and saved to the database.', 
            data: profileData 
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: 'GitHub user not found' });
        }
        console.error('Error analyzing profile:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// @desc    Get all analyzed profiles stored in the DB
// @route   GET /api/profiles
// @access  Public
const getAllProfiles = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM profiles ORDER BY created_at DESC');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching profiles:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// @desc    Get a single profile by username
// @route   GET /api/profiles/:username
// @access  Public
const getProfile = async (req, res) => {
    const { username } = req.params;
    
    try {
        const [rows] = await db.query('SELECT * FROM profiles WHERE username = ?', [username]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Profile not found in database. Please analyze it first.' });
        }
        
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching profile:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    analyzeProfile,
    getAllProfiles,
    getProfile
};
