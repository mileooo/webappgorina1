import os, asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import KeyboardButton, ReplyKeyboardMarkup, WebAppInfo
from dotenv import load_dotenv
load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN") or ""
WEBAPP_URL = os.getenv("WEBAPP_URL") or ""

if not BOT_TOKEN:
    raise RuntimeError("BOT_TOKEN is missing. Put it into .env")
if not WEBAPP_URL:
    print("WARNING: WEBAPP_URL is not set. The button will open a placeholder.")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    kb = ReplyKeyboardMarkup(
        keyboard=[[KeyboardButton(text="🛒 Открыть магазин", web_app=WebAppInfo(url=WEBAPP_URL or "https://example.com"))]],
        resize_keyboard=True
    )
    await message.answer(
        "Привет! Добро пожаловать в 🍏 Bravo Market.\nНажми кнопку, чтобы открыть магазин 👇",
        reply_markup=kb
    )

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
