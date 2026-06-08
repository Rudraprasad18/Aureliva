 
 const products = [
 {
    id: 1,
    name: "Boat Wireless Headphones",
    price: 899.99,
    category: "Electronics",
    description: "High-quality wireless headphones with noise cancellation and 12 hours of battery life.",
    image: "headphone.jpg"
  },
  {
    id: 2,
    name: "Timex Watch",
    price: 2599.99,
    category: "Watch",
    description: "Timeless Style, Unbeatable Deals – Shop the Smart Way!",
    image: "watch 1.jpg"
  },
  {
    id: 3,
    name: "Canon Vintage Camera",
    price: 2799.99,
    category: "Camera",
    description: "Capture timeless photos with this classic vintage camera model.",
    image: "camra.jpg"
  },
  {
    id: 4,
    name: "Nike Sports Shoes",
    price: 899.99,
    category: "Footwear",
    description: "Comfortable and trendy sneakers perfect for daily wear.",
    image: "nike Shoes.jpg"
  },
  {
    id: 5,
    name: "DELL Gaming Laptop",
    price: 89999.99,
    category: "Electronics",
    description: "Unleash elite performance with the Dell G-Series – crafted for gamers who demand power, precision, and pure dominance in every frame.",
    image: "laptop.jpg"
  },
  {
    id: 6,
    name: "Hapillo Smart Watch",
    price: 1499.99,
    category: "Watch",
    description: "Elevate your lifestyle with the next-gen Smartwatch – where luxury design meets intelligent performance, right on your wrist.",
    image: "smartwatch.jpg"
  },
  {
    id: 7,
    name: "Samsung Z Fold 5G",
    price: 139999.99,
    category: "Phone",
    description: "Redefine innovation with the Samsung Z Fold 5G – a masterpiece of foldable elegance and flagship power, designed to unfold your world.",
    image: "mobile.jpg"
  },
  {
    id: 8,
    name: "Nothing Phone 2A",
    price: 17999.99,
    category: "Phone",
    description: "Experience the art of transparency with Nothing Phone 2A – where iconic design meets seamless performance in pure, refined form.",
    image: "Nothing.png"
  },
  {
    id: 9,
    name: "Omega Watch",
    price: 5999.99,
    category: "Watch",
    description: "Timeless elegance meets Swiss precision — Omega, the ultimate symbol of legacy, luxury, and leadership in every tick.",
    image: "omega.jpg"
  },
  {
    id: 10,
    name: "Nike Court Shoes",
    price: 4559.99,
    category: "Footwear",
    description: "Command the court with Nike – where cutting-edge design meets responsive agility, built for those who play with power and purpose.",
    image: "shoess.jpg"
  },{
    id: 11,
    name: "Fire Bott Earbuds",
    price: 799.99,
    category: "Electronics",
    description: "Immerse in pure sonic luxury with Fire-Boltt Airbuds – engineered for bold clarity, seamless connectivity, and all-day elegance.",
    image: "earbuds.jpg"
  },
  {
    id: 12,
    name: "T-Shirt XL",
    price: 299.99,
    category: "Clothing",
    description: "Crafted for comfort, styled for impact – this premium tee blends effortless elegance with everyday versatility.",
    image: "tshirt.jpg"
  },
  {
    id: 13,
    name: "PUMA T-Shirt",
    price: 499.99,
    category: "Clothing",
    description: "Step into sleek with Puma – where sport-inspired design meets bold street style in every stitch of this premium tee.",
    image: "tshirt1.jpg"
  },
  {
    id: 14,
    name: "Timex Watch",
    price: 1999.99,
    category: "Watch",
    description: "Heritage meets modern sophistication — Timex delivers timeless craftsmanship with a bold, refined edge for every moment that matters.",
    image: "watch3.jpg"
  }

];

// Cart state - Initialize from localStorage
let cart = JSON.parse(localStorage.getItem('shopSmartCart')) || {};

function debugCart() {
  console.group("Cart Debug");
  console.log("Cart Object:", cart);
  console.log("LocalStorage:", JSON.parse(localStorage.getItem('shopSmartCart')));
  console.groupEnd();
}
// Call it whenever needed

