const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "ACCESS_SECRET_KEY";

module.exports = function (req, res, next) {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = header.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;   // now controllers can access req.user.userId
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token", token: false });
    }
};
