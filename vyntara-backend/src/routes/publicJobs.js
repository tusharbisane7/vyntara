import express from 'express';
import sql from '../config/db.js';

const router = express.Router();


// GET /api/jobs

router.get('/', async (req, res) => {
  try {
    const jobs = await sql`
      SELECT
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

      FROM jobs

      WHERE is_active = TRUE

      ORDER BY created_at DESC
    `;

    res.json({
      success: true,
      jobs
    });

  } catch (error) {
    console.error(
      'Public jobs error:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        'Unable to load jobs.'
    });
  }
});


// GET /api/jobs/:id

router.get('/:id', async (req, res) => {
  try {
    const result = await sql`
      SELECT
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

      FROM jobs

      WHERE id = ${req.params.id}
        AND is_active = TRUE

      LIMIT 1
    `;

    if (!result.length) {
      return res.status(404).json({
        success: false,
        message:
          'Job not found.'
      });
    }

    res.json({
      success: true,
      job: result[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        'Unable to load job.'
    });
  }
});


export default router;