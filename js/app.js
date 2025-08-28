//  Complete E-commerce functionality

// ===== GLOBAL MODAL FUNCTIONS =====

// Checkout modal functions
window.closeCheckoutModal = function () {
  const modal = document.querySelector(".modal-overlay");
  if (modal) {
    document.body.removeChild(modal);
  }
  window.currentCheckoutModal = null;
};

// Success modal functions
window.closeSuccessModal = function () {
  const modal = document.querySelector(".modal-overlay");
  if (modal) {
    document.body.removeChild(modal);
  }
  // Return to home view
  navigateTo("home-view");
};

// Confirmation modal functions
window.closeConfirmModal = function () {
  if (window.currentConfirmModal) {
    document.body.removeChild(window.currentConfirmModal);
    window.currentConfirmModal = null;
  }
};

window.confirmPurchase = function () {
  if (window.currentConfirmModal) {
    document.body.removeChild(window.currentConfirmModal);
    window.currentConfirmModal = null;
  }

  // Remove checkout modal
  if (window.currentCheckoutModal) {
    document.body.removeChild(window.currentCheckoutModal);
    window.currentCheckoutModal = null;
  }

  // Process the payment
  processPayment();

  // Show success message
  showSuccessMessage();
};

// ===== STORAGE FUNCTIONS =====
const Storage = {
  // Users operations
  getUsers: function () {
    return JSON.parse(localStorage.getItem("users")) || [];
  },

  saveUsers: function (users) {
    localStorage.setItem("users", JSON.stringify(users));
  },

  addUser: function (user) {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  },

  findUserByEmail: function (email) {
    const users = this.getUsers();
    return users.find((user) => user.email === email);
  },

  // Current user operations
  getCurrentUser: function () {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  },

  setCurrentUser: function (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  },

  clearCurrentUser: function () {
    localStorage.removeItem("currentUser");
  },

  // Cart operations
  getCart: function (userEmail) {
    return JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];
  },

  saveCart: function (userEmail, cart) {
    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cart));
  },

  clearCart: function (userEmail) {
    localStorage.removeItem(`cart_${userEmail}`);
  },

  // Product operations
  getProducts: function () {
    return [
      {
        id: 1,
        name: "Wireless Headphones",
        price: 129.99,
        image: "imgs/Wireless Headphones.avif",
        category: "Electronics",
        size: "M",
        stock: 15,
      },
      {
        id: 2,
        name: "Smart Watch Series 5",
        price: 249.99,
        image: "imgs/Smart Watch Series 5.avif",
        category: "Electronics",
        size: "L",
        stock: 8,
      },
      {
        id: 3,
        name: "Running Shoes",
        price: 89.99,
        image: "imgs/Running Shoes.avif",
        category: "Footwear",
        size: "42",
        stock: 20,
      },
      {
        id: 4,
        name: "Casual T-Shirt",
        price: 29.99,
        image: "imgs/Casual T-Shirt.avif",
        category: "Clothing",
        size: "L",
        stock: 12,
      },
      {
        id: 5,
        name: "Designer Sunglasses",
        price: 79.99,
        image: "imgs/Designer Sunglasses.avif",
        category: "Accessories",
        size: "One Size",
        stock: 18,
      },
      {
        id: 6,
        name: "Leather Wallet",
        price: 49.99,
        image: "imgs/Leather Wallet.avif",
        category: "Accessories",
        size: "One Size",
        stock: 10,
      },
      {
        id: 7,
        name: "Fitness Tracker",
        price: 59.99,
        image: "imgs/Fitness Tracker.avif",
        category: "Electronics",
        size: "S",
        stock: 14,
      },
      {
        id: 8,
        name: "Denim Jacket",
        price: 79.99,
        image: "imgs/Denim Jacket.jpg",
        category: "Clothing",
        size: "M",
        stock: 7,
      },
    ];
  },
};

// ===== BROWSER NAVIGATION HANDLING =====

// Initialize history on page load
window.addEventListener("load", function () {
  // Set initial history state based on current visible view
  if (!document.getElementById("home-view").classList.contains("hidden")) {
    window.history.replaceState({ view: "home" }, "", "#home");
  } else if (
    !document.getElementById("cart-view").classList.contains("hidden")
  ) {
    window.history.replaceState({ view: "cart" }, "", "#cart");
  } else if (
    !document.getElementById("login-view").classList.contains("hidden")
  ) {
    window.history.replaceState({ view: "login" }, "", "#login");
  } else if (
    !document.getElementById("contact-view").classList.contains("hidden")
  ) {
    window.history.replaceState({ view: "contact" }, "", "#contact");
  } else if (
    !document.getElementById("register-view").classList.contains("hidden")
  ) {
    window.history.replaceState({ view: "register" }, "", "#register");
  } else {
    window.history.replaceState({ view: "home" }, "", "#home");
  }
});

// Router: listen for history changes
window.addEventListener("popstate", function (event) {
  let targetView = event.state?.view || "home";

  if (!event.state && window.location.hash) {
    targetView = window.location.hash.substring(1); // remove "#"
  }

  const viewMap = {
    home: "home-view",
    cart: "cart-view",
    login: "login-view",
    contact: "contact-view",
    register: "register-view",
  };

  const targetViewId = viewMap[targetView] || "home-view";

  // Hide all views
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.add("hidden");
  });

  // Show target view
  const targetElement = document.getElementById(targetViewId);
  if (targetElement) {
    targetElement.classList.remove("hidden");
  } else {
    document.getElementById("home-view").classList.remove("hidden");
  }

  // Call init functions if needed
  if (targetViewId === "home-view" && typeof initHomeView === "function") {
    initHomeView();
  } else if (
    targetViewId === "cart-view" &&
    typeof initCartView === "function"
  ) {
    initCartView();
  } else if (
    targetViewId === "contact-view" &&
    typeof initContactView === "function"
  ) {
    initContactView();
  }

  updateUI();
});

