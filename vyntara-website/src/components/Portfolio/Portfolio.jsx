import { motion } from 'motion/react';

import {
  ArrowUpRight,
  ExternalLink,
  HeartHandshake,
  Sparkles,
  Layers3,
  Code2,
  ShieldCheck,
  UsersRound,
  ClipboardList,
  GraduationCap
} from 'lucide-react';

import './Portfolio.css';


/* =========================================================
   PROJECT DATA

   Add your real image paths / live URLs here.

   Example:

   image: '/projects/erp-dashboard.png'

   OR, if images are inside src/assets:

   import erpDashboard from '../../assets/projects/erp-dashboard.png';
   image: erpDashboard;

   For a real live project:

   liveUrl: 'https://your-project-url.com'
========================================================= */

const projects = [

  /* =======================================================
     PROJECT 01
     EDUCATIONAL INSTITUTION ERP
  ======================================================= */

  {
    id: '01',

    category: 'EDUCATION TECHNOLOGY',

    title: 'Educational Institution ERP',

    description:
      'A complete digital management platform designed to bring educational institution operations, administration and student services together in one centralized ecosystem.',

    tags: [
      'ERP',
      'Education',
      'Management',
      'Live Project'
    ],

    technologies: [
      'React',
      'Node.js',
      'PostgreSQL'
    ],

    features: [
      'Institution Management',
      'Student Management',
      'Faculty & Staff Management',
      'Attendance Management',
      'Fees & Finance',
      'Examination & Results',
      'Reports & Analytics',
      'Role-Based Administration'
    ],

    icon: GraduationCap,

    type: 'featured',

    status: 'LIVE PROJECT',

    image: '',

    /*
      Add the real ERP URL here when available.

      Example:
      liveUrl: 'https://erp.example.com'
    */
    liveUrl: '',

    metric: '360°',

    metricLabel: 'Institution Management',

    ctaText: 'View Project',

    ctaType: 'link'
  },


  /* =======================================================
     PROJECT 02
     CARESYNC
  ======================================================= */

  {
    id: '02',

    category: 'SERVICE TECHNOLOGY',

    title: 'CareSync',

    description:
      'A modern service management platform designed to connect users with services through a streamlined request, enquiry and management experience.',

    tags: [
      'Service Management',
      'Request Platform',
      'CRM',
      'Live Project'
    ],

    technologies: [
      'React',
      'Node.js',
      'Database'
    ],

    features: [
      'Service Requests',
      'Customer Information',
      'Request Tracking',
      'Service Status',
      'Enquiry Management',
      'Administrative Management'
    ],

    icon: HeartHandshake,

    type: 'standard',

    status: 'LIVE PROJECT',

    image: '',

    /*
      Add the real CareSync URL here if you want
      the card to open the live project.

      Example:
      liveUrl: 'https://caresync.example.com'
    */
    liveUrl: '',

    metric: 'LIVE',

    metricLabel: 'Service Platform',

    ctaText: 'Request Service',

    ctaType: 'request'
  }

];


/* =========================================================
   OPEN EXISTING PROJECT FORM

   IMPORTANT:

   Your existing ProjectForm.jsx listens for:

   window.addEventListener(
     'openProjectForm',
     ...
   );

   Therefore Portfolio MUST dispatch:

   new CustomEvent('openProjectForm')

   Do NOT change ProjectForm.jsx.
========================================================= */

function openProjectForm(projectName = '') {

  window.dispatchEvent(

    new CustomEvent(
      'openProjectForm',
      {
        detail: {
          project: projectName
        }
      }
    )

  );

}


/* =========================================================
   PROJECT VISUAL
========================================================= */

