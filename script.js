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
  const protectedImages = new WeakSet();
  const preventImageActions = (event) => event.preventDefault();

  function protectImage(img) {
    if (protectedImages.has(img)) return;
    img.addEventListener("contextmenu", preventImageActions);
    img.addEventListener("dragstart", preventImageActions);
    protectedImages.add(img);
  }

  const imageObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === "IMG") protectImage(node);
          node.querySelectorAll("img").forEach(protectImage);
        }
      }
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("img").forEach(protectImage);
    imageObserver.observe(document.body, { childList: true, subtree: true });
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
  5. BUSINESS HOURS & STATUS
================================================================================
*/
(function () {
  function updateBusinessStatus() {
    const container = document.getElementById("business-status-container");
    if (!container) return;

    const openingHour = 8;
    const closingHour = 18;
    const timeZone = "Africa/Nairobi";

    const now = new Date(new Date().toLocaleString("en-US", { timeZone }));
    const currentHour = now.getHours();
    const currentDay = now.getDay();

    const isWeekday = currentDay >= 1 && currentDay <= 5;
    const isOpen =
      isWeekday && currentHour >= openingHour && currentHour < closingHour;

    if (isOpen) {
      const closesAtContent = "Closes Today at 6:00 pm";
      container.innerHTML = `<div class="bg-green-50 text-green-800 p-6 rounded-2xl flex flex-col items-center text-center"><svg class="w-10 h-10 mb-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg><p class="font-bold text-xl">Now Open</p><p class="text-sm text-gray-600 mt-1">${closesAtContent}</p></div>`;
    } else {
      let opensAtContent = "";
      if (isWeekday && currentHour < openingHour) {
        opensAtContent = "Opens Today at 8:00 am";
      } else if (
        (currentDay === 5 && currentHour >= closingHour) ||
        currentDay === 6 ||
        currentDay === 0
      ) {
        opensAtContent = "Opens Monday at 8:00 am";
      } else {
        opensAtContent = "Opens Tomorrow at 8:00 am";
      }
      container.innerHTML = `<div class="bg-red-50 p-6 rounded-2xl flex flex-col items-center text-center"><svg class="w-10 h-10 mb-3 text-red-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg><p class="font-bold text-xl text-red-500">Currently Closed</p><p class="text-sm text-gray-600 mt-1">${opensAtContent}</p></div>`;
    }
  }

  document.addEventListener("DOMContentLoaded", updateBusinessStatus);
  setInterval(updateBusinessStatus, 60000);
})();

