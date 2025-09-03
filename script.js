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

const colors = {
  primary: "#002828",
  secondary: "#99cccc",
  tertiary: "#003333",
  quaternary: "#666666",
  other: "#25D366",
  background: "#f0f4f4",
};

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
  4. SOCIALS LAUNCHER
================================================================================
*/
document.addEventListener("DOMContentLoaded", () => {
  // --- Social Launcher Logic ---
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

  // --- Custom Cursor Logic ---
  const cursor = document.getElementById("mouse-cursor");
  if (cursor && window.matchMedia("(pointer: fine)").matches) {
    const moveCursor = (e) => {
      const { clientX: x, clientY: y } = e;
      const offsetX = cursor.offsetWidth / 2;
      const offsetY = cursor.offsetHeight / 2;
      let scale = cursor.classList.contains("clicked-state") ? 0.9 : 1.0;
      cursor.style.transform = `translate3d(${x - offsetX}px, ${
        y - offsetY
      }px, 0) scale(${scale})`;
    };

    const updateCursorState = (e) => {
      /* Your original updateCursorState logic */
    };

    const createClickRipple = (e) => {
      /* Your original createClickRipple logic */
    };

    document.addEventListener("mousemove", (e) => {
      moveCursor(e);
      updateCursorState(e);
    });
    document.addEventListener("mousedown", (e) => {
      cursor.classList.add("clicked-state");
      createClickRipple(e);
    });
    document.addEventListener("mouseup", () =>
      cursor.classList.remove("clicked-state")
    );
  }
});

/*
================================================================================
  5. MOBILE SOCIALS VISIBILITY
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
  6. PRICING SECTION LOGIC
================================================================================
*/
document.addEventListener("DOMContentLoaded", function () {
  const servicesBtn = document.getElementById("services-btn");
  if (!servicesBtn) return;

  const coursesBtn = document.getElementById("courses-btn");
  const servicesContent = document.getElementById("services-content");
  const coursesContent = document.getElementById("courses-content");
  const usdBtn = document.getElementById("usd-btn");
  const tzsBtn = document.getElementById("tzs-btn");
  const categoryToggle = document.getElementById("category-toggle");
  const currencyToggle = document.getElementById("currency-toggle");
  const TZS_TO_USD_RATE = 2600;

  const animateValue = (el, start, end, duration, isTzs) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      el.textContent = isTzs ? value.toLocaleString("en-US") : `$${value}`;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const updatePrices = (currency) => {
    document.querySelectorAll("[data-price-tzs]").forEach((el) => {
      const tzsPrice = parseFloat(el.getAttribute("data-price-tzs"));
      const priceValueEl = el.querySelector(".price-value");
      const currencyEl = el.querySelector(".price-currency");
      if (!priceValueEl || !currencyEl) return;
      const startValue =
        parseInt(priceValueEl.textContent.replace(/[^0-9]/g, ""), 10) || 0;
      if (currency === "USD") {
        const roundedUsd = Math.round(tzsPrice / TZS_TO_USD_RATE / 5) * 5;
        animateValue(priceValueEl, startValue, roundedUsd, 300, false);
        currencyEl.textContent = "USD";
      } else {
        animateValue(priceValueEl, startValue, tzsPrice, 300, true);
        currencyEl.textContent = "TZS";
      }
    });
  };

  const toggleContent = (
    activeBtn,
    inactiveBtn,
    activeContent,
    toggleWrapper,
    activeValue
  ) => {
    activeBtn.classList.add("active");
    inactiveBtn.classList.remove("active");
    toggleWrapper.setAttribute("data-active", activeValue);
    document
      .querySelector(".pricing-content-panel.active")
      ?.classList.remove("active");
    activeContent.classList.add("active");
    activeContent.querySelectorAll(".pricing-card").forEach((card) => {
      card.style.animation = "none";
      void card.offsetWidth; // Trigger reflow
      card.style.animation = null;
    });
  };

  servicesBtn.addEventListener("click", () =>
    toggleContent(
      servicesBtn,
      coursesBtn,
      servicesContent,
      categoryToggle,
      "services"
    )
  );
  coursesBtn.addEventListener("click", () =>
    toggleContent(
      coursesBtn,
      servicesBtn,
      coursesContent,
      categoryToggle,
      "courses"
    )
  );
  usdBtn.addEventListener("click", () => {
    usdBtn.classList.add("active");
    tzsBtn.classList.remove("active");
    currencyToggle.setAttribute("data-active", "usd");
    updatePrices("USD");
  });
  tzsBtn.addEventListener("click", () => {
    tzsBtn.classList.add("active");
    usdBtn.classList.remove("active");
    currencyToggle.setAttribute("data-active", "tzs");
    updatePrices("TZS");
  });
});

