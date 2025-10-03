import { initModal, showProductModal } from './components.js';

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
      const itemTotal = (cartItem.price * cartItem.quantity).toFixed(2);

      return `<tr data-product-id="${cartItem.id}">
        <td>
          <div class="cart-item-product">
            <img
              src="${cartItem.image}"
              alt="${cartItem.title}"
              class="cart-item-image"
            />
            <div class="cart-item-details">
              <h4>${cartItem.title}</h4>
              <span class="cart-item-category">
                <i class="bi bi-tag"></i> ${cartItem.category}
              </span>
            </div>
          </div>
        </td>
        <td>
          <span class="cart-item-price">₺${cartItem.price.toFixed(2)}</span>
        </td>
        <td>
          <div class="cart-item-quantity">
            <button class="quantity-btn" onclick="updateQuantity(${cartItem.id}, 0)">
              <i class="bi bi-dash"></i>
            </button>
            <span class="quantity-value">${cartItem.quantity}</span>
            <button class="quantity-btn" onclick="updateQuantity(${cartItem.id}, 1)">
              <i class="bi bi-plus"></i>
            </button>
          </div>
        </td>
        <td>
          <span class="cart-item-total">₺${itemTotal}</span>
        </td>
        <td>
          <button class="cart-item-remove" onclick="removeFromCart(${cartItem.id})">
            <i class="bi bi-trash"></i> Sil
          </button>
        </td>
      </tr>`;
    })
    .join('');

  attachProductCardListeners();
}

function attachProductCardListeners() {
  const productRows = document.querySelectorAll('tr[data-product-id]');

  productRows.forEach((row) => {
    row.addEventListener('click', (e) => {
      // Butonlara tıklanmışsa modal açma
      if (e.target.closest('.quantity-btn') || e.target.closest('.cart-item-remove')) {
        return;
      }

      // Ürün satırına tıklanmışsa modal aç
      const productId = parseInt(row.dataset.productId);
      const product = cartItems.find((p) => p.id === productId);
      if (product) {
        showProductModal(product);
      }
    });
  });
}

window.updateQuantity = function(cartItemId, value) {
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
      } else {
        return;
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
  totalItems(cartItems);
  cartCountDOM.textContent = cartItems.length;
}

window.removeFromCart = function(cartItemId) {
  if (!confirm('Ürünü sepetten çıkarmak istediğinize emin misiniz?')) {
    return;
  }

  cartItems = cartItems.filter((cartItem) => cartItem.id !== cartItemId);
  displayCartItems(cartItems);

  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  cartCountDOM.textContent = cartItems.length;

  emptyCart(cartItems);
  cartTotal(cartItems);
  totalItems(cartItems);
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
  initModal();
  cartTotal(cartItems);
  totalItems(cartItems);
});
