const express = require('express');
const router = express.Router();
const { analyzeProfile, getAllProfiles, getProfile } = require('../controllers/githubController');

// Define API routes
router.post('/analyze', analyzeProfile);
router.get('/', getAllProfiles);
router.get('/:username', getProfile);

module.exports = router;
