
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import path from 'path';

import sql from './config/db.js';

import adminRouter from './routes/admin.js';
import projectsRouter from './routes/projects.js';

import testimonialsRouter from './routes/testimonials.js';
import publicTestimonialsRouter from './routes/publicTestimonials.js';

import publicJobsRouter from './routes/publicJobs.js';
import adminJobsRouter from './routes/adminJobs.js';

import applicationsRouter from './routes/applications.js';

import publicPopupRouter from './routes/publicPopup.js';
import adminPopupRouter from './routes/adminPopup.js';

// =========================================================
// APP CONFIGURATION
// =========================================================

const app = express();

const PORT = Number(process.env.PORT) || 5000;

// =========================================================
// CORS CONFIGURATION
// =========================================================

// Production frontend domains and local development.
const allowedOrigins = [
  'https://vyntaralabs.tech',
  'https://www.vyntaralabs.tech',
  'https://vyntaratech.netlify.app',
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]
  .filter(Boolean)
  .map((origin) => origin.trim().replace(/\/+$/, ''));

const uniqueAllowedOrigins = [...new Set(allowedOrigins)];

const corsOptions = {
  origin(origin, callback) {
    // Allow requests without an Origin header, such as server-to-server
    // requests and certain health checks.
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/+$/, '');

    if (uniqueAllowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    console.warn(`Blocked by CORS: ${origin}`);

    const error = new Error('Not allowed by CORS');
    error.status = 403;

    return callback(error);
  },

  credentials: true,

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
  ],

  optionsSuccessStatus: 204,
};

// CORS must run before routes and error handlers.
app.use(cors(corsOptions));

// =========================================================
// BODY PARSERS
// =========================================================

app.use(
  express.json({
    limit: '2mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '2mb',
  })
);

// =========================================================
// STATIC FILES / RESUME UPLOADS
// =========================================================

const uploadsDirectory = path.resolve('uploads');

app.use(
  '/uploads',
  express.static(uploadsDirectory, {
    fallthrough: true,
    index: false,
  })
);

// =========================================================
// HEALTH CHECK
// GET /api/health
// =========================================================

app.get('/api/health', async (req, res) => {
  try {
    await sql`SELECT 1`;

    return res.status(200).json({
      success: true,
      message: 'Vyntara API is running.',
      database: 'connected',
    });
  } catch (error) {
    console.error('Health check error:', error);

    return res.status(500).json({
      success: false,
      message: 'Database connection failed.',
    });
  }
});

// =========================================================
// ROOT
// GET /
// =========================================================

app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Vyntara Technologies API',
  });
});

// =========================================================
// ADMIN AUTH / DASHBOARD
// /api/admin
// =========================================================

app.use('/api/admin', adminRouter);

// =========================================================
// PROJECT ENQUIRIES
// /api/projects
// =========================================================

app.use('/api/projects', projectsRouter);

// =========================================================
// PUBLIC JOBS
// /api/jobs
// =========================================================

app.use('/api/jobs', publicJobsRouter);

// =========================================================
// ADMIN JOBS
// /api/admin/jobs
// =========================================================

app.use('/api/admin/jobs', adminJobsRouter);

// =========================================================
// JOB APPLICATIONS
// /api/jobs/:id/applications
// /api/admin/applications
// =========================================================

app.use('/api', applicationsRouter);

// =========================================================
// PUBLIC TESTIMONIALS
// /api/testimonials
// =========================================================

app.use('/api/testimonials', publicTestimonialsRouter);

// =========================================================
// ADMIN TESTIMONIALS
// /api/admin/testimonials
// =========================================================

app.use('/api/admin/testimonials', testimonialsRouter);

// =========================================================
// PUBLIC WEBSITE POPUP
// /api/popup
// =========================================================

app.use('/api/popup', publicPopupRouter);

// =========================================================
// ADMIN WEBSITE POPUP
// /api/admin/popup
// =========================================================

app.use('/api/admin/popup', adminPopupRouter);

// =========================================================
// API 404 HANDLER
// =========================================================

app.use('/api', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint not found.',
  });
});

// =========================================================
// GENERAL 404 HANDLER
// =========================================================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: 'Resource not found.',
  });
});

// =========================================================
// ERROR HANDLER
// =========================================================

app.use((error, req, res, next) => {
  console.error('Server error:', error);

  if (error.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'Request origin is not allowed.',
    });
  }

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'Uploaded file is too large.',
    });
  }

  return res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error.',
  });
});

// =========================================================
// START SERVER
// =========================================================

app.listen(PORT, () => {
  console.log('========================================');
  console.log(' VYNTARA TECHNOLOGIES API');
  console.log('========================================');
  console.log(`Server running on port ${PORT}`);
  console.log('Health endpoint: /api/health');
  console.log('Uploads endpoint: /uploads');
  console.log('Public Jobs: /api/jobs');
  console.log('Public Popup: /api/popup');
  console.log('========================================');

  console.log('Allowed CORS origins:');

  uniqueAllowedOrigins.forEach((origin) => {
    console.log(` - ${origin}`);
  });
<<<<<<< HEAD
});
=======
});
>>>>>>> 3417806 (Add email confirmations for enquiries and job applications)
