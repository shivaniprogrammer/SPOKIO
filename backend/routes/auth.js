const express = require('express');
const router = express.Router();
const User = require('../models/User');

// REGISTER ROUTE (http://localhost:5000/api/auth/register)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, caretakerEmail } = req.body;
        
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Create user (User.js will hash the password automatically)
        const user = await User.create({ name, email, password, caretakerEmail });
        
        res.status(201).json({ success: true, message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// LOGIN ROUTE (http://localhost:5000/api/auth/login)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // We must manually select the password because your model has 'select: false'
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Use the comparePassword method from your User.js
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        res.json({ 
            success: true, 
            message: "Welcome back!", 
            user: { id: user._id, name: user.name } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;