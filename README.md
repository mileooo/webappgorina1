# Bravo Market — Telegram WebApp (User Assortment)

- Безопасный бэкенд (FastAPI): проверяет Telegram initData, пересчитывает цены на сервере, шлет уведомление админу.
- Фронт берет картинки из каталога `images/` рядом с `index.html`.
- В `products.json` нет поля `img`: фронт сам строит путь `images/<name>.jpg`.

## Запуск API
```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn server:app --reload --port 8000
```

## Настройки
Скопируйте `.env.example` в `.env` и заполните:
- `BOT_TOKEN` — токен бота
- `ADMIN_ID` — ваш Telegram ID
- `WEBAPP_URL` — ссылка на фронт (Vercel)
- `ALLOWED_ORIGINS` — домены фронта

## Фронт
Открой `index.html` на Vercel/статическом хостинге. В `script.js` укажите:
```js
const API_BASE = "http://localhost:8000"; // или прод-URL вашего API
```

## Картинки
Положите файлы картинок в папку `images/` рядом с `index.html`, названия — точь‑в‑точь как `name` в `products.json`, с расширением `.jpg`:
- `images/Арбуз.jpg`
- `images/Груша.jpg`
...

Или в `products.json` можно добавить поле `img` для каждого товара и указать путь вручную.
