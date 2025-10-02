const categoriesGridDOM = document.querySelector('.categories-grid');
const productsGridDOM = document.querySelector('.products-grid');
const filterButtons = document.getElementById('filterButtons');

// State
let allProducts = [];
let currentCategory = 'all';
let cartItems = [];

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

      return `<div class="product-card">
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
      <button class="add-to-cart" onclick="addToCart(${product.id})">
        <i class="bi bi-cart-plus"></i> Sepete Ekle
      </button>
    </div>
  </div>`;
    })
    .join('');
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

  const cartCountDOM = document.querySelector('.cart-count');

  cartCountDOM.textContent = cartItems.length;

  // alert(`${findProduct.title} Ürünü ` + 'Sepete Eklendi!');
}

document.addEventListener('DOMContentLoaded', () => {
  fetchCategories();
  fetchProducts();
});
