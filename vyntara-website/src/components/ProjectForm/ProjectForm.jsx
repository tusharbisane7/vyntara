import { useEffect, useState } from 'react';

import {
  X,
  Send,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

import './ProjectForm.css';

function ProjectForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: ''
  });

  /* =========================================
     OPEN FORM FROM ANYWHERE
  ========================================= */

  useEffect(() => {
    const openProjectForm = () => {
      setIsOpen(true);
      setIsSuccess(false);
      setFormError('');

      document.body.style.overflow = 'hidden';
    };

    window.addEventListener(
      'openProjectForm',
      openProjectForm
    );

    return () => {
      window.removeEventListener(
        'openProjectForm',
        openProjectForm
      );

      document.body.style.overflow = '';
    };
  }, []);

  /* =========================================
     CLOSE FORM
  ========================================= */

  const closeForm = () => {
    if (isSubmitting) {
      return;
    }

    setIsOpen(false);
    setIsSuccess(false);
    setFormError('');

    document.body.style.overflow = '';
  };

  /* =========================================
     INPUT CHANGE
  ========================================= */

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    if (formError) {
      setFormError('');
    }
  };

  /* =========================================
     FORM SUBMIT
  ========================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setFormError('');

    /*
      Basic frontend validation
    */

    const name = formData.name.trim();
    const email = formData.email.trim();
    const projectType = formData.projectType.trim();
    const message = formData.message.trim();

    if (!name || !email || !projectType || !message) {
      setFormError(
        'Please fill in all required fields.'
      );

      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setFormError(
        'Please enter a valid email address.'
      );

      return;
    }

    /*
      Backend request
    */

    setIsSubmitting(true);

    try {
      const response = await fetch(
        'http://localhost:5000/api/projects',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            name,
            email,
            phone: formData.phone.trim(),
            company: formData.company.trim(),
            projectType,
            budget: formData.budget.trim(),
            timeline: formData.timeline.trim(),
            message
          })
        }
      );

      /*
        Try to read JSON response.
        This also prevents the frontend
        from crashing if the server returns
        an unexpected response.
      */

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
          'Unable to submit your project request.'
        );
      }

      /*
        Submission successful
      */

      console.log(
        'Project submitted successfully:',
        data
      );

      setIsSuccess(true);
      setFormError('');

    } catch (error) {
      console.error(
        'Project form submission error:',
        error
      );

      /*
        Show useful error to user
      */

      if (
        error instanceof TypeError &&
        error.message.toLowerCase().includes('fetch')
      ) {
        setFormError(
          'Unable to connect to the server. Please make sure the Vyntara backend is running.'
        );
      } else {
        setFormError(
          error.message ||
          'Something went wrong. Please try again.'
        );
      }

    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================
     RESET FORM
  ========================================= */

  const handleCloseSuccess = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      projectType: '',
      budget: '',
      timeline: '',
      message: ''
    });

    setFormError('');
    closeForm();
  };

  /* =========================================
     ESCAPE KEY
  ========================================= */

  useEffect(() => {
    const handleEscape = (event) => {
      if (
        event.key === 'Escape' &&
        isOpen &&
        !isSubmitting
      ) {
        closeForm();
      }
    };

    document.addEventListener(
      'keydown',
      handleEscape
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscape
      );
    };
  }, [isOpen, isSubmitting]);

  /* =========================================
     DO NOT RENDER WHEN CLOSED
  ========================================= */

  if (!isOpen) {
    return null;
  }

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div
      className="project-form-overlay"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isSubmitting
        ) {
          closeForm();
        }
      }}
    >

      <div className="project-form-modal">

        {/* =====================================
            CLOSE BUTTON
        ====================================== */}

        <button
          type="button"
          className="project-form-close"
          onClick={closeForm}
          aria-label="Close project form"
          disabled={isSubmitting}
        >
          <X size={20} />
        </button>


        {!isSuccess ? (

          /* ===================================
             PROJECT FORM
          ==================================== */

          <div className="project-form-content">

            {/* Header */}

            <div className="project-form-header">

              <span className="project-form-eyebrow">
                START A PROJECT
              </span>

              <h2>
                Let's build something
                <span> extraordinary.</span>
              </h2>

              <p>
                Tell us about your idea, and our
                team will get back to you to
                discuss the next steps.
              </p>

            </div>


            {/* Form */}

            <form
              className="project-form"
              onSubmit={handleSubmit}
            >

              {/* Name + Email */}

              <div className="project-form-row">

                <div className="project-form-field">

                  <label htmlFor="project-name">
                    Full Name
                    <span>*</span>
                  </label>

                  <input
                    id="project-name"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    autoComplete="name"
                  />

                </div>


                <div className="project-form-field">

                  <label htmlFor="project-email">
                    Email Address
                    <span>*</span>
                  </label>

                  <input
                    id="project-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    autoComplete="email"
                  />

                </div>

              </div>


              {/* Phone + Company */}

              <div className="project-form-row">

                <div className="project-form-field">

                  <label htmlFor="project-phone">
                    Phone Number
                  </label>

                  <input
                    id="project-phone"
                    type="tel"
                    name="phone"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    autoComplete="tel"
                  />

                </div>


                <div className="project-form-field">

                  <label htmlFor="project-company">
                    Company / Organization
                  </label>

                  <input
                    id="project-company"
                    type="text"
                    name="company"
                    placeholder="Company name"
                    value={formData.company}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    autoComplete="organization"
                  />

                </div>

              </div>


              {/* Project Type + Budget */}

              <div className="project-form-row">

                <div className="project-form-field">

                  <label htmlFor="project-type">
                    Project Type
                    <span>*</span>
                  </label>

                  <select
                    id="project-type"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  >

                    <option value="">
                      Select project type
                    </option>

                    <option value="Custom Software">
                      Custom Software
                    </option>

                    <option value="Website">
                      Website / Web Application
                    </option>

                    <option value="Mobile Application">
                      Mobile Application
                    </option>

                    <option value="AI & Automation">
                      AI & Automation
                    </option>

                    <option value="Business System">
                      Business System
                    </option>

                    <option value="Cloud Solution">
                      Cloud Solution
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>


                <div className="project-form-field">

                  <label htmlFor="project-budget">
                    Estimated Budget
                  </label>

                  <select
                    id="project-budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >

                    <option value="">
                      Select budget
                    </option>

                    <option value="Under ₹50,000">
                      Under ₹50,000
                    </option>

                    <option value="₹50,000 - ₹1,00,000">
                      ₹50,000 - ₹1,00,000
                    </option>

                    <option value="₹1,00,000 - ₹3,00,000">
                      ₹1,00,000 - ₹3,00,000
                    </option>

                    <option value="₹3,00,000 - ₹5,00,000">
                      ₹3,00,000 - ₹5,00,000
                    </option>

                    <option value="₹5,00,000+">
                      ₹5,00,000+
                    </option>

                    <option value="Not Sure">
                      Not Sure
                    </option>

                  </select>

                </div>

              </div>


              {/* Timeline */}

              <div className="project-form-field">

                <label htmlFor="project-timeline">
                  Expected Timeline
                </label>

                <select
                  id="project-timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >

                  <option value="">
                    Select timeline
                  </option>

                  <option value="ASAP">
                    As soon as possible
                  </option>

                  <option value="1-2 Months">
                    1–2 Months
                  </option>

                  <option value="2-3 Months">
                    2–3 Months
                  </option>

                  <option value="3-6 Months">
                    3–6 Months
                  </option>

                  <option value="6+ Months">
                    6+ Months
                  </option>

                  <option value="Flexible">
                    Flexible
                  </option>

                </select>

              </div>


              {/* Message */}

              <div className="project-form-field">

                <label htmlFor="project-message">
                  Tell Us About Your Project
                  <span>*</span>
                </label>

                <textarea
                  id="project-message"
                  name="message"
                  rows="4"
                  placeholder="Describe your idea, requirements, goals or challenges..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />

              </div>


              {/* Error */}

              {formError && (
                <div
                  className="project-form-error"
                  role="alert"
                >
                  {formError}
                </div>
              )}


              {/* Submit */}

              <button
                type="submit"
                className="project-form-submit"
                disabled={isSubmitting}
              >

                <span>
                  {isSubmitting
                    ? 'Sending Request...'
                    : 'Send Project Request'}
                </span>

                {isSubmitting ? (
                  <span
                    className="project-form-spinner"
                    aria-hidden="true"
                  />
                ) : (
                  <Send size={17} />
                )}

              </button>


              <p className="project-form-note">
                By submitting this form, you agree
                to be contacted regarding your project.
              </p>

            </form>

          </div>

        ) : (

          /* ===================================
             SUCCESS SCREEN
          ==================================== */

          <div className="project-form-success">

            <div className="project-success-icon">

              <CheckCircle2 size={48} />

            </div>


            <span className="project-form-eyebrow">
              REQUEST RECEIVED
            </span>


            <h2>
              Project request
              <span> submitted!</span>
            </h2>


            <p>
              Thank you for reaching out to
              Vyntara Technologies. We've received
              your project details and will get back
              to you soon.
            </p>


            <div className="project-success-details">

              <div>
                <CheckCircle2 size={16} />

                <span>
                  Your request has been recorded
                </span>
              </div>

              <div>
                <CheckCircle2 size={16} />

                <span>
                  Our team will review your requirements
                </span>
              </div>

              <div>
                <CheckCircle2 size={16} />

                <span>
                  We'll contact you regarding next steps
                </span>
              </div>

            </div>


            <button
              type="button"
              className="project-success-button"
              onClick={handleCloseSuccess}
            >

              <span>
                Back to Website
              </span>

              <ArrowRight size={17} />

            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default ProjectForm;