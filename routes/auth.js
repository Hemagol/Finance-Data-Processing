const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../middlewares/auth");

// Register
router.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) return res.status(400).json({ status: "error", message: "All fields required" });

    const exists = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (exists) return res.status(400).json({ status: "error", message: "Email exists" });

    const hashed = await bcrypt.hash(password, 10);
    const stmt = db.prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
    const info = stmt.run(username, email, hashed, role || "viewer");

    res.json({ status: "success", message: "User registered", data: { id: info.lastInsertRowid } });
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) return res.status(401).json({ status: "error", message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ status: "error", message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role, status: user.status }, SECRET, { expiresIn: "1d" });
    res.json({ status: "success", message: "Login successful", data: { accessToken: token } });
});

module.exports = router;
