/* ShopEase — frontend-only e-commerce demo. No real payments or backend. */
"use strict";

const STORAGE_KEYS = {
  products: "shopease_products_v1",
  cart: "shopease_cart_v1",
  wishlist: "shopease_wishlist_v1",
  orders: "shopease_orders_v1",
  customer: "shopease_customer_v1",
  newsletter: "shopease_newsletter_v1"
};
const FREE_SHIPPING_THRESHOLD = 2499;
const STANDARD_SHIPPING = 99;
const CURRENCY = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const image = (id, width = 700) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;

const SAMPLE_PRODUCTS = [
  {id:"p101",name:"Studio Wireless Headphones",category:"Electronics",price:2499,originalPrice:3299,stock:14,rating:4.8,reviews:128,badge:"Bestseller",isNew:true,image:image("photo-1505740420928-5e560c06d30e"),description:"Your soundtrack, your way. Enjoy rich balanced audio, comfortable ear cushions and a clean everyday design made for work, travel and downtime."},
  {id:"p102",name:"Minimal Everyday Watch",category:"Fashion",price:1899,originalPrice:2499,stock:21,rating:4.6,reviews:84,badge:"Popular",isNew:false,image:image("photo-1523275335684-37898b6baf30"),description:"A versatile, minimalist timepiece that pairs with almost anything. Designed with a clean dial and a comfortable strap for everyday wear."},
  {id:"p103",name:"Cloud Knit Sneakers",category:"Fashion",price:2199,originalPrice:2799,stock:9,rating:4.7,reviews:96,badge:"Sale",isNew:true,image:image("photo-1542291026-7eec264c27ff"),description:"Lightweight everyday sneakers with a cushioned feel and a bold, modern profile. A comfortable pick for city walks and casual days."},
  {id:"p104",name:"Everyday Carry Backpack",category:"Fashion",price:1599,originalPrice:1999,stock:17,rating:4.5,reviews:63,badge:"",isNew:false,image:image("photo-1553062407-98eeb64c6a62"),description:"A practical backpack with a spacious main compartment, useful pockets and a clean silhouette for commuting, college or weekend plans."},
  {id:"p105",name:"Ceramic Coffee Set",category:"Home",price:899,originalPrice:1199,stock:25,rating:4.9,reviews:52,badge:"Top rated",isNew:false,image:image("photo-1514228742587-6b1558fcca3d"),description:"Slow mornings start here. This contemporary ceramic set brings a calm, considered look to your coffee ritual and everyday table."},
  {id:"p106",name:"Soft Glow Table Lamp",category:"Home",price:1749,originalPrice:2199,stock:8,rating:4.4,reviews:39,badge:"",isNew:true,image:image("photo-1507473885765-e6ed057f782c"),description:"A warm accent light for bedside tables, reading corners and workspaces. Its understated design adds a cosy glow to your space."},
  {id:"p107",name:"Daily Hydration Bottle",category:"Sports",price:599,originalPrice:799,stock:40,rating:4.6,reviews:142,badge:"Bestseller",isNew:false,image:image("photo-1602143407151-7111542de6e8"),description:"Keep water close throughout the day with a reusable bottle made for your desk, gym bag or commute. Simple, practical and easy to carry."},
  {id:"p108",name:"Essential Yoga Mat",category:"Sports",price:1199,originalPrice:1499,stock:13,rating:4.7,reviews:71,badge:"",isNew:false,image:image("photo-1592432678016-e910b452f9a2"),description:"A supportive, easy-to-roll mat for stretching, yoga and at-home movement. A thoughtful everyday essential for building a steady routine."},
  {id:"p109",name:"Daily Skincare Kit",category:"Beauty",price:1299,originalPrice:1699,stock:18,rating:4.5,reviews:88,badge:"Value set",isNew:true,image:image("photo-1608248543803-ba4f8c70ae0b"),description:"A simple self-care set for a little everyday reset. Designed to make your daily routine feel considered, easy and enjoyable."},
  {id:"p110",name:"Signature Eau de Parfum",category:"Beauty",price:1999,originalPrice:2499,stock:6,rating:4.3,reviews:44,badge:"Limited",isNew:false,image:image("photo-1541643600914-78b084683601"),description:"A refined fragrance profile for everyday wear, with a modern bottle that looks just as good on your shelf as it feels in your routine."},
  {id:"p111",name:"Portable Bluetooth Speaker",category:"Electronics",price:1499,originalPrice:1899,stock:22,rating:4.6,reviews:117,badge:"Sale",isNew:false,image:image("photo-1608043152269-423dbba4e7e1"),description:"Bring a little music to your room, picnic or weekend away. Compact styling and easy portability make this a useful audio companion."},
  {id:"p112",name:"Mechanical Keyboard",category:"Electronics",price:3299,originalPrice:3999,stock:7,rating:4.8,reviews:91,badge:"Top rated",isNew:true,image:image("photo-1587829741301-dc798b83add3"),description:"A satisfying typing setup for study sessions and workdays. Its compact, desk-friendly design helps create a focused and comfortable workspace."}
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const safeParse = (value, fallback) => { try { return value ? JSON.parse(value) : fallback; } catch { return fallback; } };
const makeId = (prefix = "id") => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
const money = value => CURRENCY.format(Number(value) || 0);
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const validImageURL = value => { try { const url = new URL(value); return ["https:","http:"].includes(url.protocol); } catch { return false; } };

function readStorage(key, fallback) {
  try { return safeParse(localStorage.getItem(key), fallback); }
  catch { return fallback; }
}
function writeStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch (error) { console.error("Could not save local data:", error); toast("Browser storage is full or unavailable. Export your data before continuing.", "error"); return false; }
}

