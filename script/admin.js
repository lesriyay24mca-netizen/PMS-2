let uploadedImageBase64 = "";

// ✅ Access control
function checkAdminAccess() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user || user.role !== "admin") {
    alert("Access denied. Admins only.");
    window.location.href = "login.html";
  }
}

// ✅ Logout
function logout() {
  localStorage.removeItem("loggedInUser");
  alert("You have been logged out.");
  window.location.href = "login.html";
}

// ✅ Image preview
function setupImageUpload() {
  const imageInput = document.getElementById("productImageFile");
  if (!imageInput) return;

  imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      uploadedImageBase64 = e.target.result;
      const preview = document.getElementById("imagePreview");
      preview.src = uploadedImageBase64;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  });
}

// ✅ Add product
function addProduct() {
  const name = document.getElementById("productName").value.trim();
  const price = parseFloat(document.getElementById("productPrice").value.trim());
  const weight = document.getElementById("productWeight").value.trim();

  if (!name || !price || !weight || !uploadedImageBase64) {
    alert("Please fill in all fields and upload an image.");
    return;
  }

  if (isNaN(price) || price <= 0) {
    alert("Please enter a valid price.");
    return;
  }

  const products = JSON.parse(localStorage.getItem("products")) || [];
  
  // Check if product name already exists
  if (products.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    alert("A product with this name already exists!");
    return;
  }

  // Validate the product data
  if (isNaN(price) || price <= 0) {
    alert("Please enter a valid price.");
    return;
  }

  // Add the new product
  const newProduct = {
    name,
    price: Number(price),
    weight,
    image: uploadedImageBase64,
    dateAdded: new Date().toISOString()
  };
  
  // Add to products array
  products.push(newProduct);
  
  // Save to localStorage and update timestamp
  try {
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("productsLastModified", Date.now().toString());
    console.log("Product added:", newProduct.name);
    alert("Product added successfully!");
    resetForm();
    displayProducts();
  } catch (e) {
    console.error("Error saving product:", e);
    alert("Error saving product. Please try again.");
  }
}

// ✅ Reset form
function resetForm() {
  document.getElementById("productName").value = "";
  document.getElementById("productPrice").value = "";
  document.getElementById("productWeight").value = "";
  document.getElementById("productImageFile").value = "";
  document.getElementById("imagePreview").style.display = "none";
  uploadedImageBase64 = "";
}

// ✅ Display products
function displayProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const tableBody = document.getElementById("productTableBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (products.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5">No products added yet.</td></tr>`;
    return;
  }

  products.forEach((product, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td>₹${product.price}</td>
      <td>${product.weight}</td>
      <td><img src="${product.image}" alt="${product.name}" style="width:80px; border-radius:6px;" /></td>
      <td><button onclick="deleteProduct(${index})">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
}

// ✅ Delete product
function deleteProduct(index) {
  if (!confirm("Are you sure you want to delete this product?")) {
    return;
  }
  
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const deletedProduct = products[index];
  
  if (!deletedProduct) {
    alert("Product not found!");
    return;
  }

  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  
  // Update the last modified timestamp to trigger refresh on other pages
  localStorage.setItem("productsLastModified", new Date().getTime());
  
  alert(`${deletedProduct.name} deleted successfully!`);
  displayProducts();
}

// ✅ Initialize
document.addEventListener("DOMContentLoaded", () => {
  checkAdminAccess();
  setupImageUpload();
  displayProducts();

  const form = document.getElementById("productForm");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      addProduct();
    });
  }
});
function logout() {
  localStorage.removeItem("loggedInUser");
  alert("You have been logged out.");
  window.location.href = "login.html";
}

function checkAdminAccess() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user || user.role !== "admin") {
    alert("Access denied. Admins only.");
    window.location.href = "login.html";
  } else {
    const greeting = document.getElementById("adminGreeting");
    if (greeting) {
      greeting.innerText = `Welcome, ${user.username}!`;
    }
  }
}

document.addEventListener("DOMContentLoaded", checkAdminAccess);

