// ===============================
// ДАННЫЕ ТОВАРОВ
// ===============================

const products = [
  {
    id: 1,
    name: "Бананы",
    category: "fruits",
    price: 120,
    kbju: "К: 95 / Б: 1.5 / Ж: 0.3 / У: 21",
    desc: "Свежие сладкие бананы прямо из Эквадора. Отлично подходят как перекус.",
    img: "images/banan.jpg",
  },
  {
    id: 2,
    name: "Яблоки",
    category: "fruits",
    price: 130,
    kbju: "К: 52 / Б: 0.3 / Ж: 0.2 / У: 14",
    desc: "Сочные и ароматные яблоки с насыщенным вкусом.",
    img: "images/yabloko.jpg",
  },
  {
    id: 3,
    name: "Апельсины",
    category: "fruits",
    price: 150,
    kbju: "К: 47 / Б: 0.9 / Ж: 0.1 / У: 12",
    desc: "Спелые апельсины, наполненные витаминами.",
    img: "images/apelsin.jpg",
  },
  {
    id: 4,
    name: "Помидоры",
    category: "vegetables",
    price: 180,
    kbju: "К: 18 / Б: 0.9 / Ж: 0.2 / У: 3.9",
    desc: "Сладкие томаты, идеальны для салатов и приготовления блюд.",
    img: "images/pomidory.jpg",
  },
  {
    id: 5,
    name: "Огурцы",
    category: "vegetables",
    price: 90,
    kbju: "К: 16 / Б: 0.8 / Ж: 0.1 / У: 2.5",
    desc: "Хрустящие свежие огурцы прямо с фермы.",
    img: "images/ogurcy.jpg",
  },
];

// ===============================
// ЭЛЕМЕНТЫ DOM
// ===============================

const catalogEl = document.getElementById("catalog");
const searchInput = document.getElementById("search-input");
const mobileSearchInput = document.getElementById("mobile-search-input");
const sortSelect = document.getElementById("sort-select");
const mobileSort = document.getElementById("mobile-sort");
const shownCountEl = document.getElementById("shown-count");

const cartPanel = document.getElementById("cart-panel");
const floatingCart = document.getElementById("floating-cart");
const cartItemsEl = document.getElementById("cart-items");

let cart = [];
let currentFilter = "all";
let currentSearch = "";
let currentSort = "default";

// ===============================
// ОТОБРАЖЕНИЕ ТОВАРОВ
// ===============================

function renderProducts() {
  catalogEl.innerHTML = "";

  let list = [...products];

  // фильтр
  if (currentFilter !== "all") {
    list = list.filter((p) => p.category === currentFilter);
  }

  // поиск
  if (currentSearch.trim() !== "") {
    const q = currentSearch.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q));
  }

  // сортировка
  if (currentSort === "price_asc") list.sort((a, b) => a.price - b.price);
  if (currentSort === "price_desc") list.sort((a, b) => b.price - a.price);
  if (currentSort === "name_asc") list.sort((a, b) => a.name.localeCompare(b.name));
  if (currentSort === "name_desc") list.sort((a, b) => b.name.localeCompare(a.name));

  shownCountEl.textContent = list.length;

  list.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = p.id;

    card.innerHTML = `
      <div class="photo">
        <img src="${p.img}" alt="${p.name}">
      </div>
      <div class="info">
        <div class="name">${p.name}</div>
        <div class="desc">${p.desc}</div>
        <div class="price">${p.price} ₽</div>
      </div>
    `;

    card.onclick = () => openProductModal(p.id);
    catalogEl.appendChild(card);
  });
}

renderProducts();
// ===============================
// ПРОДУКТОВЫЙ МОДАЛ
// ===============================

const productModal = document.getElementById("product-modal");
const pmImg = document.getElementById("pm-img");
const pmName = document.getElementById("pm-name");
const pmPrice = document.getElementById("pm-price");
const pmKbju = document.getElementById("pm-kbju");
const pmDesc = document.getElementById("pm-desc");
const pmMore = document.getElementById("pm-more");
const pmQty = document.getElementById("pm-qty");
const pmUnit = document.getElementById("pm-unit");
const pmAdd = document.getElementById("pm-add");
const pmClose = document.getElementById("product-modal-close");

let openedProduct = null;

// открыть модал
function openProductModal(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;

  openedProduct = p;

  pmImg.src = p.img;
  pmName.textContent = p.name;
  pmPrice.textContent = p.price + " ₽/кг";
  pmKbju.textContent = p.kbju;
  pmDesc.textContent = p.desc;

  pmQty.value = 1;
  pmUnit.value = "kg";

  pmDesc.style.display = "none";
  pmMore.textContent = "Подробнее о товаре";

  productModal.style.display = "flex";
  productModal.setAttribute("aria-hidden", "false");
}

// закрытие модала
pmClose.onclick = () => closeProductModal();
productModal.onclick = (e) => {
  if (e.target === productModal) closeProductModal();
};

function closeProductModal() {
  productModal.style.display = "none";
  productModal.setAttribute("aria-hidden", "true");
}