let products = readStorage(STORAGE_KEYS.products, null);
if (!Array.isArray(products) || products.length === 0) {
  products = structuredCloneSafe(SAMPLE_PRODUCTS);
  writeStorage(STORAGE_KEYS.products, products);
}
let cart = readStorage(STORAGE_KEYS.cart, []);
let wishlist = readStorage(STORAGE_KEYS.wishlist, []);
let orders = readStorage(STORAGE_KEYS.orders, []);
let customer = readStorage(STORAGE_KEYS.customer, {});
let activeCategory = "All";
let searchTerm = "";
let maxPrice = 10000;
let sortMode = "featured";
let currentModal = null;
let previousFocus = null;

function structuredCloneSafe(value) { return JSON.parse(JSON.stringify(value)); }
function persistCart() { writeStorage(STORAGE_KEYS.cart, cart); }
function persistWishlist() { writeStorage(STORAGE_KEYS.wishlist, wishlist); }
function persistProducts() { writeStorage(STORAGE_KEYS.products, products); }
function persistOrders() { writeStorage(STORAGE_KEYS.orders, orders); }

function toast(message, type = "success") {
  const region = $("#toastRegion");
  if (!region) return;
  const node = document.createElement("div");
  node.className = `toast ${type}`;
  node.textContent = message;
  region.append(node);
  window.setTimeout(() => node.remove(), 3400);
}
function showOverlay() { $("#overlay").classList.remove("hidden"); }
function hideOverlayIfUnused() {
  if (!$("#cartDrawer").classList.contains("open") && !currentModal) $("#overlay").classList.add("hidden");
}
function openModal(element) {
  closeCart(false);
  if (currentModal && currentModal !== element) currentModal.classList.add("hidden");
  previousFocus = document.activeElement;
  currentModal = element;
  element.classList.remove("hidden");
  showOverlay();
  document.body.classList.add("modal-open");
  const focusable = element.querySelector("button, input, select, textarea, a");
  if (focusable) window.setTimeout(() => focusable.focus(), 30);
}
function closeModal(element = currentModal) {
  if (!element) return;
  element.classList.add("hidden");
  if (currentModal === element) currentModal = null;
  document.body.classList.remove("modal-open");
  hideOverlayIfUnused();
  if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
}
function openCart() {
  if (currentModal) closeModal(currentModal);
  const drawer = $("#cartDrawer");
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  showOverlay();
  renderCart();
  $("#closeCartButton").focus();
}
function closeCart(hideOverlay = true) {
  const drawer = $("#cartDrawer");
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  if (hideOverlay) hideOverlayIfUnused();
}
function closeAllSurfaces() {
  closeCart(false);
  if (currentModal) closeModal(currentModal);
  $("#overlay").classList.add("hidden");
  document.body.classList.remove("modal-open");
}
function getProduct(id) { return products.find(product => product.id === id); }
function cartQuantity() { return cart.reduce((sum, item) => sum + item.quantity, 0); }
function cartSubtotal() { return cart.reduce((sum, item) => { const product = getProduct(item.id); return sum + (product ? product.price * item.quantity : 0); }, 0); }
function shippingCost(subtotal = cartSubtotal()) { return subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING; }
function cartGrandTotal() { return cartSubtotal() + shippingCost(); }
function saveAll() { persistCart(); persistWishlist(); persistProducts(); persistOrders(); }

