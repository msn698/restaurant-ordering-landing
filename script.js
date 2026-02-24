const menu = [
  { name: 'Chicken Shawarma', price: 12 },
  { name: 'Mix Grill Plate', price: 34 },
  { name: 'Zinger Wrap', price: 16 },
  { name: 'Family Meal Box', price: 79 }
];

const phone = '971500000000';
const defaultOrder = menu.slice(0,2).map(i => `${i.name} x1`).join(', ');
const msg = `Hi Al Noor Kitchen, I want to order: ${defaultOrder}. Please confirm delivery time.`;
const wa = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

document.getElementById('waOrderBtn').href = wa;

document.getElementById('items').innerHTML = menu.map(i => `
  <article class="item">
    <h4>${i.name}</h4>
    <b>AED ${i.price}</b>
  </article>
`).join('');