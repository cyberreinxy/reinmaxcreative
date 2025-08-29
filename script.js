document.addEventListener("DOMContentLoaded", function () {
  /* =============================================
      General Website Scripts
      ============================================= */

  // --- DOM Element References for General Scripts ---
  const header = document.querySelector("header");
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuOverlay = document.getElementById("menu-overlay");

  /* --- Mobile Menu Functionality --- */

  /**
   * Toggles the mobile menu's visibility and manages body overflow.
   */
  function toggleMenu() {
    const isOpen = mobileMenu.classList.toggle("open");
    const headerHeight = header.offsetHeight;
    mobileMenu.style.top = `${headerHeight}px`;
    mobileMenu.style.height = `calc(100vh - ${headerHeight}px)`;
    document.body.classList.toggle("overflow-hidden");
    menuOverlay.classList.toggle("hidden", !isOpen);
  }

  // Event listeners for mobile menu interactions
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", toggleMenu);
  }

  // Close the menu and scroll to section when a link is clicked
  document.querySelectorAll("#mobile-menu a").forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
          });
        }
      }
      if (mobileMenu.classList.contains("open")) {
        toggleMenu();
      }
    });
  });

  // Close the menu when clicking the overlay
  if (menuOverlay) {
    menuOverlay.addEventListener("click", toggleMenu);
  }

  /* --- Scroll-Based Animations (Fade-In) --- */

  // Select all elements with the 'fade-in' class
  const faders = document.querySelectorAll(".fade-in");

  // Configure the IntersectionObserver options
  const appearOptions = {
    threshold: 0.2, // Trigger when 20% of the element is visible
    rootMargin: "0px 0px -50px 0px", // Start a bit earlier
  };

  /**
   * Observer callback to add the 'visible' class when elements intersect.
   * @param {IntersectionObserverEntry[]} entries - Array of entries.
   * @param {IntersectionObserver} observer - The observer instance.
   */
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Stop observing once it's visible
      }
    });
  }, appearOptions);

  // Attach the observer to each 'fade-in' element
  faders.forEach((fader) => {
    appearOnScroll.observe(fader);
  });

  /* --- Dynamic Navigation Active State --- */

  // This logic should only apply to the main page with scrollable sections.
  if (document.querySelector("section#home")) {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("header nav a");

    /**
     * Updates the active state of navigation links based on scroll position.
     */
    window.addEventListener("scroll", () => {
      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        // Check if the current scroll position is within the section
        if (pageYOffset >= sectionTop - 70) {
          current = section.getAttribute("id");
        }
      });
      // Add/remove the 'active' class to the corresponding nav link
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(current)) {
          link.classList.add("active");
        }
      });
    });
  }

  /* --- Dynamic Footer Year --- */

  const currentYear = new Date().getFullYear();
  const yearElement = document.getElementById("currentYear");

  // Update the year in the footer
  if (yearElement) {
    yearElement.textContent = currentYear;
  }

  /* ===================================================
      Search - Search courses and services in the website
      =================================================== */

  // --- DATA SOURCE ---
  const searchableData = [
    {
      type: "Course",
      title: "Typography Masterclass",
      description: "Learn the art of typography and lettering.",
      url: "#",
    },
    {
      type: "Course",
      title: "UI/UX Design Fundamentals",
      description: "A complete guide to user interface design.",
      url: "#",
    },
    {
      type: "Course",
      title: "Animation with After Effects",
      description: "Bring your designs to life with motion.",
      url: "#",
    },
    {
      type: "Service",
      title: "Web Design & Development",
      description: "Custom websites built for performance and style.",
      url: "#",
    },
    {
      type: "Service",
      title: "Branding & Identity",
      description: "We build brands that stand out and connect.",
      url: "#",
    },
  ];

  // SVG icons for different search result types
  const icons = {
    Course: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    Service: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  };

  // --- DOM ELEMENT REFERENCES for Search ---
  const openSearchBtn = document.getElementById("openSearchBtn");
  const closeSearchBtn = document.getElementById("closeSearchBtn");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchInput = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("resultsContainer");
  const initialStateContainer = document.getElementById(
    "initialStateContainer"
  );
  const categoriesContainer = document.getElementById("categoriesContainer");
  const trendsContainer = document.getElementById("trendsContainer");

  // --- SEARCH FUNCTIONS ---

  /**
   * Opens the search overlay and focuses the input field.
   */
  function openSearch() {
    document.body.classList.add("search-active");
    searchOverlay.classList.add("active");
    renderInitialState();
    setTimeout(() => searchInput.focus(), 300);
  }

  /**
   * Closes the search overlay and clears the input.
   */
  function closeSearch() {
    document.body.classList.remove("search-active");
    searchOverlay.classList.remove("active");
    searchInput.value = "";
  }

  /**
   * Renders the initial state of the search overlay with categories and trending items.
   */
  function renderInitialState() {
    // Get unique categories and render them as buttons
    const categories = [...new Set(searchableData.map((item) => item.type))];
    categoriesContainer.innerHTML = "";
    categories.forEach((cat) => {
      const catButton = document.createElement("button");
      const isCourse = cat === "Course";
      const bgColor = isCourse ? "bg-primary/10" : "bg-secondary/20";
      const textColor = isCourse ? "text-primary" : "text-sky-800";
      const hoverBgColor = isCourse
        ? "hover:bg-primary/20"
        : "hover:bg-secondary/40";

      catButton.className = `py-2 px-4 rounded-full text-sm font-semibold transition-colors ${bgColor} ${textColor} ${hoverBgColor}`;
      catButton.innerHTML = `<span>${cat}s</span>`;
      catButton.onclick = () => handleCategoryClick(cat);
      categoriesContainer.appendChild(catButton);
    });

    // Render trending items
    trendsContainer.innerHTML = "";
    const trendingCourses = searchableData.filter(
      (item) => item.type === "Course"
    );
    trendingCourses.slice(0, 3).forEach((item, index) => {
      const trendItem = document.createElement("a");
      trendItem.href = item.url;
      trendItem.className =
        "trend-item flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors";
      trendItem.style.animationDelay = `${index * 100}ms`;
      const iconSvg = icons[item.type];
      trendItem.innerHTML = `
          <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center mr-3">
              ${iconSvg.replace("<svg", `<svg class="w-5 h-5 text-primary"`)}
          </div>
          <p class="font-semibold text-md text-gray-800">${item.title}</p>
        `;
      trendsContainer.appendChild(trendItem);
    });
  }

  /**
   * Handles a category button click by populating the search input and performing a search.
   * @param {string} category - The category to search for.
   */
  function handleCategoryClick(category) {
    searchInput.value = category;
    handleSearch();
  }

  /**
   * Displays the search results or a "no results" message.
   * @param {Array} results - The filtered array of search results.
   */
  function displayResults(results) {
    resultsContainer.innerHTML = "";

    // Display "No results found" message if the results array is empty
    if (!results.length) {
      const query = searchInput.value;
      const randomSuggestion =
        searchableData[Math.floor(Math.random() * searchableData.length)];
      resultsContainer.innerHTML = `
          <div class="text-center text-gray-500 py-8">
              <p>No results found for "${query}"</p>
              <p class="mt-2 text-sm">Try searching for <button id="suggestionBtn" class="font-semibold text-primary hover:underline">${randomSuggestion.title}</button></p>
          </div>`;

      document.getElementById("suggestionBtn").addEventListener("click", () => {
        searchInput.value = randomSuggestion.title;
        handleSearch();
      });
      return;
    }

    const query = searchInput.value.toLowerCase().trim();

    // Render the search results
    results.slice(0, 4).forEach((item) => {
      const resultItem = document.createElement("a");
      resultItem.href = item.url;
      resultItem.className =
        "flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors";

      const isCategoryMatch = item.type.toLowerCase() === query;
      const iconColorClass = isCategoryMatch
        ? item.type === "Course"
          ? "text-primary"
          : "text-secondary"
        : "text-gray-400";

      const iconSvg = icons[item.type];

      resultItem.innerHTML = `
          <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg mr-4">
              ${iconSvg.replace(
                "<svg",
                `<svg class="w-6 h-6 ${iconColorClass}"`
              )}
          </div>
          <div>
              <h3 class="font-semibold text-md text-gray-800">${item.title}</h3>
              <p class="text-sm text-gray-600">${item.description}</p>
          </div>
        `;
      resultsContainer.appendChild(resultItem);
    });
  }

  /**
   * Filters the searchable data based on the user's input and displays the results.
   */
  function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
      resultsContainer.classList.add("hidden");
      initialStateContainer.classList.remove("hidden");
      return;
    }

    initialStateContainer.classList.add("hidden");
    resultsContainer.classList.remove("hidden");

    // Filter the data for a match in title, description, or type
    const filteredData = searchableData.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query)
    );
    displayResults(filteredData);
  }

  // --- SEARCH EVENT LISTENERS ---
  if (openSearchBtn) {
    openSearchBtn.addEventListener("click", openSearch);
  }
  if (closeSearchBtn) {
    closeSearchBtn.addEventListener("click", closeSearch);
  }

  // Close search when clicking the overlay background
  if (searchOverlay) {
    searchOverlay.addEventListener("click", (event) => {
      if (event.target === searchOverlay) {
        closeSearch();
      }
    });
  }

  // Close search on 'Escape' key press
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      searchOverlay &&
      searchOverlay.classList.contains("active")
    ) {
      closeSearch();
    }
  });

  // Handle live search as the user types
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch);
  }
});

