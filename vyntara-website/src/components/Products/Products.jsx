import { motion } from 'motion/react';
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ExternalLink,
  Layers3,
  Sparkles,
  Users
} from 'lucide-react';

import './Products.css';

const products = [
  {
    id: '01',
    category: 'BUSINESS MANAGEMENT',
    name: 'Vyntara Business Suite',
    description:
      'A unified platform for managing business operations, employees, expenses, customers and everyday workflows from one intelligent workspace.',
    icon: Building2,
    status: 'Coming Soon',
    stats: [
      ['Operations', 'Centralized'],
      ['Workflows', 'Automated'],
      ['Analytics', 'Real-time']
    ],
    features: [
      'Business Dashboard',
      'Expense Management',
      'Employee Management',
      'Reports & Analytics'
    ]
  },
  {
    id: '02',
    category: 'AI & AUTOMATION',
    name: 'Vyntara AI',
    description:
      'Intelligent AI capabilities designed to help businesses automate repetitive tasks, understand their data and make faster decisions.',
    icon: Sparkles,
    status: 'In Development',
    stats: [
      ['AI Engine', 'Intelligent'],
      ['Automation', 'Smart'],
      ['Insights', 'Real-time']
    ],
    features: [
      'AI Assistants',
      'Document Intelligence',
      'Workflow Automation',
      'Business Insights'
    ]
  },
  {
    id: '03',
    category: 'CRM & CUSTOMER EXPERIENCE',
    name: 'Vyntara Connect',
    description:
      'A modern customer relationship platform built to organize leads, conversations, follow-ups and customer interactions.',
    icon: Users,
    status: 'Coming Soon',
    stats: [
      ['Leads', 'Organized'],
      ['Follow-ups', 'Automated'],
      ['Customers', 'Connected']
    ],
    features: [
      'Lead Management',
      'Customer Profiles',
      'Follow-up Automation',
      'Performance Tracking'
    ]
  }
];

function ProductVisual({ product }) {
  const Icon = product.icon;

  return (
    <div className="v-product-card__visual">

      <div className="v-product-card__visual-grid" />

      <div className="v-product-card__glow" />

      <div className="v-product-card__window">

        <div className="v-product-card__window-top">

          <div className="v-window-dots">
            <span />
            <span />
            <span />
          </div>

          <span className="v-window-title">
            {product.name}
          </span>

          <span className="v-window-menu">
            •••
          </span>

        </div>

        <div className="v-product-dashboard">

          <div className="v-dashboard-sidebar">

            <div className="v-dashboard-logo">
              V
            </div>

            <span className="active" />
            <span />
            <span />
            <span />
            <span />

          </div>

          <div className="v-dashboard-main">

            <div className="v-dashboard-heading">
              <div>
                <small>Overview</small>
                <strong>Good morning 👋</strong>
              </div>

              <div className="v-dashboard-profile" />
            </div>

            <div className="v-dashboard-stats">

              <div>
                <span>Total</span>
                <strong>₹ 84.6K</strong>
                <small>+18.4%</small>
              </div>

              <div>
                <span>Projects</span>
                <strong>24</strong>
                <small>+6 this month</small>
              </div>

              <div>
                <span>Growth</span>
                <strong>32.8%</strong>
                <small>Above target</small>
              </div>

            </div>

            <div className="v-dashboard-chart">

              <div className="v-chart-header">
                <span>Performance</span>
                <small>Last 30 days</small>
              </div>

              <div className="v-chart">

                <div className="v-chart-line">
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

      </div>

      <div className="v-product-floating-icon">
        <Icon size={18} />
      </div>

      <div className="v-product-floating-badge">
        <span />
        {product.status}
      </div>

    </div>
  );
}

function Products() {
  return (
    <section
      className="v-products"
      id="products"
    >

      <div className="v-products__ambient" />

      <div className="v-container">

        {/* Header */}

        <motion.div
          className="v-products__header"

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

          <div className="v-products__label">
            <Layers3 size={14} />

            <span>
              OUR PRODUCTS
            </span>
          </div>

          <div className="v-products__heading-row">

            <h2>
              Software we're
              <span> building for the future.</span>
            </h2>

            <p>
              We don't just build technology for our clients.
              We continuously create our own products to solve
              real-world business challenges.
            </p>

          </div>

        </motion.div>

        {/* Product Cards */}

        <div className="v-products__list">

          {products.map((product, index) => (

            <motion.article
              key={product.id}
              className="v-product-card"

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
                amount: 0.12
              }}

              transition={{
                duration: 0.7,
                delay: index * 0.1
              }}
            >

              <ProductVisual product={product} />

              <div className="v-product-card__content">

                <div className="v-product-card__top">

                  <div>
                    <span className="v-product-card__category">
                      {product.category}
                    </span>

                    <h3>
                      {product.name}
                    </h3>
                  </div>

                  <span className="v-product-card__number">
                    {product.id}
                  </span>

                </div>

                <p className="v-product-card__description">
                  {product.description}
                </p>

                {/* Stats */}

                <div className="v-product-card__stats">

                  {product.stats.map(([label, value]) => (
                    <div key={label}>

                      <span>
                        {label}
                      </span>

                      <strong>
                        {value}
                      </strong>

                    </div>
                  ))}

                </div>

                {/* Features */}

                <div className="v-product-card__features">

                  {product.features.map((feature) => (
                    <span key={feature}>
                      <CheckCircle2 size={12} />
                      {feature}
                    </span>
                  ))}

                </div>

                <div className="v-product-card__actions">

                  <a
                    href="#contact"
                    className="v-product-card__button"
                  >
                    <span>Register Interest</span>
                    <ArrowUpRight size={16} />
                  </a>

                  <button
                    type="button"
                    className="v-product-card__link"
                  >
                    <span>Learn More</span>
                    <ExternalLink size={14} />
                  </button>

                </div>

              </div>

            </motion.article>

          ))}

        </div>

        {/* Bottom CTA */}

        <motion.div
          className="v-products__bottom"

          initial={{
            opacity: 0,
            y: 20
          }}

          whileInView={{
            opacity: 1,
            y: 0
          }}

          viewport={{
            once: true
          }}

          transition={{
            duration: 0.6
          }}
        >

          <div>
            <BarChart3 size={18} />

            <span>
              Have an idea for a product?
            </span>
          </div>

          <a href="#contact">
            Let's build it together
            <ArrowUpRight size={16} />
          </a>

        </motion.div>

      </div>

    </section>
  );
}

export default Products;