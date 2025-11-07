import os, json, hmac, hashlib
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import httpx

from dotenv import load_dotenv
load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN") or ""
ADMIN_ID = os.getenv("ADMIN_ID") or ""
WEBAPP_URL = os.getenv("WEBAPP_URL") or ""

if not BOT_TOKEN:
    print("WARNING: BOT_TOKEN not set")
if not ADMIN_ID:
    print("WARNING: ADMIN_ID not set")

app = FastAPI(title="Bravo Market API")

# CORS
origins = []
allow = os.getenv("ALLOWED_ORIGINS")
if allow:
    origins = [o.strip() for o in allow.split(",") if o.strip()]
else:
    origins = ["http://localhost:8000","http://127.0.0.1:8000","http://localhost:5173","http://127.0.0.1:5173","https://web.telegram.org","https://web.telegram.org/a"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load products (server-side pricing)
with open("products.json", "r", encoding="utf-8") as f:
    PRODUCTS = {int(p["id"]): p for p in json.load(f)}

# Telegram initData verification
def verify_init_data(init_data: str, bot_token: str) -> Dict[str, Any]:
    if not init_data:
        raise HTTPException(401, "Missing init_data")
    from urllib.parse import parse_qsl
    data = dict(parse_qsl(init_data, keep_blank_values=True))
    if "hash" not in data:
        raise HTTPException(401, "No hash")
    check_hash = data.pop("hash")

    pairs = [f"{k}={v}" for k, v in sorted(data.items())]
    data_check_string = "\n".join(pairs)

    secret_key = hmac.new(b"WebAppData", bot_token.encode(), hashlib.sha256).digest()
    calc_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

    if not hmac.compare_digest(calc_hash, check_hash):
        raise HTTPException(401, "Invalid init_data")

    user_json = data.get("user")
    user = {}
    if user_json:
        import json as _json
        try:
            user = _json.loads(user_json)
        except Exception:
            user = {}
    return {"ok": True, "user": user, "raw": data}

class OrderItem(BaseModel):
    id: int
    qty: float = Field(..., gt=0)

class Customer(BaseModel):
    name: str
    phone: str
    city: str
    street: str
    house: str
    apt: Optional[str] = ""
    time: str
    email: Optional[str] = ""
    payment: str

class OrderPayload(BaseModel):
    init_data: str
    items: List[OrderItem]
    customer: Customer

@app.get("/api/products")
def api_products():
    # return products without secrets
    return {"items": list(PRODUCTS.values())}

@app.get("/api/auth")
def api_auth(init_data: str = Query(..., alias="init_data")):
    info = verify_init_data(init_data, BOT_TOKEN)
    return {"ok": True, "user": info.get("user")}

@app.post("/api/order")
async def api_order(payload: OrderPayload):
    info = verify_init_data(payload.init_data, BOT_TOKEN)
    if not payload.items:
        raise HTTPException(400, "Empty items")

    lines = []
    total = 0
    for it in payload.items:
        prod = PRODUCTS.get(int(it.id))
        if not prod:
            raise HTTPException(400, f"Unknown product id={it.id}")
        line_total = prod["price"] * it.qty
        total += line_total
        lines.append(f"• {prod['name']} — {it.qty:.2f} кг — {int(line_total)} ₽")

    c = payload.customer
    text = "🧾 *Новый заказ — Bravo Market*\n\n" + "\n".join(lines)
    text += f"\n\n💰 *Итого:* {int(total)} ₽\n"
    text += (
        f"\n👤 {c.name}\n"
        f"📞 {c.phone}\n"
        f"📍 {c.city}, {c.street}, д. {c.house}" + (f", кв. {c.apt}" if c.apt else "") + "\n"
        f"🕒 {c.time}\n"
        f"💳 Оплата: {c.payment}\n"
        f"✉️ {c.email or '—'}\n"
    )
    tg_user = info.get("user") or {}
    if tg_user:
        text += f"\nTelegram: @{tg_user.get('username','—')} (id: {tg_user.get('id','—')})"

    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(
            f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
            json={"chat_id": ADMIN_ID, "text": text, "parse_mode": "Markdown"}
        )
        r.raise_for_status()

    return {"ok": True, "total": int(total)}
