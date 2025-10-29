from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import KeyboardButton, ReplyKeyboardMarkup, WebAppInfo
import asyncio
import json
import logging

# Включаем логирование (полезно при отладке)
logging.basicConfig(level=logging.INFO)

API_TOKEN = "8269137514:AAHj6mSZgHb1w9S85GAjlP1249O9RceZBsM"

bot = Bot(token=API_TOKEN)
dp = Dispatcher()

# Команда /start с кнопкой WebApp
@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    webapp_kb = ReplyKeyboardMarkup(
        keyboard=[[
            KeyboardButton(
                text="🛒 Оформить заказ",
                web_app=WebAppInfo(url="https://webappgorina1-27jw.vercel.app")  # <-- сюда можно вставить локальный или хостинг URL
            )
        ]],
        resize_keyboard=True
    )
    await message.answer(
        "Привет! Добро пожаловать в 🍏 Bravo Market!\n\n"
        "Нажми кнопку ниже, чтобы открыть магазин 👇",
        reply_markup=webapp_kb
    )

# Обработка данных из WebApp
@dp.message()
async def handle_webapp(message: types.Message):
    if message.web_app_data:
        try:
            cart = json.loads(message.web_app_data.data)
            if not cart:
                await message.answer("❗ Корзина пуста, закажите что-нибудь 😉")
                return

            total = sum(item["price"] for item in cart)
            text = "🧾 *Новый заказ:*\n\n" + "\n".join(
                [f"• {item['name']} — {item['price']}₽" for item in cart]
            )
            text += f"\n\n💰 *Итого:* {total}₽"

            await message.answer(text, parse_mode="Markdown")

            # Здесь можно добавить сохранение в файл или базу данных:
            # with open("orders.json", "a", encoding="utf-8") as f:
            #     json.dump({"user": message.from_user.id, "order": cart}, f, ensure_ascii=False)
            #     f.write("\n")

        except Exception as e:
            logging.error(f"Ошибка обработки данных из WebApp: {e}")
            await message.answer("⚠️ Произошла ошибка при обработке заказа.")
    else:
        await message.answer("👋 Отправь /start, чтобы оформить заказ.")

# Запуск бота
async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
