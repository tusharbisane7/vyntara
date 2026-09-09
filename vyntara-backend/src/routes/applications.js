import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import sql from '../config/db.js';

import {
  authenticateAdmin
} from '../middleware/auth.js';

const router = express.Router();


// =========================================================
// RESUME DIRECTORY
// =========================================================

const resumeDirectory =
  path.resolve(
    'uploads/resumes'
  );

fs.mkdirSync(
  resumeDirectory,
  {
    recursive: true
  }
);


// =========================================================
// MULTER STORAGE
// =========================================================

const storage =
  multer.diskStorage({

    destination: (
      req,
      file,
      cb
    ) => {
      cb(
        null,
        resumeDirectory
      );
    },


    filename: (
      req,
      file,
      cb
    ) => {

      const extension =
        path.extname(
          file.originalname
        ).toLowerCase();


      const filename =
        `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 10)}${extension}`;


      cb(
        null,
        filename
      );
    }

  });


// =========================================================
// FILE FILTER
// =========================================================

const allowedExtensions = [
  '.pdf',
  '.doc',
  '.docx'
];


const fileFilter = (
  req,
  file,
  cb
) => {

  const extension =
    path.extname(
      file.originalname
    ).toLowerCase();


  if (
    !allowedExtensions.includes(
      extension
    )
  ) {

    return cb(
      new Error(
        'Only PDF, DOC and DOCX files are allowed.'
      )
    );
  }


  cb(
    null,
    true
  );
};


// =========================================================
// UPLOAD
// =========================================================

const upload =
  multer({

    storage,

    fileFilter,

    limits: {
      fileSize:
        5 * 1024 * 1024
    }

  });


// =========================================================
// APPLICATION NUMBER
// =========================================================

function generateApplicationNumber() {

  const date =
    new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '');


  const random =
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();


  return `VYN-${date}-${random}`;
}


// =========================================================
// SKILLS
// =========================================================