function navigateTo(viewId) {
  const viewMap = {
    "home-view": "home",
    "cart-view": "cart",
    "login-view": "login",
    "contact-view": "contact",
    "register-view": "register",
  };

  const state = { view: viewMap[viewId] || "home" };

  // Only push if this is a new state (prevents stacking duplicates)
  if (history.state?.view !== state.view) {
    history.pushState(state, "", "#" + state.view);
  }

  // Only trigger router, do NOT push again
  window.dispatchEvent(new PopStateEvent("popstate", { state }));
}

// Attach to all links with data-view
document.querySelectorAll("[data-view]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    const viewId = el.getAttribute("data-view");
    navigateTo(viewId);
  });
});

// ===== UTILITY FUNCTIONS =====

function switchView(hideView, showView) {
  // Check if we're already on the target view
  if (hideView === showView) {
    return;
  }

  // Hide current view
  const currentViewElement = document.getElementById(hideView);
  if (currentViewElement) {
    currentViewElement.classList.add("hidden");
  }

  // Show new view
  const newViewElement = document.getElementById(showView);
  if (newViewElement) {
    newViewElement.classList.remove("hidden");
  }

  // Initialize the view if needed
  if (showView === "cart-view") {
    setTimeout(() => {
      if (typeof initCartView === "function") initCartView();
    }, 50);
  } else if (showView === "home-view") {
    setTimeout(() => {
      if (typeof initHomeView === "function") initHomeView();
    }, 50);
  } else if (showView === "contact-view") {
    setTimeout(() => {
      if (typeof initContactView === "function") initContactView();
    }, 50);
  }

  updateUI();
}

//  handle contact view username
function updateUI() {
  const currentUser = Storage.getCurrentUser();
  const usernameElements = document.querySelectorAll(
    "#username, #cart-username, #contact-username"
  );

  if (currentUser) {
    // Update username display
    usernameElements.forEach((el) => {
      if (el) el.textContent = currentUser.name;
    });

    // Update cart count
    updateCartCount();
  } else {
    // Set to Guest if no user
    usernameElements.forEach((el) => {
      if (el) el.textContent = "Guest";
    });
  }
}

// Add contact view initialization function

function initContactView() {
  updateUI();

  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  if (contactForm.dataset.contactInit === "true") return;
  contactForm.dataset.contactInit = "true";

  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const messageInput = document.getElementById("contact-message");

  // === MAX LENGTHS ===
  const MAX_NAME = 50;
  const MAX_EMAIL = 100;
  const MAX_MESSAGE = 550;

  // helper to show error under a field
  function showError(input, message) {
    input.style.borderColor = "red";
    let errorDiv = input.parentNode.querySelector(".error-message");
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.style.color = "red";
      errorDiv.style.fontSize = "0.875rem";
      errorDiv.style.marginTop = "4px";
      input.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
  }

  // helper to clear error
  function clearError(input) {
    input.style.borderColor = "";
    let errorDiv = input.parentNode.querySelector(".error-message");
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  // === Validation functions ===
  function validateName() {
    const value = nameInput.value.trim();
    if (!/^[A-Za-z\s]{3,}$/.test(value)) {
      showError(
        nameInput,
        "Name must be at least 3 letters (English letters and spaces only)."
      );
      return false;
    }
    if (value.length > MAX_NAME) {
      showError(nameInput, `Name cannot exceed ${MAX_NAME} characters.`);
      return false;
    }
    clearError(nameInput);
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showError(emailInput, "Please enter a valid email address.");
      return false;
    }
    if (value.length > MAX_EMAIL) {
      showError(emailInput, `Email cannot exceed ${MAX_EMAIL} characters.`);
      return false;
    }
    clearError(emailInput);
    return true;
  }

  function validateMessage() {
    const value = messageInput.value.trim();
    if (value.length < 10) {
      showError(messageInput, "Message must be at least 10 characters long.");
      return false;
    }
    if (value.length > MAX_MESSAGE) {
      showError(
        messageInput,
        `Message cannot exceed ${MAX_MESSAGE} characters.`
      );
      return false;
    }
    clearError(messageInput);
    return true;
  }

  // === Dynamic validation (real-time) ===
  nameInput.addEventListener("input", validateName);
  emailInput.addEventListener("input", validateEmail);
  messageInput.addEventListener("input", validateMessage);

  // === Submit handling ===
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const isValid = validateName() && validateEmail() && validateMessage();
    if (!isValid) return;

    // Show success popup using reusable function
     showPopup(
    "📩 Message Sent!",
    `
    <div style="text-align:center;">
      <div class="text-success mb-2">
        <i class="fas fa-check-circle" style="font-size: 2rem; color: green;"></i>
      </div>
      <p style="font-size:0.9rem; margin: 0;">Thank you for your message!<br>We will get back to you soon.</p>
    </div>
    `,
    () => {
      // On OK → reset form and clear errors
      contactForm.reset();
      clearError(nameInput);
      clearError(emailInput);
      clearError(messageInput);
    },
    false // showCancel = false → only OK button appears
  );







  // Compact styling for OK button
  const okBtn = document.getElementById("popupOkBtn");
  if (okBtn) {
    okBtn.textContent = "OK";
    okBtn.style.fontSize = "0.85rem";
    okBtn.style.padding = "6px 14px";
  }
  });
}

function updateCartCount() {
  const currentUser = Storage.getCurrentUser();
  if (currentUser) {
    const cart = Storage.getCart(currentUser.email);
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    const cartCountElements = document.querySelectorAll(".cart-count");
    cartCountElements.forEach((el) => {
      el.textContent = totalItems;
    });
  }
}

