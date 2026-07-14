# Hyper Local — Project Overview

**Version:** 1.3.0 | **License:** MIT | **Private:** true

Hyper Local is a fully-featured hyperlocal e-commerce Progressive Web App (PWA) for goods ordering and delivery, built with Next.js (Pages Router).

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | ^16.2.2 | React framework (Pages Router) |
| React | 19.2.3 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^4 | Utility-first CSS |
| HeroUI (NextUI) | ^2.8.7 | Component library |
| Framer Motion | 12.26.0 | Animations |
| Redux Toolkit | ^2.11.2 | State management |
| Redux Persist | ^6.0.0 | State persistence (localStorage) |
| i18next | ^25.7.4 | Internationalization (en, hi, ar) |
| Firebase | ^12.7.0 | Auth, Analytics, Push notifications |
| Axios | ^1.13.2 | HTTP client |
| SWR | ^2.3.8 | Data fetching/caching |
| Stripe / Razorpay / Paystack | — | Payment processing |
| Leaflet | ^1.9.4 | Maps (react-leaflet) |
| Swiper | ^12.0.3 | Carousels/sliders |
| @ducanh2912/next-pwa | — | PWA support |
| next-themes | 0.4.6 | Dark/light mode |

---

## Project Structure

```
/
├── .agents/                  # AI agent skill definitions
├── public/                   # Static assets, PWA icons, locales (en/hi/ar), manifest, robots.txt, sitemap.xml
├── scripts/                  # Build/deploy: update-manifest.mjs, update-robots.mjs, generate-sitemap.mjs
├── src/                      # Application source code
│   ├── components/           # Reusable UI components (Cards, Cart, Footer, Modals, Navbar, etc.)
│   ├── config/               # App config: constants, fonts, SEO, site metadata, nav items
│   ├── contexts/             # React contexts (SettingsContext)
│   ├── guards/               # Route guards: authGuard, withAuth HOC
│   ├── helpers/              # Utilities: auth, events, validators, location permission, SEO generators
│   ├── hooks/                # Custom hooks: useDebouncedValue, useInfiniteData, useRecentSearches, useScreenType
│   ├── layouts/              # Layout components: default, UserLayout
│   ├── lib/                  # Firebase init, analytics, cookies, Redux store + slices (auth, cart, checkout, etc.)
│   ├── pages/                # Next.js Pages Router — file-based routing
│   │   ├── _app.tsx          # App wrapper (providers, toast, progress bar)
│   │   ├── _document.tsx     # Custom Document
│   │   ├── index.tsx         # Homepage (SSR or static)
│   │   ├── about-us/         # About page
│   │   ├── brands/           # Brand listing + [slug]/
│   │   ├── cart/             # Cart
│   │   ├── categories/       # Category listing + [slug]/
│   │   ├── delivery-zones/   # Delivery zones
│   │   ├── faqs/             # FAQ
│   │   ├── feature-sections/ # Featured sections
│   │   ├── forgot-password/  # Password reset
│   │   ├── my-account/       # Account dashboard (addresses, notifications, orders, referrals, transactions, wallet, wishlists)
│   │   ├── privacy-policy/   # Privacy policy
│   │   ├── products/         # Products search + [slug]/
│   │   ├── return-refund-policy/
│   │   ├── seller-register/  # Seller registration
│   │   ├── share/            # Share product pages
│   │   ├── shopping-list/    # Shopping list
│   │   ├── static-products/  # Static product pages
│   │   ├── stores/           # Store listing + [slug]/
│   │   ├── terms-and-conditions/
│   │   └── 404/              # Custom 404
│   ├── routes/               # API communication: Axios instance + ~130 API functions, interceptors
│   ├── SEO/                  # SEO components: DynamicSEO, PageHead, SEOHead
│   ├── services/             # Service layer (homePageService, ProductDetailPageService)
│   ├── stores/               # Zustand stores (maintenanceStore)
│   ├── styles/               # globals.css, index.css, custom styles
│   ├── types/                # TypeScript definitions (API params, API responses, shared types)
│   └── views/                # Page-level view components (CartPageView, homePage/, OrderDetailView, Products/, WishListPageView)
├── .env                      # NEXT_PUBLIC_SSR, ADMIN_PANEL_URL, SITE_URL
├── next.config.ts            # PWA, Turbopack, security headers, image optimization, static export
├── tsconfig.json             # ES2017, bundler module resolution, @/* -> src/*
├── tailwind.config.ts        # Tailwind v4 + HeroUI plugin, primary color #A0194F, dark mode class
├── postcss.config.mjs        # @tailwindcss/postcss
├── eslint.config.mjs         # Flat config: next/core-web-vitals, TypeScript, React, import rules
├── i18n.ts                   # i18next init (en, hi, ar) with RTL support
├── create-htaccess.js        # Apache rewrite rules for static export
├── ftp.js                    # FTP deployment script
└── README.md
```

---

## Routing Architecture

Next.js **Pages Router** with file-based routing under `src/pages/`:

- **Static routes:** `cart/` → `/cart`, `faqs/` → `/faqs`
- **Dynamic routes:** `products/[slug]/` → `/products/:slug`
- **Nested routes:** `my-account/orders/[slug]/` → `/my-account/orders/:slug`
- **SSR toggle:** Controlled by `NEXT_PUBLIC_SSR` env var — homepage uses `getServerSideProps` when enabled, otherwise runs as static PWA.

---

## Data Flow

1. **API Layer** (`src/routes/api.ts`) — Axios instance targeting `NEXT_PUBLIC_ADMIN_PANEL_URL` with 130+ typed endpoints for settings, banners, categories, products, brands, stores, delivery zones, cart, orders, wishlists, wallet, reviews, auth, payments, FAQs, promotions.
2. **Interceptors** (`src/routes/interceptor.ts`) — Auto-inject Bearer tokens, handle 401 (auto logout), 503 (maintenance mode).
3. **Services** (`src/services/`) — Orchestrate parallel API calls for complex pages (homepage, product detail).
4. **State** — Redux (persisted) for auth/cart/checkout/offlineCart/recentlyViewed; SWR for server caching; Zustand for maintenance mode; React Context for settings.

---

## Key Features

- Multi-vendor / single-vendor mode
- Email/password, Google OAuth, Apple OAuth, phone OTP auth (Firebase)
- Payments: Razorpay, Stripe, Paystack, wallet, COD
- Delivery zone checks, store scheduling, live delivery tracking (map)
- Multi-language: English, Hindi, Arabic (RTL support)
- Dark/light mode
- PWA: offline support, installable, push notifications (FCM)
- SEO: dynamic meta tags, OpenGraph, JSON-LD, sitemap, robots.txt
- Seller registration with document upload
- Maintenance mode, force update, offline page

---

## Scripts

| Script | Command | Purpose |
|---|---|---|
| dev | `next dev --turbopack` | Dev server |
| build | `lint && update-manifest && update-robots && generate-sitemap && next build` | Production build |
| deploy | `npm install && build && create-htaccess && ftp` | Full deploy to FTP |
| start | `next start` | Production server |
| lint | `eslint --fix` | Lint + auto-fix |
| scan:i18n | `i18next-scanner` | Scan for missing translations |
