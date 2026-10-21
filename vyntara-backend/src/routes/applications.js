
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import sql from '../config/db.js';
import { sendSubmissionConfirmation } from '../utils/sendEmail.js';

import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// =========================================================
// RESUME DIRECTORY
// =========================================================

const resumeDirectory = path.resolve('uploads/resumes');

fs.mkdirSync(resumeDirectory, {
  recursive: true,
});

// =========================================================
// FILE UPLOAD CONFIGURATION
// =========================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumeDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const filename = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}${extension}`;

    cb(null, filename);
  },
});

const allowedExtensions = ['.pdf', '.doc', '.docx'];

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    const error = new Error(
      'Only PDF, DOC and DOCX files are allowed.'
    );

    error.status = 400;
    return cb(error);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// =========================================================
// HELPERS
// =========================================================

function removeUploadedFile(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return;
  }

  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error('Resume cleanup error:', error);
  }
}

function generateApplicationNumber() {
  const date = new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, '');

  const random = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  return `VYN-${date}-${random}`;
}

function normalizeSkills(skills) {
  if (Array.isArray(skills)) {
    return skills
      .map((skill) => String(skill).trim())
      .filter(Boolean);
  }

  if (typeof skills === 'string') {
    try {
      const parsed = JSON.parse(skills);

      if (Array.isArray(parsed)) {
        return parsed
          .map((skill) => String(skill).trim())
          .filter(Boolean);
      }
    } catch {
      // Treat non-JSON input as a comma-separated list.
    }

    return skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [];
}

// =========================================================
// PUBLIC
// POST /api/jobs/:id/applications
// =========================================================

router.post(
  '/jobs/:id/applications',
  upload.single('resume'),
  async (req, res) => {
    let uploadedFile = req.file?.path ?? null;
    let applicationSaved = false;

    try {
      const jobId = req.params.id;

      const {
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        gender,
        current_location,
        current_job_title,
        experience,
        highest_qualification,
        university,
        graduation_year,
        current_company,
        expected_salary,
        notice_period,
        skills,
        linkedin_url,
        github_url,
        portfolio_url,
        cover_letter,
        consent,
      } = req.body;

      // -----------------------------------------------------
      // REQUIRED FIELDS
      // -----------------------------------------------------

      if (
        typeof first_name !== 'string' ||
        !first_name.trim() ||
        typeof last_name !== 'string' ||
        !last_name.trim() ||
        typeof email !== 'string' ||
        !email.trim() ||
        typeof phone !== 'string' ||
        !phone.trim()
      ) {
        removeUploadedFile(uploadedFile);

        return res.status(400).json({
          success: false,
          message:
            'First name, last name, email and phone are required.',
        });
      }

      const cleanFirstName = first_name.trim();
      const cleanLastName = last_name.trim();
      const cleanEmail = email.trim().toLowerCase();
      const cleanPhone = phone.trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(cleanEmail)) {
        removeUploadedFile(uploadedFile);

        return res.status(400).json({
          success: false,
          message: 'Please enter a valid email address.',
        });
      }

      if (cleanEmail.length > 254) {
        removeUploadedFile(uploadedFile);

        return res.status(400).json({
          success: false,
          message: 'Email address is too long.',
        });
      }

      if (cleanFirstName.length > 150 || cleanLastName.length > 150) {
        removeUploadedFile(uploadedFile);

        return res.status(400).json({
          success: false,
          message: 'Name is too long.',
        });
      }

      // -----------------------------------------------------
      // CONSENT
      // -----------------------------------------------------

      const hasConsent =
        consent === true ||
        consent === 'true' ||
        consent === '1' ||
        consent === 'on';

      if (!hasConsent) {
        removeUploadedFile(uploadedFile);

        return res.status(400).json({
          success: false,
          message: 'You must agree to the application consent.',
        });
      }

      // -----------------------------------------------------
      // CHECK JOB
      // -----------------------------------------------------

      const jobResult = await sql`
        SELECT id, position_name, is_active
        FROM jobs
        WHERE id = ${jobId}
        LIMIT 1
      `;

      if (!jobResult.length) {
        removeUploadedFile(uploadedFile);

        return res.status(404).json({
          success: false,
          message: 'Job not found.',
        });
      }

      if (!jobResult[0].is_active) {
        removeUploadedFile(uploadedFile);

        return res.status(400).json({
          success: false,
          message: 'This job is no longer accepting applications.',
        });
      }

      // -----------------------------------------------------
      // RESUME REQUIRED
      // -----------------------------------------------------

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload your resume.',
        });
      }

      const resumeUrl = `/uploads/resumes/${req.file.filename}`;
      const normalizedSkills = normalizeSkills(skills);

      // -----------------------------------------------------
      // SAVE APPLICATION
      // -----------------------------------------------------

      let application = null;
      let attempts = 0;

      while (!application && attempts < 10) {
        attempts++;

        const applicationNumber = generateApplicationNumber();

        try {
          const result = await sql`
            INSERT INTO job_applications (
              application_number,
              job_id,
              first_name,
              last_name,
              email,
              phone,
              date_of_birth,
              gender,
              current_location,
              current_job_title,
              experience,
              highest_qualification,
              university,
              graduation_year,
              current_company,
              expected_salary,
              notice_period,
              skills,
              linkedin_url,
              github_url,
              portfolio_url,
              resume_url,
              resume_original_name,
              cover_letter,
              status
            )
            VALUES (
              ${applicationNumber},
              ${jobId},
              ${cleanFirstName},
              ${cleanLastName},
              ${cleanEmail},
              ${cleanPhone},
              ${date_of_birth || null},
              ${gender || null},
              ${current_location || null},
              ${current_job_title || null},
              ${experience || null},
              ${highest_qualification || null},
              ${university || null},
              ${graduation_year || null},
              ${current_company || null},
              ${expected_salary || null},
              ${notice_period || null},
              ${JSON.stringify(normalizedSkills)}::jsonb,
              ${linkedin_url || null},
              ${github_url || null},
              ${portfolio_url || null},
              ${resumeUrl},
              ${req.file.originalname},
              ${cover_letter || null},
              'new'
            )
            RETURNING
              id,
              application_number,
              job_id,
              first_name,
              last_name,
              email,
              created_at
          `;

          application = result[0];
        } catch (error) {
          // Retry only for a unique application-number collision.
          if (error.code === '23505' && attempts < 10) {
            continue;
          }

          throw error;
        }
      }

      if (!application) {
        throw new Error('Unable to generate application number.');
      }

      applicationSaved = true;

      // -----------------------------------------------------
      // RESPOND IMMEDIATELY
      // -----------------------------------------------------
      // The database insert has succeeded.
      // Do not wait for the email provider.

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully.',
        applicationNumber: application.application_number,
        application,
      });

      // -----------------------------------------------------
      // SEND CONFIRMATION EMAIL IN THE BACKGROUND
      // -----------------------------------------------------
      // Email failure must not change the successful response.

      void sendSubmissionConfirmation({
        to: application.email,
        name: `${application.first_name} ${application.last_name}`,
        kind: 'application',
        reference: application.application_number,
        position: jobResult[0].position_name,
      }).catch((emailError) => {
        console.error(
          'Job application confirmation email failed:',
          emailError
        );
      });
    } catch (error) {
      console.error('Application submission error:', error);

      // Remove the uploaded resume only if the application
      // was not saved successfully.
      if (!applicationSaved) {
        removeUploadedFile(uploadedFile);
      }

      if (res.headersSent) {
        return;
      }

      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'Resume must be smaller than 5 MB.',
          });
        }
      }

      if (error.status === 400) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Unable to submit application.',
      });
    }
  }
);

