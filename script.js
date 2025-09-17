/*
================================================================================
  Reinmax Creative - Main JavaScript File
================================================================================
*/

/*
================================================================================
  1. MAIN WEBSITE & CONTROL PANEL LOGIC
================================================================================
*/
document.addEventListener("DOMContentLoaded", function () {
  // --- Element References for Control Panel ---
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const controlPanel = document.getElementById("control-panel");
  const mainContent = document.querySelector("main");
  const menuItems = document.querySelectorAll(".menu-item");

  if (mobileMenuButton && controlPanel && mainContent) {
    /**
     * Toggles the visibility of the floating control panel menu.
     */
    const toggleMenu = (forceClose = false) => {
      const isOpen = controlPanel.classList.contains("is-open");

      if (isOpen || forceClose) {
        // --- Closing menu ---
        document.body.classList.remove("overflow-hidden");
        mainContent.classList.remove("content-blurred");
        controlPanel.classList.remove("is-open");
        controlPanel.classList.add("opacity-0", "-translate-y-4", "scale-95");

        // Animate items out
        menuItems.forEach((item) => {
          item.classList.remove("opacity-100", "translate-y-0");
          item.classList.add("opacity-0", "translate-y-2");
        });

        setTimeout(
          () => controlPanel.classList.add("pointer-events-none"),
          450
        );
      } else {
        // --- Opening menu ---
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

          // Animate items in with stagger
          menuItems.forEach((item, i) => {
            setTimeout(() => {
              item.classList.add("opacity-100", "translate-y-0");
              item.classList.remove("opacity-0", "translate-y-2");
            }, i * 50); // staggered (50ms delay each)
          });
        });
      }
    };

    // --- Event listeners ---
    mobileMenuButton.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    document.body.addEventListener("click", (e) => {
      if (
        controlPanel.classList.contains("is-open") &&
        !controlPanel.contains(e.target)
      ) {
        toggleMenu(true);
      }
    });

    // --- Active section highlighting ---
    const sections = document.querySelectorAll("section[id]");
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const activeLink = document.querySelector(
              `.menu-item[href="#${entry.target.id}"]`
            );
            if (activeLink) {
              document
                .querySelector(".menu-item.active")
                ?.classList.remove("active");
              activeLink.classList.add("active");
            }
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    sections.forEach((section) => sectionObserver.observe(section));

    // --- Smooth scroll on click ---
    menuItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        const href = item.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          const targetElement = document.querySelector(href);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
          }
          setTimeout(() => toggleMenu(true), 200);
        }
      });
    });
  }

  // --- General Scroll-Based Animations (Fade-In) ---
  const faders = document.querySelectorAll(".fade-in");
  const appearOnScroll = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
  );
  faders.forEach((fader) => appearOnScroll.observe(fader));

  // --- Dynamic Footer Year ---
  const yearElement = document.getElementById("currentYear");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

/*
================================================================================
  2. IMAGE PROTECTION SCRIPT
================================================================================
*/
(function () {
  function disableRightClick(img) {
    img.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Protect existing images
    document.querySelectorAll("img").forEach(disableRightClick);

    // Protect images added later
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === "IMG") disableRightClick(node);
            node.querySelectorAll?.("img").forEach(disableRightClick);
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();

/*
================================================================================
  3. SOCIALS LAUNCHER
================================================================================
*/
document.addEventListener("DOMContentLoaded", () => {
  const socialLauncher = document.getElementById("social-launcher");
  if (socialLauncher) {
    const closeSocialsBtn = document.getElementById("close-socials-btn");
    socialLauncher.addEventListener("mouseenter", () =>
      socialLauncher.classList.add("is-open")
    );
    if (closeSocialsBtn) {
      closeSocialsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        socialLauncher.classList.remove("is-open");
      });
    }
    document.addEventListener("click", (e) => {
      if (!socialLauncher.contains(e.target)) {
        socialLauncher.classList.remove("is-open");
      }
    });
  }
});

