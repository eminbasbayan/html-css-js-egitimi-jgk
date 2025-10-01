const categoriesGridDOM = document.querySelector('.categories-grid');
const productsGridDOM = document.querySelector('.products-grid');
const filterButtons = document.getElementById('filterButtons');

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

    createFilterButtons(categories);
  } catch (error) {
    console.log(error);
    alert('Veri yüklenirken hata oldu: ' + error);
  }
}

function displayCategories(categories) {
  categoriesGridDOM.innerHTML = categories
    .map((category) => {
      const icon = categoryIcons[category];
      return `<div class="category-card">
        <i class="bi ${icon}"></i>
      <h3>${category}</h3>
    </div>`;
    })
    .join('');
}

async function fetchProducts() {
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    const products = await res.json();

    displayProducts(products);
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
      <button class="add-to-cart">
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
        <button class="filter-btn ${category === 'all' ? 'active' : ''}">
            ${category === 'all' ? 'Tümü' : category}
        </button>
    `
    )
    .join('');
}

document.addEventListener('DOMContentLoaded', () => {
  fetchCategories();
  fetchProducts();
});
