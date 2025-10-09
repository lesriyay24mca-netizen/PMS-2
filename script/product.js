// ✅ Default product list
const defaultProducts = [
  { name: "Basmati Rice", price: 1315, weight: "10Kgs", image: "image/Basmati.png" },
  { name: "Wada Kolam", price: 1050, weight: "25Kgs", image: "image/wada kolam.png" },
  { name: "Brown Rice", price: 850, weight: "25Kgs", image: "image/brown rice.png" },
  { name: "Indrayani", price: 1050, weight: "25Kgs", image: "image/Indrayani rice.png" },
  { name: "Sona-masoori", price: 1050, weight: "25Kgs", image: "image/sona-masoori.png" },
  { name: "Short grain", price: 1050, weight: "25Kgs", image: "image/short grain.png" },
  { name: "Red rice", price: 1050, weight: "25Kgs", image: "image/red rice.png" }
];

// ✅ Load products from localStorage or initialize defaults
function getProducts() {
  let products = localStorage.getItem("products");
  if (!products || products === "null" || products === "undefined") {
    localStorage.setItem("products", JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  try {
    products = JSON.parse(products);
    if (!Array.isArray(products)) {
      console.error("Products is not an array, resetting to defaults");
      localStorage.setItem("products", JSON.stringify(defaultProducts));
      return defaultProducts;
    }
    return products;
  } catch (e) {
    console.error("Error parsing products:", e);
    localStorage.setItem("products", JSON.stringify(defaultProducts));
    return defaultProducts;
  }
}

// ✅ Render product cards dynamically
function displayProducts() {
  const products = getProducts();
  const container = document.getElementById("productContainer");
  if (!container) return;

  container.innerHTML = "";

  if (!products || products.length === 0) {
    container.innerHTML = "<p>No products available.</p>";
    return;
  }

  products.forEach(product => {
    if (!product.name || !product.price || !product.weight) {
      console.error("Invalid product data:", product);
      return;
    }

    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" onerror="this.src='image/rice.jpg'" />
      <h3>${product.name}</h3>
      <p>Price: ₹${product.price}</p>
      <p>Weight: ${product.weight}</p>
      <button onclick="addToCart('${product.name}')">Add to Cart</button>
    `;
    container.appendChild(card);
  });
}

// ✅ Add product to cart
function addToCart(productName) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user || user.role !== "customer") {
    alert("Please log in as a customer to add products to your cart.");
    window.location.href = "login.html";
    return;
  }

  const products = getProducts();
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = products.find(p => p.name === productName);
  
  if (!product) {
    alert("Product not found!");
    return;
  }

  const existing = cart.find(item => item.productName === productName);
  if (existing) {
    existing.qty += 1;
    alert(`Added another ${product.name} to cart (${existing.qty} total).`);
  } else {
    cart.push({ 
      productName: product.name, 
      price: product.price, 
      qty: 1 
    });
    alert(`${product.name} added to cart.`);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

// ✅ Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Initial display
  displayProducts();
  
  // Set up periodic refresh
  let lastUpdate = Date.now();
  
  // Check for updates every second
  setInterval(() => {
    const currentProducts = JSON.stringify(getProducts());
    const newUpdate = localStorage.getItem("productsLastModified");
    
    // Refresh if products have changed
    if (newUpdate && newUpdate !== lastUpdate) {
      console.log("Products updated, refreshing display...");
      displayProducts();
      lastUpdate = newUpdate;
    }
  }, 1000);
});