// показать/скрыть описание
pmMore.onclick = () => {
  if (pmDesc.style.display === "none") {
    pmDesc.style.display = "block";
    pmMore.textContent = "Свернуть";
  } else {
    pmDesc.style.display = "none";
    pmMore.textContent = "Подробнее о товаре";
  }
};

// добавление в корзину из модального окна
pmAdd.onclick = () => {
  if (!openedProduct) return;

  const qty = parseFloat(pmQty.value) || 1;
  let qtyKg = pmUnit.value === "g" ? qty / 1000 : qty;

  addToCart({
    id: openedProduct.id,
    name: openedProduct.name,
    price: openedProduct.price,
    qtyKg,
  });

  closeProductModal();
};

// ===============================
// КОРЗИНА
// ===============================

const fcCountEl = document.getElementById("fc-count");
const fcTotalEl = document.getElementById("fc-total");
const cartSumEl = document.getElementById("cart-sum");
const cartCountSmall = document.getElementById("cart-count-2");

function addToCart(item) {
  const exists = cart.find((x) => x.id === item.id);
  if (exists) {
    exists.qtyKg += item.qtyKg;
  } else {
    cart.push({
      ...item,
      realId: Date.now() + "_" + Math.random().toString(36).slice(2)
    });
  }

  renderCart();
  showFloatingCart();
}

function removeFromCart(realId) {
  cart = cart.filter((x) => x.realId !== realId);
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
  hideFloatingCart();
}

function renderCart() {
  cartItemsEl.innerHTML = "";

  let total = 0;

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-row";

    const subtotal = item.qtyKg * item.price;
    total += subtotal;

    row.innerHTML = `
      <div>
        <div style="font-weight:700">${item.name}</div>
        <div class="small">${(item.qtyKg < 1 ? (item.qtyKg*1000) + " г" : item.qtyKg + " кг")} • ${subtotal} ₽</div>
      </div>

      <button style="background:transparent;border:0;color:#d00;font-size:18px;cursor:pointer" 
              onclick="removeFromCart('${item.realId}')">
        ✕
      </button>
    `;

    cartItemsEl.appendChild(row);
  });

  cartSumEl.textContent = total + " ₽";
  cartCountSmall.textContent = cart.length;
  fcCountEl.textContent = cart.length + " поз.";
  fcTotalEl.textContent = total + " ₽";
}

// ===============================
// ПЛАВАЮЩАЯ КОРЗИНА
// ===============================

function showFloatingCart() {
  floatingCart.classList.add("visible");
}

function hideFloatingCart() {
  floatingCart.classList.remove("visible");
}

floatingCart.onclick = () => {
  cartPanel.classList.add("show");
  cartPanel.setAttribute("aria-hidden", "false");
  hideFloatingCart();
};

document.getElementById("cart-close-btn").onclick = () => {
  cartPanel.classList.remove("show");
  cartPanel.setAttribute("aria-hidden", "true");
  showFloatingCart();
};

document.getElementById("clear-cart").onclick = () => {
  clearCart();
  cartPanel.classList.remove("show");
  cartPanel.setAttribute("aria-hidden", "true");
  hideFloatingCart();
};
// ===============================
// ПОИСК / СОРТИРОВКА / ФИЛЬТРЫ
// ===============================

// кнопки фильтров
document.getElementById("filters").addEventListener("click", (e) => {
  const pill = e.target.closest(".pill");
  if (!pill) return;

  document.querySelectorAll("#filters .pill").forEach((x) =>
    x.classList.remove("active")
  );
  pill.classList.add("active");

  currentFilter = pill.dataset.filter || "all";
  renderProducts();
});

// поиск в хедере
searchInput.oninput = () => {
  currentSearch = searchInput.value.trim();
  renderProducts();
};

// поиск на мобиле
mobileSearchInput.oninput = () => {
  searchInput.value = mobileSearchInput.value;
  currentSearch = mobileSearchInput.value.trim();
  renderProducts();
};

// сортировка
sortSelect.onchange = () => {
  currentSort = sortSelect.value;
  renderProducts();
};

mobileSort.onchange = () => {
  sortSelect.value = mobileSort.value;
  currentSort = mobileSort.value;
  renderProducts();
};

// ===============================
// МОБИЛЬНАЯ ПАНЕЛЬ ПОИСКА
// ===============================

const searchPanel = document.getElementById("search-panel");
const fabOpen = document.getElementById("fab-open");
const closeSearchPanelBtn = document.getElementById("close-search-panel");

fabOpen.onclick = () => {
  searchPanel.classList.toggle("open");
  mobileSearchInput.focus();
};

closeSearchPanelBtn.onclick = () => {
  searchPanel.classList.remove("open");
};

// ===============================
// ОФОРМЛЕНИЕ ЗАКАЗА
// ===============================

const checkoutModal = document.getElementById("modal");
const modalOrderList = document.getElementById("modal-order-list");
const modalTotal = document.getElementById("modal-total");
const orderForm = document.getElementById("order-form");
const deliveryTimeSelect = document.getElementById("delivery-time");
const customTimeInput = document.getElementById("custom-time");

