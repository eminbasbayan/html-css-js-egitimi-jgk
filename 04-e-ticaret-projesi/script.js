const categoriesGridDOM = document.querySelector('.categories-grid');

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

document.addEventListener('DOMContentLoaded', () => {
  fetchCategories();
});

console.log(categoriesGridDOM);
