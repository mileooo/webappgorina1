document.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram.WebApp; // объект Telegram
  const productList = document.getElementById("product-list");
  const cartItems = document.getElementById("cart-items");
  const total = document.getElementById("total");
  const sendOrderBtn = document.getElementById("send-order");

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
    card.innerHTML = `
      <h3>${p.name}</h3>
      <p>${p.price} ₽</p>
      <button>Добавить</button>
    `;
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