document.getElementById("goto-checkout").onclick = () => {
  if (cart.length === 0) {
    alert("Корзина пуста!");
    return;
  }

  modalOrderList.innerHTML = "";
  let total = 0;

  cart.forEach((i) => {
    const row = document.createElement("div");
    row.style.padding = "6px 4px";

    const subtotal = i.qtyKg * i.price;
    total += subtotal;

    row.innerHTML = `
      <div style="font-weight:700">${i.name}</div>
      <div style="color:#666">${(i.qtyKg < 1 ? (i.qtyKg*1000) + " г" : i.qtyKg + " кг")} • ${subtotal} ₽</div>
    `;
    modalOrderList.appendChild(row);
  });

  modalTotal.textContent = total + " ₽";

  cartPanel.classList.remove("show");
  checkoutModal.style.display = "flex";
  checkoutModal.setAttribute("aria-hidden", "false");
};

document.getElementById("close-modal").onclick = () => {
  checkoutModal.style.display = "none";
  checkoutModal.setAttribute("aria-hidden", "true");
};

deliveryTimeSelect.onchange = () => {
  if (deliveryTimeSelect.value === "custom") {
    customTimeInput.style.display = "block";
  } else {
    customTimeInput.style.display = "none";
  }
};

orderForm.onsubmit = (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Корзина пуста!");
    return;
  }

  const payload = {
    name: document.getElementById("cust-name").value.trim(),
    phone: document.getElementById("cust-phone").value.trim(),
    city: document.getElementById("cust-city").value.trim(),
    street: document.getElementById("cust-street").value.trim(),
    house: document.getElementById("cust-house").value.trim(),
    apt: document.getElementById("cust-apartment").value.trim(),
    time:
      deliveryTimeSelect.value === "custom"
        ? customTimeInput.value
        : "Как можно скорее",
    email: document.getElementById("cust-email").value.trim(),
    payment: document.getElementById("payment-method").value,
    items: cart,
    total: cart.reduce((s, i) => s + i.qtyKg * i.price, 0),
    timestamp: new Date().toISOString(),
  };

  console.log("ORDER SENT:", payload);

  alert("Заказ успешно оформлен! (тестовый режим)");

  cart = [];
  renderCart();

  orderForm.reset();
  customTimeInput.style.display = "none";
  checkoutModal.style.display = "none";
};
// ===============================
// АВТОРИЗАЦИЯ / ПОЛЬЗОВАТЕЛЬ
// ===============================

const authModal = document.getElementById("auth-modal");
const authClose = document.getElementById("auth-close");
const authPhone = document.getElementById("auth-phone");
const authPhoneBtn = document.getElementById("auth-phone-btn");
const userAreaBtn = document.getElementById("user-area");
const uaName = document.getElementById("ua-name");
const loyaltyBadge = document.getElementById("loyalty-badge");

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("bm_user") || "null");
  } catch {
    return null;
  }
}

function storeUser(u) {
  localStorage.setItem("bm_user", JSON.stringify(u));
}

function getLoyalty() {
  return parseInt(localStorage.getItem("bm_loyalty") || "0", 10);
}

function setLoyalty(n) {
  localStorage.setItem("bm_loyalty", String(n));
  updateUserUI();
}

function updateUserUI() {
  const u = getStoredUser();

  if (u) {
    uaName.textContent = u.name || u.phone || "Пользователь";
    loyaltyBadge.textContent = "Баллы: " + getLoyalty();
  } else {
    uaName.textContent = "Войти";
    loyaltyBadge.textContent = "Баллы: 0";
  }
}

userAreaBtn.onclick = () => {
  authModal.style.display = "flex";
  authModal.setAttribute("aria-hidden", "false");
};

authClose.onclick = () => {
  authModal.style.display = "none";
  authModal.setAttribute("aria-hidden", "true");
};

authPhoneBtn.onclick = () => {
  const phone = authPhone.value.trim();
  if (!phone) {
    alert("Введите номер телефона");
    return;
  }

  const user = {
    id: "phone_" + phone.replace(/\D/g, ""),
    name: phone,
    phone,
  };

  storeUser(user);

  if (!localStorage.getItem("bm_loyalty")) {
    localStorage.setItem("bm_loyalty", "0");
  }

  authModal.style.display = "none";
  updateUserUI();

  alert("Вход выполнен: " + phone + " (тестовый режим)");
};

// ===============================
// HERO-КНОПКИ
// ===============================

document.getElementById("hero-order").onclick = () => {
  window.scrollTo({
    top: document.querySelector(".main").offsetTop - 20,
    behavior: "smooth",
  });
};

document.getElementById("view-catalog").onclick = () => {
  window.scrollTo({
    top: document.querySelector(".main").offsetTop - 20,
    behavior: "smooth",
  });
};

// ===============================
// ИНИЦИАЛИЗАЦИЯ
// ===============================

function init() {
  updateUserUI();
  renderProducts();
  renderCart();
  hideFloatingCart();
}

init();