// ===== LOGIN FUNCTIONALITY =====
function initLogin() {
  const loginForm = document.getElementById("login-form");
  const showRegisterBtn = document.getElementById("show-register");
  const loginMessage = document.getElementById("login-message");

  if (!loginForm || !showRegisterBtn) return;

  // Switch to register view
  showRegisterBtn.addEventListener("click", function (e) {
    e.preventDefault();
    switchView("login-view", "register-view");
  });

  // Login form submission
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Validate inputs
    if (!email || !password) {
      showLoginMessage("Please fill in all fields", "error");
      return;
    }

    // Check if user exists
    const user = Storage.findUserByEmail(email);

    if (!user) {
      showLoginMessage("User not found. Please register first.", "error");
      return;
    }

    // Check password
    if (user.password !== password) {
      showLoginMessage("Incorrect password. Please try again.", "error");
      return;
    }

    // Login successful
    Storage.setCurrentUser(user);
    navigateTo("home-view");
    updateUI();
  });

  function showLoginMessage(message, type) {
    if (!loginMessage) return;

    loginMessage.textContent = message;
    loginMessage.classList.remove("hidden", "alert-success", "alert-danger");

    if (type === "error") {
      loginMessage.classList.add("alert-danger");
    } else {
      loginMessage.classList.add("alert-success");
    }

    loginMessage.classList.remove("hidden");

    // Hide message after 3 seconds
    setTimeout(() => {
      loginMessage.classList.add("hidden");
    }, 3000);
  }

  // Check if user is already logged in
  const currentUser = Storage.getCurrentUser();
  if (currentUser) {
    switchView("login-view", "home-view");
    updateUI();
  }
}

// ===== REGISTRATION FUNCTIONALITY =====

//Alaa
function showPopup(
  title,
  message,
  onOk = null,
  showCancel = false,
  onCancel = null,
  okText = "OK",
  cancelText = "Cancel"
) {
  const popup = document.getElementById("successPopup");
  const popupTitle = document.getElementById("popupTitle");
  const popupMessage = document.getElementById("popupMessage");
  const popupOkBtn = document.getElementById("popupOkBtn");
  const popupCancelBtn = document.getElementById("popupCancelBtn");

  // Set popup title and message
  popupTitle.textContent = title;
  popupMessage.innerHTML = message.replace(/\n/g, "<br>");

  // Show/hide cancel button
  popupCancelBtn.style.display = showCancel ? "inline-block" : "none";

  // Popup overlay styling
  popup.style.cssText = `
    display: flex;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.5);
    z-index: 10000;
  `;

  // Popup content styling
  const popupContent = popup.querySelector(".popup-box");
  if (popupContent) {
    popupContent.style.cssText = `
      background: #fff;
      padding: 20px 25px;
      border-radius: 12px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 6px 25px rgba(0,0,0,0.3);
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 12px;
    `;
  }

  // Title styling
  popupTitle.style.cssText = `
    font-size: 1.4rem;
    font-weight: 600;
    margin: 0;
  `;

  // Message styling
  popupMessage.style.cssText = `
    font-size: 1rem;
    color: #555;
    margin: 0;
    line-height: 1.5;
  `;

  // Button styling
  [popupOkBtn, popupCancelBtn].forEach(btn => {
    btn.style.cssText = `
      padding: 10px 22px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.95rem;
      margin: 5px;
      transition: background 0.2s ease;
    `;
  });

  // Specific colors
  popupOkBtn.style.background = "#0d6efd";
  popupOkBtn.style.color = "#fff";
  popupOkBtn.addEventListener("mouseover", () => popupOkBtn.style.background = "#0b5ed7");
  popupOkBtn.addEventListener("mouseout", () => popupOkBtn.style.background = "#0d6efd");

  popupCancelBtn.style.background = "#6c757d";
  popupCancelBtn.style.color = "#fff";
  popupCancelBtn.addEventListener("mouseover", () => popupCancelBtn.style.background = "#5c636a");
  popupCancelBtn.addEventListener("mouseout", () => popupCancelBtn.style.background = "#6c757d");


// Reset old listeners
const newOkBtn = popupOkBtn.cloneNode(true);
popupOkBtn.parentNode.replaceChild(newOkBtn, popupOkBtn);
const newCancelBtn = popupCancelBtn.cloneNode(true);
popupCancelBtn.parentNode.replaceChild(newCancelBtn, popupCancelBtn);

// Set button texts
newOkBtn.textContent = okText;
newCancelBtn.textContent = cancelText;

// Show/hide cancel button on the cloned element
newCancelBtn.style.display = showCancel ? "inline-block" : "none";

// Button actions
newOkBtn.addEventListener("click", () => {
  popup.style.display = "none";
  if (onOk) onOk();
});

newCancelBtn.addEventListener("click", () => {
  popup.style.display = "none";
  if (onCancel) onCancel();
});


}




