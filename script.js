document.addEventListener("DOMContentLoaded", () => {
  // Telegram WebApp fallback
  const tg = window.Telegram && window.Telegram.WebApp
    ? window.Telegram.WebApp
    : { sendData: () => {}, close: () => {}, expand: () => {} };

  // --- Element references (with fallbacks to support different HTML versions) ---
  const productList = document.getElementById("product-list") || document.getElementById("catalog");
  const cartItemsList = document.getElementById("cart-items"); // element that lists cart rows
  const totalEl = document.getElementById("total") || document.getElementById("cart-sum") || document.getElementById("panel-total");
  const sendOrderBtn = document.getElementById("send-order") || document.getElementById("goto-checkout");
  const floatingCart = document.getElementById("floating-cart");
  const cartPanel = document.getElementById("cart-panel");
  const fcCountEl = document.getElementById("fc-count") || document.getElementById("cart-count") || document.getElementById("cart-count-2");
  const fcTotalEl = document.getElementById("fc-total") || document.getElementById("cart-total") || document.getElementById("cart-sum");
  const panelTotalEl = document.getElementById("panel-total") || document.getElementById("cart-sum");

  const filtersWrap = document.getElementById("filters");
  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("sort-select");

  // close button inside cart panel (optional)
  const cartCloseBtn = document.getElementById("cart-close-btn");

  // --- Data (example) ---
  const products = [
    { name: "Яблоки", price: 100 },
    { name: "Бананы", price: 120 },
    { name: "Помидоры", price: 150 },
    { name: "Огурцы", price: 130 }
  ];

  // Cart state: array of { id, name, price, qty }
  let cart = [];

  // Visible products (after filters/search/sort)
  let visibleProducts = products.slice();
  let currentFilter = "all"; // for compatibility if you have categories

  // --- Helpers ---
  function idify(s){ return (s || '').toString().replace(/\W+/g,'_'); }
  function formatRub(v){ return Math.round(v) + ' ₽'; }

  // Safe image URL builder: uses encodeURIComponent so filenames with spaces/Cyrillic work
  function jpgPathFor(name){ return 'images/' + encodeURIComponent(name) + '.jpg'; }
  function pngPathFor(name){ return 'images/' + encodeURIComponent(name) + '.png'; }
  const noImage = 'images/noimage.png';

  // Try load image with fallback: jpg -> png -> noimage
  function attachImage(imgEl, name){
    const jpg = jpgPathFor(name);
    const png = pngPathFor(name);
    const tester = new Image();

    tester.onload = () => {
      imgEl.src = jpg;
      imgEl.style.opacity = '1';
    };
    tester.onerror = () => {
      // try png
      const tester2 = new Image();
      tester2.onload = () => {
        imgEl.src = png;
        imgEl.style.opacity = '1';
      };
      tester2.onerror = () => {
        imgEl.src = noImage;
        imgEl.style.opacity = '1';
      };
      tester2.src = png;
    };
    tester.src = jpg;
  }

  // --- Render catalog ---
  function renderCatalog(list){
    if(!productList) return;
    productList.innerHTML = '';
    list.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = 'card product';
      card.innerHTML = `
        <div class="photo"><img alt="${p.name}" loading="lazy" class="product-image"></div>
        <div class="info">
          <div class="name">${p.name}</div>
          <div class="price">${p.price} ₽</div>
          <div class="actions" style="margin-top:8px;display:flex;gap:8px;align-items:center">
            <input class="qty-input" type="number" min="1" step="1" value="1" style="width:72px;padding:6px;border-radius:8px;border:1px solid #e6e6e6">
            <select class="unit-select" style="padding:6px;border-radius:8px;border:1px solid #e6e6e6">
              <option value="kg">кг</option>
              <option value="g">гр</option>
            </select>
            <button class="add-to-cart" data-idx="${idx}" style="background:var(--brand);color:#fff;border:0;padding:8px 10px;border-radius:8px;cursor:pointer">В корзину</button>
          </div>
        </div>
      `;
      // attach image with fallback
      const img = card.querySelector('img');
      attachImage(img, p.name);

      // add event handler for add-to-cart
      card.querySelector('.add-to-cart').addEventListener('click', (e) => {
        const qtyInput = card.querySelector('.qty-input');
        const unitSelect = card.querySelector('.unit-select');
        const qtyRaw = parseFloat(qtyInput.value) || 0;
        const unit = unitSelect.value;
        let qtyKg = unit === 'g' ? qtyRaw / 1000 : qtyRaw;
        if(qtyKg <= 0) { alert('Укажите количество'); return; }
        addToCartByProduct(p, qtyKg);
        // small visual feedback
        const ck = document.createElement('div'); ck.className='checkmark'; ck.textContent='✓'; card.style.position='relative'; card.appendChild(ck);
        setTimeout(()=>{ ck.style.opacity='1'; ck.style.transform='scale(1)'; },10);
        setTimeout(()=>{ ck.style.opacity='0'; ck.style.transform='scale(.6)'; },900);
        setTimeout(()=>{ ck.remove(); },1200);
      });

      productList.appendChild(card);
    });
    // update shown count if exists
    const shown = document.getElementById('shown-count');
    if(shown) shown.textContent = list.length;
  }

  // --- Cart functions ---
  function findCartItem(name, components){
    return cart.find(ci => ci.name === name && JSON.stringify(ci.components || []) === JSON.stringify(components || []));
  }

  function addToCartByProduct(product, qtyKg){
    const existing = findCartItem(product.name);
    if(existing){
      existing.qty += qtyKg;
      existing.total = existing.qty * product.price;
    } else {
      cart.push({
        id: idify(product.name) + '_' + Math.random().toString(36).slice(2,7),
        name: product.name,
        price: product.price,
        qty: qtyKg,
        total: qtyKg * product.price,
        components: null
      });
    }
    renderCart();
  }

  function removeFromCart(id){
    cart = cart.filter(i => i.id !== id);
    renderCart();
  }

  function clearCart(){
    cart = [];
    renderCart();
  }

  function renderCart(){
    if(!cartItemsList) return;
    cartItemsList.innerHTML = '';
    let sum = 0;
    cart.forEach(item => {
      sum += item.total;
      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = `
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:center">
          <div>
            <div style="font-weight:700">${item.name}</div>
            <div style="color:#666;font-size:13px">${item.qty < 1 ? Math.round(item.qty*1000)+' г' : item.qty.toFixed(2)+' кг'} • ${formatRub(item.total)}</div>
          </div>
          <div style="text-align:right">
            <button data-remove="${item.id}" style="background:transparent;border:0;cursor:pointer;color:${'#e74c3c'}">✕</button>
            <div style="font-weight:700;margin-top:6px">${formatRub(item.total)}</div>
          </div>
        </div>
      `;
      cartItemsList.appendChild(row);
    });

    // update totals in different UI spots (fallbacks)
    if(totalEl) totalEl.textContent = formatRub(sum);
    if(fcTotalEl) fcTotalEl.textContent = formatRub(sum);
    if(panelTotalEl) panelTotalEl.textContent = formatRub(sum);

    const positions = cart.length;
    if(fcCountEl) fcCountEl.textContent = positions + ' поз.';

    // attach remove buttons
    cartItemsList.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => removeFromCart(btn.dataset.remove));
    });
  }

  // --- Floating cart behavior (hide widget when panel open, and vice versa) ---
  const hideFloating = () => {
    if(!floatingCart) return;
    floatingCart.classList.add('hidden');
  };
  const showFloating = () => {
    if(!floatingCart) return;
    floatingCart.classList.remove('hidden');
  };
  const openCartPanel = () => {
    if(!cartPanel) return;
    cartPanel.classList.add('show');
    cartPanel.setAttribute('aria-hidden','false');
    hideFloating();
  };
  const closeCartPanel = () => {
    if(!cartPanel) return;
    cartPanel.classList.remove('show');
    cartPanel.setAttribute('aria-hidden','true');
    // small delay to avoid flicker
    setTimeout(showFloating, 120);
  };

  if(floatingCart){
    floatingCart.addEventListener('click', () => {
      // if panel is closed -> open it and hide widget; if open -> close it and show widget
      if(!cartPanel || !cartPanel.classList.contains('show')) openCartPanel(); else closeCartPanel();
    });
  }

  if(cartCloseBtn){
    cartCloseBtn.addEventListener('click', () => {
      closeCartPanel();
    });
  }

  // clicking outside panel should close it
  document.addEventListener('click', (e) => {
    if(!cartPanel || !cartPanel.classList.contains('show')) return;
    if(e.target.closest('#cart-panel') || e.target.closest('#floating-cart')) return;
    closeCartPanel();
  });

