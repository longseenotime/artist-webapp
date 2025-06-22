const bcrypt = require('bcryptjs');

// Simple in-memory session for demo purposes
// In production, use proper session storage
const adminCredentials = {
    username: 'admin',
    password: '$2a$10$srLgj.oBr3nM22eDlh0oEuqoKP/bAYc1bEs1uT6BkHxTDCgzCKl0q' // 'admin123'
};

// Middleware to check if user is authenticated
function requireAuth(req, res, next) {
    if (req.session && req.session.authenticated) {
        next();
    } else {
        res.status(401).json({ error: 'Authentication required' });
    }
}

// Login function
async function login(username, password) {
    if (username === adminCredentials.username) {
        const isValid = await bcrypt.compare(password, adminCredentials.password);
        return isValid;
    }
    return false;
}

// Hash password function (for creating new passwords)
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

module.exports = {
    requireAuth,
    login,
    hashPassword
};