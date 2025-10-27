document.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram.WebApp; // объект Telegram
  const productList = document.getElementById("product-list");
  const cartItems = document.getElementById("cart-items");
  const total = document.getElementById("total");
  const sendOrderBtn = document.getElementById("send-order");

  // Список товаров — оставил как было (ничего не менял).
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

    // Формируем пути к картинкам (попробуем сначала .jpg, при ошибке подменим на .png)
    const jpgPath = `images/${p.name}.jpg`;
    const pngPath = `images/${p.name}.png`;

    // Вставляем картинку и остальную разметку (не меняя логику кнопки)
    // onerror переключает на .png если .jpg не найден
    const imgHtml = `<img src="${jpgPath}" alt="${p.name}" class="product-image" onerror="this.onerror=null; this.src='${pngPath}';">`;

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
  sendOrderBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Корзина пуста!");
      return;
    }
    // Отправляем JSON с заказом
    tg.sendData(JSON.stringify(cart));
    // Закрываем WebApp
    tg.close();
  });

  // Подготовка внешнего вида WebApp
  tg.expand();
});