function initRegistration() {
  const registerForm = document.getElementById("register-form");
  const showLoginBtn = document.getElementById("show-login");

  if (!registerForm || !showLoginBtn) return;

  // Switch to login view
  showLoginBtn.addEventListener("click", function (e) {
    e.preventDefault();
    navigateTo("login-view");
  });

  // Inputs
  const nameInput = document.getElementById("register-name");
  const emailInput = document.getElementById("register-email");
  const passwordInput = document.getElementById("register-password");
  const confirmPasswordInput = document.getElementById(
    "register-confirm-password"
  );

  // Max lengths
  const MAX_NAME = 25;
  const MAX_EMAIL = 35;
  const MAX_PASSWORD = 35;

  // Validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,}$/;

  // === Validation Functions ===
  function validateName() {
    nameInput.value = nameInput.value.slice(0, MAX_NAME);
    if (!/^[A-Za-z\s]{3,}$/.test(nameInput.value.trim())) {
      showValidationError(nameInput, "Name must be at least 3 characters");
      return false;
    } else {
      clearValidationError(nameInput);
      return true;
    }
  }

  function validateEmail() {
    emailInput.value = emailInput.value.slice(0, MAX_EMAIL);
    if (!emailRegex.test(emailInput.value.trim())) {
      showValidationError(emailInput, "Please enter a valid email address");
      return false;
    }
    const existingUser = Storage.findUserByEmail(emailInput.value.trim());
    if (existingUser) {
      showValidationError(emailInput, "This email is already registered");
      return false;
    }
    clearValidationError(emailInput);
    return true;
  }

  function validatePassword() {
    passwordInput.value = passwordInput.value.slice(0, MAX_PASSWORD);
    if (!passwordRegex.test(passwordInput.value)) {
      showValidationError(
        passwordInput,
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return false;
    } else {
      clearValidationError(passwordInput);
      return true;
    }
  }

  function validateConfirmPassword() {
    confirmPasswordInput.value = confirmPasswordInput.value.slice(
      0,
      MAX_PASSWORD
    );
    if (
      passwordInput.value !== confirmPasswordInput.value ||
      confirmPasswordInput.value === ""
    ) {
      showValidationError(confirmPasswordInput, "Passwords do not match");
      return false;
    } else {
      clearValidationError(confirmPasswordInput);
      return true;
    }
  }

  // === Live validation while typing ===
  nameInput.addEventListener("input", validateName);
  emailInput.addEventListener("input", validateEmail);
  passwordInput.addEventListener("input", () => {
    validatePassword();
    validateConfirmPassword(); // re-check confirm if password changes
  });
  confirmPasswordInput.addEventListener("input", validateConfirmPassword);

  // === Form submission ===
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const validName = validateName();
    const validEmail = validateEmail();
    const validPassword = validatePassword();
    const validConfirm = validateConfirmPassword();

    if (validName && validEmail && validPassword && validConfirm) {
      const newUser = {
        id: Date.now(),
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value,
      };

      Storage.addUser(newUser);

      // Show popup
      const popup = document.getElementById("successPopup");
      const popupOkBtn = document.getElementById("popupOkBtn");

      // When OK clicked → redirect to login
      showPopup(
        "🎉 Registration Successful!",
        "Please login with your credentials.",
        () => {
          navigateTo("login-view");
        }
      );

      registerForm.reset();

      // reset validation states
      [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(
        clearValidationError
      );
    }
  });


  
  const togglePasswordBtn = document.getElementById("toggle-password");
  const toggleConfirmBtn = document.getElementById("toggle-confirm-password");

  togglePasswordBtn.addEventListener("click", () => {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    togglePasswordBtn.textContent = type === "password" ? "Show" : "Hide";
  });

  toggleConfirmBtn.addEventListener("click", () => {
    const type =
      confirmPasswordInput.getAttribute("type") === "password"
        ? "text"
        : "password";
    confirmPasswordInput.setAttribute("type", type);
    toggleConfirmBtn.textContent = type === "password" ? "Show" : "Hide";
  });

  function showValidationError(input, message) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");

    const container = input.closest(".mb-3");
    let feedback = null;

    if (input.parentElement.classList.contains("input-group")) {
      feedback = container.querySelector(".invalid-feedback");
    } else {
      feedback = input.nextElementSibling;
    }

    if (feedback && feedback.classList.contains("invalid-feedback")) {
      feedback.textContent = message;
      feedback.style.display = "block";
    }
  }

  function clearValidationError(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");

    const container = input.closest(".mb-3");
    let feedback = null;

    if (input.parentElement.classList.contains("input-group")) {
      feedback = container.querySelector(".invalid-feedback");
    } else {
      feedback = input.nextElementSibling;
    }

    if (feedback && feedback.classList.contains("invalid-feedback")) {
      feedback.textContent = "";
      feedback.style.display = "none";
    }
  }
}

// ===== HOME VIEW FUNCTIONALITY =====
function initHomeView() {
  displayProducts(Storage.getProducts());
  updateUI();
  setupHomeEventListeners();
}

function setupHomeEventListeners() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      Storage.clearCurrentUser();
      navigateTo("login-view");
    });
  }

  // Back to top button
  const backToTopBtn = document.querySelector(".back-to-top");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Show/hide back to top button based on scroll position
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.remove("hidden");
      } else {
        backToTopBtn.classList.add("hidden");
      }
    });
  }

  // Filter products
  const filterBtn = document.getElementById("filter-btn");
  if (filterBtn) {
    filterBtn.addEventListener("click", filterProducts);
  }

  const clearFiltersBtn = document.getElementById("clear-filters");
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", clearFilters);
  }

  // Category filters
  document.querySelectorAll(".category-filter").forEach((btn) => {
    btn.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      filterByCategory(category);
    });
  });

  // All products button
  const allProductsBtn = document.getElementById("all-products");
  if (allProductsBtn) {
    allProductsBtn.addEventListener("click", function () {
      displayProducts(Storage.getProducts());
    });
  }
}

