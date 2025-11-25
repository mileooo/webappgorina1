/* ================== CONFIG ==================
 Replace ADMIN_WEBHOOK_URL with your server endpoint to receive order notifications.
 For Telegram login within WebApp the code tries to use window.Telegram.WebApp.initDataUnsafe
=============================================*/
const ADMIN_WEBHOOK_URL = ""; // <-- PUT YOUR ADMIN WEBHOOK URL HERE (POST)

/* Telegram fallback object (WebApp) */
const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

/* ========== Products (array format) ========== */
const products = [
  ["🍉 Арбуз — 40₽/кг", "Арбуз", 40, "fruits"],
  ["🍐 Груша — 340₽/кг", "Груша", 340, "fruits"],
  ["🍊 Апельсин — 220₽/кг", "Апельсин", 220, "fruits"],
  ["🍈 Дыня торпеда Узбекистан — 80₽/кг", "Дыня торпеда Узбекистан", 80, "fruits"],
  ["🍈 Дыня колхозница — 80₽/кг", "Дыня колхозница", 80, "fruits"],
  ["🍇 Виноград зеленый (без косточек) — 320₽/кг", "Виноград зеленый (без косточек)", 320, "fruits"],
  ["🍇 Виноград темный (без косточек) — 320₽/кг", "Виноград темный (без косточек)", 320, "fruits"],
  ["🍇 Виноград черный (Мерседес) — 300₽/кг", "Виноград черный (Мерседес)", 300, "fruits"],
  ["🍑 Нектарин Узбекистан красный — 170₽/кг", "Нектарин Узбекистан красный", 170, "fruits"],
  ["🍑 Нектарин Турция — 350₽/кг", "Нектарин Турция", 350, "fruits"],
  ["🍑 Нектарин Узбекистан желтый (вкус лимон) — 250₽/кг", "Нектарин Узбекистан желтый (вкус лимон)", 250, "fruits"],
  ["🍑 Нектарин Узбекистан зеленый — 190₽/кг", "Нектарин Узбекистан зеленый", 190, "fruits"],
  ["🍌 Банан — 170₽/кг", "Банан", 170, "fruits"],
  ["🥔 Картофель Чувашия — 45₽/кг", "Картофель Чувашия", 45, "vegetables"],
  ["🥔 Картофель Краснодар — 45₽/кг", "Картофель Краснодар", 45, "vegetables"],
  ["🥕 Морковь Волгоград — 45₽/кг", "Морковь Волгоград", 45, "vegetables"],
  ["🧅 Лук репчатый Волгоград — 45₽/кг", "Лук репчатый Волгоград", 45, "vegetables"],
  ["🌱 Лук зеленый — 350₽/кг", "Лук зеленый", 350, "vegetables"],
  ["🌱 Укроп, петрушка — 350₽/кг", "Укроп, петрушка", 350, "vegetables"],
  ["🌱 Кинза — 440₽/кг", "Кинза", 440, "vegetables"],
  ["🌱 Базелик — 50₽/пучок", "Базелик (пучок)", 50, "vegetables"],
  ["🧄 Чеснок Ташкент — 400₽/кг", "Чеснок Ташкент", 400, "vegetables"],
  ["🫑 Перец болгарский — 130₽/кг", "Перец болгарский", 130, "vegetables"],
  ["🌶️ Перец чили — 25₽/шт", "Перец чили", 25, "vegetables"],
  ["🍅 Помидоры Азербайджанские — 220₽/кг", "Помидоры Азербайджанские", 220, "vegetables"],
  ["🍅 Помидоры Ростовские — 180₽/кг", "Помидоры Ростовские", 180, "vegetables"],
  ["🍅 Помидоры Волгоград (мелкие) — 80₽/кг", "Помидоры Волгоград (мелкие)", 80, "vegetables"],
  ["🍅 Помидоры домашние — 240₽/кг", "Помидоры домашние", 240, "vegetables"],
  ["🍅 Помидоры Астрахань (желтые) — 190₽/кг", "Помидоры Астрахань (желтые)", 190, "vegetables"],
  ["🥒 Огурцы Московские — 150₽/кг", "Огурцы Московские", 150, "vegetables"],
  ["🥒 Огурцы Самарские — 80₽/кг", "Огурцы Самарские", 80, "vegetables"],
  ["🥒 Огурцы домашние — 150₽/кг", "Огурцы домашние", 150, "vegetables"],
  ["🍑 Слива 4 вида — 190₽/кг - Ташкент; Медовая - 220₽/кг; Желтая - 250₽/кг; Чернослива - 220₽/кг", "Слива 4 вида", 220, "fruits"],
  ["🍒 Черешня — 580₽/кг", "Черешня", 580, "fruits"],
  ["🫐 Голубика — 800₽/кг", "Голубика", 800, "fruits"],
  ["🍑 Абрикос Армения — 240₽/кг", "Абрикос Армения", 240, "fruits"],
  ["🍑 Абрикос Киргизия — 150₽/кг", "Абрикос Киргизия", 150, "fruits"],
  ["🍑 Персик Ташкент — 250₽/кг", "Персик Ташкент", 250, "fruits"],
  ["🍑 Персик Армения — 380₽/кг", "Персик Армения", 380, "fruits"],
  ["🍑 Персик Турция — 450₽/кг", "Персик Турция", 450, "fruits"],
  ["🍑 Персик Инжирный — 350₽/кг", "Персик Инжирный", 350, "fruits"],
  ["🥝 Киви — 450₽/кг", "Киви", 450, "fruits"],
  ["Кабачок — 55₽/кг", "Кабачок", 55, "vegetables"],
  ["🍆 Баклажан — 130₽/кг", "Баклажан", 130, "vegetables"],
  ["🍋 Лимон — 290₽/кг", "Лимон", 290, "fruits"]
];