function renderProductCard(product) {
  const discount = product.originalPrice > product.price ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const wished = wishlist.includes(product.id);
  const outOfStock = product.stock <= 0;
  return `<article class="product-card">
    <div class="product-image-wrap">
      <img class="product-image" src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x700/202329/f4f4f0?text=ShopEase'">
      ${product.badge ? `<span class="product-badge ${discount ? "sale" : ""}">${escapeHTML(product.badge)}</span>` : ""}
      ${discount ? `<span class="product-badge sale" style="top:${product.badge ? "39px" : "12px"}">${discount}% off</span>` : ""}
      <button class="wishlist-button ${wished ? "is-active" : ""}" data-wishlist="${escapeHTML(product.id)}" aria-label="${wished ? "Remove from" : "Add to"} wishlist" aria-pressed="${wished}">${wished ? "♥" : "♡"}</button>
      <button class="quick-view-button" data-quick-view="${escapeHTML(product.id)}">Quick view ↗</button>
    </div>
    <div class="product-info">
      <span class="product-category">${escapeHTML(product.category)}</span>
      <div class="product-name-row"><span class="product-name" data-quick-view="${escapeHTML(product.id)}">${escapeHTML(product.name)}</span><span class="product-rating">★ ${Number(product.rating).toFixed(1)} <span>(${Number(product.reviews) || 0})</span></span></div>
      <div class="product-bottom"><div><span class="product-price">${money(product.price)}</span>${product.originalPrice > product.price ? `<span class="original-price">${money(product.originalPrice)}</span>` : ""}</div><button class="add-button" data-add="${escapeHTML(product.id)}" aria-label="Add ${escapeHTML(product.name)} to cart" ${outOfStock ? "disabled" : ""}>${outOfStock ? "×" : "+"}</button></div>
      ${outOfStock ? '<p class="stock-note">Currently out of stock</p>' : product.stock <= 5 ? `<p class="stock-note">Only ${product.stock} left</p>` : ""}
    </div>
  </article>`;
}
function getVisibleProducts() {
  let result = products.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term || [product.name, product.category, product.description].some(value => String(value).toLowerCase().includes(term));
    return matchesCategory && matchesSearch && Number(product.price) <= maxPrice;
  });
  if (sortMode === "price-low") result.sort((a,b) => a.price - b.price);
  else if (sortMode === "price-high") result.sort((a,b) => b.price - a.price);
  else if (sortMode === "rating") result.sort((a,b) => b.rating - a.rating);
  else if (sortMode === "newest") result.sort((a,b) => Number(b.isNew) - Number(a.isNew));
  return result;
}
function renderProducts() {
  const visible = getVisibleProducts();
  $("#productGrid").innerHTML = visible.map(renderProductCard).join("");
  $("#emptyProducts").classList.toggle("hidden", visible.length > 0);
  $("#productGrid").classList.toggle("hidden", visible.length === 0);
  $("#resultsSummary").textContent = `${visible.length} product${visible.length === 1 ? "" : "s"} to explore${searchTerm ? ` for “${searchTerm}”` : ""}.`;
  $("#productSectionTitle").innerHTML = searchTerm ? `Search results<span class="heading-period">.</span>` : activeCategory !== "All" ? `${escapeHTML(activeCategory)} picks<span class="heading-period">.</span>` : "Popular right now<span class=\"heading-period\">.</span>";
  $$("#filterCategories [data-category]").forEach(button => button.classList.toggle("active", button.dataset.category === activeCategory));
  $$("#categoryNav [data-nav-category]").forEach(link => link.classList.toggle("active", link.dataset.navCategory === activeCategory));
}
function setCategory(category) {
  activeCategory = category;
  renderProducts();
  $("#products").scrollIntoView({ behavior: "smooth", block: "start" });
}
function resetFilters() {
  activeCategory = "All"; searchTerm = ""; maxPrice = 10000; sortMode = "featured";
  $("#searchInput").value = ""; $("#priceRange").value = "10000"; $("#priceValue").textContent = money(10000); $("#sortSelect").value = "featured";
  renderProducts();
}
function addToCart(id) {
  const product = getProduct(id);
  if (!product) return toast("That product could not be found.", "error");
  const existing = cart.find(item => item.id === id);
  if (product.stock <= 0) return toast("This item is currently out of stock.", "error");
  if (existing && existing.quantity >= product.stock) return toast(`Only ${product.stock} available in stock.`, "error");
  if (existing) existing.quantity += 1;
  else cart.push({ id, quantity: 1 });
  persistCart(); renderCart(); renderHeaderCounts();
  toast(`${product.name} added to your bag.`);
}
function updateQuantity(id, change) {
  const item = cart.find(entry => entry.id === id);
  const product = getProduct(id);
  if (!item || !product) return;
  const next = item.quantity + change;
  if (next <= 0) cart = cart.filter(entry => entry.id !== id);
  else if (next > product.stock) return toast(`Only ${product.stock} available in stock.`, "error");
  else item.quantity = next;
  persistCart(); renderCart(); renderHeaderCounts();
}
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  persistCart(); renderCart(); renderHeaderCounts();
  toast("Item removed from your bag.", "info");
}
function renderCart() {
  // Drop stale cart entries if a product was removed in the manager.
  cart = cart.filter(item => getProduct(item.id) && item.quantity > 0);
  const count = cartQuantity(), subtotal = cartSubtotal(), shipping = shippingCost(subtotal);
  $("#cartCount").textContent = count; $("#drawerCartCount").textContent = `(${count})`;
  $("#cartItems").innerHTML = cart.map(item => {
    const product = getProduct(item.id);
    return `<div class="cart-item"><img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" onerror="this.src='https://placehold.co/100x110/202329/f4f4f0?text=Item'"><div><p class="cart-item-name">${escapeHTML(product.name)}</p><span class="cart-item-category">${escapeHTML(product.category)}</span><p class="cart-item-price">${money(product.price)}</p><div class="quantity-control"><button data-quantity="${escapeHTML(item.id)}" data-change="-1" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button data-quantity="${escapeHTML(item.id)}" data-change="1" aria-label="Increase quantity">+</button></div></div><button class="remove-item" data-remove="${escapeHTML(item.id)}" aria-label="Remove ${escapeHTML(product.name)}">×</button></div>`;
  }).join("");
  $("#cartEmpty").classList.toggle("hidden", count > 0);
  $("#cartSummary").classList.toggle("hidden", count === 0);
  $("#cartSubtotal").textContent = money(subtotal); $("#cartShipping").textContent = shipping ? money(shipping) : "Free"; $("#cartTotal").textContent = money(subtotal + shipping);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  $("#shippingMessage").textContent = count === 0 ? "Add a product to start your bag." : remaining ? `Add ${money(remaining)} more for free shipping.` : "You've unlocked free shipping!";
  $("#shippingProgress").style.width = `${Math.min(100, subtotal / FREE_SHIPPING_THRESHOLD * 100)}%`;
  persistCart();
}
function toggleWishlist(id) {
  const product = getProduct(id);
  if (!product) return;
  if (wishlist.includes(id)) { wishlist = wishlist.filter(value => value !== id); toast("Removed from your wishlist.", "info"); }
  else { wishlist.push(id); toast("Saved to your wishlist."); }
  persistWishlist(); renderHeaderCounts(); renderProducts();
}
function renderHeaderCounts() {
  $("#cartCount").textContent = cartQuantity();
  $("#wishlistCount").textContent = wishlist.length;
}
function openProductDetails(id) {
  const product = getProduct(id);
  if (!product) return;
  const discount = product.originalPrice > product.price ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  $("#productModalContent").innerHTML = `<div class="product-detail-layout"><img class="product-detail-image" src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" onerror="this.src='https://placehold.co/600x700/202329/f4f4f0?text=ShopEase'"><div class="product-detail-info"><p class="product-category">${escapeHTML(product.category)}${product.isNew ? " · NEW ARRIVAL" : ""}</p><h2 id="productModalTitle">${escapeHTML(product.name)}</h2><p class="detail-rating">★★★★★ <span style="color:var(--muted)"> ${Number(product.rating).toFixed(1)} · ${Number(product.reviews)||0} reviews</span></p><p class="detail-description">${escapeHTML(product.description)}</p><div class="detail-price">${money(product.price)} ${product.originalPrice > product.price ? `<span class="original-price">${money(product.originalPrice)}</span>` : ""}</div>${discount ? `<p class="detail-stock">${discount}% savings on this pick</p>` : ""}<p class="detail-stock">${product.stock > 0 ? `${product.stock} in stock` : "Currently out of stock"}</p><div class="detail-actions"><button class="button button-primary" data-add="${escapeHTML(product.id)}" ${product.stock <= 0 ? "disabled" : ""}>Add to bag ↗</button><button class="button button-secondary" data-wishlist="${escapeHTML(product.id)}">${wishlist.includes(product.id) ? "♥ Saved" : "♡ Save"}</button></div></div></div>`;
  openModal($("#productModal"));
}