function ProjectVisual({
  project,
  featured = false
}) {

  const Icon = project.icon;

  return (

    <div
      className={`v-project-visual ${
        featured
          ? 'v-project-visual--featured'
          : ''
      }`}
    >

      <div className="v-project-visual__grid" />

      <div className="v-project-visual__glow" />


      {/* ===================================================
          REAL PROJECT IMAGE
      =================================================== */}

      {project.image ? (

        <div className="v-project-image">

          <img
            src={project.image}
            alt={`${project.title} project`}
            loading="lazy"
          />

        </div>

      ) : (

        /* =================================================
           FALLBACK APPLICATION PREVIEW

           This remains visible until you add the
           real project screenshot.
        ================================================= */

        <div className="v-project-screen">

          <div className="v-project-screen__top">

            <div className="v-project-screen__dots">

              <span />
              <span />
              <span />

            </div>


            <div className="v-project-screen__address">

              <span>
                ●
              </span>

              project.vyntara

            </div>


            <div className="v-project-screen__menu">

              •••

            </div>

          </div>


          <div className="v-project-screen__body">


            {/* SIDEBAR */}

            <div className="v-project-screen__sidebar">

              <div className="v-project-screen__logo">
                V
              </div>

              <span className="active" />

              <span />

              <span />

              <span />

              <span />

            </div>


            {/* CONTENT */}

            <div className="v-project-screen__content">


              <div className="v-project-screen__heading">

                <div>

                  <small>
                    PROJECT OVERVIEW
                  </small>

                  <strong>
                    {project.title}
                  </strong>

                </div>


                <div className="v-project-screen__avatar" />

              </div>


              <div className="v-project-screen__cards">


                <div>

                  <small>
                    STATUS
                  </small>

                  <strong>
                    LIVE
                  </strong>

                  <span>
                    Production
                  </span>

                </div>


                <div>

                  <small>
                    FEATURES
                  </small>

                  <strong>
                    {project.features.length}
                  </strong>

                  <span>
                    Core Modules
                  </span>

                </div>


                <div>

                  <small>
                    TECHNOLOGY
                  </small>

                  <strong>
                    {project.technologies.length}
                  </strong>

                  <span>
                    Technologies
                  </span>

                </div>


              </div>


              <div className="v-project-screen__graph">


                <div className="v-project-screen__graph-header">

                  <span>
                    {project.title}
                  </span>

                  <small>
                    LIVE
                  </small>

                </div>


                <div className="v-project-screen__bars">

                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />

                </div>


              </div>


            </div>

          </div>

        </div>

      )}


      {/* ===================================================
          PROJECT ICON
      =================================================== */}

      <div className="v-project-icon">

        <Icon size={19} />

      </div>


      {/* ===================================================
          LIVE STATUS
      =================================================== */}

      <div className="v-project-status">

        <span />

        {project.status}

      </div>


    </div>

  );

}


/* =========================================================
   FEATURE LIST
========================================================= */

function FeaturePreview({
  project
}) {

  const featureIcons = [
    Layers3,
    UsersRound,
    ClipboardList,
    ShieldCheck
  ];


  return (

    <div className="v-project-features">

      {project.features
        .slice(0, 4)
        .map((feature, index) => {

          const FeatureIcon =
            featureIcons[index] ||
            Code2;

          return (

            <div
              className="v-project-feature"
              key={feature}
            >

              <FeatureIcon size={14} />

              <span>
                {feature}
              </span>

            </div>

          );

        })}

    </div>

  );

}


/* =========================================================
   PROJECT ACTION
========================================================= */

function ProjectAction({
  project,
  featured = false
}) {

  /* =======================================================
     REQUEST SERVICE

     Opens the EXISTING ProjectForm.jsx.

     ProjectForm.jsx listens for:

     'openProjectForm'

     We are NOT changing ProjectForm.jsx.
  ======================================================= */

  if (project.ctaType === 'request') {

    return (

      <button
        type="button"

        className={
          featured
            ? 'v-project-view v-project-request'
            : 'v-project-card__arrow v-project-request'
        }

        onClick={() => {
          openProjectForm(project.title);
        }}

        aria-label={`Request service for ${project.title}`}
      >

        {featured ? (

          <>
            <span>
              {project.ctaText}
            </span>

            <ArrowUpRight
              size={17}
            />
          </>

        ) : (

          <ArrowUpRight
            size={17}
          />

        )}

      </button>

    );

  }


  /* =======================================================
     LIVE PROJECT LINK

     If a real liveUrl exists, open it in a new tab.
  ======================================================= */

  if (project.liveUrl) {

    return (

      <a
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"

        className={
          featured
            ? 'v-project-view'
            : 'v-project-card__arrow'
        }

        aria-label={`View ${project.title}`}
      >

        {featured ? (

          <>
            <span>
              {project.ctaText}
            </span>

            <ArrowUpRight
              size={17}
            />
          </>

        ) : (

          <ArrowUpRight
            size={17}
          />

        )}

      </a>

    );

  }


  /* =======================================================
     NO LIVE URL

     Instead of doing nothing, use the existing
     ProjectForm so the visitor can enquire about
     the project.

     This is especially useful for the ERP project
     until its actual live URL is added.
  ======================================================= */

  return (

    <button
      type="button"

      className={
        featured
          ? 'v-project-view'
          : 'v-project-card__arrow'
      }

      onClick={() => {
        openProjectForm(project.title);
      }}

      aria-label={`Enquire about ${project.title}`}
    >

      {featured ? (

        <>
          <span>
            {project.ctaText}
          </span>

          <ArrowUpRight
            size={17}
          />
        </>

      ) : (

        <ArrowUpRight
          size={17}
        />

      )}

    </button>

  );

}


/* =========================================================
   PORTFOLIO
========================================================= */