/* KBJU and descriptions */
const kbjuData = {
  "Арбуз": { kbju: "30 ккал • Б 0.6 г • Ж 0.2 г • У 7.6 г", desc: "💚 Освежающий и богатый ликопином фрукт, помогает выводить токсины и поддерживает водный баланс." },
  "Груша": { kbju: "57 ккал • Б 0.4 г • Ж 0.4 г • У 15 г", desc: "🍐 Отличный источник клетчатки, поддерживает здоровое пищеварение и снижает уровень холестерина." },
  "Апельсин": { kbju: "47 ккал • Б 0.9 г • Ж 0.1 г • У 11.8 г", desc: "🍊 Мощный заряд витамина C, укрепляет иммунитет и повышает уровень энергии." },
  "Дыня торпеда Узбекистан": { kbju: "35 ккал • Б 0.8 г • Ж 0.2 г • У 8 г", desc: "🍈 Освежающая, насыщена калием и витамином C, способствует детоксикации организма." },
  "Дыня колхозница": { kbju: "36 ккал • Б 0.6 г • Ж 0.3 г • У 8.1 г", desc: "🍈 Поддерживает водный баланс, мягко улучшает обмен веществ." },
  "Виноград зеленый (без косточек)": { kbju: "69 ккал • Б 0.7 г • Ж 0.2 г • У 18 г", desc: "🍇 Источник антиоксидантов, укрепляет сердце и сосуды." },
  "Виноград темный (без косточек)": { kbju: "70 ккал • Б 0.6 г • Ж 0.2 г • У 18 г", desc: "🍇 Содержит ресвератрол — мощный антиоксидант для молодости кожи и сосудов." },
  "Виноград черный (Мерседес)": { kbju: "72 ккал • Б 0.7 г • Ж 0.2 г • У 17 г", desc: "🍇 Благотворно влияет на сердце и иммунную систему." },
  "Нектарин Узбекистан красный": { kbju: "44 ккал • Б 1.1 г • Ж 0.3 г • У 10 г", desc: "🍑 Богат витамином A и антиоксидантами, поддерживает здоровье кожи." },
  "Нектарин Турция": { kbju: "45 ккал • Б 1 г • Ж 0.3 г • У 10 г", desc: "🍑 Улучшает обмен веществ и способствует здоровому пищеварению." },
  "Нектарин Узбекистан желтый (вкус лимон)": { kbju: "45 ккал • Б 1 г • Ж 0.3 г • У 10 г", desc: "🍑 Сочный и ароматный фрукт, укрепляет иммунитет и придаёт энергии." },
  "Нектарин Узбекистан зеленый": { kbju: "44 ккал • Б 1.1 г • Ж 0.3 г • У 10 г", desc: "🍑 Освежает и помогает очищать организм." },
  "Банан": { kbju: "89 ккал • Б 1.1 г • Ж 0.3 г • У 23 г", desc: "🍌 Источник калия и магния — поддерживает сердце и нервную систему." },
  "Слива 4 вида": { kbju: "46 ккал • Б 0.7 г • Ж 0.3 г • У 11 г", desc: "🍑 Помогает очищать кишечник, богата антиоксидантами и витамином C." },
  "Черешня": { kbju: "63 ккал • Б 1.1 г • Ж 0.2 г • У 16 г", desc: "🍒 Укрепляет сосуды, улучшает сон и настроение." },
  "Голубика": { kbju: "57 ккал • Б 0.7 г • Ж 0.3 г • У 14 г", desc: "🫐 Один из лучших антиоксидантов, улучшает память и зрение." },
  "Абрикос Армения": { kbju: "48 ккал • Б 1.4 г • Ж 0.4 г • У 11 г", desc: "🍑 Богат бета-каротином, улучшает зрение и состояние кожи." },
  "Абрикос Киргизия": { kbju: "48 ккал • Б 1.4 г • Ж 0.4 г • У 11 г", desc: "🍑 Поддерживает работу печени и способствует выработке коллагена." },
  "Персик Ташкент": { kbju: "39 ккал • Б 0.9 г • Ж 0.3 г • У 10 г", desc: "🍑 Помогает очищению организма и укрепляет иммунитет." },
  "Персик Армения": { kbju: "39 ккал • Б 0.9 г • Ж 0.3 г • У 10 г", desc: "🍑 Источник витаминов A и E, улучшает состояние кожи и волос." },
  "Персик Турция": { kbju: "39 ккал • Б 0.9 г • Ж 0.3 г • У 10 г", desc: "🍑 Поддерживает обмен веществ и восполняет запасы антиоксидантов." },
  "Персик Инжирный": { kbju: "40 ккал • Б 0.9 г • Ж 0.3 г • У 10 г", desc: "🍑 Сладкий и нежный, помогает при усталости и стрессах." },
  "Киви": { kbju: "41 ккал • Б 1.1 г • Ж 0.5 г • У 10 г", desc: "🥝 Содержит больше витамина C, чем апельсин, укрепляет иммунитет и улучшает пищеварение." },
  "Лимон": { kbju: "29 ккал • Б 1.1 г • Ж 0.3 г • У 9 г", desc: "🍋 Мощный антиоксидант, очищает организм и улучшает обмен веществ." },
  "Картофель Чувашия": { kbju: "77 ккал • Б 2 г • Ж 0.1 г • У 17 г", desc: "🥔 Источник калия и витамина B6, даёт энергию и поддерживает нервную систему." },
  "Картофель Краснодар": { kbju: "77 ккал • Б 2 г • Ж 0.1 г • У 17 г", desc: "🥔 Полезен при физических нагрузках, содержит клетчатку и антиоксиданты." },
  "Морковь Волгоград": { kbju: "41 ккал • Б 0.9 г • Ж 0.2 г • У 10 г", desc: "🥕 Богата бета-каротином, улучшает зрение и укрепляет кожу." },
  "Лук репчатый Волгоград": { kbju: "40 ккал • Б 1.1 г • Ж 0.1 г • У 9.3 г", desc: "🧅 Повышает иммунитет, обладает противомикробными свойствами." },
  "Лук зеленый": { kbju: "32 ккал • Б 1.8 г • Ж 0.2 г • У 7.3 г", desc: "🌱 Источник витамина C, железа и кальция, помогает укрепить кости." },
  "Укроп, петрушка": { kbju: "43 ккал • Б 3 г • Ж 0.4 г • У 8 г", desc: "🌱 Улучшают пищеварение, освежают дыхание и снабжают организм витаминами." },
  "Кинза": { kbju: "23 ккал • Б 2.1 г • Ж 0.5 г • У 3.7 г", desc: "🌿 Способствует выведению тяжёлых металлов и поддерживает детоксикацию организма." },
  "Базелик (пучок)": { kbju: "22 ккал • Б 3.2 г • Ж 0.6 г • У 2.6 г", desc: "🌿 Богат эфирными маслами, улучшает настроение и пищеварение." },
  "Чеснок Ташкент": { kbju: "149 ккал • Б 6.4 г • Ж 0.5 г • У 33 г", desc: "🧄 Мощный природный антибиотик, укрепляет иммунитет и сердце." },
  "Перец болгарский": { kbju: "27 ккал • Б 1.3 г • Ж 0.2 г • У 6 г", desc: "🫑 Один из лучших источников витамина C, повышает иммунитет и улучшает кожу." },
  "Перец чили": { kbju: "40 ккал • Б 2 г • Ж 0.4 г • У 9 г", desc: "🌶️ Улучшает обмен веществ и способствует сжиганию калорий." },
  "Помидоры Азербайджанские": { kbju: "18 ккал • Б 0.9 г • Ж 0.2 г • У 3.9 г", desc: "🍅 Богаты ликопином, поддерживают сердце и защищают клетки от старения." },
  "Помидоры Ростовские": { kbju: "18 ккал • Б 0.9 г • Ж 0.2 г • У 3.9 г", desc: "🍅 Отличный источник антиоксидантов и витамина C." },
  "Помидоры Волгоград (мелкие)": { kbju: "18 ккал • Б 0.9 г • Ж 0.2 г • У 3.9 г", desc: "🍅 Улучшают обмен веществ и укрепляют иммунную систему." },
  "Помидоры домашние": { kbju: "18 ккал • Б 0.9 г • Ж 0.2 г • У 3.9 г", desc: "🍅 Содержат натуральный ликопин, защищают клетки от старения." },
  "Помидоры Астрахань (желтые)": { kbju: "20 ккал • Б 1 г • Ж 0.2 г • У 4 г", desc: "🍅 Мягче по кислотности, подходят для людей с чувствительным желудком." },
  "Огурцы Московские": { kbju: "15 ккал • Б 0.8 г • Ж 0.1 г • У 3.6 г", desc: "🥒 Состоят на 95 % из воды, очищают организм и улучшают состояние кожи." },
  "Огурцы Самарские": { kbju: "15 ккал • Б 0.8 г • Ж 0.1 г • У 3.6 г", desc: "🥒 Помогают вывести лишнюю жидкость и тонизируют." },
  "Огурцы домашние": { kbju: "15 ккал • Б 0.8 г • Ж 0.1 г • У 3.6 г", desc: "🥒 Поддерживают баланс жидкости и электролитов в организме." },
  "Кабачок": { kbju: "24 ккал • Б 1.5 г • Ж 0.3 г • У 4.6 г", desc: "🥒 Легко усваивается, богат клетчаткой и витаминами группы B." },
  "Баклажан": { kbju: "25 ккал • Б 1 г • Ж 0.2 г • У 6 г", desc: "🍆 Содержит антиоксиданты, снижает уровень холестерина и поддерживает сердце." }
};
/* ========== SUPABASE INIT ========== */

