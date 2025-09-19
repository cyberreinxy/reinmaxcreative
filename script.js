/**
 * @file Main JavaScript file for Reinmax Creative website.
 * @author Reinhard Baraka
 * @version 1.0
 */

/**
 * Executes when the DOM is fully loaded.
 * Initializes core website functionalities like animations, navigation,
 * and other interactive elements.
 */
document.addEventListener("DOMContentLoaded", () => {
  /**
   * ---------------------------------------------------------------------------
   *  1. General UI & Animations
   * ---------------------------------------------------------------------------
   */

  // Initializes a fade-in effect for elements with the '.fade-in' class on scroll.
  const faders = document.querySelectorAll(".fade-in");
  const fadeInObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Performance: stop observing after animation.
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -50px 0px" } // Trigger when 20% of the element is visible.
  );
  faders.forEach((fader) => fadeInObserver.observe(fader));

  /**
   * ---------------------------------------------------------------------------
   *  2. Control Panel (Mobile Navigation)
   * ---------------------------------------------------------------------------
   */

  // Element references for the control panel.
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const controlPanel = document.getElementById("control-panel");
  const mainContent = document.querySelector("main");
  const menuItems = document.querySelectorAll("#control-panel .menu-item");

  if (mobileMenuButton && controlPanel && mainContent) {
    let isMenuOpen = false;

    // Opens the mobile navigation panel.
    const openMenu = () => {
      if (isMenuOpen) return;
      isMenuOpen = true;
      document.body.classList.add("overflow-hidden");
      mainContent.classList.add("content-blurred");
      controlPanel.classList.remove("pointer-events-none");

      requestAnimationFrame(() => {
        controlPanel.classList.add("is-open");
        // This line is essential for the opening animation.
        controlPanel.classList.remove(
          "opacity-0",
          "-translate-y-4",
          "scale-95"
        );
      });
    };

    // Closes the mobile navigation panel.
    const closeMenu = () => {
      if (!isMenuOpen) return;
      isMenuOpen = false;
      document.body.classList.remove("overflow-hidden");
      mainContent.classList.remove("content-blurred");
      controlPanel.classList.remove("is-open");
      // This line is essential for the closing animation.
      controlPanel.classList.add("opacity-0", "-translate-y-4", "scale-95");

      // Add a delay before disabling pointer events to allow the closing animation to finish.
      setTimeout(() => {
        controlPanel.classList.add("pointer-events-none");
      }, 500); // Duration should match the CSS transition duration.
    };

    // Toggle menu state on button click.
    mobileMenuButton.addEventListener("click", (e) => {
      e.stopPropagation();
      isMenuOpen ? closeMenu() : openMenu();
    });

    // Close menu if a click occurs outside the control panel.
    document.body.addEventListener("click", (e) => {
      if (isMenuOpen && !controlPanel.contains(e.target)) {
        closeMenu();
      }
    });

    // Add smooth scrolling to menu item links and close the menu after a short delay.
    menuItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        const href = item.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          const targetElement = document.querySelector(href);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
          }
          setTimeout(closeMenu, 300); // Delay allows the user to see the navigation before the panel closes.
        }
      });
    });
  }

  /**
   * ---------------------------------------------------------------------------
   *  3. Active Navigation Link Highlighting on Scroll
   * ---------------------------------------------------------------------------
   */

  const sections = document.querySelectorAll("section[id]");
  const header = document.querySelector("header");
  const headerHeight = header ? header.offsetHeight : 0;

  // Highlights the current menu item based on the section visible in the viewport.
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute("id");
          const activeLink = document.querySelector(
            `.menu-item[href="#${sectionId}"]`
          );

          // Remove 'active' class from all menu items before adding to the current one.
          document
            .querySelectorAll(".menu-item.active")
            .forEach((link) => link.classList.remove("active"));

          if (activeLink) {
            activeLink.classList.add("active");
          }
        }
      });
    },
    {
      // Adjusts the observation margin to account for the fixed header height.
      rootMargin: `-${headerHeight}px 0px -50% 0px`,
      threshold: 0,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  /**
   * ---------------------------------------------------------------------------
   *  4. Design Process Accordion
   * ---------------------------------------------------------------------------
   */

  const designProcessSection = document.getElementById("design-process");

  if (designProcessSection) {
    const accordions =
      designProcessSection.querySelectorAll(".process-accordion");
    const allSteps = designProcessSection.querySelectorAll(
      ".process-step-group"
    );
    const allImages = designProcessSection.querySelectorAll(".visual-image");
    let currentActiveIndex = -1; // -1 indicates no step is active.

    // Manages the active state for accordion steps and corresponding images.
    const setActiveState = (index) => {
      // Deactivate all elements first for a clean state.
      allSteps.forEach((step) => step.classList.remove("is-active"));
      allImages.forEach((img) => img.classList.remove("is-active"));
      accordions.forEach((acc) => acc.classList.remove("has-active-step"));

      if (index !== -1) {
        // Activate the new target elements.
        accordions.forEach((acc) => acc.classList.add("has-active-step"));
        document
          .querySelectorAll(`#design-process [data-index="${index}"]`)
          .forEach((el) => el.classList.add("is-active"));
      } else {
        // If no step is active, show the default image.
        document
          .querySelector('.visual-image[data-index="-1"]')
          ?.classList.add("is-active");
      }
      currentActiveIndex = index;
    };

    // Handles click events on the accordion steps.
    const handleStepClick = (e) => {
      const clickedIndex = parseInt(e.currentTarget.dataset.index, 10);
      // Toggle behavior: clicking an active step will close it.
      const newIndex = clickedIndex === currentActiveIndex ? -1 : clickedIndex;
      setActiveState(newIndex);
    };

    // Initialize to default state (all closed).
    setActiveState(-1);

    // Attach event listeners.
    allSteps.forEach((step) => step.addEventListener("click", handleStepClick));
  }
});

