import { useEffect, useState } from 'react';

import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Send,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

import { motion } from 'motion/react';

import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import ParticleBackground from '../../components/ParticleBackground/ParticleBackground';
import JobApplication from '../../components/JobApplication/JobApplication';

import './Careers.css';


/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://vyntara-backend.onrender.com';


/* =========================================================
   BENEFITS
========================================================= */

const benefits = [
  {
    icon: Sparkles,
    title: 'Build Real Products',
    description:
      'Work on meaningful projects that solve real business problems and create measurable impact.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Learn & Grow',
    description:
      'Develop your technical and professional skills while working with modern technologies.',
  },
  {
    icon: CheckCircle2,
    title: 'Collaborative Culture',
    description:
      'Work with a team that values ideas, ownership, creativity, and continuous improvement.',
  },
  {
    icon: ArrowRight,
    title: 'Move Fast',
    description:
      'Take ownership, experiment with new ideas, and turn concepts into working products.',
  },
];


/* =========================================================
   HIRING PROCESS
========================================================= */

const hiringSteps = [
  {
    number: '01',
    title: 'Apply',
    description:
      'Send us your resume and tell us what you can bring to Vyntara.',
  },
  {
    number: '02',
    title: 'Shortlist',
    description:
      'Our team reviews your profile and experience.',
  },
  {
    number: '03',
    title: 'Interview',
    description:
      'Meet our team and discuss your skills, ideas, and experience.',
  },
  {
    number: '04',
    title: 'Join',
    description:
      'If there is a strong fit, welcome to Vyntara Technologies.',
  },
];


/* =========================================================
   CAREERS
========================================================= */

