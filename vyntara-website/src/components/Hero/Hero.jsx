import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Play,
  Sparkles,
} from 'lucide-react';

import ParticleBackground
  from '../ParticleBackground/ParticleBackground';

import './Hero.css';


/* =========================================
   TYPEWRITER HEADING
========================================= */

function TypewriterText() {
  const fullText =
    'We Build Digital Solutions That Move Businesses Forward.';

  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;

    /* ================================
       TYPING
    ================================= */

    if (!isDeleting && text.length < fullText.length) {
      timer = setTimeout(() => {
        setText(
          fullText.slice(
            0,
            text.length + 1
          )
        );
      }, 70);
    }

    /* ================================
       FULL TEXT PAUSE
    ================================= */

    else if (
      !isDeleting &&
      text.length === fullText.length
    ) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2200);
    }

    /* ================================
       DELETING
    ================================= */

    else if (
      isDeleting &&
      text.length > 0
    ) {
      timer = setTimeout(() => {
        setText(
          fullText.slice(
            0,
            text.length - 1
          )
        );
      }, 35);
    }

    /* ================================
       RESTART
    ================================= */

    else if (
      isDeleting &&
      text.length === 0
    ) {
      timer = setTimeout(() => {
        setIsDeleting(false);
      }, 500);
    }

    return () => {
      clearTimeout(timer);
    };

  }, [text, isDeleting]);


  /* =========================================
     SPLIT TEXT
  ========================================= */

  const beforeGradient = 'We Build ';
  const gradientText = 'Digital Solutions';

  let before = '';
  let gradient = '';
  let after = '';


  /* =========================================
     TEXT BEFORE GRADIENT
  ========================================= */

  if (
    text.length <=
    beforeGradient.length
  ) {

    before = text;

  } else {

    before = beforeGradient;

    const remaining =
      text.slice(
        beforeGradient.length
      );


    /* =========================================
       GRADIENT TEXT
    ========================================= */

    if (
      remaining.length <=
      gradientText.length
    ) {

      gradient = remaining;

    } else {

      gradient = gradientText;

      after =
        remaining.slice(
          gradientText.length
        );
    }
  }


  /* =========================================
     OUTPUT
  ========================================= */

  return (
    <h1 className="v-hero__title">

      {before}

      <span className="v-typewriter-gradient">
        {gradient}
      </span>

      {after}

      <span
        className="v-typewriter-cursor"
        aria-hidden="true"
      >
        |
      </span>

    </h1>
  );
}


/* =========================================
   HERO
========================================= */

function Hero() {

  return (

    <section
      className="v-hero"
      id="home"
    >

      {/* =====================================
          PARTICLE BACKGROUND
      ====================================== */}

      <ParticleBackground />


      {/* =====================================
          GRID
      ====================================== */}

      <div className="v-hero__grid" />


      {/* =====================================
          AMBIENT GLOWS
      ====================================== */}

      <div
        className="
          v-hero__glow
          v-hero__glow--blue
        "
      />

      <div
        className="
          v-hero__glow
          v-hero__glow--violet
        "
      />


      {/* =====================================
          DECORATIVE PARTICLES
      ====================================== */}

      <div
        className="
          v-hero__particle
          v-hero__particle--one
        "
      />

      <div
        className="
          v-hero__particle
          v-hero__particle--two
        "
      />

      <div
        className="
          v-hero__particle
          v-hero__particle--three
        "
      />


      {/* =====================================
          CONTAINER
      ====================================== */}

      <div className="v-container v-hero__container">

        <motion.div
          className="v-hero__content"

          initial={{
            opacity: 0,
            y: 30,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.8,

            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >


          {/* =================================
              BADGE
          ================================== */}

          <motion.div
            className="v-hero__badge"

            initial={{
              opacity: 0,
              y: 15,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 0.15,
              duration: 0.6,
            }}
          >

            <Sparkles size={14} />

            <span>
              Digital Innovation • Software • AI
            </span>

          </motion.div>


          {/* =================================
              TYPEWRITER HEADING

              ONLY THIS ELEMENT HAS
              THE TYPEWRITER ANIMATION.
          ================================== */}

          <TypewriterText />


          {/* =================================
              DESCRIPTION
          ================================== */}

          <p className="v-hero__description">

            From powerful software and modern
            websites to intelligent AI automation
            and scalable digital platforms,
            Vyntara transforms ambitious ideas
            into extraordinary digital experiences.

          </p>


          {/* =================================
              ACTION BUTTONS
          ================================== */}

          <div className="v-hero__actions">


            {/* PRIMARY BUTTON */}

            <a
              href="#contact"
              className="
                v-button
                v-button--primary
              "
            >

              <span>
                Start a Project
              </span>

              <ArrowRight size={17} />

            </a>


            {/* SECONDARY BUTTON */}

            <a
              href="#projects"
              className="
                v-button
                v-button--secondary
              "
            >

              <span className="v-button__play">

                <Play size={13} />

              </span>

              <span>
                Explore Our Work
              </span>

            </a>

          </div>


          {/* =================================
              STATS
          ================================== */}

          <div className="v-hero__stats">


            {/* PROJECTS */}

            <div className="v-hero__stat">

              <strong>
                50+
              </strong>

              <span>
                Projects
              </span>

            </div>


            {/* DIVIDER */}

            <div className="v-hero__stat-divider" />


            {/* TECHNOLOGIES */}

            <div className="v-hero__stat">

              <strong>
                15+
              </strong>

              <span>
                Technologies
              </span>

            </div>


            {/* DIVIDER */}

            <div className="v-hero__stat-divider" />


            {/* SUPPORT */}

            <div className="v-hero__stat">

              <strong>
                24/7
              </strong>

              <span>
                Support
              </span>

            </div>

          </div>

        </motion.div>

      </div>


      {/* =====================================
          BOTTOM FADE
      ====================================== */}

      <div className="v-hero__bottom-fade" />

    </section>

  );
}


export default Hero;