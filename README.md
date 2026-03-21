# ⚡ LuxeShop — Premium E-Commerce App

A full-featured e-commerce web application built with **Next.js 16** (App Router), featuring a stunning dark theme, real product data from Fake Store API, and complete shopping functionality.

## 🚀 Live Demo

Deployed on Vercel — [View Live](https://your-deployment-url.vercel.app)

## ✨ Features

- **Product Listing** — Browse 20 products fetched from Fake Store API with search, sort & filter
- **Product Detail** — Full product page with gallery, rating, tabs, and related products
- **Shopping Cart** — Add/remove/update qty, persisted in localStorage, dynamic shipping calculation
- **Wishlist** — Save favourites, persisted in localStorage, bulk "Add All to Cart"
- **Checkout** — Full form validation, multiple payment methods, animated success state

## 🛠 Tech Stack

| Technology | Usage |
|---|---|
| Next.js 16 (App Router) | Framework |
| React Context + useReducer | State management |
| Vanilla CSS Modules | Styling |
| Fake Store API | Product data |
| localStorage | Cart & Wishlist persistence |
| Google Fonts (Inter + Playfair Display) | Typography |

## 📦 Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── page.js              # Homepage
│   ├── products/            # Product listing + detail pages
│   ├── cart/                # Cart page
│   ├── wishlist/            # Wishlist page
│   └── checkout/            # Checkout page
├── components/              # Reusable UI components
├── context/                 # Cart, Wishlist & Toast contexts
└── lib/                     # API utilities & helpers
```

## 🌐 Deployment

This app is configured for **Vercel** deployment:

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Click Deploy — no configuration needed!
