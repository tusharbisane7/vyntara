const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://vyntara-backend.onrender.com/api';


/*
|--------------------------------------------------------------------------
| GENERIC API REQUEST
|--------------------------------------------------------------------------
*/

async function apiRequest(
  endpoint,
  options = {}
) {

  const response =
    await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,

        headers: {
          ...(options.body
            ? {
                'Content-Type':
                  'application/json'
              }
            : {}),

          ...(options.headers || {})
        }
      }
    );


  let data = null;


  try {

    data =
      await response.json();

  } catch {

    data = null;

  }


  if (!response.ok) {

    throw new Error(
      data?.message ||
      `Request failed with status ${response.status}.`
    );

  }


  return data;

}


/*
|--------------------------------------------------------------------------
| ADMIN LOGIN
|--------------------------------------------------------------------------
*/

export async function adminLogin(
  username,
  password
) {

  return apiRequest(
    '/admin/login',
    {
      method: 'POST',

      body: JSON.stringify({
        username,
        password
      })
    }
  );

}


/*
|--------------------------------------------------------------------------
| SAVE ADMIN SESSION
|--------------------------------------------------------------------------
*/

export function saveAdminSession(
  data
) {

  if (!data) {
    return;
  }


  if (data.token) {

    localStorage.setItem(
      'vyntara_admin_token',
      data.token
    );

  }


  if (data.admin) {

    localStorage.setItem(
      'vyntara_admin',
      JSON.stringify(
        data.admin
      )
    );

  }

}


/*
|--------------------------------------------------------------------------
| GET ADMIN TOKEN
|--------------------------------------------------------------------------
*/

export function getAdminToken() {

  return localStorage.getItem(
    'vyntara_admin_token'
  );

}


/*
|--------------------------------------------------------------------------
| GET STORED ADMIN
|--------------------------------------------------------------------------
*/

export function getStoredAdmin() {

  const admin =
    localStorage.getItem(
      'vyntara_admin'
    );


  if (!admin) {

    return null;

  }


  try {

    return JSON.parse(admin);

  } catch {

    return null;

  }

}


/*
|--------------------------------------------------------------------------
| LOGOUT ADMIN
|--------------------------------------------------------------------------
*/

export function logoutAdmin() {

  localStorage.removeItem(
    'vyntara_admin_token'
  );


  localStorage.removeItem(
    'vyntara_admin'
  );

}


/*
|--------------------------------------------------------------------------
| AUTH HEADERS
|--------------------------------------------------------------------------
*/

function authHeaders() {

  const token =
    getAdminToken();


  return {
    'Content-Type':
      'application/json',

    ...(token
      ? {
          Authorization:
            `Bearer ${token}`
        }
      : {})
  };

}


/*
|--------------------------------------------------------------------------
| VERIFY ADMIN
|--------------------------------------------------------------------------
*/

