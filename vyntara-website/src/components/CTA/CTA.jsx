import { motion } from 'motion/react';

import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Mail,
  Phone,
  MessageCircle,
  CheckCircle2
} from 'lucide-react';

import './CTA.css';


/* =========================================
   CONTACT OPTIONS
========================================= */

const contactOptions = [
  {
    icon: Mail,
    label: 'Email',
    value: 'technologiesvyntara@gmail.com',
    href: 'mailto:technologiesvyntara@gmail.com'
  },
  {
    icon: Phone,
    label: 'Call',
    value: '+91 9067934163',
    href: 'tel:+91906934163'
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Start a conversation',
    href: '9067934163'
  }
];


/* =========================================
   PROJECT SERVICES
========================================= */

const projectPoints = [
  'Custom software & web platforms',
  'AI-powered applications & automation',
  'Mobile applications & digital products'
];


/* =========================================
   OPEN PROJECT FORM
========================================= */

const openProjectForm = () => {
  window.dispatchEvent(
    new Event('openProjectForm')
  );
};


/* =========================================
   CTA COMPONENT
========================================= */

function CTA() {
  return (
    <section
      className="cta-section"
      id="contact"
    >

      {/* =====================================
          BACKGROUND ORBS
      ====================================== */}

      <div className="cta-orb cta-orb-one" />

      <div className="cta-orb cta-orb-two" />

      <div className="cta-orb cta-orb-three" />

      <div className="cta-grid-background" />


      <div className="v-container">


        {/* =====================================
            MAIN CTA
        ====================================== */}

        <motion.div
          className="cta-main"

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
            duration: 0.8
          }}
        >


          {/* =================================
              TOP LINE
          ================================== */}

          <div className="cta-top-line">

            <span className="cta-eyebrow">

              <span className="cta-eyebrow-dot" />

              START SOMETHING GREAT

            </span>


            <span className="cta-index">
              VYNTARA / 001
            </span>

          </div>


          {/* =================================
              CONTENT
          ================================== */}

          <div className="cta-content">


            {/* Heading */}

            <div className="cta-heading-wrap">

              <span className="cta-sparkle">
                <Sparkles size={18} />
              </span>


              <h2>

                Have an idea?

                <br />

                <span>
                  Let's build it.
                </span>

              </h2>

            </div>


            {/* Description */}

            <div className="cta-description">

              <p>
                Whether you are starting from an idea,
                improving an existing system or building
                something entirely new, we can help turn
                your vision into a powerful digital product.
              </p>


              {/* Project Points */}

              <div className="cta-points">

                {projectPoints.map((point) => (

                  <div
                    className="cta-point"
                    key={point}
                  >

                    <CheckCircle2 size={15} />

                    <span>
                      {point}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>


          {/* =================================
              CTA ACTIONS
          ================================== */}

          <div className="cta-action-row">


            {/* Start Project */}

            <button
              type="button"
              className="cta-primary-button"
              onClick={openProjectForm}
            >

              <span>
                Start a Project
              </span>


              <span className="cta-primary-icon">

                <ArrowRight size={18} />

              </span>

            </button>


            {/* Explore Projects */}

            <a
              href="#projects"
              className="cta-secondary-button"
            >

              <span>
                Explore Our Work
              </span>

              <ArrowUpRight size={17} />

            </a>

          </div>

        </motion.div>


        {/* =====================================
            CONTACT GRID
        ====================================== */}

        <motion.div
          className="cta-contact-grid"

          initial={{
            opacity: 0,
            y: 25
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
            duration: 0.7,
            delay: 0.15
          }}
        >

          {contactOptions.map((contact) => {

            const Icon = contact.icon;


            /* ================================
               WHATSAPP
            ================================= */

            if (contact.label === 'WhatsApp') {

              return (
                <a
                  href={contact.href}
                  className="cta-contact-card"
                  key={contact.label}
                  onClick={(event) => {

                    /*
                      WhatsApp link is currently
                      a placeholder.

                      Replace contact.href with
                      your real WhatsApp URL.
                    */

                    if (contact.href === '#') {
                      event.preventDefault();

                      openProjectForm();
                    }

                  }}
                >

                  <div className="cta-contact-icon">

                    <Icon
                      size={18}
                      strokeWidth={1.7}
                    />

                  </div>


                  <div className="cta-contact-info">

                    <span>
                      {contact.label}
                    </span>

                    <strong>
                      {contact.value}
                    </strong>

                  </div>


                  <ArrowUpRight
                    className="cta-contact-arrow"
                    size={17}
                  />

                </a>
              );

            }


            /* ================================
               EMAIL / PHONE
            ================================= */

            return (
              <a
                href={contact.href}
                className="cta-contact-card"
                key={contact.label}
              >

                <div className="cta-contact-icon">

                  <Icon
                    size={18}
                    strokeWidth={1.7}
                  />

                </div>


                <div className="cta-contact-info">

                  <span>
                    {contact.label}
                  </span>

                  <strong>
                    {contact.value}
                  </strong>

                </div>


                <ArrowUpRight
                  className="cta-contact-arrow"
                  size={17}
                />

              </a>
            );

          })}

        </motion.div>


        {/* =====================================
            BOTTOM BRAND LINE
        ====================================== */}

        <div className="cta-bottom">

          <div className="cta-bottom-line" />


          <div className="cta-bottom-center">

            <span>
              VYNTARA TECHNOLOGIES
            </span>

            <i />

            <span>
              DIGITAL SOLUTIONS. ENDLESS POSSIBILITIES.
            </span>

          </div>


          <div className="cta-bottom-line" />

        </div>

      </div>

    </section>
  );
}


export default CTA;