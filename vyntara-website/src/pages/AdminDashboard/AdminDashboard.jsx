import {
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Trash2,
  UserRound,
  UsersRound,
  X,
  BriefcaseBusiness,
  PlusCircle,
  ExternalLink,
  FileDown,
  Printer,
  MapPin,
  UserRoundCheck
} from 'lucide-react';

import {
  getAdmin,
  getAdminProfile,
  getAdminToken,
  getDashboardStats,
  getProjects,
  logoutAdmin,
  changeAdminPassword,
  updateAdminName,
  updateProjectStatus,
  deleteProject
} from '../../services/api';

import './AdminDashboard.css';
import vyntaraLogo from '../../assets/vyntara-logo.png';


/* =========================================================
   API BASE URL
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://vyntara-backend.onrender.com';

const getResumeUrl = (resumeUrl) => {
  if (!resumeUrl) return '';

  if (
    resumeUrl.startsWith('http://') ||
    resumeUrl.startsWith('https://')
  ) {
    return resumeUrl;
  }

  return `${API_BASE_URL}${
    resumeUrl.startsWith('/') ? '' : '/'
  }${resumeUrl}`;
};
/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function AdminDashboard() {

  /* =======================================================
     ADMIN
  ======================================================= */

  const [admin, setAdmin] =
    useState(getAdmin());


  /* =======================================================
     DASHBOARD STATS
  ======================================================= */

  const [stats, setStats] =
    useState({
      total: 0,
      new: 0,
      contacted: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0
    });


  /* =======================================================
     PROJECT ENQUIRIES
  ======================================================= */

  const [projects, setProjects] =
    useState([]);


  /* =======================================================
     TESTIMONIALS
  ======================================================= */

  const [testimonials, setTestimonials] =
    useState([]);


  const [testimonialLoading, setTestimonialLoading] =
    useState(false);


  const [testimonialSaving, setTestimonialSaving] =
    useState(false);


  const [
    testimonialModalOpen,
    setTestimonialModalOpen
  ] = useState(false);


  const [
    editingTestimonial,
    setEditingTestimonial
  ] = useState(null);


  const [
    testimonialSearch,
    setTestimonialSearch
  ] = useState('');


  const [
    testimonialStatusFilter,
    setTestimonialStatusFilter
  ] = useState('all');


  const [
    testimonialForm,
    setTestimonialForm
  ] = useState({
    name: '',
    organization: '',
    rating: 5,
    description: '',
    is_active: true
  });


  /* =======================================================
     JOBS & APPLICATIONS
  ======================================================= */

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [jobLoading, setJobLoading] = useState(false);
  const [applicationLoading, setApplicationLoading] = useState(false);

  const [jobSearch, setJobSearch] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState('all');

  const [applicationSearch, setApplicationSearch] = useState('');
  const [applicationStatusFilter, setApplicationStatusFilter] = useState('all');

  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobSaving, setJobSaving] = useState(false);

  const [selectedApplication, setSelectedApplication] = useState(null);

  const [jobForm, setJobForm] = useState({
    position_name: '',
    location: '',
    employment_type: 'Full Time',
    short_description: '',
    description: '',
    tags: '',
    is_active: true
  });


  /* =======================================================
     WEBSITE POPUP
  ======================================================= */

  const [popupLoading, setPopupLoading] = useState(false);
  const [popupSaving, setPopupSaving] = useState(false);
  const [popup, setPopup] = useState(null);
  const [popupForm, setPopupForm] = useState({
    title: 'Welcome to Vyntara Technologies',
    description: 'Digital solutions built to move your business forward.',
    image_url: '',
    button_text: 'Explore Our Services',
    button_url: '/#services',
    button_enabled: true,
    is_active: false,
    display_frequency: 'once_per_session',
    start_date: '',
    end_date: ''
  });


  /* =======================================================
     GENERAL UI
  ======================================================= */

  const [loading, setLoading] =
    useState(true);


  const [refreshing, setRefreshing] =
    useState(false);


  const [error, setError] =
    useState('');


  const [search, setSearch] =
    useState('');


  const [statusFilter, setStatusFilter] =
    useState('all');


  const [activePage, setActivePage] =
    useState('dashboard');


  const [
    selectedProject,
    setSelectedProject
  ] = useState(null);


  const [mobileMenu, setMobileMenu] =
    useState(false);


  /* =======================================================
     SETTINGS
  ======================================================= */

  const [settingsTab, setSettingsTab] =
    useState('profile');


  const [successMessage, setSuccessMessage] =
    useState('');


  const [nameInput, setNameInput] =
    useState('');


  const [
    currentPassword,
    setCurrentPassword
  ] = useState('');


  const [
    newPassword,
    setNewPassword
  ] = useState('');


  const [
    confirmPassword,
    setConfirmPassword
  ] = useState('');


  const [settingsLoading, setSettingsLoading] =
    useState(false);


  /* =======================================================
     AUTH CHECK
  ======================================================= */

  useEffect(() => {

    if (!getAdminToken()) {

      window.location.href =
        '/admin';

      return;
    }

    loadDashboard();

  }, []);


  /* =======================================================
     LOAD DASHBOARD
  ======================================================= */

  const loadDashboard = async (
    showRefresh = false
  ) => {

    try {

      setError('');

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }


      const [
        adminData,
        statsData,
        projectsData
      ] = await Promise.all([
        getAdminProfile(),
        getDashboardStats(),
        getProjects()
      ]);


      setAdmin(
        adminData.admin
      );


      setStats(
        statsData.stats
      );


      setProjects(
        projectsData.projects || []
      );


      setNameInput(
        adminData.admin.username
      );


      localStorage.setItem(
        'vyntara_admin',
        JSON.stringify(
          adminData.admin
        )
      );


      /*
        Testimonials are loaded separately so
        an unavailable testimonials endpoint
        does not break the entire dashboard.
      */

      loadTestimonials();
      loadJobs();
      loadApplications();
      loadPopup();

    } catch (err) {

      console.error(err);


      if (
        err.message?.toLowerCase().includes(
          'expired'
        ) ||
        err.message?.toLowerCase().includes(
          'token'
        )
      ) {

        logoutAdmin();

        window.location.href =
          '/admin';

        return;
      }


      setError(
        err.message ||
        'Unable to load dashboard.'
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };


  /* =======================================================
     TESTIMONIAL API HELPER
  ======================================================= */

  const testimonialRequest = async (
    endpoint,
    options = {}
  ) => {

    const token =
      getAdminToken();


    const response =
      await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
          ...options,

          headers: {
            'Content-Type':
              'application/json',

            ...(token
              ? {
                  Authorization:
                    `Bearer ${token}`
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

      if (
        response.status === 401
      ) {

        logoutAdmin();

        window.location.href =
          '/admin';

        throw new Error(
          'Your session has expired. Please login again.'
        );
      }


      throw new Error(
        data?.message ||
        'Unable to process testimonial request.'
      );
    }


    return data;

  };


  /* =======================================================
     LOAD TESTIMONIALS
  ======================================================= */

  const loadTestimonials = async () => {

    try {

      setTestimonialLoading(true);


      const data =
        await testimonialRequest(
          '/api/admin/testimonials'
        );


      setTestimonials(
        data.testimonials || []
      );

    } catch (err) {

      console.error(
        'Testimonials loading error:',
        err
      );

      /*
        Do not replace the main dashboard
        error with a testimonials error.
      */

    } finally {

      setTestimonialLoading(false);

    }
  };



  /* =======================================================
     JOB / APPLICATION API
  ======================================================= */

  const jobRequest = async (endpoint, options = {}) => {
    const token = getAdminToken();

    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token
            ? {
                Authorization:
                  `Bearer ${token}`
              }
            : {}),
          ...(options.headers || {})
        }
      }
    );

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      if (response.status === 401) {
        logoutAdmin();
        window.location.href = '/admin';

        throw new Error(
          'Your session has expired. Please login again.'
        );
      }

      throw new Error(
        data?.message ||
        'Unable to process request.'
      );
    }

    return data;
  };


  const loadJobs = async () => {
    try {
      setJobLoading(true);

      const data =
        await jobRequest(
          '/api/admin/jobs'
        );

      setJobs(
        data.jobs ||
        data.data ||
        []
      );
    } catch (err) {
      console.error(
        'Jobs loading error:',
        err
      );
    } finally {
      setJobLoading(false);
    }
  };


  const loadApplications = async () => {
    try {
      setApplicationLoading(true);

      const data =
        await jobRequest(
          '/api/admin/applications'
        );

      setApplications(
        data.applications ||
        data.data ||
        []
      );
    } catch (err) {
      console.error(
        'Applications loading error:',
        err
      );
    } finally {
      setApplicationLoading(false);
    }
  };


  const openAddJob = () => {
    setEditingJob(null);

    setJobForm({
      position_name: '',
      location: '',
      employment_type: 'Full Time',
      short_description: '',
      description: '',
      tags: '',
      is_active: true
    });

    setError('');
    setJobModalOpen(true);
  };


  const openEditJob = (job) => {
    setEditingJob(job);

    setJobForm({
      position_name:
        job.position_name || '',
      location:
        job.location || '',
      employment_type:
        job.employment_type ||
        'Full Time',
      short_description:
        job.short_description || '',
      description:
        job.description || '',
      tags:
        Array.isArray(job.tags)
          ? job.tags.join(', ')
          : typeof job.tags === 'string'
            ? job.tags
            : '',
      is_active:
        Boolean(job.is_active)
    });

    setError('');
    setJobModalOpen(true);
  };


  const closeJobModal = () => {
    if (jobSaving) return;

    setJobModalOpen(false);
    setEditingJob(null);
  };


  const handleJobChange = (event) => {
    const {
      name,
      value,
      type,
      checked
    } = event.target;

    setJobForm((current) => ({
      ...current,
      [name]:
        type === 'checkbox'
          ? checked
          : value
    }));

    if (error) {
      setError('');
    }
  };


  const handleJobSubmit = async (event) => {
    event.preventDefault();

    if (jobSaving) return;

    const position_name =
      jobForm.position_name.trim();
    const location =
      jobForm.location.trim();
    const short_description =
      jobForm.short_description.trim();
    const description =
      jobForm.description.trim();

    if (!position_name) {
      setError(
        'Please enter the position name.'
      );
      return;
    }

    if (!location) {
      setError(
        'Please enter the job location.'
      );
      return;
    }

    if (!short_description) {
      setError(
        'Please enter a short description.'
      );
      return;
    }

    if (!description) {
      setError(
        'Please enter the full job description.'
      );
      return;
    }

    const tags =
      jobForm.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

    try {
      setJobSaving(true);
      setError('');

      const payload = {
        position_name,
        location,
        employment_type:
          jobForm.employment_type,
        short_description,
        description,
        tags,
        is_active:
          Boolean(jobForm.is_active)
      };

      const data = editingJob
        ? await jobRequest(
            `/api/admin/jobs/${editingJob.id}`,
            {
              method: 'PUT',
              body:
                JSON.stringify(payload)
            }
          )
        : await jobRequest(
            '/api/admin/jobs',
            {
              method: 'POST',
              body:
                JSON.stringify(payload)
            }
          );

      if (data?.job) {
        if (editingJob) {
          setJobs((current) =>
            current.map((item) =>
              item.id === editingJob.id
                ? data.job
                : item
            )
          );
        } else {
          setJobs((current) => [
            data.job,
            ...current
          ]);
        }
      } else {
        await loadJobs();
      }

      closeJobModal();

      showSuccess(
        editingJob
          ? 'Job posting updated successfully.'
          : 'Job posted successfully.'
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        'Unable to save job posting.'
      );
    } finally {
      setJobSaving(false);
    }
  };


  const handleToggleJob = async (job) => {
    try {
      setError('');

      const data =
        await jobRequest(
          `/api/admin/jobs/${job.id}/status`,
          {
            method: 'PATCH',
            body:
              JSON.stringify({
                is_active:
                  !job.is_active
              })
          }
        );

      if (data?.job) {
        setJobs((current) =>
          current.map((item) =>
            item.id === job.id
              ? data.job
              : item
          )
        );
      } else {
        await loadJobs();
      }

      showSuccess(
        job.is_active
          ? 'Job posting deactivated.'
          : 'Job posting activated.'
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        'Unable to update job status.'
      );
    }
  };


  const handleDeleteJob = async (jobId) => {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this job posting?'
      );

    if (!confirmed) return;

    try {
      setError('');

      await jobRequest(
        `/api/admin/jobs/${jobId}`,
        {
          method: 'DELETE'
        }
      );

      setJobs((current) =>
        current.filter(
          (job) => job.id !== jobId
        )
      );

      showSuccess(
        'Job posting deleted successfully.'
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        'Unable to delete job posting.'
      );
    }
  };


  const handleApplicationStatusChange =
    async (
      applicationId,
      status
    ) => {
      try {
        setError('');

        const data =
          await jobRequest(
            `/api/admin/applications/${applicationId}/status`,
            {
              method: 'PATCH',
              body:
                JSON.stringify({
                  status
                })
            }
          );

        if (data?.application) {
          setApplications((current) =>
            current.map((item) =>
              item.id === applicationId
                ? data.application
                : item
            )
          );

          if (
            selectedApplication?.id ===
            applicationId
          ) {
            setSelectedApplication(
              data.application
            );
          }
        } else {
          await loadApplications();
        }

        showSuccess(
          'Application status updated.'
        );
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
          'Unable to update application status.'
        );
      }
    };


  const handleDeleteApplication =
    async (applicationId) => {
      const confirmed =
        window.confirm(
          'Are you sure you want to delete this application? This action cannot be undone.'
        );

      if (!confirmed) return;

      try {
        setError('');

        await jobRequest(
          `/api/admin/applications/${applicationId}`,
          {
            method: 'DELETE'
          }
        );

        setApplications((current) =>
          current.filter(
            (item) =>
              item.id !== applicationId
          )
        );

        setSelectedApplication(null);

        showSuccess(
          'Application deleted successfully.'
        );
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
          'Unable to delete application.'
        );
      }
    };


  const filteredJobs = useMemo(() => {
    const value =
      jobSearch
        .trim()
        .toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        !value ||
        job.position_name
          ?.toLowerCase()
          .includes(value) ||
        job.location
          ?.toLowerCase()
          .includes(value) ||
        job.employment_type
          ?.toLowerCase()
          .includes(value) ||
        job.short_description
          ?.toLowerCase()
          .includes(value);

      const matchesStatus =
        jobStatusFilter === 'all' ||
        (
          jobStatusFilter === 'active'
            ? job.is_active
            : !job.is_active
        );

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    jobs,
    jobSearch,
    jobStatusFilter
  ]);


  const filteredApplications =
    useMemo(() => {
      const value =
        applicationSearch
          .trim()
          .toLowerCase();

      return applications.filter(
        (application) => {
          const fullName = [
            application.first_name,
            application.last_name
          ]
            .filter(Boolean)
            .join(' ');

          const matchesSearch =
            !value ||
            fullName
              .toLowerCase()
              .includes(value) ||
            application.email
              ?.toLowerCase()
              .includes(value) ||
            application.phone
              ?.toLowerCase()
              .includes(value) ||
            application.application_number
              ?.toLowerCase()
              .includes(value) ||
            application.position_name
              ?.toLowerCase()
              .includes(value);

          const matchesStatus =
            applicationStatusFilter ===
              'all' ||
            (
              application.status ||
              'new'
            ) ===
              applicationStatusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      applications,
      applicationSearch,
      applicationStatusFilter
    ]);


  const applicationStatusLabel = (status) => {
    const labels = {
      new: 'New',
      reviewing: 'Reviewing',
      shortlisted: 'Shortlisted',
      interview: 'Interview',
      selected: 'Selected',
      rejected: 'Rejected',
      withdrawn: 'Withdrawn'
    };

    return (
      labels[status] ||
      status ||
      'New'
    );
  };


  /* =======================================================
     GREETING
  ======================================================= */

  const getGreeting = () => {

    const hour =
      new Date().getHours();


    if (hour < 12) {
      return 'Good Morning';
    }


    if (hour < 17) {
      return 'Good Afternoon';
    }


    return 'Good Evening';

  };


  /* =======================================================
     FILTER PROJECTS
  ======================================================= */

  const filteredProjects =
    useMemo(() => {

      const searchValue =
        search
          .trim()
          .toLowerCase();


      return projects.filter(
        (project) => {

          const matchesSearch =
            !searchValue ||
            project.full_name
              ?.toLowerCase()
              .includes(searchValue) ||
            project.email
              ?.toLowerCase()
              .includes(searchValue) ||
            project.company
              ?.toLowerCase()
              .includes(searchValue) ||
            project.project_type
              ?.toLowerCase()
              .includes(searchValue);


          const matchesStatus =
            statusFilter === 'all' ||
            project.status ===
              statusFilter;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      projects,
      search,
      statusFilter
    ]);


  /* =======================================================
     FILTER TESTIMONIALS
  ======================================================= */

  const filteredTestimonials =
    useMemo(() => {

      const searchValue =
        testimonialSearch
          .trim()
          .toLowerCase();


      return testimonials.filter(
        (testimonial) => {

          const matchesSearch =
            !searchValue ||
            testimonial.name
              ?.toLowerCase()
              .includes(searchValue) ||
            testimonial.organization
              ?.toLowerCase()
              .includes(searchValue) ||
            testimonial.description
              ?.toLowerCase()
              .includes(searchValue);


          const matchesStatus =
            testimonialStatusFilter ===
              'all' ||
            (
              testimonialStatusFilter ===
                'active' &&
              testimonial.is_active
            ) ||
            (
              testimonialStatusFilter ===
                'inactive' &&
              !testimonial.is_active
            );


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      testimonials,
      testimonialSearch,
      testimonialStatusFilter
    ]);


  /* =======================================================
     UPDATE PROJECT STATUS
  ======================================================= */

  const handleStatusChange =
    async (
      projectId,
      status
    ) => {

      try {

        setError('');


        await updateProjectStatus(
          projectId,
          status
        );


        setProjects(
          (current) =>
            current.map(
              (project) =>
                project.id ===
                projectId
                  ? {
                      ...project,
                      status
                    }
                  : project
            )
        );


        if (
          selectedProject?.id ===
          projectId
        ) {

          setSelectedProject(
            (current) => ({
              ...current,
              status
            })
          );

        }


        await loadDashboard(
          true
        );


        showSuccess(
          'Project status updated.'
        );

      } catch (err) {

        setError(
          err.message
        );

      }

    };


  /* =======================================================
     DELETE PROJECT
  ======================================================= */

  const handleDelete =
    async (
      projectId
    ) => {

      const confirmed =
        window.confirm(
          'Are you sure you want to delete this enquiry? This action cannot be undone.'
        );


      if (!confirmed) {
        return;
      }


      try {

        await deleteProject(
          projectId
        );


        setProjects(
          (current) =>
            current.filter(
              (project) =>
                project.id !==
                projectId
            )
        );


        setSelectedProject(
          null
        );


        await loadDashboard(
          true
        );


        showSuccess(
          'Enquiry deleted successfully.'
        );

      } catch (err) {

        setError(
          err.message
        );

      }

    };


  /* =======================================================
     OPEN ADD TESTIMONIAL
  ======================================================= */

  const openAddTestimonial = () => {

    setEditingTestimonial(
      null
    );


    setTestimonialForm({
      name: '',
      organization: '',
      rating: 5,
      description: '',
      is_active: true
    });


    setError('');


    setTestimonialModalOpen(
      true
    );

  };


  /* =======================================================
     OPEN EDIT TESTIMONIAL
  ======================================================= */

  const openEditTestimonial =
    (testimonial) => {

      setEditingTestimonial(
        testimonial
      );


      setTestimonialForm({
        name:
          testimonial.name || '',

        organization:
          testimonial.organization || '',

        rating:
          Number(
            testimonial.rating
          ) || 5,

        description:
          testimonial.description || '',

        is_active:
          Boolean(
            testimonial.is_active
          )
      });


      setError('');


      setTestimonialModalOpen(
        true
      );

    };


  /* =======================================================
     CLOSE TESTIMONIAL MODAL
  ======================================================= */

  const closeTestimonialModal =
    () => {

      if (
        testimonialSaving
      ) {
        return;
      }


      setTestimonialModalOpen(
        false
      );


      setEditingTestimonial(
        null
      );


      setTestimonialForm({
        name: '',
        organization: '',
        rating: 5,
        description: '',
        is_active: true
      });

    };


  /* =======================================================
     TESTIMONIAL FORM CHANGE
  ======================================================= */

  const handleTestimonialChange =
    (event) => {

      const {
        name,
        value,
        type,
        checked
      } = event.target;


      setTestimonialForm(
        (current) => ({
          ...current,

          [name]:
            type === 'checkbox'
              ? checked
              : name === 'rating'
                ? Number(value)
                : value
        })
      );


      if (error) {
        setError('');
      }

    };


  /* =======================================================
     SAVE TESTIMONIAL
  ======================================================= */

  const handleTestimonialSubmit =
    async (event) => {

      event.preventDefault();


      if (
        testimonialSaving
      ) {
        return;
      }


      const name =
        testimonialForm.name.trim();


      const organization =
        testimonialForm.organization.trim();


      const description =
        testimonialForm.description.trim();


      const rating =
        Number(
          testimonialForm.rating
        );


      if (!name) {

        setError(
          'Please enter the client name.'
        );

        return;

      }


      if (!organization) {

        setError(
          'Please enter the organization.'
        );

        return;

      }


      if (!description) {

        setError(
          'Please enter the testimonial description.'
        );

        return;

      }


      if (
        rating < 1 ||
        rating > 5
      ) {

        setError(
          'Rating must be between 1 and 5.'
        );

        return;

      }


      try {

        setTestimonialSaving(
          true
        );

        setError('');


        const payload = {
          name,
          organization,
          rating,
          description,
          is_active:
            Boolean(
              testimonialForm.is_active
            )
        };


        let data;


        if (
          editingTestimonial
        ) {

          data =
            await testimonialRequest(
              `/api/admin/testimonials/${editingTestimonial.id}`,
              {
                method: 'PATCH',

                body:
                  JSON.stringify(
                    payload
                  )
              }
            );


        } else {

          data =
            await testimonialRequest(
              '/api/admin/testimonials',
              {
                method: 'POST',

                body:
                  JSON.stringify(
                    payload
                  )
              }
            );

        }


        if (
          data?.testimonial
        ) {

          if (
            editingTestimonial
          ) {

            setTestimonials(
              (current) =>
                current.map(
                  (item) =>
                    item.id ===
                    editingTestimonial.id
                      ? data.testimonial
                      : item
                )
            );

          } else {

            setTestimonials(
              (current) => [
                data.testimonial,
                ...current
              ]
            );

          }

        } else {

          await loadTestimonials();

        }


        closeTestimonialModal();


        showSuccess(
          editingTestimonial
            ? 'Testimonial updated successfully.'
            : 'Testimonial added successfully.'
        );

      } catch (err) {

        console.error(err);

        setError(
          err.message ||
          'Unable to save testimonial.'
        );

      } finally {

        setTestimonialSaving(
          false
        );

      }

    };


  /* =======================================================
     DELETE TESTIMONIAL
  ======================================================= */

  const handleDeleteTestimonial =
    async (
      testimonialId
    ) => {

      const confirmed =
        window.confirm(
          'Are you sure you want to delete this testimonial? This action cannot be undone.'
        );


      if (!confirmed) {
        return;
      }


      try {

        setError('');


        await testimonialRequest(
          `/api/admin/testimonials/${testimonialId}`,
          {
            method: 'DELETE'
          }
        );


        setTestimonials(
          (current) =>
            current.filter(
              (item) =>
                item.id !==
                testimonialId
            )
        );


        showSuccess(
          'Testimonial deleted successfully.'
        );

      } catch (err) {

        console.error(err);

        setError(
          err.message ||
          'Unable to delete testimonial.'
        );

      }

    };


  /* =======================================================
     TOGGLE TESTIMONIAL STATUS
  ======================================================= */

  const handleToggleTestimonial =
    async (
      testimonial
    ) => {

      try {

        setError('');


        const data =
          await testimonialRequest(
            `/api/admin/testimonials/${testimonial.id}`,
            {
              method: 'PATCH',

              body:
                JSON.stringify({
                  is_active:
                    !testimonial.is_active
                })
            }
          );


        if (
          data?.testimonial
        ) {

          setTestimonials(
            (current) =>
              current.map(
                (item) =>
                  item.id ===
                  testimonial.id
                    ? data.testimonial
                    : item
              )
          );

        } else {

          await loadTestimonials();

        }


        showSuccess(
          testimonial.is_active
            ? 'Testimonial deactivated.'
            : 'Testimonial activated.'
        );

      } catch (err) {

        console.error(err);

        setError(
          err.message ||
          'Unable to update testimonial.'
        );

      }

    };


  /* =======================================================
     UPDATE ADMIN NAME
  ======================================================= */

  const handleNameUpdate =
    async (event) => {

      event.preventDefault();


      if (
        !nameInput.trim()
      ) {
        return;
      }


      try {

        setSettingsLoading(
          true
        );


        const data =
          await updateAdminName(
            nameInput.trim()
          );


        setAdmin(
          data.admin
        );


        localStorage.setItem(
          'vyntara_admin',
          JSON.stringify(
            data.admin
          )
        );


        if (data.token) {

          localStorage.setItem(
            'vyntara_admin_token',
            data.token
          );

        }


        showSuccess(
          'Admin name updated successfully.'
        );

      } catch (err) {

        setError(
          err.message
        );

      } finally {

        setSettingsLoading(
          false
        );

      }

    };


  /* =======================================================
     UPDATE PASSWORD
  ======================================================= */

  const handlePasswordUpdate =
    async (event) => {

      event.preventDefault();


      if (
        !currentPassword
      ) {

        setError(
          'Please enter your current password.'
        );

        return;

      }


      if (
        !newPassword
      ) {

        setError(
          'Please enter a new password.'
        );

        return;

      }


      if (
        newPassword.length < 6
      ) {

        setError(
          'New password must contain at least 6 characters.'
        );

        return;

      }


      if (
        newPassword !==
        confirmPassword
      ) {

        setError(
          'New passwords do not match.'
        );

        return;

      }


      try {

        setSettingsLoading(
          true
        );


        await changeAdminPassword(
          currentPassword,
          newPassword
        );


        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');


        showSuccess(
          'Password changed successfully.'
        );

      } catch (err) {

        setError(
          err.message
        );

      } finally {

        setSettingsLoading(
          false
        );

      }

    };


  /* =======================================================
     SUCCESS MESSAGE
  ======================================================= */

  const showSuccess =
    (message) => {

      setError('');


      setSuccessMessage(
        message
      );


      window.setTimeout(
        () => {
          setSuccessMessage('');
        },
        3500
      );

    };


  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {

    logoutAdmin();


    window.location.href =
      '/admin';

  };


  /* =======================================================
     FORMAT DATE
  ======================================================= */

  const formatDate =
    (date) => {

      if (!date) {
        return '-';
      }


      return new Date(
        date
      ).toLocaleDateString(
        'en-IN',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }
      );

    };


  /* =======================================================
     PRINT / PDF GENERATION
  ======================================================= */

  const escapeHtml = (value) => {
    if (value === null || value === undefined) return '-';

    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const formatPrintDateTime = (date) => {
    if (!date) return '-';

    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const printRecord = (type, record) => {
    if (!record) return;

    const printWindow = window.open(
      '',
      '_blank',
      'width=1100,height=800,noopener,noreferrer'
    );

    if (!printWindow) {
      window.alert('Please allow pop-ups for Vyntara Admin to print this document.');
      return;
    }

    const isApplication = type === 'application';
    const generatedAt = new Date().toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    const title = isApplication
      ? `Job Application — ${record.position_name || record.job?.position_name || record.job_title || 'Position'}`
      : `Project Enquiry — ${record.project_type || 'Project Request'}`;

    const reference = isApplication
      ? record.application_number || record.id || '-'
      : record.id || '-';

    const personName = isApplication
      ? [record.first_name, record.last_name].filter(Boolean).join(' ') || 'Candidate'
      : record.full_name || 'Client';

    const status = isApplication
      ? applicationStatusLabel(record.status || 'new')
      : statusLabel(record.status || 'new');

    const valueOrDash = (value) => escapeHtml(
      value === null || value === undefined || String(value).trim() === ''
        ? 'Not provided'
        : value
    );

    const infoItem = (label, value) => `
      <div class="info-item">
        <div class="info-label">${escapeHtml(label)}</div>
        <div class="info-value">${valueOrDash(value)}</div>
      </div>
    `;

    const section = (heading, content) => `
      <section class="print-section">
        <h2>${escapeHtml(heading)}</h2>
        ${content}
      </section>
    `;

    let documentContent = '';

    if (isApplication) {
      const skills = Array.isArray(record.skills)
        ? record.skills
        : typeof record.skills === 'string'
          ? record.skills.split(',').map((item) => item.trim()).filter(Boolean)
          : [];

      const socialLinks = [
        ['LinkedIn', record.linkedin_url],
        ['GitHub', record.github_url],
        ['Portfolio', record.portfolio_url]
      ].filter(([, value]) => value);

      documentContent = `
        ${section('Candidate Information', `
          <div class="info-grid">
            ${infoItem('Full Name', personName)}
            ${infoItem('Email', record.email)}
            ${infoItem('Phone', record.phone)}
            ${infoItem('Date of Birth', record.date_of_birth)}
            ${infoItem('Gender', record.gender)}
            ${infoItem('Current Location', record.current_location)}
          </div>
        `)}

        ${section('Application Details', `
          <div class="info-grid">
            ${infoItem('Position', record.position_name || record.job?.position_name || record.job_title)}
            ${infoItem('Application Number', record.application_number)}
            ${infoItem('Experience', record.experience)}
            ${infoItem('Expected Salary', record.expected_salary)}
            ${infoItem('Notice Period', record.notice_period)}
            ${infoItem('Applied On', formatPrintDateTime(record.created_at))}
            ${infoItem('Application Status', status)}
          </div>
        `)}

        ${section('Education & Professional Background', `
          <div class="info-grid">
            ${infoItem('Highest Qualification', record.highest_qualification)}
            ${infoItem('University', record.university)}
            ${infoItem('Graduation Year', record.graduation_year)}
            ${infoItem('Current Company', record.current_company)}
            ${infoItem('Current Job Title', record.current_job_title)}
          </div>
        `)}

        ${skills.length ? section('Skills', `
          <div class="tag-list">
            ${skills.map((skill) => `<span class="tag">${escapeHtml(skill)}</span>`).join('')}
          </div>
        `) : ''}

        ${socialLinks.length ? section('Online Profiles', `
          <div class="link-list">
            ${socialLinks.map(([label, url]) => `
              <div class="link-row">
                <strong>${escapeHtml(label)}</strong>
                <span>${escapeHtml(url)}</span>
              </div>
            `).join('')}
          </div>
        `) : ''}

        ${record.cover_letter ? section('Cover Letter', `
          <div class="long-text">${escapeHtml(record.cover_letter).replace(/\n/g, '<br />')}</div>
        `) : ''}

        ${record.resume_original_name || record.resume_url ? section('Resume', `
          <div class="resume-box">
            <strong>${valueOrDash(record.resume_original_name || 'Resume attached')}</strong>
            ${record.resume_url ? `<div class="resume-note">Resume file is available in the admin application record.</div>` : ''}
          </div>
        `) : ''}
      `;
    } else {
      documentContent = `
        ${section('Client Information', `
          <div class="info-grid">
            ${infoItem('Full Name', record.full_name)}
            ${infoItem('Email', record.email)}
            ${infoItem('Phone', record.phone)}
            ${infoItem('Company', record.company || 'Individual')}
          </div>
        `)}

        ${section('Project Details', `
          <div class="info-grid">
            ${infoItem('Project Type', record.project_type)}
            ${infoItem('Budget', record.budget)}
            ${infoItem('Timeline', record.timeline)}
            ${infoItem('Enquiry ID', record.id)}
            ${infoItem('Received On', formatPrintDateTime(record.created_at))}
            ${infoItem('Status', status)}
          </div>
        `)}

        ${section('Project Description', `
          <div class="long-text">${valueOrDash(record.project_description).replace(/\n/g, '<br />')}</div>
        `)}
      `;
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <style>
    @page {
      size: A4;
      margin: 14mm;
    }

    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      background: #fff;
      color: #172033;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      padding: 8px;
    }

    .print-document {
      max-width: 820px;
      margin: 0 auto;
    }

    .print-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      padding: 0 0 18px;
      border-bottom: 2px solid #172033;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 13px;
    }

    .brand img {
      width: 52px;
      height: 52px;
      object-fit: contain;
    }

    .brand-name {
      font-size: 22px;
      line-height: 1.05;
      font-weight: 800;
      letter-spacing: 1.4px;
      color: #101827;
    }

    .brand-subtitle {
      margin-top: 5px;
      font-size: 9px;
      letter-spacing: 1.8px;
      text-transform: uppercase;
      color: #667085;
    }

    .document-meta {
      text-align: right;
      color: #667085;
      font-size: 10px;
      line-height: 1.65;
    }

    .document-meta strong {
      display: block;
      color: #172033;
      font-size: 11px;
    }

    .title-block {
      padding: 22px 0 18px;
    }

    .eyebrow {
      margin-bottom: 7px;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 1.8px;
      text-transform: uppercase;
      color: #64748b;
    }

    .title-block h1 {
      margin: 0;
      font-size: 25px;
      line-height: 1.2;
      color: #101827;
    }

    .reference {
      margin-top: 7px;
      font-size: 10px;
      color: #667085;
    }

    .print-section {
      margin: 0 0 18px;
      break-inside: avoid;
    }

    .print-section h2 {
      margin: 0 0 9px;
      padding-bottom: 6px;
      border-bottom: 1px solid #dbe1ea;
      font-size: 11px;
      letter-spacing: 1.1px;
      text-transform: uppercase;
      color: #344054;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      border: 1px solid #e2e7ef;
      border-radius: 7px;
      overflow: hidden;
    }

    .info-item {
      min-width: 0;
      padding: 9px 11px;
      border-right: 1px solid #e2e7ef;
      border-bottom: 1px solid #e2e7ef;
    }

    .info-item:nth-child(2n) {
      border-right: 0;
    }

    .info-label {
      margin-bottom: 3px;
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #8490a3;
    }

    .info-value {
      color: #172033;
      font-size: 11px;
      font-weight: 600;
      overflow-wrap: anywhere;
    }

    .long-text {
      padding: 12px 14px;
      border: 1px solid #e2e7ef;
      border-radius: 7px;
      color: #344054;
      overflow-wrap: anywhere;
    }

    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .tag {
      display: inline-block;
      padding: 5px 9px;
      border: 1px solid #d8dee8;
      border-radius: 999px;
      background: #f6f8fb;
      color: #344054;
      font-size: 10px;
      font-weight: 600;
    }

    .link-list {
      border: 1px solid #e2e7ef;
      border-radius: 7px;
      overflow: hidden;
    }

    .link-row {
      display: grid;
      grid-template-columns: 110px 1fr;
      gap: 12px;
      padding: 9px 11px;
      border-bottom: 1px solid #e2e7ef;
    }

    .link-row:last-child {
      border-bottom: 0;
    }

    .link-row span {
      overflow-wrap: anywhere;
      color: #475467;
    }

    .resume-box {
      padding: 11px 13px;
      border: 1px solid #e2e7ef;
      border-radius: 7px;
    }

    .resume-note {
      margin-top: 4px;
      font-size: 10px;
      color: #667085;
    }

    .print-footer {
      margin-top: 25px;
      padding-top: 10px;
      border-top: 1px solid #dbe1ea;
      display: flex;
      justify-content: space-between;
      gap: 15px;
      font-size: 9px;
      color: #8490a3;
    }

    .print-controls {
      position: fixed;
      right: 20px;
      bottom: 20px;
      display: flex;
      gap: 8px;
      z-index: 10;
    }

    .print-controls button {
      border: 0;
      border-radius: 7px;
      padding: 10px 14px;
      background: #172033;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
    }

    .print-controls .close {
      background: #e8ecf2;
      color: #172033;
    }

    @media (max-width: 650px) {
      body {
        padding: 0;
      }

      .print-header {
        align-items: flex-start;
        flex-direction: column;
      }

      .document-meta {
        text-align: left;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .info-item,
      .info-item:nth-child(2n) {
        border-right: 0;
      }

      .link-row {
        grid-template-columns: 1fr;
        gap: 3px;
      }
    }

    @media print {
      body {
        padding: 0;
      }

      .print-controls {
        display: none !important;
      }

      .print-document {
        max-width: none;
      }
    }
  </style>
</head>
<body>
  <div class="print-document">
    <header class="print-header">
      <div class="brand">
        <img src="${escapeHtml(vyntaraLogo)}" alt="Vyntara Technologies" />
        <div>
          <div class="brand-name">VYNTARA</div>
          <div class="brand-subtitle">Technologies · Digital Solutions. Endless Possibilities.</div>
        </div>
      </div>

      <div class="document-meta">
        <strong>GENERATED DOCUMENT</strong>
        <span>${escapeHtml(generatedAt)}</span>
      </div>
    </header>

    <div class="title-block">
      <div class="eyebrow">${isApplication ? 'Recruitment Record' : 'Business Enquiry Record'}</div>
      <h1>${escapeHtml(title)}</h1>
      <div class="reference">Reference: ${escapeHtml(reference)}</div>
    </div>

    ${documentContent}

    <footer class="print-footer">
      <span>Vyntara Technologies</span>
      <span>Digital Solutions. Endless Possibilities.</span>
      <span>Generated ${escapeHtml(generatedAt)}</span>
    </footer>
  </div>

  <div class="print-controls">
    <button type="button" onclick="window.print()">Print / Save as PDF</button>
    <button type="button" class="close" onclick="window.close()">Close</button>
  </div>
</body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 350);
    };
  };


  /* =======================================================
     WEBSITE POPUP API
  ======================================================= */

  const loadPopup = async () => {
    try {
      setPopupLoading(true);

      const data = await jobRequest('/api/admin/popup');
      const popupData = data?.popup || data?.data || null;

      setPopup(popupData);

      if (popupData) {
        setPopupForm({
          title: popupData.title || '',
          description: popupData.description || '',
          image_url: popupData.image_url || '',
          button_text: popupData.button_text || 'Explore Our Services',
          button_url: popupData.button_url || '/#services',
          button_enabled: popupData.button_enabled !== false,
          is_active: Boolean(popupData.is_active),
          display_frequency: popupData.display_frequency || 'once_per_session',
          start_date: popupData.start_date ? String(popupData.start_date).slice(0, 16) : '',
          end_date: popupData.end_date ? String(popupData.end_date).slice(0, 16) : ''
        });
      }
    } catch (err) {
      // A missing popup record should not break the rest of the admin dashboard.
      console.error('Popup loading error:', err);
    } finally {
      setPopupLoading(false);
    }
  };

  const handlePopupChange = (event) => {
    const { name, value, type, checked } = event.target;

    setPopupForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (error) setError('');
  };

  const handlePopupSubmit = async (event) => {
    event.preventDefault();

    if (popupSaving) return;

    if (!popupForm.title.trim()) {
      setError('Please enter a popup title.');
      return;
    }

    if (!popupForm.description.trim()) {
      setError('Please enter popup text.');
      return;
    }

    try {
      setPopupSaving(true);
      setError('');

      const payload = {
        title: popupForm.title.trim(),
        description: popupForm.description.trim(),
        image_url: popupForm.image_url.trim(),
        button_text: popupForm.button_text.trim(),
        button_url: popupForm.button_url.trim(),
        button_enabled: Boolean(popupForm.button_enabled),
        is_active: Boolean(popupForm.is_active),
        display_frequency: popupForm.display_frequency,
        start_date: popupForm.start_date || null,
        end_date: popupForm.end_date || null
      };

      const data = popup
        ? await jobRequest(`/api/admin/popup/${popup.id}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
          })
        : await jobRequest('/api/admin/popup', {
            method: 'POST',
            body: JSON.stringify(payload)
          });

      const savedPopup = data?.popup || data?.data;

      if (savedPopup) {
        setPopup(savedPopup);
        setPopupForm((current) => ({
          ...current,
          start_date: savedPopup.start_date ? String(savedPopup.start_date).slice(0, 16) : '',
          end_date: savedPopup.end_date ? String(savedPopup.end_date).slice(0, 16) : ''
        }));
      } else {
        await loadPopup();
      }

      showSuccess(popup ? 'Website popup updated successfully.' : 'Website popup created successfully.');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to save website popup.');
    } finally {
      setPopupSaving(false);
    }
  };

  const handleTogglePopup = async () => {
    if (!popup) {
      setPopupForm((current) => ({ ...current, is_active: !current.is_active }));
      return;
    }

    try {
      setPopupSaving(true);
      setError('');

      const data = await jobRequest(`/api/admin/popup/${popup.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: !popup.is_active })
      });

      const updatedPopup = data?.popup || data?.data;
      if (updatedPopup) {
        setPopup(updatedPopup);
        setPopupForm((current) => ({
          ...current,
          is_active: Boolean(updatedPopup.is_active)
        }));
      } else {
        await loadPopup();
      }

      showSuccess(popup.is_active ? 'Website popup deactivated.' : 'Website popup activated.');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to update popup status.');
    } finally {
      setPopupSaving(false);
    }
  };

  const handleDeletePopup = async () => {
    if (!popup) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete the website popup? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      setPopupSaving(true);
      setError('');

      await jobRequest(`/api/admin/popup/${popup.id}`, { method: 'DELETE' });

      setPopup(null);
      setPopupForm({
        title: 'Welcome to Vyntara Technologies',
        description: 'Digital solutions built to move your business forward.',
        image_url: '',
        button_text: 'Explore Our Services',
        button_url: '/#services',
        button_enabled: true,
        is_active: false,
        display_frequency: 'once_per_session',
        start_date: '',
        end_date: ''
      });

      showSuccess('Website popup deleted successfully.');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to delete website popup.');
    } finally {
      setPopupSaving(false);
    }
  };

  /* =======================================================
     STATUS LABEL
  ======================================================= */

  const statusLabel =
    (status) => {

      const labels = {
        new: 'New',
        contacted: 'Contacted',
        in_progress: 'In Progress',
        completed: 'Completed',
        cancelled: 'Cancelled'
      };


      return (
        labels[status] ||
        status
      );

    };


  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navigate =
    (page) => {

      setActivePage(
        page
      );


      setMobileMenu(
        false
      );


      setSelectedProject(
        null
      );


      setTestimonialModalOpen(
        false
      );

    };


  /* =======================================================
     LOADING SCREEN
  ======================================================= */

  if (loading) {

    return (
      <div className="admin-dashboard-loading">

        <div className="admin-dashboard-loading-logo">
          V
        </div>

        <div className="admin-dashboard-loader" />

        <span>
          INITIALIZING VYNTARA ADMIN
        </span>

      </div>
    );

  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="admin-dashboard">


      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside
        className={`admin-sidebar ${
          mobileMenu
            ? 'admin-sidebar-open'
            : ''
        }`}
      >

        <div className="admin-sidebar-brand">

          <div className="admin-sidebar-logo">
            V
          </div>

          <div>

            <strong>
              VYNTARA
            </strong>

            <span>
              ADMIN CONSOLE
            </span>

          </div>

        </div>


        <nav className="admin-sidebar-nav">


          {/* DASHBOARD */}

          <button
            type="button"
            className={
              activePage ===
              'dashboard'
                ? 'active'
                : ''
            }
            onClick={() =>
              navigate(
                'dashboard'
              )
            }
          >

            <LayoutDashboard
              size={18}
            />

            <span>
              Dashboard
            </span>

          </button>


          {/* ENQUIRIES */}

          <button
            type="button"
            className={
              activePage ===
              'enquiries'
                ? 'active'
                : ''
            }
            onClick={() =>
              navigate(
                'enquiries'
              )
            }
          >

            <FileText
              size={18}
            />

            <span>
              Enquiries
            </span>


            {stats.new > 0 && (

              <b>
                {stats.new}
              </b>

            )}

          </button>


          {/* JOBS */}

          <button
            type="button"
            className={
              activePage ===
              'jobs'
                ? 'active'
                : ''
            }
            onClick={() =>
              navigate('jobs')
            }
          >

            <BriefcaseBusiness
              size={18}
            />

            <span>
              Jobs
            </span>

            {jobs.length > 0 && (
              <b>
                {jobs.length}
              </b>
            )}

          </button>


          {/* APPLICATIONS */}

          <button
            type="button"
            className={
              activePage ===
              'applications'
                ? 'active'
                : ''
            }
            onClick={() =>
              navigate(
                'applications'
              )
            }
          >

            <UserRoundCheck
              size={18}
            />

            <span>
              Applications
            </span>

            {applications.filter(
              (item) =>
                !item.status ||
                item.status === 'new'
            ).length > 0 && (
              <b>
                {
                  applications.filter(
                    (item) =>
                      !item.status ||
                      item.status === 'new'
                  ).length
                }
              </b>
            )}

          </button>


          {/* TESTIMONIALS */}

          <button
            type="button"
            className={
              activePage ===
              'testimonials'
                ? 'active'
                : ''
            }
            onClick={() =>
              navigate(
                'testimonials'
              )
            }
          >

            <UsersRound
              size={18}
            />

            <span>
              Testimonials
            </span>


            {testimonials.length > 0 && (

              <b>
                {testimonials.length}
              </b>

            )}

          </button>


          {/* WEBSITE POPUP */}
          <button
            type="button"
            className={
              activePage ===
              'popup'
                ? 'active'
                : ''
            }
            onClick={() =>
              navigate('popup')
            }
          >
            <Bell size={18} />
            <span>Website Popup</span>
            {popup?.is_active && <b>ON</b>}
          </button>


          {/* SETTINGS */}
          <button
            type="button"
            className={
              activePage ===
              'settings'
                ? 'active'
                : ''
            }
            onClick={() =>
              navigate(
                'settings'
              )
            }
          >

            <Settings
              size={18}
            />

            <span>
              Settings
            </span>

          </button>

        </nav>


        <div className="admin-sidebar-bottom">

          <div className="admin-sidebar-secure">

            <ShieldCheck
              size={16}
            />

            <div>

              <strong>
                Secure Session
              </strong>

              <span>
                Protected access
              </span>

            </div>

          </div>


          <button
            type="button"
            className="admin-logout-button"
            onClick={
              handleLogout
            }
          >

            <LogOut
              size={17}
            />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>


      {/* ===================================================
          MOBILE OVERLAY
      =================================================== */}

      {mobileMenu && (

        <div
          className="admin-mobile-overlay"
          onClick={() =>
            setMobileMenu(false)
          }
        />

      )}


      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="admin-main">


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="admin-header">

          <div className="admin-header-left">

            <button
              type="button"
              className="admin-mobile-menu-button"
              onClick={() =>
                setMobileMenu(true)
              }
            >

              <Menu
                size={21}
              />

            </button>


            <div>

              <span className="admin-header-label">
                VYNTARA TECHNOLOGIES
              </span>


              <h1>

                {activePage ===
                'dashboard'
                  ? 'Dashboard'
                  : activePage ===
                    'enquiries'
                    ? 'Enquiries'
                    : activePage ===
                      'jobs'
                      ? 'Job Postings'
                      : activePage ===
                        'applications'
                        ? 'Applications'
                        : activePage ===
                          'testimonials'
                          ? 'Testimonials'
                          : activePage ===
                            'popup'
                            ? 'Website Popup'
                            : 'Settings'}

              </h1>

            </div>

          </div>


          <div className="admin-header-right">

            <button
              type="button"
              className="admin-refresh"
              onClick={() =>
                loadDashboard(
                  true
                )
              }
              disabled={
                refreshing
              }
            >

              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? 'spinning'
                    : ''
                }
              />

            </button>


            <div className="admin-header-user">

              <div className="admin-header-avatar">

                {admin?.username
                  ?.charAt(0)
                  ?.toUpperCase() ||
                  'A'}

              </div>


              <div>

                <strong>
                  {admin?.username ||
                    'Admin'}
                </strong>

                <span>
                  Administrator
                </span>

              </div>

            </div>

          </div>

        </header>


        {/* =================================================
            ALERTS
        ================================================= */}

        {error && (

          <div className="admin-alert admin-alert-error">

            <X
              size={17}
            />

            <span>
              {error}
            </span>


            <button
              type="button"
              onClick={() =>
                setError('')
              }
            >

              <X
                size={14}
              />

            </button>

          </div>

        )}


        {successMessage && (

          <div className="admin-alert admin-alert-success">

            <Check
              size={17}
            />

            <span>
              {successMessage}
            </span>

          </div>

        )}


        {/* =================================================
            DASHBOARD
        ================================================= */}

        {activePage ===
          'dashboard' && (

          <section className="admin-content">


            {/* WELCOME */}

            <div className="admin-welcome">

              <div>

                <span className="admin-welcome-label">
                  ADMINISTRATION CENTER
                </span>

                <h2>

                  {getGreeting()},{' '}

                  <span>
                    {admin?.username ||
                      'Admin'}
                  </span>

                </h2>

                <p>
                  Here's what's happening
                  with your project enquiries
                  today.
                </p>

              </div>


              <div className="admin-welcome-icon">

                <ShieldCheck
                  size={34}
                />

              </div>

            </div>


            {/* STATISTICS */}

            <div className="admin-stats-grid">


              <div className="admin-stat-card">

                <div className="admin-stat-top">

                  <span>
                    TOTAL ENQUIRIES
                  </span>

                  <FileText
                    size={19}
                  />

                </div>

                <strong>
                  {stats.total}
                </strong>

                <small>
                  All project requests
                </small>

              </div>


              <div className="admin-stat-card admin-stat-new">

                <div className="admin-stat-top">

                  <span>
                    NEW
                  </span>

                  <Bell
                    size={19}
                  />

                </div>

                <strong>
                  {stats.new}
                </strong>

                <small>
                  Awaiting response
                </small>

              </div>


              <div className="admin-stat-card">

                <div className="admin-stat-top">

                  <span>
                    IN PROGRESS
                  </span>

                  <Clock3
                    size={19}
                  />

                </div>

                <strong>
                  {stats.inProgress}
                </strong>

                <small>
                  Active projects
                </small>

              </div>


              <div className="admin-stat-card">

                <div className="admin-stat-top">

                  <span>
                    COMPLETED
                  </span>

                  <Check
                    size={19}
                  />

                </div>

                <strong>
                  {stats.completed}
                </strong>

                <small>
                  Successfully completed
                </small>

              </div>


              <div className="admin-stat-card">

                <div className="admin-stat-top">

                  <span>
                    TESTIMONIALS
                  </span>

                  <Star
                    size={19}
                  />

                </div>

                <strong>
                  {testimonials.length}
                </strong>

                <small>
                  Client testimonials
                </small>

              </div>

            </div>


            {/* RECENT ENQUIRIES */}

            <div className="admin-panel">

              <div className="admin-panel-header">

                <div>

                  <span>
                    PROJECT PIPELINE
                  </span>

                  <h3>
                    Recent Enquiries
                  </h3>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      'enquiries'
                    )
                  }
                >
                  View All
                </button>

              </div>


              <div className="admin-table-wrapper">

                {projects.length === 0 ? (

                  <div className="admin-empty">

                    <FileText
                      size={30}
                    />

                    <strong>
                      No enquiries yet
                    </strong>

                    <span>
                      New project requests
                      will appear here.
                    </span>

                  </div>

                ) : (

                  <table className="admin-table">

                    <thead>

                      <tr>

                        <th>
                          CLIENT
                        </th>

                        <th>
                          PROJECT
                        </th>

                        <th>
                          DATE
                        </th>

                        <th>
                          STATUS
                        </th>

                        <th>
                          ACTION
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {projects
                        .slice(0, 6)
                        .map(
                          (project) => (

                            <tr
                              key={
                                project.id
                              }
                            >

                              <td>

                                <div className="admin-client">

                                  <div className="admin-client-avatar">

                                    {project.full_name
                                      ?.charAt(0)
                                      ?.toUpperCase()}

                                  </div>


                                  <div>

                                    <strong>
                                      {
                                        project.full_name
                                      }
                                    </strong>

                                    <span>
                                      {
                                        project.email
                                      }
                                    </span>

                                  </div>

                                </div>

                              </td>


                              <td>

                                <strong className="admin-project-name">
                                  {
                                    project.project_type
                                  }
                                </strong>

                                <span className="admin-project-company">
                                  {
                                    project.company ||
                                    'Individual'
                                  }
                                </span>

                              </td>


                              <td>
                                {formatDate(
                                  project.created_at
                                )}
                              </td>


                              <td>

                                <span
                                  className={`admin-status admin-status-${project.status}`}
                                >
                                  {
                                    statusLabel(
                                      project.status
                                    )
                                  }
                                </span>

                              </td>


                              <td>

                                <button
                                  type="button"
                                  className="admin-view-button"
                                  onClick={() =>
                                    setSelectedProject(
                                      project
                                    )
                                  }
                                >

                                  <Eye
                                    size={15}
                                  />

                                </button>

                              </td>

                            </tr>

                          )
                        )}

                    </tbody>

                  </table>

                )}

              </div>

            </div>


            {/* TESTIMONIAL PREVIEW */}

            <div className="admin-panel">

              <div className="admin-panel-header">

                <div>

                  <span>
                    CLIENT VOICE
                  </span>

                  <h3>
                    Recent Testimonials
                  </h3>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      'testimonials'
                    )
                  }
                >
                  Manage
                </button>

              </div>


              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '16px',
                  padding: '20px'
                }}
              >

                {testimonials
                  .filter(
                    (item) =>
                      item.is_active
                  )
                  .slice(0, 3)
                  .map(
                    (testimonial) => (

                      <div
                        key={
                          testimonial.id
                        }
                        style={{
                          padding: '20px',
                          borderRadius: '14px',
                          border:
                            '1px solid rgba(255,255,255,0.08)',
                          background:
                            'rgba(255,255,255,0.025)'
                        }}
                      >

                        <div
                          style={{
                            display:
                              'flex',
                            gap: '3px',
                            marginBottom:
                              '12px'
                          }}
                        >

                          {[
                            1,
                            2,
                            3,
                            4,
                            5
                          ].map(
                            (star) => (

                              <Star
                                key={star}
                                size={15}
                                fill={
                                  star <=
                                  Number(
                                    testimonial.rating
                                  )
                                    ? 'currentColor'
                                    : 'none'
                                }
                              />

                            )
                          )}

                        </div>


                        <p
                          style={{
                            margin:
                              '0 0 15px',
                            lineHeight:
                              '1.6',
                            opacity:
                              0.82
                          }}
                        >
                          "{testimonial.description}"
                        </p>


                        <strong>
                          {testimonial.name}
                        </strong>


                        <span
                          style={{
                            display:
                              'block',
                            marginTop:
                              '4px',
                            fontSize:
                              '13px',
                            opacity:
                              0.6
                          }}
                        >
                          {
                            testimonial.organization
                          }
                        </span>

                      </div>

                    )
                  )}


                {testimonials.filter(
                  (item) =>
                    item.is_active
                ).length === 0 && (

                  <div className="admin-empty">

                    <Star
                      size={30}
                    />

                    <strong>
                      No active testimonials
                    </strong>

                    <span>
                      Add testimonials from
                      the Testimonials section.
                    </span>

                  </div>

                )}

              </div>

            </div>

          </section>

        )}


        {/* =================================================
            ENQUIRIES
        ================================================= */}

        {activePage ===
          'enquiries' && (

          <section className="admin-content">

            <div className="admin-page-heading">

              <div>

                <span>
                  CLIENT COMMUNICATION
                </span>

                <h2>
                  Project Enquiries
                </h2>

                <p>
                  Manage every project request
                  received through Vyntara.
                </p>

              </div>


              <div className="admin-page-count">

                <strong>
                  {projects.length}
                </strong>

                <span>
                  Total
                </span>

              </div>

            </div>


            {/* FILTERS */}

            <div className="admin-filters">

              <div className="admin-search">

                <Search
                  size={17}
                />

                <input
                  type="text"
                  placeholder="Search enquiries..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="admin-filter-select">

                <select
                  value={
                    statusFilter
                  }
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                >

                  <option value="all">
                    All Status
                  </option>

                  <option value="new">
                    New
                  </option>

                  <option value="contacted">
                    Contacted
                  </option>

                  <option value="in_progress">
                    In Progress
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>

                </select>

                <ChevronDown
                  size={15}
                />

              </div>

            </div>


            {/* TABLE */}

            <div className="admin-panel">

              <div className="admin-table-wrapper">

                {filteredProjects.length ===
                0 ? (

                  <div className="admin-empty">

                    <Search
                      size={30}
                    />

                    <strong>
                      No enquiries found
                    </strong>

                    <span>
                      Try changing your search
                      or filter.
                    </span>

                  </div>

                ) : (

                  <table className="admin-table">

                    <thead>

                      <tr>

                        <th>
                          CLIENT
                        </th>

                        <th>
                          PROJECT
                        </th>

                        <th>
                          BUDGET
                        </th>

                        <th>
                          DATE
                        </th>

                        <th>
                          STATUS
                        </th>

                        <th>
                          VIEW
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {filteredProjects.map(
                        (project) => (

                          <tr
                            key={
                              project.id
                            }
                          >

                            <td>

                              <div className="admin-client">

                                <div className="admin-client-avatar">

                                  {project.full_name
                                    ?.charAt(0)
                                    ?.toUpperCase()}

                                </div>


                                <div>

                                  <strong>
                                    {
                                      project.full_name
                                    }
                                  </strong>

                                  <span>
                                    {
                                      project.email
                                    }
                                  </span>

                                </div>

                              </div>

                            </td>


                            <td>

                              <strong className="admin-project-name">
                                {
                                  project.project_type
                                }
                              </strong>

                              <span className="admin-project-company">
                                {
                                  project.company ||
                                  'Individual'
                                }
                              </span>

                            </td>


                            <td>
                              {
                                project.budget ||
                                'Not specified'
                              }
                            </td>


                            <td>
                              {formatDate(
                                project.created_at
                              )}
                            </td>


                            <td>

                              <select
                                className={`admin-status-select admin-status-select-${project.status}`}
                                value={
                                  project.status
                                }
                                onChange={(event) =>
                                  handleStatusChange(
                                    project.id,
                                    event.target.value
                                  )
                                }
                              >

                                <option value="new">
                                  New
                                </option>

                                <option value="contacted">
                                  Contacted
                                </option>

                                <option value="in_progress">
                                  In Progress
                                </option>

                                <option value="completed">
                                  Completed
                                </option>

                                <option value="cancelled">
                                  Cancelled
                                </option>

                              </select>

                            </td>


                            <td>

                              <button
                                type="button"
                                className="admin-view-button"
                                onClick={() =>
                                  setSelectedProject(
                                    project
                                  )
                                }
                              >

                                <Eye
                                  size={15}
                                />

                              </button>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                )}

              </div>

            </div>

          </section>

        )}



        {/* =================================================
            JOB POSTINGS
        ================================================= */}

        {activePage === 'jobs' && (
          <section className="admin-content">

            <div className="admin-page-heading">
              <div>
                <span>TALENT ACQUISITION</span>
                <h2>Job Postings</h2>
                <p>
                  Create, edit and publish job opportunities
                  shown on the Vyntara Careers page.
                </p>
              </div>

              <button
                type="button"
                className="admin-settings-save"
                onClick={openAddJob}
                style={{
                  width: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 18px'
                }}
              >
                <PlusCircle size={17} />
                Add Job
              </button>
            </div>

            <div className="admin-filters">

              <div className="admin-search">
                <Search size={17} />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={jobSearch}
                  onChange={(event) =>
                    setJobSearch(event.target.value)
                  }
                />
              </div>

              <div className="admin-filter-select">
                <select
                  value={jobStatusFilter}
                  onChange={(event) =>
                    setJobStatusFilter(event.target.value)
                  }
                >
                  <option value="all">All Jobs</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <ChevronDown size={15} />
              </div>

            </div>

            <div className="admin-panel">

              <div className="admin-table-wrapper">

                {jobLoading ? (
                  <div className="admin-empty">
                    <RefreshCw size={30} className="spinning" />
                    <strong>Loading jobs...</strong>
                    <span>Please wait.</span>
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="admin-empty">
                    <BriefcaseBusiness size={30} />
                    <strong>No job postings found</strong>
                    <span>
                      Add a job posting to publish it on Careers.
                    </span>
                    <button
                      type="button"
                      onClick={openAddJob}
                      style={{
                        marginTop: '12px',
                        padding: '10px 16px',
                        borderRadius: '9px',
                        border:
                          '1px solid rgba(255,255,255,0.12)',
                        background:
                          'rgba(255,255,255,0.05)',
                        color: 'inherit',
                        cursor: 'pointer'
                      }}
                    >
                      <Plus size={15} />
                      {' '}Add Job
                    </button>
                  </div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>POSITION</th>
                        <th>LOCATION</th>
                        <th>TYPE</th>
                        <th>TAGS</th>
                        <th>STATUS</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredJobs.map((job) => (
                        <tr key={job.id}>

                          <td>
                            <strong className="admin-project-name">
                              {job.position_name}
                            </strong>
                            <span className="admin-project-company">
                              {job.short_description}
                            </span>
                          </td>

                          <td>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <MapPin size={14} />
                              {job.location}
                            </div>
                          </td>

                          <td>
                            {job.employment_type}
                          </td>

                          <td>
                            <div
                              style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '5px',
                                maxWidth: '250px'
                              }}
                            >
                              {(Array.isArray(job.tags)
                                ? job.tags
                                : []
                              ).map((tag, index) => (
                                <span
                                  key={`${tag}-${index}`}
                                  style={{
                                    padding: '4px 7px',
                                    borderRadius: '6px',
                                    background:
                                      'rgba(80,150,255,0.08)',
                                    border:
                                      '1px solid rgba(80,150,255,0.12)',
                                    fontSize: '11px'
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td>
                            <button
                              type="button"
                              onClick={() =>
                                handleToggleJob(job)
                              }
                              style={{
                                border:
                                  '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '20px',
                                padding: '6px 11px',
                                background:
                                  job.is_active
                                    ? 'rgba(80,220,150,0.1)'
                                    : 'rgba(255,255,255,0.05)',
                                color: 'inherit',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              {job.is_active
                                ? 'Active'
                                : 'Inactive'}
                            </button>
                          </td>

                          <td>
                            <div
                              style={{
                                display: 'flex',
                                gap: '7px'
                              }}
                            >
                              <button
                                type="button"
                                className="admin-view-button"
                                title="Edit job"
                                onClick={() =>
                                  openEditJob(job)
                                }
                              >
                                <Pencil size={15} />
                              </button>

                              <button
                                type="button"
                                className="admin-view-button"
                                title="Delete job"
                                onClick={() =>
                                  handleDeleteJob(job.id)
                                }
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

              </div>
            </div>

          </section>
        )}


        {/* =================================================
            APPLICATIONS
        ================================================= */}

        {activePage === 'applications' && (
          <section className="admin-content">

            <div className="admin-page-heading">
              <div>
                <span>TALENT MANAGEMENT</span>
                <h2>Job Applications</h2>
                <p>
                  Review candidates, resumes and application
                  status from one place.
                </p>
              </div>

              <div className="admin-page-count">
                <strong>{applications.length}</strong>
                <span>Total</span>
              </div>
            </div>

            <div className="admin-filters">

              <div className="admin-search">
                <Search size={17} />
                <input
                  type="text"
                  placeholder="Search candidate, email or application number..."
                  value={applicationSearch}
                  onChange={(event) =>
                    setApplicationSearch(
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="admin-filter-select">
                <select
                  value={applicationStatusFilter}
                  onChange={(event) =>
                    setApplicationStatusFilter(
                      event.target.value
                    )
                  }
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interview">Interview</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
                <ChevronDown size={15} />
              </div>

            </div>

            <div className="admin-panel">

              <div className="admin-table-wrapper">

                {applicationLoading ? (
                  <div className="admin-empty">
                    <RefreshCw size={30} className="spinning" />
                    <strong>Loading applications...</strong>
                    <span>Please wait.</span>
                  </div>
                ) : filteredApplications.length === 0 ? (
                  <div className="admin-empty">
                    <UserRoundCheck size={30} />
                    <strong>No applications found</strong>
                    <span>
                      Candidate applications will appear here.
                    </span>
                  </div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>CANDIDATE</th>
                        <th>POSITION</th>
                        <th>APPLICATION NO.</th>
                        <th>DATE</th>
                        <th>STATUS</th>
                        <th>VIEW</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredApplications.map(
                        (application) => {
                          const fullName = [
                            application.first_name,
                            application.last_name
                          ]
                            .filter(Boolean)
                            .join(' ');

                          return (
                            <tr key={application.id}>

                              <td>
                                <div className="admin-client">
                                  <div className="admin-client-avatar">
                                    {(fullName || 'C')
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>

                                  <div>
                                    <strong>
                                      {fullName || 'Candidate'}
                                    </strong>
                                    <span>
                                      {application.email}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td>
                                <strong className="admin-project-name">
                                  {application.position_name ||
                                    application.job?.position_name ||
                                    application.job_title ||
                                    'Job Application'}
                                </strong>
                              </td>

                              <td>
                                <span
                                  style={{
                                    fontFamily: 'monospace',
                                    fontSize: '12px'
                                  }}
                                >
                                  {application.application_number ||
                                    '-'}
                                </span>
                              </td>

                              <td>
                                {formatDate(
                                  application.created_at
                                )}
                              </td>

                              <td>
                                <select
                                  className={`admin-status-select admin-status-select-${application.status || 'new'}`}
                                  value={
                                    application.status ||
                                    'new'
                                  }
                                  onChange={(event) =>
                                    handleApplicationStatusChange(
                                      application.id,
                                      event.target.value
                                    )
                                  }
                                >
                                  <option value="new">
                                    New
                                  </option>
                                  <option value="reviewing">
                                    Reviewing
                                  </option>
                                  <option value="shortlisted">
                                    Shortlisted
                                  </option>
                                  <option value="interview">
                                    Interview
                                  </option>
                                  <option value="selected">
                                    Selected
                                  </option>
                                  <option value="rejected">
                                    Rejected
                                  </option>
                                  <option value="withdrawn">
                                    Withdrawn
                                  </option>
                                </select>
                              </td>

                              <td>
                                <button
                                  type="button"
                                  className="admin-view-button"
                                  title="View application"
                                  onClick={() =>
                                    setSelectedApplication(
                                      application
                                    )
                                  }
                                >
                                  <Eye size={15} />
                                </button>
                              </td>

                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                )}

              </div>
            </div>

          </section>
        )}


        {/* =================================================
            TESTIMONIALS
        ================================================= */}

        {activePage ===
          'testimonials' && (

          <section className="admin-content">


            <div className="admin-page-heading">

              <div>

                <span>
                  CLIENT EXPERIENCE
                </span>

                <h2>
                  Testimonials
                </h2>

                <p>
                  Add and manage client testimonials
                  displayed across the Vyntara website.
                </p>

              </div>


              <button
                type="button"
                className="admin-settings-save"
                onClick={
                  openAddTestimonial
                }
                style={{
                  display:
                    'inline-flex',
                  alignItems:
                    'center',
                  gap: '8px',
                  width:
                    'auto',
                  padding:
                    '12px 18px'
                }}
              >

                <Plus
                  size={17}
                />

                Add Testimonial

              </button>

            </div>


            {/* TESTIMONIAL FILTERS */}

            <div className="admin-filters">

              <div className="admin-search">

                <Search
                  size={17}
                />

                <input
                  type="text"
                  placeholder="Search testimonials..."
                  value={
                    testimonialSearch
                  }
                  onChange={(event) =>
                    setTestimonialSearch(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="admin-filter-select">

                <select
                  value={
                    testimonialStatusFilter
                  }
                  onChange={(event) =>
                    setTestimonialStatusFilter(
                      event.target.value
                    )
                  }
                >

                  <option value="all">
                    All Testimonials
                  </option>

                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>

                </select>

                <ChevronDown
                  size={15}
                />

              </div>

            </div>


            {/* TESTIMONIAL COUNT */}

            <div
              style={{
                display:
                  'flex',
                gap:
                  '12px',
                flexWrap:
                  'wrap',
                marginBottom:
                  '18px'
              }}
            >

              <div
                style={{
                  padding:
                    '10px 15px',
                  borderRadius:
                    '10px',
                  border:
                    '1px solid rgba(255,255,255,0.08)',
                  background:
                    'rgba(255,255,255,0.025)'
                }}
              >

                <strong>
                  {testimonials.length}
                </strong>

                <span
                  style={{
                    marginLeft:
                      '7px',
                    opacity:
                      0.6
                  }}
                >
                  Total
                </span>

              </div>


              <div
                style={{
                  padding:
                    '10px 15px',
                  borderRadius:
                    '10px',
                  border:
                    '1px solid rgba(255,255,255,0.08)',
                  background:
                    'rgba(255,255,255,0.025)'
                }}
              >

                <strong>
                  {
                    testimonials.filter(
                      (item) =>
                        item.is_active
                    ).length
                  }
                </strong>

                <span
                  style={{
                    marginLeft:
                      '7px',
                    opacity:
                      0.6
                  }}
                >
                  Active
                </span>

              </div>

            </div>


            {/* TESTIMONIAL TABLE */}

            <div className="admin-panel">

              <div className="admin-table-wrapper">

                {testimonialLoading ? (

                  <div className="admin-empty">

                    <RefreshCw
                      size={30}
                      className="spinning"
                    />

                    <strong>
                      Loading testimonials...
                    </strong>

                    <span>
                      Please wait.
                    </span>

                  </div>

                ) : filteredTestimonials.length ===
                  0 ? (

                  <div className="admin-empty">

                    <Star
                      size={30}
                    />

                    <strong>
                      No testimonials found
                    </strong>

                    <span>
                      Add your first client testimonial.
                    </span>


                    <button
                      type="button"
                      onClick={
                        openAddTestimonial
                      }
                      style={{
                        marginTop:
                          '12px',
                        display:
                          'inline-flex',
                        alignItems:
                          'center',
                        gap:
                          '7px',
                        padding:
                          '10px 16px',
                        border:
                          '1px solid rgba(255,255,255,0.12)',
                        borderRadius:
                          '9px',
                        background:
                          'rgba(255,255,255,0.05)',
                        color:
                          'inherit',
                        cursor:
                          'pointer'
                      }}
                    >

                      <Plus
                        size={15}
                      />

                      Add Testimonial

                    </button>

                  </div>

                ) : (

                  <table className="admin-table">

                    <thead>

                      <tr>

                        <th>
                          CLIENT
                        </th>

                        <th>
                          ORGANIZATION
                        </th>

                        <th>
                          RATING
                        </th>

                        <th>
                          DESCRIPTION
                        </th>

                        <th>
                          STATUS
                        </th>

                        <th>
                          ACTION
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {filteredTestimonials.map(
                        (testimonial) => (

                          <tr
                            key={
                              testimonial.id
                            }
                          >

                            {/* CLIENT */}

                            <td>

                              <div className="admin-client">

                                <div className="admin-client-avatar">

                                  {testimonial.name
                                    ?.charAt(0)
                                    ?.toUpperCase()}

                                </div>


                                <div>

                                  <strong>
                                    {
                                      testimonial.name
                                    }
                                  </strong>

                                  <span>
                                    Client
                                  </span>

                                </div>

                              </div>

                            </td>


                            {/* ORGANIZATION */}

                            <td>

                              <strong className="admin-project-name">
                                {
                                  testimonial.organization
                                }
                              </strong>

                            </td>


                            {/* RATING */}

                            <td>

                              <div
                                style={{
                                  display:
                                    'flex',
                                  alignItems:
                                    'center',
                                  gap:
                                    '3px'
                                }}
                              >

                                {[
                                  1,
                                  2,
                                  3,
                                  4,
                                  5
                                ].map(
                                  (star) => (

                                    <Star
                                      key={
                                        star
                                      }
                                      size={15}
                                      fill={
                                        star <=
                                        Number(
                                          testimonial.rating
                                        )
                                          ? 'currentColor'
                                          : 'none'
                                      }
                                    />

                                  )
                                )}

                              </div>

                            </td>


                            {/* DESCRIPTION */}

                            <td>

                              <div
                                style={{
                                  maxWidth:
                                    '320px',
                                  whiteSpace:
                                    'nowrap',
                                  overflow:
                                    'hidden',
                                  textOverflow:
                                    'ellipsis',
                                  opacity:
                                    0.75
                                }}
                                title={
                                  testimonial.description
                                }
                              >
                                {
                                  testimonial.description
                                }
                              </div>

                            </td>


                            {/* STATUS */}

                            <td>

                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleTestimonial(
                                    testimonial
                                  )
                                }
                                style={{
                                  border:
                                    '1px solid rgba(255,255,255,0.1)',
                                  borderRadius:
                                    '20px',
                                  padding:
                                    '6px 11px',
                                  background:
                                    testimonial.is_active
                                      ? 'rgba(80,220,150,0.1)'
                                      : 'rgba(255,255,255,0.05)',
                                  color:
                                    'inherit',
                                  cursor:
                                    'pointer',
                                  fontSize:
                                    '12px'
                                }}
                              >

                                {testimonial.is_active
                                  ? 'Active'
                                  : 'Inactive'}

                              </button>

                            </td>


                            {/* ACTIONS */}

                            <td>

                              <div
                                style={{
                                  display:
                                    'flex',
                                  alignItems:
                                    'center',
                                  gap:
                                    '7px'
                                }}
                              >

                                <button
                                  type="button"
                                  className="admin-view-button"
                                  title="Edit testimonial"
                                  onClick={() =>
                                    openEditTestimonial(
                                      testimonial
                                    )
                                  }
                                >

                                  <Pencil
                                    size={15}
                                  />

                                </button>


                                <button
                                  type="button"
                                  className="admin-view-button"
                                  title="Delete testimonial"
                                  onClick={() =>
                                    handleDeleteTestimonial(
                                      testimonial.id
                                    )
                                  }
                                >

                                  <Trash2
                                    size={15}
                                  />

                                </button>

                              </div>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                )}

              </div>

            </div>

          </section>

        )}


        {/* =================================================
            WEBSITE POPUP
        ================================================= */}

        {activePage === 'popup' && (
          <section className="admin-content">
            <div className="admin-page-heading">
              <div>
                <span>WEBSITE EXPERIENCE</span>
                <h2>Website Popup</h2>
                <p>
                  Control the welcome popup visitors see when they open the Vyntara website.
                </p>
              </div>

              <div className={`admin-popup-status ${popupForm.is_active ? 'is-active' : ''}`}>
                <span className="admin-popup-status-dot" />
                {popupForm.is_active ? 'LIVE' : 'INACTIVE'}
              </div>
            </div>

            <div className="admin-popup-editor-grid">
              <div className="admin-panel admin-popup-editor-card">
                <div className="admin-panel-header">
                  <div>
                    <span>POPUP CONTENT</span>
                    <h3>Configure Visitor Popup</h3>
                  </div>
                  {popupLoading && <RefreshCw size={17} className="spinning" />}
                </div>

                <form className="admin-popup-form" onSubmit={handlePopupSubmit}>
                  <div className="admin-popup-logo-note">
                    <img src={vyntaraLogo} alt="Vyntara Technologies" />
                    <div>
                      <strong>Vyntara Technologies</strong>
                      <span>Your website logo is automatically included in the popup.</span>
                    </div>
                  </div>

                  <div className="admin-popup-field">
                    <label>Popup Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={popupForm.title}
                      onChange={handlePopupChange}
                      placeholder="Welcome to Vyntara Technologies"
                      required
                      disabled={popupSaving}
                    />
                  </div>

                  <div className="admin-popup-field">
                    <label>Popup Text *</label>
                    <textarea
                      name="description"
                      value={popupForm.description}
                      onChange={handlePopupChange}
                      placeholder="Write the message visitors should see..."
                      rows={5}
                      required
                      disabled={popupSaving}
                    />
                  </div>

                  <div className="admin-popup-field">
                    <label>Image URL</label>
                    <input
                      type="url"
                      name="image_url"
                      value={popupForm.image_url}
                      onChange={handlePopupChange}
                      placeholder="https://.../popup-banner.jpg"
                      disabled={popupSaving}
                    />
                    <small>
                      Optional promotional image. The Vyntara logo remains visible even when this is empty.
                    </small>
                  </div>

                  <div className="admin-popup-two-column">
                    <div className="admin-popup-field">
                      <label>Button Text</label>
                      <input
                        type="text"
                        name="button_text"
                        value={popupForm.button_text}
                        onChange={handlePopupChange}
                        placeholder="Explore Our Services"
                        disabled={popupSaving || !popupForm.button_enabled}
                      />
                    </div>

                    <div className="admin-popup-field">
                      <label>Button URL</label>
                      <input
                        type="text"
                        name="button_url"
                        value={popupForm.button_url}
                        onChange={handlePopupChange}
                        placeholder="/#services or https://..."
                        disabled={popupSaving || !popupForm.button_enabled}
                      />
                    </div>
                  </div>

                  <label className="admin-popup-checkbox">
                    <input
                      type="checkbox"
                      name="button_enabled"
                      checked={popupForm.button_enabled}
                      onChange={handlePopupChange}
                      disabled={popupSaving}
                    />
                    <span>
                      <strong>Show CTA button</strong>
                      <small>Display an action button below the popup message.</small>
                    </span>
                  </label>

                  <div className="admin-popup-field">
                    <label>Display Frequency</label>
                    <select
                      name="display_frequency"
                      value={popupForm.display_frequency}
                      onChange={handlePopupChange}
                      disabled={popupSaving}
                    >
                      <option value="every_visit">Every visit</option>
                      <option value="once_per_session">Once per session</option>
                      <option value="once_per_day">Once per day</option>
                      <option value="once_per_7_days">Once per 7 days</option>
                    </select>
                  </div>

                  <div className="admin-popup-two-column">
                    <div className="admin-popup-field">
                      <label>Start Date</label>
                      <input
                        type="datetime-local"
                        name="start_date"
                        value={popupForm.start_date}
                        onChange={handlePopupChange}
                        disabled={popupSaving}
                      />
                    </div>

                    <div className="admin-popup-field">
                      <label>End Date</label>
                      <input
                        type="datetime-local"
                        name="end_date"
                        value={popupForm.end_date}
                        onChange={handlePopupChange}
                        disabled={popupSaving}
                      />
                    </div>
                  </div>

                  <label className="admin-popup-checkbox admin-popup-live-toggle">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={popupForm.is_active}
                      onChange={handlePopupChange}
                      disabled={popupSaving}
                    />
                    <span>
                      <strong>Activate popup on website</strong>
                      <small>Visitors will see this popup when the schedule allows it.</small>
                    </span>
                  </label>

                  <div className="admin-popup-actions">
                    <button
                      type="submit"
                      className="admin-settings-save"
                      disabled={popupSaving}
                    >
                      {popupSaving ? 'Saving...' : popup ? 'Save Popup' : 'Create Popup'}
                    </button>

                    {popup && (
                      <button
                        type="button"
                        className="admin-delete-button"
                        onClick={handleDeletePopup}
                        disabled={popupSaving}
                      >
                        <Trash2 size={16} />
                        Delete Popup
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="admin-panel admin-popup-preview-panel">
                <div className="admin-panel-header">
                  <div>
                    <span>LIVE PREVIEW</span>
                    <h3>Visitor View</h3>
                  </div>
                  <Eye size={18} />
                </div>

                <div className="admin-popup-preview-stage">
                  <div className="admin-popup-preview-card">
                    <button type="button" className="admin-popup-preview-close" aria-label="Close preview">
                      <X size={17} />
                    </button>

                    <div className="admin-popup-preview-brand">
                      <img src={vyntaraLogo} alt="Vyntara Technologies" />
                      <div>
                        <strong>VYNTARA</strong>
                        <span>TECHNOLOGIES</span>
                      </div>
                    </div>

                    {popupForm.image_url ? (
                      <img
                        className="admin-popup-preview-image"
                        src={popupForm.image_url}
                        alt="Popup preview"
                        onError={(event) => {
                          event.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="admin-popup-preview-logo-hero">
                        <img src={vyntaraLogo} alt="Vyntara" />
                      </div>
                    )}

                    <div className="admin-popup-preview-copy">
                      <span>VYNTARA TECHNOLOGIES</span>
                      <h4>{popupForm.title || 'Popup title'}</h4>
                      <p>{popupForm.description || 'Popup description will appear here.'}</p>
                    </div>

                    {popupForm.button_enabled && (
                      <button type="button" className="admin-popup-preview-cta">
                        {popupForm.button_text || 'Explore Our Services'}
                      </button>
                    )}

                    <small className="admin-popup-preview-frequency">
                      {popupForm.display_frequency === 'every_visit'
                        ? 'Shows every visit'
                        : popupForm.display_frequency === 'once_per_day'
                          ? 'Shows once per day'
                          : popupForm.display_frequency === 'once_per_7_days'
                            ? 'Shows once every 7 days'
                            : 'Shows once per session'}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            SETTINGS
        ================================================= */}

        {activePage ===
          'settings' && (

          <section className="admin-content">

            <div className="admin-page-heading">

              <div>

                <span>
                  ACCOUNT CONTROL
                </span>

                <h2>
                  Settings
                </h2>

                <p>
                  Manage your admin profile
                  and security.
                </p>

              </div>

            </div>


            <div className="admin-settings-layout">


              {/* SETTINGS NAV */}

              <div className="admin-settings-nav">


                <button
                  type="button"
                  className={
                    settingsTab ===
                    'profile'
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setSettingsTab(
                      'profile'
                    )
                  }
                >

                  <UserRound
                    size={18}
                  />

                  <div>

                    <strong>
                      Profile
                    </strong>

                    <span>
                      Admin name
                    </span>

                  </div>

                </button>


                <button
                  type="button"
                  className={
                    settingsTab ===
                    'security'
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setSettingsTab(
                      'security'
                    )
                  }
                >

                  <ShieldCheck
                    size={18}
                  />

                  <div>

                    <strong>
                      Security
                    </strong>

                    <span>
                      Change password
                    </span>

                  </div>

                </button>


                <button
                  type="button"
                  className="admin-settings-logout"
                  onClick={
                    handleLogout
                  }
                >

                  <LogOut
                    size={18}
                  />

                  <div>

                    <strong>
                      Logout
                    </strong>

                    <span>
                      End session
                    </span>

                  </div>

                </button>

              </div>


              {/* SETTINGS CONTENT */}

              <div className="admin-settings-card">


                {/* PROFILE */}

                {settingsTab ===
                  'profile' && (

                  <form
                    onSubmit={
                      handleNameUpdate
                    }
                  >

                    <div className="admin-settings-title">

                      <div className="admin-settings-title-icon">

                        <UserRound
                          size={20}
                        />

                      </div>


                      <div>

                        <h3>
                          Admin Profile
                        </h3>

                        <p>
                          Update the name shown
                          throughout the dashboard.
                        </p>

                      </div>

                    </div>


                    <div className="admin-settings-form">

                      <label>
                        Admin Name
                      </label>


                      <div className="admin-settings-input">

                        <UserRound
                          size={17}
                        />

                        <input
                          type="text"
                          value={
                            nameInput
                          }
                          onChange={(event) =>
                            setNameInput(
                              event.target.value
                            )
                          }
                          placeholder="Admin name"
                        />

                      </div>


                      <button
                        type="submit"
                        className="admin-settings-save"
                        disabled={
                          settingsLoading
                        }
                      >

                        {settingsLoading
                          ? 'Saving...'
                          : 'Save Changes'}

                      </button>

                    </div>

                  </form>

                )}


                {/* SECURITY */}

                {settingsTab ===
                  'security' && (

                  <form
                    onSubmit={
                      handlePasswordUpdate
                    }
                  >

                    <div className="admin-settings-title">

                      <div className="admin-settings-title-icon">

                        <ShieldCheck
                          size={20}
                        />

                      </div>


                      <div>

                        <h3>
                          Account Security
                        </h3>

                        <p>
                          Change your administrator
                          password.
                        </p>

                      </div>

                    </div>


                    <div className="admin-settings-form">


                      <label>
                        Current Password
                      </label>

                      <div className="admin-settings-input">

                        <ShieldCheck
                          size={17}
                        />

                        <input
                          type="password"
                          value={
                            currentPassword
                          }
                          onChange={(event) =>
                            setCurrentPassword(
                              event.target.value
                            )
                          }
                          placeholder="Current password"
                        />

                      </div>


                      <label>
                        New Password
                      </label>

                      <div className="admin-settings-input">

                        <ShieldCheck
                          size={17}
                        />

                        <input
                          type="password"
                          value={
                            newPassword
                          }
                          onChange={(event) =>
                            setNewPassword(
                              event.target.value
                            )
                          }
                          placeholder="Minimum 6 characters"
                        />

                      </div>


                      <label>
                        Confirm New Password
                      </label>

                      <div className="admin-settings-input">

                        <ShieldCheck
                          size={17}
                        />

                        <input
                          type="password"
                          value={
                            confirmPassword
                          }
                          onChange={(event) =>
                            setConfirmPassword(
                              event.target.value
                            )
                          }
                          placeholder="Confirm new password"
                        />

                      </div>


                      <button
                        type="submit"
                        className="admin-settings-save"
                        disabled={
                          settingsLoading
                        }
                      >

                        {settingsLoading
                          ? 'Updating...'
                          : 'Change Password'}

                      </button>

                    </div>

                  </form>

                )}

              </div>

            </div>

          </section>

        )}

      </main>


      {/* ===================================================
          TESTIMONIAL MODAL
      =================================================== */}

      {testimonialModalOpen && (

        <div
          className="admin-modal-overlay"
          onClick={
            closeTestimonialModal
          }
        >

          <div
            className="admin-project-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              maxWidth:
                '650px'
            }}
          >

            <div className="admin-modal-header">

              <div>

                <span>
                  CLIENT EXPERIENCE
                </span>

                <h2>

                  {editingTestimonial
                    ? 'Edit Testimonial'
                    : 'Add Testimonial'}

                </h2>

              </div>


              <button
                type="button"
                onClick={
                  closeTestimonialModal
                }
                disabled={
                  testimonialSaving
                }
              >

                <X
                  size={19}
                />

              </button>

            </div>


            <form
              onSubmit={
                handleTestimonialSubmit
              }
              style={{
                paddingTop:
                  '10px'
              }}
            >


              {/* CLIENT NAME */}

              <div
                className="admin-settings-form"
                style={{
                  gap:
                    '8px'
                }}
              >

                <label>
                  Client Name *
                </label>

                <div className="admin-settings-input">

                  <UserRound
                    size={17}
                  />

                  <input
                    type="text"
                    name="name"
                    value={
                      testimonialForm.name
                    }
                    onChange={
                      handleTestimonialChange
                    }
                    placeholder="e.g. Rahul Sharma"
                    required
                    disabled={
                      testimonialSaving
                    }
                  />

                </div>


                {/* ORGANIZATION */}

                <label>
                  Organization *
                </label>

                <div className="admin-settings-input">

                  <UsersRound
                    size={17}
                  />

                  <input
                    type="text"
                    name="organization"
                    value={
                      testimonialForm.organization
                    }
                    onChange={
                      handleTestimonialChange
                    }
                    placeholder="e.g. ABC Technologies"
                    required
                    disabled={
                      testimonialSaving
                    }
                  />

                </div>


                {/* RATING */}

                <label>
                  Rating *
                </label>

                <div
                  style={{
                    display:
                      'flex',
                    alignItems:
                      'center',
                    gap:
                      '7px',
                    padding:
                      '8px 0'
                  }}
                >

                  {[
                    1,
                    2,
                    3,
                    4,
                    5
                  ].map(
                    (star) => (

                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setTestimonialForm(
                            (current) => ({
                              ...current,
                              rating:
                                star
                            })
                          )
                        }
                        disabled={
                          testimonialSaving
                        }
                        aria-label={
                          `${star} star rating`
                        }
                        style={{
                          border:
                            'none',
                          background:
                            'transparent',
                          padding:
                            '2px',
                          cursor:
                            'pointer',
                          color:
                            'inherit'
                        }}
                      >

                        <Star
                          size={27}
                          fill={
                            star <=
                            Number(
                              testimonialForm.rating
                            )
                              ? 'currentColor'
                              : 'none'
                          }
                        />

                      </button>

                    )
                  )}

                  <span
                    style={{
                      marginLeft:
                        '6px',
                      opacity:
                        0.7
                    }}
                  >
                    {testimonialForm.rating}/5
                  </span>

                </div>


                {/* DESCRIPTION */}

                <label>
                  Testimonial Description *
                </label>

                <textarea
                  name="description"
                  value={
                    testimonialForm.description
                  }
                  onChange={
                    handleTestimonialChange
                  }
                  placeholder="Write the client's testimonial..."
                  rows={6}
                  required
                  disabled={
                    testimonialSaving
                  }
                  style={{
                    width:
                      '100%',
                    resize:
                      'vertical',
                    padding:
                      '13px 14px',
                    borderRadius:
                      '10px',
                    border:
                      '1px solid rgba(255,255,255,0.1)',
                    background:
                      'rgba(255,255,255,0.03)',
                    color:
                      'inherit',
                    fontFamily:
                      'inherit',
                    outline:
                      'none'
                  }}
                />


                {/* ACTIVE */}

                <label
                  style={{
                    display:
                      'flex',
                    alignItems:
                      'center',
                    gap:
                      '10px',
                    cursor:
                      'pointer',
                    marginTop:
                      '5px'
                  }}
                >

                  <input
                    type="checkbox"
                    name="is_active"
                    checked={
                      testimonialForm.is_active
                    }
                    onChange={
                      handleTestimonialChange
                    }
                    disabled={
                      testimonialSaving
                    }
                  />

                  <span>
                    Display this testimonial
                    on the website
                  </span>

                </label>


                {/* BUTTONS */}

                <div
                  style={{
                    display:
                      'flex',
                    justifyContent:
                      'flex-end',
                    gap:
                      '10px',
                    marginTop:
                      '10px'
                  }}
                >

                  <button
                    type="button"
                    onClick={
                      closeTestimonialModal
                    }
                    disabled={
                      testimonialSaving
                    }
                    style={{
                      padding:
                        '11px 17px',
                      borderRadius:
                        '9px',
                      border:
                        '1px solid rgba(255,255,255,0.1)',
                      background:
                        'rgba(255,255,255,0.04)',
                      color:
                        'inherit',
                      cursor:
                        'pointer'
                    }}
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    className="admin-settings-save"
                    disabled={
                      testimonialSaving
                    }
                    style={{
                      width:
                        'auto',
                      padding:
                        '11px 18px'
                    }}
                  >

                    {testimonialSaving
                      ? 'Saving...'
                      : editingTestimonial
                        ? 'Update Testimonial'
                        : 'Add Testimonial'}

                  </button>

                </div>

              </div>

            </form>

          </div>

        </div>

      )}



      {/* ===================================================
          JOB CREATE / EDIT MODAL
      =================================================== */}

      {jobModalOpen && (
        <div
          className="admin-modal-overlay"
          onClick={closeJobModal}
        >
          <div
            className="admin-project-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              maxWidth: '760px'
            }}
          >

            <div className="admin-modal-header">
              <div>
                <span>TALENT ACQUISITION</span>
                <h2>
                  {editingJob
                    ? 'Edit Job Posting'
                    : 'Create Job Posting'}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeJobModal}
              >
                <X size={19} />
              </button>
            </div>


            <form
              onSubmit={handleJobSubmit}
              style={{
                display: 'grid',
                gap: '15px'
              }}
            >

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(2, minmax(0, 1fr))',
                  gap: '14px'
                }}
              >

                <div>
                  <label>Position Name *</label>
                  <input
                    name="position_name"
                    value={
                      jobForm.position_name
                    }
                    onChange={handleJobChange}
                    placeholder="e.g. Full Stack Developer"
                    required
                    disabled={jobSaving}
                  />
                </div>

                <div>
                  <label>Location *</label>
                  <input
                    name="location"
                    value={jobForm.location}
                    onChange={handleJobChange}
                    placeholder="e.g. Amravati / Remote"
                    required
                    disabled={jobSaving}
                  />
                </div>

              </div>


              <div>
                <label>Employment Type *</label>

                <select
                  name="employment_type"
                  value={
                    jobForm.employment_type
                  }
                  onChange={handleJobChange}
                  disabled={jobSaving}
                >
                  <option value="Full Time">
                    Full Time
                  </option>
                  <option value="Part Time">
                    Part Time
                  </option>
                  <option value="Internship">
                    Internship
                  </option>
                  <option value="Contract">
                    Contract
                  </option>
                  <option value="Freelance">
                    Freelance
                  </option>
                </select>
              </div>


              <div>
                <label>Short Description *</label>

                <textarea
                  name="short_description"
                  value={
                    jobForm.short_description
                  }
                  onChange={handleJobChange}
                  placeholder="Short text displayed on the JobCard..."
                  rows={3}
                  required
                  disabled={jobSaving}
                />
              </div>


              <div>
                <label>Full Job Description *</label>

                <textarea
                  name="description"
                  value={
                    jobForm.description
                  }
                  onChange={handleJobChange}
                  placeholder="Responsibilities, requirements, qualifications, benefits..."
                  rows={8}
                  required
                  disabled={jobSaving}
                />
              </div>


              <div>
                <label>Tags</label>

                <input
                  name="tags"
                  value={jobForm.tags}
                  onChange={handleJobChange}
                  placeholder="React, Node.js, PostgreSQL, JavaScript"
                  disabled={jobSaving}
                />

                <small
                  style={{
                    display: 'block',
                    marginTop: '6px',
                    opacity: 0.55
                  }}
                >
                  Separate tags with commas.
                </small>
              </div>


              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  name="is_active"
                  checked={
                    jobForm.is_active
                  }
                  onChange={handleJobChange}
                  disabled={jobSaving}
                />

                <span>
                  Publish this job on the Careers page
                </span>
              </label>


              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px'
                }}
              >

                <button
                  type="button"
                  onClick={closeJobModal}
                  disabled={jobSaving}
                  style={{
                    padding: '11px 17px',
                    borderRadius: '9px',
                    border:
                      '1px solid rgba(255,255,255,0.1)',
                    background:
                      'rgba(255,255,255,0.04)',
                    color: 'inherit',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-settings-save"
                  disabled={jobSaving}
                  style={{
                    width: 'auto',
                    padding: '11px 18px'
                  }}
                >
                  {jobSaving
                    ? 'Saving...'
                    : editingJob
                      ? 'Update Job'
                      : 'Publish Job'}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}


      {/* ===================================================
          APPLICATION DETAIL MODAL
      =================================================== */}

      {selectedApplication && (
        <div
          className="admin-modal-overlay"
          onClick={() =>
            setSelectedApplication(null)
          }
        >
          <div
            className="admin-project-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              maxWidth: '920px'
            }}
          >

            <div className="admin-modal-header">

              <div>
                <span>JOB APPLICATION</span>
                <h2>
                  {
                    selectedApplication.application_number ||
                    'Application'
                  }
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedApplication(null)
                }
              >
                <X size={19} />
              </button>

            </div>


            <div className="admin-modal-client">

              <div className="admin-modal-avatar">
                {(
                  selectedApplication.first_name ||
                  'C'
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <h3>
                  {[
                    selectedApplication.first_name,
                    selectedApplication.last_name
                  ]
                    .filter(Boolean)
                    .join(' ') ||
                    'Candidate'}
                </h3>

                <span>
                  {
                    selectedApplication.email ||
                    'No email'
                  }
                </span>
              </div>

            </div>


            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '12px',
                marginTop: '20px'
              }}
            >

              {[
                [
                  'POSITION',
                  selectedApplication.position_name ||
                    selectedApplication.job?.position_name ||
                    selectedApplication.job_title ||
                    'Not provided'
                ],
                [
                  'PHONE',
                  selectedApplication.phone ||
                    'Not provided'
                ],
                [
                  'DATE OF BIRTH',
                  selectedApplication.date_of_birth ||
                    'Not provided'
                ],
                [
                  'GENDER',
                  selectedApplication.gender ||
                    'Not provided'
                ],
                [
                  'LOCATION',
                  selectedApplication.current_location ||
                    'Not provided'
                ],
                [
                  'EXPERIENCE',
                  selectedApplication.experience ||
                    'Not provided'
                ],
                [
                  'QUALIFICATION',
                  selectedApplication.highest_qualification ||
                    'Not provided'
                ],
                [
                  'UNIVERSITY',
                  selectedApplication.university ||
                    'Not provided'
                ],
                [
                  'GRADUATION YEAR',
                  selectedApplication.graduation_year ||
                    'Not provided'
                ],
                [
                  'CURRENT COMPANY',
                  selectedApplication.current_company ||
                    'Not provided'
                ],
                [
                  'CURRENT ROLE',
                  selectedApplication.current_job_title ||
                    'Not provided'
                ],
                [
                  'EXPECTED SALARY',
                  selectedApplication.expected_salary ||
                    'Not provided'
                ],
                [
                  'NOTICE PERIOD',
                  selectedApplication.notice_period ||
                    'Not provided'
                ],
                [
                  'APPLIED',
                  formatDate(
                    selectedApplication.created_at
                  )
                ]
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    padding: '13px',
                    borderRadius: '10px',
                    border:
                      '1px solid rgba(255,255,255,0.08)',
                    background:
                      'rgba(255,255,255,0.025)'
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      letterSpacing: '1.2px',
                      opacity: 0.5,
                      marginBottom: '5px'
                    }}
                  >
                    {label}
                  </span>

                  <strong
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      wordBreak:
                        'break-word'
                    }}
                  >
                    {value}
                  </strong>
                </div>
              ))}

            </div>


            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px',
                marginTop: '16px'
              }}
            >

              {[
                [
                  'LINKEDIN',
                  selectedApplication.linkedin_url
                ],
                [
                  'GITHUB',
                  selectedApplication.github_url
                ],
                [
                  'PORTFOLIO',
                  selectedApplication.portfolio_url
                ]
              ].map(([label, url]) => (
                <div
                  key={label}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    border:
                      '1px solid rgba(255,255,255,0.08)',
                    background:
                      'rgba(255,255,255,0.025)'
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      letterSpacing: '1.2px',
                      opacity: 0.5,
                      marginBottom: '7px'
                    }}
                  >
                    {label}
                  </span>

                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display:
                          'inline-flex',
                        alignItems:
                          'center',
                        gap: '6px',
                        color:
                          '#8edfff',
                        textDecoration:
                          'none',
                        fontSize: '13px'
                      }}
                    >
                      <ExternalLink
                        size={14}
                      />
                      Open Link
                    </a>
                  ) : (
                    <span
                      style={{
                        opacity: 0.55,
                        fontSize: '13px'
                      }}
                    >
                      Not provided
                    </span>
                  )}
                </div>
              ))}

            </div>


            <div
              style={{
                marginTop: '16px',
                padding: '15px',
                borderRadius: '10px',
                border:
                  '1px solid rgba(255,255,255,0.08)',
                background:
                  'rgba(255,255,255,0.025)'
              }}
            >

              <span
                style={{
                  display: 'block',
                  fontSize: '10px',
                  letterSpacing: '1.2px',
                  opacity: 0.5,
                  marginBottom: '8px'
                }}
              >
                SKILLS
              </span>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '7px'
                }}
              >

                {(Array.isArray(
                  selectedApplication.skills
                )
                  ? selectedApplication.skills
                  : []
                ).map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    style={{
                      padding:
                        '6px 9px',
                      borderRadius:
                        '7px',
                      background:
                        'rgba(80,150,255,0.08)',
                      border:
                        '1px solid rgba(80,150,255,0.14)',
                      fontSize:
                        '12px'
                    }}
                  >
                    {skill}
                  </span>
                ))}

                {(!Array.isArray(
                  selectedApplication.skills
                ) ||
                  selectedApplication.skills
                    .length === 0) && (
                  <span
                    style={{
                      opacity: 0.55
                    }}
                  >
                    Not provided
                  </span>
                )}

              </div>
            </div>


            {selectedApplication.cover_letter && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '15px',
                  borderRadius: '10px',
                  border:
                    '1px solid rgba(255,255,255,0.08)',
                  background:
                    'rgba(255,255,255,0.025)'
                }}
              >

                <span
                  style={{
                    display: 'block',
                    fontSize: '10px',
                    letterSpacing:
                      '1.2px',
                    opacity: 0.5,
                    marginBottom:
                      '8px'
                  }}
                >
                  COVER LETTER
                </span>

                <p
                  style={{
                    margin: 0,
                    lineHeight: 1.7,
                    whiteSpace:
                      'pre-wrap',
                    opacity: 0.82
                  }}
                >
                  {
                    selectedApplication.cover_letter
                  }
                </p>

              </div>
            )}


            <div className="admin-modal-actions">

              <div className="admin-modal-status">

                <span>STATUS</span>

                <select
                  value={
                    selectedApplication.status ||
                    'new'
                  }
                  onChange={(event) =>
                    handleApplicationStatusChange(
                      selectedApplication.id,
                      event.target.value
                    )
                  }
                >
                  <option value="new">
                    New
                  </option>
                  <option value="reviewing">
                    Reviewing
                  </option>
                  <option value="shortlisted">
                    Shortlisted
                  </option>
                  <option value="interview">
                    Interview
                  </option>
                  <option value="selected">
                    Selected
                  </option>
                  <option value="rejected">
                    Rejected
                  </option>
                  <option value="withdrawn">
                    Withdrawn
                  </option>
                </select>

              </div>


             {selectedApplication.resume_url && (
  <a
    href={getResumeUrl(selectedApplication.resume_url)}
    target="_blank"
    rel="noopener noreferrer"
    className="admin-settings-save"
    style={{
      width: 'auto',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '7px',
      textDecoration: 'none',
      padding: '10px 15px'
    }}
  >
    <FileDown size={16} />
    View / Download Resume
  </a>
)}


              <button
                type="button"
                className="admin-settings-save"
                onClick={() =>
                  printRecord(
                    'application',
                    selectedApplication
                  )
                }
                style={{
                  width: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '10px 15px'
                }}
              >
                <Printer size={16} />
                Print Application
              </button>


              <button
                type="button"
                className="admin-delete-button"
                onClick={() =>
                  handleDeleteApplication(
                    selectedApplication.id
                  )
                }
              >
                <Trash2 size={16} />
                Delete Application
              </button>

            </div>

          </div>
        </div>
      )}


      {/* ===================================================
          PROJECT DETAIL MODAL
      =================================================== */}

      {selectedProject && (

        <div
          className="admin-modal-overlay"
          onClick={() =>
            setSelectedProject(
              null
            )
          }
        >

          <div
            className="admin-project-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <span>
                  PROJECT ENQUIRY
                </span>

                <h2>
                  Enquiry #
                  {
                    selectedProject.id
                  }
                </h2>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedProject(
                    null
                  )
                }
              >

                <X
                  size={19}
                />

              </button>

            </div>


            <div className="admin-modal-client">

              <div className="admin-modal-avatar">

                {selectedProject.full_name
                  ?.charAt(0)
                  ?.toUpperCase()}

              </div>


              <div>

                <h3>
                  {
                    selectedProject.full_name
                  }
                </h3>

                <span>
                  {
                    selectedProject.email
                  }
                </span>

              </div>

            </div>


            <div className="admin-modal-grid">


              <div>

                <span>
                  PHONE
                </span>

                <strong>
                  {
                    selectedProject.phone ||
                    'Not provided'
                  }
                </strong>

              </div>


              <div>

                <span>
                  COMPANY
                </span>

                <strong>
                  {
                    selectedProject.company ||
                    'Individual'
                  }
                </strong>

              </div>


              <div>

                <span>
                  PROJECT TYPE
                </span>

                <strong>
                  {
                    selectedProject.project_type
                  }
                </strong>

              </div>


              <div>

                <span>
                  BUDGET
                </span>

                <strong>
                  {
                    selectedProject.budget ||
                    'Not specified'
                  }
                </strong>

              </div>


              <div>

                <span>
                  TIMELINE
                </span>

                <strong>
                  {
                    selectedProject.timeline ||
                    'Not specified'
                  }
                </strong>

              </div>


              <div>

                <span>
                  RECEIVED
                </span>

                <strong>
                  {formatDate(
                    selectedProject.created_at
                  )}
                </strong>

              </div>

            </div>


            <div className="admin-modal-description">

              <span>
                PROJECT DESCRIPTION
              </span>

              <p>
                {
                  selectedProject.project_description
                }
              </p>

            </div>


            <div className="admin-modal-actions">

              <div className="admin-modal-status">

                <span>
                  STATUS
                </span>


                <select
                  value={
                    selectedProject.status
                  }
                  onChange={(event) =>
                    handleStatusChange(
                      selectedProject.id,
                      event.target.value
                    )
                  }
                >

                  <option value="new">
                    New
                  </option>

                  <option value="contacted">
                    Contacted
                  </option>

                  <option value="in_progress">
                    In Progress
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>

                </select>

              </div>


              <button
                type="button"
                className="admin-settings-save"
                onClick={() =>
                  printRecord(
                    'enquiry',
                    selectedProject
                  )
                }
                style={{
                  width: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '10px 15px'
                }}
              >
                <Printer size={16} />
                Print Enquiry
              </button>


              <button
                type="button"
                className="admin-delete-button"
                onClick={() =>
                  handleDelete(
                    selectedProject.id
                  )
                }
              >

                <Trash2
                  size={16}
                />

                Delete Enquiry

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}


export default AdminDashboard;