function Careers() {

  /* =======================================================
     STATE
  ======================================================= */

  const [jobs, setJobs] = useState([]);

  const [loadingJobs, setLoadingJobs] =
    useState(true);

  const [jobsError, setJobsError] =
    useState('');

  const [selectedJob, setSelectedJob] =
    useState(null);

  const [refreshing, setRefreshing] =
    useState(false);


  /* =======================================================
     FETCH ACTIVE JOBS
  ======================================================= */

  const fetchJobs = async (
    showRefreshing = false
  ) => {

    try {

      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoadingJobs(true);
      }

      setJobsError('');


      const response = await fetch(
        `${API_BASE_URL}/api/jobs`
      );


      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }


      if (!response.ok) {

        throw new Error(
          data?.message ||
          'Unable to load available positions.'
        );
      }


      const fetchedJobs =
        Array.isArray(data?.jobs)
          ? data.jobs
          : Array.isArray(data?.data)
            ? data.data
            : [];


      setJobs(fetchedJobs);

    } catch (error) {

      console.error(
        'Careers jobs error:',
        error
      );

      setJobsError(
        error.message ||
        'Unable to load available positions.'
      );

    } finally {

      setLoadingJobs(false);
      setRefreshing(false);
    }
  };


  /* =======================================================
     LOAD JOBS ON PAGE LOAD
  ======================================================= */

  useEffect(() => {

    fetchJobs();

  }, []);


  /* =======================================================
     FORMAT EMPLOYMENT TYPE
  ======================================================= */

  const formatEmploymentType = (
    type
  ) => {

    if (!type) {
      return 'Full Time';
    }


    const normalized =
      String(type)
        .replace(/[_-]+/g, ' ')
        .trim();


    return normalized
      .split(' ')
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1).toLowerCase()
      )
      .join(' ');
  };


  /* =======================================================
     NORMALIZE TAGS
  ======================================================= */

  const normalizeTags = (tags) => {

    if (Array.isArray(tags)) {
      return tags;
    }


    if (typeof tags === 'string') {

      try {

        const parsed =
          JSON.parse(tags);

        if (Array.isArray(parsed)) {
          return parsed;
        }

      } catch {
        // Continue with comma-separated parsing
      }


      return tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
    }


    return [];
  };


  /* =======================================================
     OPEN APPLICATION
  ======================================================= */

  const handleApply = (job) => {

    setSelectedJob(job);

    /*
      Prevent background page scrolling
      while the application modal is open.
    */
    document.body.style.overflow =
      'hidden';
  };


  /* =======================================================
     CLOSE APPLICATION
  ======================================================= */

  const handleCloseApplication = () => {

    setSelectedJob(null);

    document.body.style.overflow =
      '';
  };


  /* =======================================================
     CLEANUP BODY SCROLL
  ======================================================= */

  useEffect(() => {

    return () => {
      document.body.style.overflow =
        '';
    };

  }, []);


  return (
    <div className="careers-page">

      {/* ===================================================
          NAVBAR
      =================================================== */}

      <Navbar />


      <main>

        {/* =================================================
            CAREERS HERO
        ================================================= */}

        <section className="careers-hero">

          {/* Particles behind all hero content */}

          <ParticleBackground />


          <div
            className="
              careers-hero__glow
              careers-hero__glow--one
            "
          />

          <div
            className="
              careers-hero__glow
              careers-hero__glow--two
            "
          />


          <div
            className="
              v-container
              careers-hero__container
            "
          >

            {/* ---------------------------------------------
                HERO CONTENT
            --------------------------------------------- */}

            <motion.div
              className="careers-hero__content"

              initial={{
                opacity: 0,
                y: 30,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              transition={{
                duration: 0.8,
              }}
            >

              <div className="careers-eyebrow">

                <span
                  className="
                    careers-eyebrow__dot
                  "
                />

                <span>
                  CAREERS AT VYNTARA
                </span>

              </div>


              <h1 className="careers-hero__title">

                Build

                <span>
                  {' '}
                  What's Next.
                </span>

              </h1>


              <p className="careers-hero__description">

                Join a team building modern
                digital products, intelligent
                solutions, and technology that
                helps businesses move forward.

              </p>


              <div className="careers-hero__actions">

                <a
                  href="#open-positions"
                  className="careers-primary-btn"
                >

                  <span>
                    Explore Open Positions
                  </span>

                  <ArrowRight size={18} />

                </a>


                <a
                  href="mailto:hr@vyntaratech.in?subject=Career Application - Vyntara Technologies"
                  className="careers-secondary-btn"
                >

                  <Send size={17} />

                  <span>
                    Send Your Resume
                  </span>

                </a>

              </div>


              <div className="careers-hero__meta">

                <div>

                  <strong>
                    01
                  </strong>

                  <span>
                    Innovation First
                  </span>

                </div>


                <div>

                  <strong>
                    02
                  </strong>

                  <span>
                    Growth Mindset
                  </span>

                </div>


                <div>

                  <strong>
                    03
                  </strong>

                  <span>
                    Real Impact
                  </span>

                </div>

              </div>

            </motion.div>


            {/* ---------------------------------------------
                FUTURISTIC VISUAL
            --------------------------------------------- */}

            <motion.div
              className="careers-hero__visual"

              initial={{
                opacity: 0,
                scale: 0.9,
              }}

              animate={{
                opacity: 1,
                scale: 1,
              }}

              transition={{
                duration: 1,
                delay: 0.2,
              }}
            >

              <div className="careers-core">

                <div
                  className="
                    careers-core__ring
                    careers-core__ring--outer
                  "
                />

                <div
                  className="
                    careers-core__ring
                    careers-core__ring--middle
                  "
                />

                <div
                  className="
                    careers-core__ring
                    careers-core__ring--inner
                  "
                />


                <div className="careers-core__center">

                  <span>
                    V
                  </span>

                </div>


                <div
                  className="
                    careers-orbit
                    careers-orbit--one
                  "
                />

                <div
                  className="
                    careers-orbit
                    careers-orbit--two
                  "
                />

              </div>


              <div
                className="
                  careers-floating-card
                  careers-floating-card--one
                "
              >

                <span
                  className="
                    careers-floating-card__label
                  "
                >
                  BUILD
                </span>

                <strong>
                  Digital Future
                </strong>

              </div>


              <div
                className="
                  careers-floating-card
                  careers-floating-card--two
                "
              >

                <span
                  className="
                    careers-floating-card__label
                  "
                >
                  CREATE
                </span>

                <strong>
                  Real Impact
                </strong>

              </div>

            </motion.div>

          </div>


          <div className="careers-hero__fade" />

        </section>


        {/* =================================================
            WHY VYNTARA
        ================================================= */}

        <section className="careers-benefits">

          <div className="v-container">

            <motion.div
              className="careers-section-heading"

              initial={{
                opacity: 0,
                y: 25,
              }}

              whileInView={{
                opacity: 1,
                y: 0,
              }}

              viewport={{
                once: true,
              }}
            >

              <span
                className="
                  careers-section-heading__eyebrow
                "
              >
                WHY VYNTARA
              </span>


              <h2>

                More Than a Job.

                <span>
                  {' '}
                  Build Your Future.
                </span>

              </h2>


              <p>

                We believe great technology
                comes from curious people who
                are given the freedom to think,
                experiment, and build.

              </p>

            </motion.div>


            <div className="careers-benefits-grid">

              {benefits.map(
                (benefit, index) => {

                  const Icon =
                    benefit.icon;


                  return (
                    <motion.article
                      className="
                        careers-benefit-card
                      "

                      key={benefit.title}

                      initial={{
                        opacity: 0,
                        y: 30,
                      }}

                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}

                      viewport={{
                        once: true,
                      }}

                      transition={{
                        duration: 0.6,
                        delay:
                          index * 0.08,
                      }}
                    >

                      <div
                        className="
                          careers-benefit-card__icon
                        "
                      >

                        <Icon size={22} />

                      </div>


                      <span
                        className="
                          careers-benefit-card__number
                        "
                      >
                        0{index + 1}
                      </span>


                      <h3>
                        {benefit.title}
                      </h3>


                      <p>
                        {benefit.description}
                      </p>

                    </motion.article>
                  );

                }
              )}

            </div>

          </div>

        </section>


        {/* =================================================
            OPEN POSITIONS
        ================================================= */}

        <section
          className="careers-positions"
          id="open-positions"
        >

          <div className="v-container">

            <motion.div
              className="
                careers-section-heading
                careers-section-heading--positions
              "

              initial={{
                opacity: 0,
                y: 25,
              }}

              whileInView={{
                opacity: 1,
                y: 0,
              }}

              viewport={{
                once: true,
              }}
            >

              <span
                className="
                  careers-section-heading__eyebrow
                "
              >
                OPEN POSITIONS
              </span>


              <h2>

                Find Your

                <span>
                  {' '}
                  Next Challenge.
                </span>

              </h2>


              <p>

                Explore opportunities to work
                on exciting digital products and
                technology solutions.

              </p>

            </motion.div>


           


            {/* =================================================
                LOADING STATE
            ================================================= */}

            {loadingJobs && (

              <div
                className="
                  careers-jobs-state
                "
              >

                <div
                  className="
                    careers-jobs-loader
                  "
                />

                <h3>
                  Loading opportunities...
                </h3>

                <p>
                  Please wait while we
                  load our current openings.
                </p>

              </div>

            )}


            {/* =================================================
                ERROR STATE
            ================================================= */}

            {!loadingJobs &&
              jobsError && (

                <motion.div
                  className="
                    careers-jobs-state
                    careers-jobs-state--error
                  "

                  initial={{
                    opacity: 0,
                    y: 20,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                >

                  <div
                    className="
                      careers-jobs-state__icon
                    "
                  >
                    !
                  </div>


                  <h3>
                    Unable to load positions
                  </h3>


                  <p>
                    {jobsError}
                  </p>


                  <button
                    type="button"

                    onClick={() =>
                      fetchJobs()
                    }

                    className="
                      careers-retry-btn
                    "
                  >

                    <RefreshCw size={16} />

                    <span>
                      Try Again
                    </span>

                  </button>

                </motion.div>

              )}


            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {!loadingJobs &&
              !jobsError &&
              jobs.length === 0 && (

                <motion.div
                  className="
                    careers-jobs-state
                  "

                  initial={{
                    opacity: 0,
                    y: 20,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                >

                  <div
                    className="
                      careers-jobs-state__icon
                    "
                  >
                    <BriefcaseBusiness
                      size={24}
                    />
                  </div>


                  <h3>
                    No Open Positions Right Now
                  </h3>


                  <p>
                    We don't have any active
                    openings at the moment.
                    Check back soon or send us
                    your resume for future
                    opportunities.
                  </p>


                  <a
                    href="mailto:hr@vyntaratech.in?subject=Future Career Opportunity - Vyntara Technologies"
                    className="
                      careers-secondary-btn
                    "
                  >

                    <Send size={17} />

                    <span>
                      Send Your Resume
                    </span>

                  </a>

                </motion.div>

              )}


            {/* =================================================
                JOB LIST
            ================================================= */}

            {!loadingJobs &&
              !jobsError &&
              jobs.length > 0 && (

                <div
                  className="
                    careers-position-list
                  "
                >

                  {jobs.map(
                    (job, index) => {

                      const tags =
                        normalizeTags(
                          job.tags
                        );


                      return (
                        <motion.article
                          className="
                            careers-position-card
                          "

                          key={job.id}

                          initial={{
                            opacity: 0,
                            y: 25,
                          }}

                          whileInView={{
                            opacity: 1,
                            y: 0,
                          }}

                          viewport={{
                            once: true,
                          }}

                          transition={{
                            duration: 0.6,
                            delay:
                              index * 0.06,
                          }}
                        >

                          {/* ---------------------------------
                              JOB NUMBER
                          --------------------------------- */}

                          <div
                            className="
                              careers-position-card__index
                            "
                          >
                            {String(
                              index + 1
                            ).padStart(2, '0')}
                          </div>


                          <div
                            className="
                              careers-position-card__main
                            "
                          >

                            {/* -------------------------------
                                TOP
                            ------------------------------- */}

                            <div
                              className="
                                careers-position-card__top
                              "
                            >

                              <div>

                                <div
                                  className="
                                    careers-position-card__tags
                                  "
                                >

                                  <span>
                                    {formatEmploymentType(
                                      job.employment_type
                                    )}
                                  </span>


                                  <span>
                                    {job.location ||
                                      'India'}
                                  </span>

                                </div>


                                <h3>
                                  {job.position_name ||
                                    'Open Position'}
                                </h3>

                              </div>


                              {/* -----------------------------
                                  APPLY BUTTON
                              ----------------------------- */}

                              <button
                                type="button"

                                onClick={() =>
                                  handleApply(
                                    job
                                  )
                                }

                                className="
                                  careers-position-card__apply
                                "
                              >

                                <span>
                                  Apply Now
                                </span>

                                <ArrowRight
                                  size={17}
                                />

                              </button>

                            </div>


                            {/* -------------------------------
                                DESCRIPTION
                            ------------------------------- */}

                            <p>

                              {job.short_description ||
                                job.description ||
                                'Join Vyntara Technologies and help us build the next generation of digital solutions.'}

                            </p>


                            {/* -------------------------------
                                TAGS / SKILLS
                            ------------------------------- */}

                            {tags.length > 0 && (

                              <div
                                className="
                                  careers-position-card__skills
                                "
                              >

                                {tags.map(
                                  (tag, tagIndex) => (

                                    <span
                                      key={`${job.id}-tag-${tagIndex}`}
                                    >
                                      {tag}
                                    </span>

                                  )
                                )}

                              </div>

                            )}

                          </div>

                        </motion.article>
                      );

                    }
                  )}

                </div>

              )}

          </div>

        </section>


        {/* =================================================
            HIRING PROCESS
        ================================================= */}

        <section className="careers-process">

          <div className="v-container">

            <motion.div
              className="careers-section-heading"

              initial={{
                opacity: 0,
                y: 25,
              }}

              whileInView={{
                opacity: 1,
                y: 0,
              }}

              viewport={{
                once: true,
              }}
            >

              <span
                className="
                  careers-section-heading__eyebrow
                "
              >
                OUR PROCESS
              </span>


              <h2>

                Simple.

                <span>
                  {' '}
                  Transparent.
                </span>

              </h2>


              <p>

                We keep our hiring process
                straightforward so you can focus
                on showing us what you can do.

              </p>

            </motion.div>


            <div
              className="
                careers-process-grid
              "
            >

              {hiringSteps.map(
                (step, index) => (

                  <motion.div
                    className="
                      careers-process-card
                    "

                    key={step.number}

                    initial={{
                      opacity: 0,
                      y: 25,
                    }}

                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}

                    viewport={{
                      once: true,
                    }}

                    transition={{
                      duration: 0.5,
                      delay:
                        index * 0.08,
                    }}
                  >

                    <span>
                      {step.number}
                    </span>


                    <h3>
                      {step.title}
                    </h3>


                    <p>
                      {step.description}
                    </p>

                  </motion.div>

                )
              )}

            </div>

          </div>

        </section>

      </main>


      {/* ===================================================
          FOOTER
      =================================================== */}

      <Footer />


      {/* ===================================================
          JOB APPLICATION MODAL
      =================================================== */}

      {selectedJob && (

        <JobApplication
          job={selectedJob}
          onClose={
            handleCloseApplication
          }
        />

      )}

    </div>
  );
}


export default Careers;