/* ====== REPLACE: renderCatalog + filters/search/sort ====== */

/* render catalog: now sets data-global-idx (index in original products array) */
function renderCatalog(list){
  if(!catalogEl) return;
  catalogEl.innerHTML = '';

  list.forEach((p, idxVisible) => {
    const label = p[0], name = p[1], price = p[2], category = p[3];

    // find global index in original products (best-effort)
    let globalIdx = products.findIndex(pp => {
      // compare name+price+category as fingerprint
      return String(pp[1]) === String(name) && Number(pp[2]) === Number(price) && String(pp[3]) === String(category);
    });
    if(globalIdx === -1) globalIdx = idxVisible; // fallback

    const card = document.createElement('div');
    card.className = 'card fade-in';
    card.innerHTML = `
      <div class="photo"><img alt="${name}" loading="lazy"></div>
      <div class="info">
        <div class="name">${label}</div>
        <div class="desc">${name}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:auto">
          <div class="price">${price} ₽/кг</div>
          <div class="actions">
            <input class="qty-input" type="number" min="1" step="1" value="1" title="Кол-во">
            <select class="unit-select" title="Единица">
              <option value="kg">кг</option>
              <option value="g">гр</option>
            </select>
            <!-- data-idx: index inside visible list; data-global-idx: index inside original products array -->
            <button class="add-to-cart" data-idx="${idxVisible}" data-global-idx="${globalIdx}">В корзину</button>
          </div>
        </div>
        <div class="reco small" data-idx="${idxVisible}"></div>
      </div>
    `;
    catalogEl.appendChild(card);

    // load image with fallbacks
    const img = card.querySelector('img');
    tryLoadImage(img, name);

    // render 2 random recommendations (same behaviour as before)
    const recoEl = card.querySelector('.reco');
    const others = products.map((pp,i)=> i !== globalIdx ? pp : null).filter(Boolean);
    const picks = [];
    while(picks.length < 2 && others.length){
      const k = randInt(others.length);
      picks.push(others.splice(k,1)[0]);
    }
    if(picks.length) recoEl.textContent = 'Рекомендуем: ' + picks.map(x=>x[1]).join(', ');
  });

  if(shownCountEl) shownCountEl.textContent = list.length;
}