/* =============================================
    Image Protection Script
    ============================================= */

/**
 * A memory-efficient way to keep track of images that have already been protected.
 * A WeakSet allows the garbage collector to remove images from memory if they are
 * no longer in the DOM, preventing potential memory leaks.
 */
const protectedImages = new WeakSet();

/**
 * A single, reusable event handler to prevent default actions on images.
 * @param {Event} event - The event object from the listener.
 */
const preventImageActions = (event) => {
  event.preventDefault();
};

/**
 * Applies all necessary protections to a single image element.
 * It prevents context menus, dragging, and long-press menus on mobile.
 * @param {HTMLImageElement} img - The image element to protect.
 */
function protectImage(img) {
  // 1. Check if the image is already protected to avoid duplicate listeners.
  if (protectedImages.has(img)) {
    return;
  }

  // 2. Prevent right-click context menu and dragging.
  img.addEventListener("contextmenu", preventImageActions);
  img.addEventListener("dragstart", preventImageActions);

  // 3. Prevent long-press context menu on mobile devices.
  let touchTimer = null;
  img.addEventListener(
    "touchstart",
    () => {
      // Set a timer that will prevent the default action after 500ms.
      touchTimer = setTimeout(preventImageActions, 500);
    },
    {
      passive: true,
    }
  ); // Use { passive: true } for better scroll performance.

  img.addEventListener("touchend", () => {
    // If the touch ends before 500ms, cancel the timer.
    clearTimeout(touchTimer);
  });

  // 4. Mark the image as protected and add it to our set.
  protectedImages.add(img);
}

