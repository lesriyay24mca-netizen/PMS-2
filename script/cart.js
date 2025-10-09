// ✅ Restrict cart access to logged-in customers
function checkCustomerAccess() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user || user.role !== "customer") {
    alert("Please log in as a customer to view your cart.");
    window.location.href = "login.html";
  }
}

// ✅ Display cart items
function displayCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const tbody = document.getElementById("cartBody");
  if (!tbody) return;

  tbody.innerHTML = "";
  let grandTotal = 0;

  cart.forEach((item, index) => {
    const total = item.price * item.qty;
    grandTotal += total;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.productName}</td>
      <td>
        <button onclick="decreaseQty(${index})">−</button>
        ${item.qty}
        <button onclick="increaseQty(${index})">+</button>
      </td>
      <td>Rs.${item.price}</td>
      <td>Rs.${total}</td>
    `;
    tbody.appendChild(row);
  });

  if (cart.length > 0) {
    const totalRow = document.createElement("tr");
    totalRow.className = "total-row";
    totalRow.innerHTML = `
      <td colspan="3">Grand Total</td>
      <td>Rs.${grandTotal}</td>
    `;
    tbody.appendChild(totalRow);
  } else {
    tbody.innerHTML = `<tr><td colspan="4">Your cart is empty.</td></tr>`;
  }
}

// ✅ Increase quantity
function increaseQty(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].qty += 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// ✅ Decrease quantity or remove item
function decreaseQty(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart[index].qty > 1) {
    cart[index].qty -= 1;
  } else {
    cart.splice(index, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// ✅ Clear cart
function clearCart() {
  localStorage.removeItem("cart");
  displayCart();
}

// ✅ Place order
function placeOrder() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  localStorage.setItem("lastOrder", JSON.stringify({
    cart: cart,
    date: new Date().toLocaleString()
  }));

  localStorage.removeItem("cart");
  window.location.href = "order-success.html";
}

// ✅ Add product to cart (with login check and feedback)
function addToCart(productName, price, button = null) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user || user.role !== "customer") {
    alert("Please log in as a customer to add products to your cart.");
    window.location.href = "login.html";
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.productName === productName);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ productName, qty: 1, price });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  // ✅ Show inline feedback if button is provided
  if (button) {
    const feedback = button.nextElementSibling;
    if (feedback) {
      feedback.textContent = `${productName} added to cart!`;
      feedback.style.display = "block";
      setTimeout(() => {
        feedback.style.display = "none";
      }, 3000);
    }
  } else {
    alert(`${productName} added to cart!`);
  }
}

// ✅ Initialize cart page
document.addEventListener("DOMContentLoaded", () => {
  checkCustomerAccess();
  displayCart();
});

if (!user || user.role !== "customer") {
  alert("Only customers can place orders.");
  return;
}
if (!user) {
  alert("Please log in to place an order.");
  return;
}