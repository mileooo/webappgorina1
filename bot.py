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
# ID админов, которым слать уведомления
# Подставь сюда реальные chat_id (их можно поймать из message.from_user.id)
ADMINS = [
    1209683705,  # админ 1
]

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
        logging.info(f"ПРИШЛИ ДАННЫЕ ИЗ WEBAPP: {message.web_app_data.data}")
       
            # Ожидаем словарь с type="order"
            if not isinstance(data, dict) or data.get("type") != "order":
                logging.info(f"Получены web_app_data непонятного формата: {data}")
                return

            items = data.get("items", []) or []
            total = data.get("total", 0)
            mode = data.get("mode", "delivery")
            pickup_point = data.get("pickupPoint") or ""
            city = data.get("city") or ""
            street = data.get("street") or ""
            house = data.get("house") or ""
            apt = data.get("apt") or ""
            time_text = data.get("timeText") or "как можно скорее"
            payment = data.get("payment") or "не указано"
            comment = data.get("comment") or ""

            user = data.get("user") or {}
            user_name = user.get("name") or "Без имени"
            user_phone = user.get("phone") or "Без телефона"

            if not items:
                await message.answer("❗ Корзина пуста, заказ не распознан.")
                return

            lines = []
            lines.append("🧾 <b>Новый заказ</b>")
            lines.append("")
            lines.append(f"👤 Клиент: {user_name}")
            lines.append(f"📞 Телефон: {user_phone}")
            lines.append(f"💳 Оплата: {payment}")
            lines.append(f"⏱ Время: {time_text}")

            if mode == "pickup":
                lines.append(f"📍 Самовывоз: {pickup_point or 'не указан'}")
            else:
                addr_line = f"{city}, {street} {house}"
                if apt:
                    addr_line += f", кв. {apt}"
                lines.append(f"📦 Доставка: {addr_line}")

            if comment:
                lines.append("")
                lines.append(f"💬 Комментарий: {comment}")

            lines.append("")
            lines.append("📦 <b>Состав заказа:</b>")
            for item in items:
                name = item.get("name")
                qty = item.get("qtyKg")
                line_total = item.get("total")
                lines.append(f"• {name} — {qty} кг — {line_total} ₽")

            lines.append("")
            lines.append(f"💰 <b>Итого:</b> {total} ₽")

            text = "\n".join(lines)

            # отправляем всем админам
            for admin_id in ADMINS:
                try:
                    await bot.send_message(admin_id, text, parse_mode="HTML")
                except Exception as e:
                    logging.error(f"Не удалось отправить сообщение админу {admin_id}: {e}")

            # отвечаем пользователю
            await message.answer("✅ Заказ принят, спасибо!")

        except Exception as e:
            logging.error(f"Ошибка обработки данных из WebApp: {e}")
            await message.answer("⚠️ Произошла ошибка при обработке заказа.")
    else:
        await message.answer("👋 Отправь /start, чтобы открыть магазин.")

# Запуск бота
async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
