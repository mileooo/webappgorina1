// Функция для работы внутри Telegram WebApp
let isTelegram = false;
if (window.Telegram && window.Telegram.WebApp) {
    isTelegram = true;
    Telegram.WebApp.expand(); // Развернуть WebApp на полный экран
}

// Список товаров
const products = [
    {id: 1, name: "Яблоко", category: "Фрукты", price: 80, oldPrice: 100, stock: 10, tag: "hit", image: "apple.jpg"},
    {id: 2, name: "Банан", category: "Фрукты", price: 60, stock: 15, image: "banana.jpg"},
    {id: 3, name: "Апельсин", category: "Фрукты", price: 70, stock: 3, image: "orange.jpg"},
    {id: 4, name: "Морковь", category: "Овощи", price: 50, oldPrice: 60, stock: 20, image: "carrot.jpg"},
    {id: 5, name: "Огурец", category: "Овощи", price: 45, stock: 8, image: "cucumber.jpg"},
    {id: 6, name: "Томаты", category: "Овощи", price: 90, stock: 2, image: "tomato.jpg"},
    {id: 7, name: "Груша", category: "Фрукты", price: 80, oldPrice: 100, stock: 7, tag: "new", image: "pear.jpg"}
];

let currentCategory = "all";
let searchTerm = "";
let currentSort = "";

// Рендер списка товаров
function renderProducts(list) {
    const container = document.querySelector('.products');
    container.innerHTML = '';
    list.forEach(p => {
        // Формируем карточку товара
        const card = document.createElement('div');
        card.className = 'product-card';
        // Изображение товара
        const img = document.createElement('img');
        img.src = 'images/' + p.image;
        img.alt = p.name;
        card.appendChild(img);
        // Название товара
        const title = document.createElement('h3');
        title.textContent = p.name;
        card.appendChild(title);
        // Цена товара
        const priceDiv = document.createElement('div');
        priceDiv.className = 'price';
        if (p.oldPrice) {
            const oldPrice = document.createElement('span');
            oldPrice.className = 'old-price';
            oldPrice.textContent = p.oldPrice + ' ₽';
            priceDiv.appendChild(oldPrice);
            const newPrice = document.createElement('span');
            newPrice.className = 'new-price';
            newPrice.textContent = p.price + ' ₽';
            priceDiv.appendChild(newPrice);
        } else {
            const priceSpan = document.createElement('span');
            priceSpan.className = 'price-current';
            priceSpan.textContent = p.price + ' ₽';
            priceDiv.appendChild(priceSpan);
        }
        card.appendChild(priceDiv);
        // Бейджи: Хит, Новинка, Скидка, Осталось
        if (p.tag === 'hit') {
            const badge = document.createElement('span');
            badge.className = 'badge hit';
            badge.textContent = 'Хит';
            card.appendChild(badge);
        }
        if (p.tag === 'new') {
            const badge = document.createElement('span');
            badge.className = 'badge new';
            badge.textContent = 'Новинка';
            card.appendChild(badge);
        }
        if (p.oldPrice) {
            const discount = Math.round((p.oldPrice - p.price) / p.oldPrice * 100);
            const badge = document.createElement('span');
            badge.className = 'badge sale';
            badge.textContent = '-' + discount + '%';
            card.appendChild(badge);
        }
        if (p.stock <= 5) {
            const badge = document.createElement('span');
            badge.className = 'badge last';
            badge.textContent = 'Осталось ' + p.stock;
            card.appendChild(badge);
        }
        // Кнопка "Добавить в корзину"
        const btn = document.createElement('button');
        btn.className = 'add-to-cart';
        btn.textContent = 'Добавить в корзину';
        btn.dataset.id = p.id;
        card.appendChild(btn);
        // Добавляем карточку в контейнер
        container.appendChild(card);
    });
    // После рендера привязываем события к кнопкам "Добавить"
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            addToCart(id);
        });
    });
}

// Фильтрация товаров
function filterAndRender() {
    let filtered = products.filter(p => {
        let matchCat = (currentCategory === 'all' || p.category === currentCategory);
        let matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCat && matchSearch;
    });
    // Сортировка
    if (currentSort === 'price-asc') {
        filtered.sort((a,b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
        filtered.sort((a,b) => b.price - a.price);
    } else if (currentSort === 'name-asc') {
        filtered.sort((a,b) => a.name.localeCompare(b.name));
    } else if (currentSort === 'name-desc') {
        filtered.sort((a,b) => b.name.localeCompare(a.name));
    }
    renderProducts(filtered);
}

// Cart
let cart = {};
// Обновление счетчика на кнопке корзины
function updateCartCount() {
    const count = Object.values(cart).reduce((acc, qty) => acc + qty, 0);
    document.getElementById('cart-count').textContent = count;
}
// Обновление элементов корзины
function updateCartItems() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let total = 0;
    for (let id in cart) {
        const qty = cart[id];
        const prod = products.find(p => p.id == id);
        if (!prod) continue;
        const itemTotal = prod.price * qty;
        total += itemTotal;
        // Создаем элемент в корзине
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span>${prod.name} x${qty}</span>
            <span>${itemTotal} ₽</span>
            <button class="remove-item" data-id="${id}">✕</button>
        `;
        cartItems.appendChild(div);
    }
    document.getElementById('cart-total').textContent = 'Итого: ' + total + ' ₽';
    // Привязываем события на удаление из корзины
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            delete cart[id];
            updateCartCount();
            updateCartItems();
        });
    });
}

// Добавление товара в корзину
function addToCart(id) {
    if (!cart[id]) {
        cart[id] = 0;
    }
    cart[id]++;
    updateCartCount();
    updateCartItems();
}

// Открытие панели корзины
function openCart() {
    document.getElementById('cart-panel').classList.add('open');
    document.getElementById('cart-btn').style.display = 'none';
}
// Закрытие панели корзины
function closeCart() {
    document.getElementById('cart-panel').classList.remove('open');
    document.getElementById('cart-btn').style.display = 'block';
}

// Оформление заказа
function checkout() {
    if (Object.keys(cart).length === 0) return;
    let order = {items: [], total: 0};
    for (let id in cart) {
        const qty = cart[id];
        const prod = products.find(p => p.id == id);
        if (!prod) continue;
        order.items.push({name: prod.name, qty: qty, price: prod.price});
        order.total += prod.price * qty;
    }
    const orderData = JSON.stringify(order);
    if (isTelegram) {
        Telegram.WebApp.sendData(orderData);
        Telegram.WebApp.close();
    } else {
        alert('Ваш заказ:\n' + order.items.map(i => i.name + ' x' + i.qty + ' = ' + (i.price * i.qty) + ' ₽').join('\n') + '\nИтого: ' + order.total + ' ₽');
    }
}

// Инициализация после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    // Первичная отрисовка
    filterAndRender();
    // Слушатели категории
    document.querySelectorAll('#categories button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('#categories .active').classList.remove('active');
            btn.classList.add('active');
            currentCategory = btn.dataset.cat;
            filterAndRender();
        });
    });
    // Слушатели поиска
    document.getElementById('search').addEventListener('input', (e) => {
        searchTerm = e.target.value;
        filterAndRender();
    });
    // Слушатели сортировки
    document.getElementById('sort').addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterAndRender();
    });
    // Слушатели панели корзины
    document.getElementById('cart-btn').addEventListener('click', openCart);
    document.getElementById('close-cart').addEventListener('click', closeCart);
    document.getElementById('checkout-btn').addEventListener('click', checkout);
});