/**
 * The MutationObserver efficiently watches for new elements being added to the DOM.
 */
const observer = new MutationObserver((mutations) => {
  // Use for...of loops for cleaner iteration.
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      // We only care about element nodes (not text, comments, etc.).
      if (node.nodeType === Node.ELEMENT_NODE) {
        // If the added node is an image, protect it directly.
        if (node.tagName === "IMG") {
          protectImage(node);
        }
        // Also, find and protect any images *within* the added node.
        node.querySelectorAll("img").forEach(protectImage);
      }
    }
  }
});

// --- SCRIPT INITIALIZATION ---

// 1. Protect all images that exist on the page when the script first runs.
document.querySelectorAll("img").forEach(protectImage);

// 2. Start observing the entire document for any new images that might be added later.
observer.observe(document.body, {
  childList: true, // Watch for nodes being added or removed.
  subtree: true, // Watch all descendants, not just direct children.
});

/* =============================================
    Social Launcher & Custom Cursor
    ============================================= */

document.addEventListener("DOMContentLoaded", () => {
  // --- Social Launcher Logic ---
  const socialLauncher = document.getElementById("social-launcher");
  const closeSocialsBtn = document.getElementById("close-socials-btn");

  // Open the launcher on mouse enter
  socialLauncher.addEventListener("mouseenter", () => {
    socialLauncher.classList.add("is-open");
  });

  // Close the launcher with a button click
  closeSocialsBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent the click from bubbling up
    socialLauncher.classList.remove("is-open");
  });

  // Close the launcher when clicking outside of it
  document.addEventListener("click", (e) => {
    if (!socialLauncher.contains(e.target)) {
      socialLauncher.classList.remove("is-open");
    }
  });

  // --- Custom Cursor Logic ---
  // Check if the device has a fine pointer (e.g., a mouse) before running the script
  if (window.matchMedia("(pointer: fine)").matches) {
    const cursor = document.getElementById("mouse-cursor");

    /**
     * Moves the custom cursor element based on the mouse position.
     * @param {MouseEvent} e - The mouse event object.
     */
    const moveCursor = (e) => {
      const { clientX: x, clientY: y } = e;
      const offsetX = cursor.offsetWidth / 2;
      const offsetY = cursor.offsetHeight / 2;

      let scale = 1.0;
      if (cursor.classList.contains("clicked-state")) {
        scale *= 0.9;
      }

      cursor.style.transform = `translate3d(${x - offsetX}px, ${
        y - offsetY
      }px, 0) scale(${scale})`;
    };

    /**
     * Updates the cursor's class based on the element it's hovering over.
     * @param {Event} e - The event object (mouseover, mousemove, focus).
     */
    const updateCursorState = (e) => {
      const target = e.target;
      // Reset all state classes
      cursor.classList.remove(
        "link-hover",
        "action-hover",
        "typing-active",
        "text-hover"
      );

      const isTyping = document.activeElement.matches("input, textarea");
      const isHoveringInput = target.closest("input, textarea");

      // Apply the appropriate class based on the target element
      if (isTyping && isHoveringInput) {
        cursor.classList.add("typing-active");
      } else if (target.closest("button")) {
        cursor.classList.add("action-hover");
      } else if (target.closest("a")) {
        cursor.classList.add("link-hover");
      } else if (target.closest("h1, h2, p")) {
        cursor.classList.add("text-hover");
      }
    };

    /**
     * Creates a ripple effect div at the click position.
     * @param {MouseEvent} e - The mouse event object.
     */
    const createClickRipple = (e) => {
      const { clientX: x, clientY: y } = e;
      const ripple = document.createElement("div");
      ripple.className = "click-ripple";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    };

    // --- Event Listeners for Custom Cursor ---
    document.addEventListener("mousemove", (e) => {
      moveCursor(e);
      updateCursorState(e);
    });

    document.addEventListener("mouseover", updateCursorState);

    document.addEventListener("mousedown", (e) => {
      cursor.classList.add("clicked-state");
      createClickRipple(e);
    });

    document.addEventListener("mouseup", () => {
      cursor.classList.remove("clicked-state");
    });

    // Listen for focus and blur to toggle typing state
    document.addEventListener("focusin", updateCursorState);
    document.addEventListener("focusout", updateCursorState);
  }
});

