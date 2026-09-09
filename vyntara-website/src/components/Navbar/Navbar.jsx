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
    href: '#home'
  },
  {
    label: 'Services',
    href: '#services'
  },
  {
    label: 'Solutions',
    href: '#solutions'
  },
  {
    label: 'Projects',
    href: '#projects'
  },
  {
    label: 'Career',
    href: '/careers'
  }
];


function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);


  /* =========================================
     CLOSE MOBILE MENU
  ========================================== */

  const closeMenu = () => {
    setMenuOpen(false);
  };


  return (

    <header className="v-navbar">

      <div className="v-container v-navbar__inner">


        {/* =========================================
            COMPANY BRAND
        ========================================== */}

        <a
          href="#home"
          className="v-brand"
          onClick={closeMenu}
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
            >
              {item.label}
            </a>

          ))}

        </nav>


        {/* =========================================
            DESKTOP CTA
        ========================================== */}

        <a
          href="#contact"
          className="v-navbar__cta"
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
              onClick={closeMenu}
            >
              {item.label}
            </a>

          ))}


          {/* =====================================
              MOBILE CTA
          ====================================== */}

          <a
            href="#contact"
            className="v-mobile-menu__cta"
            onClick={closeMenu}
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