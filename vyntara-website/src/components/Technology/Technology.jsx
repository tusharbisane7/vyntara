
import { motion } from 'motion/react';
import {
  Code2,
  Database,
  Cloud,
  BrainCircuit,
  Globe2,
  Server,
  ArrowUpRight,
  Layers3
} from 'lucide-react';
import './Technology.css';

const technologyGroups = [
  {
    number: '01',
    title: 'Frontend',
    description: 'Modern interfaces built for speed, usability and scale.',
    icon: Globe2,
    technologies: [
      { name: 'React', short: 'R' },
      { name: 'Next.js', short: 'N' },
      { name: 'JavaScript', short: 'JS' },
      { name: 'TypeScript', short: 'TS' },
      { name: 'HTML5', short: 'H5' },
      { name: 'CSS3', short: 'C3' }
    ]
  },
  {
    number: '02',
    title: 'Backend',
    description: 'Reliable application architecture and powerful APIs.',
    icon: Server,
    technologies: [
      { name: 'Node.js', short: 'N' },
      { name: 'Python', short: 'PY' },
      { name: 'Java', short: 'JV' },
      { name: 'PHP', short: 'PHP' },
      { name: 'REST APIs', short: 'API' }
    ]
  },
  {
    number: '03',
    title: 'Database',
    description: 'Structured and scalable data solutions for modern systems.',
    icon: Database,
    technologies: [
      { name: 'MongoDB', short: 'M' },
      { name: 'PostgreSQL', short: 'PG' },
      { name: 'MySQL', short: 'SQL' },
      { name: 'Firebase', short: 'FB' }
    ]
  },
  {
    number: '04',
    title: 'AI & Automation',
    description: 'Intelligent systems that reduce manual work and unlock insights.',
    icon: BrainCircuit,
    technologies: [
      { name: 'OpenAI', short: 'AI' },
      { name: 'Python AI', short: 'PY' },
      { name: 'TensorFlow', short: 'TF' },
      { name: 'Automation APIs', short: 'AX' }
    ]
  },
  {
    number: '05',
    title: 'Cloud & DevOps',
    description: 'Infrastructure designed for availability, deployment and growth.',
    icon: Cloud,
    technologies: [
      { name: 'AWS', short: 'AWS' },
      { name: 'Azure', short: 'AZ' },
      { name: 'Docker', short: 'DK' },
      { name: 'Git', short: 'GT' },
      { name: 'GitHub', short: 'GH' }
    ]
  },
  {
    number: '06',
    title: 'Engineering',
    description: 'A flexible technology foundation for complex digital products.',
    icon: Code2,
    technologies: [
      { name: 'APIs', short: 'API' },
      { name: 'Microservices', short: 'MS' },
      { name: 'Authentication', short: 'AU' },
      { name: 'Integrations', short: 'IN' }
    ]
  }
];

const marqueeItems = [
  'React',
  'Node.js',
  'Python',
  'Next.js',
  'JavaScript',
  'TypeScript',
  'MongoDB',
  'PostgreSQL',
  'AWS',
  'Docker',
  'AI',
  'Automation'
];

function Technology() {
  return (
    <section className="technology-section" id="technology">
      <div className="technology-grid-bg" />

      <div className="v-container">
        <motion.div
          className="technology-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className="technology-heading">
            <span className="technology-eyebrow">
              <span className="technology-eyebrow-line" />
              TECHNOLOGY STACK
            </span>

            <h2>
              Built with technology
              <span> that moves fast.</span>
            </h2>
          </div>

          <div className="technology-intro">
            <p>
              We choose the right technologies for the problem — combining
              modern development, intelligent automation and scalable
              infrastructure to create dependable digital products.
            </p>

            <div className="technology-header-mark">
              <Layers3 size={18} />
              <span>FUTURE READY</span>
            </div>
          </div>
        </motion.div>

        <div className="technology-marquee">
          <div className="technology-marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <div className="technology-marquee-item" key={`${item}-${index}`}>
                <span className="technology-marquee-dot" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="technology-layout">
          <motion.div
            className="technology-side-copy"
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <div className="technology-side-number">06</div>

            <h3>
              One ecosystem.
              <br />
              <span>Many possibilities.</span>
            </h3>

            <p>
              From the first line of code to production deployment, every
              technology choice is made around performance, maintainability
              and the long-term needs of the product.
            </p>

            <div className="technology-side-status">
              <span className="status-pulse" />
              <span>ENGINEERED FOR SCALE</span>
            </div>
          </motion.div>

          <div className="technology-cards">
            {technologyGroups.map((group, index) => {
              const Icon = group.icon;

              return (
                <motion.article
                  className="technology-card"
                  key={group.title}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.65,
                    delay: index * 0.07
                  }}
                  whileHover={{ y: -6 }}
                >
                  <div className="technology-card-top">
                    <div className="technology-card-icon">
                      <Icon size={20} strokeWidth={1.7} />
                    </div>

                    <span className="technology-card-number">
                      {group.number}
                    </span>
                  </div>

                  <div className="technology-card-content">
                    <h3>{group.title}</h3>
                    <p>{group.description}</p>
                  </div>

                  <div className="technology-list">
                    {group.technologies.map((technology) => (
                      <div
                        className="technology-chip"
                        key={technology.name}
                      >
                        <span className="technology-chip-logo">
                          {technology.short}
                        </span>
                        <span>{technology.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="technology-card-arrow">
                    <ArrowUpRight size={17} />
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        <motion.div
          className="technology-bottom"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="technology-bottom-line" />

          <div className="technology-bottom-content">
            <span>TECHNOLOGY IS A TOOL.</span>
            <strong>THE SOLUTION IS THE PRODUCT.</strong>
          </div>

          <div className="technology-bottom-line" />
        </motion.div>
      </div>
    </section>
  );
}

export default Technology;

