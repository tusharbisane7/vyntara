import express from 'express';

import sql from '../config/db.js';

import {
  authenticateAdmin
} from '../middleware/auth.js';

const router = express.Router();


// =========================================================
// HELPER
// =========================================================

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags
      .map((tag) =>
        String(tag).trim()
      )
      .filter(Boolean);
  }

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) =>
        tag.trim()
      )
      .filter(Boolean);
  }

  return [];
}


// =========================================================
// GET ALL JOBS
// GET /api/admin/jobs
// =========================================================

router.get(
  '/',
  authenticateAdmin,
  async (req, res) => {

    try {

      const jobs = await sql`
        SELECT
          j.id,
          j.position_name,
          j.location,
          j.employment_type,
          j.short_description,
          j.description,
          j.tags,
          j.is_active,
          j.created_at,
          j.updated_at,

          (
            SELECT COUNT(*)
            FROM job_applications a
            WHERE a.job_id = j.id
          )::integer AS application_count

        FROM jobs j

        ORDER BY j.created_at DESC
      `;


      return res.status(200).json({
        success: true,
        jobs
      });

    } catch (error) {

      console.error(
        'Admin jobs list error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to load jobs.'
      });
    }
  }
);


// =========================================================
// CREATE JOB
// POST /api/admin/jobs
// =========================================================

router.post(
  '/',
  authenticateAdmin,
  async (req, res) => {

    try {

      const {
        position_name,
        location,
        employment_type,
        short_description,
        description,
        tags,
        is_active
      } = req.body;


      // -----------------------------------------------------
      // VALIDATION
      // -----------------------------------------------------

      if (!position_name?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            'Position name is required.'
        });
      }


      if (!location?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            'Location is required.'
        });
      }


      if (!employment_type?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            'Employment type is required.'
        });
      }


      if (!short_description?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            'Short description is required.'
        });
      }


      if (!description?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            'Job description is required.'
        });
      }


      const normalizedTags =
        normalizeTags(tags);


      const active =
        typeof is_active === 'boolean'
          ? is_active
          : true;


      // -----------------------------------------------------
      // INSERT
      // -----------------------------------------------------

      const result = await sql`
        INSERT INTO jobs (
          position_name,
          location,
          employment_type,
          short_description,
          description,
          tags,
          is_active
        )

        VALUES (
          ${position_name.trim()},
          ${location.trim()},
          ${employment_type.trim()},
          ${short_description.trim()},
          ${description.trim()},
          ${JSON.stringify(normalizedTags)}::jsonb,
          ${active}
        )

        RETURNING
          id,
          position_name,
          location,
          employment_type,
          short_description,
          description,
          tags,
          is_active,
          created_at,
          updated_at
      `;


      return res.status(201).json({
        success: true,
        message:
          'Job posted successfully.',
        job: result[0]
      });

    } catch (error) {

      console.error(
        'Create job error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to create job.'
      });
    }
  }
);


// =========================================================
// UPDATE JOB
// PUT /api/admin/jobs/:id
// =========================================================

router.put(
  '/:id',
  authenticateAdmin,
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const {
        position_name,
        location,
        employment_type,
        short_description,
        description,
        tags,
        is_active
      } = req.body;


      if (!position_name?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            'Position name is required.'
        });
      }


      if (!location?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            'Location is required.'
        });
      }


      if (!employment_type?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            'Employment type is required.'
        });
      }


      if (!short_description?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            'Short description is required.'
        });
      }


      if (!description?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            'Job description is required.'
        });
      }


      const normalizedTags =
        normalizeTags(tags);


      const result = await sql`
        UPDATE jobs

        SET
          position_name =
            ${position_name.trim()},

          location =
            ${location.trim()},

          employment_type =
            ${employment_type.trim()},

          short_description =
            ${short_description.trim()},

          description =
            ${description.trim()},

          tags =
            ${JSON.stringify(normalizedTags)}::jsonb,

          is_active =
            ${typeof is_active === 'boolean'
              ? is_active
              : true},

          updated_at =
            NOW()

        WHERE id = ${id}

        RETURNING
          id,
          position_name,
          location,
          employment_type,
          short_description,
          description,
          tags,
          is_active,
          created_at,
          updated_at
      `;


      if (!result.length) {
        return res.status(404).json({
          success: false,
          message:
            'Job not found.'
        });
      }


      return res.status(200).json({
        success: true,
        message:
          'Job updated successfully.',
        job: result[0]
      });

    } catch (error) {

      console.error(
        'Update job error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to update job.'
      });
    }
  }
);


// =========================================================
// TOGGLE JOB
// PATCH /api/admin/jobs/:id/status
// =========================================================

router.patch(
  '/:id/status',
  authenticateAdmin,
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const is_active =
        req.body.is_active === true ||
        req.body.is_active === 'true';


      const result = await sql`
        UPDATE jobs

        SET
          is_active = ${is_active},
          updated_at = NOW()

        WHERE id = ${id}

        RETURNING
          id,
          position_name,
          location,
          employment_type,
          short_description,
          description,
          tags,
          is_active,
          created_at,
          updated_at
      `;


      if (!result.length) {
        return res.status(404).json({
          success: false,
          message:
            'Job not found.'
        });
      }


      return res.status(200).json({
        success: true,

        message:
          is_active
            ? 'Job activated successfully.'
            : 'Job deactivated successfully.',

        job: result[0]
      });

    } catch (error) {

      console.error(
        'Toggle job error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to update job status.'
      });
    }
  }
);


// =========================================================
// DELETE JOB
// DELETE /api/admin/jobs/:id
// =========================================================

router.delete(
  '/:id',
  authenticateAdmin,
  async (req, res) => {

    try {

      const { id } =
        req.params;


      const result = await sql`
        DELETE FROM jobs

        WHERE id = ${id}

        RETURNING id
      `;


      if (!result.length) {
        return res.status(404).json({
          success: false,
          message:
            'Job not found.'
        });
      }


      return res.status(200).json({
        success: true,
        message:
          'Job deleted successfully.'
      });

    } catch (error) {

      console.error(
        'Delete job error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to delete job.'
      });
    }
  }
);


export default router;