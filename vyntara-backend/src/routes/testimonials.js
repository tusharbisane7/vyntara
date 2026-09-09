import express from 'express';

import sql from '../config/db.js';

import {
  authenticateAdmin
} from '../middleware/auth.js';


const router =
  express.Router();


/* =========================================================
   GET TESTIMONIALS
========================================================= */

router.get(
  '/',
  authenticateAdmin,
  async (req, res) => {

    try {

      const testimonials =
        await sql`
          SELECT
            id,
            name,
            organization,
            rating,
            description,
            is_active,
            created_at,
            updated_at
          FROM testimonials
          ORDER BY
            created_at DESC
        `;


      return res.json({
        success: true,
        testimonials
      });

    } catch (error) {

      console.error(
        'Get testimonials error:',
        error
      );


      return res.status(500).json({
        success: false,
        message:
          'Unable to load testimonials.'
      });

    }

  }
);


/* =========================================================
   ADD TESTIMONIAL
========================================================= */

router.post(
  '/',
  authenticateAdmin,
  async (req, res) => {

    try {

      const {
        name,
        organization,
        rating,
        description,
        is_active
      } = req.body;


      const cleanName =
        typeof name === 'string'
          ? name.trim()
          : '';


      const cleanOrganization =
        typeof organization === 'string'
          ? organization.trim()
          : '';


      const cleanDescription =
        typeof description === 'string'
          ? description.trim()
          : '';


      const cleanRating =
        Number(rating);


      if (
        !cleanName ||
        !cleanOrganization ||
        !cleanDescription
      ) {

        return res.status(400).json({
          success: false,
          message:
            'Name, organization and description are required.'
        });

      }


      if (
        !Number.isInteger(
          cleanRating
        ) ||
        cleanRating < 1 ||
        cleanRating > 5
      ) {

        return res.status(400).json({
          success: false,
          message:
            'Rating must be between 1 and 5.'
        });

      }


      const result =
        await sql`
          INSERT INTO testimonials (
            name,
            organization,
            rating,
            description,
            is_active
          )
          VALUES (
            ${cleanName},
            ${cleanOrganization},
            ${cleanRating},
            ${cleanDescription},
            ${is_active !== false}
          )
          RETURNING
            id,
            name,
            organization,
            rating,
            description,
            is_active,
            created_at,
            updated_at
        `;


      return res.status(201).json({
        success: true,
        message:
          'Testimonial added successfully.',
        testimonial:
          result[0]
      });

    } catch (error) {

      console.error(
        'Add testimonial error:',
        error
      );


      return res.status(500).json({
        success: false,
        message:
          'Unable to add testimonial.'
      });

    }

  }
);


/* =========================================================
   UPDATE TESTIMONIAL
========================================================= */

router.patch(
  '/:id',
  authenticateAdmin,
  async (req, res) => {

    try {

      const testimonialId =
        Number(req.params.id);


      if (
        !Number.isInteger(
          testimonialId
        )
      ) {

        return res.status(400).json({
          success: false,
          message:
            'Invalid testimonial ID.'
        });

      }


      const existing =
        await sql`
          SELECT *
          FROM testimonials
          WHERE id =
            ${testimonialId}
          LIMIT 1
        `;


      if (
        existing.length === 0
      ) {

        return res.status(404).json({
          success: false,
          message:
            'Testimonial not found.'
        });

      }


      const current =
        existing[0];


      const name =
        req.body.name !== undefined
          ? String(
              req.body.name
            ).trim()
          : current.name;


      const organization =
        req.body.organization !== undefined
          ? String(
              req.body.organization
            ).trim()
          : current.organization;


      const description =
        req.body.description !== undefined
          ? String(
              req.body.description
            ).trim()
          : current.description;


      const rating =
        req.body.rating !== undefined
          ? Number(
              req.body.rating
            )
          : Number(
              current.rating
            );


      const isActive =
        req.body.is_active !== undefined
          ? Boolean(
              req.body.is_active
            )
          : Boolean(
              current.is_active
            );


      if (
        !name ||
        !organization ||
        !description
      ) {

        return res.status(400).json({
          success: false,
          message:
            'Name, organization and description are required.'
        });

      }


      if (
        !Number.isInteger(
          rating
        ) ||
        rating < 1 ||
        rating > 5
      ) {

        return res.status(400).json({
          success: false,
          message:
            'Rating must be between 1 and 5.'
        });

      }


      const result =
        await sql`
          UPDATE testimonials
          SET
            name =
              ${name},

            organization =
              ${organization},

            rating =
              ${rating},

            description =
              ${description},

            is_active =
              ${isActive},

            updated_at =
              NOW()

          WHERE id =
            ${testimonialId}

          RETURNING
            id,
            name,
            organization,
            rating,
            description,
            is_active,
            created_at,
            updated_at
        `;


      return res.json({
        success: true,
        message:
          'Testimonial updated successfully.',
        testimonial:
          result[0]
      });

    } catch (error) {

      console.error(
        'Update testimonial error:',
        error
      );


      return res.status(500).json({
        success: false,
        message:
          'Unable to update testimonial.'
      });

    }

  }
);


/* =========================================================
   DELETE TESTIMONIAL
========================================================= */

router.delete(
  '/:id',
  authenticateAdmin,
  async (req, res) => {

    try {

      const testimonialId =
        Number(req.params.id);


      if (
        !Number.isInteger(
          testimonialId
        )
      ) {

        return res.status(400).json({
          success: false,
          message:
            'Invalid testimonial ID.'
        });

      }


      const result =
        await sql`
          DELETE FROM testimonials
          WHERE id =
            ${testimonialId}
          RETURNING id
        `;


      if (
        result.length === 0
      ) {

        return res.status(404).json({
          success: false,
          message:
            'Testimonial not found.'
        });

      }


      return res.json({
        success: true,
        message:
          'Testimonial deleted successfully.'
      });

    } catch (error) {

      console.error(
        'Delete testimonial error:',
        error
      );


      return res.status(500).json({
        success: false,
        message:
          'Unable to delete testimonial.'
      });

    }

  }
);


export default router;