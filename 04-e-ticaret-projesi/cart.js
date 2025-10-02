const cartCountDOM = document.querySelector('.cart-count');
const cartItemsListDOM = document.querySelector('#cartItemsList');
const cartContainerDOM = document.querySelector('#cartContainer');
const emptyCartDOM = document.querySelector('#emptyCart');

let cartItems = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

function displayCartItems(cartItems) {
  console.log(cartItems);
  if (cartItems.length) emptyCartDOM.style.display = 'none';
  cartContainerDOM.style.display = 'block';
  cartItemsListDOM.innerHTML = cartItems
    .map((cartItem) => {
      const fullStars = Math.floor(cartItem.rating.rate);
      const hasHalfStar = cartItem.rating.rate % 1 >= 0.5;
      let stars = '<i class="bi bi-star-fill"></i>'.repeat(fullStars);
      if (hasHalfStar) stars += '<i class="bi bi-star-half"></i>';
      const emptyStars = 5 - Math.ceil(cartItem.rating.rate);
      stars += '<i class="bi bi-star"></i>'.repeat(emptyStars);

      return `<div class="product-card">
      <img
        src="${cartItem.image}"
        alt="${cartItem.title}"
        class="product-image"
      />
      <div class="product-info">
        <p class="product-category">
          <i class="bi bi-tag"></i> ${cartItem.category}
        </p>
        <h3 class="product-title">${cartItem.title}</h3>
        <div class="product-rating">
          <span class="stars">${stars}</span>
          <span>(${cartItem.rating.count})</span>
        </div>
        <p class="product-price">₺${cartItem.price}</p>
        <button class="remove-from-cart" onclick="removeFromCart(${cartItem.id})">
          <i class="bi bi-trash"></i> Sepetten Çıkar
        </button>
      </div>
    </div>`;
    })
    .join('');
}

function removeFromCart(cartItemId) {
  cartItems = cartItems.filter((cartItem) => cartItem.id !== cartItemId);
  displayCartItems(cartItems);

  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  cartCountDOM.textContent = cartItems.length;
}

document.addEventListener('DOMContentLoaded', () => {
  cartCountDOM.textContent = cartItems.length;
  displayCartItems(cartItems);
});
