// ======================= script.js =======================
// Bravo Market - frontend logic + admin notifications via Telegram API (fetch)
// IMPORTANT: Replace BOT_TOKEN and ADMIN_ID below with your own values before running.
// DO NOT commit your real token to public repos.

const BOT_TOKEN = "8269137514:AAHj6mSZgHb1w9S85GAjlP1249O9RceZBsM";   // <<< Замените на токен вида 12345:ABC...
const ADMIN_ID  = "681085718";    // <<< Замените на числовой Telegram ID администратора

// -------------------- Data: products + KBJU/descriptions --------------------
const products = [
  // Minimal sample list — расширьте / обновите названия, цены и пути к изображениям по необходимости
  { id: 1, name: "Арбуз", price: 40, category: "fruits", img: "images/arbuz.jpg",
    kbju: "30 ккал • Б 0.6 г • Ж 0.2 г • У 7.6 г",
    desc: "💚 Освежающий и богатый ликопином фрукт, помогает выводить токсины и поддерживает водный баланс." },
  { id: 2, name: "Груша", price: 340, category: "fruits", img: "images/grusha.jpg",
    kbju: "57 ккал • Б 0.4 г • Ж 0.4 г • У 15 г",
    desc: "🍐 Отличный источник клетчатки, поддерживает здоровое пищеварение и снижает уровень холестерина." },
  { id: 3, name: "Апельсин", price: 220, category: "fruits", img: "images/apelsin.jpg",
    kbju: "47 ккал • Б 0.9 г • Ж 0.1 г • У 11.8 г",
    desc: "🍊 Мощный заряд витамина C, укрепляет иммунитет." },
  { id: 4, name: "Помидоры Азербайджанские", price: 220, category: "vegetables", img: "images/pomidory.jpg",
    kbju: "18 ккал • Б 0.9 г • Ж 0.2 г • У 3.9 г",
    desc: "🍅 Богаты ликопином, поддерживают сердце и защищают клетки от старения." },
  { id: 5, name: "Банан", price: 170, category: "fruits", img: "images/banan.jpg",
    kbju: "89 ккал • Б 1.1 г • Ж 0.3 г • У 23 г",
    desc: "🍌 Источник калия и магния — поддерживает сердце и нервную систему." },
  // Добавьте остальные продукты и заполните поля img/kbju/desc по своему списку...
];

// -------------------- State --------------------
let visibleProducts = products.slice();
let cart = []; // { id, name, price, qty }
let currentFilter = 'all';
let loyaltyPoints = Number(localStorage.getItem('bm_loyalty') || 0);
let currentUser = JSON.parse(localStorage.getItem('bm_user') || 'null'); // {name,phone,telegramId(optional)}

// -------------------- Elements --------------------
const catalogEl = document.getElementById('catalog');
const shownCountEl = document.getElementById('shown-count');
const filtersWrap = document.getElementById('filters');
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
const loyaltyBadge = document.getElementById('loyalty-badge');

const heroOrderBtn = document.getElementById('hero-order');
const viewCatalogBtn = document.getElementById('view-catalog');

// -------------------- Helpers --------------------
function formatRub(v){ return Math.round(v) + ' ₽'; }
function displayQty(kg){ if(kg<1) return Math.round(kg*1000) + ' г'; return kg.toFixed(2) + ' кг'; }
function findCartItem(id){ return cart.find(c => c.id === id); }
function saveUser(){ localStorage.setItem('bm_user', JSON.stringify(currentUser)); }
function saveLoyalty(){ localStorage.setItem('bm_loyalty', String(loyaltyPoints)); }