function displayProducts(products) {
  const productsContainer = document.getElementById("products-container");
  if (!productsContainer) return;

  productsContainer.innerHTML = "";

  products.forEach((product) => {
    const productCard = `
            <div class="col-md-3 mb-4">
                <div class="card product-card h-100">
                    <img src="${
                      product.image
                    }" class="card-img-top product-image" alt="${product.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text text-primary fw-bold">$${product.price.toFixed(
                          2
                        )}</p>
                        <div class="mt-auto d-flex justify-content-between">
                            <button class="btn btn-outline-primary btn-sm view-details" data-id="${
                              product.id
                            }">
                                Details
                            </button>
                            <button class="btn btn-primary btn-sm add-to-cart" data-id="${
                              product.id
                            }">
                                <i class="fas fa-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    productsContainer.innerHTML += productCard;
  });

  // Add event listeners to product buttons
  document.querySelectorAll(".view-details").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const productId = parseInt(this.getAttribute("data-id"));
      showProductDetails(productId);
    });
  });

  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const productId = parseInt(this.getAttribute("data-id"));
      addToCart(productId, 1);
    });
  });
}

// =========================
// Add to Cart Function
// =========================
function addToCart(productId, quantity) {
  console.log("Adding to cart:", productId, quantity);

  const currentUser = Storage.getCurrentUser();
  if (!currentUser) {
    showPopup(
      "⚠️ Login Required",
      "<p>Please log in to add items to your cart.</p>",
      () => navigateTo("login-view"),
      false
    );
    return;
  }

  const product = Storage.getProducts().find((p) => p.id === productId);
  if (!product) {
    showPopup("❌ Error", "<p>Product not found!</p>");
    return;
  }

  if (quantity < 1 || quantity > product.stock) {
    showPopup(
      "⚠️ Invalid Quantity",
      `<p>Please enter a quantity between 1 and ${product.stock}.</p>`
    );
    return;
  }

  const cart = Storage.getCart(currentUser.email);
  const existingItemIndex = cart.findIndex(
    (item) => item.productId === productId
  );

  if (existingItemIndex !== -1) {
    if (cart[existingItemIndex].quantity + quantity > product.stock) {
      showPopup(
        "⚠️ Stock Limit",
        `<p>You cannot add more than ${product.stock} items of this product.</p>`
      );
      return;
    }
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.size,
      quantity: quantity,
    });
  }

  Storage.saveCart(currentUser.email, cart);
  updateCartCount();

  // Success popup with OK & Purchase Now buttons
  const totalPrice = (product.price * quantity).toFixed(2);
  showPopup(
    "🛒 Product Added!",
    `
      <div style="text-align:center;">
        <p><strong>${product.name}</strong> (x${quantity})</p>
        <p>Total: <strong>$${totalPrice}</strong></p>
        <p class="text-muted">This item has been added to your cart.<br>You can continue shopping or proceed to purchase.</p>
      </div>
    `,
    () => {
      console.log("OK clicked → continue shopping");
    },
    true,                     // show cancel button
    () => navigateTo("cart-view"), // Purchase Now action
    "OK",                     // OK button text
    "Purchase Now"            // Cancel button text
  );
}

// =========================
// Add to Cart from Modal
// =========================
window.addToCartFromModal = function (productId) {
  const quantityInput = document.getElementById("product-quantity");
  if (!quantityInput) return;

  const quantity = parseInt(quantityInput.value);
  quantityInput.setAttribute("max", quantity);

  if (isNaN(quantity) || quantity < 1) {
    showPopup("⚠️ Invalid Quantity", "<p>Please enter a valid quantity.</p>");
    return;
  }

  // Close the modal
  const modal = document.querySelector(".modal-overlay");
  if (modal) document.body.removeChild(modal);

  // Add to cart
  addToCart(productId, quantity);
};

// =========================
// Show Product Details Modal
// =========================
function showProductDetails(productId) {
  const product = Storage.getProducts().find((p) => p.id === productId);
  if (!product) return;

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;

  modal.innerHTML = `
        <div class="modal-content" style="background: white; padding: 20px; border-radius: 8px; width: 90%; max-width: 800px;">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3>Product Details</h3>
                <button type="button" class="btn-close" id="close-modal">X</button>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <img src="${product.image}" class="img-fluid rounded" alt="${product.name}">
                </div>
                <div class="col-md-6">
                    <h4>${product.name}</h4>
                    <p class="text-muted">${product.category}</p>
                    <h4 class="text-primary">$${product.price.toFixed(2)}</h4>
                    <p><strong>Availability:</strong> ${product.stock} in stock</p>
                    <p><strong>Size:</strong> ${product.size}</p>
                    <div class="d-flex align-items-center mb-3">
                        <label for="product-quantity" class="me-2 fw-bold">Quantity:</label>
                        <input type="number" id="product-quantity" class="form-control" min="1" max="${product.stock}" value="1" style="width: 80px;">
                    </div>
                    <button class="btn btn-primary w-100" onclick="window.addToCartFromModal(${productId})">
                        <i class="fas fa-cart-plus me-2"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  const closeModal = () => document.body.removeChild(modal);

  modal.querySelector("#close-modal").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  modal.querySelector(".modal-content").addEventListener("click", (e) => e.stopPropagation());
}




















function filterProducts() {
  const priceFilter = document.getElementById("price-filter").value;
  const sizeFilter = document.getElementById("size-filter").value;
  const categoryFilter = document.getElementById("category-filter").value;

  let filteredProducts = Storage.getProducts();

  if (priceFilter) {
    if (priceFilter === "0-50") {
      filteredProducts = filteredProducts.filter((p) => p.price < 50);
    } else if (priceFilter === "50-100") {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= 50 && p.price <= 100
      );
    } else if (priceFilter === "100-200") {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= 100 && p.price <= 200
      );
    } else if (priceFilter === "200+") {
      filteredProducts = filteredProducts.filter((p) => p.price > 200);
    }
  }

  if (sizeFilter) {
    filteredProducts = filteredProducts.filter((p) => p.size === sizeFilter);
  }

  if (categoryFilter) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === categoryFilter
    );
  }

  displayProducts(filteredProducts);
}

