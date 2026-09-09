import { useEffect, useState } from 'react';

import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  FileText,
  GraduationCap,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Upload,
  UserRound,
  X,
} from 'lucide-react';

import { FaGithub, FaLinkedin } from 'react-icons/fa';

import './JobApplication.css';


/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000';


/* =========================================================
   JOB APPLICATION
========================================================= */

function JobApplication({ job, onClose }) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    current_location: '',

    current_job_title: '',
    experience: '',
    highest_qualification: '',
    university: '',
    graduation_year: '',
    current_company: '',
    expected_salary: '',
    notice_period: '',

    skills: '',

    linkedin_url: '',
    github_url: '',
    portfolio_url: '',

    cover_letter: '',

    consent: false,
  });

  const [resume, setResume] = useState(null);

  const [errors, setErrors] = useState({});

  const [submitting, setSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState('');

  const [successData, setSuccessData] = useState(null);


  /* =========================================================
     BODY SCROLL LOCK
  ========================================================= */

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, []);


  /* =========================================================
     ESC KEY TO CLOSE
  ========================================================= */

  useEffect(() => {
    const handleEscape = (event) => {
      if (
        event.key === 'Escape' &&
        !submitting
      ) {
        onClose?.();
      }
    };

    window.addEventListener(
      'keydown',
      handleEscape
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleEscape
      );
    };
  }, [onClose, submitting]);


  /* =========================================================
     HANDLE INPUT
  ========================================================= */

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,

      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: '',
      }));
    }

    if (submitError) {
      setSubmitError('');
    }
  };


  /* =========================================================
     HANDLE RESUME
  ========================================================= */

  const handleResumeChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedExtensions = [
      '.pdf',
      '.doc',
      '.docx',
    ];

    const fileName =
      file.name.toLowerCase();

    const hasValidExtension =
      allowedExtensions.some(
        (extension) =>
          fileName.endsWith(extension)
      );

    const maxSize =
      5 * 1024 * 1024;

    if (!hasValidExtension) {
      setErrors((current) => ({
        ...current,

        resume:
          'Please upload a PDF, DOC, or DOCX file.',
      }));

      setResume(null);

      event.target.value = '';

      return;
    }

    if (file.size > maxSize) {
      setErrors((current) => ({
        ...current,

        resume:
          'Resume must be smaller than 5 MB.',
      }));

      setResume(null);

      event.target.value = '';

      return;
    }

    setResume(file);

    setErrors((current) => ({
      ...current,
      resume: '',
    }));

    setSubmitError('');
  };


  /* =========================================================
     VALIDATION
  ========================================================= */

  const validateForm = () => {
    const newErrors = {};

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!form.first_name.trim()) {
      newErrors.first_name =
        'First name is required.';
    }


    if (!form.last_name.trim()) {
      newErrors.last_name =
        'Last name is required.';
    }


    if (!form.email.trim()) {
      newErrors.email =
        'Email address is required.';
    } else if (
      !emailPattern.test(
        form.email.trim()
      )
    ) {
      newErrors.email =
        'Please enter a valid email address.';
    }


    if (!form.phone.trim()) {
      newErrors.phone =
        'Phone number is required.';
    }


    if (!form.current_location.trim()) {
      newErrors.current_location =
        'Current location is required.';
    }


    if (
      !form.highest_qualification.trim()
    ) {
      newErrors.highest_qualification =
        'Highest qualification is required.';
    }


    if (!resume) {
      newErrors.resume =
        'Please upload your resume.';
    }


    if (!form.consent) {
      newErrors.consent =
        'Please confirm that the information provided is accurate.';
    }


    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };


  /* =========================================================
     SUBMIT APPLICATION
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    if (!job?.id) {
      setSubmitError(
        'Unable to identify the selected position.'
      );

      return;
    }


    try {
      setSubmitting(true);


      const formData =
        new FormData();


      /* =====================================================
         PERSONAL INFORMATION
      ===================================================== */

      formData.append(
        'first_name',
        form.first_name.trim()
      );

      formData.append(
        'last_name',
        form.last_name.trim()
      );

      formData.append(
        'email',
        form.email.trim()
      );

      formData.append(
        'phone',
        form.phone.trim()
      );

      formData.append(
        'date_of_birth',
        form.date_of_birth
      );

      formData.append(
        'gender',
        form.gender
      );

      formData.append(
        'current_location',
        form.current_location.trim()
      );


      /* =====================================================
         PROFESSIONAL INFORMATION
      ===================================================== */

      formData.append(
        'current_job_title',
        form.current_job_title.trim()
      );

      formData.append(
        'experience',
        form.experience
      );

      formData.append(
        'highest_qualification',
        form.highest_qualification.trim()
      );

      formData.append(
        'university',
        form.university.trim()
      );

      formData.append(
        'graduation_year',
        form.graduation_year.trim()
      );

      formData.append(
        'current_company',
        form.current_company.trim()
      );

      formData.append(
        'expected_salary',
        form.expected_salary.trim()
      );

      formData.append(
        'notice_period',
        form.notice_period
      );


      /* =====================================================
         SKILLS
      ===================================================== */

      const skills =
        form.skills
          .split(',')
          .map((skill) =>
            skill.trim()
          )
          .filter(Boolean);

      formData.append(
        'skills',
        JSON.stringify(skills)
      );


      /* =====================================================
         PROFILE LINKS
      ===================================================== */

      formData.append(
        'linkedin_url',
        form.linkedin_url.trim()
      );

      formData.append(
        'github_url',
        form.github_url.trim()
      );

      formData.append(
        'portfolio_url',
        form.portfolio_url.trim()
      );


      /* =====================================================
         COVER LETTER
      ===================================================== */

      formData.append(
        'cover_letter',
        form.cover_letter.trim()
      );


      /* =====================================================
         CONSENT
      ===================================================== */

      formData.append(
        'consent',
        String(form.consent)
      );


      /* =====================================================
         RESUME
      ===================================================== */

      formData.append(
        'resume',
        resume
      );


      /* =====================================================
         API REQUEST
      ===================================================== */

      const response =
        await fetch(
          `${API_BASE_URL}/api/jobs/${job.id}/applications`,
          {
            method: 'POST',
            body: formData,
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
          `Unable to submit your application. (${response.status})`
        );
      }


      /* =====================================================
         SUCCESS DATA
      ===================================================== */

      const applicationNumber =
        data?.applicationNumber ||
        data?.application?.application_number ||
        data?.application?.applicationNumber ||
        'Generated successfully';


      const position =
        data?.application?.position_name ||
        data?.application?.job?.position_name ||
        job?.position_name ||
        'Selected Position';


      setSuccessData({
        applicationNumber,
        position,
      });


      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });


    } catch (error) {
      console.error(
        'Job application error:',
        error
      );

      setSubmitError(
        error?.message ||
        'Something went wrong. Please try again.'
      );

    } finally {
      setSubmitting(false);
    }
  };


  /* =========================================================
     SUCCESS SCREEN
  ========================================================= */

  if (successData) {
    return (
      <div
        className="job-application-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-success-title"
      >

        <div
          className="
            job-application-modal
            job-application-success-modal
          "
        >

          <button
            type="button"
            className="job-application-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={21} />
          </button>


          <div className="job-success-content">

            <div className="job-success-icon">
              <Check size={34} />
            </div>


            <span className="job-success-eyebrow">
              APPLICATION RECEIVED
            </span>


            <h2 id="job-success-title">
              Application
              <span> Submitted.</span>
            </h2>


            <p className="job-success-description">
              Thank you for applying to
              Vyntara Technologies. Your
              application has been successfully
              received by our recruitment team.
            </p>


            <div className="job-application-number">

              <span>
                APPLICATION NUMBER
              </span>

              <strong>
                {successData.applicationNumber}
              </strong>

            </div>


            <div className="job-success-position">

              <BriefcaseBusiness size={17} />

              <div>

                <span>
                  Applied Position
                </span>

                <strong>
                  {successData.position}
                </strong>

              </div>

            </div>


            <p className="job-success-note">
              Please save your application
              number for future reference. Our
              team will review your profile and
              contact you if your application
              moves forward.
            </p>


            <button
              type="button"
              className="job-success-button"
              onClick={onClose}
            >
              Done

              <ArrowRight size={17} />
            </button>

          </div>

        </div>

      </div>
    );
  }


  /* =========================================================
     APPLICATION FORM
  ========================================================= */

  return (
    <div
      className="job-application-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-application-title"
    >

      <div className="job-application-modal">


        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="job-application-header">

          <div>

            <span className="job-application-eyebrow">
              JOIN VYNTARA
            </span>


            <h2 id="job-application-title">
              Apply for this
              <span> position.</span>
            </h2>


            <p>
              Tell us about yourself and your
              experience. We would love to hear
              from you.
            </p>

          </div>


          <button
            type="button"
            className="job-application-close"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close application form"
          >
            <X size={21} />
          </button>

        </div>


        {/* ===================================================
            SELECTED JOB
        =================================================== */}

        <div className="job-selected-position">

          <div className="job-selected-icon">
            <BriefcaseBusiness size={22} />
          </div>


          <div className="job-selected-info">

            <span>
              APPLYING FOR
            </span>


            <h3>
              {job?.position_name ||
                'Selected Position'}
            </h3>


            <div className="job-selected-meta">

              <span>
                <MapPin size={14} />

                {job?.location ||
                  'India'}
              </span>


              <span>
                <BriefcaseBusiness size={14} />

                {job?.employment_type ||
                  'Full Time'}
              </span>

            </div>

          </div>

        </div>


        {/* ===================================================
            FORM
        =================================================== */}

        <form
          className="job-application-form"
          onSubmit={handleSubmit}
          noValidate
        >


          {/* =================================================
              STEP 01
          ================================================= */}

          <div className="job-form-section">

            <div className="job-form-section-heading">

              <div className="job-form-section-icon">
                <UserRound size={18} />
              </div>


              <div>

                <span>
                  STEP 01
                </span>

                <h3>
                  Personal Information
                </h3>

              </div>

            </div>


            <div className="job-form-grid">

              <FormField
                label="First Name"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                error={errors.first_name}
                required
              />


              <FormField
                label="Last Name"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                error={errors.last_name}
                required
              />


              <FormField
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                icon={<Mail size={16} />}
                required
              />


              <FormField
                label="Phone Number"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
                icon={<Phone size={16} />}
                required
              />


              <FormField
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                value={form.date_of_birth}
                onChange={handleChange}
              />


              <div className="job-form-field">

                <label htmlFor="gender">
                  Gender
                </label>


                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Non-binary">
                    Non-binary
                  </option>

                  <option value="Prefer not to say">
                    Prefer not to say
                  </option>

                </select>

              </div>


              <FormField
                label="Current Location"
                name="current_location"
                value={form.current_location}
                onChange={handleChange}
                error={errors.current_location}
                icon={<MapPin size={16} />}
                required
                full
              />

            </div>

          </div>


          {/* =================================================
              STEP 02
          ================================================= */}

          <div className="job-form-section">

            <div className="job-form-section-heading">

              <div className="job-form-section-icon">
                <GraduationCap size={18} />
              </div>


              <div>

                <span>
                  STEP 02
                </span>

                <h3>
                  Professional Information
                </h3>

              </div>

            </div>


            <div className="job-form-grid">

              <FormField
                label="Current Job Title"
                name="current_job_title"
                value={form.current_job_title}
                onChange={handleChange}
                placeholder="e.g. Software Developer"
              />


              <div className="job-form-field">

                <label htmlFor="experience">
                  Total Experience
                </label>


                <select
                  id="experience"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Experience
                  </option>

                  <option value="Fresher">
                    Fresher
                  </option>

                  <option value="Less than 1 year">
                    Less than 1 year
                  </option>

                  <option value="1-2 years">
                    1–2 years
                  </option>

                  <option value="2-4 years">
                    2–4 years
                  </option>

                  <option value="4-7 years">
                    4–7 years
                  </option>

                  <option value="7+ years">
                    7+ years
                  </option>

                </select>

              </div>


              <FormField
                label="Highest Qualification"
                name="highest_qualification"
                value={form.highest_qualification}
                onChange={handleChange}
                error={
                  errors.highest_qualification
                }
                placeholder="e.g. M.Tech Computer Science"
                required
              />


              <FormField
                label="University / Institute"
                name="university"
                value={form.university}
                onChange={handleChange}
                placeholder="University / College"
              />


              <FormField
                label="Graduation Year"
                name="graduation_year"
                value={form.graduation_year}
                onChange={handleChange}
                placeholder="e.g. 2025"
              />


              <FormField
                label="Current / Last Company"
                name="current_company"
                value={form.current_company}
                onChange={handleChange}
                placeholder="Company name"
              />


              <FormField
                label="Expected Salary"
                name="expected_salary"
                value={form.expected_salary}
                onChange={handleChange}
                placeholder="e.g. ₹8 LPA"
              />


              <div className="job-form-field">

                <label htmlFor="notice_period">
                  Notice Period
                </label>


                <select
                  id="notice_period"
                  name="notice_period"
                  value={form.notice_period}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Notice Period
                  </option>

                  <option value="Immediate">
                    Immediate
                  </option>

                  <option value="15 days">
                    15 days
                  </option>

                  <option value="30 days">
                    30 days
                  </option>

                  <option value="60 days">
                    60 days
                  </option>

                  <option value="90 days">
                    90 days
                  </option>

                </select>

              </div>

            </div>

          </div>


          {/* =================================================
              STEP 03
          ================================================= */}

          <div className="job-form-section">

            <div className="job-form-section-heading">

              <div className="job-form-section-icon">
                <BriefcaseBusiness size={18} />
              </div>


              <div>

                <span>
                  STEP 03
                </span>

                <h3>
                  Skills & Profiles
                </h3>

              </div>

            </div>


            <div className="job-form-single">

              <div className="job-form-field">

                <label htmlFor="skills">
                  Technical Skills
                </label>


                <input
                  id="skills"
                  name="skills"
                  type="text"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, PostgreSQL, JavaScript"
                />


                <small>
                  Separate multiple skills
                  with commas.
                </small>

              </div>


              <div className="job-profile-links">


                {/* LinkedIn */}

                <div className="job-form-field">

                  <label htmlFor="linkedin_url">

                    <FaLinkedin size={15} />

                    LinkedIn Profile

                  </label>


                  <input
                    id="linkedin_url"
                    name="linkedin_url"
                    type="url"
                    value={form.linkedin_url}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/your-profile"
                  />

                </div>


                {/* GitHub */}

                <div className="job-form-field">

                  <label htmlFor="github_url">

                    <FaGithub size={15} />

                    GitHub Profile

                  </label>


                  <input
                    id="github_url"
                    name="github_url"
                    type="url"
                    value={form.github_url}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                  />

                </div>


                {/* Portfolio */}

                <div className="job-form-field">

                  <label htmlFor="portfolio_url">

                    <BriefcaseBusiness size={15} />

                    Portfolio Website

                  </label>


                  <input
                    id="portfolio_url"
                    name="portfolio_url"
                    type="url"
                    value={form.portfolio_url}
                    onChange={handleChange}
                    placeholder="https://yourportfolio.com"
                  />

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              STEP 04
          ================================================= */}

          <div className="job-form-section">

            <div className="job-form-section-heading">

              <div className="job-form-section-icon">
                <FileText size={18} />
              </div>


              <div>

                <span>
                  STEP 04
                </span>

                <h3>
                  Resume
                </h3>

              </div>

            </div>


            <div className="job-resume-upload">

              <input
                id="resume"
                name="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
              />


              <label htmlFor="resume">

                <div className="job-upload-icon">
                  <Upload size={22} />
                </div>


                <div>

                  <strong>
                    {resume
                      ? resume.name
                      : 'Upload your resume'}
                  </strong>


                  <span>
                    {resume
                      ? `${(
                          resume.size /
                          1024 /
                          1024
                        ).toFixed(2)} MB`
                      : 'PDF, DOC or DOCX • Maximum 5 MB'}
                  </span>

                </div>


                <div className="job-upload-button">
                  {resume
                    ? 'Change'
                    : 'Choose File'}
                </div>

              </label>

            </div>


            {errors.resume && (
              <span className="job-field-error">
                {errors.resume}
              </span>
            )}

          </div>


          {/* =================================================
              STEP 05
          ================================================= */}

          <div className="job-form-section">

            <div className="job-form-section-heading">

              <div className="job-form-section-icon">
                <FileText size={18} />
              </div>


              <div>

                <span>
                  STEP 05
                </span>

                <h3>
                  Cover Letter
                </h3>

              </div>

            </div>


            <div className="job-form-field">

              <label htmlFor="cover_letter">
                Why should we consider you?
              </label>


              <textarea
                id="cover_letter"
                name="cover_letter"
                value={form.cover_letter}
                onChange={handleChange}
                rows="7"
                placeholder="Tell us about your experience, strengths, projects and why you would like to join Vyntara Technologies..."
              />

            </div>

          </div>


          {/* =================================================
              CONSENT
          ================================================= */}

          <div className="job-consent">

            <label className="job-checkbox">

              <input
                type="checkbox"
                name="consent"
                checked={form.consent}
                onChange={handleChange}
              />


              <span className="job-checkbox-box">
                <Check size={13} />
              </span>


              <span className="job-checkbox-text">
                I confirm that the information
                provided above is accurate and
                may be used by Vyntara Technologies
                for recruitment purposes.
              </span>

            </label>


            {errors.consent && (
              <span className="job-field-error">
                {errors.consent}
              </span>
            )}

          </div>


          {/* =================================================
              SUBMIT ERROR
          ================================================= */}

          {submitError && (
            <div className="job-submit-error">

              <X size={17} />

              <span>
                {submitError}
              </span>

            </div>
          )}


          {/* =================================================
              FORM ACTIONS
          ================================================= */}

          <div className="job-form-submit">

            <button
              type="button"
              className="job-cancel-button"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="job-submit-button"
              disabled={submitting}
            >

              {submitting ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="job-submit-spinner"
                  />

                  Submitting Application...
                </>
              ) : (
                <>
                  Submit Application

                  <ArrowRight size={18} />
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}


/* =========================================================
   FORM FIELD COMPONENT
========================================================= */

function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  icon,
  required = false,
  full = false,
}) {

  return (
    <div
      className={`job-form-field ${
        full
          ? 'job-form-field-full'
          : ''
      }`}
    >

      <label htmlFor={name}>

        {label}

        {required && (
          <span className="job-required">
            *
          </span>
        )}

      </label>


      <div
        className={`job-input-wrapper ${
          error
            ? 'job-input-error'
            : ''
        }`}
      >

        {icon && (
          <span className="job-input-icon">
            {icon}
          </span>
        )}


        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={
            error ? 'true' : 'false'
          }
        />

      </div>


      {error && (
        <span className="job-field-error">
          {error}
        </span>
      )}

    </div>
  );
}


export default JobApplication;