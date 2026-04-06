function permit(...allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.role)) {
            return res.status(403).json({ status: "error", message: "Forbidden: insufficient role" });
        }
        next();
    };
}

module.exports = { permit };