function normalizeSkills(
  skills
) {

  if (
    Array.isArray(skills)
  ) {

    return skills
      .map((skill) =>
        String(skill).trim()
      )
      .filter(Boolean);

  }


  if (
    typeof skills === 'string'
  ) {

    try {

      const parsed =
        JSON.parse(skills);

      if (
        Array.isArray(parsed)
      ) {
        return parsed
          .map((skill) =>
            String(skill).trim()
          )
          .filter(Boolean);
      }

    } catch {
      // continue
    }


    return skills
      .split(',')
      .map((skill) =>
        skill.trim()
      )
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

    let uploadedFile = null;


    try {

      const jobId =
        req.params.id;


      // -----------------------------------------------------
      // GET FORM DATA
      // -----------------------------------------------------

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
        consent
      } = req.body;


      if (req.file) {
        uploadedFile =
          req.file.path;
      }


      // -----------------------------------------------------
      // REQUIRED FIELDS
      // -----------------------------------------------------

      if (
        !first_name?.trim() ||
        !last_name?.trim() ||
        !email?.trim() ||
        !phone?.trim()
      ) {

        return res.status(400).json({
          success: false,
          message:
            'First name, last name, email and phone are required.'
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

        return res.status(400).json({
          success: false,
          message:
            'You must agree to the application consent.'
        });
      }


      // -----------------------------------------------------
      // CHECK JOB
      // -----------------------------------------------------

      const jobResult =
        await sql`
          SELECT
            id,
            position_name,
            is_active

          FROM jobs

          WHERE id = ${jobId}

          LIMIT 1
        `;


      if (!jobResult.length) {

        return res.status(404).json({
          success: false,
          message:
            'Job not found.'
        });
      }


      if (
        !jobResult[0].is_active
      ) {

        return res.status(400).json({
          success: false,
          message:
            'This job is no longer accepting applications.'
        });
      }


      // -----------------------------------------------------
      // RESUME REQUIRED
      // -----------------------------------------------------

      if (!req.file) {

        return res.status(400).json({
          success: false,
          message:
            'Please upload your resume.'
        });
      }


      // -----------------------------------------------------
      // RESUME URL
      // -----------------------------------------------------

      const resumeUrl =
        `/uploads/resumes/${req.file.filename}`;


      // -----------------------------------------------------
      // SKILLS
      // -----------------------------------------------------

      const normalizedSkills =
        normalizeSkills(
          skills
        );


      // -----------------------------------------------------
      // APPLICATION NUMBER
      // -----------------------------------------------------

      let application = null;

      let attempts = 0;


      while (
        !application &&
        attempts < 10
      ) {

        attempts++;


        const applicationNumber =
          generateApplicationNumber();


        try {

          const result =
            await sql`

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

                ${first_name.trim()},

                ${last_name.trim()},

                ${email.trim().toLowerCase()},

                ${phone.trim()},

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

                ${JSON.stringify(
                  normalizedSkills
                )}::jsonb,

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


          application =
            result[0];


        } catch (error) {

          // Unique application number collision

          if (
            error.code === '23505' &&
            attempts < 10
          ) {
            continue;
          }


          throw error;
        }
      }


      if (!application) {

        throw new Error(
          'Unable to generate application number.'
        );
      }


      // -----------------------------------------------------
      // SUCCESS
      // -----------------------------------------------------

      return res.status(201).json({

        success: true,

        message:
          'Application submitted successfully.',

        applicationNumber:
          application.application_number,

        application

      });


    } catch (error) {

      console.error(
        'Application submission error:',
        error
      );


      // -----------------------------------------------------
      // CLEAN UP FILE
      // -----------------------------------------------------

      if (
        uploadedFile &&
        fs.existsSync(
          uploadedFile
        )
      ) {

        try {

          fs.unlinkSync(
            uploadedFile
          );

        } catch (
          removeError
        ) {

          console.error(
            'Resume cleanup error:',
            removeError
          );
        }
      }


      // -----------------------------------------------------
      // MULTER ERRORS
      // -----------------------------------------------------

      if (
        error instanceof multer.MulterError
      ) {

        if (
          error.code ===
          'LIMIT_FILE_SIZE'
        ) {

          return res.status(400).json({
            success: false,
            message:
              'Resume must be smaller than 5 MB.'
          });
        }
      }


      return res.status(500).json({
        success: false,
        message:
          error.message ||
          'Unable to submit application.'
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

      const {
        status,
        search,
        job_id
      } = req.query;


      const applications =
        await sql`

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

          INNER JOIN jobs j
            ON j.id = a.job_id

          WHERE

            (
              ${!status ||
                status === 'all'}
              OR a.status = ${status}
            )

            AND

            (
              ${!job_id}
              OR a.job_id = ${job_id}
            )

            AND

            (
              ${!search}
              OR a.first_name ILIKE ${`%${search || ''}%`}
              OR a.last_name ILIKE ${`%${search || ''}%`}
              OR a.email ILIKE ${`%${search || ''}%`}
              OR a.phone ILIKE ${`%${search || ''}%`}
              OR a.application_number ILIKE ${`%${search || ''}%`}
              OR j.position_name ILIKE ${`%${search || ''}%`}
            )

          ORDER BY
            a.created_at DESC
        `;


      return res.status(200).json({
        success: true,
        applications
      });


    } catch (error) {

      console.error(
        'Admin applications error:',
        error
      );


      return res.status(500).json({
        success: false,
        message:
          'Unable to load applications.'
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

      const result =
        await sql`

          SELECT

            a.*,

            j.position_name,

            j.location,

            j.employment_type,

            j.short_description

          FROM job_applications a

          INNER JOIN jobs j
            ON j.id = a.job_id

          WHERE a.id =
            ${req.params.id}

          LIMIT 1
        `;


      if (!result.length) {

        return res.status(404).json({
          success: false,
          message:
            'Application not found.'
        });
      }


      return res.status(200).json({
        success: true,
        application:
          result[0]
      });


    } catch (error) {

      console.error(
        'Application details error:',
        error
      );


      return res.status(500).json({
        success: false,
        message:
          'Unable to load application.'
      });
    }
  }
);


// =========================================================
// ADMIN
// UPDATE STATUS
// PATCH /api/admin/applications/:id/status
// =========================================================

router.patch(
  '/admin/applications/:id/status',
  authenticateAdmin,
  async (req, res) => {

    try {

      const {
        status
      } = req.body;


      const allowedStatuses = [
        'new',
        'reviewing',
        'shortlisted',
        'interview',
        'selected',
        'rejected',
        'withdrawn'
      ];


      if (
        !allowedStatuses.includes(
          status
        )
      ) {

        return res.status(400).json({
          success: false,
          message:
            'Invalid application status.'
        });
      }


      const result =
        await sql`

          UPDATE job_applications

          SET

            status = ${status},

            updated_at = NOW()

          WHERE id =
            ${req.params.id}

          RETURNING *
        `;


      if (!result.length) {

        return res.status(404).json({
          success: false,
          message:
            'Application not found.'
        });
      }


      // Fetch position name too
      const complete =
        await sql`

          SELECT

            a.*,

            j.position_name,

            j.location,

            j.employment_type

          FROM job_applications a

          INNER JOIN jobs j
            ON j.id = a.job_id

          WHERE a.id =
            ${req.params.id}

          LIMIT 1
        `;


      return res.status(200).json({
        success: true,
        message:
          'Application status updated successfully.',
        application:
          complete[0]
      });


    } catch (error) {

      console.error(
        'Application status error:',
        error
      );


      return res.status(500).json({
        success: false,
        message:
          'Unable to update application status.'
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

      const result =
        await sql`

          DELETE FROM job_applications

          WHERE id =
            ${req.params.id}

          RETURNING
            id,
            resume_url
        `;


      if (!result.length) {

        return res.status(404).json({
          success: false,
          message:
            'Application not found.'
        });
      }


      // -----------------------------------------------------
      // DELETE RESUME
      // -----------------------------------------------------

      const resumeUrl =
        result[0].resume_url;


      if (resumeUrl) {

        const filename =
          path.basename(
            resumeUrl
          );


        const filePath =
          path.join(
            resumeDirectory,
            filename
          );


        if (
          fs.existsSync(
            filePath
          )
        ) {

          try {

            fs.unlinkSync(
              filePath
            );

          } catch (
            fileError
          ) {

            console.error(
              'Resume delete error:',
              fileError
            );
          }
        }
      }


      return res.status(200).json({
        success: true,
        message:
          'Application deleted successfully.'
      });


    } catch (error) {

      console.error(
        'Delete application error:',
        error
      );


      return res.status(500).json({
        success: false,
        message:
          'Unable to delete application.'
      });
    }
  }
);


export default router;