import { motion } from 'motion/react';
import {
  ArrowUpRight,
  ExternalLink,
  Globe2,
  Smartphone,
  BrainCircuit,
  ShoppingBag,
  BarChart3,
  Sparkles
} from 'lucide-react';

import './Portfolio.css';

const projects = [
  {
    id: '01',
    category: 'EDUCATION TECHNOLOGY',
    title: 'Engineering College Digital Platform',
    description:
      'A complete digital ecosystem for an engineering institution featuring admissions, departments, notices, events, faculty information and student-focused services.',
    tags: ['React', 'Node.js', 'MongoDB'],
    icon: Globe2,
    type: 'featured',
    metric: '360°',
    metricLabel: 'Digital Experience'
  },
  {
    id: '02',
    category: 'BUSINESS SOFTWARE',
    title: 'Smart Expense Management',
    description:
      'A modern expense management platform designed to simplify tracking, reporting and financial visibility.',
    tags: ['React', 'Analytics', 'PDF'],
    icon: BarChart3,
    metric: '80%',
    metricLabel: 'Faster Reporting'
  },
  {
    id: '03',
    category: 'AI SOLUTIONS',
    title: 'Intelligent Automation Platform',
    description:
      'AI-powered workflows designed to reduce repetitive tasks and help teams work more efficiently.',
    tags: ['AI', 'Automation', 'APIs'],
    icon: BrainCircuit,
    metric: '24/7',
    metricLabel: 'Automation'
  },
  {
    id: '04',
    category: 'E-COMMERCE',
    title: 'Modern Commerce Experience',
    description:
      'A conversion-focused online shopping experience with product discovery, responsive design and streamlined checkout.',
    tags: ['React', 'E-Commerce', 'Payments'],
    icon: ShoppingBag,
    metric: '3×',
    metricLabel: 'Better UX'
  },
  {
    id: '05',
    category: 'MOBILE TECHNOLOGY',
    title: 'Connected Mobile Application',
    description:
      'A scalable mobile experience connecting customers, services and real-time business data.',
    tags: ['Mobile', 'API', 'Cloud'],
    icon: Smartphone,
    metric: '99.9%',
    metricLabel: 'Availability'
  }
];

function ProjectVisual({ project, featured = false }) {
  const Icon = project.icon;

  return (
    <div
      className={`v-project-visual ${
        featured ? 'v-project-visual--featured' : ''
      }`}
    >
      <div className="v-project-visual__grid" />

      <div className="v-project-visual__glow" />

      {/* Browser / Application frame */}

      <div className="v-project-screen">

        <div className="v-project-screen__top">

          <div className="v-project-screen__dots">
            <span />
            <span />
            <span />
          </div>

          <div className="v-project-screen__address">
            <span>●</span>
            project.vyntara
          </div>

          <div className="v-project-screen__menu">
            •••
          </div>

        </div>

        <div className="v-project-screen__body">

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

          <div className="v-project-screen__content">

            <div className="v-project-screen__heading">
              <div>
                <small>Dashboard</small>
                <strong>
                  {project.title}
                </strong>
              </div>

              <div className="v-project-screen__avatar" />
            </div>

            <div className="v-project-screen__cards">

              <div>
                <small>Performance</small>
                <strong>{project.metric}</strong>
                <span>{project.metricLabel}</span>
              </div>

              <div>
                <small>Projects</small>
                <strong>24</strong>
                <span>Active</span>
              </div>

              <div>
                <small>Growth</small>
                <strong>+32%</strong>
                <span>This month</span>
              </div>

            </div>

            <div className="v-project-screen__graph">

              <div className="v-project-screen__graph-header">
                <span>Activity Overview</span>
                <small>2026</small>
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

      <div className="v-project-icon">
        <Icon size={19} />
      </div>

      <div className="v-project-status">
        <span />
        LIVE PROJECT
      </div>

    </div>
  );
}

function Portfolio() {
  const featuredProject = projects[0];
  const remainingProjects = projects.slice(1);

  return (
    <section
      className="v-portfolio"
      id="projects"
    >

      <div className="v-portfolio__ambient" />

      <div className="v-container">

        {/* Header */}

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
            <Sparkles size={14} />
            <span>SELECTED WORK</span>
          </div>

          <div className="v-portfolio__heading-row">

            <h2>
              Ideas we've
              <span> brought to life.</span>
            </h2>

            <p>
              Every project starts with a challenge. We combine
              strategy, design and engineering to turn that
              challenge into a digital experience that works.
            </p>

          </div>

        </motion.div>

        {/* Featured Project */}

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
            project={featuredProject}
            featured
          />

          <div className="v-project-featured__content">

            <div className="v-project-featured__meta">

              <span>
                {featuredProject.category}
              </span>

              <span>
                {featuredProject.id}
              </span>

            </div>

            <h3>
              {featuredProject.title}
            </h3>

            <p>
              {featuredProject.description}
            </p>

            <div className="v-project-tags">

              {featuredProject.tags.map((tag) => (
                <span key={tag}>
                  {tag}
                </span>
              ))}

            </div>

            <div className="v-project-featured__bottom">

              <div className="v-project-result">

                <strong>
                  {featuredProject.metric}
                </strong>

                <span>
                  {featuredProject.metricLabel}
                </span>

              </div>

              <a
                href="#contact"
                className="v-project-view"
              >
                <span>View Case Study</span>
                <ArrowUpRight size={17} />
              </a>

            </div>

          </div>

        </motion.article>

        {/* Other Projects */}

        <div className="v-projects-grid">

          {remainingProjects.map((project, index) => (
            <motion.article
              key={project.id}
              className="v-project-card"

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
                delay: index * 0.08
              }}
            >

              <ProjectVisual project={project} />

              <div className="v-project-card__content">

                <div className="v-project-card__meta">

                  <span>
                    {project.category}
                  </span>

                  <span>
                    {project.id}
                  </span>

                </div>

                <h3>
                  {project.title}
                </h3>

                <p>
                  {project.description}
                </p>

                <div className="v-project-card__footer">

                  <div className="v-project-tags">

                    {project.tags.map((tag) => (
                      <span key={tag}>
                        {tag}
                      </span>
                    ))}

                  </div>

                  <a
                    href="#contact"
                    className="v-project-card__arrow"
                    aria-label={`View ${project.title}`}
                  >
                    <ArrowUpRight size={17} />
                  </a>

                </div>

              </div>

            </motion.article>
          ))}

        </div>

        {/* Portfolio CTA */}

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

          <div className="v-portfolio__cta-text">

            <span>
              HAVE A PROJECT IN MIND?
            </span>

            <strong>
              Let's turn your idea into something real.
            </strong>

          </div>

          <a
            href="#contact"
            className="v-portfolio__cta-button"
          >
            <span>Start a Conversation</span>
            <ExternalLink size={16} />
          </a>

        </motion.div>

      </div>

    </section>
  );
}

export default Portfolio;