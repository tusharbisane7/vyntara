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
   WEBSITE POPUP
========================================================= */

import publicPopupRouter from './routes/publicPopup.js';
import adminPopupRouter from './routes/adminPopup.js';


/* =========================================================
   APP
========================================================= */

const app = express();

const PORT =
  Number(process.env.PORT) || 5000;


/* =========================================================
   CORS
========================================================= */

/*
 * Production frontend:
 *
 * https://vyntaratech.netlify.app
 *
 * Local development:
 *
 * http://localhost:5173
 * http://127.0.0.1:5173
 */

const allowedOrigins = [
  'https://vyntaratech.netlify.app',
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);


/*
 * Remove duplicate origins.
 */

const uniqueAllowedOrigins = [
  ...new Set(allowedOrigins)
];


app.use(
  cors({

    /*
     * Check request origin.
     */

    origin: (origin, callback) => {

      /*
       * Requests without an Origin header are allowed.
       *
       * Examples:
       * - Postman
       * - Server-to-server requests
       * - Health checks
       */

      if (!origin) {

        return callback(
          null,
          true
        );

      }


      /*
       * Allow approved origins.
       */

      if (
        uniqueAllowedOrigins.includes(
          origin
        )
      ) {

        return callback(
          null,
          true
        );

      }


      /*
       * Reject unknown origins.
       */

      console.warn(
        `Blocked by CORS: ${origin}`
      );


      return callback(
        new Error(
          'Not allowed by CORS'
        )
      );

    },


    /*
     * Allow cookies/authentication headers
     * if required by the frontend.
     */

    credentials: true,


    /*
     * Allowed HTTP methods.
     */

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS'
    ],


    /*
     * Allowed request headers.
     */

    allowedHeaders: [
      'Content-Type',
      'Authorization'
    ],


    /*
     * Browser preflight cache.
     */

    optionsSuccessStatus: 204

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
========================================================= */

/*
 * Database stores:
 *
 * /uploads/resumes/filename.pdf
 *
 * Browser accesses:
 *
 * https://vyntara-backend.onrender.com/uploads/resumes/filename.pdf
 *
 * Local development:
 *
 * http://localhost:5000/uploads/resumes/filename.pdf
 */

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

/*
 * GET /api/health
 */

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

/*
 * GET /
 */

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

/*
 * Mounted at:
 *
 * /api/admin
 */

app.use(
  '/api/admin',
  adminRouter
);


/* =========================================================
   PROJECT ENQUIRIES
========================================================= */

/*
 * Public/project routes:
 *
 * /api/projects
 */

app.use(
  '/api/projects',
  projectsRouter
);


/* =========================================================
   PUBLIC JOBS
========================================================= */

/*
 * GET
 * /api/jobs
 *
 * GET
 * /api/jobs/:id
 */

app.use(
  '/api/jobs',
  publicJobsRouter
);


/* =========================================================
   ADMIN JOBS
========================================================= */

/*
 * GET
 * /api/admin/jobs
 *
 * POST
 * /api/admin/jobs
 *
 * PUT
 * /api/admin/jobs/:id
 *
 * PATCH
 * /api/admin/jobs/:id/status
 *
 * DELETE
 * /api/admin/jobs/:id
 */

app.use(
  '/api/admin/jobs',
  adminJobsRouter
);


/* =========================================================
   JOB APPLICATIONS
========================================================= */

/*
 * applications.js contains:
 *
 * POST
 * /jobs/:id/applications
 *
 * GET
 * /admin/applications
 *
 * GET
 * /admin/applications/:id
 *
 * PATCH
 * /admin/applications/:id/status
 *
 * DELETE
 * /admin/applications/:id
 *
 * Therefore mount at:
 *
 * /api
 */

app.use(
  '/api',
  applicationsRouter
);


/* =========================================================
   PUBLIC TESTIMONIALS
========================================================= */

/*
 * GET
 * /api/testimonials
 */

app.use(
  '/api/testimonials',
  publicTestimonialsRouter
);


/* =========================================================
   ADMIN TESTIMONIALS
========================================================= */

/*
 * Admin testimonial routes:
 *
 * /api/admin/testimonials
 */

app.use(
  '/api/admin/testimonials',
  testimonialsRouter
);


/* =========================================================
   WEBSITE POPUP
========================================================= */

/*
 * PUBLIC
 *
 * GET
 * /api/popup
 *
 *
 * ADMIN
 *
 * GET
 * /api/admin/popup
 *
 * POST
 * /api/admin/popup
 *
 * PUT
 * /api/admin/popup/:id
 *
 * PATCH
 * /api/admin/popup/:id/status
 *
 * DELETE
 * /api/admin/popup/:id
 */


/* ---------------------------------------------------------
   PUBLIC POPUP
--------------------------------------------------------- */

app.use(
  '/api/popup',
  publicPopupRouter
);


/* ---------------------------------------------------------
   ADMIN POPUP
--------------------------------------------------------- */

app.use(
  '/api/admin/popup',
  adminPopupRouter
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


    /* =====================================================
       CORS ERROR
    ===================================================== */

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


    /* =====================================================
       MULTER / FILE SIZE
    ===================================================== */

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


    /* =====================================================
       DEFAULT ERROR
    ===================================================== */

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
      `Server running on port ${PORT}`
    );

    console.log(
      `Health endpoint: /api/health`
    );

    console.log(
      `Uploads endpoint: /uploads`
    );

    console.log(
      `Public Popup: /api/popup`
    );

    console.log(
      `Admin Popup: /api/admin/popup`
    );

    console.log(
      '========================================'
    );

    console.log('');

    console.log(
      'Allowed CORS origins:'
    );

    uniqueAllowedOrigins.forEach(
      (origin) => {
        console.log(
          ` - ${origin}`
        );
      }
    );

    console.log('');

  }
);