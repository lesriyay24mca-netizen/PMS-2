// ✅ Show login/logout link dynamically
function showAuthOption() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const authOption = document.getElementById("authOption");

  if (authOption) {
    authOption.innerHTML = user
      ? `<a href="#" onclick="logout()">Logout</a>`
      : `<a href="login.html">Login / Register</a>`;
  }
}

// ✅ Logout function
function logout() {
  localStorage.removeItem("loggedInUser");
  alert("You have been logged out.");
  window.location.href = "login.html";
}

// ✅ Login function
function loginUser(event) {
  if (event) event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  // ✅ Default admin credentials
  if (username === "admin" && password === "admin123") {
    const adminUser = {
      username: "admin",
      role: "admin"
    };
    localStorage.setItem("loggedInUser", JSON.stringify(adminUser));
    window.location.href = "admin_dashboard.html";
    return;
  }

  // ✅ Check customer users
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.username === username && u.password === password && u.role === "customer");

  if (!user) {
    alert("Invalid credentials. Please try again or register.");
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify(user));
  window.location.href = "products.html";
}

  // Redirect based on role
  if (user.role === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "products.html";
  }


// ✅ Register function with full validation
function registerUser(event) {
  if (event) event.preventDefault();
  
  const username = document.getElementById("username")?.value?.trim();
  const email = document.getElementById("email")?.value?.trim();
  const password = document.getElementById("password")?.value?.trim();
  const confirmPassword = document.getElementById("confirmPassword")?.value?.trim();

  if (!username || !email || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  // Validate username length
  if (username.length < 3) {
    alert("Username must be at least 3 characters long.");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Validate password strength
  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  // Check if user exists
  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.some(user => user.username === username)) {
    alert("Username already exists. Please choose another.");
    return;
  }
  if (users.some(user => user.email === email)) {
    alert("Email already registered. Please use another email or login.");
    return;
  }

  // Create new user with customer role
  const newUser = {
    username,
    email,
    password,
    role: "customer",
    dateCreated: new Date().toISOString(),
    cart: [],
    orders: []
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Registration successful! You can now login.");
  window.location.href = "login.html";
}

// Admin Management
function getAdminKey() {
  let key = localStorage.getItem("adminSecretKey");
  if (!key) {
    // Generate a random 16-character key if none exists
    key = Array.from(crypto.getRandomValues(new Uint8Array(12)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    localStorage.setItem("adminSecretKey", key);
    alert(`Your admin secret key is: ${key}\nPlease save this key securely. You will need it to create an admin account.`);
  }
  return key;
}

function showAdminCreate() {
  const adminForm = document.getElementById("adminForm");
  if (adminForm) {
    adminForm.style.display = adminForm.style.display === "none" ? "block" : "none";
    if (adminForm.style.display === "block") {
      getAdminKey(); // Ensure the key exists when showing the form
    }
  }
}


  const users = JSON.parse(localStorage.getItem("users")) || [];
  
  // Check if admin already exists
  if (users.some(user => user.role === "admin")) {
    alert("An admin account already exists!");
    return;
  }

  // Check if username is taken
  if (users.some(user => user.username === username)) {
    alert("Username already exists!");
    return;
  }

  // Create admin account
  users.push({
    username,
    password,
    role: "admin",
    email: "",
    dateCreated: new Date().toISOString()
  });

  localStorage.setItem("users", JSON.stringify(users));
  alert("Admin account created successfully!");
  window.location.href = "login.html";

// ✅ Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  showAuthOption();

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const createAdminForm = document.getElementById("createAdminForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      loginUser();
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      registerUser();
    });
  }

  if (createAdminForm) {
    createAdminForm.addEventListener("submit", createAdmin);
  }

  // Check if admin exists and hide admin creation if one does
  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.some(user => user.role === "admin")) {
    const adminSection = document.querySelector(".admin-section");
    if (adminSection) {
      adminSection.style.display = "none";
    }
  }
});

// ✅ About page contact logic
document.addEventListener("DOMContentLoaded", () => {
  const contactBox = document.getElementById("ownerContact");
  if (contactBox) {
    contactBox.innerHTML = `
      <h3>Owner Contact</h3>
      <p><strong>Name:</strong> Lesriya</p>
      <p><strong>Phone:</strong> +91-9876543210</p>
      <p><strong>Email:</strong> lesriya@example.com</p>
    `;
  }
});

// This duplicate function has been removed as it was causing confusion