
import express from 'express';
import sql from '../config/db.js';
import { sendSubmissionConfirmation } from '../utils/sendEmail.js';

const router = express.Router();

/*
|--------------------------------------------------------------------------
| SUBMIT PROJECT REQUEST
|--------------------------------------------------------------------------
| POST /api/projects
|--------------------------------------------------------------------------
*/

router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      projectType,
      budget,
      timeline,
      message,
    } = req.body ?? {};

    // Normalize input
    const fullName =
      typeof name === 'string' ? name.trim() : '';

    const cleanEmail =
      typeof email === 'string'
        ? email.trim().toLowerCase()
        : '';

    const cleanPhone =
      typeof phone === 'string' ? phone.trim() : null;

    const cleanCompany =
      typeof company === 'string' ? company.trim() : null;

    const cleanProjectType =
      typeof projectType === 'string'
        ? projectType.trim()
        : '';

    const cleanBudget =
      typeof budget === 'string' ? budget.trim() : null;

    const cleanTimeline =
      typeof timeline === 'string' ? timeline.trim() : null;

    const projectDescription =
      typeof message === 'string' ? message.trim() : '';

    // Required field validation
    if (
      !fullName ||
      !cleanEmail ||
      !cleanProjectType ||
      !projectDescription
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields.',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    // Length validation
    if (fullName.length > 150) {
      return res.status(400).json({
        success: false,
        message: 'Name is too long.',
      });
    }

    if (cleanEmail.length > 254) {
      return res.status(400).json({
        success: false,
        message: 'Email address is too long.',
      });
    }

    if (projectDescription.length > 10000) {
      return res.status(400).json({
        success: false,
        message: 'Project description is too long.',
      });
    }

    // Save the enquiry in Neon PostgreSQL first.
    const result = await sql`
      INSERT INTO project_requests (
        full_name,
        email,
        phone,
        company,
        project_type,
        budget,
        timeline,
        project_description,
        status
      )
      VALUES (
        ${fullName},
        ${cleanEmail},
        ${cleanPhone || null},
        ${cleanCompany || null},
        ${cleanProjectType},
        ${cleanBudget || null},
        ${cleanTimeline || null},
        ${projectDescription},
        'new'
      )
      RETURNING
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
        created_at
    `;

    const project = result[0];

    // Return success immediately after the database insert.
    // The client does not wait for the email provider.
    res.status(201).json({
      success: true,
      message: 'Project request submitted successfully.',
      project,
    });

    // Send confirmation in the background.
    // Email failure must not change the successful submission.
    void sendSubmissionConfirmation({
      to: cleanEmail,
      name: fullName,
      kind: 'enquiry',
      reference: String(project.id),
    }).catch((emailError) => {
      console.error(
        'Project enquiry confirmation email failed:',
        emailError
      );
    });
  } catch (error) {
    console.error('Project submission error:', error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'Unable to submit project request.',
      });
    }
  }
});

export default router;