/*
================================================================================
  7. BUSINESS HOURS & STATUS
================================================================================
*/
(function () {
  // This is the main function that updates the status
  function updateBusinessStatus() {
    const container = document.getElementById("business-status-container");
    if (!container) return;

    // --- CONFIGURATION ---
    const openingHour = 8; // 8:00 am
    const closingHour = 18; // 6:00 pm
    const timeZone = "Africa/Nairobi"; // EAT for Tanzania

    // --- TIME LOGIC ---
    const now = new Date(new Date().toLocaleString("en-US", { timeZone }));
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // Sunday=0, Monday=1, ..., Saturday=6

    const isWeekday = currentDay >= 1 && currentDay <= 5;
    const isOpen =
      isWeekday && currentHour >= openingHour && currentHour < closingHour;

    if (isOpen) {
      const closesAtContent = "Closes Today at 6:00 pm";
      container.innerHTML = `<div class="bg-green-50 text-green-800 p-6 rounded-2xl flex flex-col items-center text-center"><svg class="w-10 h-10 mb-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg><p class="font-bold text-xl">Now Open</p><p class="text-sm text-gray-600 mt-1">${closesAtContent}</p></div>`;
    } else {
      // --- SMARTER "CLOSED" LOGIC ---
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

  // Run the function when the page loads
  document.addEventListener("DOMContentLoaded", updateBusinessStatus);
  // And then run it again every 60 seconds to keep it up to date
  setInterval(updateBusinessStatus, 60000);
})();

/*
================================================================================
  8. NOTIFICATION POP-UP
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

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("testimonial-slider");
  if (!slider) return;

  const backBtn = document.getElementById("back-btn");
  const nextBtn = document.getElementById("next-btn");
  const cards = Array.from(slider.children);

  const scrollToDefaultCard = () => {
    // Set the 2nd card as default (index 1) to show one on the left
    const defaultCardIndex = 1;
    if (cards.length > defaultCardIndex) {
      const defaultCard = cards[defaultCardIndex];
      // Center the default card
      const targetScrollLeft =
        defaultCard.offsetLeft -
        slider.offsetWidth / 2 +
        defaultCard.offsetWidth / 2;
      slider.scrollTo({ left: targetScrollLeft, behavior: "auto" });
    }
  };

  const scrollAmount = () => {
    return cards[0]
      ? cards[0].offsetWidth + parseInt(window.getComputedStyle(slider).gap)
      : 0;
  };

  nextBtn.addEventListener("click", () =>
    slider.scrollBy({ left: scrollAmount(), behavior: "smooth" })
  );
  backBtn.addEventListener("click", () =>
    slider.scrollBy({ left: -scrollAmount(), behavior: "smooth" })
  );

  const updateButtonState = () => {
    const tolerance = 5;
    backBtn.disabled = slider.scrollLeft < tolerance;
    nextBtn.disabled =
      Math.abs(slider.scrollWidth - slider.clientWidth - slider.scrollLeft) <
      tolerance;
  };

  slider.addEventListener("scroll", updateButtonState, { passive: true });

  // Recalculate on resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      scrollToDefaultCard();
      updateButtonState();
    }, 250);
  });

  // Initial setup
  setTimeout(() => {
    scrollToDefaultCard();
    updateButtonState();
    // Add fade-in animation to cards after initial scroll
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 100}ms`;
      card.classList.add("fade-in-up");
    });
  }, 100);
});

/*
================================================================================
  9. TESTIMONIALS SECTION LOGIC
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
