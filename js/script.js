document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // Initialize Lenis Smooth Scrolling
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  // Sync Lenis scroll with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Scroll Progress Bar
  gsap.to("#scroll-progress", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true
    }
  });

  // Smooth scroll to anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        lenis.scrollTo(targetId, {
          offset: -80 // Compesate for fixed header
        });
      }
    });
  });

  // Initial Hero Animations
  const heroTl = gsap.timeline({ paused: true });

  heroTl.from(".reveal-text", {
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power4.out"
  })
    .from(".reveal-p", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.5")
    .from(".reveal-btn", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.6")
    .from(".hero-img", {
      scale: 1.2,
      opacity: 0,
      duration: 1.5,
      ease: "power2.out"
    }, "-=1.5");

  // Preloader Animation
  const preloaderTl = gsap.timeline();
  let progress = { value: 0 };

  preloaderTl.to(progress, {
    value: 100,
    duration: 2,
    ease: "power2.inOut",
    onUpdate: () => {
      document.getElementById("progress-text").innerText = Math.round(progress.value) + "%";
      document.getElementById("progress-bar").style.width = progress.value + "%";
    }
  })
    .to("#preloader", {
      yPercent: -100,
      duration: 1,
      ease: "power4.inOut",
      onComplete: () => {
        document.getElementById("preloader").style.display = "none";
        heroTl.play();
      }
    }, "+=0.2");


  // Section Headers Reveal
  gsap.utils.toArray(".section-header").forEach(header => {
    gsap.from(header.children, {
      scrollTrigger: {
        trigger: header,
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out"
    });
  });

  // Diagonal Marquee Effect with Scroll Velocity
  const marqueeTrack = document.querySelector(".marquee-track");
  if (marqueeTrack) {
    const marqueeContent = document.querySelector(".marquee-content");

    // Continuous right-to-left loop
    const marqueeAnim = gsap.to(marqueeTrack, {
      x: () => -marqueeContent.offsetWidth,
      duration: () => marqueeContent.offsetWidth / 100, // Dynamic duration to maintain constant speed across screen sizes
      ease: "none",
      repeat: -1,
      runBackwards: false
    });

    // Make it responsive manually by refreshing the tween on resize
    window.addEventListener("resize", () => {
      marqueeAnim.invalidate().restart();
    });

    let velocityTween = null;

    // React to scroll velocity
    ScrollTrigger.create({
      trigger: document.body,
      start: 0,
      end: "max",
      onUpdate: (self) => {
        // Calculate speed multiplier based on scroll velocity
        // The faster the scroll, the higher the velocity value
        let scrollVelocity = Math.abs(self.getVelocity());
        let timeScaleTarget = 1 + (scrollVelocity / 500);

        // Clamp it so it doesn't go extremely fast
        timeScaleTarget = Math.max(1, Math.min(timeScaleTarget, 5));

        if (velocityTween) velocityTween.kill();

        // Animate the timescale so it accelerates and decelerates smoothly
        velocityTween = gsap.to(marqueeAnim, {
          timeScale: timeScaleTarget,
          duration: 0.2,
          overwrite: true,
          onComplete: () => {
            // Smoothly return to base speed when scrolling stops
            gsap.to(marqueeAnim, {
              timeScale: 1,
              duration: 1,
              ease: "power3.out"
            });
          }
        });
      }
    });
  }

  // About Section
  gsap.from(".about-img-wrapper", {
    scrollTrigger: {
      trigger: "#about",
      start: "top 70%",
      toggleActions: "play none none reverse"
    },
    x: -100,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  gsap.from(".about-content", {
    scrollTrigger: {
      trigger: "#about",
      start: "top 70%",
      toggleActions: "play none none reverse"
    },
    x: 100,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    delay: 0.2
  });

  // Number Counters
  gsap.utils.toArray(".count-up").forEach(counter => {
    const target = parseInt(counter.getAttribute("data-target"));

    ScrollTrigger.create({
      trigger: counter,
      start: "top 85%",
      // keep once: true for counters as counting down is weird
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          innerHTML: target,
          duration: 2,
          snap: { innerHTML: 1 },
          ease: "power1.out"
        });
      }
    });
  });

  // Fitness Classes Stagger
  gsap.set(".class-card", { autoAlpha: 0, y: 80 });

  gsap.to(".class-card", {
    scrollTrigger: {
      trigger: "#classes",
      start: "top 85%",
      toggleActions: "play none none none"
    },
    autoAlpha: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power2.out"
  });

  // Team Members Stagger
  gsap.fromTo(".team-card",
    {
      y: 80,
      autoAlpha: 0
    },
    {
      scrollTrigger: {
        trigger: "#team",
        start: "top 80%",
        toggleActions: "play none none none"
      },
      y: 0,
      autoAlpha: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out"
    }
  );

  // Pricing Cards Stagger
  gsap.fromTo(".pricing-card",
    {
      y: 100,
      autoAlpha: 0
    },
    {
      scrollTrigger: {
        trigger: "#pricing",
        start: "top 75%",
        once: true
      },
      y: 0,
      autoAlpha: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: "back.out(1.7)"
    }
  );

  // Testimonials Stagger
  gsap.from(".testimonial-card", {
    scrollTrigger: {
      trigger: "#testimonials",
      start: "top 75%",
      toggleActions: "play none none reverse"
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
  });

  // Contact Section
  gsap.from("#contact form", {
    scrollTrigger: {
      trigger: "#contact",
      start: "top 70%",
      toggleActions: "play none none reverse"
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out"
  });

  // Mobile Menu Logic
  const menuBtn = document.getElementById("menu-btn");
  const closeBtn = document.getElementById("close-menu");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  const toggleMenu = () => {
    const isHidden = mobileMenu.classList.contains("hidden");

    if (isHidden) {
      mobileMenu.classList.remove("hidden");
      // Force reflow
      void mobileMenu.offsetWidth;
      mobileMenu.classList.add("active");
      document.body.style.overflow = "hidden";

      // Animate links
      gsap.fromTo(mobileLinks,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.2 }
      );
    } else {
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
      setTimeout(() => {
        mobileMenu.classList.add("hidden");
      }, 300);
    }
  };

  menuBtn.addEventListener("click", toggleMenu);
  closeBtn.addEventListener("click", toggleMenu);

  // Close menu when clicking a link
  mobileLinks.forEach(link => {
    link.addEventListener("click", toggleMenu);
  });

  // Parallax Effect for Hero Image
  if (window.innerWidth > 768) {
    gsap.to(".hero-img", {
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      },
      y: 100,
      scale: 1.1
    });
  }
});