function filterByCategory(category) {
  const filteredProducts = Storage.getProducts().filter(
    (p) => p.category === category
  );
  displayProducts(filteredProducts);
}

function clearFilters() {
  document.getElementById("price-filter").value = "";
  document.getElementById("size-filter").value = "";
  document.getElementById("category-filter").value = "";
  displayProducts(Storage.getProducts());
}

// ===== CAROUSEL FUNCTIONALITY =====
function initCarousel() {
  const carousel = document.getElementById("products-slider");
  if (!carousel) return;

  const items = carousel.querySelectorAll(".carousel-item");
  const indicators = carousel.querySelectorAll(".carousel-indicators button");
  const prevButton = carousel.querySelector('[data-slide="prev"]');
  const nextButton = carousel.querySelector('[data-slide="next"]');

  let currentIndex = 0;
  let intervalId = null;

  function showSlide(index) {
    items.forEach((item) => item.classList.remove("active"));
    indicators.forEach((indicator) => indicator.classList.remove("active"));

    items[index].classList.add("active");
    indicators[index].classList.add("active");
    currentIndex = index;
  }

  function nextSlide() {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= items.length) nextIndex = 0;
    showSlide(nextIndex);
  }

  function prevSlide() {
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = items.length - 1;
    showSlide(prevIndex);
  }

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", function () {
      showSlide(index);
      resetInterval();
    });
  });

  if (prevButton) {
    prevButton.addEventListener("click", function () {
      prevSlide();
      resetInterval();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", function () {
      nextSlide();
      resetInterval();
    });
  }

  function startInterval() {
    intervalId = setInterval(nextSlide, 5000);
  }

  function resetInterval() {
    clearInterval(intervalId);
    startInterval();
  }

  startInterval();

  carousel.addEventListener("mouseenter", function () {
    clearInterval(intervalId);
  });

  carousel.addEventListener("mouseleave", function () {
    startInterval();
  });
}

// ===== CART FUNCTIONALITY =====
function initCartView() {
  displayCartItems();
  updateCartSummary();
  updateUI();
  setupCartEventListeners();
}

function setupCartEventListeners() {
  // Checkout button
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    const newCheckoutBtn = checkoutBtn.cloneNode(true); // remove old listeners
    checkoutBtn.replaceWith(newCheckoutBtn);
    newCheckoutBtn.addEventListener("click", showCheckoutModal);
  }

  // Logout from cart view
  const cartLogoutBtn = document.getElementById("cart-logout-btn");
  if (cartLogoutBtn) {
    const newCartLogoutBtn = cartLogoutBtn.cloneNode(true); // remove old listeners
    cartLogoutBtn.replaceWith(newCartLogoutBtn);
    newCartLogoutBtn.addEventListener("click", function () {
      Storage.clearCurrentUser();
      navigateTo("login-view"); // use navigateTo instead of switchView
    });
  }
}

function displayCartItems() {
  const cartContainer = document.getElementById("cart-items-container");
  const currentUser = Storage.getCurrentUser();

  if (!currentUser) {
    cartContainer.innerHTML =
      '<div class="alert alert-info">Please log in to view your cart</div>';
    return;
  }

  const cart = Storage.getCart(currentUser.email);

  if (cart.length === 0) {
    cartContainer.innerHTML =
      '<div class="alert alert-info">Your cart is empty</div>';
    return;
  }

  cartContainer.innerHTML = "";

  cart.forEach((item) => {
    // Get product details to check stock
    const product = Storage.getProducts().find((p) => p.id === item.productId);
    const maxReached = product && item.quantity >= product.stock;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="${item.image}" alt="${
      item.name
    }" class="img-fluid rounded">
                </div>
                <div class="col-md-4">
                    <h5>${item.name}</h5>
                    <p class="text-muted">Size: ${item.size}</p>
                    ${
                      maxReached
                        ? '<p class="text-danger"><small>Max available in stock</small></p>'
                        : ""
                    }
                </div>
                <div class="col-md-2">
                    <p class="fw-bold">$${item.price.toFixed(2)}</p>
                </div>
                <div class="col-md-2">
                    <div class="quantity-controls">
                        <button class="btn btn-sm btn-outline-secondary decrease-quantity" data-id="${
                          item.productId
                        }">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary increase-quantity" data-id="${
                          item.productId
                        }" ${maxReached ? "disabled" : ""}>
                            ${maxReached ? "✓" : "+"}
                        </button>
                    </div>
                </div>
                <div class="col-md-2">
                    <button class="btn btn-sm btn-danger remove-item" data-id="${
                      item.productId
                    }">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

    cartContainer.appendChild(cartItem);
  });

  // Add event listeners to quantity buttons
  document
    .querySelectorAll(".increase-quantity:not([disabled])")
    .forEach((btn) => {
      btn.addEventListener("click", function () {
        const productId = parseInt(this.getAttribute("data-id"));
        updateCartItemQuantity(productId, 1);
      });
    });

  document.querySelectorAll(".decrease-quantity").forEach((btn) => {
    btn.addEventListener("click", function () {
      const productId = parseInt(this.getAttribute("data-id"));
      updateCartItemQuantity(productId, -1);
    });
  });

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", function () {
      const productId = parseInt(this.getAttribute("data-id"));
      removeCartItem(productId);
    });
  });
}

