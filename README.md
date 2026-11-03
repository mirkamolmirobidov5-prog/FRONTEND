# Smartbis Market — React Frontend

React + Vite + Tailwind CSS. Backend: SmartBiz API (`smartbiz-backend`, port **5000**).

## Ishga tushirish
```bash
npm install
npm run dev        # http://localhost:5173
```
Avval backend ishlab turishi kerak (`npm run dev` backend papkasida). Dev rejimda `/api/*` so'rovlari
Vite proxy orqali `http://localhost:5000` ga yo'naltiriladi.

## Production / boshqa manzil
`.env` faylida backend manzilini ko'rsating (oxirida `/` siz, `/api/v1` siz):
```
VITE_API_URL=https://api.example.com
```
Bu holda backendda CORS yoqilgan bo'lishi kerak (backendda yoqilgan).

## Sahifalar
- **Mahsulotlar** — qidiruv, kategoriya/narx/ombor filtri, saralash, pagination, yangi mahsulot qo'shish, savatga solish
- **Buyurtma** — savat, miqdorni o'zgartirish, mijoz ismi, buyurtma berish
- **Statistika** — daromad, buyurtmalar, top mahsulotlar, kunlik savdo, kategoriya bo'yicha daromad
