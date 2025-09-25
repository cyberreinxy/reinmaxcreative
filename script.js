/**
 * @file Complete JavaScript for the Reinmax Creative website.
 * @author Reinhard Baraka
 * @version 1.1
 */

// SITE HEADER & NAVIGATION
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const siteHeader = document.querySelector(".site-header");
    const menuToggleButton = document.getElementById("menu-toggle");
    const navigationPanel = document.getElementById("navigation-panel");
    const heroSection = document.getElementById("home");

    if (!menuToggleButton || !navigationPanel || !siteHeader || !heroSection)
      return;

    const navLinks = navigationPanel.querySelectorAll("a[href]");
    const firstFocusableElement = navLinks[0];
    const lastFocusableElement = navLinks[navLinks.length - 1];
    let activeElementBeforeMenuOpen;

    const openMenu = () => {
      activeElementBeforeMenuOpen = document.activeElement;
      menuToggleButton.setAttribute("aria-expanded", "true");
      // Add classes to trigger animations
      document.body.classList.add("menu-is-open");
      siteHeader.classList.add("scrolled-header");
      navigationPanel.classList.add("is-open");
      firstFocusableElement?.focus();
    };

    const closeMenu = () => {
      menuToggleButton.setAttribute("aria-expanded", "false");
      // Start by retracting the navigation panel
      navigationPanel.classList.remove("is-open");

      // After a short delay, slide the header up and clean up body classes
      setTimeout(() => {
        document.body.classList.remove("menu-is-open");
        activeElementBeforeMenuOpen?.focus();
        // Check header style after menu starts closing for a smooth overlap
        requestAnimationFrame(handleHeaderStyle);
      }, 575); // Delay to create a graceful, overlapping animation
    };

    menuToggleButton.addEventListener("click", () =>
      navigationPanel.classList.contains("is-open") ? closeMenu() : openMenu()
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navigationPanel.classList.contains("is-open"))
        closeMenu();
    });

    navigationPanel.addEventListener("keydown", (e) => {
      if (e.key !== "Tab" || !navigationPanel.classList.contains("is-open"))
        return;
      if (e.shiftKey && document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        e.preventDefault();
      } else if (
        !e.shiftKey &&
        document.activeElement === lastFocusableElement
      ) {
        firstFocusableElement.focus();
        e.preventDefault();
      }
    });

    navLinks.forEach((link) =>
      link.addEventListener("click", () => setTimeout(closeMenu, 150))
    );

    const handleHeaderStyle = () => {
      const isScrolled = window.scrollY > 0;
      const isMenuOpen = document.body.classList.contains("menu-is-open");
      siteHeader.classList.toggle("scrolled-header", isScrolled || isMenuOpen);
    };

    window.addEventListener(
      "scroll",
      () => requestAnimationFrame(handleHeaderStyle),
      { passive: true }
    );
    window.addEventListener(
      "resize",
      () => requestAnimationFrame(handleHeaderStyle),
      { passive: true }
    );

    handleHeaderStyle();
  });
})();

const setupScrollableHeader = () => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const toggleHeader = () => {
    header.classList.toggle("scrolled-header", window.scrollY > 0);
  };

  window.addEventListener("scroll", toggleHeader, { passive: true });
  window.addEventListener("resize", toggleHeader, { passive: true });
  toggleHeader();
};

