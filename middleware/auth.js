const bcrypt = require('bcryptjs');

// Simple in-memory session for demo purposes
// In production, use proper session storage
const adminCredentials = {
    username: 'admin',
    password: '$2a$10$8K1p/a0dQ2HsIkH2QJWJMe4RzGQKu4J5tYm5Q4X4Q2rK1S4X2Y4K2' // 'admin123'
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