/* Robust filters / search / sort implementation */
function applySearchAndSort(){
  if(!Array.isArray(products)) return;
  const q = (searchInput && searchInput.value || '').trim().toLowerCase();

  // start from original products, then apply category filter
  let list = (currentFilter === 'all') ? products.slice() : products.filter(p => String(p[3]) === String(currentFilter));

  // search by label (p[0]) or name (p[1])
  if(q){
    list = list.filter(p => {
      const hay = ((p[0] || '') + ' ' + (p[1] || '')).toLowerCase();
      return hay.indexOf(q) !== -1;
    });
  }

  // sort
  const s = (sortSelect && sortSelect.value) || 'default';
  if(s === 'price_asc') list.sort((a,b)=> (Number(a[2])||0) - (Number(b[2])||0));
  else if(s === 'price_desc') list.sort((a,b)=> (Number(b[2])||0) - (Number(a[2])||0));
  else if(s === 'name_asc') list.sort((a,b)=> String(a[1]||'').localeCompare(String(b[1]||''),'ru'));
  else if(s === 'name_desc') list.sort((a,b)=> String(b[1]||'').localeCompare(String(a[1]||''),'ru'));

  visibleProducts = list;
  renderCatalog(visibleProducts);
}

/* Attach event listeners only if elements exist */
if(filtersWrap){
  filtersWrap.addEventListener('click', (e) => {
    const b = e.target.closest('.filter-btn');
    if(!b) return;
    const f = b.dataset.filter || 'all';
    currentFilter = f;
    // visual active state
    document.querySelectorAll('#filters .filter-btn').forEach(x => x.classList.toggle('active', x === b));
    applySearchAndSort();
  });
}

if(searchInput){
  searchInput.addEventListener('input', () => applySearchAndSort());
}

if(sortSelect){
  sortSelect.addEventListener('change', () => applySearchAndSort());
}

/* ====== END REPLACEMENT ====== */


  // --- Send order button logic (Telegram or test) ---
  if(sendOrderBtn){
    sendOrderBtn.addEventListener('click', () => {
      if(cart.length === 0){ alert('Корзина пуста!'); return; }
      const payload = cart.map(i => ({ name: i.name, price: i.price, qty: i.qty, total: i.total }));
      if(tg && typeof tg.sendData === 'function'){ tg.sendData(JSON.stringify(payload)); tg.close(); }
      else { console.log('TEST SEND:', payload); alert('Заказ отправлен (режим теста). Проверь консоль.'); }
    });
  }

  // --- Init ---
  function init(){
    if(tg && typeof tg.expand === 'function') tg.expand();
    visibleProducts = products.slice();
    renderCatalog(visibleProducts);
    renderCart();
    // ensure floating is visible initially if exists
    showFloating();
  }

  init();
});