// Filters and sorting
let selectedCategory = 'All';
let searchTerm = '';
let sortOrder = 'default';

// DOM elements
const productListEl = document.getElementById('product-list');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const btnClearCart = document.getElementById('btnClearCart');
const filterButtonsEl = document.getElementById('filter-buttons');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const cartIcon = document.getElementById('cart-icon');
const cartCountEl = document.getElementById('cart-count');

// Modal elements
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalPrice = document.getElementById('modal-price');
const modalClose = document.getElementById('modal-close');

// Toast container
const toastContainer = document.getElementById('toast-container');

// Utility functions
function formatPrice(value) {
  return '₹' + value.toFixed(2);
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 2800);
}

// Cart storage handling
function saveCartToStorage() {
  localStorage.setItem('shopSmartCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
  const stored = localStorage.getItem('shopSmartCart');
  if (stored) {
    try {
      cart = JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing cart data:', e);
      cart = {};
    }
  }
}

document.getElementById('checkout-btn').addEventListener('click', function() {
  const cartItems = JSON.parse(localStorage.getItem('shopSmartCart')) || [];
  if (cartItems.length > 0) {
    // Redirect to checkout page instead of invoice
    window.location.href = 'checkout.html';
  } else {
    // Show message if cart is empty
    showToast('Your cart is empty. Add some products first!');
  }
});

// Product rendering
function renderFilterButtons() {
  const categories = ['All', ...new Set(products.map(p => p.category))];
  filterButtonsEl.innerHTML = '';
  categories.forEach(category => {
    const btn = document.createElement('button');
    btn.textContent = category;
    btn.dataset.category = category;
    btn.className = category === selectedCategory ? 'active' : '';
    btn.setAttribute('aria-pressed', category === selectedCategory);
    btn.addEventListener('click', () => {
      selectedCategory = category;
      renderFilterButtons();
      renderProducts();
    });
    filterButtonsEl.appendChild(btn);
  });
}

function renderProducts() {
  productListEl.innerHTML = '';
  let filtered = products;

  if (selectedCategory !== 'All') {
    filtered = filtered.filter(p => p.category === selectedCategory);
  }

  if (searchTerm.trim() !== '') {
    const term = searchTerm.trim().toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
  }

  switch (sortOrder) {
    case 'priceAsc': filtered.sort((a, b) => a.price - b.price); break;
    case 'priceDesc': filtered.sort((a, b) => b.price - a.price); break;
    case 'nameAsc': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'nameDesc': filtered.sort((a, b) => b.name.localeCompare(a.name)); break;
  }

  if (filtered.length === 0) {
    productListEl.innerHTML = '<p style="font-weight:600; color:#777;">No products found</p>';
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View details for ${product.name}`);
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" loading="lazy" class="product-image" />
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">${formatPrice(product.price)}</div>
        <button class="btn-add" data-id="${product.id}" aria-label="Add ${product.name} to cart">Add to Cart</button>
      </div>
    `;
    card.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'button') return;
      openProductModal(product.id);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProductModal(product.id);
      }
    });
    productListEl.appendChild(card);
  });
}

// Replace your existing dark mode toggle with this:
document.getElementById('toggle-dark-mode').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  // Save preference to localStorage
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
});

// Add this to your init() function to load preference:
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
}

// Cart operations
function renderCart() {
  cartItemsEl.innerHTML = '';
  const entries = Object.values(cart);
  
  if (entries.length === 0) {
    cartItemsEl.innerHTML = '<p>Your cart is empty.</p>';
    checkoutBtn.disabled = true;
    cartTotalEl.textContent = 'Total: ₹0.00';
    updateCartCount();
    saveCartToStorage();
    return;
  }

  let total = 0;
  entries.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.setAttribute('role', 'listitem');
    itemEl.innerHTML = `
      <span class="cart-item-name">${item.name}</span>
      <span>
        <button class="btn-qty" data-action="decrease" data-id="${item.id}">−</button>
        <span class="cart-item-qty">${item.quantity}</span>
        <button class="btn-qty" data-action="increase" data-id="${item.id}">+</button>
      </span>
      <span class="cart-item-price">${formatPrice(subtotal)}</span>
      <button class="btn-remove" data-id="${item.id}">×</button>
    `;
    cartItemsEl.appendChild(itemEl);
  });

  cartTotalEl.textContent = `Total: ${formatPrice(total)}`;
  checkoutBtn.disabled = false;
  updateCartCount();
  saveCartToStorage();
}

