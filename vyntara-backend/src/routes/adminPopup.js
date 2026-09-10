import express from 'express';

import sql from '../config/db.js';

const router = express.Router();


/* =========================================================
   NORMALIZE POPUP
========================================================= */

function normalizePopup(row) {

  if (!row) {
    return null;
  }

  return {
    id: row.id,

    title: row.title || '',

    description:
      row.description || '',

    image_url:
      row.image_url || '',

    button_text:
      row.button_text || '',

    button_url:
      row.button_url || '',

    button_enabled:
      row.button_enabled !== false,

    is_active:
      row.is_active === true,

    display_frequency:
      row.display_frequency ||
      'once_per_session',

    start_date:
      row.start_date || null,

    end_date:
      row.end_date || null,

    created_at:
      row.created_at,

    updated_at:
      row.updated_at
  };

}


/* =========================================================
   GET POPUP

   GET /api/admin/popup
========================================================= */

router.get(
  '/',
  async (req, res) => {

    try {

      const rows = await sql`
        SELECT *
        FROM website_popups
        ORDER BY created_at DESC
        LIMIT 1
      `;


      return res.status(200).json({
        success: true,
        popup:
          normalizePopup(rows[0] || null)
      });

    } catch (error) {

      console.error(
        'Admin popup GET error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Failed to load popup.'
      });

    }

  }
);


/* =========================================================
   CREATE POPUP

   POST /api/admin/popup
========================================================= */

router.post(
  '/',
  async (req, res) => {

    try {

      const {
        title,
        description = '',
        image_url = null,
        button_text = '',
        button_url = '',
        button_enabled = true,
        is_active = true,
        display_frequency = 'once_per_session',
        start_date = null,
        end_date = null
      } = req.body;


      if (!title || !title.trim()) {

        return res.status(400).json({
          success: false,
          message:
            'Popup title is required.'
        });

      }


      const allowedFrequencies = [
        'every_visit',
        'once_per_session',
        'once_per_day',
        'once_per_7_days'
      ];


      if (
        !allowedFrequencies.includes(
          display_frequency
        )
      ) {

        return res.status(400).json({
          success: false,
          message:
            'Invalid display frequency.'
        });

      }


      /*
       * Only one active popup should exist.
       */

      if (is_active) {

        await sql`
          UPDATE website_popups
          SET
            is_active = FALSE,
            updated_at = NOW()
          WHERE is_active = TRUE
        `;

      }


      const rows = await sql`
        INSERT INTO website_popups (
          title,
          description,
          image_url,
          button_text,
          button_url,
          button_enabled,
          is_active,
          display_frequency,
          start_date,
          end_date
        )

        VALUES (
          ${title.trim()},
          ${description},
          ${image_url || null},
          ${button_text || ''},
          ${button_url || ''},
          ${button_enabled !== false},
          ${is_active === true},
          ${display_frequency},
          ${start_date || null},
          ${end_date || null}
        )

        RETURNING *
      `;


      return res.status(201).json({
        success: true,
        message:
          'Popup created successfully.',
        popup:
          normalizePopup(rows[0])
      });

    } catch (error) {

      console.error(
        'Admin popup POST error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Failed to create popup.'
      });

    }

  }
);


/* =========================================================
   UPDATE POPUP

   PUT /api/admin/popup/:id
========================================================= */

router.put(
  '/:id',
  async (req, res) => {

    try {

      const {
        id
      } = req.params;


      const {
        title,
        description = '',
        image_url = null,
        button_text = '',
        button_url = '',
        button_enabled = true,
        is_active = true,
        display_frequency = 'once_per_session',
        start_date = null,
        end_date = null
      } = req.body;


      if (!title || !title.trim()) {

        return res.status(400).json({
          success: false,
          message:
            'Popup title is required.'
        });

      }


      const allowedFrequencies = [
        'every_visit',
        'once_per_session',
        'once_per_day',
        'once_per_7_days'
      ];


      if (
        !allowedFrequencies.includes(
          display_frequency
        )
      ) {

        return res.status(400).json({
          success: false,
          message:
            'Invalid display frequency.'
        });

      }


      /*
       * If this popup is being activated,
       * deactivate all other active popups.
       */

      if (is_active) {

        await sql`
          UPDATE website_popups
          SET
            is_active = FALSE,
            updated_at = NOW()
          WHERE
            is_active = TRUE
            AND id <> ${id}
        `;

      }


      const rows = await sql`
        UPDATE website_popups

        SET
          title = ${title.trim()},
          description = ${description},
          image_url = ${image_url || null},
          button_text = ${button_text || ''},
          button_url = ${button_url || ''},
          button_enabled = ${button_enabled !== false},
          is_active = ${is_active === true},
          display_frequency = ${display_frequency},
          start_date = ${start_date || null},
          end_date = ${end_date || null},
          updated_at = NOW()

        WHERE id = ${id}

        RETURNING *
      `;


      if (!rows.length) {

        return res.status(404).json({
          success: false,
          message:
            'Popup not found.'
        });

      }


      return res.status(200).json({
        success: true,
        message:
          'Popup updated successfully.',
        popup:
          normalizePopup(rows[0])
      });

    } catch (error) {

      console.error(
        'Admin popup PUT error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Failed to update popup.'
      });

    }

  }
);


/* =========================================================
   CHANGE STATUS

   PATCH /api/admin/popup/:id/status
========================================================= */

router.patch(
  '/:id/status',
  async (req, res) => {

    try {

      const {
        id
      } = req.params;


      const {
        is_active
      } = req.body;


      if (
        typeof is_active !== 'boolean'
      ) {

        return res.status(400).json({
          success: false,
          message:
            'is_active must be true or false.'
        });

      }


      /*
       * Only one active popup.
       */

      if (is_active) {

        await sql`
          UPDATE website_popups

          SET
            is_active = FALSE,
            updated_at = NOW()

          WHERE
            is_active = TRUE
            AND id <> ${id}
        `;

      }


      const rows = await sql`
        UPDATE website_popups

        SET
          is_active = ${is_active},
          updated_at = NOW()

        WHERE id = ${id}

        RETURNING *
      `;


      if (!rows.length) {

        return res.status(404).json({
          success: false,
          message:
            'Popup not found.'
        });

      }


      return res.status(200).json({
        success: true,
        message:
          is_active
            ? 'Popup activated successfully.'
            : 'Popup deactivated successfully.',
        popup:
          normalizePopup(rows[0])
      });

    } catch (error) {

      console.error(
        'Admin popup status error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Failed to update popup status.'
      });

    }

  }
);


/* =========================================================
   DELETE POPUP

   DELETE /api/admin/popup/:id
========================================================= */

router.delete(
  '/:id',
  async (req, res) => {

    try {

      const {
        id
      } = req.params;


      const rows = await sql`
        DELETE FROM website_popups

        WHERE id = ${id}

        RETURNING id
      `;


      if (!rows.length) {

        return res.status(404).json({
          success: false,
          message:
            'Popup not found.'
        });

      }


      return res.status(200).json({
        success: true,
        message:
          'Popup deleted successfully.'
      });

    } catch (error) {

      console.error(
        'Admin popup DELETE error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Failed to delete popup.'
      });

    }

  }
);


export default router;