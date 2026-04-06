const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticate } = require("../middlewares/auth");
const { permit } = require("../middlewares/roles");

// Create transaction (Admin only)
router.post("/", authenticate, permit("admin"), (req, res) => {
    const { amount, type, category, date, notes } = req.body;
    if (!amount || !type || !date) return res.status(400).json({ status: "error", message: "Required fields missing" });

    const stmt = db.prepare("INSERT INTO transactions (user_id, amount, type, category, date, notes) VALUES (?, ?, ?, ?, ?, ?)");
    const info = stmt.run(req.userId, amount, type, category || "", date, notes || "");
    res.json({ status: "success", message: "Transaction added", data: { id: info.lastInsertRowid } });
});

// View transactions (all roles)
router.get("/", authenticate, permit("viewer","analyst","admin"), (req, res) => {
    let query = "SELECT * FROM transactions WHERE user_id = ?";
    let params = [req.userId];

    // Filtering
    const { type, category, startDate, endDate } = req.query;
    if (type) { query += " AND type = ?"; params.push(type); }
    if (category) { query += " AND category = ?"; params.push(category); }
    if (startDate) { query += " AND date >= ?"; params.push(startDate); }
    if (endDate) { query += " AND date <= ?"; params.push(endDate); }

    const txns = db.prepare(query).all(...params);
    res.json({ status: "success", data: txns });
});

// Update transaction (Admin only)
router.put("/:id", authenticate, permit("admin"), (req, res) => {
    const { amount, type, category, date, notes } = req.body;
    const stmt = db.prepare("UPDATE transactions SET amount=?, type=?, category=?, date=?, notes=? WHERE id=? AND user_id=?");
    stmt.run(amount, type, category, date, notes, req.params.id, req.userId);
    res.json({ status: "success", message: "Transaction updated" });
});

// Delete transaction (Admin only)/
router.delete("/:id", authenticate, permit("admin"), (req, res) => {
    const stmt = db.prepare("DELETE FROM transactions WHERE id=? AND user_id=?");
    stmt.run(req.params.id, req.userId);
    res.json({ status: "success", message: "Transaction deleted" });
});

// Dashboard summaries (Analyst+Admin)
router.get("/dashboard/summary", authenticate, permit("analyst","admin"), (req, res) => {
    const totalIncome = db.prepare("SELECT SUM(amount) as total FROM transactions WHERE user_id=? AND type='income'").get(req.userId).total || 0;
    const totalExpense = db.prepare("SELECT SUM(amount) as total FROM transactions WHERE user_id=? AND type='expense'").get(req.userId).total || 0;
    const netBalance = totalIncome - totalExpense;

    const categoryTotals = db.prepare("SELECT category, SUM(amount) as total FROM transactions WHERE user_id=? GROUP BY category").all(req.userId);

    const recentActivity = db.prepare("SELECT * FROM transactions WHERE user_id=? ORDER BY date DESC LIMIT 5").all(req.userId);

    res.json({ status: "success", data: { totalIncome, totalExpense, netBalance, categoryTotals, recentActivity } });
});

module.exports = router;