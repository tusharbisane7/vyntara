import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import sql from '../config/db.js';

import {
  authenticateAdmin
} from '../middleware/auth.js';

const router = express.Router();

/*
|--------------------------------------------------------------------------
| ADMIN LOGIN
|--------------------------------------------------------------------------
*/

router.post('/login', async (req, res) => {
  try {
    const {
      username,
      password
    } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message:
          'Username and password are required.'
      });
    }

    const admins = await sql`
      SELECT
        id,
        username,
        password_hash
      FROM admins
      WHERE username = ${username}
      LIMIT 1
    `;

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message:
          'Invalid username or password.'
      });
    }

    const admin = admins[0];

    const passwordValid =
      await bcrypt.compare(
        password,
        admin.password_hash
      );

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message:
          'Invalid username or password.'
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message:
          'JWT_SECRET is not configured.'
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: 'admin'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d'
      }
    );

    return res.json({
      success: true,
      message: 'Login successful.',

      token,

      admin: {
        id: admin.id,
        username: admin.username,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error(
      'Admin login error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Unable to login.'
    });
  }
});


/*
|--------------------------------------------------------------------------
| CURRENT ADMIN
|--------------------------------------------------------------------------
*/

router.get(
  '/me',
  authenticateAdmin,
  async (req, res) => {

    try {

      const admins = await sql`
        SELECT
          id,
          username,
          created_at
        FROM admins
        WHERE id = ${req.admin.id}
        LIMIT 1
      `;

      if (admins.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            'Admin account not found.'
        });
      }

      return res.json({
        success: true,
        admin: {
          id: admins[0].id,
          username: admins[0].username,
          role: 'admin',
          created_at:
            admins[0].created_at
        }
      });

    } catch (error) {

      console.error(
        'Get admin error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to fetch admin.'
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| UPDATE ADMIN NAME
|--------------------------------------------------------------------------
*/

router.patch(
  '/profile',
  authenticateAdmin,
  async (req, res) => {

    try {

      const {
        username
      } = req.body;

      if (
        !username ||
        !username.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Admin name cannot be empty.'
        });
      }

      const cleanUsername =
        username.trim();

      if (
        cleanUsername.length < 3
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Admin name must contain at least 3 characters.'
        });
      }

      const existing = await sql`
        SELECT id
        FROM admins
        WHERE username = ${cleanUsername}
        AND id != ${req.admin.id}
        LIMIT 1
      `;

      if (existing.length > 0) {
        return res.status(409).json({
          success: false,
          message:
            'This admin name is already in use.'
        });
      }

      const result = await sql`
        UPDATE admins
        SET username = ${cleanUsername}
        WHERE id = ${req.admin.id}
        RETURNING
          id,
          username,
          created_at
      `;

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            'Admin account not found.'
        });
      }

      /*
      |--------------------------------------------------------------------------
      | NEW TOKEN
      |--------------------------------------------------------------------------
      */

      const newToken = jwt.sign(
        {
          id: result[0].id,
          username: result[0].username,
          role: 'admin'
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1d'
        }
      );

      return res.json({
        success: true,
        message:
          'Admin name updated successfully.',

        token: newToken,

        admin: {
          id: result[0].id,
          username:
            result[0].username,
          role: 'admin'
        }
      });

    } catch (error) {

      console.error(
        'Update profile error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to update admin name.'
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| CHANGE PASSWORD
|--------------------------------------------------------------------------
*/

router.patch(
  '/password',
  authenticateAdmin,
  async (req, res) => {

    try {

      const {
        currentPassword,
        newPassword
      } = req.body;

      if (
        !currentPassword ||
        !newPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Current and new passwords are required.'
        });
      }

      if (
        newPassword.length < 6
      ) {
        return res.status(400).json({
          success: false,
          message:
            'New password must contain at least 6 characters.'
        });
      }

      const admins = await sql`
        SELECT
          id,
          password_hash
        FROM admins
        WHERE id = ${req.admin.id}
        LIMIT 1
      `;

      if (admins.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            'Admin account not found.'
        });
      }

      const passwordValid =
        await bcrypt.compare(
          currentPassword,
          admins[0].password_hash
        );

      if (!passwordValid) {
        return res.status(401).json({
          success: false,
          message:
            'Current password is incorrect.'
        });
      }

      const newPasswordHash =
        await bcrypt.hash(
          newPassword,
          12
        );

      await sql`
        UPDATE admins
        SET password_hash = ${newPasswordHash}
        WHERE id = ${req.admin.id}
      `;

      return res.json({
        success: true,
        message:
          'Password changed successfully.'
      });

    } catch (error) {

      console.error(
        'Change password error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to change password.'
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| DASHBOARD STATISTICS
|--------------------------------------------------------------------------
*/

router.get(
  '/stats',
  authenticateAdmin,
  async (req, res) => {

    try {

      const totalResult = await sql`
        SELECT COUNT(*)::int AS count
        FROM project_requests
      `;

      const newResult = await sql`
        SELECT COUNT(*)::int AS count
        FROM project_requests
        WHERE status = 'new'
      `;

      const contactedResult = await sql`
        SELECT COUNT(*)::int AS count
        FROM project_requests
        WHERE status = 'contacted'
      `;

      const inProgressResult = await sql`
        SELECT COUNT(*)::int AS count
        FROM project_requests
        WHERE status = 'in_progress'
      `;

      const completedResult = await sql`
        SELECT COUNT(*)::int AS count
        FROM project_requests
        WHERE status = 'completed'
      `;

      const cancelledResult = await sql`
        SELECT COUNT(*)::int AS count
        FROM project_requests
        WHERE status = 'cancelled'
      `;

      return res.json({
        success: true,

        stats: {
          total:
            totalResult[0].count,

          new:
            newResult[0].count,

          contacted:
            contactedResult[0].count,

          inProgress:
            inProgressResult[0].count,

          completed:
            completedResult[0].count,

          cancelled:
            cancelledResult[0].count
        }
      });

    } catch (error) {

      console.error(
        'Statistics error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to fetch statistics.'
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| GET ALL PROJECT REQUESTS
|--------------------------------------------------------------------------
*/

router.get(
  '/projects',
  authenticateAdmin,
  async (req, res) => {

    try {

      const projects = await sql`
        SELECT
          id,
          full_name,
          email,
          phone,
          company,
          project_type,
          budget,
          timeline,
          project_description,
          status,
          created_at,
          updated_at

        FROM project_requests

        ORDER BY created_at DESC
      `;

      return res.json({
        success: true,
        count: projects.length,
        projects
      });

    } catch (error) {

      console.error(
        'Get projects error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to fetch projects.'
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| GET SINGLE PROJECT
|--------------------------------------------------------------------------
*/

router.get(
  '/projects/:id',
  authenticateAdmin,
  async (req, res) => {

    try {

      const { id } = req.params;

      const projects = await sql`
        SELECT *
        FROM project_requests
        WHERE id = ${id}
        LIMIT 1
      `;

      if (projects.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            'Project request not found.'
        });
      }

      return res.json({
        success: true,
        project: projects[0]
      });

    } catch (error) {

      console.error(
        'Get project error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to fetch project.'
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| UPDATE PROJECT STATUS
|--------------------------------------------------------------------------
*/

router.patch(
  '/projects/:id/status',
  authenticateAdmin,
  async (req, res) => {

    try {

      const { id } = req.params;
      const { status } = req.body;

      const allowedStatuses = [
        'new',
        'contacted',
        'in_progress',
        'completed',
        'cancelled'
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Invalid project status.'
        });
      }

      const result = await sql`
        UPDATE project_requests

        SET
          status = ${status},
          updated_at =
            CURRENT_TIMESTAMP

        WHERE id = ${id}

        RETURNING *
      `;

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            'Project request not found.'
        });
      }

      return res.json({
        success: true,
        message:
          'Project status updated.',
        project: result[0]
      });

    } catch (error) {

      console.error(
        'Update status error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to update project status.'
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| DELETE PROJECT
|--------------------------------------------------------------------------
*/

router.delete(
  '/projects/:id',
  authenticateAdmin,
  async (req, res) => {

    try {

      const { id } = req.params;

      const result = await sql`
        DELETE FROM project_requests
        WHERE id = ${id}
        RETURNING id
      `;

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            'Project request not found.'
        });
      }

      return res.json({
        success: true,
        message:
          'Project request deleted successfully.'
      });

    } catch (error) {

      console.error(
        'Delete project error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to delete project.'
      });
    }
  }
);

export default router;