const SUPABASE_URL = "https://pfrxetrirjmqppwjfftp.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcnhldHJpcmptcXBwd2pmZnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NjU1ODksImV4cCI6MjA3OTQ0MTU4OX0.RUwkwZehK67E9LTkgFKRFYSTfC0Xx6o_JIdDG3IYngM";

// ❗ создаём клиента правильно
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

console.log("Supabase подключён:", db);

/* ========== AUTH FUNCTIONS ========== */

// Сохраняем данные о пользователе в localStorage
function saveUserLocally(user) {
  localStorage.setItem("bm_user", JSON.stringify(user));
}

// Забираем данные
function getUserLocally() {
  const raw = localStorage.getItem("bm_user");
  return raw ? JSON.parse(raw) : null;
}

// Удалить
function clearUserLocally() {
  localStorage.removeItem("bm_user");
}

/* Вход по телефону  */
async function loginWithPhone(phone) {
  phone = phone.trim();
  if (!phone) {
    alert("Введите номер телефона!");
    return;
  }

  // Генерируем корректный user_id
  const id = "phone_" + phone.replace(/\D/g, "");

  // Создаём / обновляем клиента
  const { data, error } = await db
    .from("customers")
    .upsert({
      id,
      phone,
      name: phone,
      loyalty_points: 0
    })
    .select()
    .single();

  if (error) {
    console.error("Ошибка Supabase:", error);
    alert("Проблема со входом!");
    return;
  }

  // Сохраняем строго то, что вернул Supabase:
  saveUserLocally(data);
  await refreshLoyalty();
  updateUserUI();

  document.getElementById("auth-modal").setAttribute("aria-hidden", "true");
  alert("Вы авторизованы!");
}

/* ========== AUTH REFS ========== */
const userAreaBtn = document.getElementById('user-area');
const authModal = document.getElementById('auth-modal');
const authClose = document.getElementById('auth-close');
const authPhone = document.getElementById('auth-phone');
const authPhoneBtn = document.getElementById('auth-phone-btn');
const authTg = document.getElementById('auth-tg');

/* ========== AUTH HANDLERS ========== */
authPhoneBtn.addEventListener("click", () => {
  const phone = authPhone.value.trim();
  loginWithPhone(phone);
});

userAreaBtn.addEventListener("click", () => {
  const user = getUserLocally();

  // Если не авторизован → открываем окно авторизации
  if (!user) {
    authModal.setAttribute("aria-hidden", "false");
    return;
  }

  // Меню действий пользователя
  const choice = prompt(
    "Выберите действие:\n1 — История заказов\n2 — Выйти из аккаунта"
  );

  if (choice === "1") {
    openHistoryModal();
  } else if (choice === "2") {
    logout();
  }
});

/* ========== state & refs ========== */
let cart = [];
let visibleProducts = products.slice();
let currentFilter = 'all';

const catalogEl = document.getElementById('catalog');
const shownCountEl = document.getElementById('shown-count');
const filtersWrap = document.getElementById('filters');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');

const mobileSearchInput = document.getElementById('mobile-search-input');
const mobileSort = document.getElementById('mobile-sort');
const searchPanel = document.getElementById('search-panel');
const fabOpen = document.getElementById('fab-open');
const closeSearchPanelBtn = document.getElementById('close-search-panel');

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

const checkoutOverlay = document.getElementById('checkout-overlay');
const modalOrderList = document.getElementById('modal-order-list');
const modalTotal = document.getElementById('modal-total');
const deliveryTimeSelect = document.getElementById('delivery-time');
const customTimeInput = document.getElementById('custom-time');
const deliveryModeDelivery = document.getElementById('delivery-mode-delivery');
const deliveryModePickup = document.getElementById('delivery-mode-pickup');
const pickupInfo = document.getElementById('pickup-info');
const fieldCity = document.getElementById('cust-city').closest('.form-row');
const fieldStreet = document.getElementById('cust-street').closest('.form-row');
const fieldHouse = document.getElementById('cust-house').closest('.col');
const fieldApt = document.getElementById('cust-apartment').closest('.col');
const deliveryTimeHint = document.getElementById('delivery-time-hint'); // ← добавили
const closeModalBtn = document.getElementById('close-modal');
const checkoutSubmitBtn = document.getElementById('checkout-submit');
const checkoutTimeDisplay = document.getElementById('checkout-time-display');
const addressSection = document.getElementById('address-section');


// блоки самовывоза
const pickupTimeSection = document.getElementById('pickup-time-section');
const pickupTimeSelect = document.getElementById('pickup-time');
const pickupCustomTimeRow = document.getElementById('pickup-custom-time-row');
const pickupCustomTimeInput = document.getElementById('pickup-custom-time');
const pickupTimeHint = document.getElementById('pickup-time-hint');

