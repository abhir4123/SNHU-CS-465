const express = require('express');
const router = express.Router();

const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

const jwt = require('jsonwebtoken'); // Enable JSON Web Tokens

// Middleware: authenticate JWT BEFORE protected handlers run
function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        // No Authorization header at all
        return res.status(401).json({ message: 'Authorization header required' });
    }

    // Expected format: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res
            .status(400)
            .json({ message: 'Malformed Authorization header (expected: Bearer <token>)' });
    }

    const token = parts[1];
    if (!token) {
        return res.status(401).json({ message: 'Bearer token missing' });
    }

    // Verify synchronously so we only call next() if verification succeeds
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.auth = payload; // make decoded token available downstream
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Token validation failed', error: err.message });
    }
}

// Public auth endpoints
router
    .route('/register')
    .post(authController.register);

router
    .route('/login')
    .post(authController.login);

// Trips endpoints
router
    .route('/trips')
    .get(tripsController.tripsList) // public: list trips
    .post(authenticateJWT, tripsController.tripsAddTrip); // protected: add

router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode) // public: view one
    .put(authenticateJWT, tripsController.tripsUpdateTrip) // protected: update
    .delete(authenticateJWT, tripsController.tripsDeleteTrip); // protected: delete

module.exports = router;