/*
================================================================================
  4. MOBILE SOCIALS VISIBILITY
================================================================================
*/
document.addEventListener("DOMContentLoaded", function () {
  const socialButton = document.getElementById("social-launcher");
  const contactSection = document.getElementById("contact");

  if (socialButton && contactSection) {
    const isMobile = () => window.innerWidth <= 768;
    const contactObserver = new IntersectionObserver((entries) => {
      if (isMobile()) {
        socialButton.classList.toggle("visible", entries[0].isIntersecting);
      }
    });
    contactObserver.observe(contactSection);
    window.addEventListener("resize", () => {
      if (!isMobile()) socialButton.classList.add("visible");
    });
  }
});

/* 
 ================================================================================ 
   5. BUSINESS HOURS (with Fallback Encrypted API Links) 
 ================================================================================ 
 */

(function () {
  // --- Secure API Configuration ---
  // 1. Use the new "multi-link-encryptor-tool.html" to generate these arrays.
  // 2. Paste the "ENCRYPTED_URLS" array here.
  const ENCRYPTED_URLS = [
    "U2FsdGVkX1/de8MR7SKiOH7jXGJ1L3Zjv8CsyNt6brS77LyaRD+bpy2KHZFEQYrvTUjo26JKQyXfUKE6BWjuRYGvBzCD7oZrLBKUKHPjjxpLXIWdKpENKLV/sVDK+JDsPqFhvo0fySsbUPw7hYg0Pwo7u07ccSzL42wsM3U0a96oZ+kZfJkfpDJUxQg4yQyu", // Add more encrypted links here if needed
  ]; // 3. Paste the corresponding "SECRET_KEYS" array here.
  const SECRET_KEYS = [
    "enter-password-here", // Add more secret keys here
  ];

  const OPENING_HOUR = 8;
  const CLOSING_HOUR = 18; // --- Element References ---

  const container = document.getElementById("business-status-container");
  const svgs = {
    open: `<svg class="w-10 h-10 mb-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
    closed: `<svg class="w-10 h-10 mb-3 text-red-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
    error: `<svg class="w-10 h-10 mb-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
  };

  if (!container) {
    console.error("Business status container not found.");
    return;
  }
  /**
   * Decrypts all the API URLs.
   */

  function getApiUrls() {
    const decryptedUrls = [];
    for (let i = 0; i < ENCRYPTED_URLS.length; i++) {
      try {
        const bytes = CryptoJS.AES.decrypt(ENCRYPTED_URLS[i], SECRET_KEYS[i]);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        if (originalText) {
          decryptedUrls.push(originalText);
        } else {
          console.warn(`Decryption failed for URL index ${i}. Check its key.`);
        }
      } catch (e) {
        console.error(
          `A critical error occurred during decryption for URL index ${i}:`,
          e
        );
      }
    }
    return decryptedUrls;
  }
  /**
   * Renders the HTML for the business status card.
   */

  function render({ hour, day, error = false }) {
    if (error) {
      container.innerHTML = `<div class="bg-gray-100 text-gray-700 p-6 rounded-2xl flex flex-col items-center text-center">${svgs.error}<p class="font-bold text-xl">Status Unavailable</p><p class="text-sm text-gray-500 mt-1">Could not fetch current time.</p></div>`;
      return;
    }
    const isWeekday = day >= 1 && day <= 5;
    const isOpen = isWeekday && hour >= OPENING_HOUR && hour < CLOSING_HOUR;
    let subtitle = "";
    let urgentHelpHTML = "";
    if (isOpen) {
      subtitle = `Closes Today at ${CLOSING_HOUR}:00 EAT`;
    } else {
      if (day === 6 || (day === 5 && hour >= CLOSING_HOUR))
        subtitle = `Opens Monday at ${OPENING_HOUR}:00 am EAT`;
      else if (day === 0)
        subtitle = `Opens Tomorrow at ${OPENING_HOUR}:00 am EAT`;
      else if (hour < OPENING_HOUR)
        subtitle = `Opens Today at ${OPENING_HOUR}:00 am EAT`;
      else subtitle = `Opens Tomorrow at ${OPENING_HOUR}:00 am EAT`;
      urgentHelpHTML = `<a href="urgent.html" class="block text-sm font-semibold text-blue-600 hover:none mt-4">Need urgent assistance?<span class="text-red-500"></span></a>`;
    }
    const cardClass = isOpen
      ? "bg-green-50 text-green-800"
      : "bg-red-50 text-red-800";
    const icon = isOpen ? svgs.open : svgs.closed;
    const title = isOpen
      ? "Now Open"
      : `<span class="text-red-500">Currently Closed</span>`;
    container.innerHTML = `<div class="${cardClass} p-6 rounded-2xl flex flex-col items-center text-center">${icon}<p class="font-bold text-xl">${title}</p><p class="text-sm text-gray-600 mt-1">${subtitle}</p>${urgentHelpHTML}</div>`;
  }
  /**
   * Tries to fetch from a list of APIs until one succeeds.
   */

  async function updateStatus() {
    const apiUrls = getApiUrls();
    if (apiUrls.length === 0) {
      console.error("No valid API URLs could be decrypted.");
      render({ error: true });
      return;
    }

    let success = false;
    for (const apiUrl of apiUrls) {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          console.warn(
            `API response not OK from ${apiUrl}: ${response.status}`
          );
          continue; // Try the next URL
        }

        const data = await response.json();
        if (data.status !== "ok") {
          console.warn(`API returned an error status from ${apiUrl}`);
          continue; // Try the next URL
        } // Success! Render the data and stop trying other links.

        render({ hour: data.hours, day: data.dayofweek });
        success = true;
        break;
      } catch (err) {
        console.error(`Fetch failed for ${apiUrl}:`, err); // This URL failed, so the loop will automatically try the next one.
      }
    } // If the loop finished and no links worked, render the error state.

    if (!success) {
      console.error("All API fallback links failed.");
      render({ error: true });
    }
  } // Initial call and periodic refresh

  document.addEventListener("DOMContentLoaded", () => {
    // Make sure you've added the CryptoJS library to your HTML file!
    // <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
    if (typeof CryptoJS === "undefined") {
      console.error(
        "CryptoJS library not found. Please add the script tag to your HTML head."
      );
      render({ error: true });
      return;
    }
    updateStatus();
    setInterval(updateStatus, 60000);
  });
})();

/*
================================================================================
  6. NEW PROJECT NOTIFICATION
================================================================================
*/
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("notification-container");
  if (!container) return;

  const initialDelay = 5000; // 5s after page load
  const displayDuration = 5000; // show for 5s
  const twoHours = 2 * 60 * 60 * 1000; // 2 hours in ms

  const lastShown = localStorage.getItem("notificationTimestamp");
  const now = Date.now();

  // Only show if never shown OR more than 2 hours have passed
  if (!lastShown || now - parseInt(lastShown) > twoHours) {
    setTimeout(() => {
      const notification = document.createElement("div");
      notification.className = "glass-notification";
      notification.innerHTML = `<span>🔔📢 We just launched a new project! 🎨🔥</span>`;
      container.appendChild(notification);

      // Auto-dismiss
      setTimeout(() => {
        notification.classList.add("closing");
        setTimeout(() => notification.remove(), 500);
      }, displayDuration);

      // Update timestamp
      localStorage.setItem("notificationTimestamp", now.toString());
    }, initialDelay);
  }
});

/*
================================================================================
  7. TESTIMONIALS SECTION LOGIC
================================================================================
*/
document.addEventListener("DOMContentLoaded", () => {
  const testimonialsSection = document.getElementById("testimonials");
  if (!testimonialsSection) return;

  const testimonialsData = [
    {
      quote:
        "The team is super talented! They did an awesome job on our brand, and it’s been such a wonderful experience.",
      name: "Enock Kato",
      company: "Q.E Lodge",
      avatar: "https://iili.io/Kuw5MYl.md.webp",
      premium: true,
      date: "August 2025",
    },
    {
      quote:
        "Their insights have been invaluable. The new branding has completely revitalized our market presence.",
      name: "Aisha Juma",
      company: "Zanzibar Exports",
      avatar: "https://iili.io/KuwGaQp.md.webp",
      premium: true,
      date: "July 2025",
    },
    {
      quote:
        "Reinmax Creative Team really knows how to make designs stand out. I appreciate their amazing work.",
      name: "Geofrey Mashurano",
      company: "Megaray Studio",
      avatar: "https://iili.io/Kuwh2bs.md.webp",
      premium: true,
      date: "June 2025",
    },
    {
      quote:
        "Working with them was a game-changer. Their execution directly led to a significant increase in engagement.",
      name: "Dr. Brian Isabrye",
      company: "Africa Electricity Symposium",
      avatar: "https://iili.io/Kuw4ucu.webp",
      premium: true,
      date: "May 2025",
    },
    {
      quote:
        "The level of creativity and professionalism is unmatched. They transformed our concept into a brand that truly speaks to our audience.",
      name: "Joan Baltazar",
      company: "Afya Bora Foundation",
      avatar:
        "https://sites.globalhealth.duke.edu/gemini/wp-content/uploads/sites/34/2025/02/Maria-Mushis-Professional-Picture-e1738860006216-1024x1024.jpeg",
      premium: true,
      date: "March 2025",
    },
  ];

  const createQuoteHTML = (testimonial) => {
    const premiumBadge = testimonial.premium
      ? `<svg class="w-4 h-4" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3.3 3"><path d="M.72 2.4a.31.31 0 0 1-.29-.22L0 .64C-.02.58 0 .52.02.47.05.42.1.38.16.36.23.34.31.36.36.4L1 .95l.45-.83c.06-.11.2-.15.31-.09q.06.03.09.09l.44.84.64-.55c.1-.08.24-.07.32.03.05.06.06.13.04.2l-.43 1.54a.3.3 0 0 1-.29.22zM.36.8l.36 1.3h1.86L2.94.8l-.45.39s-.03.02-.05.03c-.15.08-.33.03-.41-.12L1.65.38l-.38.71s-.02.04-.03.05c-.05.06-.12.1-.2.11a.34.34 0 0 1-.22-.07L.36.79ZM2.7 3H.6c-.08 0-.15-.07-.15-.15S.52 2.7.6 2.7h2.1c.08 0 .15.07.15.15S2.78 3 2.7 3" style="fill:#7ac943"/></svg>`
      : "";
    return `
          <div class="testimonial-content-wrapper" style="background-color: #FFFFFF;">
              <div class="flex-grow">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -10 110 135" class="w-8 h-8 mb-4" fill="#002828"><path d="M20.961 57.633h11.555c-.035.254-.059.512-.11.762-1.163 5.78-6.515 10.316-12.44 10.77-.27.02-.684.047-1.137.078a2.454 2.454 0 0 0-2.29 2.445v3.578c0 1.29 1 2.36 2.29 2.446 13.762 1.343 25.71-9.399 26.402-23.176.035-.57.121-1.77.184-2.668.03-.254.05-.512.05-.774v-.004c.02-.289.016-.57 0-.851v-17.11c0-6.054-4.906-10.96-10.96-10.96H20.96c-6.054 0-10.96 4.906-10.96 10.96v13.54c0 6.054 4.905 10.96 10.96 10.96zm68.977-5.766q.048-.381.05-.773v-.004c.02-.29.016-.57 0-.852V33.13c0-6.055-4.905-10.96-10.96-10.96H65.485c-6.055 0-10.961 4.905-10.961 10.96v13.54c0 6.054 4.906 10.96 10.96 10.96H77.04c-.035.254-.059.512-.11.762-1.164 5.781-6.515 10.316-12.44 10.77-.27.02-.68.047-1.137.078a2.454 2.454 0 0 0-2.29 2.445v3.578c0 1.29 1 2.36 2.29 2.446 13.762 1.343 25.71-9.399 26.402-23.176.035-.57.12-1.77.183-2.668z"/></svg>
                  <p class="text-secondary-text text-lg leading-relaxed" style="color: #002828;">${testimonial.quote}</p>
              </div>
              <div class="mt-auto pt-4 border-t flex items-center gap-3" style="border-color: var(--border-color);">
                  <img class="w-12 h-12 rounded-full object-cover" src="${testimonial.avatar}" alt="${testimonial.name}">
                  <div>
                      <div class="flex items-center gap-1.5">
                          <p class="font-semibold" style="color: #002828;">${testimonial.name}</p>
                          ${premiumBadge}
                      </div>
                       <p class="text-sm" style="color: #002828;">${testimonial.company}</p>
                  </div>
              </div>
          </div>`;
  };

  const createAuthorBackHTML = (testimonial) => `
          <div class="testimonial-content-wrapper p-6 flex flex-col items-center justify-center text-center" style="background-color: #FFFFFF;">
              <img class="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-offset-4 ring-white" src="${testimonial.avatar}" alt="${testimonial.name}" style="--ring-color: var(--secondary-color);">
              <p class="font-bold text-xl" style="color: #002828;">${testimonial.name}</p>
              <p class="text-base mt-1" style="color: #6B7280;">${testimonial.company}</p>
              <p class="text-xs mt-4 text-gray-400">Feedback received: ${testimonial.date}</p>
          </div>`;

  const createDesktopCardHTML = (testimonial) => {
    const premiumBadge = testimonial.premium
      ? `<svg class="w-4 h-4" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3.3 3"><path d="M.72 2.4a.31.31 0 0 1-.29-.22L0 .64C-.02.58 0 .52.02.47.05.42.1.38.16.36.23.34.31.36.36.4L1 .95l.45-.83c.06-.11.2-.15.31-.09q.06.03.09.09l.44.84.64-.55c.1-.08.24-.07.32.03.05.06.06.13.04.2l-.43 1.54a.3.3 0 0 1-.29.22zM.36.8l.36 1.3h1.86L2.94.8l-.45.39s-.03.02-.05.03c-.15.08-.33.03-.41-.12L1.65.38l-.38.71s-.02.04-.03.05c-.05.06-.12.1-.2.11a.34.34 0 0 1-.22-.07L.36.79ZM2.7 3H.6c-.08 0-.15-.07-.15-.15S.52 2.7.6 2.7h2.1c.08 0 .15.07.15.15S2.78 3 2.7 3" style="fill:#7ac943"/></svg>`
      : "";
    return `
          <div class="testimonial-content-wrapper" style="background-color: #FFFFFF;">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -10 110 135" class="w-8 h-8 mb-4" fill="#002828"><path d="M20.961 57.633h11.555c-.035.254-.059.512-.11.762-1.163 5.78-6.515 10.316-12.44 10.77-.27.02-.684.047-1.137.078a2.454 2.454 0 0 0-2.29 2.445v3.578c0 1.29 1 2.36 2.29 2.446 13.762 1.343 25.71-9.399 26.402-23.176.035-.57.121-1.77.184-2.668.03-.254.05-.512.05-.774v-.004c.02-.289.016-.57 0-.851v-17.11c0-6.054-4.906-10.96-10.96-10.96H20.96c-6.054 0-10.96 4.906-10.96 10.96v13.54c0 6.054 4.905 10.96 10.96 10.96zm68.977-5.766q.048-.381.05-.773v-.004c.02-.29.016-.57 0-.852V33.13c0-6.055-4.905-10.96-10.96-10.96H65.485c-6.055 0-10.961 4.905-10.961 10.96v13.54c0 6.054 4.906 10.96 10.96 10.96H77.04c-.035.254-.059.512-.11.762-1.164 5.781-6.515 10.316-12.44 10.77-.27.02-.68.047-1.137.078a2.454 2.454 0 0 0-2.29 2.445v3.578c0 1.29 1 2.36 2.29 2.446 13.762 1.343 25.71-9.399 26.402-23.176.035-.57.12-1.77.183-2.668z"/></svg>
              <p class="text-secondary-text text-base leading-relaxed flex-grow mb-4" style="color: #6B7280;">${testimonial.quote}</p>
              <div class="mt-auto pt-4 border-t flex items-center gap-3" style="border-color: var(--border-color);">
                  <img class="w-10 h-10 rounded-full object-cover" src="${testimonial.avatar}" alt="${testimonial.name}">
                  <div>
                      <div class="flex items-center gap-1.5">
                          <p class="font-semibold" style="color: #002828;">${testimonial.name}</p>
                          ${premiumBadge}
                      </div>
                       <p class="text-sm" style="color: #6B7280;">${testimonial.company}</p>
                  </div>
              </div>
          </div>`;
  };

  if (window.innerWidth < 768) {
    // --- MOBILE: Flip Card Logic ---
    const container = document.querySelector(
      "#mobile-flip-card-wrapper .flip-card-container"
    );
    const innerCard = document.querySelector(
      "#mobile-flip-card-wrapper .flip-card-inner"
    );
    const front = document.querySelector(
      "#mobile-flip-card-wrapper .flip-card-front"
    );
    const back = document.querySelector(
      "#mobile-flip-card-wrapper .flip-card-back"
    );
    const flipBtn = document.getElementById("flip-btn");
    const nextBtn = document.getElementById("mobile-next-btn");
    const prevBtn = document.getElementById("mobile-prev-btn");

    let currentIndex = 2;
    let isAnimating = false;

    function updateFrontCard(index) {
      front.innerHTML = createQuoteHTML(testimonialsData[index]);
    }
    function updateBackCard(index) {
      back.innerHTML = createAuthorBackHTML(testimonialsData[index]);
    }

    function navigate(direction) {
      if (isAnimating) return;
      isAnimating = true;

      const newIndex = currentIndex + direction;
      if (newIndex < 0 || newIndex >= testimonialsData.length) {
        isAnimating = false;
        return;
      }

      const outClass = direction === 1 ? "slide-out-left" : "slide-out-right";
      const inClass = direction === 1 ? "slide-in-right" : "slide-in-left";

      if (container.classList.contains("is-flipped")) {
        container.classList.remove("is-flipped");
      }

      innerCard.classList.add(outClass);

      setTimeout(() => {
        currentIndex = newIndex;
        updateFrontCard(currentIndex);
        updateBackCard(currentIndex);
        updateNavButtons();

        innerCard.classList.remove(outClass);
        innerCard.classList.add(inClass);

        setTimeout(() => {
          innerCard.classList.remove(inClass);
          isAnimating = false;
        }, 350);
      }, 350);
    }

    function updateNavButtons() {
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === testimonialsData.length - 1;
    }

    function handleFlip() {
      container.classList.toggle("is-flipped");
    }

    let isDragging = false;
    let startX = 0,
      startY = 0;
    let lastX = 0,
      lastY = 0;
    let startTime = 0;
    let currentRotationX = 0,
      currentRotationY = 0;

    const onDragStart = (e) => {
      if (e.target.closest("button")) return;
      isDragging = true;

      const touch = e.touches ? e.touches[0] : e;
      startX = lastX = touch.pageX;
      startY = lastY = touch.pageY;
      startTime = Date.now();

      const isFlipped = container.classList.contains("is-flipped");
      currentRotationY = isFlipped ? -180 : 0;
      currentRotationX = 0;

      innerCard.style.transition = "none";
      container.classList.add("is-dragging");
      e.preventDefault();
    };

    const onDragMove = (e) => {
      if (!isDragging) return;

      const touch = e.touches ? e.touches[0] : e;
      const currentX = touch.pageX;
      const currentY = touch.pageY;

      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      const rotateY = currentRotationY + deltaX * 0.5;
      const rotateX = currentRotationX - deltaY * 0.5;

      innerCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      lastX = currentX;
      lastY = currentY;
    };

    const onDragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      container.classList.remove("is-dragging");

      const endTime = Date.now();
      const duration = Math.max(1, endTime - startTime);

      const velocityX = (lastX - startX) / duration;
      const velocityY = (lastY - startY) / duration;

      let finalRotationX = 0,
        finalRotationY = 0;
      const transformStyle = innerCard.style.transform;
      if (transformStyle) {
        const rotXMatch = transformStyle.match(/rotateX\(([^deg)]+)deg\)/);
        const rotYMatch = transformStyle.match(/rotateY\(([^deg)]+)deg\)/);
        if (rotXMatch) finalRotationX = parseFloat(rotXMatch[1]);
        if (rotYMatch) finalRotationY = parseFloat(rotYMatch[1]);
      }

      const throwFactor = 120;
      const projectedRotationX = finalRotationX - velocityY * throwFactor;
      const projectedRotationY = finalRotationY + velocityX * throwFactor;

      const targetRotationX = Math.round(projectedRotationX / 180) * 180;
      const targetRotationY = Math.round(projectedRotationY / 180) * 180;

      const totalVelocity = Math.sqrt(
        velocityX * velocityX + velocityY * velocityY
      );
      const durationMs = Math.max(300, 600 - totalVelocity * 100);

      innerCard.style.transition = `transform ${durationMs}ms cubic-bezier(0.25, 1, 0.5, 1)`;
      innerCard.style.transform = `rotateX(${targetRotationX}deg) rotateY(${targetRotationY}deg)`;

      setTimeout(() => {
        const isNowFlipped =
          Math.abs(Math.round(targetRotationY / 180)) % 2 === 1;
        container.classList.toggle("is-flipped", isNowFlipped);

        innerCard.style.transition = "";
        innerCard.style.transform = "";
      }, durationMs);
    };

    flipBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      handleFlip();
    });

    container.addEventListener("mousedown", onDragStart);
    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragEnd);
    container.addEventListener("touchstart", onDragStart, { passive: false });
    document.addEventListener("touchmove", onDragMove);
    document.addEventListener("touchend", onDragEnd);

    nextBtn.addEventListener("click", () => navigate(1));
    prevBtn.addEventListener("click", () => navigate(-1));
    updateFrontCard(currentIndex);
    updateBackCard(currentIndex);
    updateNavButtons();
  } else {
    // --- DESKTOP: Cover Flow Logic ---
    const track = document.querySelector(
      "#desktop-carousel-wrapper .cover-flow-track"
    );
    const nextBtn = document.getElementById("desktop-next-btn");
    const prevBtn = document.getElementById("desktop-prev-btn");

    let currentIndex = 2;

    testimonialsData.forEach((testimonial, index) => {
      const card = document.createElement("div");
      card.className = "cover-flow-card";
      card.innerHTML = createDesktopCardHTML(testimonial);
      card.dataset.index = index;
      track.appendChild(card);
    });

    const cards = Array.from(track.children);

    function updateCarousel() {
      cards.forEach((card, i) => {
        const pos = i - currentIndex;
        const absPos = Math.abs(pos);

        const yRotate = pos * -35;
        const zTranslate = absPos * -180;
        const xTranslate = pos * (card.offsetWidth * 0.36);

        card.style.transform = `translateX(${xTranslate}px) translateZ(${zTranslate}px) rotateY(${yRotate}deg)`;
        card.style.zIndex =
          pos === 0
            ? testimonialsData.length
            : testimonialsData.length - absPos;
        card.style.opacity = absPos > 1 ? "0" : "1";
        card.style.pointerEvents = absPos > 1 ? "none" : "auto";
      });
      updateNavButtons();
    }

    function updateNavButtons() {
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === testimonialsData.length - 1;
    }

    function navigate(direction) {
      const newIndex = currentIndex + direction;
      if (newIndex >= 0 && newIndex < testimonialsData.length) {
        currentIndex = newIndex;
        updateCarousel();
      }
    }

    track.addEventListener("click", (e) => {
      const clickedCard = e.target.closest(".cover-flow-card");
      if (clickedCard) {
        const newIndex = parseInt(clickedCard.dataset.index);
        if (newIndex !== currentIndex) {
          currentIndex = newIndex;
          updateCarousel();
        }
      }
    });

    nextBtn.addEventListener("click", () => navigate(1));
    prevBtn.addEventListener("click", () => navigate(-1));

    setTimeout(updateCarousel, 50);
  }
});

