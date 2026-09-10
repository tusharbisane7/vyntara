import express from 'express';

import sql from '../config/db.js';

const router = express.Router();


/* =========================================================
   GET ACTIVE WEBSITE POPUP

   GET /api/popup
========================================================= */

router.get(
  '/',
  async (req, res) => {

    try {

      const rows = await sql`
        SELECT
          id,
          title,
          description,
          image_url,
          button_text,
          button_url,
          button_enabled,
          is_active,
          display_frequency,
          start_date,
          end_date,
          created_at,
          updated_at

        FROM website_popups

        WHERE is_active = TRUE

        AND (
          start_date IS NULL
          OR start_date <= NOW()
        )

        AND (
          end_date IS NULL
          OR end_date >= NOW()
        )

        ORDER BY created_at DESC

        LIMIT 1
      `;


      if (!rows.length) {

        return res.status(200).json({
          success: true,
          popup: null
        });

      }


      return res.status(200).json({
        success: true,
        popup: rows[0]
      });

    } catch (error) {

      console.error(
        'Public popup error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Failed to load website popup.'
      });

    }

  }
);


export default router;