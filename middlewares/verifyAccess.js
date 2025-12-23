const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "ACCESS_SECRET_KEY";

module.exports = function (req, res, next) {
    const id = req.user.id;
    const {} = req.body; 
};