function updateCartItemQuantity(productId, change) {
  const currentUser = Storage.getCurrentUser();
  if (!currentUser) return;

  const cart = Storage.getCart(currentUser.email);
  const itemIndex = cart.findIndex((item) => item.productId === productId);

  if (itemIndex !== -1) {
    // Get the product details to check stock
    const product = Storage.getProducts().find((p) => p.id === productId);
    if (!product) return;

    // Calculate what the new quantity would be
    const newQuantity = cart[itemIndex].quantity + change;

    // Check if increasing would exceed available stock
    if (change > 0 && newQuantity > product.stock) {
      alert(`Sorry, only ${product.stock} items available in stock.`);
      return;
    }

    // Check if decreasing would make quantity zero or negative
    if (change < 0 && newQuantity < 1) {
      // Instead of going to zero, remove the item completely
      cart.splice(itemIndex, 1);
    } else {
      // Update the quantity
      cart[itemIndex].quantity = newQuantity;
    }

    Storage.saveCart(currentUser.email, cart);
    displayCartItems();
    updateCartSummary();
    updateCartCount();
  }
}

function removeCartItem(productId) {
  const currentUser = Storage.getCurrentUser();
  if (!currentUser) return;

  const cart = Storage.getCart(currentUser.email);
  const updatedCart = cart.filter((item) => item.productId !== productId);

  Storage.saveCart(currentUser.email, updatedCart);
  displayCartItems();
  updateCartSummary();
  updateCartCount();
}

function updateCartSummary() {
  const currentUser = Storage.getCurrentUser();
  if (!currentUser) return;

  const cart = Storage.getCart(currentUser.email);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 10 : 0;
  const tax = subtotal * 0.08;

  document.getElementById("cart-subtotal").textContent = `$${subtotal.toFixed(
    2
  )}`;
  document.getElementById("cart-shipping").textContent = `$${shipping.toFixed(
    2
  )}`;
  document.getElementById("cart-tax").textContent = `$${tax.toFixed(2)}`;
  document.getElementById("cart-total").textContent = `$${(
    subtotal +
    shipping +
    tax
  ).toFixed(2)}`;
}

// ===== CHECKOUT MODAL FUNCTIONALITY =====