/* =============================================
    Mobile Socials Visibility Logic
    ============================================= */

document.addEventListener("DOMContentLoaded", function () {
  // Select the elements
  const socialButton = document.getElementById("social-launcher");
  const contactSection = document.getElementById("contact");

  // Only run the script if both the button and the section exist
  if (socialButton && contactSection) {
    /**
     * Checks if the screen is mobile-sized.
     * @returns {boolean} - True if mobile, false otherwise.
     */
    const isMobile = () => window.innerWidth <= 768;

    // Set up an IntersectionObserver to watch the contact section
    const observer = new IntersectionObserver((entries) => {
      const contactEntry = entries[0];

      // Only apply the logic on mobile screens
      if (isMobile()) {
        if (contactEntry.isIntersecting) {
          socialButton.classList.add("visible");
        } else {
          socialButton.classList.remove("visible");
        }
      }
    });

    // Tell the observer to start watching the contact section
    observer.observe(contactSection);

    // Optional: If the user resizes their browser from mobile to desktop,
    // ensure the button is visible on desktop.
    window.addEventListener("resize", () => {
      if (!isMobile()) {
        socialButton.classList.add("visible");
      }
    });
  }
});

/* =============================================
    Infinite Logo Scroller Script
    ============================================= */

/**
 * This script creates a seamless, responsive, and infinite loop for a logo slider.
 * It precisely calculates the scroll distance to prevent any "jump" when the animation loops.
 */
