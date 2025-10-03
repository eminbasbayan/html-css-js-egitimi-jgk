import {
  initModal,
  showProductModal,
} from './components.js';

const categoriesGridDOM = document.querySelector('.categories-grid');
const productsGridDOM = document.querySelector('.products-grid');
const filterButtons = document.getElementById('filterButtons');
const cartBtnDOM = document.querySelector('.cart');
const cartCountDOM = document.querySelector('.cart-count');

cartBtnDOM.addEventListener('click', () => {
  window.location.href = './cart.html';
});

// State
let allProducts = [];
let currentCategory = 'all';
let cartItems = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const API_URL = 'https://fakestoreapi.com';

const categoryIcons = {
  electronics: 'bi-laptop',
  jewelery: 'bi-gem',
  "men's clothing": 'bi-person',
  "women's clothing": 'bi-handbag',
};

async function fetchCategories() {
  try {
    const res = await fetch('https://fakestoreapi.com/products/categories');
    const categories = await res.json();

    displayCategories(categories);

    createFilterButtons(['all', ...categories]);
  } catch (error) {
    console.log(error);
    alert('Veri yüklenirken hata oldu: ' + error);
  }
}

function displayCategories(categories) {
  categoriesGridDOM.innerHTML = categories
    .map((category) => {
      const icon = categoryIcons[category];
      return `
      <div class="category-card" onclick="filterByCategory(\`${category}\`)">
        <i class="bi ${icon}"></i>
      <h3>${category}</h3>
    </div>
    `;
    })
    .join('');
}

async function fetchProducts() {
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    allProducts = await res.json();
    console.log(allProducts);
    displayProducts(allProducts);
  } catch (error) {
    console.log(error);
    alert('Veri yüklenirken hata oldu: ' + error);
  }
}

function displayProducts(products) {
  productsGridDOM.innerHTML = products
    .map((product) => {
      const fullStars = Math.floor(product.rating.rate);
      const hasHalfStar = product.rating.rate % 1 >= 0.5;
      let stars = '<i class="bi bi-star-fill"></i>'.repeat(fullStars);
      if (hasHalfStar) stars += '<i class="bi bi-star-half"></i>';
      const emptyStars = 5 - Math.ceil(product.rating.rate);
      stars += '<i class="bi bi-star"></i>'.repeat(emptyStars);

      return `<div class="product-card" data-product-id="${product.id}" style="cursor: pointer;">
    <img
      src="${product.image}"
      alt="${product.title}"
      class="product-image"
    />
    <div class="product-info">
      <p class="product-category">
        <i class="bi bi-tag"></i> ${product.category}
      </p>
      <h3 class="product-title">${product.title}</h3>
      <div class="product-rating">
        <span class="stars">${stars}</span>
        <span>(${product.rating.count})</span>
      </div>
      <p class="product-price">₺${product.price}</p>
      <button class="add-to-cart" data-product-id="${product.id}">
        <i class="bi bi-cart-plus"></i> Sepete Ekle
      </button>
    </div>
  </div>`;
    })
    .join('');

  attachProductCardListeners();
}

function attachProductCardListeners() {
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      // Sepete ekle butonuna tıklanmışsa modal açma
      if (e.target.closest('.add-to-cart')) {
        e.stopPropagation();
        const productId = parseInt(
          e.target.closest('.add-to-cart').dataset.productId
        );
        addToCart(productId);
        return;
      }

      // Ürün kartına tıklanmışsa modal aç
      const productId = parseInt(card.dataset.productId);
      const product = allProducts.find((p) => p.id === productId);
      if (product) {
        showProductModal(product, addToCart);
      }
    });
  });
}

function createFilterButtons(categories) {
  filterButtons.innerHTML = categories
    .map(
      (category) => `
        <button class="filter-btn ${
          category === 'all' ? 'active' : ''
        }" onclick="filterByCategory(\`${category}\`)">
            ${category === 'all' ? 'Tümü' : category}
        </button>
    `
    )
    .join('');
}

async function filterByCategory(category) {
  currentCategory = category;

  // Update active button
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.classList.remove('active');
    if (btn.textContent.trim() === (category === 'all' ? 'Tümü' : category)) {
      btn.classList.add('active');
    }
  });

  productsGridDOM.innerHTML = `<div class="loading">
  <i class="bi bi-hourglass-split"></i> Yükleniyor...
</div>`;

  try {
    let products;
    if (category === 'all') {
      products = allProducts;
    } else {
      const response = await fetch(`${API_URL}/products/category/${category}`);
      products = await response.json();
    }

    displayProducts(products);
  } catch (error) {
    console.log(error);
  }
}

function addToCart(productId) {
  //   localStorage.setItem("fullName", JSON.stringify("Emin Başbayan"));
  //   localStorage.setItem("email", JSON.stringify("mail@mail.com"));
  // localStorage.removeItem("fullName");
  // localStorage.clear()

  let findProduct = allProducts.find((product) => product.id === productId);

  const findCarItem = cartItems.find((cartItem) => cartItem.id === productId);

  if (findCarItem) {
    cartItems = cartItems.map((cartItem) => {
      if (cartItem.id === findCarItem.id) {
        return {
          ...cartItem,
          quantity: cartItem.quantity + 1,
        };
      }
      return cartItem;
    });

    // findProduct = { ...findProduct, quantity: findCarItem.quantity + 1 };
    // cartItems = [...cartItems, findProduct];
  } else {
    cartItems = [...cartItems, { ...findProduct, quantity: 1 }];
  }

  console.log(cartItems);

  cartCountDOM.textContent = cartItems.length;

  // alert(`${findProduct.title} Ürünü ` + 'Sepete Eklendi!');

  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

document.addEventListener('DOMContentLoaded', () => {
  cartCountDOM.textContent = cartItems.length;
  initModal();
  fetchCategories();
  fetchProducts();
});
