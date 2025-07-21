const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, "your_jwt_secret", {
        expiresIn: "1h",
    });
    res.json({ token, role: user.role });
});

router.get("/", async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
});

router.post("/", async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    res.json({ id: newUser._id, username, role });
});

router.put("/:id", async (req, res) => {
    const { username, password, role } = req.body;
    const updates = {};
    if (username) updates.username = username;
    if (password) updates.password = await bcrypt.hash(password, 10);
    if (role) updates.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select(
        "-password"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
});

router.delete("/:id", async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
});

module.exports = router;