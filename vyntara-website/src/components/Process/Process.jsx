
import { motion } from 'motion/react';
import {
  Search,
  Lightbulb,
  Palette,
  Code2,
  ShieldCheck,
  Rocket,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import './Process.css';

const processSteps = [
  {
    number: '01',
    title: 'Discover',
    description:
      'We understand your business, users, challenges and goals before defining the right digital direction.',
    icon: Search
  },
  {
    number: '02',
    title: 'Strategy',
    description:
      'We turn requirements into a clear product strategy, technical roadmap and execution plan.',
    icon: Lightbulb
  },
  {
    number: '03',
    title: 'Design',
    description:
      'We create intuitive, modern experiences that balance visual impact with usability.',
    icon: Palette
  },
  {
    number: '04',
    title: 'Build',
    description:
      'Our development process transforms the approved experience into scalable, production-ready software.',
    icon: Code2
  },
  {
    number: '05',
    title: 'Test',
    description:
      'We validate functionality, responsiveness, performance and reliability before release.',
    icon: ShieldCheck
  },
  {
    number: '06',
    title: 'Launch',
    description:
      'We deploy the solution and help establish a smooth transition from development to production.',
    icon: Rocket
  },
  {
    number: '07',
    title: 'Scale',
    description:
      'We continue improving, optimizing and expanding the product as your business evolves.',
    icon: TrendingUp
  }
];

function Process() {
  return (
    <section className="process-section" id="process">
      <div className="process-bg-glow process-bg-glow-one" />
      <div className="process-bg-glow process-bg-glow-two" />

      <div className="process-grid-background" />

      <div className="v-container">
        <motion.div
          className="process-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className="process-heading">
            <span className="process-eyebrow">
              <span className="process-eyebrow-line" />
              HOW WE BUILD
            </span>

            <h2>
              From first idea
              <span> to final product.</span>
            </h2>
          </div>

          <div className="process-intro">
            <p>
              Great digital products are not built in one step. Our process
              combines strategy, design, engineering and continuous
              improvement to turn ideas into meaningful technology.
            </p>

            <div className="process-intro-badge">
              <span className="process-live-dot" />
              <span>IDEA → IMPACT</span>
            </div>
          </div>
        </motion.div>

        <div className="process-visual">
          <div className="process-line">
            <motion.div
              className="process-line-progress"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
            />
          </div>

          <div className="process-steps">
            {processSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.article
                  className="process-step"
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.08
                  }}
                >
                  <div className="process-step-marker">
                    <span className="process-step-number">
                      {step.number}
                    </span>

                    <div className="process-step-icon">
                      <Icon size={21} strokeWidth={1.7} />
                    </div>
                  </div>

                  <div className="process-step-content">
                    <span className="process-step-label">
                      PHASE {step.number}
                    </span>

                    <h3>{step.title}</h3>

                    <p>{step.description}</p>
                  </div>

                  <div className="process-step-arrow">
                    <ArrowUpRight size={17} />
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        <motion.div
          className="process-bottom"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="process-bottom-left">
            <span className="process-bottom-number">07</span>

            <div>
              <span className="process-bottom-label">THE OUTCOME</span>
              <h3>Technology that creates momentum.</h3>
            </div>
          </div>

          <div className="process-bottom-right">
            <p>
              Clear communication. Thoughtful engineering. Continuous
              improvement.
            </p>

            <a href="#contact" className="process-bottom-link">
              Start your journey
              <ArrowUpRight size={17} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Process;