// CORE APPLICATION LOGIC
const App = {
  isLoaded: false,
  Preloader: {
    promises: [],
    register(promise) {
      this.promises.push(promise);
    },
    async await() {
      // Wait for all registered assets or a max timeout
      return Promise.all(this.promises);
    },
  },

  init() {
    this.initHeroViewportSizing();
    this.initMobileNav();
    this.initActiveNavHighlight();
    this.initDesignProcessAccordion();
    this.initGlobalSmoothScroll();

    this.initFloatingSocialBar();
    this.initHeroSection();
    this.initFooter();
    this.initPillarGridObserver();
    this.initWorkflowGridObserver();
    this.registerServiceWorker();

    // The loader will now wait for critical assets to be ready.
    this.manageLoader();
  },

  async manageLoader() {
    const showContent = () => {
      if (this.isLoaded) return;
      this.isLoaded = true;
      document.body.classList.add("vibe-loaded");
    };

    // Create a fallback timer to show the site even if loading is slow
    const fallbackTimeout = setTimeout(showContent, 8000); // 8-second max wait

    try {
      await this.Preloader.await(); // Wait for registered promises
    } catch (error) {
      console.warn(
        "Preloading failed for some assets, showing site anyway.",
        error
      );
    }
    clearTimeout(fallbackTimeout); // Clear the fallback if assets loaded successfully
    showContent();
  },

  registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log(
              "ServiceWorker registration successful with scope: ",
              registration.scope
            );
          })
          .catch((error) => {
            console.log("ServiceWorker registration failed: ", error);
          });
      });
    }
  },

  initHeroViewportSizing() {
    const heroContainer = document.querySelector(".hero-container");
    if (!heroContainer) return;

    const isLikelyMobile = () =>
      window.innerWidth <= 1024 || "ontouchstart" in window;

    const setHeight = () => {
      if (isLikelyMobile()) {
        // On mobile, use the visual viewport height to account for UI bars.
        const vh = window.visualViewport?.height || window.innerHeight;
        heroContainer.style.height = `${Math.max(0, Math.floor(vh))}px`;
      } else {
        // On desktop, reliably set to 100% of the viewport height.
        heroContainer.style.height = "100vh";
      }
    };

    setHeight();
    window.addEventListener("resize", setHeight, { passive: true });
    window.addEventListener("orientationchange", setHeight);
    window.visualViewport?.addEventListener("resize", setHeight);
  },

  initMobileNav() {
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const controlPanel = document.getElementById("control-panel");
    const mainContent = document.querySelector("main");
    const menuItems = document.querySelectorAll("#control-panel .menu-item");
    if (!mobileMenuButton || !controlPanel || !mainContent) return;

    let isMenuOpen = false;

    const openMenu = () => {
      if (isMenuOpen) return;
      isMenuOpen = true;
      document.body.classList.add("overflow-hidden");
      mainContent.classList.add("content-blurred");
      controlPanel.classList.remove("pointer-events-none");
      requestAnimationFrame(() => {
        controlPanel.classList.add("is-open");
        controlPanel.classList.remove(
          "opacity-0",
          "-translate-y-4",
          "scale-95"
        );
      });
    };

    const closeMenu = () => {
      if (!isMenuOpen) return;
      isMenuOpen = false;
      document.body.classList.remove("overflow-hidden");
      mainContent.classList.remove("content-blurred");
      controlPanel.classList.remove("is-open");
      controlPanel.classList.add("opacity-0", "-translate-y-4", "scale-95");
      setTimeout(() => controlPanel.classList.add("pointer-events-none"), 500);
    };

    mobileMenuButton.addEventListener("click", (e) => {
      e.stopPropagation();
      isMenuOpen ? closeMenu() : openMenu();
    });

    document.body.addEventListener("click", (e) => {
      if (isMenuOpen && !controlPanel.contains(e.target)) closeMenu();
    });

    menuItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        const href = item.getAttribute("href");
        if (href?.startsWith("#")) {
          e.preventDefault();
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
          setTimeout(closeMenu, 300);
        }
      });
    });
  },

  initActiveNavHighlight() {
    const sections = document.querySelectorAll("section[id]");
    const header = document.querySelector("header");
    if (!sections.length || !header) return;

    const headerHeight = header.offsetHeight;
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute("id");
            document
              .querySelectorAll(".menu-item.active")
              .forEach((link) => link.classList.remove("active"));
            document
              .querySelector(`.menu-item[href="#${sectionId}"]`)
              ?.classList.add("active");
          }
        });
      },
      { rootMargin: `-${headerHeight}px 0px -50% 0px`, threshold: 0 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  },

  initDesignProcessAccordion() {
    const designProcessSection = document.getElementById("design-process");
    if (!designProcessSection) return;

    const accordions =
      designProcessSection.querySelectorAll(".process-accordion");
    const allSteps = designProcessSection.querySelectorAll(
      ".process-step-group"
    );
    const allImages = designProcessSection.querySelectorAll(".visual-image");
    let currentActiveIndex = -1;

    const setActiveState = (index) => {
      allSteps.forEach((step) => step.classList.remove("is-active"));
      allImages.forEach((img) => img.classList.remove("is-active"));
      accordions.forEach((acc) => acc.classList.remove("has-active-step"));

      if (index !== -1) {
        accordions.forEach((acc) => acc.classList.add("has-active-step"));
        document
          .querySelectorAll(`#design-process [data-index="${index}"]`)
          .forEach((el) => el.classList.add("is-active"));
      } else {
        document
          .querySelector('.visual-image[data-index="-1"]')
          ?.classList.add("is-active");
      }
      currentActiveIndex = index;
    };

    const handleStepClick = (e) => {
      const clickedIndex = parseInt(e.currentTarget.dataset.index, 10);
      setActiveState(clickedIndex === currentActiveIndex ? -1 : clickedIndex);
    };

    setActiveState(-1);
    allSteps.forEach((step) => step.addEventListener("click", handleStepClick));
  },

  initGlobalSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#") return;
        e.preventDefault();
        document
          .querySelector(href)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  },

  initFloatingSocialBar() {
    const socialBar = document.getElementById("fsl-container");
    const closeButton = document.getElementById("fsl-close-button");
    if (!socialBar || !closeButton) return;

    const showOnScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      )
        socialBar.classList.add("visible");
    };
    const hideBar = () => socialBar.classList.remove("visible");

    window.addEventListener("scroll", showOnScroll);
    closeButton.addEventListener("click", hideBar);
  },

  initHeroSection() {
    const elements = {
      heroVideo: document.getElementById("hero-video"),
      videoControlButton: document.getElementById("video-control"),
      playIcon: document.getElementById("play-icon"),
      pauseIcon: document.getElementById("pause-icon"),
      loadingIndicator: document.getElementById("video-loading-indicator"),
      heroText: document.getElementById("hero-text"),
      ctaButton: document.getElementById("cta-button"),
      playOverlay: document.getElementById("video-play-overlay"),
      heroContainer: document.querySelector(".hero-container"), // Added hero container
    };

    if (Object.values(elements).some((el) => !el)) {
      console.error("One or more hero section elements are missing.");
      return;
    }

    // Register the hero video with the Preloader.
    // The loader will now wait for this promise to resolve.
    const videoLoadPromise = new Promise((resolve, reject) => {
      const video = elements.heroVideo;
      if (video.readyState >= 4) {
        // HAVE_ENOUGH_DATA
        resolve();
      } else {
        video.addEventListener("canplaythrough", resolve, { once: true });
        video.addEventListener("error", reject, { once: true });
      }
    });
    App.Preloader.register(videoLoadPromise);

    try {
      elements.heroVideo.setAttribute("playsinline", "");
      elements.heroVideo.setAttribute("muted", "");
      elements.heroVideo.playsInline = true;
      elements.heroVideo.muted = true;
    } catch (_) {}

    const state = { userPaused: false };

    const updateUI = () => {
      const isPaused = elements.heroVideo.paused;
      elements.playIcon.classList.toggle("hidden", !isPaused);
      elements.pauseIcon.classList.toggle("hidden", isPaused);
    };

    const togglePlayback = () => {
      if (elements.heroVideo.paused) {
        state.userPaused = false;
        elements.heroVideo.play();
      } else {
        state.userPaused = true;
        elements.heroVideo.pause();
      }
    };

    const animateHeroText = () => {
      const line1 = "Exceptional designs that build";
      const line2 = "timeless, iconic brands.";

      const createSpans = (line, delayOffset = 0) =>
        line
          .split(" ")
          .map(
            (word, index) =>
              `<span class="fade-up-stagger" style="animation-delay:${
                (index + delayOffset) * 0.1
              }s">${word}</span>`
          )
          .join(" ");

      const line1Words = line1.split(" ").length;
      elements.heroText.innerHTML = `${createSpans(
        line1
      )} <div class="hidden lg:block h-4"></div> ${createSpans(
        line2,
        line1Words
      )}`;
      return (line1Words + line2.split(" ").length) * 100 + 800;
    };

    const startHeroAnimation = () => {
      const textAnimationDuration = animateHeroText();

      setTimeout(() => {
        elements.ctaButton.classList.remove("opacity-0");
        elements.ctaButton.classList.add("wavy-up-animation");
        elements.videoControlButton.classList.remove("opacity-0");
        elements.videoControlButton.classList.add("wavy-up-animation");
        elements.videoControlButton.classList.remove("pointer-events-none");
        updateUI();
      }, textAnimationDuration + 300);
    };

    const attemptAutoplay = () => {
      elements.heroVideo.muted = true;
      const playPromise = elements.heroVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn(
            "Video autoplay was prevented. Showing custom play button.",
            error
          );
          state.userPaused = true;
          updateUI();

          // Show the custom play button overlay
          elements.playOverlay.classList.add("visible");

          // Handle click on the overlay to play the video
          const playManually = () => {
            elements.heroVideo
              .play()
              .then(() => {
                elements.playOverlay.classList.remove("visible");
                state.userPaused = false;
                updateUI();
              })
              .catch((err) => console.error("Manual play failed:", err));
          };

          elements.playOverlay.addEventListener("click", playManually, {
            once: true,
          });
        });
      }
    };

    const video = elements.heroVideo;
    video.playbackRate = 0.85;
    video.addEventListener("ended", () => {
      video.currentTime = 0;
      video.play();
    });
    video.addEventListener("play", updateUI);
    video.addEventListener("pause", updateUI);
    video.addEventListener("waiting", () => {
      // Set state for CSS to handle visibility
      elements.heroContainer.dataset.videoState = "waiting";
    });
    video.addEventListener("playing", () => {
      // Set state for CSS to handle visibility
      elements.heroContainer.dataset.videoState = "playing";
      // Force-hide the custom play overlay whenever the video starts playing.
      elements.playOverlay.classList.remove("visible");
    });

    elements.videoControlButton.addEventListener("click", togglePlayback);

    // Use IntersectionObserver to attempt autoplay only when the video is visible.
    // This is a strong signal to browsers that the video is important.
    const videoObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (video.readyState >= 3) {
              attemptAutoplay();
            } else {
              video.addEventListener("canplay", attemptAutoplay, {
                once: true,
              });
            }
            observer.unobserve(video); // Stop observing once we've tried to play.
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the video is visible
    );
    videoObserver.observe(video);

    if (document.body.classList.contains("vibe-loaded")) {
      setTimeout(startHeroAnimation, 500);
    } else {
      const observer = new MutationObserver((mutations, obs) => {
        if (document.body.classList.contains("vibe-loaded")) {
          setTimeout(startHeroAnimation, 500);
          obs.disconnect();
        }
      });
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }
    setupScrollableHeader();
  },

  initFooter() {
    this.initNewsletterForm();
    this.updateCopyrightYear();
  },

  initNewsletterForm() {
    const form = document.getElementById("newsletter-form");
    if (!form) return;

    const emailInput = document.getElementById("email-signup");
    const submitButton = document.getElementById("subscribe-button");
    const btnText = submitButton.querySelector(".btn-text");
    const loader = submitButton.querySelector(".loader");
    const successMessage = submitButton.querySelector(".success-message");
    const originalPlaceholder = "name@example.com";
    let errorTimeout = null;
    emailInput.placeholder = originalPlaceholder;

    const showError = (message) => {
      clearTimeout(errorTimeout);
      emailInput.value = "";
      emailInput.placeholder = message;
      emailInput.classList.add("input-error", "shake");
      setTimeout(() => emailInput.classList.remove("shake"), 500);
      errorTimeout = setTimeout(hideError, 4000);
    };

    const hideError = () => {
      emailInput.placeholder = originalPlaceholder;
      emailInput.classList.remove("input-error");
    };

    emailInput.addEventListener("focus", hideError);
    emailInput.addEventListener("input", () => {
      if (emailInput.classList.contains("input-error")) hideError();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (submitButton.disabled) return;
      const emailValue = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailValue) return showError("Email address is required.");
      if (!emailRegex.test(emailValue.toLowerCase()))
        return showError("Please enter a valid email address.");

      // --- New Animation Logic ---
      submitButton.disabled = true;
      submitButton.classList.add("is-loading");

      setTimeout(() => {
        submitButton.classList.remove("is-loading");
        submitButton.classList.add("is-success");

        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.classList.remove("is-success");
          emailInput.value = "";
          hideError();
        }, 2000);
      }, 1500);
    });
  },

  updateCopyrightYear() {
    const yearElement = document.getElementById("copyright-year");
    if (yearElement) yearElement.textContent = new Date().getFullYear();
  },

  initPillarGridObserver() {
    const grid = document.querySelector(".pillar-grid");
    if (!grid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // Animate only once for performance
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(grid);
  },

  initWorkflowGridObserver() {
    const grid = document.querySelector(".workflow-section-wrapper");
    if (!grid) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target); // Animate only once for performance
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(grid);
  },
};