export async function verifyAdmin() {

  const token =
    getAdminToken();


  if (!token) {

    return false;

  }


  try {

    const response =
      await fetch(
        `${API_BASE_URL}/admin/me`,
        {
          method: 'GET',

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );


    return response.ok;

  } catch {

    return false;

  }

}


/*
|--------------------------------------------------------------------------
| GET CURRENT ADMIN
|--------------------------------------------------------------------------
*/

export async function getAdmin() {

  return apiRequest(
    '/admin/me',
    {
      method: 'GET',

      headers:
        authHeaders()
    }
  );

}


/*
|--------------------------------------------------------------------------
| GET ADMIN PROFILE
|--------------------------------------------------------------------------
*/

export async function getAdminProfile() {

  return apiRequest(
    '/admin/me',
    {
      method: 'GET',

      headers:
        authHeaders()
    }
  );

}


/*
|--------------------------------------------------------------------------
| UPDATE ADMIN NAME / USERNAME
|--------------------------------------------------------------------------
*/

export async function updateAdminName(
  username
) {

  return apiRequest(
    '/admin/profile',
    {
      method: 'PATCH',

      headers:
        authHeaders(),

      body: JSON.stringify({
        username
      })
    }
  );

}


/*
|--------------------------------------------------------------------------
| CHANGE ADMIN PASSWORD
|--------------------------------------------------------------------------
*/

export async function changeAdminPassword(
  currentPassword,
  newPassword
) {

  return apiRequest(
    '/admin/password',
    {
      method: 'PATCH',

      headers:
        authHeaders(),

      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    }
  );

}


/*
|--------------------------------------------------------------------------
| GET DASHBOARD STATS
|--------------------------------------------------------------------------
*/

export async function getDashboardStats() {

  return apiRequest(
    '/admin/stats',
    {
      method: 'GET',

      headers:
        authHeaders()
    }
  );

}


/*
|--------------------------------------------------------------------------
| GET ADMIN PROJECTS
|--------------------------------------------------------------------------
*/

export async function getProjects() {

  return apiRequest(
    '/admin/projects',
    {
      method: 'GET',

      headers:
        authHeaders()
    }
  );

}


/*
|--------------------------------------------------------------------------
| UPDATE PROJECT STATUS
|--------------------------------------------------------------------------
*/

export async function updateProjectStatus(
  id,
  status
) {

  return apiRequest(
    `/admin/projects/${id}/status`,
    {
      method: 'PATCH',

      headers:
        authHeaders(),

      body: JSON.stringify({
        status
      })
    }
  );

}


/*
|--------------------------------------------------------------------------
| DELETE PROJECT
|--------------------------------------------------------------------------
*/

export async function deleteProject(
  id
) {

  return apiRequest(
    `/admin/projects/${id}`,
    {
      method: 'DELETE',

      headers:
        authHeaders()
    }
  );

}


/*
|--------------------------------------------------------------------------
| SUBMIT PROJECT REQUEST
| PUBLIC
|--------------------------------------------------------------------------
*/

export async function submitProject(
  projectData
) {

  return apiRequest(
    '/projects',
    {
      method: 'POST',

      body: JSON.stringify(
        projectData
      )
    }
  );

}


/*
|--------------------------------------------------------------------------
| GET PUBLIC TESTIMONIALS
| PUBLIC
|--------------------------------------------------------------------------
*/

export async function getPublicTestimonials() {

  return apiRequest(
    '/testimonials',
    {
      method: 'GET'
    }
  );

}


/*
|--------------------------------------------------------------------------
| GET ADMIN TESTIMONIALS
| AUTHENTICATED
|--------------------------------------------------------------------------
*/

export async function getTestimonials() {

  return apiRequest(
    '/admin/testimonials',
    {
      method: 'GET',

      headers:
        authHeaders()
    }
  );

}


/*
|--------------------------------------------------------------------------
| ADD ADMIN TESTIMONIAL
|--------------------------------------------------------------------------
*/

export async function addTestimonial(
  testimonial
) {

  return apiRequest(
    '/admin/testimonials',
    {
      method: 'POST',

      headers:
        authHeaders(),

      body: JSON.stringify(
        testimonial
      )
    }
  );

}


/*
|--------------------------------------------------------------------------
| UPDATE ADMIN TESTIMONIAL
|--------------------------------------------------------------------------
*/

export async function updateTestimonial(
  id,
  testimonial
) {

  return apiRequest(
    `/admin/testimonials/${id}`,
    {
      method: 'PATCH',

      headers:
        authHeaders(),

      body: JSON.stringify(
        testimonial
      )
    }
  );

}


/*
|--------------------------------------------------------------------------
| DELETE ADMIN TESTIMONIAL
|--------------------------------------------------------------------------
*/

export async function deleteTestimonial(
  id
) {

  return apiRequest(
    `/admin/testimonials/${id}`,
    {
      method: 'DELETE',

      headers:
        authHeaders()
    }
  );

}


/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/

export async function checkApiHealth() {

  return apiRequest(
    '/health',
    {
      method: 'GET'
    }
  );

}


/*
|--------------------------------------------------------------------------
| DEFAULT EXPORT
|--------------------------------------------------------------------------
*/

export default API_BASE_URL;