// -------------------- Render catalog --------------------
function renderCatalog(list){
  if(!catalogEl) return;
  catalogEl.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${p.price} ₽/кг</div>
        <button class="btn-add" data-id="${p.id}">В корзину</button>
      </div>
    `;
    // click on image/name opens product modal (but not when pressing add button)
    card.addEventListener('click', (e) => {
      if(e.target.closest('.btn-add')) return;
      openProductModal(p);
    });
    // add-to-cart button
    card.querySelector('.btn-add').addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(p,1);
    });
    catalogEl.appendChild(card);
  });
  if(shownCountEl) shownCountEl.textContent = list.length;
}

// -------------------- Filters, Search, Sort --------------------
function applySearchAndSort(){
  const q = (searchInput && searchInput.value || '').trim().toLowerCase();
  let list = (currentFilter === 'all' || !currentFilter) ? products.slice() : products.filter(p => p.category === currentFilter);
  if(q) list = list.filter(p => (p.name + ' ' + (p.desc||'')).toLowerCase().includes(q));
  const s = (sortSelect && sortSelect.value) || 'default';
  if(s === 'price_asc') list.sort((a,b)=> a.price-b.price);
  else if(s === 'price_desc') list.sort((a,b)=> b.price-a.price);
  else if(s === 'name_asc') list.sort((a,b)=> a.name.localeCompare(b.name,'ru'));
  else if(s === 'name_desc') list.sort((a,b)=> b.name.localeCompare(a.name,'ru'));
  visibleProducts = list;
  renderCatalog(visibleProducts);
}

// wire filters/search/sort if exist
if(filtersWrap){
  filtersWrap.addEventListener('click', (e) => {
    const b = e.target.closest('.filter-btn');
    if(!b) return;
    const f = b.dataset.filter || 'all';
    currentFilter = f;
    // visual
    document.querySelectorAll('#filters .filter-btn').forEach(x => x.classList.toggle('active', x === b));
    applySearchAndSort();
  });
}
if(searchInput) searchInput.addEventListener('input', ()=> applySearchAndSort());
if(sortSelect) sortSelect.addEventListener('change', ()=> applySearchAndSort());

// -------------------- Cart logic --------------------
function addToCart(product, qty=1){
  const existing = findCartItem(product.id);
  if(existing) existing.qty += qty;
  else cart.push({ id: product.id, name: product.name, price: product.price, qty: qty });
  renderCart();
  // show floating cart on first item
  if(floatingCart) floatingCart.classList.add('active');
}

function removeFromCart(id){
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

function clearCart(){
  cart = [];
  renderCart();
  if(floatingCart) floatingCart.classList.remove('active');
}

function renderCart(){
  if(!cartItemsEl) return;
  cartItemsEl.innerHTML = '';
  let sum = 0;
  let count = 0;
  cart.forEach(item => {
    sum += item.price * item.qty;
    count += item.qty;
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div class="left">
        <div style="font-weight:700">${item.name}</div>
        <div class="small" style="color:var(--muted)">${item.qty} кг • ${formatRub(item.price * item.qty)}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
        <button style="background:transparent;border:0;cursor:pointer;color:${'#e74c3c'}" data-remove="${item.id}">✕</button>
        <div style="font-weight:700">${formatRub(item.price * item.qty)}</div>
      </div>
    `;
    cartItemsEl.appendChild(row);
  });

  if(cartSumEl) cartSumEl.textContent = formatRub(sum);
  if(cartCountSmall) cartCountSmall.textContent = count;
  if(fcCountEl) fcCountEl.textContent = count + ' поз.';
  if(fcTotalEl) fcTotalEl.textContent = formatRub(sum);

  // attach remove handlers
  cartItemsEl.querySelectorAll('[data-remove]').forEach(btn => btn.onclick = ()=> removeFromCart(+btn.dataset.remove));
}

// -------------------- Floating cart & panel --------------------
if(floatingCart) floatingCart.addEventListener('click', ()=> showCartPanel());
if(cartCloseBtn) cartCloseBtn.addEventListener('click', ()=> hideCartPanel());

function showCartPanel(){ cartPanel.classList.add('active'); if(floatingCart) floatingCart.classList.remove('active'); }
function hideCartPanel(){ cartPanel.classList.remove('active'); if(floatingCart) floatingCart.classList.add('active'); }

// clicking outside panel to close
document.addEventListener('click', (e)=> {
  if(!cartPanel.classList.contains('active')) return;
  if(e.target.closest('#cart-panel') || e.target.closest('#floating-cart')) return;
  hideCartPanel();
});

// clear cart
if(clearCartBtn) clearCartBtn.addEventListener('click', ()=> { clearCart(); hideCartPanel(); });

// go to checkout
if(gotoCheckoutBtn) gotoCheckoutBtn.addEventListener('click', ()=> {
  if(cart.length === 0){ alert('Корзина пуста — добавьте товары.'); return; }
  openCheckoutModal();
});