function renderCheckoutSummary() {
  $("#checkoutItems").innerHTML = cart.map(item => {
    const product = getProduct(item.id);
    if (!product) return "";
    return `<div class="checkout-line"><img src="${escapeHTML(product.image)}" alt=""><div><strong>${escapeHTML(product.name)}</strong><small>Qty ${item.quantity} × ${money(product.price)}</small></div><b>${money(product.price * item.quantity)}</b></div>`;
  }).join("");
  const subtotal = cartSubtotal(), shipping = shippingCost(subtotal);
  $("#checkoutSubtotal").textContent = money(subtotal); $("#checkoutShipping").textContent = shipping ? money(shipping) : "Free"; $("#checkoutTotal").textContent = money(subtotal + shipping);
}
function openCheckout() {
  if (!cart.length) return toast("Your bag is empty. Add a product first.", "error");
  closeCart(false);
  $("#customerName").value = customer.name || "";
  $("#customerEmail").value = customer.email || "";
  $("#customerPhone").value = customer.phone || "";
  $("#customerPincode").value = customer.pincode || "";
  $("#customerAddress").value = customer.address || "";
  $("#customerCity").value = customer.city || "";
  $("#paymentMethod").value = customer.payment || "Cash on Delivery";
  $("#checkoutError").textContent = "";
  renderCheckoutSummary();
  openModal($("#checkoutModal"));
}
function validateField(field) {
  const error = field.parentElement.querySelector(".field-error");
  field.classList.remove("invalid");
  if (error) error.textContent = "";
  const value = field.value.trim();
  let message = "";
  if (field.required && !value) message = "This field is required.";
  else if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = "Enter a valid email address.";
  else if (field.id === "customerPhone" && value && !/^[0-9 +()-]{8,16}$/.test(value)) message = "Enter a valid phone number.";
  else if (field.id === "customerPincode" && value && !/^[0-9]{6}$/.test(value)) message = "Enter a valid 6-digit PIN code.";
  else if (field.minLength > 0 && value.length < field.minLength) message = `Enter at least ${field.minLength} characters.`;
  if (message) {
    field.classList.add("invalid");
    if (error) error.textContent = message;
  }
  return !message;
}
function placeOrder(event) {
  event.preventDefault();
  const form = $("#checkoutForm");
  const fields = $$("input[required], textarea[required]", form);
  const valid = fields.map(validateField).every(Boolean);
  if (!$("#termsCheck").checked) {
    $("#checkoutError").textContent = "Please confirm your details before placing the order.";
    return;
  }
  if (!valid) {
    $("#checkoutError").textContent = "Please correct the highlighted fields.";
    const firstInvalid = $(".invalid", form); if (firstInvalid) firstInvalid.focus();
    return;
  }
  if (!cart.length) { $("#checkoutError").textContent = "Your bag is empty."; return; }
  for (const item of cart) {
    const product = getProduct(item.id);
    if (!product || item.quantity > product.stock) {
      $("#checkoutError").textContent = `${product ? product.name : "An item"} no longer has enough stock. Please review your bag.`;
      return;
    }
  }
  customer = {
    name: $("#customerName").value.trim(), email: $("#customerEmail").value.trim(),
    phone: $("#customerPhone").value.trim(), pincode: $("#customerPincode").value.trim(),
    address: $("#customerAddress").value.trim(), city: $("#customerCity").value.trim(),
    payment: $("#paymentMethod").value
  };
  const subtotal = cartSubtotal(), shipping = shippingCost(subtotal);
  const order = {
    id: `SE-${Date.now().toString().slice(-8)}`, createdAt: new Date().toISOString(),
    status: "Confirmed (demo)", customer: structuredCloneSafe(customer),
    items: cart.map(item => { const product = getProduct(item.id); return { id: product.id, name: product.name, price: product.price, quantity: item.quantity, image: product.image }; }),
    subtotal, shipping, total: subtotal + shipping, payment: customer.payment
  };
  cart.forEach(item => { const product = getProduct(item.id); product.stock -= item.quantity; });
  orders.unshift(order);
  cart = [];
  writeStorage(STORAGE_KEYS.customer, customer);
  persistOrders(); persistProducts(); persistCart();
  closeModal($("#checkoutModal"));
  renderProducts(); renderCart(); renderHeaderCounts();
  toast(`Order ${order.id} placed successfully. Demo only.`);
  openOrderConfirmation(order);
}
function openOrderConfirmation(order) {
  $("#infoTitle").textContent = "Order confirmed!";
  $("#infoContent").innerHTML = `<div class="account-welcome"><p style="color:var(--accent);font-weight:700">✓ YOUR ORDER IS IN</p><h3>Thanks, ${escapeHTML(order.customer.name.split(" ")[0])}.</h3><p>Your demo order <strong>${escapeHTML(order.id)}</strong> has been saved in this browser.</p><p>Order total: <strong style="color:var(--text)">${money(order.total)}</strong></p><p>Payment: ${escapeHTML(order.payment)}. No real payment or delivery is initiated.</p><button class="button button-primary" id="confirmationDone">Continue shopping ↗</button></div>`;
  openModal($("#infoModal"));
  $("#confirmationDone").addEventListener("click", () => closeModal($("#infoModal")), {once:true});
}
function openWishlist() {
  activeCategory = "All"; searchTerm = "";
  const saved = products.filter(product => wishlist.includes(product.id));
  $("#productSectionTitle").textContent = "Your wishlist";
  $("#productGrid").innerHTML = saved.map(renderProductCard).join("");
  $("#resultsSummary").textContent = `${saved.length} saved product${saved.length === 1 ? "" : "s"}.`;
  $("#emptyProducts").classList.toggle("hidden", saved.length > 0);
  $("#productGrid").classList.toggle("hidden", saved.length === 0);
  $("#products").scrollIntoView({behavior:"smooth"});
}
function openAccount() {
  const spent = orders.reduce((sum, order) => sum + order.total, 0);
  $("#accountContent").innerHTML = `<div class="account-welcome"><h3>${customer.name ? `Welcome back, ${escapeHTML(customer.name.split(" ")[0])}` : "Welcome to ShopEase"}</h3><p>${customer.email ? escapeHTML(customer.email) : "Your local shopping space. Place a demo order to see it appear here."}</p></div><div class="account-stats"><div class="account-stat"><strong>${orders.length}</strong><small>Orders</small></div><div class="account-stat"><strong>${wishlist.length}</strong><small>Wishlist</small></div><div class="account-stat"><strong>${money(spent)}</strong><small>Total spent</small></div></div><div class="account-orders"><h3>Recent orders</h3>${orders.length ? orders.slice(0,5).map(order => `<div class="order-row"><div><strong>${escapeHTML(order.id)}</strong><small>${new Date(order.createdAt).toLocaleDateString("en-IN")} · ${order.items.length} item(s)</small></div><div style="text-align:right"><strong>${money(order.total)}</strong><small class="order-status">${escapeHTML(order.status)}</small></div></div>`).join("") : '<p style="font-size:11px;color:var(--muted)">No orders yet. Your first order will show up here.</p>'}</div><div class="admin-actions" style="margin-top:20px"><button class="button button-secondary" id="exportOrdersButton">Export my orders</button><button class="button button-secondary" id="viewWishlistButton">View wishlist</button></div>`;
  openModal($("#accountModal"));
  $("#exportOrdersButton").addEventListener("click", () => downloadFile("shopease-orders.json", JSON.stringify(orders, null, 2), "application/json"), {once:true});
  $("#viewWishlistButton").addEventListener("click", () => { closeModal($("#accountModal")); openWishlist(); }, {once:true});
}