// =========================================================
// ADMIN
// GET /api/admin/applications
// =========================================================

router.get(
  '/admin/applications',
  authenticateAdmin,
  async (req, res) => {
    try {
      const { status, search, job_id } = req.query;

      const applications = await sql`
        SELECT
          a.id,
          a.application_number,
          a.job_id,
          a.first_name,
          a.last_name,
          a.email,
          a.phone,
          a.date_of_birth,
          a.gender,
          a.current_location,
          a.current_job_title,
          a.experience,
          a.highest_qualification,
          a.university,
          a.graduation_year,
          a.current_company,
          a.expected_salary,
          a.notice_period,
          a.skills,
          a.linkedin_url,
          a.github_url,
          a.portfolio_url,
          a.resume_url,
          a.resume_original_name,
          a.cover_letter,
          a.status,
          a.created_at,
          a.updated_at,
          j.position_name,
          j.location,
          j.employment_type
        FROM job_applications a
        INNER JOIN jobs j ON j.id = a.job_id
        WHERE
          (
            ${!status || status === 'all'}
            OR a.status = ${status}
          )
          AND (
            ${!job_id}
            OR a.job_id = ${job_id}
          )
          AND (
            ${!search}
            OR a.first_name ILIKE ${`%${search || ''}%`}
            OR a.last_name ILIKE ${`%${search || ''}%`}
            OR a.email ILIKE ${`%${search || ''}%`}
            OR a.phone ILIKE ${`%${search || ''}%`}
            OR a.application_number ILIKE ${`%${search || ''}%`}
            OR j.position_name ILIKE ${`%${search || ''}%`}
          )
        ORDER BY a.created_at DESC
      `;

      return res.status(200).json({
        success: true,
        applications,
      });
    } catch (error) {
      console.error('Admin applications error:', error);

      return res.status(500).json({
        success: false,
        message: 'Unable to load applications.',
      });
    }
  }
);

