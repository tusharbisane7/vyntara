import { motion } from 'motion/react';

import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  ArrowUp,
  Send
} from 'lucide-react';

import {
  FaLinkedinIn,
  FaInstagram,
  FaGithub,
  FaFacebookF,
  FaYoutube,
  FaWhatsapp,
  FaXTwitter
} from 'react-icons/fa6';

import logo from '../../assets/vyntara-logo.png';
import logoName from '../../assets/vyntara-name.png';

import './Footer.css';


/* =========================================
   FOOTER NAVIGATION
========================================= */

const footerNavigation = {
  company: [
    {
      label: 'Home',
      href: '#home'
    },
    {
      label: 'About',
      href: '#about'
    },
    {
      label: 'Projects',
      href: '#projects'
    },
    {
      label: 'Contact',
      href: '#contact'
    }
  ],

  services: [
    {
      label: 'Custom Software',
      href: '#services'
    },
    {
      label: 'Web Development',
      href: '#services'
    },
    {
      label: 'Mobile Applications',
      href: '#services'
    },
    {
      label: 'AI & Automation',
      href: '#services'
    },
    {
      label: 'Cloud Solutions',
      href: '#services'
    }
  ],

  explore: [
    {
      label: 'Solutions',
      href: '#solutions'
    },
    {
      label: 'Products',
      href: '#products'
    },
    {
      label: 'Technology',
      href: '#technology'
    },
    {
      label: 'Process',
      href: '#process'
    },
    {
      label: 'Testimonials',
      href: '#testimonials'
    }
  ]
};


/* =========================================
   SOCIAL MEDIA
========================================= */

const socialLinks = [
  {
    label: 'LinkedIn',
    href: '#',
    icon: FaLinkedinIn
  },
  {
    label: 'Instagram',
    href: '#',
    icon: FaInstagram
  },
  {
    label: 'GitHub',
    href: '#',
    icon: FaGithub
  },
  {
    label: 'Facebook',
    href: '#',
    icon: FaFacebookF
  },
  {
    label: 'YouTube',
    href: '#',
    icon: FaYoutube
  },
  {
    label: 'WhatsApp',
    href: '#',
    icon: FaWhatsapp
  },
  {
    label: 'X',
    href: '#',
    icon: FaXTwitter
  }
];


/* =========================================
   FOOTER COMPONENT
========================================= */

function Footer() {

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };


  return (
    <footer className="footer-section">

      {/* =====================================
          BACKGROUND
      ====================================== */}

      <div className="footer-grid-background" />

      <div className="footer-glow" />


      <div className="v-container">


        {/* =====================================
            MAIN FOOTER
        ====================================== */}

        <motion.div
          className="footer-main"

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
            amount: 0.15
          }}

          transition={{
            duration: 0.7
          }}
        >


          {/* =================================
              BRAND
          ================================== */}

          <div className="footer-brand">

            {/* Brand Logo */}

            <a
              href="#home"
              className="footer-logo"
              aria-label="Vyntara Technologies home"
            >

              {/* V Logo */}

              <img
                src={logo}
                alt="Vyntara logo"
                className="footer-logo-image"
              />


              {/* Company Name */}

              <img
                src={logoName}
                alt="Vyntara Technologies"
                className="footer-logo-name"
              />

            </a>


            {/* Description */}

            <p className="footer-description">
              Building digital solutions that help
              ambitious businesses innovate,
              automate and grow.
            </p>


            {/* Tagline */}

            <div className="footer-tagline">

              <span>
                DIGITAL SOLUTIONS.
              </span>

              <strong>
                ENDLESS POSSIBILITIES.
              </strong>

            </div>


            {/* =================================
                SOCIAL MEDIA
            ================================== */}

            <div className="footer-socials">

              {socialLinks.map((social) => {

                const Icon = social.icon;

                return (
                  <a
                    href={social.href}
                    key={social.label}
                    className="footer-social"
                    aria-label={social.label}
                    title={social.label}
                  >

                    <Icon size={16} />

                  </a>
                );

              })}

            </div>

          </div>


          {/* =================================
              COMPANY
          ================================== */}

          <div className="footer-links-column">

            <span className="footer-column-title">
              COMPANY
            </span>


            <nav>

              {footerNavigation.company.map((item) => (

                <a
                  href={item.href}
                  key={item.label}
                >

                  {item.label}

                  <ArrowUpRight size={12} />

                </a>

              ))}

            </nav>

          </div>


          {/* =================================
              SERVICES
          ================================== */}

          <div
            className="
              footer-links-column
              footer-services-column
            "
          >

            <span className="footer-column-title">
              SERVICES
            </span>


            <nav>

              {footerNavigation.services.map((item) => (

                <a
                  href={item.href}
                  key={item.label}
                >

                  {item.label}

                  <ArrowUpRight size={12} />

                </a>

              ))}

            </nav>

          </div>


          {/* =================================
              EXPLORE
          ================================== */}

          <div className="footer-links-column">

            <span className="footer-column-title">
              EXPLORE
            </span>


            <nav>

              {footerNavigation.explore.map((item) => (

                <a
                  href={item.href}
                  key={item.label}
                >

                  {item.label}

                  <ArrowUpRight size={12} />

                </a>

              ))}

            </nav>

          </div>

        </motion.div>


        {/* =====================================
            CONTACT STRIP
        ====================================== */}

        <motion.div
          className="footer-contact-strip"

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
            duration: 0.7,
            delay: 0.1
          }}
        >



        </motion.div>


        {/* =====================================
            FOOTER BOTTOM
        ====================================== */}

        <div className="footer-bottom">


          {/* Copyright */}

          <div className="footer-copyright">

            <span>
              © {new Date().getFullYear()}
              {' '}
              Vyntara Technologies.
            </span>

            <span>
              All rights reserved.
            </span>

          </div>


          {/* Legal */}

          <div className="footer-legal">



           <a href="/privacy-policy">Privacy Policy</a>

            <a href="/terms">Terms & Conditions</a>

            <a
  href="/admin"
  className="footer-admin-link"
>
  Admin Login
</a>

          </div>


          {/* Back To Top */}

          <button
            type="button"
            className="footer-back-top"
            onClick={handleBackToTop}
            aria-label="Back to top"
          >

            <span>
              BACK TO TOP
            </span>


            <span className="footer-back-top-icon">

              <ArrowUp size={15} />

            </span>

          </button>

        </div>


        {/* =====================================
            LARGE BRAND
        ====================================== */}

        <div
          className="footer-big-brand"
          aria-hidden="true"
        >
          VYNTARA
        </div>


      </div>

    </footer>
  );
}


export default Footer;