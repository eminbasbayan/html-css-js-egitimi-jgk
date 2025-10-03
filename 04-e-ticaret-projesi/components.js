let modal = null;
let modalOverlay = null;
let modalClose = null;
let modalBody = null;

function initModal() {
  // Create modal HTML structure
  const modalHTML = `
      <div class="modal" id="productModal">
        <div class="modal-overlay" id="modalOverlay"></div>
        <div class="modal-content">
          <button class="modal-close" id="modalClose">
            <i class="bi bi-x-lg"></i>
          </button>
          <div class="modal-body" id="modalBody"></div>
        </div>
      </div>
    `;

  // Append to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Get references
  modal = document.getElementById('productModal');
  modalOverlay = document.getElementById('modalOverlay');
  modalClose = document.getElementById('modalClose');
  modalBody = document.getElementById('modalBody');

  // Bind events
  bindModalEvents();
}

function bindModalEvents() {
  // Close modal when clicking close button
  modalClose.addEventListener('click', closeModal);

  // Close modal when clicking overlay
  modalOverlay.addEventListener('click', closeModal);

  // Close modal with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function openModal(content) {
  modalBody.innerHTML = content;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function showProductModal(product, addToCartCallback) {
  const fullStars = Math.floor(product.rating.rate);
  const hasHalfStar = product.rating.rate % 1 >= 0.5;
  let stars = '<i class="bi bi-star-fill"></i>'.repeat(fullStars);
  if (hasHalfStar) stars += '<i class="bi bi-star-half"></i>';
  const emptyStars = 5 - Math.ceil(product.rating.rate);
  stars += '<i class="bi bi-star"></i>'.repeat(emptyStars);

  const content = `
      <div class="modal-product">
        <img src="${product.image}" alt="${product.title}" class="modal-product-image" />
        <div class="modal-product-info">
          <h2>${product.title}</h2>
          <span class="modal-product-category">
            <i class="bi bi-tag"></i> ${product.category}
          </span>
          <div class="modal-product-rating">
            <span class="stars">${stars}</span>
            <span>(${product.rating.count} değerlendirme)</span>
          </div>
          <p class="modal-product-price">₺${product.price}</p>
          <p class="modal-product-description">${product.description}</p>
          <button class="modal-add-to-cart" data-product-id="${product.id}">
            <i class="bi bi-cart-plus"></i> Sepete Ekle
          </button>
        </div>
      </div>
    `;

  openModal(content);

  // Add click event for add to cart button
  const addToCartBtn = modalBody.querySelector('.modal-add-to-cart');
  if (addToCartBtn && addToCartCallback) {
    addToCartBtn.addEventListener('click', () => {
      addToCartCallback(product.id);
      closeModal();
    });
  }
}

// ========== TOOLTIP COMPONENT ==========

function createTooltip(element, text, position = 'top') {
  const tooltip = document.createElement('span');
  tooltip.className = `tooltip tooltip-${position}`;
  tooltip.textContent = text;

  element.style.position = 'relative';
  element.appendChild(tooltip);
}

function initTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');

  tooltipElements.forEach((element) => {
    const text = element.getAttribute('data-tooltip');
    const position = element.getAttribute('data-tooltip-position') || 'top';
    createTooltip(element, text, position);
  });
}

// ========== MOBILE MENU ==========

function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navClose = document.getElementById('navClose');
  const navOverlay = document.getElementById('navOverlay');
  const navMenu = document.querySelector('.nav-menu');

  if (!menuToggle || !navClose || !navOverlay || !navMenu) {
    return;
  }

  // Open menu
  menuToggle.addEventListener('click', () => {
    navMenu.classList.add('active');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Close menu function
  const closeMenu = () => {
    navMenu.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  // Close menu when clicking close button
  navClose.addEventListener('click', closeMenu);

  // Close menu when clicking overlay
  navOverlay.addEventListener('click', closeMenu);

  // Close menu when clicking a nav link
  const navLinks = navMenu.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

export { openModal, closeModal, initModal, showProductModal, initTooltips, createTooltip, initMobileMenu };
