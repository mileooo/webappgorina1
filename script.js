document.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : { sendData: () => {}, close: () => {}, expand: () => {} };
  const productList = document.getElementById("product-list");
  const cartItems = document.getElementById("cart-items");
  const total = document.getElementById("total");
  const sendOrderBtn = document.getElementById("send-order");

  // Список товаров — НЕ менял бизнес-логику, просто пример массива.
  const products = [
    { name: "Яблоки", price: 100 },
    { name: "Бананы", price: 120 },
    { name: "Помидоры", price: 150 },
    { name: "Огурцы", price: 130 }
  ];

  let cart = [];

  // Показать товары
  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product";

    // Пути к картинкам
    const jpgPath = `images/${p.name}.jpg`;
    const pngPath = `images/${p.name}.png`;
    const noImagePath = `images/noimage.png`;

    // Вставляем картинку и остальную разметку
    // onerror сделан в виде цепочки: если .jpg не загрузился — подставляем .png, а при её ошибке — noimage.png
    const imgHtml = `<img src="${jpgPath}" alt="${p.name}" class="product-image" onerror="this.onerror=function(){this.src='${noImagePath}'}; this.src='${pngPath}';">`;

    card.innerHTML = `
      ${imgHtml}
      <h3>${p.name}</h3>
      <p>${p.price} ₽</p>
      <button type="button">Добавить</button>
    `;

    // Поведение кнопки — как было
    card.querySelector("button").addEventListener("click", () => {
      cart.push(p);
      renderCart();
    });

    productList.appendChild(card);
  });

  // Показать корзину
  function renderCart() {
    if (!cartItems || !total) return;
    cartItems.innerHTML = "";
    let sum = 0;
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} — ${item.price} ₽`;
      cartItems.appendChild(li);
      sum += item.price;
    });
    total.textContent = `Итого: ${sum} ₽`;
  }

  // Отправить заказ в Telegram
  if (sendOrderBtn) {
    sendOrderBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Корзина пуста!");
        return;
      }
      // Отправляем JSON с заказом
      if (tg && typeof tg.sendData === "function") {
        tg.sendData(JSON.stringify(cart));
        tg.close();
      } else {
        // на случай локального теста
        console.log("Отправка (тест):", JSON.stringify(cart));
        alert("Заказ готов (режим теста). Проверь консоль.");
      }
    });
  }

  // Подготовка внешнего вида WebApp
  if (tg && typeof tg.expand === "function") tg.expand();
});