// -------------------- Product modal (KBJU + details) --------------------
function openProductModal(product){
  // create modal markup
  const pm = document.createElement('div');
  pm.className = 'modal active';
  pm.innerHTML = `
    <div class="panel">
      <button class="close-product" style="float:right;background:none;border:0;font-size:18px;cursor:pointer">✕</button>
      <h3 style="margin-top:0">${product.name}</h3>
      <img src="${product.img}" alt="${product.name}" style="width:100%;max-height:220px;object-fit:cover;border-radius:8px;margin:8px 0">
      <div style="font-weight:700">В 100 граммах</div>
      <div style="margin-top:6px">${product.kbju}</div>
      <button class="btn-secondary" id="toggle-more" style="margin-top:10px;width:100%;">Подробнее о товаре</button>
      <div id="more-desc" style="margin-top:8px;display:none;padding:8px;border-radius:8px;border:1px solid var(--border);background:#fafafa">${product.desc || 'Описание отсутствует.'}</div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <input id="modal-qty" type="number" min="1" step="1" value="1" style="flex:1;padding:8px;border-radius:8px;border:1px solid var(--border)">
        <select id="modal-unit" style="padding:8px;border-radius:8px;border:1px solid var(--border)">
          <option value="kg">кг</option>
          <option value="g">гр</option>
        </select>
      </div>
      <button class="btn-cta" id="add-in-modal" style="margin-top:10px;width:100%;">Добавить в корзину</button>
    </div>
  `;
  document.body.appendChild(pm);

  pm.querySelector('.close-product').onclick = ()=> pm.remove();
  pm.querySelector('#toggle-more').onclick = () => {
    const md = pm.querySelector('#more-desc');
    md.style.display = md.style.display === 'none' ? 'block' : 'none';
  };
  pm.querySelector('#add-in-modal').onclick = () => {
    const qtyRaw = parseFloat(pm.querySelector('#modal-qty').value) || 1;
    const unit = pm.querySelector('#modal-unit').value;
    const qtyKg = unit === 'g' ? qtyRaw / 1000 : qtyRaw;
    addToCart(product, qtyKg);
    pm.remove();
  };
}

// -------------------- Checkout modal & order sending --------------------
function openCheckoutModal(){
  if(!modal) return;
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden','false');

  modalOrderList.innerHTML = '';
  let sum = 0;
  cart.forEach(item => {
    const el = document.createElement('div');
    el.style.padding = '8px 4px';
    el.innerHTML = `<div style="font-weight:700">${item.name}</div><div style="color:var(--muted)">${item.qty} • ${formatRub(item.price * item.qty)}</div>`;
    modalOrderList.appendChild(el);
    sum += item.price * item.qty;
  });
  modalTotal.textContent = formatRub(sum);
}

// close checkout modal
const closeModalBtn = document.getElementById('close-modal');
if(closeModalBtn) closeModalBtn.addEventListener('click', ()=> { modal.style.display = 'none'; modal.setAttribute('aria-hidden','true'); });

// submit order
if(orderForm) orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if(cart.length === 0){ alert('Корзина пуста!'); modal.style.display='none'; return; }

  // gather customer info
  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const city = document.getElementById('cust-city').value.trim();
  const street = document.getElementById('cust-street').value.trim();
  const house = document.getElementById('cust-house').value.trim();
  const apt = document.getElementById('cust-apartment').value.trim();
  const time = document.getElementById('delivery-time').value === 'custom' ? (document.getElementById('custom-time').value || '—') : 'Как можно скорее';
  const email = document.getElementById('cust-email').value.trim();
  const payment = document.getElementById('payment-method').value;

  const total = cart.reduce((s,i)=> s + i.price * i.qty, 0);

  const payload = {
    customer: { name, phone, city, street, house, apt, time, email, payment },
    items: cart.map(i => ({ name:i.name, qty:i.qty, price:i.price, total: i.price*i.qty })),
    total
  };

  // Send notification to admin via Telegram API (fetch)
  try {
    await sendTelegramNotification(payload);
    // success UI
    alert('Заказ отправлен. Мы получили уведомление и свяжемся с вами.');
  } catch (err) {
    console.error('Telegram send error', err);
    alert('Заказ оформлен, но не удалось отправить уведомление администратору (проверьте токен/сетевой доступ).');
  }

  // loyalty: only for registered users
  if(currentUser && currentUser.phone){
    const points = Math.floor(total * 0.05); // 5%
    loyaltyPoints += points;
    saveLoyalty();
    alert(`Начислено ${points} баллов на ваш аккаунт. Всего: ${loyaltyPoints}`);
  } else {
    // not registered -> offer registration
    const doReg = confirm('Чтобы получать и тратить баллы, зарегистрируйтесь (телефон). Зарегистрироваться сейчас?');
    if(doReg) triggerPhoneRegistration();
  }

  // clear cart, reset UI
  cart = [];
  renderCart();
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden','true');
});