const loyaltyBadge = document.getElementById('loyalty-badge');
const heroOrderBtn = document.getElementById('hero-order');
const viewCatalogBtn = document.getElementById('view-catalog');

const uaName = document.getElementById('ua-name');

const productModal = document.getElementById('product-modal');
const pmImg = document.getElementById('pm-img');
const pmName = document.getElementById('pm-name');
const pmPrice = document.getElementById('pm-price');
const pmKbju = document.getElementById('pm-kbju');
const pmMore = document.getElementById('pm-more');
const pmDesc = document.getElementById('pm-desc');
const pmClose = document.getElementById('product-modal-close');
const pmQty = document.getElementById('pm-qty');
const pmUnit = document.getElementById('pm-unit');
const pmAdd = document.getElementById('pm-add');

/* ========== CHECKOUT (fullscreen, как Самокат) ========== */

/* helper: красивый текст для времени доставки */
function describeDeliveryTime(code, customVal) {
  switch (code) {
    case 'asap':
      return 'Как можно скорее (до 1 часа)';
    case 'slot_15':
      return 'В течение 15 минут';
    case 'slot_30':
      return 'В течение 30 минут';
    case 'slot_60':
      return 'В течение 60 минут';
    case 'custom':
      if (customVal) {
        return `К ${customVal} ± 10 минут`;
      }
      return 'К выбранному времени (уточните в поле времени)';
    default:
      return 'Как можно скорее (до 1 часа)';
  }
}

/* показать / скрыть адрес в зависимости от доставки / самовывоза */
function updateAddressVisibility() {
  const isPickup = deliveryModePickup && deliveryModePickup.checked;

  // Скрываем/показываем адрес
  if (fieldCity) fieldCity.style.display = isPickup ? 'none' : 'block';
  if (fieldStreet) fieldStreet.style.display = isPickup ? 'none' : 'block';
  if (fieldHouse) fieldHouse.style.display = isPickup ? 'none' : 'block';
  if (fieldApt) fieldApt.style.display = isPickup ? 'none' : 'block';

  // Показываем адреса самовывоза
  if (pickupInfo) pickupInfo.style.display = isPickup ? 'block' : 'none';

  // Показываем нужный блок времени
  if (isPickup) {
    pickupTimeSection.style.display = 'block';
    deliveryTimeSelect.closest('.checkout-section').style.display = 'none';
  } else {
    pickupTimeSection.style.display = 'none';
    deliveryTimeSelect.closest('.checkout-section').style.display = 'block';
  }
}

/* открытие checkout при клике "Оформить заказ" */
if (gotoCheckoutBtn && checkoutOverlay) {
  gotoCheckoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Корзина пуста — добавьте товары.');
      return;
    }

    modalOrderList.innerHTML = '';
    let sum = 0;
    cart.forEach(i => {
      const row = document.createElement('div');
      row.className = 'checkout-cart-row';
      row.innerHTML = `
        <div style="display:flex;justify-content:space-between;gap:8px">
          <div>
            <div style="font-weight:700">${i.name}</div>
            <div class="small" style="color:var(--muted)">${displayQty(i.qtyKg)}</div>
          </div>
          <div style="font-weight:700;white-space:nowrap">${formatRub(i.total)}</div>
        </div>
      `;
      modalOrderList.appendChild(row);
      sum += i.total;
    });

    if (modalTotal) {
      modalTotal.textContent = formatRub(sum);
    }

    updateAddressVisibility(); // на всякий случай
    checkoutOverlay.setAttribute('aria-hidden', 'false');
    hideCartPanel();
  });
}

/* кнопка "Назад" в шапке checkout */
if (closeModalBtn && checkoutOverlay) {
  closeModalBtn.addEventListener('click', () => {
    checkoutOverlay.setAttribute('aria-hidden', 'true');
    if (!cartPanel.classList.contains('show') && cart.length > 0) {
      setTimeout(() => showFloatingCart(), 120);
    }
  });
}

/* закрытие по клику вне панели */
if (checkoutOverlay) {
  checkoutOverlay.addEventListener('click', (e) => {
    if (e.target === checkoutOverlay) {
      checkoutOverlay.setAttribute('aria-hidden', 'true');
      if (!cartPanel.classList.contains('show') && cart.length > 0) {
        setTimeout(() => showFloatingCart(), 120);
      }
    }
  });
}

/* обработка выбора времени доставки */
if (deliveryTimeSelect) {
  deliveryTimeSelect.addEventListener('change', (e) => {
    const val = e.target.value;

    if (customTimeInput) {
      customTimeInput.style.display = val === 'custom' ? 'block' : 'none';
    }

    const text = describeDeliveryTime(val, customTimeInput ? customTimeInput.value : '');
    if (deliveryTimeHint) deliveryTimeHint.textContent = text;
    if (checkoutTimeDisplay) checkoutTimeDisplay.textContent = text;
  });
}

/* реагируем на ввод точного времени */
if (customTimeInput) {
  customTimeInput.addEventListener('input', () => {
    const val = customTimeInput.value;
    const text = describeDeliveryTime('custom', val);
    if (deliveryTimeHint) deliveryTimeHint.textContent = text;
    if (checkoutTimeDisplay) checkoutTimeDisplay.textContent = text;
  });
}

/* обработка выбора времени самовывоза */
if (pickupTimeSelect) {
  pickupTimeSelect.addEventListener('change', () => {
    const v = pickupTimeSelect.value;

    if (pickupCustomTimeRow)
      pickupCustomTimeRow.style.display = v === 'custom' ? 'block' : 'none';

    if (pickupTimeHint) {
      if (v === 'custom') {
        pickupTimeHint.textContent = "К выбранному времени";
      } else {
        pickupTimeHint.textContent = "Через " + v + " минут";
      }
    }
  });
}

/* ввод точного времени самовывоза */
if (pickupCustomTimeInput) {
  pickupCustomTimeInput.addEventListener('input', () => {
    if (pickupTimeHint)
      pickupTimeHint.textContent = "К " + pickupCustomTimeInput.value;
  });
}


/* переключение способа получения — доставка / самовывоз */
if (deliveryModeDelivery) {
  deliveryModeDelivery.addEventListener('change', () => {
    updateAddressVisibility();
  });
}
if (deliveryModePickup) {
  deliveryModePickup.addEventListener('change', () => {
    updateAddressVisibility();
  });
}
// при загрузке сразу привести в правильное состояние
updateAddressVisibility();

