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