const initInfiniteScroller = () => {
  const scroller = document.querySelector(".animate-scroll");

  // Exit if the scroller element doesn't exist
  if (!scroller) {
    return;
  }

  // --- 1. ONE-TIME SETUP ---
  const originalLogos = Array.from(scroller.children);

  // Mark the initial logos as "original" so we can precisely measure them later.
  originalLogos.forEach((logo) => logo.setAttribute("data-original", "true"));

  // Duplicate all original logos to create the seamless loop.
  originalLogos.forEach((logo) => {
    const duplicate = logo.cloneNode(true);
    // Remove the original marker from clones and hide them for accessibility.
    duplicate.removeAttribute("data-original");
    duplicate.setAttribute("aria-hidden", true);
    scroller.appendChild(duplicate);
  });

  // --- 2. PRECISION CALCULATION LOGIC ---
  /**
   * Recalculates and updates the CSS custom property for scroll distance.
   */
  const updateAnimation = () => {
    const originalItems = scroller.querySelectorAll('[data-original="true"]');

    // Get the computed style to find the exact gap size in pixels.
    const gap = parseInt(getComputedStyle(scroller).gap) || 0;

    // Calculate the total width of all original logos.
    const totalLogosWidth = Array.from(originalItems).reduce(
      (total, item) => total + item.offsetWidth,
      0
    );

    // The perfect distance is the width of all logos plus all the gaps between them.
    const scrollDistance = totalLogosWidth + gap * originalItems.length;

    scroller.style.setProperty("--scroll-distance", `${scrollDistance}px`);
  };

  // --- 3. INITIALIZATION AND EVENT LISTENERS ---
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Only run the animation for users who don't prefer reduced motion
  if (!prefersReducedMotion) {
    // Run the precision calculation for the first time.
    updateAnimation();

    // Use ResizeObserver to efficiently recalculate when the element's size changes.
    const resizeObserver = new ResizeObserver(() => updateAnimation());
    resizeObserver.observe(scroller);

    // Mark the scroller as animated to apply CSS animation rules
    scroller.setAttribute("data-animated", "true");
  }
};

window.addEventListener("load", initInfiniteScroller);

/* =============================================
    Pricing Section Logic
    ============================================= */

