import { motion } from 'motion/react';
import {
  Code2,
  Globe2,
  BrainCircuit,
  Cloud,
  Smartphone,
  Database,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

import './Services.css';

const services = [
  {
    number: '01',
    icon: Code2,
    title: 'Custom Software',
    description:
      'Powerful, scalable software engineered around your business processes, workflows and long-term goals.',
    tags: ['Web Apps', 'Enterprise', 'SaaS']
  },
  {
    number: '02',
    icon: Globe2,
    title: 'Web Development',
    description:
      'High-performance websites and digital experiences designed to turn visitors into customers.',
    tags: ['Websites', 'E-Commerce', 'CMS']
  },
  {
    number: '03',
    icon: Smartphone,
    title: 'Mobile Applications',
    description:
      'Modern mobile applications that deliver fast, intuitive and engaging experiences across devices.',
    tags: ['Android', 'iOS', 'Cross-Platform']
  },
  {
    number: '04',
    icon: BrainCircuit,
    title: 'AI & Automation',
    description:
      'Intelligent systems that automate repetitive work, unlock insights and help businesses operate smarter.',
    tags: ['AI', 'Automation', 'ML']
  },
  {
    number: '05',
    icon: Cloud,
    title: 'Cloud Solutions',
    description:
      'Secure and scalable cloud infrastructure built for performance, reliability and future growth.',
    tags: ['Cloud', 'DevOps', 'Security']
  },
  {
    number: '06',
    icon: Database,
    title: 'Business Systems',
    description:
      'Connected ERP, CRM and management platforms that bring your business operations together.',
    tags: ['ERP', 'CRM', 'Analytics']
  }
];

function Services() {
  return (
    <section
      className="v-services"
      id="services"
    >
      <div className="v-services__background" />

      <div className="v-container">

        {/* Section Header */}

        <motion.div
          className="v-services__header"
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

          <div className="v-section-label">
            <Sparkles size={14} />
            <span>WHAT WE BUILD</span>
          </div>

          <div className="v-services__heading-row">

            <h2>
              Technology that
              <span> creates impact.</span>
            </h2>

            <p>
              We combine technology, creativity and business
              thinking to build digital solutions that solve
              real problems and create measurable value.
            </p>

          </div>

        </motion.div>

        {/* Services Grid */}

        <div className="v-services__grid">

          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.article
                key={service.number}
                className="v-service-card"

                initial={{
                  opacity: 0,
                  y: 40
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
                  duration: 0.6,
                  delay: index * 0.08
                }}
              >

                <div className="v-service-card__top">

                  <span className="v-service-card__number">
                    {service.number}
                  </span>

                  <div className="v-service-card__icon">
                    <Icon size={22} />
                  </div>

                </div>

                <div className="v-service-card__content">

                  <h3>
                    {service.title}
                  </h3>

                  <p>
                    {service.description}
                  </p>

                </div>

                <div className="v-service-card__footer">

                  <div className="v-service-card__tags">
                    {service.tags.map((tag) => (
                      <span key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="v-service-card__arrow">
                    <ArrowUpRight size={17} />
                  </span>

                </div>

                <div className="v-service-card__shine" />

              </motion.article>
            );
          })}

        </div>

      </div>
    </section>
  );
}

export default Services;