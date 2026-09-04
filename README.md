# 🌐 GlobalTech — Full-Stack E-Commerce Platform

> A production-grade tech e-commerce storefront built with **Next.js 14**, **Tailwind CSS**, and a full admin panel. Features rich scroll animations, fully responsive mobile layouts, multi-currency support, and 25+ pages.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=flat-square&logo=tailwindcss) 
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
  
---  
Live - [Globaltech.com](https://globaaltech.netlify.app)
(Backup) - [Globaltech.com](https://globaaltech2.netlify.app)
 
## ✨ Features
 
### 🛍️ Storefront 
- **Hero Banner** — auto-rotating slider with Ken Burns background effect, animated headlines, shimmer CTA buttons
- **Category Grid** — 13 product categories with scroll-triggered stagger animations
- **Flash Deals** — countdown timers with digit-tick animation, discount badges 
- **Featured Products** — tab-filtered product grid with scroll-reveal
- **Brand Logos** — infinite auto-scrolling ticker, hover to pause, color reveal on hover
- **Trust Badges** — animated icon pop-in on scroll
- **Newsletter** — gradient section with focus glow input animation
- **Footer** — link nudge + arrow reveal on hover, social icon scale, secret admin gate (triple-click logo) 

### 🛒 Shopping Experience
- **Product pages** with image gallery, reviews, stock indicators 
- **Cart sidebar** — slides in from right, live item count with icon pop animation
- **Wishlist** — persisted across session
- **Checkout** — 3-step flow (Shipping → Payment → Confirmation) with animated step indicator and order processing animation
- **Coupon codes** — validated at checkout
- **Multi-currency** — USD, EUR, GBP, and more, switchable from navbar
- **Compare products** side-by-side
- **Search** with URL query params

### 📱 Mobile
- Fully responsive — tested down to 375px
- Mobile navbar slides in from right with logo, close button, full category list, cart total
- 2-column product grids on mobile
- Touch-friendly 44px tap targets
- iOS safe area inset support (notch / home bar)
- `viewport` meta with proper scaling 

### 🔐 Admin Panel (`/admin`)
Access via 

| Page | Features |
|------|----------|
| Dashboard | KPI cards with count-up animation, revenue bar chart, category sales bars with grow animation, recent orders with row-fade |
| Orders | Full order table with status filters |
| Products | Product catalog management |
| Customers | Customer list with stats |
| Coupons | Coupon code management |
| Analytics | Revenue charts |
| Settings | Store configuration |

Admin sidebar collapses to icon-only mode on desktop, slides in as overlay on mobile.

### 🎨 Animations
Every animation is pure CSS keyframes + React state — no heavy animation library required at runtime.

| Animation | Where |
|-----------|-------|
| Ken Burns | Hero background |
| Shimmer sweep | CTA buttons, Add to Cart |
| Scroll-reveal stagger | Category grid, product cards, flash deals |
| Hero headline fade-up | Hero banner on slide change |
| Digit tick | Flash deal countdown timers |
| Brand ticker scroll | Brand logos section |
| Scale bounce in | Trust badges, modal open, admin gate |
| Input glow pulse | Newsletter email input |
| Sidebar slide-in | Cart, mobile nav, admin mobile sidebar |
| Toast slide from right | Toast notifications (with exit animation) |
| Count-up numbers | Admin KPI stat cards |
| Bar grow from left | Admin category chart bars |
| Table row fade | Admin recent orders |
| Particle burst | Admin gate on correct password |
| Shake | Admin gate on wrong password |
| Footer link nudge + arrow | Footer nav links on hover |
| Social icon scale + lift | Footer social buttons |
| PC Builder pulse ring | Navbar PC Builder button |
| Page enter/exit | Every route transition |

---

## 🗂️ Project Structure

```
frontend/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── page.jsx                # Homepage
│   │   ├── layout.jsx              # Root layout + providers
│   │   ├── globals.css             # Global styles + all keyframes
│   │   ├── products/               # Product listing + detail + reviews
│   │   ├── categories/[slug]/      # Category pages
│   │   ├── brand/[slug]/           # Brand pages
│   │   ├── cart/                   # Cart page
│   │   ├── checkout/               # 3-step checkout
│   │   ├── account/                # User account + orders
│   │   ├── wishlist/               # Wishlist
│   │   ├── deals/                  # Flash deals
│   │   ├── compare/                # Product comparison
│   │   ├── search/                 # Search results
│   │   ├── track/                  # Order tracking
│   │   ├── loyalty/                # Loyalty program
│   │   ├── pc-builder/             # Custom PC builder tool
│   │   ├── stores/                 # Store locator
│   │   ├── auth/                   # Login / Register / Reset
│   │   ├── admin/                  # Admin panel (7 sub-pages)
│   │   ├── about/                  # About us
│   │   ├── support/                # Support hub
│   │   ├── contact/                # Contact form
│   │   ├── faq/                    # FAQ accordion
│   │   ├── returns/                # Returns policy
│   │   ├── privacy-policy/
│   │   ├── terms-of-service/
│   │   └── cookie-policy/
│   │
│   ├── components/
│   │   ├── home/
│   │   │   ├── HeroBanner.jsx      # Animated hero slider
│   │   │   ├── CategoryGrid.jsx    # Scroll-reveal category grid
│   │   │   ├── FlashDeals.jsx      # Countdown deal cards
│   │   │   ├── FeaturedProducts.jsx
│   │   │   ├── BrandLogos.jsx      # Auto-scroll ticker
│   │   │   ├── TrustBadges.jsx     # Animated trust section
│   │   │   └── Newsletter.jsx      # Gradient subscribe section
│   │   ├── layout/
│   │   │   ├── Navbar.jsx          # Full navbar with mega menu + mobile drawer
│   │   │   ├── Footer.jsx          # Footer with admin gate easter egg
│   │   │   ├── CartSidebar.jsx     # Slide-in cart drawer
│   │   │   ├── MegaMenu.jsx
│   │   │   └── StoreShell.jsx      # Layout wrapper
│   │   ├── products/
│   │   │   └── ProductCard.jsx
│   │   └── ui/
│   │       ├── Toast.jsx           # Slide-in/out toast notifications
│   │       ├── Modal.jsx
│   │       ├── Skeletons.jsx
│   │       └── PromoPopup.jsx
│   │
│   ├── context/
│   │   ├── CartContext.jsx
│   │   ├── AuthContext.jsx
│   │   ├── WishlistContext.jsx
│   │   ├── ToastContext.jsx
│   │   └── CurrencyContext.js
│   │
│   ├── hooks/
│   │   ├── useScrollAnimation.js   # IntersectionObserver hook for scroll reveals
│   │   ├── useCart.js
│   │   ├── useAuth.js
│   │   ├── useToast.js
│   │   └── useCurrency.js
│   │
│   ├── lib/
│   │   ├── products.js             # Product + category data
│   │   └── coupons.js              # Coupon validation logic
│   │
│   └── utils/
│       └── helpers.js
│
├── public/
│   ├── logo.png
│   ├── logo-icon.png
│   └── logo.svg
│
├── package.json
├── tailwind.config.js
├── next.config.js
└── postcss.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js **18+**
- npm or yarn

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/globaltech-ecommerce.git
cd globaltech-ecommerce/frontend

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> The app works fully without a backend — all product data is in `src/lib/products.js` and all state is client-side.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| UI Library | [React 18](https://react.dev/) |
| Styling | [Tailwind CSS 3.4](https://tailwindcss.com/) + custom CSS keyframes |
| Fonts | Outfit (body), Syne (display), JetBrains Mono (code) |
| HTTP Client | [Axios](https://axios-http.com/) |
| Form Handling | [React Hook Form](https://react-hook-form.com/) |
| Data Fetching | [React Query](https://tanstack.com/query/v3) |
| Animations | Pure CSS keyframes + React state (no runtime animation library) |
| Icons | Inline SVGs (zero dependency) |
| Images | Next.js `<Image>` + Unsplash for demo content |

---

## 📄 Pages Reference

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, categories, deals, products, brands |
| `/products` | Full product catalog with filters and sorting |
| `/products/[id]` | Product detail with gallery and reviews |
| `/categories/[slug]` | Category-filtered product listing |
| `/brand/[slug]` | Brand page with products |
| `/deals` | Flash deals with countdown timers |
| `/compare` | Side-by-side product comparison |
| `/search` | Search results page |
| `/cart` | Shopping cart |
| `/checkout` | 3-step checkout (Shipping → Payment → Confirmation) |
| `/account` | User profile, orders, addresses, wishlist |
| `/wishlist` | Saved products |
| `/track` | Order tracking |
| `/loyalty` | Loyalty points program |
| `/pc-builder` | Custom PC builder tool |
| `/stores` | Store locator map |
| `/auth` | Login / Register |
| `/auth/reset-password` | Password reset |
| `/admin` | Admin dashboard |
| `/admin/orders` | Order management |
| `/admin/products` | Product management |
| `/admin/customers` | Customer management |
| `/admin/coupons` | Coupon management |
| `/admin/analytics` | Revenue analytics |
| `/admin/settings` | Store settings |
| `/support` | Support hub |
| `/contact` | Contact form |
| `/faq` | FAQ accordion |
| `/about` | About us |
| `/returns` | Returns & exchanges |
| `/privacy-policy` | Privacy policy |
| `/terms-of-service` | Terms of service |
| `/cookie-policy` | Cookie policy |
| `/sitemap` | Site map |

---

## 🎨 Design System
 
### Brand Colors
```css
--brand-pink:   #e8517a
--brand-orange: #f4874b
--brand-yellow: #f5c518

/* Dark palette */
--dark-900: #0f0f1a
--dark-800: #1a1a2e
--dark-700: #252540
```

### Gradient
```css
background: linear-gradient(135deg, #e8517a 0%, #f4874b 50%, #f5c518 100%);
```

### Typography
- **Display / Headings**: Syne
- **Body**: Outfit
- **Code / Mono**: JetBrains Mono

---

## 🔑 Admin Access
(Basic)
The admin panel is hidden behind a secret easter egg:

1. Scroll to the bottom of any page
2. **Triple-click** the GlobalTech logo in the footer
3. Enter password: `admin123`
4. You'll be redirected to `/admin`

Or navigate directly to `/admin`.

---

## 📦 Available Scripts

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

Built by **Saikot Islam Abir**

---

*GlobalTech — Your Tech Superstore* 🚀