// This function will only run if the pricing section elements exist on the page
const initPricingSection = () => {
  // --- DOM Element References for Pricing ---
  const servicesBtn = document.getElementById("services-btn");
  if (!servicesBtn) return; // Exit if the pricing component isn't on this page

  const coursesBtn = document.getElementById("courses-btn");
  const servicesContent = document.getElementById("services-content");
  const coursesContent = document.getElementById("courses-content");
  const usdBtn = document.getElementById("usd-btn");
  const tzsBtn = document.getElementById("tzs-btn");
  const categoryToggle = document.getElementById("category-toggle");
  const currencyToggle = document.getElementById("currency-toggle");
  const TZS_TO_USD_RATE = 2600;

  // --- PRICING FUNCTIONS ---

  /**
   * Animates a numerical value change for a given element.
   * @param {HTMLElement} element - The element to update.
   * @param {number} start - The starting value.
   * @param {number} end - The ending value.
   * @param {number} duration - The duration of the animation in ms.
   * @param {boolean} isTzs - True if the currency is TZS.
   */
  const animateValue = (element, start, end, duration, isTzs) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);
      element.textContent = isTzs
        ? currentValue.toLocaleString("en-US")
        : `$${currentValue}`;
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  };

  /**
   * Updates all pricing card values to the selected currency.
   * @param {string} currency - "USD" or "TZS".
   */
  const updatePrices = (currency) => {
    document.querySelectorAll("[data-price-tzs]").forEach((el) => {
      const tzsPrice = parseFloat(el.getAttribute("data-price-tzs"));
      const priceValueEl = el.querySelector(".price-value");
      const currencyEl = el.querySelector(".price-currency");
      if (!priceValueEl || !currencyEl) return;

      // Get the current value from the text content to use as the animation start point
      const currentText = priceValueEl.textContent.replace(/[^0-9]/g, "");
      const startValue = parseInt(currentText, 10) || 0;

      if (currency === "USD") {
        const usdPrice = tzsPrice / TZS_TO_USD_RATE;
        const roundedUsd = Math.round(usdPrice / 5) * 5;
        animateValue(priceValueEl, startValue, roundedUsd, 300, false);
        currencyEl.textContent = "USD";
      } else {
        animateValue(priceValueEl, startValue, tzsPrice, 300, true);
        currencyEl.textContent = "TZS";
      }
    });
  };

  /**
   * Handles the visibility and animation of content panels when a category is toggled.
   * @param {HTMLElement} activeBtn - The button that was clicked.
   * @param {HTMLElement} inactiveBtn - The other button.
   * @param {HTMLElement} activeContent - The content panel to show.
   * @param {HTMLElement} inactiveContent - The content panel to hide.
   * @param {HTMLElement} toggleWrapper - The parent toggle wrapper to update.
   * @param {string} activeToggleValue - The data-active value to set on the wrapper.
   */
  const toggleContent = (
    activeBtn,
    inactiveBtn,
    activeContent,
    inactiveContent,
    toggleWrapper,
    activeToggleValue
  ) => {
    activeBtn.classList.add("active");
    inactiveBtn.classList.remove("active");
    toggleWrapper.setAttribute("data-active", activeToggleValue);

    // Hide the currently active panel and show the new one
    document
      .querySelector(".pricing-content-panel.active")
      ?.classList.remove("active");
    activeContent.classList.add("active");

    // Re-trigger CSS animation for the cards in the new panel
    activeContent.querySelectorAll(".pricing-card").forEach((card) => {
      card.style.animation = "none";
      card.offsetHeight; // Trigger reflow
      card.style.animation = null;
    });
  };

  // --- PRICING EVENT LISTENERS ---

  // Category toggle buttons
  servicesBtn.addEventListener("click", () =>
    toggleContent(
      servicesBtn,
      coursesBtn,
      servicesContent,
      coursesContent,
      categoryToggle,
      "services"
    )
  );
  coursesBtn.addEventListener("click", () =>
    toggleContent(
      coursesBtn,
      servicesBtn,
      coursesContent,
      servicesContent,
      categoryToggle,
      "courses"
    )
  );

  // Currency toggle buttons
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
};

// Call the function to initialize the pricing section logic
initPricingSection();