// =============================================
// CONTROL PANEL (NAVIGATION MENU) LOGIC
// =============================================
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section[id]");
  const menuItems = document.querySelectorAll("#control-panel .menu-item");
  const headerHeight = document.querySelector("header").offsetHeight;

  const observerOptions = {
    rootMargin: `-${headerHeight}px 0px -50% 0px`,
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        menuItems.forEach((item) => {
          item.classList.remove("active");
          if (item.getAttribute("href") === `#${id}`) {
            item.classList.add("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // =============================================
  // FADE-IN ELEMENTS ON SCROLL
  // =============================================
  const fadeInElements = document.querySelectorAll(".fade-in");
  const fadeInObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          fadeInObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  fadeInElements.forEach((el) => {
    fadeInObserver.observe(el);
  });

  // =============================================
  // SOCIAL LAUNCHER LOGIC
  // =============================================
  const socialLauncher = document.getElementById("social-launcher");
  const launcherIcon = socialLauncher.querySelector(".absolute.bottom-0");
  const closeSocialsBtn = document.getElementById("close-socials-btn");

  launcherIcon.addEventListener("click", () => {
    socialLauncher.classList.add("is-open");
  });

  closeSocialsBtn.addEventListener("click", () => {
    socialLauncher.classList.remove("is-open");
  });

  // =============================================
  // FOOTER - CURRENT YEAR
  // =============================================
  const currentYearSpan = document.getElementById("currentYear");
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});

// =============================================
// OUR CREATIVE WORKFLOW
// =============================================
document.addEventListener("DOMContentLoaded", function () {
  const designProcessSection = document.getElementById("design-process");
  if (!designProcessSection) return;

  const accordions =
    designProcessSection.querySelectorAll(".process-accordion");
  const allSteps = designProcessSection.querySelectorAll(".process-step-group");
  const allImages = designProcessSection.querySelectorAll(".visual-image");
  let currentActiveIndex = -1;

  function setActiveState(index) {
    // Remove active classes from all steps and images first
    allSteps.forEach((step) => step.classList.remove("is-active"));
    allImages.forEach((img) => img.classList.remove("is-active"));

    // Remove the focus class from all accordion containers
    accordions.forEach((acc) => acc.classList.remove("has-active-step"));

    if (index !== -1) {
      // Add the focus class to the parent accordions
      accordions.forEach((acc) => acc.classList.add("has-active-step"));

      // Activate the specific steps that match the index
      designProcessSection
        .querySelectorAll(`.process-step-group[data-index="${index}"]`)
        .forEach((step) => {
          step.classList.add("is-active");
        });

      // Activate the specific images that match the index
      designProcessSection
        .querySelectorAll(`.visual-image[data-index="${index}"]`)
        .forEach((img) => {
          img.classList.add("is-active");
        });
    } else {
      // If no card is active, show the default image
      designProcessSection
        .querySelectorAll('.visual-image[data-index="-1"]')
        .forEach((img) => {
          img.classList.add("is-active");
        });
    }

    currentActiveIndex = index;
  }

  function handleStepClick(e) {
    const clickedIndex = parseInt(e.currentTarget.dataset.index);
    // If the clicked one is already active, close it (-1). Otherwise, open the new one.
    const newIndex = clickedIndex === currentActiveIndex ? -1 : clickedIndex;
    setActiveState(newIndex);
  }

  // Set the initial state (all closed)
  setActiveState(-1);

  // Attach click listeners to all steps
  allSteps.forEach((step) => {
    step.addEventListener("click", handleStepClick);
  });
});
