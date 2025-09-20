const express = require("express");
const bcrypt = require("bcryptjs"); // ✅ đổi sang bcryptjs
const User = require("../models/User");
const router = express.Router();
// Register
router.post("/register", async(req, res) => {
    try {
        const { username, password } = req.body;

        const user = new User({ username, password });
        await user.save();

        res.json({ message: "✅ User registered successfully!" });
    } catch (err) {
        res.status(400).json({ error: "❌ Registration failed", details: err.message });
    }
});
// Login
router.post("/login", async(req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ error: "Invalid user or password" });
        }
        // Lưu thông tin user vào session
        req.session.userId = user._id;
        // 
        res.cookie('sid', req.sessionID, {
            httpOnly: true,
            secure: false, // Chỉ gửi cookie qua HTTPS trong môi trường production
            maxAge: 1000 * 60 * 60,
        });
        res.json({ message: "Login successful!" });
    } catch (err) {
        res.status(500).json({ error: "Login failed", details: err.message });
    }
});
// Logout
router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: "Logout failed" });

        // Xóa cookie session
        res.clearCookie("sid");
        res.clearCookie("connect.sid");
        res.json({ message: "✅ Logged out successfully!" });
    });
});
// Protected route
router.get('/profile', async(req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await User.findById(req.session.userId).select('-password');
    res.json({ user });
});

module.exports = router;