document.addEventListener("DOMContentLoaded", function () {
  const initPricingSection = () => {
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
    const animateValue = (element, start, end, duration, isTzs) => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        element.textContent = isTzs
          ? currentValue.toLocaleString("en-US")
          : `$${currentValue}`;
        if (progress < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };
    const updatePrices = (currency) => {
      document.querySelectorAll("[data-price-tzs]").forEach((el) => {
        const tzsPrice = parseFloat(el.getAttribute("data-price-tzs"));
        const priceValueEl = el.querySelector(".price-value");
        const currencyEl = el.querySelector(".price-currency");
        if (!priceValueEl || !currencyEl) return;
        const currentText = priceValueEl.textContent.replace(/[^0-9]/g, "");
        const startValue = parseInt(currentText, 10) || 0;
        if (currency === "USD") {
          const usdPrice = tzsPrice / TZS_TO_USD_RATE;
          const roundedUsd = Math.round(usdPrice / 5) * 5;
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
      inactiveContent,
      toggleWrapper,
      activeToggleValue
    ) => {
      activeBtn.classList.add("active");
      inactiveBtn.classList.remove("active");
      toggleWrapper.setAttribute("data-active", activeToggleValue);
      document
        .querySelector(".pricing-content-panel.active")
        ?.classList.remove("active");
      activeContent.classList.add("active");
      activeContent.querySelectorAll(".pricing-card").forEach((card) => {
        card.style.animation = "none";
        card.offsetHeight;
        card.style.animation = null;
      });
    };
    servicesBtn.addEventListener("click", () =>
      toggleContent(
        servicesBtn,
        coursesBtn,
        servicesContent,
        coursesContent,
        categoryToggle,
        "services"
      )
    );
    coursesBtn.addEventListener("click", () =>
      toggleContent(
        coursesBtn,
        servicesBtn,
        coursesContent,
        servicesContent,
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
  };
  initPricingSection();
});

/* =============================================
    Business Hours & Status
    ============================================= */

// This self-invoking function prevents conflicts with other scripts
(function () {
  /**
   * Updates the business status (open/closed) based on the current time and a
   * configured timezone and business hours.
   */
  function updateBusinessStatus() {
    // --- Configuration ---
    const timeZone = "Africa/Dar_es_Salaam"; // EAT timezone for Dodoma
    const businessHours = {
      1: [8, 18], // Monday: 8 AM to 6 PM (18:00)
      2: [8, 18], // Tuesday
      3: [8, 18], // Wednesday
      4: [8, 18], // Thursday
      5: [8, 18], // Friday
    };
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // --- Get Current Time Info ---
    // Get the current date and time in the specified timezone
    const now = new Date(
      new Date().toLocaleString("en-US", {
        timeZone,
      })
    );
    const currentDay = now.getDay();
    const currentHour = now.getHours();

    // --- Determine Status ---
    let isOpen = false;
    let opensAtContent = "";
    let closesAtContent = "";

    const hoursToday = businessHours[currentDay];
    if (hoursToday) {
      const [openHour, closeHour] = hoursToday;
      // Check if the current time is within today's business hours
      if (currentHour >= openHour && currentHour < closeHour) {
        isOpen = true;
        const ampm = closeHour >= 12 ? "PM" : "AM";
        const displayHour = closeHour % 12 || 12;
        closesAtContent = `Closes at ${displayHour}:00 ${ampm}`;
      } else if (currentHour < openHour) {
        // Business is not yet open for the day
        const ampm = openHour >= 12 ? "PM" : "AM";
        const displayHour = openHour % 12 || 12;
        opensAtContent = `Opens Today at ${displayHour}:00 ${ampm}`;
      }
    }

    // If still closed, find the next open day
    if (!isOpen && opensAtContent === "") {
      let nextOpenDay = null;
      let nextOpenTime = "";
      let searchDay = currentDay;
      for (let i = 0; i < 7; i++) {
        searchDay = (searchDay + 1) % 7;
        if (businessHours[searchDay]) {
          nextOpenDay = searchDay;
          const [openHour] = businessHours[searchDay];
          const ampm = openHour >= 12 ? "PM" : "AM";
          const displayHour = openHour % 12 || 12;
          nextOpenTime = `${displayHour}:00 ${ampm}`;
          break;
        }
      }

      if (nextOpenDay !== null) {
        const dayLabel =
          nextOpenDay === (now.getDay() + 1) % 7
            ? "Tomorrow"
            : dayNames[nextOpenDay];
        opensAtContent = `Opens ${dayLabel} at ${nextOpenTime}`;
      } else {
        opensAtContent = `Closed for the week`;
      }
    }

    // --- Prepare Content for Display ---
    const container = document.getElementById("business-status-container");
    if (!container) return;

    // Render the appropriate status message based on whether the business is open
    if (isOpen) {
      container.innerHTML = `
          <div class="bg-green-50 text-green-800 p-6 rounded-2xl flex flex-col items-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-10 h-10 mb-3">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <line x1="9" x2="9.01" y1="9" y2="9"/>
                  <line x1="15" x2="15.01" y1="9" y2="9"/>
              </svg>
              <p class="font-bold text-xl">Now Open</p>
              <p class="text-sm text-gray-600 mt-1">${closesAtContent}</p>
          </div>
        `;
    } else {
      container.innerHTML = `
          <div class="bg-red-50 p-6 rounded-2xl flex flex-col items-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-10 h-10 mb-3 text-red-500">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
                  <line x1="9" x2="9.01" y1="9" y2="9"/>
                  <line x1="15" x2="15.01" y1="9" y2="9"/>
              </svg>
              <p class="font-bold text-xl text-red-500">Currently Closed</p>
              <p class="text-sm text-gray-600 mt-1">${opensAtContent}</p>
          </div>
        `;
    }
  }

  // Initial call and set an interval to update the status every minute
  updateBusinessStatus();
  setInterval(updateBusinessStatus, 60000);
})();
