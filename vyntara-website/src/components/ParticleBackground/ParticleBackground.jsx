import { useEffect, useRef } from 'react';

import './ParticleBackground.css';

function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    let animationFrame;

    let width = 0;
    let height = 0;

    let particles = [];

    const mouse = {
      x: null,
      y: null,
      radius: 180,
      active: false,
    };

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    /*
      ---------------------------------------
      PARTICLE COUNT
      ---------------------------------------
    */

    const getParticleCount = () => {
      if (window.innerWidth <= 480) {
        return 28;
      }

      if (window.innerWidth <= 768) {
        return 42;
      }

      return 78;
    };

    /*
      ---------------------------------------
      RESIZE CANVAS
      ---------------------------------------
    */

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      createParticles();
    };

    /*
      ---------------------------------------
      CREATE PARTICLES
      ---------------------------------------
    */

    const createParticles = () => {
      const count = getParticleCount();

      particles = [];

      for (let i = 0; i < count; i++) {
        const colorOptions = [
          '56,189,248',
          '96,165,250',
          '129,140,248',
          '167,139,250',
        ];

        const color =
          colorOptions[
            Math.floor(
              Math.random() * colorOptions.length
            )
          ];

        particles.push({
          x: Math.random() * width,

          y: Math.random() * height,

          vx:
            (Math.random() - 0.5) *
            (prefersReducedMotion ? 0.08 : 0.35),

          vy:
            (Math.random() - 0.5) *
            (prefersReducedMotion ? 0.08 : 0.35),

          size:
            Math.random() * 1.8 + 1,

          opacity:
            Math.random() * 0.45 + 0.25,

          color,

          pulse:
            Math.random() * Math.PI * 2,

          pulseSpeed:
            Math.random() * 0.015 + 0.005,
        });
      }
    };

    /*
      ---------------------------------------
      MOUSE MOVE
      ---------------------------------------
    */

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();

      mouse.x = event.clientX - rect.left;

      mouse.y = event.clientY - rect.top;

      mouse.active = true;
    };

    /*
      ---------------------------------------
      MOUSE LEAVE
      ---------------------------------------
    */

    const handleMouseLeave = () => {
      mouse.active = false;

      mouse.x = null;
      mouse.y = null;
    };

    /*
      ---------------------------------------
      DRAW CONNECTIONS
      ---------------------------------------
    */

    const drawConnections = () => {
      const connectionDistance =
        window.innerWidth <= 768
          ? 105
          : 145;

      for (
        let i = 0;
        i < particles.length;
        i++
      ) {
        const particleA = particles[i];

        for (
          let j = i + 1;
          j < particles.length;
          j++
        ) {
          const particleB = particles[j];

          const dx =
            particleA.x -
            particleB.x;

          const dy =
            particleA.y -
            particleB.y;

          const distance = Math.sqrt(
            dx * dx + dy * dy
          );

          if (
            distance <
            connectionDistance
          ) {
            const opacity =
              (1 -
                distance /
                  connectionDistance) *
              0.22;

            const gradient =
              ctx.createLinearGradient(
                particleA.x,
                particleA.y,
                particleB.x,
                particleB.y
              );

            gradient.addColorStop(
              0,
              `rgba(${particleA.color}, ${opacity})`
            );

            gradient.addColorStop(
              1,
              `rgba(${particleB.color}, ${opacity})`
            );

            ctx.beginPath();

            ctx.moveTo(
              particleA.x,
              particleA.y
            );

            ctx.lineTo(
              particleB.x,
              particleB.y
            );

            ctx.strokeStyle =
              gradient;

            ctx.lineWidth = 0.7;

            ctx.stroke();
          }
        }
      }
    };

    /*
      ---------------------------------------
      DRAW PARTICLE
      ---------------------------------------
    */

    const drawParticle = (particle) => {
      particle.pulse +=
        particle.pulseSpeed;

      const pulse =
        Math.sin(particle.pulse) *
        0.15;

      const alpha = Math.max(
        0.12,
        Math.min(
          0.9,
          particle.opacity + pulse
        )
      );

      /*
        Glow
      */

      const glowRadius =
        particle.size * 5;

      const gradient =
        ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          glowRadius
        );

      gradient.addColorStop(
        0,
        `rgba(${particle.color}, ${alpha})`
      );

      gradient.addColorStop(
        0.3,
        `rgba(${particle.color}, ${alpha * 0.35})`
      );

      gradient.addColorStop(
        1,
        `rgba(${particle.color}, 0)`
      );

      ctx.beginPath();

      ctx.arc(
        particle.x,
        particle.y,
        glowRadius,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        gradient;

      ctx.fill();

      /*
        Core dot
      */

      ctx.beginPath();

      ctx.arc(
        particle.x,
        particle.y,
        particle.size,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        `rgba(${particle.color}, ${Math.min(
          1,
          alpha + 0.2
        )})`;

      ctx.fill();
    };

    /*
      ---------------------------------------
      UPDATE PARTICLES
      ---------------------------------------
    */

    const updateParticle = (particle) => {
      if (!prefersReducedMotion) {
        particle.x += particle.vx;

        particle.y += particle.vy;
      }

      /*
        Mouse interaction
      */

      if (
        mouse.active &&
        mouse.x !== null &&
        mouse.y !== null
      ) {
        const dx =
          particle.x - mouse.x;

        const dy =
          particle.y - mouse.y;

        const distance =
          Math.sqrt(
            dx * dx + dy * dy
          );

        if (
          distance < mouse.radius &&
          distance > 0
        ) {
          const force =
            (mouse.radius -
              distance) /
            mouse.radius;

          const directionX =
            dx / distance;

          const directionY =
            dy / distance;

          /*
            Gentle repulsion
          */

          particle.x +=
            directionX *
            force *
            1.2;

          particle.y +=
            directionY *
            force *
            1.2;
        }
      }

      /*
        Screen wrapping
      */

      if (particle.x < -10) {
        particle.x = width + 10;
      }

      if (particle.x > width + 10) {
        particle.x = -10;
      }

      if (particle.y < -10) {
        particle.y = height + 10;
      }

      if (particle.y > height + 10) {
        particle.y = -10;
      }
    };

    /*
      ---------------------------------------
      ANIMATION
      ---------------------------------------
    */

    const animate = () => {
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      /*
        Connections first
      */

      drawConnections();

      /*
        Particles
      */

      particles.forEach(
        (particle) => {
          updateParticle(
            particle
          );

          drawParticle(
            particle
          );
        }
      );

      animationFrame =
        requestAnimationFrame(
          animate
        );
    };

    /*
      ---------------------------------------
      EVENTS
      ---------------------------------------
    */

    window.addEventListener(
      'resize',
      resizeCanvas
    );

    window.addEventListener(
      'mousemove',
      handleMouseMove
    );

    window.addEventListener(
      'mouseleave',
      handleMouseLeave
    );

    /*
      ---------------------------------------
      INITIALIZE
      ---------------------------------------
    */

    resizeCanvas();

    animate();

    /*
      ---------------------------------------
      CLEANUP
      ---------------------------------------
    */

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        'resize',
        resizeCanvas
      );

      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );

      window.removeEventListener(
        'mouseleave',
        handleMouseLeave
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particle-background"
      aria-hidden="true"
    />
  );
}

export default ParticleBackground;