// Bravo Market WebApp frontend (user assortment, images/ folder on frontend)
const API_BASE = "http://127.0.0.1:8000";

let products = [];
let visible = [];
let cart = []; // {id, qty}

const catalogEl = document.getElementById('catalog');
const filters = document.getElementById('filters');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');

const floatingCart = document.getElementById('floating-cart');
const fcCountEl = document.getElementById('fc-count');
const fcTotalEl = document.getElementById('fc-total');

const cartPanel = document.getElementById('cart-panel');
const cartItemsEl = document.getElementById('cart-items');
const cartSumEl = document.getElementById('cart-sum');
const cartCountSmall = document.getElementById('cart-count-2');
const cartCloseBtn = document.getElementById('cart-close-btn');
const clearCartBtn = document.getElementById('clear-cart');
const gotoCheckoutBtn = document.getElementById('goto-checkout');

const modal = document.getElementById('modal');
const modalOrderList = document.getElementById('modal-order-list');
const modalTotal = document.getElementById('modal-total');
const orderForm = document.getElementById('order-form');

const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
if(tg){ tg.expand(); }

function formatRub(v){ return Math.round(v) + ' ₽'; }

async function loadProducts(){
  const r = await fetch(API_BASE + "/api/products");
  const data = await r.json();
  products = data.items || [];
  visible = products.slice();
  renderCatalog(visible);
}

function imgFor(p){
  // Use explicit field if present, else fallback to images/<name>.jpg
  return p.img ? p.img : ("images/" + p.name + ".jpg");
}

function renderCatalog(list){
  catalogEl.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${imgFor(p)}" alt="${p.name}">
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${p.price} ₽/кг</div>
        <button class="btn-add" data-id="${p.id}">В корзину</button>
      </div>
    `;
    card.querySelector('.btn-add').onclick = ()=> addToCart(p.id, 1);
    catalogEl.appendChild(card);
  });
}

function addToCart(id, qty){
  const item = cart.find(x => x.id === id);
  if(item) item.qty += qty;
  else cart.push({id, qty});
  renderCart();
  floatingCart.classList.add('active');
}

function removeFromCart(id){
  cart = cart.filter(i => i.id !== id);
  renderCart();
  if(cart.length === 0) floatingCart.classList.remove('active');
}

function renderCart(){
  cartItemsEl.innerHTML = '';
  let sum = 0;
  let count = 0;
  cart.forEach(ci => {
    const p = products.find(x => x.id === ci.id);
    if(!p) return;
    sum += p.price * ci.qty;
    count += ci.qty;
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div>
        <div style="font-weight:700">${p.name}</div>
        <div class="small" style="color:var(--muted)">${ci.qty} кг • ${formatRub(p.price*ci.qty)}</div>
      </div>
      <button style="background:transparent;border:0;cursor:pointer;color:#e74c3c" data-remove="${ci.id}">✕</button>
    `;
    row.querySelector('[data-remove]').onclick = ()=> removeFromCart(ci.id);
    cartItemsEl.appendChild(row);
  });
  cartSumEl.textContent = formatRub(sum);
  cartCountSmall.textContent = count;
  fcCountEl.textContent = count + ' поз.';
  fcTotalEl.textContent = formatRub(sum);
}

if(floatingCart) floatingCart.onclick = ()=> cartPanel.classList.add('active');
if(cartCloseBtn) cartCloseBtn.onclick = ()=> cartPanel.classList.remove('active');
if(clearCartBtn) clearCartBtn.onclick = ()=> { cart = []; renderCart(); cartPanel.classList.remove('active'); floatingCart.classList.remove('active'); };
if(gotoCheckoutBtn) gotoCheckoutBtn.onclick = ()=> openCheckout();

function openCheckout(){
  if(cart.length === 0){ alert('Корзина пуста'); return; }
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden','false');
  modalOrderList.innerHTML = '';
  let sum = 0;
  cart.forEach(ci => {
    const p = products.find(x => x.id === ci.id);
    if(!p) return;
    const el = document.createElement('div');
    el.style.padding = '6px 4px';
    el.innerHTML = `<div style="font-weight:700">${p.name}</div><div style="color:var(--muted)">${ci.qty} кг • ${formatRub(p.price*ci.qty)}</div>`;
    modalOrderList.appendChild(el);
    sum += p.price * ci.qty;
  });
  modalTotal.textContent = formatRub(sum);
}

document.getElementById('close-modal').onclick = ()=> { modal.style.display='none'; modal.setAttribute('aria-hidden','true'); };

if(orderForm) orderForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  if(cart.length === 0){ alert('Корзина пуста'); return; }
  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const city = document.getElementById('cust-city').value.trim();
  const street = document.getElementById('cust-street').value.trim();
  const house = document.getElementById('cust-house').value.trim();
  const apt = document.getElementById('cust-apartment').value.trim();
  const time = document.getElementById('delivery-time').value === 'custom' ? (document.getElementById('custom-time').value || '—') : 'Как можно скорее';
  const email = document.getElementById('cust-email').value.trim();
  const payment = document.getElementById('payment-method').value;

  const initData = tg ? tg.initData : ""; // signed data from Telegram
  const payload = {
    init_data: initData,
    items: cart.map(i => ({ id: i.id, qty: i.qty })),
    customer: { name, phone, city, street, house, apt, time, email, payment }
  };

  try{
    const r = await fetch(API_BASE + "/api/order", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    });
    if(!r.ok) throw new Error("Order failed");
    alert("Заказ отправлен! Мы свяжемся с вами.");
    cart = [];
    renderCart();
    modal.style.display='none';
    cartPanel.classList.remove('active');
    floatingCart.classList.remove('active');
  }catch(err){
    console.error(err);
    alert("Не удалось отправить заказ. Проверьте подключение.");
  }
});

// Filters & search
if(filters){
  filters.addEventListener('click', (e)=>{
    const b = e.target.closest('.pill');
    if(!b) return;
    const f = b.dataset.filter;
    document.querySelectorAll('#filters .pill').forEach(x=> x.classList.toggle('active', x===b));
    applySearchSort(f);
  });
}
if(searchInput) searchInput.addEventListener('input', ()=> applySearchSort());
if(sortSelect) sortSelect.addEventListener('change', ()=> applySearchSort());

function applySearchSort(filter=''){
  const q = (searchInput && searchInput.value || '').toLowerCase().trim();
  let list = products.slice();
  if(filter && filter !== 'all') list = list.filter(p => p.category === filter);
  if(q) list = list.filter(p => p.name.toLowerCase().includes(q));
  const s = (sortSelect && sortSelect.value) || 'default';
  if(s === 'price_asc') list.sort((a,b)=> a.price-b.price);
  else if(s === 'price_desc') list.sort((a,b)=> b.price-a.price);
  else if(s === 'name_asc') list.sort((a,b)=> a.name.localeCompare(b.name,'ru'));
  else if(s === 'name_desc') list.sort((a,b)=> b.name.localeCompare(a.name,'ru'));
  visible = list;
  renderCatalog(visible);
}

// Init
loadProducts();
