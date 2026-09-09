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


/* =========================================================
   APP
========================================================= */

const app = express();

const PORT =
  Number(process.env.PORT) || 5000;


/* =========================================================
   CORS
========================================================= */

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);


app.use(
  cors({
    origin: (origin, callback) => {

      // Allow requests without Origin
      // Example: Postman / direct browser requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(
        `Blocked by CORS: ${origin}`
      );

      return callback(
        new Error('Not allowed by CORS')
      );
    },

    credentials: true
  })
);


/* =========================================================
   BODY PARSERS
========================================================= */

app.use(
  express.json({
    limit: '2mb'
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '2mb'
  })
);


/* =========================================================
   STATIC FILES / RESUMES

   Database stores:
   /uploads/resumes/filename.pdf

   Browser accesses:
   http://localhost:5000/uploads/resumes/filename.pdf
========================================================= */

const uploadsDirectory =
  path.resolve('uploads');


app.use(
  '/uploads',
  express.static(
    uploadsDirectory,
    {
      fallthrough: true,
      index: false
    }
  )
);


/* =========================================================
   HEALTH CHECK
========================================================= */

app.get(
  '/api/health',
  async (req, res) => {

    try {

      await sql`
        SELECT 1
      `;

      return res.status(200).json({
        success: true,
        message:
          'Vyntara API is running.',
        database:
          'connected'
      });

    } catch (error) {

      console.error(
        'Health check error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Database connection failed.'
      });
    }
  }
);


/* =========================================================
   ROOT
========================================================= */

app.get(
  '/',
  (req, res) => {

    return res.status(200).json({
      success: true,
      message:
        'Vyntara Technologies API'
    });
  }
);


/* =========================================================
   ADMIN AUTH / DASHBOARD
========================================================= */

app.use(
  '/api/admin',
  adminRouter
);


/* =========================================================
   PROJECT ENQUIRIES
========================================================= */

app.use(
  '/api/projects',
  projectsRouter
);


/* =========================================================
   PUBLIC JOBS

   GET /api/jobs
   GET /api/jobs/:id
========================================================= */

app.use(
  '/api/jobs',
  publicJobsRouter
);


/* =========================================================
   ADMIN JOBS

   GET    /api/admin/jobs
   POST   /api/admin/jobs
   PUT    /api/admin/jobs/:id
   PATCH  /api/admin/jobs/:id/status
   DELETE /api/admin/jobs/:id
========================================================= */

app.use(
  '/api/admin/jobs',
  adminJobsRouter
);


/* =========================================================
   JOB APPLICATIONS

   applications.js already contains:

   POST
   /jobs/:id/applications

   GET
   /admin/applications

   GET
   /admin/applications/:id

   PATCH
   /admin/applications/:id/status

   DELETE
   /admin/applications/:id

   Therefore mount at /api
========================================================= */

app.use(
  '/api',
  applicationsRouter
);


/* =========================================================
   PUBLIC TESTIMONIALS
========================================================= */

app.use(
  '/api/testimonials',
  publicTestimonialsRouter
);


/* =========================================================
   ADMIN TESTIMONIALS
========================================================= */

app.use(
  '/api/admin/testimonials',
  testimonialsRouter
);


/* =========================================================
   API 404
========================================================= */

app.use(
  '/api',
  (req, res) => {

    return res.status(404).json({
      success: false,
      message:
        'API endpoint not found.'
    });
  }
);


/* =========================================================
   GENERAL 404
========================================================= */

app.use(
  (req, res) => {

    return res.status(404).json({
      success: false,
      message:
        'Resource not found.'
    });
  }
);


/* =========================================================
   ERROR HANDLER
========================================================= */

app.use(
  (
    error,
    req,
    res,
    next
  ) => {

    console.error(
      'Server error:',
      error
    );


    /* ---------------- CORS ---------------- */

    if (
      error.message ===
      'Not allowed by CORS'
    ) {

      return res.status(403).json({
        success: false,
        message:
          'Request origin is not allowed.'
      });
    }


    /* ---------------- MULTER / FILE SIZE ---------------- */

    if (
      error.code ===
      'LIMIT_FILE_SIZE'
    ) {

      return res.status(400).json({
        success: false,
        message:
          'Uploaded file is too large.'
      });
    }


    /* ---------------- DEFAULT ---------------- */

    return res.status(
      error.status || 500
    ).json({
      success: false,
      message:
        error.message ||
        'Internal server error.'
    });
  }
);


/* =========================================================
   START SERVER
========================================================= */

app.listen(
  PORT,
  () => {

    console.log('');
    console.log(
      '========================================'
    );

    console.log(
      ' VYNTARA TECHNOLOGIES API'
    );

    console.log(
      '========================================'
    );

    console.log(
      `Server: http://localhost:${PORT}`
    );

    console.log(
      `Health: http://localhost:${PORT}/api/health`
    );

    console.log(
      `Uploads: http://localhost:${PORT}/uploads`
    );

    console.log(
      '========================================'
    );

    console.log('');
  }
);