const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const port = 3000;

const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:8082',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:8082',
    'capacitor://localhost',
    'http://localhost'
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl) or mobile file protocol
        if (!origin || origin === 'null' || origin.startsWith('file://')) {
            return callback(null, true);
        }
        if (ALLOWED_ORIGINS.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api', apiRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ error: 'Not allowed by CORS' });
    }
    console.error(err.stack);
    res.status(500).send({ error: 'Something broke!' });
});

app.listen(port, () => {
    console.log(`Gestation Guardian 10-layer Node.js server running on http://localhost:${port}`);
});
