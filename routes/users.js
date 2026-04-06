const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticate } = require("../middlewares/auth");
const { permit } = require("../middlewares/roles");

// Get all users (Admin)
router.get("/", authenticate, permit("admin"), (req, res) => {
    const users = db.prepare("SELECT id, username, email, role, status FROM users").all();
    res.json({ status: "success", data: users });
});

// Update user role or status (Admin)
router.put("/:id", authenticate, permit("admin"), (req, res) => {
    const { role, status } = req.body;
    const stmt = db.prepare("UPDATE users SET role = ?, status = ? WHERE id = ?");
    stmt.run(role, status, req.params.id);
    res.json({ status: "success", message: "User updated" });
});

module.exports = router;