/* отправка заказа */
if (checkoutSubmitBtn && checkoutOverlay) {
  checkoutSubmitBtn.addEventListener('click', async () => {

    // ⛔ Блокируем, если пользователь не вошёл
    const user = getUserLocally();
    if (!user) {
      authModal.setAttribute("aria-hidden", "false");
      alert("Чтобы оформить заказ — войдите в аккаунт.");
      return;
    }

    if (cart.length === 0) {
      alert('Корзина пуста!');
      return;
    }

    const isPickup = deliveryModePickup && deliveryModePickup.checked;

    // обязательные поля
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const email = document.getElementById('cust-email').value.trim();
    const payment = document.getElementById('payment-method').value;
    const comment = document.getElementById('cust-comment').value.trim();

    if (!name || !phone) {
      alert("Пожалуйста, укажите имя и телефон.");
      return;
    }

    let timeText = "";

    if (isPickup) {
      const v = pickupTimeSelect.value;
      if (v === "custom") {
        const t = pickupCustomTimeInput.value;
        if (!t) {
          alert("Укажите точное время самовывоза");
          return;
        }
        timeText = "К " + t;
      } else {
        timeText = "Через " + v + " минут";
      }

    } else {
      const v = deliveryTimeSelect.value;
      if (v === "custom") {
        const t = customTimeInput.value;
        if (!t) {
          alert("Укажите точное время доставки");
          return;
        }
        timeText = "К " + t + " ± 10 минут";
      } else {
        timeText = describeDeliveryTime(v, customTimeInput.value);
      }
    }

    // адрес (только для доставки)
    let city = "", street = "", house = "", apt = "";

    if (!isPickup) {
      city = document.getElementById('cust-city').value.trim();
      street = document.getElementById('cust-street').value.trim();
      house = document.getElementById('cust-house').value.trim();
      apt = document.getElementById('cust-apartment').value.trim();

      if (!city || !street || !house) {
        alert("Пожалуйста, заполните город, улицу и дом.");
        return;
      }
    }

    // пункт самовывоза
    let pickupPoint = null;
    if (isPickup) {
      const selected = document.querySelector('input[name="pickup-point"]:checked');
      if (!selected) {
        alert("Выберите пункт самовывоза.");
        return;
      }
      pickupPoint = selected.value;
    }

    // корзина
    const items = cart.map(i => ({
      name: i.name,
      qtyKg: i.qtyKg,
      price: i.price,
      total: i.total
    }));

    const total = cart.reduce((s, i) => s + i.total, 0);

    /* ——— Сохраняем заказ в Supabase ——— */
    const { error: orderError } = await db
  .from("orders")
  .insert([{
    user_id: user.id,          // ← ТАК
    phone: user.phone,         // ← ТАК
    name,
    mode: isPickup ? "pickup" : "delivery",
    pickup_point: pickupPoint,
    city,
    street,
    house,
    apt,
    payment,
    time: timeText,
    comment,
    total,
    items
  }]);


    if (orderError) {
      alert("Ошибка сохранения заказа: " + orderError.message);
      return;
    }

    await refreshLoyalty();

    alert("Заказ успешно оформлен! 🎉");

    cart = [];
    renderCart();
    checkoutOverlay.setAttribute("aria-hidden", "true");
  });
}

/* ========== simple user system (localStorage) ========== */
function getStoredUser(){ try { return JSON.parse(localStorage.getItem('bm_user')||'null'); } catch(e){ return null; } }
function storeUser(u){ localStorage.setItem('bm_user', JSON.stringify(u)); }
function clearUser(){ localStorage.removeItem('bm_user'); localStorage.removeItem('bm_loyalty'); updateUserUI(); }

function getLoyalty(){ return parseInt(localStorage.getItem('bm_loyalty')||'0',10); }
function setLoyalty(n){ localStorage.setItem('bm_loyalty', String(n)); updateUserUI(); }
function addLoyalty(n){ const cur = getLoyalty(); setLoyalty(cur + n); }

function logout() {
  // полностью очищаем localStorage
  localStorage.removeItem("bm_user");
  localStorage.removeItem("bm_loyalty");

  // закрываем модалки
  if (authModal) authModal.setAttribute("aria-hidden", "true");
  if (checkoutOverlay) checkoutOverlay.setAttribute("aria-hidden", "true");

  const historyModal = document.getElementById("history-modal");
  if (historyModal) historyModal.style.display = "none";

  // обновляем интерфейс
  updateUserUI();

  alert("Вы вышли из аккаунта.");
}

function updateUserUI(){
  const u = getStoredUser();
  if(u){
    uaName.textContent = u.name || (u.phone || 'Пользователь');
    loyaltyBadge.textContent = 'Баллы: ' + getLoyalty();
  } else {
    uaName.textContent = 'Войти';
    loyaltyBadge.textContent = 'Баллы: 0';
  }
}

/* Try to auto-login from Telegram WebApp if available */
function tryTelegramLogin(){
  if(tg && tg.initDataUnsafe && tg.initDataUnsafe.user){
    const tu = tg.initDataUnsafe.user;
    const user = {
      id: 'tg_' + (tu.id||Math.random().toString(36).slice(2,8)),
      name: (tu.first_name || '') + (tu.last_name ? ' '+tu.last_name : ''),
      tgUser: tu
    };
    storeUser(user);
    if(!localStorage.getItem('bm_loyalty')) localStorage.setItem('bm_loyalty','0');
    updateUserUI();
    return true;
  }
  return false;
}

/* Auth UI wiring */
authClose.addEventListener('click', ()=> {
  authModal.setAttribute('aria-hidden','true');
});

authTg.addEventListener('click', ()=> {
  if(tryTelegramLogin()){
    alert('Вход через Telegram выполнен.');
    authModal.style.display='none';
  } else {
    alert('Telegram WebApp не доступен. Откройте мини-приложение через Telegram для этой функции.');
  }
  updateUserUI();
});

/* ========== helpers ========= */
function idify(s){ return String(s).replace(/\W+/g,'_'); }
function formatRub(v){ return Math.round(v) + ' ₽'; }
function displayQty(kg){ if(kg<1) return Math.round(kg*1000) + ' г'; return kg.toFixed(2) + ' кг'; }
function randInt(max){ return Math.floor(Math.random()*max); }

/* transliteration & slug for images */
function transliterate(str){
  if(!str) return '';
  const map = {'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'};
  return String(str).split('').map(ch=>{
    const lower = ch.toLowerCase();
    if(map[lower] !== undefined) return map[lower];
    if(/[a-z0-9]/i.test(ch)) return ch;
    if(/\s/.test(ch)) return '-';
    return '';
  }).join('');
}
function slugify(name){
  return transliterate(name).toLowerCase()
    .replace(/[^a-z0-9\-]+/g,'-')
    .replace(/^-+|-+$/g,'');
}