// -------------------- Telegram notification helper --------------------
async function sendTelegramNotification(orderPayload){
  // Validate placeholders
  if(!BOT_TOKEN || BOT_TOKEN.includes('ВАШ_')) {
    throw new Error('BOT_TOKEN не задан. Откройте script.js и вставьте BOT_TOKEN.');
  }
  if(!ADMIN_ID || ADMIN_ID.includes('ВАШ_')) {
    throw new Error('ADMIN_ID не задан. Откройте script.js и вставьте ADMIN_ID.');
  }

  // Build message text (Markdown)
  const c = orderPayload.customer;
  let text = `📦 *Новый заказ*\n`;
  text += `*Клиент:* ${escapeMarkdown(c.name || '—')} ${c.phone ? `\\n*Телефон:* ${escapeMarkdown(c.phone)}` : ''}\n`;
  text += `*Адрес:* ${escapeMarkdown(`${c.city || ''}, ${c.street || ''} ${c.house || ''} ${c.apt || ''}`)}\n`;
  text += `*Оплата:* ${escapeMarkdown(c.payment || '—')}\n`;
  text += `*Время:* ${escapeMarkdown(c.time || '—')}\n\n`;
  text += `*Состав:*\n`;
  orderPayload.items.forEach(it => {
    text += `• ${escapeMarkdown(it.name)} — ${it.qty} × ${it.price} = ${it.total} ₽\n`;
  });
  text += `\n*Итого:* ${orderPayload.total} ₽\n`;

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const body = {
    chat_id: ADMIN_ID,
    text,
    parse_mode: 'Markdown'
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if(!data || !data.ok) throw new Error('Telegram API error: ' + JSON.stringify(data));
  return data;
}

function escapeMarkdown(str){
  if(!str) return '';
  // Escape characters used in Markdown v2 minimally
  return String(str).replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}

// -------------------- Simple registration (phone prompt) --------------------
function triggerPhoneRegistration(){
  const name = prompt('Имя (для профиля):') || '';
  const phone = prompt('Телефон (в формате +7...):') || '';
  if(!phone) { alert('Регистрация отменена.'); return; }
  currentUser = { name: name || 'Клиент', phone: phone };
  saveUser();
  alert('Сохранено. Вы зарегистрированы как ' + currentUser.name);
  // give initial points
  loyaltyPoints = Number(localStorage.getItem('bm_loyalty') || 0) + 10;
  saveLoyalty();
  if(loyaltyBadge) loyaltyBadge.textContent = `Баллы: ${loyaltyPoints}`;
}

// -------------------- Telegram WebApp login detection (if running inside Telegram) ----
function tryTelegramLogin(){
  // If Telegram.WebApp is available and contains initDataUnsafe.user, attach it to currentUser
  try {
    if(window.Telegram && window.Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.user){
      const u = Telegram.WebApp.initDataUnsafe.user;
      if(!currentUser) currentUser = {};
      if(u.username) currentUser.telegram = u.username;
      if(u.id) currentUser.telegramId = u.id;
      if(u.first_name && !currentUser.name) currentUser.name = u.first_name;
      saveUser();
    }
  } catch(e){
    // ignore
  }
}

// -------------------- Init --------------------
function init(){
  // load saved user/loyalty
  const l = Number(localStorage.getItem('bm_loyalty') || 0);
  loyaltyPoints = l;
  if(loyaltyBadge) loyaltyBadge.textContent = `Баллы: ${loyaltyPoints}`;

  currentUser = JSON.parse(localStorage.getItem('bm_user') || 'null');
  tryTelegramLogin();
  renderCatalog(products);
  renderCart();

  // expand webapp in Telegram (if available)
  if(window.Telegram && window.Telegram.WebApp && typeof Telegram.WebApp.expand === 'function'){
    try{ Telegram.WebApp.expand(); } catch(e){ /* ignore */ }
  }
}
init();

// -------------------- Utility: render cart after external changes --------------------
function renderCart(){
  // reuse earlier renderCart body (duplicated here to ensure init works)
  if(!cartItemsEl) return;
  cartItemsEl.innerHTML = '';
  let sum = 0;
  let count = 0;
  cart.forEach(item => {
    sum += item.price * item.qty;
    count += item.qty;
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div class="left">
        <div style="font-weight:700">${item.name}</div>
        <div class="small" style="color:var(--muted)">${item.qty} • ${formatRub(item.price * item.qty)}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
        <button style="background:transparent;border:0;cursor:pointer;color:${'#e74c3c'}" data-remove="${item.id}">✕</button>
        <div style="font-weight:700">${formatRub(item.price * item.qty)}</div>
      </div>
    `;
    cartItemsEl.appendChild(row);
  });

  if(cartSumEl) cartSumEl.textContent = formatRub(sum);
  if(cartCountSmall) cartCountSmall.textContent = count;
  if(fcCountEl) fcCountEl.textContent = count + ' поз.';
  if(fcTotalEl) fcTotalEl.textContent = formatRub(sum);

  // show/hide floating cart depending on items
  if(cart.length > 0) floatingCart && floatingCart.classList.add('active'); else floatingCart && floatingCart.classList.remove('active');

  // attach remove listeners
  cartItemsEl.querySelectorAll('[data-remove]').forEach(btn => { btn.onclick = ()=> { removeFromCart(+btn.dataset.remove); }; });
}

// -------------------- End of file --------------------
