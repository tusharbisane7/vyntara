import sql from '../config/db.js';
import bcrypt from 'bcryptjs';

async function initializeDatabase() {
  try {
    console.log('');
    console.log('Connecting to Neon PostgreSQL...');

    /*
    |--------------------------------------------------------------------------
    | ADMINS TABLE
    |--------------------------------------------------------------------------
    */

    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    /*
    |--------------------------------------------------------------------------
    | PROJECT REQUESTS TABLE
    |--------------------------------------------------------------------------
    */

    await sql`
      CREATE TABLE IF NOT EXISTS project_requests (
        id SERIAL PRIMARY KEY,

        full_name VARCHAR(150) NOT NULL,

        email VARCHAR(255) NOT NULL,

        phone VARCHAR(50),

        company VARCHAR(200),

        project_type VARCHAR(100) NOT NULL,

        budget VARCHAR(100),

        timeline VARCHAR(100),

        project_description TEXT NOT NULL,

        status VARCHAR(30) DEFAULT 'new',

        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    /*
    |--------------------------------------------------------------------------
    | INDEXES
    |--------------------------------------------------------------------------
    */

    await sql`
      CREATE INDEX IF NOT EXISTS idx_project_requests_status
      ON project_requests(status)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_project_requests_created_at
      ON project_requests(created_at DESC)
    `;

    /*
    |--------------------------------------------------------------------------
    | CREATE ADMIN
    |--------------------------------------------------------------------------
    */

    const username =
      process.env.ADMIN_USERNAME || 'admin1';

    const password =
      process.env.ADMIN_PASSWORD || '123';

    const existingAdmin = await sql`
      SELECT id
      FROM admins
      WHERE username = ${username}
      LIMIT 1
    `;

    if (existingAdmin.length === 0) {
      const passwordHash =
        await bcrypt.hash(password, 12);

      await sql`
        INSERT INTO admins (
          username,
          password_hash
        )
        VALUES (
          ${username},
          ${passwordHash}
        )
      `;

      console.log(
        `Admin account created: ${username}`
      );

    } else {
      console.log(
        `Admin account already exists: ${username}`
      );
    }

    console.log(
      'Database initialization completed.'
    );

  } catch (error) {
    console.error(
      'Database initialization failed:',
      error
    );

    throw error;
  }
}

export default initializeDatabase;