function tryLoadImage(imgEl, name){
  if(!imgEl) return;
  const exts = ['.webp','.jpg','.jpeg','.png'];
  const candidates = [];
  const slug = slugify(name || '');
  if(slug){
    exts.forEach(ext => candidates.push('images/' + slug + ext));
  }
  const encoded = encodeURIComponent(name || '');
  if(encoded){
    exts.forEach(ext => candidates.push('images/' + encoded + ext));
  }
  if(name && /^[\x00-\x7F]+$/.test(name)){
    exts.forEach(ext => candidates.push('images/' + name + ext));
  }
  candidates.push('images/noimage.png');

  let idx = 0;
  function tryNext(){
    if(idx >= candidates.length){
      imgEl.src = 'images/noimage.png';
      imgEl.onload = ()=> imgEl.style.opacity = '1';
      return;
    }
    const url = candidates[idx];
    const tester = new Image();
    tester.onload = () => {
      imgEl.src = url;
      imgEl.onload = ()=> imgEl.style.opacity = '1';
    };
    tester.onerror = () => {
      idx++;
      tryNext();
    };
    tester.src = url;
  }
  tryNext();
}

/* getters for both array and object product formats */
function getLabel(it){
  if(!it) return '';
  if(Array.isArray(it)) return it[0]||it[1]||'';
  return it.label||it.name||'';
}
function getName(it){
  if(!it) return '';
  if(Array.isArray(it)) return it[1]||it[0]||'';
  return it.name||it.label||'';
}
function getPrice(it){
  if(!it) return 0;
  if(Array.isArray(it)) return Number(it[2]||0);
  return Number(it.price||0);
}
function getCategory(it){
  if(!it) return '';
  if(Array.isArray(it)) return it[3]||'';
  return it.category||'';
}
function describeDeliveryTime(code, customValue){
  switch (code) {
    case 'asap':
      return 'Как можно скорее (до 1 часа)';
    case 'slot_15':
      return 'В течение 15 минут';
    case 'slot_30':
      return 'В течение 30 минут';
    case 'slot_60':
      return 'В течение 60 минут';
    case 'custom':
      if (customValue) {
        return 'Ко времени ' + customValue;
      }
      return 'Ко времени (время не указано)';
    default:
      return 'Как можно скорее';
  }
}

/* ========== renderCatalog ========== */
function renderCatalog(list){
  if(!catalogEl) return;
  catalogEl.innerHTML = '';
  list.forEach((p, idxVisible) => {
    const label = getLabel(p);
    const name = getName(p);
    const price = getPrice(p);
    const category = getCategory(p);

    let globalIdx = products.findIndex(pp =>
      getName(pp) === name &&
      getPrice(pp) === price &&
      String(getCategory(pp)) === String(category)
    );
    if(globalIdx === -1) globalIdx = idxVisible;

    const card = document.createElement('div');
    card.className = 'card fade-in';
    card.dataset.prodName = name;
    card.dataset.prodLabel = label;
    card.dataset.prodPrice = price;

    card.innerHTML = `
      <div class="photo"><img alt="${name}" loading="lazy"></div>
      <div class="info">
        <div class="name">${label}</div>
        <div class="desc">${name}</div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:auto;gap:8px">
          <div class="price">${price} ₽/кг</div>
          <div class="actions" style="min-width:120px">
            <input class="qty-input" type="number" min="1" step="1" value="1" title="Кол-во">
            <select class="unit-select" title="Единица">
              <option value="kg">кг</option>
              <option value="g">гр</option>
            </select>
            <button class="add-to-cart" data-idx="${idxVisible}" data-global-idx="${globalIdx}">+</button>
          </div>
        </div>
        <div class="reco small" data-idx="${idxVisible}"></div>
      </div>
    `;
    catalogEl.appendChild(card);

    const img = card.querySelector('img');
    tryLoadImage(img, name);

    const others = products.map((pp,i)=> i !== globalIdx ? pp : null).filter(Boolean);
    const picks = [];
    while(picks.length < 2 && others.length){
      const k = randInt(others.length);
      picks.push(others.splice(k,1)[0]);
    }
    const recoEl = card.querySelector('.reco');
    if(picks.length) recoEl.textContent = 'Рекомендуем: ' + picks.map(x=>getName(x)).join(', ');
  });
  if(shownCountEl) shownCountEl.textContent = list.length;
}