function showCheckoutModal() {
  // Remove any existing modals first
  const existingModal = document.querySelector(".checkout-modal-overlay");
  if (existingModal) {
    document.body.removeChild(existingModal);
  }

  const modal = document.createElement("div");
  modal.className = "checkout-modal-overlay";
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
    `;

  // Get order summary for display
  const currentUser = Storage.getCurrentUser();
  const cart = Storage.getCart(currentUser.email);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 10 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  modal.innerHTML = `
        <div class="modal-content" style="background: white; padding: 20px; border-radius: 10px; width: 100%; max-width: 500px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4 class="mb-0">Complete Your Order</h4>
                <button type="button" class="close-btn" id="close-checkout-x" style="border: none; background: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
            </div>
            
            <!-- Order Summary -->
            <div class="card mb-3">
                <div class="card-body">
                    <h6 class="card-title">Order Summary</h6>
                    ${cart
                      .map(
                        (item) => `
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <span>${item.name} x${item.quantity}</span>
                            <span>$${(item.price * item.quantity).toFixed(
                              2
                            )}</span>
                        </div>
                    `
                      )
                      .join("")}
                    <hr>
                    <div class="d-flex justify-content-between">
                        <strong>Total:</strong>
                        <strong>$${total.toFixed(2)}</strong>
                    </div>
                </div>
            </div>
            
            <form id="checkout-form" novalidate>
                <div class="mb-3">
                    <label for="checkout-email" class="form-label">Email Address *</label>
                    <input type="email" class="form-control" id="checkout-email" required  
                           value="${
                             currentUser.email
                           }" readonly maxlength="100">
                </div>
                
                <div class="mb-3">
                    <label for="checkout-address" class="form-label">Shipping Address *</label>
                    <input type="text" class="form-control" id="checkout-address" required  
                           placeholder="Street address, City, ZIP code" maxlength="100">
                </div>
                
                <div class="mb-3">
                    <label for="checkout-phone" class="form-label">Phone Number *</label>
                    <input type="tel" class="form-control" id="checkout-phone" required  
                           placeholder="Your phone number" maxlength="15">
                </div>
                
                <hr class="my-3">
                
                <h6 class="mb-3">Payment Information</h6>
                
                <div class="mb-3">
                    <label for="checkout-card" class="form-label">Card Number *</label>
                    <input type="text" inputmode="numeric" pattern="[0-9]*" class="form-control" id="checkout-card" required  
                           placeholder="1234 5678 9012 3456" maxlength="19">
                </div>
                
                <div class="row mb-3">
                    <div class="col-6">
                        <label for="checkout-expiry" class="form-label">Expiry Date *</label>
                        <input type="text" inputmode="numeric" pattern="[0-9]*" class="form-control" id="checkout-expiry" required  
                               placeholder="MM/YY" maxlength="5">
                    </div>
                    <div class="col-6">
                        <label for="checkout-cvv" class="form-label">CVV *</label>
                        <input type="text" inputmode="numeric" pattern="[0-9]*" class="form-control" id="checkout-cvv" required  
                               placeholder="123" maxlength="3">
                    </div>
                </div>
                
                <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-success btn-lg">
                        <i class="fas fa-lock me-2"></i>Pay Now - $${total.toFixed(
                          2
                        )}
                    </button>
                    <button type="button" class="btn btn-outline-secondary" id="cancel-checkout-btn">
                        Cancel Order
                    </button>
                </div>
            </form>
        </div>
    `;

  document.body.appendChild(modal);

  // === Error helpers ===
  function showError(input, message) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    let errorDiv = input.parentNode.querySelector(".error-message");
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.style.color = "red";
      errorDiv.style.fontSize = "0.875rem";
      errorDiv.style.marginTop = "4px";
      input.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
  }

  function clearError(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    const errorDiv = input.parentNode.querySelector(".error-message");
    if (errorDiv) errorDiv.remove();
  }

  // === Close modal logic ===
  const closeModal = function () {
    if (modal.parentNode === document.body) {
      document.body.removeChild(modal);
    }
  };
  modal.querySelector("#close-checkout-x").onclick = closeModal;
  modal.querySelector("#cancel-checkout-btn").onclick = closeModal;
  modal.onclick = (e) => e.target === modal && closeModal();
  modal.querySelector(".modal-content").onclick = (e) => e.stopPropagation();

  // === Form validation ===
  const form = modal.querySelector("#checkout-form");
  if (form) {
    const emailInput = form.querySelector("#checkout-email");
    const addressInput = form.querySelector("#checkout-address");
    const phoneInput = form.querySelector("#checkout-phone");
    const cardInput = form.querySelector("#checkout-card");
    const expiryInput = form.querySelector("#checkout-expiry");
    const cvvInput = form.querySelector("#checkout-cvv");

    function validateInputs() {
      let isValid = true;

      // Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, "Please enter a valid email address");
        isValid = false;
      } else clearError(emailInput);

      // Address
      if (
        addressInput.value.trim().length < 5 ||
        addressInput.value.length > 100
      ) {
        showError(addressInput, "Address must be 5-100 characters");
        isValid = false;
      } else clearError(addressInput);

      function textPrevention(input) {
        input.addEventListener("input", function () {
          // allow only numbers, space, and slash
          this.value = this.value.replace(/[^0-9\/ ]/g, "");
        });
      }
      textPrevention(phoneInput);
      // Phone
      if (!/^\d{8,15}$/.test(phoneInput.value.trim())) {
        showError(phoneInput, "Phone must be 8-15 digits");
        isValid = false;
      } else clearError(phoneInput);

      textPrevention(phoneInput);

      // Card number (strict: 4 digits + space + 4 digits + space + 4 digits + space + 4 digits)

      if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(cardInput.value.trim())) {
        showError(
          cardInput,
          "Enter a valid 16-digit card number with spaces every 4 digits (e.g., 1234 5678 9012 3456)"
        );
        isValid = false;
      } else {
        clearError(cardInput);
      }

      textPrevention(cardInput);

      // Expiry
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryInput.value.trim())) {
        showError(expiryInput, "Enter a valid expiry date MM/YY");
        isValid = false;
      } else clearError(expiryInput);
      textPrevention(expiryInput);
      // CVV
      if (!/^\d{3}$/.test(cvvInput.value.trim())) {
        showError(cvvInput, "CVV must be 3 digits");
        isValid = false;
      } else clearError(cvvInput);
      textPrevention(cvvInput);

      return isValid;
    }

    // Live validation
    [addressInput, phoneInput, cardInput, expiryInput, cvvInput].forEach(
      (input) => {
        input.addEventListener("input", validateInputs);
      }
    );

    form.onsubmit = function (e) {
      e.preventDefault();
      if (validateInputs()) {
        processCheckout();
        closeModal();
      }
    };
  }

  // Focus on first input
  setTimeout(() => modal.querySelector("#checkout-address")?.focus(), 100);

  return modal;
}

function processCheckout() {
  showCheckoutConfirmation();
}

function showCheckoutConfirmation() {
  const currentUser = Storage.getCurrentUser();
  const cart = Storage.getCart(currentUser.email);

  if (cart.length === 0) {
    showPopup("⚠️ Empty Cart", "Your cart is empty!");
    return;
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 10 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  //  Show popup with OK & Cancel
  

showPopup(
  "💳 Confirm Payment",
  `Total Amount: $${total.toFixed(2)}\nThis amount will be charged to your card.`,
  () => {
    completeCheckout();
  },
  true, // showCancel
  () => {
    console.log("❌ Payment canceled");
  },
  "OK",       // OK button text
  "Cancel"    // Cancel button text
);
}

function completeCheckout() {
  const currentUser = Storage.getCurrentUser();
  const cart = Storage.getCart(currentUser.email);

  // Clear the cart
  Storage.clearCart(currentUser.email);
  updateCartCount();

  // Show success message
  showSuccessMessage();
}

function showSuccessMessage() {
  // Generate random order number
  const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);

  // Simpler message (no oversized blocks)
  const message = `
    <div style="text-align:center;">
      <div class="text-success mb-3">
        <i class="fas fa-check-circle" style="font-size: 2.5rem; color: green;"></i>
      </div>
      <p>Thank you for your purchase! 🎉</p>
      <p>Your order <strong>${orderNumber}</strong> has been confirmed.</p>
      <p style="font-size: 0.9rem; color: gray;">
        A confirmation email has been sent to your email address.
      </p>
    </div>
  `;

  // Use reusable popup
  showPopup(
    "✅ Purchase Successful",
    message,
    () => {
      // OK → continue shopping
      navigateTo("home-view");
    },
    false // no cancel button
  );

  // Change OK button text to "Continue Shopping"
  const okBtn = document.getElementById("popupOkBtn");
  if (okBtn) okBtn.textContent = "Continue Shopping";
}

// ===== INITIALIZE APPLICATION =====
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all components
  initLogin();
  initRegistration();
  initCarousel();

  // Check URL hash on load to show correct view
  const hash = window.location.hash.substring(1);
  const viewMap = {
    home: "home-view",
    cart: "cart-view",
    login: "login-view",
    contact: "contact-view",
  };

  const targetView =
    viewMap[hash] || (Storage.getCurrentUser() ? "home-view" : "login-view");

  // Hide all views first
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.add("hidden");
  });

  // Show the target view
  document.getElementById(targetView).classList.remove("hidden");

  // Initialize the view if needed
  if (targetView === "home-view") {
    initHomeView();
  } else if (targetView === "cart-view") {
    initCartView();
  } else if (targetView === "contact-view") {
    initContactView();
  }
  updateUI();
});