document.addEventListener("DOMContentLoaded", () => App.init());

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetSection = document.getElementById(
      this.getAttribute("data-target")
    );
    if (targetSection) targetSection.scrollIntoView({ behavior: "smooth" });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // A simplified and robust IntersectionObserver for all scroll animations.
  // This version animates elements once when they become visible.
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target); // Stop observing after animation.
        }
      });
    },
    { threshold: 0.15 } // Start animation when 15% of the element is visible.
  );

  // Target all elements that need to be animated on scroll.
  // This single query works for both mobile and desktop.
  document.querySelectorAll(".animate-on-scroll").forEach((element) => {
    observer.observe(element);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("ai-course-popup");
  if (!popup) return;

  const elements = {
    closeBtn: document.getElementById("ai-course-popup-close-btn"),
    form: document.getElementById("ai-course-popup-form"),
    emailInput: document.getElementById("ai-course-popup-email-input"),
    hero: document.querySelector(".hero-container"),
    footer: document.getElementById("footer-section"),
    imgBox: document.getElementById("ai-course-popup-image-container"),
    contentBox: document.getElementById("ai-course-popup-content-container"),
  };

  if (Object.values(elements).some((el) => !el)) return;

  const defaultPlaceholder = elements.emailInput.placeholder;
  const popupShownKey = "aiCoursePopupShown";
  let popupHasBeenShown = sessionStorage.getItem(popupShownKey) === "true";

  const matchHeight = () => {
    if (window.innerWidth >= 1024 && elements.contentBox.offsetHeight > 0) {
      elements.imgBox.style.height = `${elements.contentBox.offsetHeight}px`;
    } else {
      elements.imgBox.style.height = "";
    }
  };

  const resetForm = () => {
    elements.emailInput.value = "";
    elements.emailInput.classList.remove(
      "ring-2",
      "ring-red-500",
      "ai-course-popup-placeholder-red"
    );
    elements.emailInput.placeholder = defaultPlaceholder;
  };

  const togglePopup = (show) => {
    if (show && popupHasBeenShown) return;
    if (show) {
      popupHasBeenShown = true;
      sessionStorage.setItem(popupShownKey, "true");
    }

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = show ? "hidden" : "";
    document.body.style.paddingRight = show ? `${scrollbarWidth}px` : "";
    if (show) resetForm();

    popup.classList.toggle("opacity-0", !show);
    popup.classList.toggle("pointer-events-none", !show);
    popup.classList.toggle(
      "translate-y-[110%]",
      !show && window.innerWidth < 1024
    );
    popup.classList.toggle(
      "lg:-translate-x-[110%]",
      !show && window.innerWidth >= 1024
    );

    if (show) setTimeout(matchHeight, 50);
  };

  const showError = (msg) => {
    elements.form.classList.add("ai-course-popup-form-shake");
    elements.emailInput.classList.add(
      "ring-2",
      "ring-red-500",
      "ai-course-popup-placeholder-red"
    );
    elements.emailInput.value = "";
    elements.emailInput.placeholder = msg;
    setTimeout(
      () => elements.form.classList.remove("ai-course-popup-form-shake"),
      600
    );
  };

  const handleScrollTrigger = () => {
    if (popupHasBeenShown) return;
    const heroRect = elements.hero.getBoundingClientRect();
    const footerRect = elements.footer.getBoundingClientRect();

    if (heroRect.bottom < 0 && footerRect.top > window.innerHeight) {
      togglePopup(true);
    }
  };

  elements.closeBtn.addEventListener("click", () => togglePopup(false));
  window.addEventListener("scroll", handleScrollTrigger, { passive: true });
  window.addEventListener("resize", () => {
    if (!popup.classList.contains("opacity-0")) matchHeight();
  });

  elements.form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!elements.emailInput.value.trim())
      return showError("Email address is required");
    if (!elements.form.checkValidity())
      return showError("Please enter a valid email address");

    const userEmail = encodeURIComponent(elements.emailInput.value);
    window.location.href = `checkout.html?course=illustrator&email=${userEmail}`;
  });

  elements.emailInput.addEventListener("focus", resetForm);

  setTimeout(() => {
    if (!popupHasBeenShown) togglePopup(true);
  }, 8000);
});
