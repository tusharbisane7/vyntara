import express from 'express';

import sql from '../config/db.js';


const router = express.Router();


/* =========================================================
   PUBLIC TESTIMONIALS
   GET ONLY
   NO AUTHENTICATION
========================================================= */

router.get('/', async (req, res) => {

  try {

    const testimonials = await sql`
      SELECT
        id,
        name,
        organization,
        rating,
        description
      FROM testimonials
      WHERE is_active = true
      ORDER BY created_at DESC
    `;


    return res.status(200).json({
      success: true,
      testimonials
    });

  } catch (error) {

    console.error(
      'Public testimonials error:',
      error
    );


    return res.status(500).json({
      success: false,
      message:
        'Unable to load testimonials.'
    });

  }

});


export default router;