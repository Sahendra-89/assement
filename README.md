# LuxeShop — E-Commerce App

A personal project I built to practice Next.js App Router and modern React patterns. It's a fully working shopping app with cart, wishlist, and checkout — nothing fancy behind the scenes, just a clean frontend pulling data from a public API.

Live demo: [https://your-deployment-url.vercel.app](https://your-deployment-url.vercel.app) _(update this once deployed)_

---

## What it does

- Browse products with category filter, search, and sort options
- View individual product pages with ratings and related items
- Add to cart or wishlist — both persist in localStorage so they survive page refresh
- Checkout flow with form validation and a success screen
- Toast notifications when you add/remove things

---

## Tech used

- **Next.js 16** with the App Router
- **React 19** — Context API + useReducer for cart/wishlist state
- **CSS Modules** — kept it vanilla, no Tailwind
- **DummyJSON** (`https://dummyjson.com`) for product data — free, no key needed
- Deployed on **Vercel**

---

## Getting started

You'll need Node 18+ installed.

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd ecommerce-app
npm install
npm run dev
```

That's it. Open `http://localhost:3000`.

No `.env` file needed — the API is public.

---

## Folder structure

```
src/
├── app/
│   ├── page.js              # home page
│   ├── layout.js            # root layout with navbar/footer
│   ├── globals.css          # global styles and CSS variables
│   ├── products/            # listing + individual product pages
│   ├── cart/
│   ├── wishlist/
│   └── checkout/
├── components/              # Navbar, Footer, ProductCard, CartItem, etc.
├── context/                 # CartContext, WishlistContext, ToastContext
└── lib/
    ├── api.js               # all the DummyJSON fetch calls
    └── utils.js             # helpers like formatPrice, renderStars, etc.
```

---

## API details

Everything goes through `src/lib/api.js`. I'm using four endpoints from DummyJSON:

| What | Endpoint |
|---|---|
| All products | `GET /products?limit=100` |
| Single product | `GET /products/:id` |
| Categories | `GET /products/categories` |
| By category | `GET /products/category/:slug` |

DummyJSON's product object uses `thumbnail` instead of `image`, and `rating` is just a plain number rather than `{ rate, count }`. I normalize all of that in a small `normalize()` function so the rest of the app doesn't have to care.

Fetches use Next.js `{ next: { revalidate: 3600 } }` so data is cached for an hour at the edge — pages load fast without hammering the API.

---

## Building for production

```bash
npm run build
npm run start
```

Or just push to GitHub and connect it to Vercel — it picks up the Next.js config automatically and deploys in about a minute.

---

## Notes

- Images are served from `cdn.dummyjson.com` — that domain is whitelisted in `next.config.mjs`
- Cart and wishlist state is reset if the user clears `localStorage`
- No backend, no database — this is purely a frontend project
