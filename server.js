const express = require('express');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
        },
    },
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const secureRateLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3,
    message: {
        error: 'Too many login attempts, please try again later.',
        retryAfter: 60
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const passwords = {
    'secretpassword': {
        isCorrect: true
    }
};

const SECURE_PASSWORD = 'supersecretpassword';
let securePasswordHash = null;

bcrypt.hash(SECURE_PASSWORD, 10).then(hash => {
    securePasswordHash = hash;
});

const rateLimitStore = new Map();

app.post('/api/login-insecure', (req, res) => {
    const { password } = req.body;
    
    setTimeout(() => {
        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password field is required',
                error: 'MISSING_PASSWORD'
            });
        }
        
        if (password !== 'secretpassword') {
            return res.status(401).json({
                success: false,
                message: `Incorrect password. You entered: "${password}"`,
                error: 'WRONG_PASSWORD',
                hint: 'Password should start with "secret"' 
            });
        }
        
        res.json({
            success: true,
            message: 'Access Granted! Welcome!',
            serverInfo: {
                version: '1.0.0',
                database: 'MySQL 8.0.1',
                lastBackup: '2024-01-15' 
            }
        });
    }, 500); 
});

app.post('/api/login-secure', secureRateLimit, async (req, res) => {
    const { password } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (!password) {
        return res.status(400).json({
            success: false,
            message: 'Authentication failed'
        });
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
        if (!rateLimitStore.has(clientIP)) {
            rateLimitStore.set(clientIP, { attempts: 0, lockedUntil: null });
        }
        
        const clientData = rateLimitStore.get(clientIP);
        
        if (clientData.lockedUntil && clientData.lockedUntil > Date.now()) {
            return res.status(429).json({
                success: false,
                message: 'Authentication failed'
            });
        }
        
        const dummyHash = '$2b$10$dummyhashtopreventtimingattacks.padding.more.text';
        const hashToCompare = securePasswordHash || dummyHash;
        
        const isValidPassword = await bcrypt.compare(password, hashToCompare);
        
        if (securePasswordHash && isValidPassword) {
            clientData.attempts = 0;
            clientData.lockedUntil = null;
            
            res.json({
                success: true,
                message: 'Authentication successful'
            });
        } else {
            clientData.attempts = (clientData.attempts || 0) + 1;
            
            if (clientData.attempts >= 5) {
                clientData.lockedUntil = Date.now() + (15 * 60 * 1000); // 15 minutes
            }
            
            res.status(401).json({
                success: false,
                message: 'Authentication failed'
            });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        
        res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Educational Password Security Demo`);
    console.log(`Secure endpoint: POST /api/login-secure`);
    console.log(` Insecure endpoint: POST /api/login-insecure`);
});