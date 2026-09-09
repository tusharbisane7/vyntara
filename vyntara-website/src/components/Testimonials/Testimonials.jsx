import { motion, AnimatePresence } from 'motion/react';

import {
  Quote,
  ArrowLeft,
  ArrowRight,
  Star,
  MessageSquareQuote,
} from 'lucide-react';

import { useEffect, useRef, useState } from 'react';

import './Testimonials.css';


/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000';


/* =========================================================
   AUTO SLIDE CONFIGURATION
========================================================= */

const AUTO_SLIDE_INTERVAL = 5000;


/* =========================================================
   GET INITIALS
========================================================= */

function getInitials(name = '') {

  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join('');

}


/* =========================================================
   FORMAT TESTIMONIAL
========================================================= */

function formatTestimonial(testimonial) {

  const rating =
    Number(testimonial?.rating);


  return {

    id:
      testimonial?.id,

    quote:
      testimonial?.description?.trim() ||
      '',

    name:
      testimonial?.name?.trim() ||
      'Client',

    company:
      testimonial?.organization?.trim() ||
      'Project Partner',

    rating:
      Number.isInteger(rating) &&
      rating >= 1 &&
      rating <= 5
        ? rating
        : 5,

    initials:
      getInitials(
        testimonial?.name || ''
      ) || 'CL',

  };

}


/* =========================================================
   TESTIMONIALS
========================================================= */

