const jwt = require("jsonwebtoken");
const secret = require("../configs/auth.config");
const User = require("../models/user.model");

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "No token provided or invalid token format!" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, secret.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized! Invalid or expired token." });
        }
        req.userId = decoded.id;
        req.userType = decoded.userType;
        req.franchiseId = decoded.franchiseId;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.userType !== "ADMIN") {
        return res.status(403).json({ message: "Access denied. Admins only!" });
    }
    next();
};

const isFranchiseBDE = (req, res, next) => {
    if (req.userType !== "FRANCHISE_BDE") {
        return res.status(403).json({ message: "Access denied. Franchise BDE only!" });
    }
    next();
};

const isFranchisePartner = (req, res, next) => {
    if (req.userType !== "FRANCHISE_PARTNER") {
        return res.status(403).json({ message: "Access denied. Franchise Partner only!" });
    }
    next();
};

module.exports = { verifyToken, isAdmin, isFranchiseBDE, isFranchisePartner };