function updateCartCount() {
  const count = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = count;
  cartCountEl.style.display = count > 0 ? 'inline-block' : 'none';
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  if (cart[productId]) {
    cart[productId].quantity++;
  } else {
    cart[productId] = { 
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      quantity: 1 
    };
  }

  renderCart();
  showToast(`Added "${product.name}" to cart`);
}

function removeFromCart(productId) {
  if (!cart[productId]) return;
  const name = cart[productId].name;
  delete cart[productId];
  renderCart();
  showToast(`Removed "${name}" from cart`);
}

function changeQuantity(productId, delta) {
  if (!cart[productId]) return;
  cart[productId].quantity += delta;
  
  if (cart[productId].quantity < 1) {
    removeFromCart(productId);
  } else {
    renderCart();
    showToast(`Updated "${cart[productId].name}" quantity to ${cart[productId].quantity}`);
  }
}

function clearCart() {
  cart = {};
  localStorage.removeItem('shopSmartCart');
  renderCart();
  showToast('Cleared the cart');
}

function handleCheckout() {
  if (Object.keys(cart).length === 0) {
    alert("Your cart is empty!");
    return;
  }
  
  // Convert cart object to array for checkout
  const cartArray = Object.values(cart).map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    category: item.category
  }));
  
  localStorage.setItem('shopSmartCart', JSON.stringify(cartArray));
  window.location.href = 'checkout.html'; 
}

// Modal functions
function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  lastFocusedElement = document.activeElement;
  modalImage.src = product.image;
  modalImage.alt = product.name;
  modalTitle.textContent = product.name;
  modalDescription.textContent = product.description;
  modalPrice.textContent = formatPrice(product.price);
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('active');
  modalClose.focus();
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

let lastFocusedElement;

function trapFocus(e) {
  if (!modal.classList.contains('active')) return;
  
  const focusableElements = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
  const focusables = modal.querySelectorAll(focusableElements);
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  
  if (e.key === 'Tab') {
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  } else if (e.key === 'Escape') {
    closeModal();
  }
}

// Event listeners
function setupEventListeners() {
  // Product list interactions
  productListEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-add')) {
      const id = Number(e.target.getAttribute('data-id'));
      addToCart(id);
    }
  });

  // Cart interactions
  cartItemsEl.addEventListener('click', (e) => {
    const id = Number(e.target.getAttribute('data-id'));
    if (e.target.classList.contains('btn-remove')) {
      removeFromCart(id);
    } else if (e.target.classList.contains('btn-qty')) {
      const action = e.target.getAttribute('data-action');
      if (action === 'increase') changeQuantity(id, 1);
      else if (action === 'decrease') changeQuantity(id, -1);
    }
  });

  // Clear cart button
  btnClearCart.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the cart?')) clearCart();
  });

  // Checkout button (only one handler needed)
  checkoutBtn.addEventListener('click', handleCheckout);

  // Search functionality
  let debounceTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      searchTerm = searchInput.value;
      renderProducts();
    }, 300);
  });

  // Sorting
  sortSelect.addEventListener('change', () => {
    sortOrder = sortSelect.value;
    renderProducts();
  });

  // Modal interactions
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', trapFocus);

  // Cart icon
  cartIcon.addEventListener('click', () => {
    const rect = cartItemsEl.getBoundingClientRect();
    window.scrollTo({
      top: window.pageYOffset + rect.top - 20,
      behavior: 'smooth'
    });
  });
}

// Initialize the app
function init() {
  loadCartFromStorage();
  renderFilterButtons();
  renderProducts();
  renderCart();
  setupEventListeners();
}

document.addEventListener('DOMContentLoaded', init);