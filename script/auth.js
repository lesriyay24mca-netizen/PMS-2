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

// ✅ Register function with full validation
function registerUser(event) {
  if (event) event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (!username || !email || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (username.length < 3) {
    alert("Username must be at least 3 characters long.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some(user => user.username === username)) {
    alert("Username already exists. Please choose another.");
    return;
  }

  if (users.some(user => user.email === email)) {
    alert("Email already registered. Please use another email or login.");
    return;
  }

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

// ✅ Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  showAuthOption();

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", loginUser);
  }

  if (registerForm) {
    registerForm.addEventListener("submit", registerUser);
  }

  // ✅ Hide admin creation if admin already exists
  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.some(user => user.role === "admin")) {
    const adminSection = document.querySelector(".admin-section");
    if (adminSection) {
      adminSection.style.display = "none";
    }
  }

  // ✅ About page contact logic
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