function renderAdmin() {
  $("#adminStats").innerHTML = `<div class="admin-stat"><small>Products listed</small><strong>${products.length}</strong></div><div class="admin-stat"><small>Total stock units</small><strong>${products.reduce((sum,p)=>sum+p.stock,0)}</strong></div><div class="admin-stat"><small>Demo orders</small><strong>${orders.length}</strong></div>`;
  $("#adminProductRows").innerHTML = products.map(product => `<tr><td><div class="admin-product-cell"><img src="${escapeHTML(product.image)}" alt="" onerror="this.src='https://placehold.co/60x70/202329/f4f4f0?text=Item'"><div><strong>${escapeHTML(product.name)}</strong><small>${escapeHTML(product.id)}</small></div></div></td><td>${escapeHTML(product.category)}</td><td>${money(product.price)}</td><td>${product.stock}</td><td><div class="table-actions"><button data-edit-product="${escapeHTML(product.id)}">Edit</button><button class="delete-product" data-delete-product="${escapeHTML(product.id)}">Delete</button></div></td></tr>`).join("");
}
function openAdmin() { renderAdmin(); $("#productEditor").classList.add("hidden"); openModal($("#adminModal")); }
function editProduct(id = "") {
  const product = id ? getProduct(id) : null;
  $("#productEditorTitle").textContent = product ? "Edit product" : "Add product";
  $("#editProductId").value = product?.id || "";
  $("#editProductName").value = product?.name || "";
  $("#editProductCategory").value = product?.category || "Electronics";
  $("#editProductPrice").value = product?.price ?? "";
  $("#editProductOriginalPrice").value = product?.originalPrice ?? "";
  $("#editProductStock").value = product?.stock ?? 0;
  $("#editProductRating").value = product?.rating ?? 4.5;
  $("#editProductImage").value = product?.image || "";
  $("#editProductDescription").value = product?.description || "";
  $("#productEditorError").textContent = "";
  $("#productEditor").classList.remove("hidden");
  $("#productEditor").scrollIntoView({behavior:"smooth",block:"nearest"});
  $("#editProductName").focus();
}
function saveProduct(event) {
  event.preventDefault();
  const id = $("#editProductId").value;
  const name = $("#editProductName").value.trim(), category = $("#editProductCategory").value;
  const price = Number($("#editProductPrice").value), originalPrice = Number($("#editProductOriginalPrice").value || $("#editProductPrice").value);
  const stock = Number($("#editProductStock").value), rating = Number($("#editProductRating").value);
  const imageURL = $("#editProductImage").value.trim(), description = $("#editProductDescription").value.trim();
  if (name.length < 2 || !Number.isFinite(price) || price <= 0 || !Number.isFinite(originalPrice) || originalPrice <= 0 || !Number.isInteger(stock) || stock < 0 || rating < 0 || rating > 5 || !validImageURL(imageURL) || description.length < 10) {
    $("#productEditorError").textContent = "Check all fields: valid name, positive prices, whole-number stock, rating 0–5, valid HTTP(S) image URL and description of at least 10 characters.";
    return;
  }
  const next = {id: id || makeId("p"), name, category, price, originalPrice, stock, rating, reviews: id ? (getProduct(id)?.reviews || 0) : 0, badge: "", isNew: !id, image: imageURL, description};
  if (id) products = products.map(product => product.id === id ? next : product);
  else products.unshift(next);
  persistProducts(); renderAdmin(); renderProducts(); renderCart(); renderHeaderCounts();
  $("#productEditor").classList.add("hidden");
  toast(id ? "Product updated." : "Product added.");
}
function deleteProduct(id) {
  const product = getProduct(id);
  if (!product) return;
  if (!window.confirm(`Delete "${product.name}"? It will also be removed from the cart and wishlist.`)) return;
  products = products.filter(item => item.id !== id);
  cart = cart.filter(item => item.id !== id);
  wishlist = wishlist.filter(item => item !== id);
  persistProducts(); persistCart(); persistWishlist();
  renderAdmin(); renderProducts(); renderCart(); renderHeaderCounts();
  toast("Product deleted.", "info");
}
function downloadFile(filename, content, type) {
  const blob = new Blob([content], {type});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
  URL.revokeObjectURL(url);
  toast(`${filename} exported.`);
}
function exportProductsJSON() { downloadFile("shopease-products.json", JSON.stringify(products, null, 2), "application/json"); }
function exportProductsCSV() {
  const fields = ["id","name","category","price","originalPrice","stock","rating","reviews","badge","isNew","image","description"];
  const quote = value => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = [fields.join(","), ...products.map(product => fields.map(field => quote(product[field])).join(","))].join("\r\n");
  downloadFile("shopease-products.csv", csv, "text/csv;charset=utf-8");
}
function importProductsFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported) || imported.length === 0) throw new Error("Expected a non-empty JSON array of products.");
      const normalized = imported.map((p, index) => {
        if (!p || typeof p !== "object" || !String(p.name || "").trim() || !["Electronics","Fashion","Home","Beauty","Sports"].includes(p.category) || !Number.isFinite(Number(p.price)) || Number(p.price) <= 0 || !Number.isInteger(Number(p.stock)) || Number(p.stock) < 0 || !validImageURL(String(p.image || ""))) {
          throw new Error(`Product row ${index + 1} has invalid fields.`);
        }
        return {...p, id: String(p.id || makeId("p")), name: String(p.name).trim(), price: Number(p.price), originalPrice: Number(p.originalPrice || p.price), stock: Number(p.stock), rating: Math.min(5, Math.max(0, Number(p.rating) || 0)), reviews: Number(p.reviews) || 0, description: String(p.description || "Imported product.").slice(0, 2000)};
      });
      const ids = new Set();
      normalized.forEach(p => { if (ids.has(p.id)) p.id = makeId("p"); ids.add(p.id); });
      if (!window.confirm(`Import ${normalized.length} products and replace the current catalogue? Export your current catalogue first if you want a backup.`)) return;
      products = normalized; cart = cart.filter(item => products.some(p => p.id === item.id)); wishlist = wishlist.filter(id => products.some(p => p.id === id));
      persistProducts(); persistCart(); persistWishlist(); renderAdmin(); renderProducts(); renderCart(); renderHeaderCounts();
      toast(`${normalized.length} products imported.`);
    } catch (error) { toast(`Import failed: ${error.message}`, "error"); }
    $("#importFileInput").value = "";
  };
  reader.onerror = () => toast("Could not read this file.", "error");
  reader.readAsText(file);
}
function showInfo(type) {
  const content = {
    shipping: ["Shipping information","This student demo uses a simulated shipping calculation. Orders below ₹2,499 show a ₹99 delivery fee; orders at or above ₹2,499 receive free shipping. No courier booking is made."],
    returns: ["Returns & refunds","For this demonstration, returns are informational only. A production store would need a returns workflow, customer support and server-side order verification."],
    privacy: ["Privacy policy","This frontend demo stores cart, wishlist, product catalogue, customer details and demo orders in localStorage on this browser. Do not enter sensitive personal or payment information. Clear the browser's site data to remove stored demo information."],
    contact: ["Contact us","ShopEase is an educational project. No real customer support team is connected. For a real deployment, add verified contact details and a secure support process."]
  }[type];
  if (!content) return;
  $("#infoTitle").textContent = content[0];
  $("#infoContent").textContent = content[1];
  openModal($("#infoModal"));
}
function initEvents() {
  $("#searchForm").addEventListener("submit", event => {
    event.preventDefault(); searchTerm = $("#searchInput").value.trim(); renderProducts(); $("#products").scrollIntoView({behavior:"smooth"});
  });
  $("#searchInput").addEventListener("input", event => { searchTerm = event.target.value.trim(); renderProducts(); });
  $("#filterCategories").addEventListener("click", event => { const button = event.target.closest("[data-category]"); if (button) setCategory(button.dataset.category); });
  $("#categoryNav").addEventListener("click", event => { const link = event.target.closest("[data-nav-category]"); if (link) { event.preventDefault(); setCategory(link.dataset.navCategory); $("#categoryNav").classList.remove("mobile-open"); $("#mobileMenuButton").setAttribute("aria-expanded","false"); } });
  $$(".category-card[data-category]").forEach(button => button.addEventListener("click", () => setCategory(button.dataset.category)));
  $$("[data-footer-category]").forEach(link => link.addEventListener("click", event => { event.preventDefault(); setCategory(link.dataset.footerCategory); }));
  $("#priceRange").addEventListener("input", event => { maxPrice = Number(event.target.value); $("#priceValue").textContent = money(maxPrice); renderProducts(); });
  $("#sortSelect").addEventListener("change", event => { sortMode = event.target.value; renderProducts(); });
  $("#clearFiltersButton").addEventListener("click", resetFilters);
  $("#resetSearchButton").addEventListener("click", resetFilters);
  $("#allCategoriesLink").addEventListener("click", event => { event.preventDefault(); resetFilters(); $("#products").scrollIntoView({behavior:"smooth"}); });
  $("#shopDealsButton").addEventListener("click", () => { activeCategory = "All"; searchTerm = ""; maxPrice = 2499; $("#priceRange").value = "2499"; $("#priceValue").textContent = money(2499); $("#searchInput").value = ""; renderProducts(); $("#products").scrollIntoView({behavior:"smooth"}); });
  $("#productGrid").addEventListener("click", handleProductAction);
  $("#productModalContent").addEventListener("click", handleProductAction);
  $("#cartItems").addEventListener("click", event => {
    const quantity = event.target.closest("[data-quantity]"), remove = event.target.closest("[data-remove]");
    if (quantity) updateQuantity(quantity.dataset.quantity, Number(quantity.dataset.change));
    if (remove) removeFromCart(remove.dataset.remove);
  });
  $("#cartButton").addEventListener("click", openCart);
  $("#closeCartButton").addEventListener("click", () => closeCart());
  $("#continueShoppingButton").addEventListener("click", () => { closeCart(); $("#products").scrollIntoView({behavior:"smooth"}); });
  $("#continueShoppingText").addEventListener("click", () => { closeCart(); $("#products").scrollIntoView({behavior:"smooth"}); });
  $("#checkoutButton").addEventListener("click", openCheckout);
  $("#wishlistHeaderButton").addEventListener("click", openWishlist);
  $("#accountButton").addEventListener("click", openAccount);
  $("#checkoutForm").addEventListener("submit", placeOrder);
  $$("#checkoutForm input[required], #checkoutForm textarea[required]").forEach(field => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => { if (field.classList.contains("invalid")) validateField(field); });
  });
  $("#newsletterForm").addEventListener("submit", event => {
    event.preventDefault();
    const email = $("#newsletterEmail").value.trim().toLowerCase();
    const emails = readStorage(STORAGE_KEYS.newsletter, []);
    if (!emails.includes(email)) emails.push(email);
    writeStorage(STORAGE_KEYS.newsletter, emails);
    event.target.reset(); toast("You're on the list! (Saved locally for this demo.)");
  });
  $("#mobileMenuButton").addEventListener("click", () => {
    const open = $("#categoryNav").classList.toggle("mobile-open");
    $("#mobileMenuButton").setAttribute("aria-expanded", String(open));
  });
  $("#adminShortcut").addEventListener("click", openAdmin);
  $("#adminProductRows").addEventListener("click", event => {
    const edit = event.target.closest("[data-edit-product]"), del = event.target.closest("[data-delete-product]");
    if (edit) editProduct(edit.dataset.editProduct);
    if (del) deleteProduct(del.dataset.deleteProduct);
  });
  $("#addProductButton").addEventListener("click", () => editProduct());
  $("#productEditor").addEventListener("submit", saveProduct);
  $("#cancelProductEdit").addEventListener("click", () => $("#productEditor").classList.add("hidden"));
  $("#exportJsonButton").addEventListener("click", exportProductsJSON);
  $("#exportCsvButton").addEventListener("click", exportProductsCSV);
  $("#importProductsButton").addEventListener("click", () => $("#importFileInput").click());
  $("#importFileInput").addEventListener("change", event => importProductsFile(event.target.files[0]));
  $("#overlay").addEventListener("click", closeAllSurfaces);
  $$("[data-close-modal]").forEach(button => button.addEventListener("click", () => closeModal(button.closest(".modal"))));
  $$("[data-info]").forEach(link => link.addEventListener("click", event => { event.preventDefault(); showInfo(link.dataset.info); }));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeAllSurfaces();
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); $("#searchInput").focus(); }
  });
  // Keep storage tabs in sync when the same demo is open in multiple tabs.
  window.addEventListener("storage", event => {
    if (Object.values(STORAGE_KEYS).includes(event.key)) {
      products = readStorage(STORAGE_KEYS.products, SAMPLE_PRODUCTS);
      cart = readStorage(STORAGE_KEYS.cart, []);
      wishlist = readStorage(STORAGE_KEYS.wishlist, []);
      orders = readStorage(STORAGE_KEYS.orders, []);
      customer = readStorage(STORAGE_KEYS.customer, {});
      renderProducts(); renderCart(); renderHeaderCounts();
    }
  });
}
function handleProductAction(event) {
  const add = event.target.closest("[data-add]"), wish = event.target.closest("[data-wishlist]"), quick = event.target.closest("[data-quick-view]");
  if (add) {
    const id = add.dataset.add;
    const wasModal = Boolean(add.closest("#productModalContent"));
    addToCart(id);
    if (wasModal && currentModal === $("#productModal")) closeModal($("#productModal"));
  }
  if (wish) {
    const id = wish.dataset.wishlist;
    toggleWishlist(id);
    if (currentModal === $("#productModal")) openProductDetails(id);
  }
  if (quick) openProductDetails(quick.dataset.quickView);
}

function init() {
  // Sanitize malformed persisted state before the UI uses it.
  if (!Array.isArray(cart)) cart = [];
  cart = cart.filter(item => item && typeof item.id === "string" && Number.isInteger(item.quantity) && item.quantity > 0);
  if (!Array.isArray(wishlist)) wishlist = [];
  if (!Array.isArray(orders)) orders = [];
  $("#currentYear").textContent = new Date().getFullYear();
  $("#priceValue").textContent = money(maxPrice);
  renderProducts(); renderCart(); renderHeaderCounts(); initEvents();
}
document.addEventListener("DOMContentLoaded", init);
