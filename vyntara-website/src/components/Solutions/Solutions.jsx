import { motion } from 'motion/react';
import {
  ArrowUpRight,
  Bot,
  Building2,
  Layers3,
  Rocket,
  Workflow,
  ShieldCheck
} from 'lucide-react';

import './Solutions.css';

const solutions = [
  {
    id: '01',
    icon: Rocket,
    title: 'Digital Products',
    shortTitle: 'Launch',
    description:
      'Turn your idea into a polished digital product with the technology, architecture and user experience needed to launch confidently.',
    features: [
      'SaaS Platforms',
      'Web Applications',
      'Customer Portals'
    ]
  },
  {
    id: '02',
    icon: Bot,
    title: 'AI-Powered Solutions',
    shortTitle: 'Intelligence',
    description:
      'Bring intelligent automation into your business with AI assistants, intelligent workflows, document processing and custom AI experiences.',
    features: [
      'AI Assistants',
      'Automation',
      'Intelligent Analytics'
    ]
  },
  {
    id: '03',
    icon: Building2,
    title: 'Business Transformation',
    shortTitle: 'Enterprise',
    description:
      'Connect people, processes and data through custom business systems designed around the way your organisation actually works.',
    features: [
      'ERP & CRM',
      'Business Automation',
      'Management Systems'
    ]
  },
  {
    id: '04',
    icon: Workflow,
    title: 'Connected Ecosystems',
    shortTitle: 'Integration',
    description:
      'Build connected digital ecosystems where applications, APIs, databases and third-party services work together seamlessly.',
    features: [
      'API Integration',
      'Cloud Systems',
      'Data Platforms'
    ]
  }
];

function Solutions() {
  return (
    <section
      className="v-solutions"
      id="solutions"
    >
      {/* Ambient background */}
      <div className="v-solutions__ambient v-solutions__ambient--one" />
      <div className="v-solutions__ambient v-solutions__ambient--two" />

      <div className="v-container">

        {/* Header */}

        <motion.div
          className="v-solutions__header"

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
            amount: 0.25
          }}

          transition={{
            duration: 0.7
          }}
        >
          <div className="v-solutions__label">
            <Layers3 size={14} />

            <span>
              SOLUTIONS FOR WHAT'S NEXT
            </span>
          </div>

          <div className="v-solutions__header-content">

            <h2>
              From ideas to
              <span> intelligent systems.</span>
            </h2>

            <p>
              Whether you're starting something new or
              transforming an existing business, we create
              technology that is designed to evolve with you.
            </p>

          </div>
        </motion.div>

        {/* Main solution layout */}

        <div className="v-solutions__layout">

          {/* Left visual */}

          <motion.div
            className="v-solutions__visual"

            initial={{
              opacity: 0,
              x: -30
            }}

            whileInView={{
              opacity: 1,
              x: 0
            }}

            viewport={{
              once: true,
              amount: 0.15
            }}

            transition={{
              duration: 0.8
            }}
          >

            <div className="v-solutions__visual-grid" />

            <div className="v-solutions__visual-orbit orbit-one" />
            <div className="v-solutions__visual-orbit orbit-two" />
            <div className="v-solutions__visual-orbit orbit-three" />

            <div className="v-solutions__visual-core">

              <div className="v-solutions__core-glow" />

              <ShieldCheck size={42} />

              <span>
                BUILT
                <br />
                TO SCALE
              </span>

            </div>

            {/* Orbit nodes */}

            <div className="v-solution-node node-one">
              <span />
              AI
            </div>

            <div className="v-solution-node node-two">
              <span />
              CLOUD
            </div>

            <div className="v-solution-node node-three">
              <span />
              DATA
            </div>

            <div className="v-solution-node node-four">
              <span />
              WEB
            </div>

            <div className="v-solutions__visual-caption">
              <span className="caption-line" />
              <span>
                ONE TECHNOLOGY PARTNER
              </span>
            </div>

          </motion.div>

          {/* Right solution list */}

          <div className="v-solutions__list">

            {solutions.map((solution, index) => {
              const Icon = solution.icon;

              return (
                <motion.article
                  key={solution.id}
                  className="v-solution-item"

                  initial={{
                    opacity: 0,
                    x: 30
                  }}

                  whileInView={{
                    opacity: 1,
                    x: 0
                  }}

                  viewport={{
                    once: true,
                    amount: 0.15
                  }}

                  transition={{
                    duration: 0.6,
                    delay: index * 0.08
                  }}
                >

                  <div className="v-solution-item__number">
                    {solution.id}
                  </div>

                  <div className="v-solution-item__icon">
                    <Icon size={20} />
                  </div>

                  <div className="v-solution-item__content">

                    <div className="v-solution-item__title-row">

                      <div>
                        <span className="v-solution-item__eyebrow">
                          {solution.shortTitle}
                        </span>

                        <h3>
                          {solution.title}
                        </h3>
                      </div>

                      <span className="v-solution-item__arrow">
                        <ArrowUpRight size={18} />
                      </span>

                    </div>

                    <p>
                      {solution.description}
                    </p>

                    <div className="v-solution-item__features">

                      {solution.features.map((feature) => (
                        <span key={feature}>
                          {feature}
                        </span>
                      ))}

                    </div>

                  </div>

                  <div className="v-solution-item__line" />

                </motion.article>
              );
            })}

          </div>

        </div>

      </div>
    </section>
  );
}

export default Solutions;