import { useState } from 'react';

import {
  ArrowUpRight,
  Menu,
  X
} from 'lucide-react';

import logo from '../../assets/vyntara-logo.png';
import logoName from '../../assets/vyntara-name.png';

import './Navbar.css';


/* =========================================
   NAVIGATION ITEMS
========================================= */

const navigationItems = [
  {
    label: 'Home',
    href: '/'
  },
  {
    label: 'Services',
    href: '/#services'
  },
  {
    label: 'Solutions',
    href: '/#solutions'
  },
  {
    label: 'Projects',
    href: '/#projects'
  },
  {
    label: 'Career',
    href: '/careers'
  }
];


/* =========================================
   NAVBAR
========================================= */

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);


  /* =========================================
     CLOSE MOBILE MENU
  ========================================== */

  const closeMenu = () => {
    setMenuOpen(false);
  };


  /* =========================================
     HANDLE NAVIGATION
     
     If already on home:
       /#services → scroll normally

     If on another page:
       /#services → return to home and
       browser will handle the hash.
  ========================================== */

  const handleNavigation = (event, href) => {

    closeMenu();

    /*
      Home
    */

    if (href === '/') {

      if (window.location.pathname === '/') {

        event.preventDefault();

        window.history.replaceState(
          null,
          '',
          '/'
        );

        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });

      }

      return;
    }


    /*
      Hash navigation
      Example:
      /#services
      /#solutions
      /#projects
    */

    if (href.startsWith('/#')) {

      const sectionId = href.substring(2);

      /*
        If already on Home,
        smooth scroll directly.
      */

      if (window.location.pathname === '/') {

        event.preventDefault();

        const section = document.getElementById(
          sectionId
        );

        if (section) {

          section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          /*
            Keep URL clean and correct.
          */

          window.history.replaceState(
            null,
            '',
            `/#${sectionId}`
          );

        }

      }

      /*
        If on another page, don't prevent
        default navigation.

        Browser goes to:

        /#services

        React/Vite loads Home and browser
        moves to the section.
      */

      return;
    }

  };


  /* =========================================
     START PROJECT
  ========================================== */

  const handleStartProject = (event) => {

    closeMenu();

    /*
      If already on Home,
      scroll directly to contact.
    */

    if (window.location.pathname === '/') {

      event.preventDefault();

      const contactSection =
        document.getElementById('contact');

      if (contactSection) {

        contactSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        window.history.replaceState(
          null,
          '',
          '/#contact'
        );

      }

      return;
    }

    /*
      If on Careers or another page,
      browser navigates to Home + contact.
    */

  };


  return (

    <header className="v-navbar">

      <div className="v-container v-navbar__inner">


        {/* =========================================
            COMPANY BRAND
        ========================================== */}

        <a
          href="/"
          className="v-brand"
          onClick={(event) =>
            handleNavigation(event, '/')
          }
          aria-label="Vyntara Technologies home"
        >

          {/* Vyntara Logo */}

          <img
            src={logo}
            alt="Vyntara logo"
            className="v-brand__logo"
          />


          {/* Vyntara Company Name */}

          <img
            src={logoName}
            alt="Vyntara Technologies"
            className="v-brand__name"
          />

        </a>


        {/* =========================================
            DESKTOP NAVIGATION
        ========================================== */}

        <nav
          className="v-navbar__links"
          aria-label="Main navigation"
        >

          {navigationItems.map((item) => (

            <a
              key={item.label}
              href={item.href}
              className="v-navbar__link"
              onClick={(event) =>
                handleNavigation(
                  event,
                  item.href
                )
              }
            >

              {item.label}

            </a>

          ))}

        </nav>


        {/* =========================================
            DESKTOP CTA
        ========================================== */}

        <a
          href="/#contact"
          className="v-navbar__cta"
          onClick={handleStartProject}
        >

          <span>
            Start a Project
          </span>

          <ArrowUpRight size={16} />

        </a>


        {/* =========================================
            MOBILE MENU BUTTON
        ========================================== */}

        <button
          type="button"
          className="v-navbar__menu"

          onClick={() =>
            setMenuOpen(
              (previous) => !previous
            )
          }

          aria-label={
            menuOpen
              ? 'Close navigation menu'
              : 'Open navigation menu'
          }

          aria-expanded={menuOpen}

          aria-controls="v-mobile-navigation"
        >

          {menuOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}

        </button>

      </div>


      {/* =========================================
          MOBILE NAVIGATION
      ========================================== */}

      <div
        id="v-mobile-navigation"

        className={`
          v-mobile-menu
          ${
            menuOpen
              ? 'v-mobile-menu--open'
              : ''
          }
        `}
      >

        <nav
          className="v-mobile-menu__inner"
          aria-label="Mobile navigation"
        >

          {navigationItems.map((item) => (

            <a
              key={item.label}
              href={item.href}
              className="v-mobile-menu__link"
              onClick={(event) =>
                handleNavigation(
                  event,
                  item.href
                )
              }
            >

              {item.label}

            </a>

          ))}


          {/* =====================================
              MOBILE CTA
          ====================================== */}

          <a
            href="/#contact"
            className="v-mobile-menu__cta"
            onClick={handleStartProject}
          >

            <span>
              Start a Project
            </span>

            <ArrowUpRight size={17} />

          </a>

        </nav>

      </div>

    </header>
  );
}


export default Navbar;