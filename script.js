const menu = [
  { id: 1, name: 'Chicken Shawarma', price: 12, category: 'Wraps', desc: 'Garlic sauce, pickles, fries.', image: 'assets/ac7nyu1f7.webp' },
  { id: 2, name: 'Mix Grill Plate', price: 34, category: 'Grills', desc: 'Kebab, tikka, grilled chicken.', image: 'assets/ac7n6uwv0.webp' },
  { id: 3, name: 'Zinger Wrap', price: 16, category: 'Wraps', desc: 'Crispy chicken, lettuce, mayo.', image: 'assets/ac7nyu1f7.webp' },
  { id: 4, name: 'Family Meal Box', price: 79, category: 'Family', desc: 'Wraps, fries, drinks for 4.', image: 'assets/a90zx6u0e.webp' },
  { id: 5, name: 'Loaded Fries', price: 14, category: 'Sides', desc: 'Cheese sauce + jalapeno.', image: 'assets/a90zx6u0e.webp' },
  { id: 6, name: 'Grilled Chicken Meal', price: 28, category: 'Grills', desc: 'Quarter chicken + rice.', image: 'assets/ac7n6uwv0.webp' }
];

const phone = '971500000000';
const quickMsg = 'Hi Al Noor Kitchen, I want to place an order. Please share delivery time.';
document.getElementById('waQuickOrderBtn').href = `https://wa.me/${phone}?text=${encodeURIComponent(quickMsg)}`;

let currentCategory = 'All';
const cart = {};

const categories = ['All', ...new Set(menu.map(i => i.category))];
const categoriesEl = document.getElementById('categories');
const itemsEl = document.getElementById('items');
const cartBtn = document.getElementById('cartBtn');
const cartCountEl = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsEl = document.getElementById('cartItems');
const cartSubtotalEl = document.getElementById('cartSubtotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');

function renderCategories() {
  categoriesEl.innerHTML = categories.map(c => `<button class="chip ${c===currentCategory?'active':''}" data-cat="${c}">${c}</button>`).join('');
}

function renderMenu() {
  const filtered = currentCategory === 'All' ? menu : menu.filter(m => m.category === currentCategory);
  itemsEl.innerHTML = filtered.map(i => `
    <article class="item">
      <div class="item-img-wrap"><img class="item-img" src="${i.image}" alt="${i.name}" /></div>
      <h4>${i.name}</h4>
      <p>${i.desc}</p>
      <div class="row">
        <b>AED ${i.price}</b>
        <button class="btn" data-add="${i.id}">Add</button>
      </div>
    </article>
  `).join('');
}

function subtotal() {
  return Object.entries(cart).reduce((sum,[id,qty]) => {
    const item = menu.find(m=>m.id===Number(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);
}

function totalItems() {
  return Object.values(cart).reduce((a,b)=>a+b,0);
}

function renderCart() {
  const entries = Object.entries(cart).filter(([,q])=>q>0);
  cartCountEl.textContent = totalItems();

  if (!entries.length) {
    cartItemsEl.innerHTML = '<p class="muted">Your cart is empty.</p>';
    cartSubtotalEl.textContent = 'AED 0';
    return;
  }

  cartItemsEl.innerHTML = entries.map(([id, qty]) => {
    const item = menu.find(m => m.id === Number(id));
    return `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <small>AED ${item.price} each</small>
        </div>
        <div class="qty">
          <button data-dec="${id}">-</button>
          <span>${qty}</span>
          <button data-inc="${id}">+</button>
        </div>
      </div>
    `;
  }).join('');

  cartSubtotalEl.textContent = `AED ${subtotal()}`;
}

function openCart() { cartDrawer.classList.add('open'); overlay.hidden = false; cartDrawer.setAttribute('aria-hidden','false'); }
function closeCart() { cartDrawer.classList.remove('open'); overlay.hidden = true; cartDrawer.setAttribute('aria-hidden','true'); }

function checkoutWhatsApp() {
  const entries = Object.entries(cart).filter(([,q])=>q>0);
  if (!entries.length) return alert('Cart is empty');

  const lines = entries.map(([id, qty]) => {
    const item = menu.find(m => m.id === Number(id));
    return `- ${item.name} x${qty} (AED ${item.price * qty})`;
  });

  const msg = [
    'Hi Al Noor Kitchen, I want to place this order:',
    ...lines,
    `Subtotal: AED ${subtotal()}`,
    'Please confirm delivery time and total with charges.'
  ].join('\n');

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
}

categoriesEl.addEventListener('click', (e) => {
  const cat = e.target.getAttribute('data-cat');
  if (!cat) return;
  currentCategory = cat;
  renderCategories();
  renderMenu();
});

itemsEl.addEventListener('click', (e) => {
  const id = e.target.getAttribute('data-add');
  if (!id) return;
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  openCart();
});

cartItemsEl.addEventListener('click', (e) => {
  const inc = e.target.getAttribute('data-inc');
  const dec = e.target.getAttribute('data-dec');
  if (inc) cart[inc] = (cart[inc] || 0) + 1;
  if (dec) {
    cart[dec] = Math.max((cart[dec] || 0) - 1, 0);
    if (cart[dec] === 0) delete cart[dec];
  }
  renderCart();
});

cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
checkoutBtn.addEventListener('click', checkoutWhatsApp);
clearCartBtn.addEventListener('click', () => { Object.keys(cart).forEach(k=>delete cart[k]); renderCart(); });

renderCategories();
renderMenu();
renderCart();