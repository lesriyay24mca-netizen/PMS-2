function checkCustomerAccess() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user || user.role !== "customer") {
    alert("Please log in as a customer to proceed to checkout.");
    window.location.href = "login.html";
  }
}

function handleCheckout(event) {
  event.preventDefault();

  const form = event.target;
  const fullName = form.fullName.value.trim();
  const email = form.email.value.trim();
  const address = form.address.value.trim();
  const phone = form.phone.value.trim();

  if (!fullName || !email || !address || !phone) {
    alert("Please fill in all fields.");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty.");
    window.location.href = "products.html";
    return;
  }

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  orders.push({
    customer: user.username,
    fullName,
    email,
    address,
    phone,
    items: cart,
    placedAt: new Date().toISOString()
  });

  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.removeItem("cart");

  alert("Order placed successfully!");
  window.location.href = "order-success.html";
}

document.addEventListener("DOMContentLoaded", () => {
  checkCustomerAccess();

  const form = document.getElementById("checkoutForm");
  if (form) {
    form.addEventListener("submit", handleCheckout);
  }
});