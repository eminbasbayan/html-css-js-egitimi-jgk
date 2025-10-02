const cartCountDOM = document.querySelector('.cart-count');
const cartItemsListDOM = document.getElementById('cartItemsList');
const cartContainerDOM = document.getElementById('cartContainer');
const emptyCartDOM = document.getElementById('emptyCart');
const subtotalDOM = document.getElementById('subtotal');
const shippingDOM = document.getElementById('shipping');
const taxDOM = document.getElementById('tax');
const grandTotalDOM = document.getElementById('grandTotal');
const totalItemsDOM = document.getElementById('totalItems');

let cartItems = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];
let araToplam = 0;
const kargoBedeli = 35;
const KDV = 20;
let genelToplam = 0;

function emptyCart(cartItems) {
  if (cartItems.length) {
    cartContainerDOM.style.display = 'block';
    emptyCartDOM.style.display = 'none';
  } else {
    emptyCartDOM.style.display = 'block';
    cartContainerDOM.style.display = 'none';
  }
}

function displayCartItems(cartItems) {
  emptyCart(cartItems);

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
        <div class="product-quantity-container">
        <button onclick="updateQuantity(${cartItem.id}, 1)">+</button>
        <strong class="product-price">${cartItem.quantity}</strong>
        <button onclick="updateQuantity(${cartItem.id}, 0)">-</button>
        </div>
        <button class="remove-from-cart" onclick="removeFromCart(${cartItem.id})">
          <i class="bi bi-trash"></i> Sepetten Çıkar
        </button>
      </div>
    </div>`;
    })
    .join('');
}

function updateQuantity(cartItemId, value) {
  const findCartItem = cartItems.find((item) => item.id === cartItemId);

  if (value === 1) {
    cartItems = cartItems.map((cartItem) => {
      if (cartItem.id === cartItemId) {
        return {
          ...cartItem,
          quantity: cartItem.quantity + 1,
        };
      }
      return cartItem;
    });
  }
  if (value === 0) {
    if (findCartItem.quantity === 1) {
      if (confirm('Ürünü Silme İçin Emin Misin?')) {
        cartItems = cartItems.filter((item) => item.id !== cartItemId);
      }
    } else {
      cartItems = cartItems.map((cartItem) => {
        if (cartItem.id === cartItemId) {
          return {
            ...cartItem,
            quantity: cartItem.quantity - 1,
          };
        }
        return cartItem;
      });
    }
  }
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  cartTotal(cartItems);
  displayCartItems(cartItems);
  totalItems(cartItems)
}

function removeFromCart(cartItemId) {
  cartItems = cartItems.filter((cartItem) => cartItem.id !== cartItemId);
  displayCartItems(cartItems);

  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  cartCountDOM.textContent = cartItems.length;
  console.log(cartItems.length);

  emptyCart(cartItems);
  cartTotal(cartItems);
  totalItems(cartItems)
}

function cartTotal(cartItems) {
  if (cartItems.length) {
    araToplam = cartItems.reduce((toplam, eleman) => {
      return toplam + eleman.quantity * eleman.price;
    }, 0);
    const kdvToplam = (araToplam * KDV) / 100;
    subtotalDOM.innerText = `₺${araToplam.toFixed(2)}`;
    taxDOM.innerText = `${kdvToplam.toFixed(2)}`;
    shippingDOM.innerText = `₺${kargoBedeli}`;
    genelToplam = kdvToplam + araToplam + kargoBedeli;
    grandTotalDOM.innerText = `₺${genelToplam.toFixed(2)}`;
  } else {
    subtotalDOM.innerText = `₺${araToplam}`;
    taxDOM.innerText = `₺0`;
    shippingDOM.innerText = `₺${kargoBedeli}`;
  }
}

function totalItems(cartItems) {
  totalItemsDOM.innerText = cartItems.reduce((toplam, eleman) => {
    return toplam + eleman.quantity;
  }, 0);
}

document.addEventListener('DOMContentLoaded', () => {
  cartCountDOM.textContent = cartItems.length;
  displayCartItems(cartItems);
  cartTotal(cartItems);
  totalItems(cartItems);
});