function Portfolio() {

  const featuredProject =
    projects.find(
      (project) =>
        project.type === 'featured'
    ) || projects[0];


  const remainingProjects =
    projects.filter(
      (project) =>
        project.id !==
        featuredProject.id
    );


  return (

    <section
      className="v-portfolio"
      id="projects"
    >

      <div className="v-portfolio__ambient" />


      <div className="v-container">


        {/* =================================================
            HEADER
        ================================================= */}

        <motion.div

          className="v-portfolio__header"

          initial={{
            opacity: 0,
            y: 35
          }}

          whileInView={{
            opacity: 1,
            y: 0
          }}

          viewport={{
            once: true,
            amount: 0.2
          }}

          transition={{
            duration: 0.7
          }}

        >


          <div className="v-portfolio__label">

            <Sparkles
              size={14}
            />

            <span>
              SELECTED WORK
            </span>

          </div>


          <div className="v-portfolio__heading-row">


            <h2>

              Real products.
              <span>
                Real solutions.
              </span>

            </h2>


            <p>

              We design and engineer digital
              products that solve real business
              and institutional challenges — from
              complete ERP platforms to modern
              service management systems.

            </p>


          </div>


        </motion.div>


        {/* =================================================
            FEATURED PROJECT
        ================================================= */}

        <motion.article

          className="v-project-featured"

          initial={{
            opacity: 0,
            y: 45
          }}

          whileInView={{
            opacity: 1,
            y: 0
          }}

          viewport={{
            once: true,
            amount: 0.15
          }}

          transition={{
            duration: 0.7
          }}

        >


          <ProjectVisual
            project={
              featuredProject
            }
            featured
          />


          <div
            className=
              "v-project-featured__content"
          >


            {/* META */}

            <div
              className=
                "v-project-featured__meta"
            >

              <span>
                {featuredProject.category}
              </span>

              <span>
                {featuredProject.id}
              </span>

            </div>


            {/* TITLE */}

            <h3>
              {featuredProject.title}
            </h3>


            {/* DESCRIPTION */}

            <p>
              {featuredProject.description}
            </p>


            {/* TAGS */}

            <div className="v-project-tags">

              {featuredProject.tags.map(
                (tag) => (

                  <span key={tag}>
                    {tag}
                  </span>

                )
              )}

            </div>


            {/* FEATURES */}

            <FeaturePreview
              project={
                featuredProject
              }
            />


            {/* TECHNOLOGIES */}

            <div className="v-project-technologies">

              {featuredProject.technologies.map(
                (technology) => (

                  <span key={technology}>
                    {technology}
                  </span>

                )
              )}

            </div>


            {/* BOTTOM */}

            <div
              className=
                "v-project-featured__bottom"
            >


              <div
                className=
                  "v-project-result"
              >

                <strong>
                  {featuredProject.metric}
                </strong>

                <span>
                  {featuredProject.metricLabel}
                </span>

              </div>


              <ProjectAction
                project={
                  featuredProject
                }
                featured
              />


            </div>


          </div>


        </motion.article>


        {/* =================================================
            OTHER PROJECTS
        ================================================= */}

        <div className="v-projects-grid">


          {remainingProjects.map(
            (project, index) => (

              <motion.article

                key={project.id}

                className=
                  "v-project-card"

                initial={{
                  opacity: 0,
                  y: 35
                }}

                whileInView={{
                  opacity: 1,
                  y: 0
                }}

                viewport={{
                  once: true,
                  amount: 0.12
                }}

                transition={{
                  duration: 0.6,
                  delay:
                    index * 0.08
                }}

              >


                <ProjectVisual
                  project={project}
                />


                <div
                  className=
                    "v-project-card__content"
                >


                  {/* META */}

                  <div
                    className=
                      "v-project-card__meta"
                  >

                    <span>
                      {project.category}
                    </span>

                    <span>
                      {project.id}
                    </span>

                  </div>


                  {/* TITLE */}

                  <h3>
                    {project.title}
                  </h3>


                  {/* DESCRIPTION */}

                  <p>
                    {project.description}
                  </p>


                  {/* TAGS */}

                  <div className="v-project-tags">

                    {project.tags.map(
                      (tag) => (

                        <span key={tag}>
                          {tag}
                        </span>

                      )
                    )}

                  </div>


                  {/* FEATURES */}

                  <FeaturePreview
                    project={project}
                  />


                  {/* FOOTER */}

                  <div
                    className=
                      "v-project-card__footer"
                  >


                    <div
                      className=
                        "v-project-technologies"
                    >

                      {project.technologies
                        .slice(0, 3)
                        .map(
                          (technology) => (

                            <span
                              key={
                                technology
                              }
                            >
                              {technology}
                            </span>

                          )
                        )}

                    </div>


                    <ProjectAction
                      project={project}
                    />


                  </div>


                </div>


              </motion.article>

            )
          )}


        </div>


        {/* =================================================
            PORTFOLIO CTA
        ================================================= */}

        <motion.div

          className="v-portfolio__cta"

          initial={{
            opacity: 0
          }}

          whileInView={{
            opacity: 1
          }}

          viewport={{
            once: true
          }}

          transition={{
            duration: 0.7
          }}

        >


          <div
            className=
              "v-portfolio__cta-text"
          >

            <span>
              HAVE A PROJECT IN MIND?
            </span>

            <strong>
              Let's turn your idea
              into something real.
            </strong>

          </div>


          <button

            type="button"

            className=
              "v-portfolio__cta-button"

            onClick={() => {
              openProjectForm();
            }}

          >

            <span>
              Start a Conversation
            </span>

            <ExternalLink
              size={16}
            />

          </button>


        </motion.div>


      </div>

    </section>

  );

}


export default Portfolio;