// =========================================================
// ADMIN
// GET /api/admin/applications/:id
// =========================================================

router.get(
  '/admin/applications/:id',
  authenticateAdmin,
  async (req, res) => {
    try {
      const result = await sql`
        SELECT
          a.*,
          j.position_name,
          j.location,
          j.employment_type,
          j.short_description
        FROM job_applications a
        INNER JOIN jobs j ON j.id = a.job_id
        WHERE a.id = ${req.params.id}
        LIMIT 1
      `;

      if (!result.length) {
        return res.status(404).json({
          success: false,
          message: 'Application not found.',
        });
      }

      return res.status(200).json({
        success: true,
        application: result[0],
      });
    } catch (error) {
      console.error('Application details error:', error);

      return res.status(500).json({
        success: false,
        message: 'Unable to load application.',
      });
    }
  }
);

// =========================================================
// ADMIN
// UPDATE APPLICATION STATUS
// PATCH /api/admin/applications/:id/status
// =========================================================

router.patch(
  '/admin/applications/:id/status',
  authenticateAdmin,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        'new',
        'reviewing',
        'shortlisted',
        'interview',
        'selected',
        'rejected',
        'withdrawn',
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid application status.',
        });
      }

      const result = await sql`
        UPDATE job_applications
        SET
          status = ${status},
          updated_at = NOW()
        WHERE id = ${req.params.id}
        RETURNING *
      `;

      if (!result.length) {
        return res.status(404).json({
          success: false,
          message: 'Application not found.',
        });
      }

      const complete = await sql`
        SELECT
          a.*,
          j.position_name,
          j.location,
          j.employment_type
        FROM job_applications a
        INNER JOIN jobs j ON j.id = a.job_id
        WHERE a.id = ${req.params.id}
        LIMIT 1
      `;

      return res.status(200).json({
        success: true,
        message: 'Application status updated successfully.',
        application: complete[0],
      });
    } catch (error) {
      console.error('Application status error:', error);

      return res.status(500).json({
        success: false,
        message: 'Unable to update application status.',
      });
    }
  }
);

// =========================================================
// ADMIN
// DELETE APPLICATION
// DELETE /api/admin/applications/:id
// =========================================================

router.delete(
  '/admin/applications/:id',
  authenticateAdmin,
  async (req, res) => {
    try {
      const result = await sql`
        DELETE FROM job_applications
        WHERE id = ${req.params.id}
        RETURNING id, resume_url
      `;

      if (!result.length) {
        return res.status(404).json({
          success: false,
          message: 'Application not found.',
        });
      }

      const resumeUrl = result[0].resume_url;

      if (resumeUrl) {
        const filename = path.basename(resumeUrl);
        const filePath = path.join(resumeDirectory, filename);

        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (fileError) {
            console.error('Resume delete error:', fileError);
          }
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Application deleted successfully.',
      });
    } catch (error) {
      console.error('Delete application error:', error);

      return res.status(500).json({
        success: false,
        message: 'Unable to delete application.',
      });
    }
  }
);

export default router;