/**
 * ---------------------------------------------------------------------------
 *  5. Standalone Scripts & Listeners
 * ---------------------------------------------------------------------------
 */

/**
 * Smooth scrolling for all anchor links pointing to on-page sections.
 * This applies globally, not just to menu items.
 */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

/**
 * Image Protection: Self-invoking function to prevent right-clicking and
 * dragging of images and elements with background images.
 */
(function () {
  const preventDefaultActions = (e) => {
    e.preventDefault();
  };

  const protectElement = (el) => {
    el.addEventListener("contextmenu", preventDefaultActions);
    el.addEventListener("dragstart", preventDefaultActions);
  };

  document.addEventListener("DOMContentLoaded", () => {
    // Protect all initial <img> tags.
    document.querySelectorAll("img").forEach(protectElement);

    // Protect all initial elements with a background image.
    document.querySelectorAll("*").forEach((el) => {
      if (getComputedStyle(el).backgroundImage !== "none") {
        protectElement(el);
      }
    });

    // Use MutationObserver to protect elements added to the DOM later.
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Protect new <img> tags within the added node.
            if (node.tagName === "IMG") protectElement(node);
            node.querySelectorAll?.("img").forEach(protectElement);

            // Protect new elements with background images.
            if (getComputedStyle(node).backgroundImage !== "none")
              protectElement(node);
            node
              .querySelectorAll?.("*")
              .forEach(
                (el) =>
                  getComputedStyle(el).backgroundImage !== "none" &&
                  protectElement(el)
              );
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
})();

/**
 * Social Media Launcher: Shows a social media bar with specific scroll-based triggers.
 * Executes on window load to ensure all assets are available.
 */
window.addEventListener("load", () => {
  const socialBar = document.getElementById("fsl-container");
  const closeButton = document.getElementById("fsl-close-button");
  const footer = document.querySelector("footer");

  if (!socialBar || !closeButton || !footer) return;

  let wasClosed = false; // Tracks if the user has manually closed the bar.

  // Initial appearance delay.
  setTimeout(() => {
    if (!wasClosed) {
      socialBar.classList.add("visible");
    }
  }, 2000);

  // Handle manual closing of the bar.
  closeButton.addEventListener("click", () => {
    socialBar.classList.remove("visible");
    wasClosed = true;
  });

  // Re-opens the bar when the user scrolls down into the footer.
  const footerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && wasClosed) {
          socialBar.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 } // Trigger when 10% of the footer is visible.
  );

  footerObserver.observe(footer);
});