/* ========== Cart logic ========== */
function addToCart(productObj){
  const existing = cart.find(i =>
    i.name === productObj.name &&
    JSON.stringify(i.components||[]) === JSON.stringify(productObj.components||[])
  );
  if(existing){
    existing.qtyKg += productObj.qtyKg;
    existing.total = existing.qtyKg * existing.price;
  } else {
    cart.push({
      id: idify(productObj.name) + '_' + Math.random().toString(36).slice(2,8),
      name: productObj.name,
      price: productObj.price,
      qtyKg: productObj.qtyKg,
      total: productObj.qtyKg * productObj.price,
      components: productObj.components || null
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
  if(!cartItemsEl) return;
  cartItemsEl.innerHTML = '';
  let sum = 0;
  cart.forEach(item => {
    sum += item.total;
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div style="display:flex;gap:8px;align-items:center">
        <div>
          <div style="font-weight:700">${item.name}${item.components ? ' (Custom)' : ''}</div>
          <div class="small" style="color:var(--muted)">${displayQty(item.qtyKg)} • ${formatRub(item.total)}</div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
        <button style="background:transparent;border:0;cursor:pointer;color:#e74c3c" data-remove="${item.id}">✕</button>
        <div style="font-weight:700">${formatRub(item.total)}</div>
      </div>
    `;
    cartItemsEl.appendChild(row);
  });

  if(cartSumEl) cartSumEl.textContent = formatRub(sum);
  if(cartCountSmall) cartCountSmall.textContent = cart.length;
  if(fcCountEl) fcCountEl.textContent = cart.length + ' поз.';
  if(fcTotalEl) fcTotalEl.textContent = formatRub(sum);

  if(cart.length > 0) showFloatingCart();
  else hideFloatingCart();

  cartItemsEl.querySelectorAll('[data-remove]').forEach(btn => {
    btn.onclick = ()=> removeFromCart(btn.dataset.remove);
  });
}

/* floating cart helpers */
function showFloatingCart(){
  if(!floatingCart) return;
  floatingCart.classList.add('visible');
}
function hideFloatingCart(){
  if(!floatingCart) return;
  floatingCart.classList.remove('visible');
}

/* ========== Delegation: add to cart from catalog ========== */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-to-cart');
  if (!btn) return;

  const idxVisible = +btn.dataset.idx;
  const idxGlobal = btn.dataset.globalIdx !== undefined
    ? +btn.dataset.globalIdx
    : null;

  const card = btn.closest('.card');
  if (!card) return; // защита от null

  const qtyInput = card.querySelector('.qty-input');
  const unitSelect = card.querySelector('.unit-select');
  if (!qtyInput || !unitSelect) return; // ещё защита

  const qty = parseFloat(qtyInput.value) || 0;
  const unit = unitSelect.value;

  let qtyKg = unit === 'g' ? qty / 1000 : qty;
  if (qtyKg <= 0) {
    alert('Укажите количество');
    return;
  }

  const source =
    (visibleProducts && visibleProducts[idxVisible]) ||
    products[idxGlobal] ||
    products[idxVisible];

  const name = getName(source);
  const price = getPrice(source);

  addToCart({ name, price, qtyKg });

  // анимация галочки
  const ck = document.createElement('div');
  ck.className = 'checkmark';
  ck.textContent = '✓';

  card.style.position = 'relative';
  ck.style.position = 'absolute';
  ck.style.right = '8px';
  ck.style.top = '8px';
  ck.style.background = 'rgba(0,0,0,0.7)';
  ck.style.color = '#fff';
  ck.style.borderRadius = '999px';
  ck.style.width = '22px';
  ck.style.height = '22px';
  ck.style.display = 'flex';
  ck.style.alignItems = 'center';
  ck.style.justifyContent = 'center';
  ck.style.fontSize = '14px';
  ck.style.opacity = '0';
  ck.style.transform = 'scale(.6)';
  ck.style.transition = 'all .25s ease';

  card.appendChild(ck);
  setTimeout(() => {
    ck.style.opacity = '1';
    ck.style.transform = 'scale(1)';
  }, 10);
  setTimeout(() => {
    ck.style.opacity = '0';
    ck.style.transform = 'scale(.6)';
  }, 900);
  setTimeout(() => {
    ck.remove();
  }, 1200);
});

/* catalog card click -> open product modal (ignore clicks on interactive elements) */
catalogEl.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if(!card) return;
  if(e.target.closest('.add-to-cart') || e.target.closest('.qty-input') || e.target.closest('.unit-select')) return;
  const pname = card.dataset.prodName;
  const plabel = card.dataset.prodLabel;
  const pprice = card.dataset.prodPrice;

  pmName.textContent = plabel || pname;
  pmPrice.textContent = pprice ? (pprice + ' ₽/кг') : '';
  const info = kbjuData[pname];
  if(info){
    pmKbju.textContent = info.kbju;
    pmDesc.textContent = info.desc;
  } else {
    pmKbju.textContent = 'КБЖУ недоступно';
    pmDesc.textContent = 'Описание недоступно';
  }
  pmDesc.style.display = 'none';
  pmMore.textContent = 'Подробнее о товаре';

  tryLoadImage(pmImg, pname);

  pmQty.value = 1;
  pmUnit.value = 'kg';

  productModal.style.display = 'flex';
  productModal.setAttribute('aria-hidden','false');
});

/* product modal interactions */
pmMore.addEventListener('click', () => {
  if(pmDesc.style.display === 'none'){
    pmDesc.style.display = 'block';
    pmMore.textContent = 'Свернуть';
  } else {
    pmDesc.style.display = 'none';
    pmMore.textContent = 'Подробнее о товаре';
  }
});
pmClose.addEventListener('click', () => {
  productModal.style.display = 'none';
  productModal.setAttribute('aria-hidden','true');
});
productModal.addEventListener('click', (e) => {
  if(e.target === productModal){
    productModal.style.display = 'none';
    productModal.setAttribute('aria-hidden','true');
  }
});

/* add to cart from modal */
pmAdd.addEventListener('click', () => {
  const name = pmName.textContent || '';
  const priceText = pmPrice.textContent || '';
  const price = Number((priceText.match(/([\d\.]+)/) || [0,0])[1]) || 0;
  const qtyRaw = parseFloat(pmQty.value) || 0;
  const unit = pmUnit.value;
  let qtyKg = unit === 'g' ? qtyRaw/1000 : qtyRaw;
  if(qtyKg <= 0){ alert('Укажите количество'); return; }

  addToCart({ name, price, qtyKg });

  productModal.style.display = 'none';
  productModal.setAttribute('aria-hidden','true');
});

/* floating cart <-> panel logic */
let cartOpen = false;
function showCartPanel(){
  cartPanel.classList.add('show');
  cartPanel.setAttribute('aria-hidden','false');
  cartOpen = true;
  hideFloatingCart();
}
function hideCartPanel(){
  cartPanel.classList.remove('show');
  cartPanel.setAttribute('aria-hidden','true');
  cartOpen = false;
  setTimeout(()=> showFloatingCart(), 120);
}
if(floatingCart) floatingCart.addEventListener('click', ()=>{
  if(!cartOpen) showCartPanel();
  else hideCartPanel();
});
if(cartCloseBtn) cartCloseBtn.addEventListener('click', ()=> hideCartPanel());
document.addEventListener('click', (e)=> {
  if(!cartPanel.classList.contains('show')) return;
  if(e.target.closest('#cart-panel') || e.target.closest('#floating-cart')) return;
  hideCartPanel();
});
if(clearCartBtn) clearCartBtn.addEventListener('click', ()=>{
  clearCart();
  hideCartPanel();
});

/* ========== Filters / Search / Sort ========== */
function applySearchAndSort(){
  const q = (searchInput && searchInput.value || '').trim().toLowerCase();
  let list = (currentFilter === 'all' || !currentFilter)
    ? products.slice()
    : products.filter(p => String(getCategory(p)) === String(currentFilter));
  if(q){
    list = list.filter(p =>
      ( (getLabel(p) + ' ' + getName(p)).toLowerCase().indexOf(q) !== -1 )
    );
  }
  const s = (sortSelect && sortSelect.value) || 'default';
  if(s === 'price_asc') list.sort((a,b)=> getPrice(a) - getPrice(b));
  else if(s === 'price_desc') list.sort((a,b)=> getPrice(b) - getPrice(a));
  else if(s === 'name_asc') list.sort((a,b)=> String(getName(a)).localeCompare(String(getName(b)),'ru'));
  else if(s === 'name_desc') list.sort((a,b)=> String(getName(b)).localeCompare(String(getName(a)),'ru'));
  visibleProducts = list;
  renderCatalog(visibleProducts);
}

filtersWrap.addEventListener('click', (e)=> {
  const b = e.target.closest('.pill');
  if(!b) return;
  const f = b.dataset.filter || 'all';
  currentFilter = f;
  document.querySelectorAll('#filters .pill').forEach(x=>
    x.classList.toggle('active', x === b)
  );
  applySearchAndSort();
});

if(searchInput) searchInput.addEventListener('input', ()=> applySearchAndSort());
if(sortSelect) sortSelect.addEventListener('change', ()=> applySearchAndSort());

/* mobile search wiring */
if(fabOpen){
  fabOpen.addEventListener('click', ()=>{
    if(searchPanel){
      searchPanel.classList.toggle('open');
      mobileSearchInput && mobileSearchInput.focus();
    }
  });
}
if(closeSearchPanelBtn){
  closeSearchPanelBtn.addEventListener('click', ()=>{
    if(searchPanel) searchPanel.classList.remove('open');
  });
}
if(mobileSearchInput){
  mobileSearchInput.addEventListener('input', ()=>{
    if(searchInput) searchInput.value = mobileSearchInput.value;
    applySearchAndSort();
  });
}
if(mobileSort){
  mobileSort.addEventListener('change', ()=>{
    if(sortSelect) sortSelect.value = mobileSort.value;
    applySearchAndSort();
  });
}

/* ========== Checkout / order sending ========== */
function sendOrderToAdmin(payload){
  if(!ADMIN_WEBHOOK_URL){
    console.log('ADMIN WEBHOOK not set — order payload:', payload);
    return Promise.resolve({ ok: false, reason: 'no_webhook' });
  }
  return fetch(ADMIN_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(r=>r.json()).catch(err => {
    console.error('sendOrderToAdmin error', err);
    return { ok:false, error: String(err) };
  });
}

if (gotoCheckoutBtn) gotoCheckoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Корзина пуста — добавьте товары.');
    return;
  }

  // наполняем список товаров
  modalOrderList.innerHTML = '';
  let sum = 0;
  cart.forEach(i => {
    const row = document.createElement('div');
    const subtotal = i.total;
    sum += subtotal;
    row.innerHTML = `
      <div style="display:flex;justify-content:space-between;gap:8px">
        <div>
          <div style="font-weight:700">${i.name}</div>
          <div class="small" style="color:var(--muted)">${displayQty(i.qtyKg)}</div>
        </div>
        <div style="font-weight:700;white-space:nowrap">${formatRub(subtotal)}</div>
      </div>
    `;
    modalOrderList.appendChild(row);
  });
  modalTotal.textContent = formatRub(sum);

  // прячем панель корзины
  hideCartPanel();

  // открываем fullscreen checkout
  checkoutOverlay.setAttribute('aria-hidden', 'false');
});


if (closeModalBtn) closeModalBtn.addEventListener('click', () => {
  checkoutOverlay.setAttribute('aria-hidden', 'true');
  if (!cartPanel.classList.contains('show') && cart.length > 0) {
    setTimeout(() => showFloatingCart(), 120);
  }
});

// закрытие по клику вне панели
checkoutOverlay.addEventListener('click', (e) => {
  if (e.target === checkoutOverlay) {
    checkoutOverlay.setAttribute('aria-hidden', 'true');
    if (!cartPanel.classList.contains('show') && cart.length > 0) {
      setTimeout(() => showFloatingCart(), 120);
    }
  }
});

// переключение способа получения — доставка / самовывоз
if (deliveryModeDelivery) {
  deliveryModeDelivery.addEventListener('change', () => {
    pickupInfo.style.display = 'none';
  });
}

if (deliveryModePickup) {
  deliveryModePickup.addEventListener('change', () => {
    pickupInfo.style.display = 'block';
  });
}

/* hero buttons */
if (heroOrderBtn) {
  heroOrderBtn.addEventListener('click', () => {
    const main = document.querySelector('.main');
    if (main) {
      window.scrollTo({
        top: main.offsetTop - 20,
        behavior: 'smooth'
      });
    }
  });
}

if (viewCatalogBtn) {
  viewCatalogBtn.addEventListener('click', () => {
    const main = document.querySelector('.main');
    if (main) {
      window.scrollTo({
        top: main.offsetTop - 20,
        behavior: 'smooth'
      });
    }
  });
}

async function loadOrderHistory() {
  const user = getUserLocally();
  if (!user?.id) return [];

  const { data, error } = await db
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Ошибка загрузки заказов:", error);
    return [];
  }
  return data;
}



async function openHistoryModal() {
  const modal = document.getElementById("history-modal");
  const list = document.getElementById("history-list");

  list.innerHTML = "<div class='small'>Загрузка...</div>";

  const orders = await loadOrderHistory();

  if (!orders.length) {
    list.innerHTML = "<div class='small'>У вас ещё нет заказов.</div>";
  } else {
    list.innerHTML = "";

    orders.forEach(order => {
      const div = document.createElement("div");
      div.style.border = "1px solid #eee";
      div.style.padding = "12px";
      div.style.borderRadius = "10px";
      div.style.background = "#fafafa";

      const date = new Date(order.created_at).toLocaleString("ru-RU");

      div.innerHTML = `
        <div style="font-weight:700;margin-bottom:6px">
          Заказ на сумму ${order.total} ₽
        </div>
        <div class="small" style="margin-bottom:6px;color:#777">
          ${date}
        </div>
        <div class="small" style="margin-bottom:6px;color:#555">
          ${order.mode === "pickup" 
             ? "Самовывоз: " + (order.pickup_point || "—")
             : "Адрес: " + order.city + ", " + order.street + " " + order.house}
        </div>
        <details>
          <summary style="cursor:pointer;color:#34C48B;font-weight:600">Состав заказа</summary>
          <div style="margin-top:6px">
            ${order.items
              .map(
                item =>
                  `<div class="small">${item.name} — ${item.qtyKg} кг — ${item.total} ₽</div>`
              )
              .join("")}
          </div>
        </details>
      `;

      list.appendChild(div);
    });
  }

  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}

document.getElementById("history-close").addEventListener("click", () => {
  const modal = document.getElementById("history-modal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
});

document.getElementById("history-modal").addEventListener("click", (e) => {
  if (e.target.id === "history-modal") {
    e.target.style.display = "none";
    e.target.setAttribute("aria-hidden", "true");
  }
});

async function refreshLoyalty() {
  const user = getUserLocally();
  if (!user?.id) return;

  const { data } = await db
    .from("customers")
    .select("loyalty_points")
    .eq("id", user.id)
    .single();

  if (data) {
    localStorage.setItem("bm_loyalty", data.loyalty_points);
    updateUserUI();
  }
}


/* ========== init ========== */
function init() {
  tryTelegramLogin();
  updateUserUI();

  visibleProducts = products.slice();
  renderCatalog(visibleProducts);
  renderCart();

  hideFloatingCart();

  if (tg && typeof tg.expand === 'function') {
    tg.expand();
  }
}
init();

