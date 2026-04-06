const jwt = require("jsonwebtoken");
const SECRET = "super-secret-key";

function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ status: "error", message: "No token" });

    try {
        const decoded = jwt.verify(token, SECRET);
        req.userId = decoded.id;
        req.role = decoded.role;
        req.status = decoded.status;
        if (req.status !== "active") return res.status(403).json({ status: "error", message: "Inactive user" });
        next();
    } catch {
        res.status(401).json({ status: "error", message: "Invalid token" });
    }
}

module.exports = { authenticate, SECRET };