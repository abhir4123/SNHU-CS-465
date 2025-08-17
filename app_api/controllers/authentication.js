const mongoose = require('mongoose');
const User = require('../models/user');
const passport = require('passport'); // needed for login()

// POST /register
const register = async (req, res) => {
    // Validate inputs
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'All fields required' });
    }

    // Create and set password (hash+salt stored in model)
    const user = new User({
        name: req.body.name,
        email: req.body.email
    });

    user.setPassword(req.body.password);

    try {
        const q = await user.save();
        if (!q) {
            return res.status(400).json({ message: 'User not saved' });
        }
        // Return a JWT so the client is immediately authenticated
        const token = user.generateJWT();
        return res.status(200).json({ token });
    } catch (err) {
        return res.status(400).json({ message: 'Registration failed', error: err });
    }
};

// POST /login
const login = (req, res) => {
    // Ensure both fields present
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'All fields required' });
    }

    // Delegate to passport local strategy
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(404).json(err);
        }
        if (user) {
            // Successful auth — issue JWT
            const token = user.generateJWT();
            return res.status(200).json({ token });
        }
        // Failed auth — bubble up passport's info
        return res.status(401).json(info);
    })(req, res);
};

// Export both controllers
module.exports = {
    register,
    login
};