/**
 * ---------------------------------------------------------------------------
 *  Footer Section
 * ---------------------------------------------------------------------------
 */
document.addEventListener("DOMContentLoaded", () => {
  // --- Elements ---
  const form = document.getElementById("newsletter-form");
  const emailInput = document.getElementById("email-signup");
  const errorElement = document.getElementById("error-message");
  const submitButton = document.getElementById("subscribe-button");

  // --- Animated Placeholder ---
  const placeholders = [
    "subscribe@reinmaxcreative.com",
    "your-email@example.com",
  ];
  let placeholderIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimeout;
  let errorTimeout;

  const typePlaceholder = () => {
    const currentText = placeholders[placeholderIndex];
    emailInput.placeholder = currentText.substring(0, charIndex);

    if (emailInput.value.length > 0) {
      clearTimeout(typingTimeout);
      return;
    }

    if (!isDeleting && charIndex < currentText.length) {
      charIndex++;
      typingTimeout = setTimeout(typePlaceholder, 120); // balanced typing speed
    } else if (isDeleting && charIndex > 0) {
      charIndex--;
      typingTimeout = setTimeout(typePlaceholder, 60); // balanced deleting speed
    } else {
      if (!isDeleting) {
        // Pause for 4 seconds after fully typed
        isDeleting = true;
        typingTimeout = setTimeout(typePlaceholder, 4000);
      } else {
        // Finished deleting, move to next placeholder
        isDeleting = false;
        placeholderIndex = (placeholderIndex + 1) % placeholders.length;
        typingTimeout = setTimeout(typePlaceholder, 500); // short pause before next
      }
    }
  };

  // --- Email Validation ---
  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const showError = (message) => {
    errorElement.textContent = message;
    errorElement.classList.add("visible");
    emailInput.classList.add("input-error");

    // Automatically hide error after 4 seconds
    clearTimeout(errorTimeout);
    errorTimeout = setTimeout(() => {
      errorElement.textContent = "";
      errorElement.classList.remove("visible");
      emailInput.classList.remove("input-error");
    }, 4000);
  };

  const hideError = () => {
    clearTimeout(errorTimeout);
    errorElement.textContent = "";
    errorElement.classList.remove("visible");
    emailInput.classList.remove("input-error");
  };

  // --- Input Focus & Blur ---
  emailInput.addEventListener("focus", () => {
    clearTimeout(typingTimeout);
    emailInput.placeholder = "";
  });

  emailInput.addEventListener("blur", () => {
    if (emailInput.value.trim() === "") typePlaceholder();
  });

  emailInput.addEventListener("input", hideError);

  // --- Form Submission ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hideError();

    const emailValue = emailInput.value.trim();

    if (emailValue === "") {
      showError("Email address is required.");
      return;
    }

    if (!validateEmail(emailValue)) {
      showError("Please enter a valid email address.");
      return;
    }

    // --- Success / Processing State ---
    submitButton.disabled = true;

    submitButton.textContent = "Success!";
    submitButton.classList.add("success");
    submitButton.classList.remove("bg-primary");
    submitButton.classList.add("bg-secondary");

    // Keep success state for 3 seconds
    setTimeout(() => {
      // Reset button and clear email input
      submitButton.classList.remove("success");
      submitButton.classList.remove("bg-secondary");
      submitButton.classList.add("bg-primary");
      submitButton.disabled = false;
      submitButton.textContent = "Subscribe";

      emailInput.value = ""; // clear input AFTER success
      typePlaceholder(); // restart placeholder animation
    }, 3000);
  });

  // --- Start placeholder animation ---
  typePlaceholder();
});

document.addEventListener("DOMContentLoaded", () => {
  const yearElement = document.getElementById("copyright-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