/*
================================================================================
  6. NOTIFICATION POP-UP
================================================================================
*/
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("notification-container");
  if (!container) return;

  const initialDelay = 5000;
  const displayDuration = 5000;
  let dismissTimer;

  function createGlassAlert() {
    clearTimeout(dismissTimer);
    container.innerHTML = "";
    const notification = document.createElement("div");
    notification.className = "glass-notification";
    notification.innerHTML = `<span>🔔📢 We just launched a new project! 🎨🔥</span>`;
    container.appendChild(notification);
    const dismiss = () => {
      notification.classList.add("closing");
      setTimeout(() => notification.remove(), 500);
    };
    dismissTimer = setTimeout(dismiss, displayDuration);
  }
  setTimeout(createGlassAlert, initialDelay);
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
      avatar: "https://iili.io/KB1HYZX.md.jpg",
      premium: true,
      date: "August 2025",
    },
    {
      quote:
        "Their insights have been invaluable. The new branding has completely revitalized our market presence.",
      name: "Aisha Juma",
      company: "Zanzibar Exports",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9Ei2sz2Je5kwsRkMDWarTqMODp6WsFiMB-50aDIyKyK1njFU_P1_2KxR8C9cpewpOoMI&usqp=CAU",
      premium: true,
      date: "July 2025",
    },
    {
      quote:
        "Reinmax Creative Team really knows how to make designs stand out... I appreciate their amazing work.",
      name: "Geofrey Mashurano",
      company: "Megaray Studio",
      avatar:
        "https://mermmicrofinance.co.tz/images/1024/15399196/IMG_3836-lHCTZiXP7d0QvEF4SAFBCA.JPG",
      premium: true,
      date: "June 2025",
    },
    {
      quote:
        "Working with them was a game-changer. Their execution directly led to a significant increase in engagement.",
      name: "David Mushi",
      company: "Kilimanjaro Tech",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRy9yjCvz6h8hvahzFy5UIaArn4oWXVFJ00w&s",
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
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M6.64 2.026a3.4 3.4 0 0 0-.96.296 2.7 2.7 0 0 0-.776.549C4.599 3.162 1.46 7.368 1.299 7.7c-.442.915-.384 2.043.148 2.866.09.14 1.978 2.748 4.195 5.797 4.458 6.129 4.339 5.979 5.001 6.301.524.255.777.314 1.357.315.517 0 .739-.042 1.18-.226.304-.126.695-.397.949-.658.332-.341 8.402-11.449 8.57-11.795.218-.451.278-.733.278-1.3 0-.566-.06-.847-.277-1.3-.159-.331-3.297-4.536-3.604-4.829a2.7 2.7 0 0 0-.776-.549c-.642-.324-.159-.3-6.2-.306-2.959-.003-5.425.001-5.48.01m2.329 2.048L8.14 6.073l-.8 1.925-1.912.001C3.908 8 3.521 7.99 3.546 7.95c.165-.274 2.79-3.711 2.877-3.768.24-.158.4-.177 1.506-.179 1.023-.003 1.067 0 1.04.071m3.942.116c.261.61 1.569 3.767 1.569 3.786 0 .013-1.116.024-2.48.024s-2.48-.011-2.48-.024c0-.019 1.308-3.176 1.569-3.786L11.17 4h1.66zm4.55-.069c.182.092.313.253 1.57 1.92.754 1 1.389 1.85 1.412 1.889.038.066-.062.07-1.872.069l-1.911-.001-.8-1.925-.83-2.001c-.028-.074.003-.076 1.102-.064 1.118.012 1.133.013 1.329.113M8.63 14.448a386 386 0 0 1 1.357 4.458c-.012.012-6.438-8.812-6.46-8.871-.008-.02.808-.035 1.861-.035h1.874zm6.001-4.398c-.01.028-.601 1.944-1.312 4.26S12.014 18.52 12 18.52s-.607-1.894-1.319-4.21c-.711-2.315-1.302-4.232-1.312-4.26-.014-.04.529-.05 2.631-.05s2.645.01 2.631.05m5.842-.015c-.02.055-6.45 8.881-6.461 8.87-.006-.005.605-2.011 1.358-4.457L16.738 10h1.874" fill="#002828" fill-rule="evenodd"/></svg>`
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
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M6.64 2.026a3.4 3.4 0 0 0-.96.296 2.7 2.7 0 0 0-.776.549C4.599 3.162 1.46 7.368 1.299 7.7c-.442.915-.384 2.043.148 2.866.09.14 1.978 2.748 4.195 5.797 4.458 6.129 4.339 5.979 5.001 6.301.524.255.777.314 1.357.315.517 0 .739-.042 1.18-.226.304-.126.695-.397.949-.658.332-.341 8.402-11.449 8.57-11.795.218-.451.278-.733.278-1.3 0-.566-.06-.847-.277-1.3-.159-.331-3.297-4.536-3.604-4.829a2.7 2.7 0 0 0-.776-.549c-.642-.324-.159-.3-6.2-.306-2.959-.003-5.425.001-5.48.01m2.329 2.048L8.14 6.073l-.8 1.925-1.912.001C3.908 8 3.521 7.99 3.546 7.95c.165-.274 2.79-3.711 2.877-3.768.24-.158.4-.177 1.506-.179 1.023-.003 1.067 0 1.04.071m3.942.116c.261.61 1.569 3.767 1.569 3.786 0 .013-1.116.024-2.48.024s-2.48-.011-2.48-.024c0-.019 1.308-3.176 1.569-3.786L11.17 4h1.66zm4.55-.069c.182.092.313.253 1.57 1.92.754 1 1.389 1.85 1.412 1.889.038.066-.062.07-1.872.069l-1.911-.001-.8-1.925-.83-2.001c-.028-.074.003-.076 1.102-.064 1.118.012 1.133.013 1.329.113M8.63 14.448a386 386 0 0 1 1.357 4.458c-.012.012-6.438-8.812-6.46-8.871-.008-.02.808-.035 1.861-.035h1.874zm6.001-4.398c-.01.028-.601 1.944-1.312 4.26S12.014 18.52 12 18.52s-.607-1.894-1.319-4.21c-.711-2.315-1.302-4.232-1.312-4.26-.014-.04.529-.05 2.631-.05s2.645.01 2.631.05m5.842-.015c-.02.055-6.45 8.881-6.461 8.87-.006-.005.605-2.011 1.358-4.457L16.738 10h1.874" fill="#002828" fill-rule="evenodd"/></svg>`
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

/*
================================================================================
  8. FINAL MERGED PRICING SECTION LOGIC
================================================================================
*/
document.addEventListener("DOMContentLoaded", function () {
  // Guard clause: Only run this code if the pricing section exists on the page.
  const pricingComponent = document.getElementById("reinmax-pricing-component");
  if (!pricingComponent) return; // --- CORE ELEMENTS ---

  const pricingSection = document.getElementById("pricing");
  const cardsContainer = document.getElementById("pricing-cards-container");
  const TZS_TO_USD_RATE = 2600; // --- ALL ORIGINAL CARD DATA AND FUNCTIONS ---

  const starterIconSVG = `<svg id="Capa_1" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100.71 108.25"><path class="cls-1" d="M3.38 20.22s3.66 3.75 5.08 9.13c.76 2.9 2.8 5.96 5.46 8.19 3.36 2.82 7.67 4.37 12.48 4.5-.03.41-.35.84-.89 1.56-1.05 1.37-2.63 3.45-2.1 7.06.51 3.42 2.85 7.76 7.38 13.67 4.55 5.94 3.52 11.21 2.43 16.8-.85 4.37-1.73 8.9.21 13.54 2.11 5.05 7.17 9.22 15.91 13.12l1.01.45 1.01-.45c8.74-3.9 13.8-8.07 15.91-13.12 1.94-4.64 1.06-9.16.21-13.54-1.09-5.58-2.12-10.86 2.43-16.8 4.53-5.91 6.87-10.25 7.38-13.67.54-3.62-1.05-5.69-2.1-7.06-.55-.72-.86-1.14-.89-1.56 4.82-.13 9.12-1.68 12.48-4.5 2.65-2.23 4.7-5.29 5.46-8.19 1.42-5.38 5.04-9.1 5.07-9.13l3.38-3.38-4.71-.83c-2.49-.44-4.9-.66-7.18-.66-12.53 0-19.23 6.53-22.59 11.76l-2.54-4.51c2.98-7.72 4.39-19.05 4.45-19.55l.27-2.23-2.2-.49C65.22.11 64.22 0 63.2 0c-2.76 0-4.76.8-4.98.89l-1.32.55-.2 1.41c-.87 6.32-2.94 10.41-4.52 12.72-.68.99-1.33 1.75-1.86 2.31a17.4 17.4 0 0 1-1.86-2.31c-1.58-2.31-3.64-6.39-4.52-12.72l-.2-1.41-1.32-.55C42.2.8 40.2 0 37.44 0c-1.02 0-2.03.11-2.99.33l-2.2.49.27 2.23c.06.5 1.47 11.83 4.45 19.55l-2.54 4.51c-3.36-5.23-10.06-11.76-22.59-11.76-2.28 0-4.69.22-7.18.66l-4.72.82 3.38 3.38Zm27.08 32.8c.07-.34.71-.7 1.54-.7.22 0 .45.02.67.07 1.23.27 1.83 1.11 1.75 1.48-.07.34-.71.7-1.54.7-.22 0-.45-.02-.67-.07-.62-.14-1.17-.44-1.5-.85-.09-.11-.3-.4-.25-.64Zm37.32 1.56c-.83 0-1.47-.36-1.54-.7-.05-.24.16-.53.25-.64.33-.4.88-.71 1.5-.85.22-.05.45-.07.67-.07.83 0 1.47.36 1.54.7.05.24-.16.53-.25.64-.33.4-.88.71-1.5.85-.22.05-.45.07-.67.07M11.9 20.33c5.8 0 10.66 1.64 14.44 4.88 3.12 2.67 4.87 5.85 5.78 8.05l1.96 4.71 8.48-15.04-.49-1.13c-.54-1.24-1.02-2.65-1.46-4.12.16 0 .32.01.48.01.84 0 1.73-.1 2.64-.36.29.47.58.92.89 1.35 2.19 3.11 4.19 4.44 4.41 4.58l1.34.85 1.34-.85c.22-.14 2.22-1.47 4.41-4.58.31-.44.6-.89.89-1.35.9.26 1.8.36 2.64.36.16 0 .32 0 .48-.01-.44 1.47-.93 2.88-1.46 4.12l-.49 1.13 8.48 15.04 1.96-4.71c.91-2.2 2.66-5.39 5.78-8.05 3.78-3.24 8.64-4.88 14.44-4.88.68 0 1.39.02 2.1.07-1.27 1.94-2.65 4.57-3.47 7.68-.39 1.5-1.61 3.77-3.85 5.64-2.65 2.22-6 3.35-9.96 3.35-.62 0-1.26-.03-1.91-.08l-3.2-.28.53 3.17c.04.23.07.45.1.68-1.05-.47-2.16-.89-3.31-1.23-1.31-.4-2.7.35-3.1 1.66s.35 2.7 1.66 3.1c4.26 1.28 6.66 3.34 7.24 3.89-.9-.4-1.92-.62-3-.62-.57 0-1.15.06-1.72.19-1.72.37-3.25 1.28-4.29 2.55-1.17 1.42-1.63 3.19-1.27 4.85.56 2.58 2.96 4.42 5.92 4.6q-.63.855-1.32 1.77c-2.65 3.46-4.07 7.09-4.34 11.12-.23 3.44.38 6.6.98 9.66.78 3.98 1.45 7.42.09 10.67-1.5 3.58-5.54 6.87-12.34 10.04-6.8-3.17-10.84-6.46-12.34-10.04-1.36-3.25-.69-6.69.09-10.67.6-3.06 1.21-6.21.98-9.66-.27-4.03-1.7-7.66-4.34-11.12q-.705-.915-1.32-1.77c2.94-.2 5.31-2.03 5.87-4.6.36-1.67-.1-3.43-1.27-4.85-1.04-1.27-2.57-2.17-4.29-2.55a8.4 8.4 0 0 0-1.72-.19c-1.05 0-2.03.21-2.91.58.65-.6 3.04-2.59 7.2-3.85a2.487 2.487 0 0 0-1.44-4.76c-1.22.37-2.32.79-3.31 1.24.03-.23.07-.45.1-.68l.53-3.17-3.2.28c-.65.06-1.29.08-1.91.08-3.96 0-7.31-1.13-9.96-3.35-2.23-1.87-3.45-4.14-3.85-5.64-.82-3.11-2.2-5.74-3.47-7.68.71-.05 1.42-.07 2.1-.07Z"/><path class="cls-1" d="M46.1 84.5c.18-.11 4.38-2.64 8.51 0 .41.26.88.39 1.33.39.82 0 1.62-.41 2.1-1.15.74-1.16.4-2.7-.76-3.43-6.84-4.36-13.56-.18-13.84 0l2.67 4.19zm1.51 9.82c-1.1-4.99-7.55-4.26-7.55-4.26 4.51 6.7 8.65 9.25 7.55 4.26m5.61 0c-1.1 4.99 3.04 2.44 7.55-4.26 0 0-6.45-.73-7.55 4.26"/></svg>`;
  const proIconSVG = `<svg id="Capa_1" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94.36 107.73"><path class="cls-1" d="M59.36 50.34c2.32-.28 4.02-1.99 3.8-3.82-.11-.91-.68-1.68-1.51-2.19 2.24-2.19 3.34-3.24 3.34-3.24h-7.24c-2.66 0-4.81 2.15-4.81 4.81v7.06c1.18-1.18 2.28-2.27 3.28-3.27.84.53 1.95.79 3.14.65M31.2 46.52c-.22 1.83 1.48 3.54 3.8 3.82 1.19.14 2.3-.12 3.14-.65 1.01 1 2.1 2.09 3.28 3.27V45.9c0-2.66-2.15-4.81-4.81-4.81h-7.24s1.1 1.05 3.34 3.24c-.83.51-1.4 1.28-1.51 2.19"/><path class="cls-1" d="M3.68 28.35C.84 34.7-.36 42.16.09 50.51l.16 3.01 4.05-.97c0 2.48.16 6.11.9 10.24.79 4.47 2.09 8.62 3.86 12.33 2.24 4.69 5.23 8.69 8.89 11.88l2.4 2.09 1.38-2.65c1.18 1.71 2.79 3.86 4.78 6.16 4.24 4.91 11.11 11.46 19.76 14.78l.9.35.9-.35c8.65-3.32 15.52-9.87 19.76-14.78 1.99-2.3 3.59-4.45 4.78-6.16l1.38 2.65 2.4-2.09c3.67-3.19 6.66-7.19 8.89-11.88 1.77-3.71 3.06-7.86 3.86-12.33.73-4.13.9-7.75.9-10.24l4.05.97.16-3.01c.46-8.36-.75-15.81-3.58-22.16-2.3-5.14-5.65-9.55-9.97-13.11a38.6 38.6 0 0 0-8.77-5.41l7.13-3.15-4.01-2.51C70.62 1.4 65.14 0 58.76 0c-5.4 0-9.88 1.02-11.59 1.47C45.46 1.02 40.97 0 35.58 0 29.2 0 23.72 1.4 19.29 4.17l-4.01 2.51 7.13 3.15c-2.6 1.16-5.7 2.88-8.77 5.41-4.32 3.56-7.67 7.97-9.97 13.11Zm1.34 18.86c0-3.64.35-7.05 1.07-10.21 3.05-.11 5.63.64 7.68 2.21 1.56 1.2 2.36 2.56 2.61 3.03-.75 3.6-.79 6.27-.79 6.53v.98l2.88 3.17c-.51.16-1.05.34-1.6.57-2.16.9-4.81 2.55-7.15 5.58-.66-5.45-.29-9.44-.29-9.49l.35-3.51zm23.56-17.28c4.38-3.56 10.47-4.6 18.11-3.08l.49.1.49-.1c7.64-1.52 13.74-.48 18.11 3.08 6.52 5.31 7.71 14.91 7.92 17.93l-8.59 9.44c-1.81-2.89-3.66-4.77-3.81-4.93l-3.56 3.54s1.61 1.65 3.14 4.09c1.38 2.2 2.99 5.53 2.82 8.89-.12 2.44-1.14 4.59-3.12 6.53l-1.2-.44-11.37-4.19c.21-1.65.68-3.66 1.73-4.41 1.9-1.34 5.13-3.46 0-3.79 0 0-1.23.67-2.57.67s-2.57-.67-2.57-.67c-5.13.33-1.9 2.45 0 3.79 1.05.74 1.52 2.76 1.73 4.41l-11.37 4.19-1.2.44c-1.97-1.94-2.99-4.08-3.12-6.51-.34-6.53 5.9-12.93 5.97-13l-1.78-1.77 1.78 1.77-3.56-3.54c-.16.16-2 2.03-3.81 4.93l-8.59-9.44c.21-3.02 1.4-12.62 7.92-17.93Zm26.47 52c-.06.04-.16.08-.4.08-.57 0-1.44-.25-2.36-.51-1.4-.4-3.15-.89-5.11-.89s-3.71.49-5.11.89c-.92.26-1.79.51-2.36.51-.24 0-.34-.04-.4-.08-.26-.37-.32-1.73-.09-3.16l7.97-2.93 7.96 2.93c.21 1.37.19 2.77-.09 3.17Zm25.68-8.9c-1.43 2.99-3.21 5.64-5.3 7.92l-2.49-4.78-2.28 4.03s-2.44 4.3-6.69 9.2c-3.7 4.27-9.56 9.89-16.79 12.93-7.23-3.04-13.09-8.66-16.79-12.93-4.25-4.9-6.67-9.15-6.69-9.2l-2.27-4.04-2.49 4.79c-2.09-2.28-3.87-4.94-5.3-7.92-.96-2-1.76-4.15-2.41-6.43 3.16-8 8.9-9.19 11.2-9.34l4.42 4.86c-.81 2.16-1.32 4.55-1.2 7.03.21 4.27 2.23 8 5.99 11.09l1.11.91 1.3-.48c.04 1.99.58 4.15 2.39 5.39.95.65 2.05.98 3.27.98s2.52-.35 3.73-.7c1.22-.34 2.47-.7 3.74-.7s2.53.36 3.74.7 2.46.7 3.73.7c1.22 0 2.32-.33 3.27-.98 1.81-1.24 2.35-3.39 2.39-5.39l1.3.48 1.11-.91c3.76-3.09 5.78-6.82 5.99-11.09.12-2.48-.39-4.87-1.2-7.03l4.41-4.85c.84.06 2.16.25 3.63.86 3.37 1.4 5.92 4.25 7.58 8.47-.65 2.28-1.45 4.43-2.41 6.43Zm3.85-26.95.34 3.5s.37 4.04-.29 9.49c-2.33-3.03-4.99-4.68-7.15-5.58-.55-.23-1.09-.42-1.6-.57l2.89-3.17v-.98c0-.25-.04-2.93-.79-6.53.46-.91 3.13-5.46 10.29-5.23.72 3.16 1.07 6.57 1.07 10.21zM86.1 30.4c.23.52.45 1.06.66 1.6-4.46.22-7.55 1.88-9.5 3.44-.38.3-.72.61-1.04.92-1.44-3.63-3.7-7.4-7.25-10.3l-.32-.26c.54-2.07 2.25-5.7 7.7-7.6.39.29.77.59 1.16.91 3.72 3.06 6.6 6.85 8.58 11.28ZM26.74 6.26c2.63-.82 5.58-1.24 8.85-1.24 5.98 0 10.82 1.44 10.86 1.45l.73.22.73-.22s4.88-1.45 10.86-1.45c3.26 0 6.22.41 8.85 1.24l-11.01 4.87 7.96 1.49s2.89.56 6.65 2.43c-3.19 1.84-5.03 4.19-6.09 6.13-.37.68-.67 1.35-.9 1.98-4.75-2.11-10.46-2.56-17.06-1.32-6.6-1.24-12.32-.79-17.06 1.32-.23-.63-.52-1.29-.9-1.98-1.05-1.93-2.89-4.28-6.08-6.12 3.74-1.86 6.6-2.43 6.64-2.44l7.96-1.49-11.01-4.87Zm-10.07 13c.44-.37.89-.72 1.33-1.05 3.09 1.07 5.34 2.8 6.69 5.17.51.9.82 1.75 1 2.44-.1.08-.21.16-.31.25-3.54 2.9-5.81 6.66-7.25 10.3-.32-.31-.66-.61-1.04-.92-1.95-1.57-5.03-3.23-9.5-3.44q.285-.75.6-1.47c1.95-4.41 4.8-8.21 8.47-11.27Z"/></svg>`;
  const enterpriseIconSVG = `<svg id="Capa_1" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 117.94 106.81"><path class="cls-1" d="M91.75 1.34c-3.99 0-7.69 1.26-11.03 3.74C77.63 1.41 74.69.29 74.31.15L73.88 0H44.07l-.43.15c-.38.13-3.32 1.25-6.41 4.93-3.34-2.48-7.04-3.74-11.03-3.74C12.94 1.34 1.32 15.41.83 16.01L0 17.02l2.96 13.04 2.04.1s3.46.23 7.51 2.73c2.46 1.52 4.64 3.56 6.48 6.07 2.35 3.21 4.15 7.2 5.36 11.87l1.27 4.91 3.35-3.81s2.34-2.65 6.07-6.78c1.3 3.14 2.01 5.7 2.26 8.02.32 3.04-.13 5.91-1.49 9.59l-1.14 3.09 4.24.64c-1.25 2.84-3.78 6.95-8.31 8.53l-6.09 2.12 5.8 2.83c.15.07 3.72 1.79 8.3 2.13.53.04 1.05.06 1.57.06 3.53 0 6.68-.92 9.34-2.71l.43 7.38-9.52 4.63-.06 1.62c-.14 4.13.9 7.38 3.1 9.65 3.89 4.02 10.27 4.06 15.93 4.06h.28c3.43 0 6.02-.88 7.7-2.62 1.61-1.67 1.79-3.52 1.79-4.16l.96-20.36c2.59 1.65 5.63 2.5 9.03 2.5.52 0 1.04-.02 1.57-.06 4.58-.34 8.15-2.06 8.3-2.13l5.8-2.83-6.09-2.12c-2.91-1.02-5.35-3.2-7.26-6.48-.46-.79-.83-1.56-1.13-2.25l2.95-.45-1.14-3.09c-1.36-3.69-1.81-6.56-1.49-9.59.24-2.32.96-4.88 2.26-8.02 3.73 4.13 6.04 6.75 6.07 6.78l3.35 3.81 1.27-4.91c1.18-4.58 2.94-8.52 5.24-11.7 1.8-2.5 3.94-4.55 6.35-6.09 4.04-2.57 7.56-2.87 7.76-2.88l2.02-.07L117.95 17l-.83-1.01c-.49-.6-12.11-14.67-25.37-14.67ZM39.13 76.77q-.51-.03-.99-.09c3.37-3 5.26-6.85 6.21-9.34l4.49.68.26 4.52c-2.39 3.08-5.74 4.5-9.97 4.23m25.43 6.77h-4.2v5.37h3.95c-.01.27-.45 9.43-.48 10.1-.02.5.07 1.09-.32 1.47-.42.41-1 .58-1.55.71-.74.18-1.52.23-2.28.23h-.14c-1.11 0-2.25 0-3.38-.03l-1.88-32.56-.03-.59h11.06l-.02.35-.29 6.19h-7.01v5.37h6.76l-.16 3.38Zm-15.17 9.54 4.67 8.21c-2.8-.22-5.32-.8-6.75-2.28-.92-.95-1.44-2.32-1.57-4.16l3.65-1.78Zm16.15-30.2H53.92l-.21-3.57h12zm15.64 13.79c-.28.03-.56.06-.84.08-4.16.31-7.48-1.01-9.88-3.92l.24-5.06 4.2-.64c.92 2.48 2.83 6.46 6.29 9.54Zm29.42-51.58c-1.87.39-4.81 1.26-7.99 3.23-3.05 1.89-5.74 4.4-7.99 7.47-1.92 2.62-3.52 5.64-4.77 9.04-1.48-1.66-3.43-3.82-5.71-6.32l-2.68-2.94-1.73 3.58c-2.66 5.5-4.02 9.66-4.42 13.47-.31 2.93-.06 5.76.79 8.9l-5.16.78.48-10.08a2.685 2.685 0 0 0-2.56-2.81 2.685 2.685 0 0 0-2.81 2.56v.13l-.09 1.84H53.39l-.11-1.84v-.16a2.71 2.71 0 0 0-2.85-2.53 2.7 2.7 0 0 0-2.53 2.84l.59 10.29-6.68-1.02c.85-3.14 1.1-5.98.79-8.9-.4-3.81-1.76-7.97-4.42-13.47l-1.73-3.58-2.68 2.94c-2.28 2.51-4.23 4.67-5.71 6.32-1.26-3.39-2.85-6.42-4.77-9.04-2.25-3.07-4.94-5.58-7.99-7.47-3.18-1.96-6.11-2.84-7.99-3.23L5.8 18.44c1.08-1.19 3.15-3.33 5.84-5.47 3.59-2.85 9.03-6.26 14.52-6.26 3.55 0 6.69 1.38 9.61 4.21l2.35 2.28 1.78-2.75c2.12-3.29 4.31-4.64 5.16-5.07h27.75c.84.43 3.04 1.79 5.16 5.07l1.78 2.75 2.35-2.28c2.92-2.83 6.06-4.21 9.61-4.21 8.94 0 17.68 8.78 20.37 11.73l-1.51 6.65Z"/><path class="cls-1" d="M71.45 28.83c-2.84 0-5.15 2.31-5.15 5.15v7.55c1.27-1.27 2.44-2.43 3.51-3.5.9.57 2.09.85 3.36.7 2.48-.3 4.3-2.13 4.06-4.09-.12-.98-.72-1.8-1.61-2.35 2.4-2.35 3.57-3.46 3.57-3.46h-7.75Zm-23.56 0h-7.75s1.17 1.12 3.57 3.46c-.89.54-1.49 1.37-1.61 2.35-.24 1.96 1.58 3.79 4.06 4.09 1.27.15 2.46-.13 3.36-.7 1.08 1.07 2.25 2.24 3.51 3.5v-7.55c0-2.84-2.31-5.15-5.15-5.15Zm-15.9-12.84c-.12.31-3 7.71-1.38 14.14l5.21-1.32c-1.2-4.73 1.14-10.79 1.16-10.85l-2.5-.98-2.5-.99Zm48.75 1.98c.02.06 2.36 6.12 1.16 10.85l5.21 1.32c1.63-6.43-1.25-13.83-1.38-14.14l-5 1.97Z"/></svg>`;

  const cardsData = [
    {
      id: "starter",
      name: "Twiga Plan",
      planName: "Starter Brand",
      description: "Ideal for individuals, startups, or small businesses...",
      features: [
        "2 Initial Logo Concepts",
        "Custom Color Palette",
        "Professional Typography",
        "Social Media Profile Kit",
        "One-Page Brand Guideline",
      ],
      priceTzs: 100000,
      priceUsd: Math.round(100000 / TZS_TO_USD_RATE / 5) * 5,
      isFeatured: false,
      category: "services",
      icon: starterIconSVG,
    },
    {
      id: "pro",
      name: "Simba Plan",
      planName: "Pro Branding",
      description:
        "Ideal for growing businesses needing a cohesive brand identity...",
      features: [
        "Multiple Logo Concepts",
        "UI/UX Landing Page Design",
        "Business Card & Letterhead",
        "Social Media Branding Kit",
        "Comprehensive Brand Guide",
      ],
      priceTzs: 150000,
      priceUsd: Math.round(150000 / TZS_TO_USD_RATE / 5) * 5,
      isFeatured: true,
      category: "services",
      icon: proIconSVG,
    },
    {
      id: "enterprise",
      name: "Tembo Plan",
      planName: "Enterprise",
      description:
        "Ideal for established companies that require full-scale branding...",
      features: [
        "Full Brand Strategy Workshop",
        "Complete Marketing Collateral",
        "Custom Illustration & Iconography",
        "Dedicated Account Manager",
        "Priority Support & Consultation",
      ],
      priceTzs: "Custom Quote",
      priceUsd: "Custom Quote",
      isFeatured: false,
      category: "services",
      icon: enterpriseIconSVG,
    },
    {
      id: "illustrator",
      name: "Adobe Illustrator",
      description: "Master the industry-standard tool for vector graphics...",
      features: [
        "Mastery of Vector Graphics",
        "Professional Logo & Icon Design",
        "Advanced Typography & Layout",
        "Creative Color Theory & Gradients",
        "Exporting for Web & Print",
      ],
      priceTzs: 60000,
      priceUsd: Math.round(60000 / TZS_TO_USD_RATE / 5) * 5,
      isFeatured: false,
      category: "courses",
      level: "Beginner - Professional",
      duration: "Duration: 3 Months",
      icon: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg",
    },
    {
      id: "photoshop",
      name: "Adobe Photoshop",
      description: "Unlock the power of photo editing and digital compositing.",
      features: [
        "Advanced Photo Retouching",
        "Layer & Masking Techniques",
        "Graphic Design Fundamentals",
        "Social Media Design",
        "Intro to Digital Painting",
      ],
      priceTzs: 50000,
      priceUsd: Math.round(50000 / TZS_TO_USD_RATE / 5) * 5,
      isFeatured: false,
      category: "courses",
      level: "Beginner - Professional",
      duration: "Duration: 3 Months",
      icon: "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg",
    },
    {
      id: "figma",
      name: "Figma",
      description: "Design and prototype modern interfaces from the ground up.",
      features: [
        "UI/UX Design Fundamentals",
        "Interactive Prototyping",
        "Design Systems",
        "Collaboration Tools",
        "Component Libraries",
      ],
      priceTzs: 55000,
      priceUsd: Math.round(55000 / TZS_TO_USD_RATE / 5) * 5,
      isFeatured: false,
      category: "courses",
      level: "Beginner - Professional",
      duration: "Duration: 3 Months",
      icon: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    },
  ];

  const createFeaturesListHTML = (features) =>
    features
      .map(
        (f) =>
          `<li class="flex items-center text-left"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="benefits-icon w-5 h-5 mr-3 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>${f}</li>`
      )
      .join("");

  const createCardHTML = (cardData, currentCurrency) => {
    const isUSD = currentCurrency === "USD";
    const price = isUSD ? cardData.priceUsd : cardData.priceTzs;
    const priceText =
      typeof price === "number"
        ? isUSD
          ? `$${price}`
          : price.toLocaleString("en-US")
        : price;
    const currencyText = typeof price === "string" ? "" : isUSD ? "USD" : "TZS";
    const btnText =
      cardData.id === "enterprise"
        ? "Contact Us"
        : cardData.category === "services"
        ? "Get a Quote"
        : "Enroll Now";
    let iconHTML = cardData.icon.trim().startsWith("<svg")
      ? `<div class="icon-wrapper">${cardData.icon}</div>`
      : `<div class="icon-wrapper"><img src="${cardData.icon}" alt="${cardData.name}"></div>`;
    let subtitleHTML = '<div class="h-10"></div>';
    if (cardData.category === "courses") {
      subtitleHTML = `<div class="h-10 -mt-2"><p class="text-sm font-medium" style="color: #99cccc;">${cardData.level}</p><p class="text-sm text-gray-500">${cardData.duration}</p></div>`;
    } else if (cardData.category === "services" && cardData.planName) {
      subtitleHTML = `<div class="h-10 -mt-2"><p class="text-sm font-medium" style="color: #99cccc;">${cardData.planName}</p><p class="text-sm">&nbsp;</p></div>`;
    }
    const ctaFront = `<div class="mt-auto pt-6"><button class="see-benefits-btn text-white w-full rounded-xl h-14 text-center font-bold">Package Details</button></div>`;
    const ctaBack = `<div class="mt-auto pt-6"><a href="#" class="back-action-btn is-link flex items-center justify-center text-white w-full rounded-xl h-14 text-center font-bold">${btnText}</a></div>`;
    const benefitsList = `<ul class="space-y-4 text-left flex-grow mb-6 flex flex-col justify-center">${createFeaturesListHTML(
      cardData.features
    )}</ul>`;
    const frontContent = `<div class="p-8 pt-10 flex flex-col h-full"><div class="h-16 flex items-center justify-center mb-4">${iconHTML}</div><h3 class="text-2xl font-bold text-primary text-center h-14 flex items-center justify-center">${cardData.name}</h3>${subtitleHTML}<div class="flex items-baseline justify-center my-6 h-12"><span class="text-4xl font-bold text-primary price-value">${priceText}</span><span class="text-lg font-medium text-gray-500 ml-2 price-currency">${currencyText}</span></div><p class="text-gray-600 text-center flex-grow mb-6">${cardData.description}</p>${ctaFront}</div>`;
    const backContent = `<div class="p-8 pt-10 flex flex-col h-full"><div class="h-16 flex items-center justify-center mb-4">${iconHTML}</div><h3 class="text-2xl font-bold text-center h-14 flex items-center justify-center">Package Details</h3><div class="h-10"></div><div class="flex-grow flex flex-col justify-center">${benefitsList}</div>${ctaBack}</div>`;
    return `<div class="pricing-card-wrapper relative flex flex-col ${
      cardData.isFeatured ? "featured" : ""
    }" data-id="${cardData.id}" data-category="${
      cardData.category
    }"><div class="flip-card-container cursor-pointer flex-grow"><div class="flip-card-inner"><div class="flip-card-front">${frontContent}</div><div class="flip-card-back">${backContent}</div></div></div></div>`;
  };

  const animateCount = (el, start, end, duration, isUsd) => {
    let startTime = null;
    const step = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const currentVal = Math.floor(progress * (end - start) + start);
      el.textContent = isUsd
        ? `$${currentVal}`
        : currentVal.toLocaleString("en-US");
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const updatePrices = (currency) => {
    document.querySelectorAll(".pricing-card-wrapper").forEach((wrapper) => {
      const cardData = cardsData.find((d) => d.id === wrapper.dataset.id);
      if (!cardData) return;
      const priceEl = wrapper.querySelector(".price-value");
      if (!priceEl || typeof cardData.priceTzs !== "number") return;
      const isUsd = currency === "USD";
      const startPriceStr = priceEl.textContent.replace(/[$,]/g, "");
      const startPrice = startPriceStr ? parseInt(startPriceStr) : 0;
      const endPrice = isUsd ? cardData.priceUsd : cardData.priceTzs;
      animateCount(priceEl, startPrice, endPrice, 500, isUsd);
      wrapper.querySelector(".price-currency").textContent = isUsd
        ? "USD"
        : "TZS";
    });
  };

  const renderCards = (category, currency) => {
    cardsContainer.classList.add("is-transitioning");
    setTimeout(() => {
      cardsContainer.innerHTML = cardsData
        .filter((c) => c.category === category)
        .map((card) => createCardHTML(card, currency))
        .join("");
      setupCardEventListeners();
      cardsContainer.classList.remove("is-transitioning");
    }, 300);
  };

  const setup3dDragListeners = (cardWrapper) => {
    const inner = cardWrapper.querySelector(".flip-card-inner");
    let isDragging = false,
      startX = 0;
    const onDragStart = (e) => {
      if (cardWrapper.classList.contains("is-flipped")) return;
      isDragging = true;
      startX = e.pageX || e.touches[0].pageX;
      inner.classList.add("is-dragging");
    };
    const onDragMove = (e) => {
      if (!isDragging) return;
      const currentX = e.pageX || e.touches[0].pageX;
      const deltaX = currentX - startX;
      const rotation = Math.max(-40, Math.min(40, deltaX / 15));
      inner.style.transform = `rotateY(${rotation}deg)`;
    };
    const onDragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      inner.classList.remove("is-dragging");
      inner.style.transform = "";
    };
    cardWrapper.addEventListener("mousedown", onDragStart);
    cardWrapper.addEventListener("touchstart", onDragStart, { passive: true });
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("touchmove", onDragMove, { passive: true });
    window.addEventListener("mouseup", onDragEnd);
    window.addEventListener("touchend", onDragEnd);
    cardWrapper.addEventListener("mouseleave", onDragEnd);
  };

  const setupCardEventListeners = () => {
    document.querySelectorAll(".pricing-card-wrapper").forEach((wrapper) => {
      const handleFlip = (e) => {
        e.stopPropagation();
        wrapper.classList.toggle("is-flipped");
      };
      wrapper
        .querySelector(".flip-card-container")
        .addEventListener("click", handleFlip);
      wrapper
        .querySelector(".see-benefits-btn")
        .addEventListener("click", handleFlip);
      wrapper
        .querySelector(".back-action-btn.is-link")
        .addEventListener("click", (e) => e.stopPropagation());
      setup3dDragListeners(wrapper);
    });
  }; // --- NEW FLOATING TOGGLE LOGIC ---

  const floatingToggle = document.getElementById("floating-toggle-container");
  const toggleTrigger = document.getElementById("toggle-trigger");
  const categoryToggleEl = document.getElementById("category-toggle");
  const currencyToggleEl = document.getElementById("currency-toggle");

  let autoCollapseTimer;
  let hasShownIntro = false;
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  const updateTogglePillVisuals = (container, activeButton) => {
    const pill = container.querySelector(".toggle-pill");
    if (!pill || !activeButton) return;
    const activeIndex = [...container.querySelectorAll(".toggle-btn")].indexOf(
      activeButton
    );
    pill.style.transform = `translateX(${activeIndex * 100}%)`;
    container
      .querySelectorAll(".toggle-btn")
      .forEach((btn) => btn.classList.remove("active"));
    activeButton.classList.add("active");
  };

  const openPanel = () => {
    clearTimeout(autoCollapseTimer);
    floatingToggle.classList.add("is-open");
  };
  const closePanel = () => {
    clearTimeout(autoCollapseTimer);
    floatingToggle.classList.remove("is-open");
  };
  const startAutoCollapseTimer = () => {
    clearTimeout(autoCollapseTimer);
    autoCollapseTimer = setTimeout(closePanel, 5000);
  };

  const handleToggleClick = (e) => {
    const button = e.target.closest(".toggle-btn");
    if (!button) return;
    startAutoCollapseTimer();
    const newType = button.dataset.type;
    const newCurrency = button.dataset.currency;
    if (newType) {
      const currentActiveCurrencyBtn =
        currencyToggleEl.querySelector(".toggle-btn.active");
      const activeCurrency = currentActiveCurrencyBtn
        ? currentActiveCurrencyBtn.dataset.currency
        : "TZS";
      renderCards(newType, activeCurrency);
      updateTogglePillVisuals(categoryToggleEl, button);
    } else if (newCurrency) {
      updatePrices(newCurrency);
      updateTogglePillVisuals(currencyToggleEl, button);
    }
  }; // --- PRECISE VISIBILITY LOGIC ---

  const isMobile = () => window.innerWidth < 768;
  const nextSectionTrigger = document.querySelector("#team h2");
  const desktopShowTrigger = cardsContainer;
  let mobileShowTrigger = null;
  let currentShowTrigger = null;
  let shouldBeVisible = { inPricingZone: false, pastPricingZone: false };

  const updateIconVisibility = () => {
    const isVisible =
      shouldBeVisible.inPricingZone && !shouldBeVisible.pastPricingZone;
    floatingToggle.classList.toggle("is-visible", isVisible);
    if (!isVisible) closePanel();
  };

  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target === currentShowTrigger) {
          shouldBeVisible.inPricingZone = entry.isIntersecting;
        }
        if (entry.target === nextSectionTrigger) {
          shouldBeVisible.pastPricingZone = entry.isIntersecting;
        }
      });
      updateIconVisibility();
    },
    { threshold: 0 }
  );

  if (nextSectionTrigger) {
    visibilityObserver.observe(nextSectionTrigger);
  }

  const cardRenderObserver = new MutationObserver(() => {
    if (currentShowTrigger) {
      visibilityObserver.unobserve(currentShowTrigger);
    }
    mobileShowTrigger = cardsContainer.querySelector(
      ".pricing-card-wrapper:nth-child(2)"
    );
    currentShowTrigger =
      isMobile() && mobileShowTrigger ? mobileShowTrigger : desktopShowTrigger;
    if (currentShowTrigger) {
      visibilityObserver.observe(currentShowTrigger);
    }
  });
  cardRenderObserver.observe(cardsContainer, { childList: true }); // --- EVENT LISTENERS & INITIALIZATION ---

  toggleTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = floatingToggle.classList.contains("is-open");
    isOpen ? closePanel() : openPanel();
    if (isTouchDevice && !isOpen) {
      startAutoCollapseTimer();
    }
  });

  if (!isTouchDevice) {
    floatingToggle.addEventListener("mouseenter", openPanel);
    floatingToggle.addEventListener("mouseleave", startAutoCollapseTimer);
  }

  categoryToggleEl.addEventListener("click", handleToggleClick);
  currencyToggleEl.addEventListener("click", handleToggleClick);

  renderCards("services", "TZS");
  updateTogglePillVisuals(
    categoryToggleEl,
    categoryToggleEl.querySelector('[data-type="services"]')
  );
  updateTogglePillVisuals(
    currencyToggleEl,
    currencyToggleEl.querySelector('[data-currency="TZS"]')
  );
});
