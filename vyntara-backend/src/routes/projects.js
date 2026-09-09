import express from 'express';
import sql from '../config/db.js';

const router = express.Router();

/*
|--------------------------------------------------------------------------
| SUBMIT PROJECT REQUEST
|--------------------------------------------------------------------------
|
| Frontend ProjectForm sends:
|
| name
| email
| phone
| company
| projectType
| budget
| timeline
| message
|
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
      message
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | NORMALIZE INPUT
    |--------------------------------------------------------------------------
    */

    const fullName = typeof name === 'string'
      ? name.trim()
      : '';

    const cleanEmail = typeof email === 'string'
      ? email.trim().toLowerCase()
      : '';

    const cleanPhone = typeof phone === 'string'
      ? phone.trim()
      : null;

    const cleanCompany = typeof company === 'string'
      ? company.trim()
      : null;

    const cleanProjectType = typeof projectType === 'string'
      ? projectType.trim()
      : '';

    const cleanBudget = typeof budget === 'string'
      ? budget.trim()
      : null;

    const cleanTimeline = typeof timeline === 'string'
      ? timeline.trim()
      : null;

    const projectDescription = typeof message === 'string'
      ? message.trim()
      : '';

    /*
    |--------------------------------------------------------------------------
    | REQUIRED FIELD VALIDATION
    |--------------------------------------------------------------------------
    */

    if (
      !fullName ||
      !cleanEmail ||
      !cleanProjectType ||
      !projectDescription
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields.'
      });
    }

    /*
    |--------------------------------------------------------------------------
    | EMAIL VALIDATION
    |--------------------------------------------------------------------------
    */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    /*
    |--------------------------------------------------------------------------
    | BASIC LENGTH VALIDATION
    |--------------------------------------------------------------------------
    */

    if (fullName.length > 150) {
      return res.status(400).json({
        success: false,
        message: 'Name is too long.'
      });
    }

    if (cleanEmail.length > 254) {
      return res.status(400).json({
        success: false,
        message: 'Email address is too long.'
      });
    }

    if (projectDescription.length > 10000) {
      return res.status(400).json({
        success: false,
        message: 'Project description is too long.'
      });
    }

    /*
    |--------------------------------------------------------------------------
    | INSERT INTO NEON POSTGRESQL
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | SUCCESS RESPONSE
    |--------------------------------------------------------------------------
    */

    return res.status(201).json({
      success: true,
      message: 'Project request submitted successfully.',
      project: result[0]
    });

  } catch (error) {
    console.error(
      'Project submission error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Unable to submit project request.'
    });
  }
});

export default router;