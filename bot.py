from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.types import KeyboardButton, ReplyKeyboardMarkup, WebAppInfo
import asyncio
import json
import logging

# Логи, чтобы видеть всё, что происходит
logging.basicConfig(level=logging.INFO)

API_TOKEN = "8269137514:AAHj6mSZgHb1w9S85GAjlP1249O9RceZBsM"

bot = Bot(token=API_TOKEN)
dp = Dispatcher()

# тут только ты
ADMINS = [
    1209683705,  # мой chat_id, 
]


# /start — кнопка с WebApp
@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    kb = ReplyKeyboardMarkup(
        keyboard=[[
            KeyboardButton(
                text="🛒 Оформить заказ",
                web_app=WebAppInfo(
                    url="https://webappgorina1-27jw.vercel.app"
                )
            )
        ]],
        resize_keyboard=True
    )

    await message.answer(
        "Привет! Добро пожаловать в 🍏 Bravo Market!\n\n"
        "Нажми кнопку ниже, чтобы открыть магазин 👇",
        reply_markup=kb
    )


# /myid — чтоб не гадать с chat_id
@dp.message(Command("myid"))
async def cmd_myid(message: types.Message):
    await message.answer(f"Твой chat_id: {message.from_user.id}")


# ЛОГИРУЕМ ЛЮБОЙ апдейт, чтобы видеть, что вообще прилетает
@dp.message()
async def debug_all(message: types.Message):
    logging.info(
        f"DEBUG UPDATE: from={message.from_user.id}, "
        f"text={message.text!r}, "
        f"web_app_data={message.web_app_data}"
    )

    # если это данные из WebApp — обрабатываем как заказ
    if message.web_app_data:
        await handle_order_from_webapp(message)
    else:
        # для обычных сообщений — просто подсказка
        if message.text not in ("/start", "/myid"):
            await message.answer("👋 Отправь /start, чтобы открыть магазин.")


async def handle_order_from_webapp(message: types.Message):
    try:
        raw = message.web_app_data.data
        logging.info(f"ПРИШЛИ ДАННЫЕ ИЗ WEBAPP: {raw}")

        data = json.loads(raw)

        if not isinstance(data, dict) or data.get("type") != "order":
            logging.info(f"web_app_data непонятного формата: {data}")
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

        # шлём всем админам (сейчас только тебе)
        for admin_id in ADMINS:
            try:
                await bot.send_message(admin_id, text, parse_mode="HTML")
            except Exception as e:
                logging.error(f"Не удалось отправить админу {admin_id}: {e}")

        await message.answer("✅ Заказ принят, спасибо!")

    except Exception as e:
        logging.error(f"Ошибка обработки данных из WebApp: {e}")
        await message.answer("⚠️ Ошибка при обработке заказа.")


async def main():
    logging.info("Бот запущен, ждём заказы...")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