function Testimonials() {

  const [
    testimonials,
    setTestimonials
  ] = useState([]);


  const [
    activeIndex,
    setActiveIndex
  ] = useState(0);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState('');


  const [
    isPaused,
    setIsPaused
  ] = useState(false);


  const resumeTimerRef =
    useRef(null);


  /* =======================================================
     FETCH TESTIMONIALS
  ======================================================= */

  useEffect(() => {

    let mounted = true;


    const loadTestimonials =
      async () => {

        try {

          setLoading(true);

          setError('');


          const response =
            await fetch(
              `${API_BASE_URL}/api/testimonials`,
              {
                method: 'GET',

                headers: {
                  Accept:
                    'application/json'
                }
              }
            );


          let data = null;


          try {

            data =
              await response.json();

          } catch {

            throw new Error(
              'The server returned an invalid response.'
            );

          }


          if (!response.ok) {

            throw new Error(
              data?.message ||
              `Unable to load testimonials. Server returned ${response.status}.`
            );

          }


          if (!data?.success) {

            throw new Error(
              data?.message ||
              'Unable to load testimonials.'
            );

          }


          if (
            !Array.isArray(
              data.testimonials
            )
          ) {

            throw new Error(
              'Invalid testimonials data received from server.'
            );

          }


          if (!mounted) {

            return;

          }


          const formatted =
            data.testimonials
              .map(
                formatTestimonial
              )
              .filter(
                (testimonial) =>
                  testimonial.id !==
                    undefined &&
                  testimonial.quote &&
                  testimonial.name
              );


          setTestimonials(
            formatted
          );


          setActiveIndex(0);


        } catch (err) {

          console.error(
            'Testimonials API error:',
            err
          );


          if (!mounted) {

            return;

          }


          setError(
            err?.message ||
            'Unable to load testimonials.'
          );


          setTestimonials([]);

          setActiveIndex(0);


        } finally {

          if (mounted) {

            setLoading(false);

          }

        }

      };


    loadTestimonials();


    return () => {

      mounted = false;

    };

  }, []);


  /* =======================================================
     KEEP ACTIVE INDEX SAFE
  ======================================================= */

  useEffect(() => {

    if (
      testimonials.length === 0
    ) {

      setActiveIndex(0);

      return;

    }


    if (
      activeIndex >=
      testimonials.length
    ) {

      setActiveIndex(
        testimonials.length - 1
      );

    }

  }, [
    testimonials.length,
    activeIndex
  ]);


  /* =======================================================
     AUTO SWIPER
  ======================================================= */

  useEffect(() => {

    if (
      testimonials.length <= 1 ||
      loading ||
      error ||
      isPaused
    ) {

      return;

    }


    const interval =
      window.setInterval(() => {

        setActiveIndex(
          (current) => {

            if (
              testimonials.length <= 1
            ) {

              return 0;

            }


            return (
              current + 1
            ) %
              testimonials.length;

          }
        );

      }, AUTO_SLIDE_INTERVAL);


    return () => {

      window.clearInterval(
        interval
      );

    };

  }, [
    testimonials.length,
    loading,
    error,
    isPaused
  ]);


  /* =======================================================
     CLEAR RESUME TIMER
  ======================================================= */

  const clearResumeTimer =
    () => {

      if (
        resumeTimerRef.current
      ) {

        window.clearTimeout(
          resumeTimerRef.current
        );

        resumeTimerRef.current =
          null;

      }

    };


  /* =======================================================
     PAUSE SLIDER
  ======================================================= */

  const pauseSlider =
    () => {

      clearResumeTimer();

      setIsPaused(true);

    };


  /* =======================================================
     RESUME SLIDER
  ======================================================= */

  const resumeSlider =
    () => {

      clearResumeTimer();

      setIsPaused(false);

    };


  /* =======================================================
     PAUSE AFTER CONTROL INTERACTION
  ======================================================= */

  const pauseAfterInteraction =
    () => {

      clearResumeTimer();

      setIsPaused(true);


      resumeTimerRef.current =
        window.setTimeout(() => {

          setIsPaused(false);

          resumeTimerRef.current =
            null;

        }, 6500);

    };


  /* =======================================================
     CLEANUP RESUME TIMER
  ======================================================= */

  useEffect(() => {

    return () => {

      clearResumeTimer();

    };

  }, []);


  /* =======================================================
     PREVIOUS
  ======================================================= */

  const handlePrevious =
    () => {

      if (
        testimonials.length <= 1
      ) {

        return;

      }


      setActiveIndex(
        (current) => {

          return current === 0
            ? testimonials.length - 1
            : current - 1;

        }
      );


      pauseAfterInteraction();

    };


  /* =======================================================
     NEXT
  ======================================================= */

  const handleNext =
    () => {

      if (
        testimonials.length <= 1
      ) {

        return;

      }


      setActiveIndex(
        (current) => {

          return (
            current + 1
          ) %
            testimonials.length;

        }
      );


      pauseAfterInteraction();

    };


  /* =======================================================
     PROGRESS ITEM
  ======================================================= */

  const handleProgressClick =
    (index) => {

      setActiveIndex(
        index
      );

      pauseAfterInteraction();

    };


  /* =======================================================
     COMMON BACKGROUND
  ======================================================= */

  const sectionBackground = (
    <>
      <div
        className="testimonials-glow testimonials-glow-one"
      />

      <div
        className="testimonials-glow testimonials-glow-two"
      />

      <div
        className="testimonials-grid-bg"
      />
    </>
  );


  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {

    return (

      <section
        className="testimonials-section"
        id="testimonials"
      >

        {sectionBackground}


        <div className="v-container">

          <motion.div
            className="testimonials-header"

            initial={{
              opacity: 0,
              y: 30
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

            <div>

              <span
                className="testimonials-eyebrow"
              >

                <span
                  className="testimonials-eyebrow-line"
                />

                CLIENT PERSPECTIVE

              </span>


              <h2>

                Built together.

                <span>
                  {' '}
                  Experienced together.
                </span>

              </h2>

            </div>


            <div
              className="testimonials-header-copy"
            >

              <MessageSquareQuote
                size={22}
              />

              <p>
                Strong digital products begin
                with strong collaboration.
              </p>

            </div>

          </motion.div>


          <div
            className="testimonial-feature testimonial-loading"
          >

            <div
              className="testimonial-loading-spinner"
            />

            <p>
              Loading client experiences...
            </p>

          </div>

        </div>

      </section>

    );

  }


  /* =======================================================
     ERROR STATE
  ======================================================= */

  if (error) {

    return (

      <section
        className="testimonials-section"
        id="testimonials"
      >

        {sectionBackground}


        <div className="v-container">

          <motion.div
            className="testimonials-header"

            initial={{
              opacity: 0,
              y: 30
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

            <div>

              <span
                className="testimonials-eyebrow"
              >

                <span
                  className="testimonials-eyebrow-line"
                />

                CLIENT PERSPECTIVE

              </span>


              <h2>

                Built together.

                <span>
                  {' '}
                  Experienced together.
                </span>

              </h2>

            </div>


            <div
              className="testimonials-header-copy"
            >

              <MessageSquareQuote
                size={22}
              />

              <p>
                Strong digital products begin
                with strong collaboration.
              </p>

            </div>

          </motion.div>


          <motion.div
            className="testimonial-feature testimonial-empty"

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
              amount: 0.2
            }}

            transition={{
              duration: 0.8
            }}
          >

            <div
              className="testimonial-quote-mark"
            >

              <Quote
                size={42}
                strokeWidth={1.2}
              />

            </div>


            <div
              className="testimonial-content"
            >

              <h3>
                Testimonials are temporarily unavailable.
              </h3>


              <p>
                We are having trouble loading
                client experiences right now.
                Please check back shortly.
              </p>

            </div>

          </motion.div>


          <div
            className="testimonial-api-error"
            role="status"
            aria-live="polite"
          >

            Unable to load testimonials
            from the server.

          </div>

        </div>

      </section>

    );

  }


  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (
    testimonials.length === 0
  ) {

    return (

      <section
        className="testimonials-section"
        id="testimonials"
      >

        {sectionBackground}


        <div className="v-container">

          <motion.div
            className="testimonials-header"

            initial={{
              opacity: 0,
              y: 30
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

            <div>

              <span
                className="testimonials-eyebrow"
              >

                <span
                  className="testimonials-eyebrow-line"
                />

                CLIENT PERSPECTIVE

              </span>


              <h2>

                Built together.

                <span>
                  {' '}
                  Experienced together.
                </span>

              </h2>

            </div>


            <div
              className="testimonials-header-copy"
            >

              <MessageSquareQuote
                size={22}
              />

              <p>
                Strong digital products begin
                with strong collaboration.
              </p>

            </div>

          </motion.div>


          <motion.div
            className="testimonial-feature testimonial-empty"

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
              amount: 0.2
            }}

            transition={{
              duration: 0.8
            }}
          >

            <div
              className="testimonial-quote-mark"
            >

              <Quote
                size={42}
                strokeWidth={1.2}
              />

            </div>


            <div
              className="testimonial-content"
            >

              <h3>
                Client experiences are coming soon.
              </h3>


              <p>
                We are building this section with
                verified client feedback and real
                project experiences.
              </p>

            </div>

          </motion.div>


          <div
            className="testimonial-trust-row"
          >

            <div
              className="testimonial-trust-item"
            >

              <span
                className="testimonial-trust-icon"
              >

                <MessageSquareQuote
                  size={17}
                />

              </span>


              <div>

                <strong>
                  Client First
                </strong>

                <span>
                  Built around real needs
                </span>

              </div>

            </div>


            <div
              className="testimonial-trust-divider"
            />


            <div
              className="testimonial-trust-item"
            >

              <span
                className="testimonial-trust-icon"
              >

                <Star
                  size={17}
                />

              </span>


              <div>

                <strong>
                  Quality Focused
                </strong>

                <span>
                  Designed with attention to detail
                </span>

              </div>

            </div>


            <div
              className="testimonial-trust-divider"
            />


            <div
              className="testimonial-trust-item"
            >

              <span
                className="testimonial-trust-icon"
              >

                <Quote
                  size={17}
                />

              </span>


              <div>

                <strong>
                  Long-Term Thinking
                </strong>

                <span>
                  Solutions built to evolve
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

    );

  }


  /* =======================================================
     ACTIVE TESTIMONIAL
  ======================================================= */

  const activeTestimonial =
    testimonials[
      activeIndex
    ] ||
    testimonials[0];


  /* =======================================================
     MAIN
  ======================================================= */

  return (

    <section
      className="testimonials-section"
      id="testimonials"
    >

      {sectionBackground}


      <div className="v-container">

        {/* ===============================================
            HEADER
        =============================================== */}

        <motion.div
          className="testimonials-header"

          initial={{
            opacity: 0,
            y: 30
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

          <div>

            <span
              className="testimonials-eyebrow"
            >

              <span
                className="testimonials-eyebrow-line"
              />

              CLIENT PERSPECTIVE

            </span>


            <h2>

              Built together.

              <span>
                {' '}
                Experienced together.
              </span>

            </h2>

          </div>


          <div
            className="testimonials-header-copy"
          >

            <MessageSquareQuote
              size={22}
            />

            <p>
              Strong digital products begin with
              strong collaboration. Here are
              experiences shared by our clients
              and project partners.
            </p>

          </div>

        </motion.div>


        {/* ===============================================
            FEATURE TESTIMONIAL
        =============================================== */}

        <motion.div
          className="testimonial-feature"

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
            amount: 0.2
          }}

          transition={{
            duration: 0.8
          }}

          onMouseEnter={
            pauseSlider
          }

          onMouseLeave={
            resumeSlider
          }

          onFocusCapture={
            pauseSlider
          }

          onBlurCapture={
            resumeSlider
          }
        >

          {/* =============================================
              NUMBER
          ============================================= */}

          <div
            className="testimonial-number"
          >

            {String(
              activeIndex + 1
            ).padStart(2, '0')}

          </div>


          {/* =============================================
              QUOTE ICON
          ============================================= */}

          <div
            className="testimonial-quote-mark"
          >

            <Quote
              size={42}
              strokeWidth={1.2}
            />

          </div>


          <div
            className="testimonial-content"
          >

            {/* =========================================
                RATING
            ========================================= */}

            <div
              className="testimonial-stars"

              aria-label={
                `${activeTestimonial.rating} out of 5 stars`
              }
            >

              {[1, 2, 3, 4, 5].map(
                (star) => (

                  <Star
                    key={star}

                    size={13}

                    fill={
                      star <=
                      activeTestimonial.rating
                        ? 'currentColor'
                        : 'none'
                    }

                    strokeWidth={1.5}
                  />

                )
              )}

            </div>


            {/* =========================================
                QUOTE
            ========================================= */}

            <AnimatePresence
              mode="wait"
            >

              <motion.blockquote
                key={
                  activeTestimonial.id
                }

                initial={{
                  opacity: 0,
                  y: 15
                }}

                animate={{
                  opacity: 1,
                  y: 0
                }}

                exit={{
                  opacity: 0,
                  y: -15
                }}

                transition={{
                  duration: 0.35
                }}
              >

                “
                {activeTestimonial.quote}
                ”

              </motion.blockquote>

            </AnimatePresence>


            {/* =========================================
                CLIENT
            ========================================= */}

            <div
              className="testimonial-client"
            >

              <div
                className="testimonial-avatar"
              >

                {
                  activeTestimonial.initials ||
                  'CL'
                }

              </div>


              <div
                className="testimonial-client-info"
              >

                <strong>
                  {activeTestimonial.name}
                </strong>


                <span>

                  Client

                  <i />

                  {activeTestimonial.company}

                </span>

              </div>

            </div>

          </div>


          {/* =============================================
              CONTROLS
          ============================================= */}

          {testimonials.length > 1 && (

            <div
              className="testimonial-controls"
            >

              <button
                type="button"

                onClick={
                  handlePrevious
                }

                aria-label="Previous testimonial"
              >

                <ArrowLeft
                  size={18}
                />

              </button>


              <div
                className="testimonial-progress"
              >

                {testimonials.map(
                  (
                    testimonial,
                    index
                  ) => (

                    <button
                      type="button"

                      key={
                        testimonial.id
                      }

                      className={
                        index === activeIndex
                          ? 'testimonial-progress-item active'
                          : 'testimonial-progress-item'
                      }

                      onClick={() =>
                        handleProgressClick(
                          index
                        )
                      }

                      aria-label={
                        `Show testimonial ${
                          index + 1
                        }`
                      }

                      aria-current={
                        index === activeIndex
                          ? 'true'
                          : undefined
                      }
                    >

                      <span />

                    </button>

                  )
                )}

              </div>


              <button
                type="button"

                onClick={
                  handleNext
                }

                aria-label="Next testimonial"
              >

                <ArrowRight
                  size={18}
                />

              </button>

            </div>

          )}

        </motion.div>


        {/* ===============================================
            TRUST ROW
        =============================================== */}

        <div
          className="testimonial-trust-row"
        >

          <div
            className="testimonial-trust-item"
          >

            <span
              className="testimonial-trust-icon"
            >

              <MessageSquareQuote
                size={17}
              />

            </span>


            <div>

              <strong>
                Client First
              </strong>

              <span>
                Built around real needs
              </span>

            </div>

          </div>


          <div
            className="testimonial-trust-divider"
          />


          <div
            className="testimonial-trust-item"
          >

            <span
              className="testimonial-trust-icon"
            >

              <Star
                size={17}
              />

            </span>


            <div>

              <strong>
                Quality Focused
              </strong>

              <span>
                Designed with attention to detail
              </span>

            </div>

          </div>


          <div
            className="testimonial-trust-divider"
          />


          <div
            className="testimonial-trust-item"
          >

            <span
              className="testimonial-trust-icon"
            >

              <Quote
                size={17}
              />

            </span>


            <div>

              <strong>
                Long-Term Thinking
              </strong>

              <span>
                Solutions built to evolve
              </span>

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}


export default Testimonials;