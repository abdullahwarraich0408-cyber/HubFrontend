# PharmaHub — Backend Architecture

## Stack Overview

| Layer | Choice |
|---|---|
| API Framework | Node.js + Express |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT + httpOnly cookies |
| Cache | Redis |
| Search | PostgreSQL FTS → Meilisearch |
| Payments | JazzCash + EasyPaisa |
| File Storage | Cloudinary / AWS S3 |
| Background Jobs | BullMQ + Redis |
| Realtime | Socket.io |
| Email | Resend |
| SMS / OTP | Twilio / Local Gateway |

---

## Full Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                   │
│                                                                             │
│   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐          │
│   │  Customer Portal │   │  Vendor Portal  │   │  Admin Portal   │          │
│   │  Next.js 16      │   │  Next.js 16     │   │  Next.js 16     │          │
│   │  /browse /cart   │   │  /vendor/dash   │   │  /admin/dash    │          │
│   └────────┬─────────┘   └────────┬────────┘   └────────┬────────┘          │
│            │                      │                      │                  │
│            └──────────────────────┼──────────────────────┘                  │
│                      React Query (HTTP) + Socket.io (WS)                    │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                    │
│                                                                             │
│              NGINX  (reverse proxy, SSL termination, rate limit)            │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           NODE.JS + EXPRESS                                 │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │  Auth       │  │  Products   │  │  Orders     │  │  Vendors    │       │
│  │  Router     │  │  Router     │  │  Router     │  │  Router     │       │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘       │
│         │                │                 │                 │              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │  Payments   │  │  Customers  │  │ Transactions│  │  Reports    │       │
│  │  Router     │  │  Router     │  │  Router     │  │  Router     │       │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘       │
│         │                │                 │                 │              │
│         └────────────────┴─────────────────┴─────────────────┘              │
│                                    │                                        │
│                    ┌───────────────┼───────────────┐                       │
│                    │               │               │                       │
│             ┌──────▼─────┐  ┌──────▼─────┐  ┌──────▼──────┐              │
│             │ Middleware  │  │  Services  │  │  Socket.io  │              │
│             │ JWT Auth    │  │  Layer     │  │  Server     │              │
│             │ Role Guard  │  │  Business  │  │  (realtime) │              │
│             │ Validation  │  │  Logic     │  └─────────────┘              │
│             │ Rate Limit  │  └──────┬─────┘                               │
│             └─────────────┘         │                                      │
└─────────────────────────────────────┼───────────────────────────────────────┘
                                      │
              ┌───────────────────────┼────────────────────────┐
              │                       │                        │
              ▼                       ▼                        ▼
┌─────────────────────┐  ┌────────────────────┐  ┌────────────────────────┐
│     PRIMARY DB       │  │      CACHE         │  │     FILE STORAGE       │
│                      │  │                    │  │                        │
│   PostgreSQL         │  │   Redis            │  │   Cloudinary / S3      │
│                      │  │                    │  │                        │
│   via Prisma ORM     │  │  • Sessions        │  │  • Product images      │
│                      │  │  • Rate limits     │  │  • Vendor docs         │
│  Tables:             │  │  • Product cache   │  │  • Prescriptions       │
│  ├── users           │  │  • Vendor cache    │  │                        │
│  ├── vendors         │  │  • Search results  │  └────────────────────────┘
│  ├── products        │  │  • BullMQ queues   │
│  ├── orders          │  │                    │
│  ├── order_items     │  └────────────────────┘
│  ├── transactions    │
│  ├── commissions     │
│  ├── reviews         │
│  └── audit_logs      │
└─────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SEARCH SERVICE                                    │
│                                                                             │
│   PostgreSQL Full-Text Search  ──────────►  Meilisearch (when needed)      │
│   (medicines, vendors, categories)          (self-hosted, fast autocomplete)│
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKGROUND JOBS (BullMQ + Redis)                   │
│                                                                             │
│   ┌────────────────┐  ┌────────────────┐  ┌───────────────┐  ┌──────────┐  │
│   │ Commission     │  │ Vendor Payout  │  │ Order Timeout │  │ Reports  │  │
│   │ Calculator     │  │ Scheduler      │  │ Handler       │  │ Generator│  │
│   └────────────────┘  └────────────────┘  └───────────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         NOTIFICATIONS                                       │
│                                                                             │
│   Resend (email)          Twilio / Local Gateway (SMS)                     │
│   • Order confirmed       • OTP verification                               │
│   • Payout processed      • Order status updates                           │
│   • Low stock alert       • Delivery notifications                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         PAYMENTS                                            │
│                                                                             │
│        JazzCash API  ◄──────► Express Router ◄──────► EasyPaisa API        │
│        (webhook)                                       (webhook)            │
│                  └──────────────────────────────┘                          │
│                          PostgreSQL transactions table                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         DEPLOYMENT (Railway / Render / AWS)                 │
│                                                                             │
│   GitHub Push                                                               │
│       │                                                                     │
│       ▼                                                                     │
│   GitHub Actions CI  ──► Build & Test  ──► Deploy                          │
│   (.github/workflows)                       │                              │
│                                             ├── Express API server         │
│                                             ├── PostgreSQL (managed)       │
│                                             ├── Redis (managed)            │
│                                             └── Next.js (Vercel / same)    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Request Flow

1. Browser hits **NGINX** → forwarded to Express
2. Middleware chain: rate limit → JWT verify → role guard → validation
3. Route handler calls **service layer** (business logic)
4. Service checks **Redis cache** first → on miss, queries **PostgreSQL** via Prisma
5. File ops go to **Cloudinary/S3**, search goes to **Meilisearch**
6. Heavy tasks (commissions, payouts) get pushed to **BullMQ** queue
7. Realtime events (order status change) emitted via **Socket.io** back to client
8. Notifications dispatched async via **Resend / Twilio**

---

## Why Socket.io

Three specific use cases:

1. **Order status updates** — customer sees `Pending → Processing → Shipped → Delivered` live without refreshing
2. **Vendor notifications** — vendor gets instant alert when a new order comes in
3. **Low stock alerts** — vendor dashboard KPI card updates in real time

---

## Database Tables Explained

### `orders` vs `order_items`

Classic one-to-many relationship. You can't store multiple products inside a single row, so the order is split across two tables.

**`orders`** — one row per order, the container
```
id | customer_id | vendor_id | total_amount | status | delivery_address | created_at
```

**`order_items`** — one row per product inside that order
```
id | order_id | product_id | quantity | unit_price
```

**Example:** Customer buys Panadol x2 and Vitamin C x1 in one checkout.

`orders` table:
```
id: ORD-901 | customer: Ali Khan | total: PKR 1250 | status: pending
```

`order_items` table:
```
id: 1 | order_id: ORD-901 | product: Panadol   | qty: 2 | price: 450
id: 2 | order_id: ORD-901 | product: Vitamin C  | qty: 1 | price: 350
```

### All Tables

| Table | Purpose |
|---|---|
| `users` | Customers — auth credentials, profile, addresses |
| `vendors` | Pharmacy accounts — name, license, status, commission rate |
| `products` | Medicine listings — name, formula, price, stock, vendor_id |
| `orders` | Order header — customer, vendor, total, status, address |
| `order_items` | Line items per order — product, qty, unit price |
| `transactions` | Payment records — amount, type, gateway reference |
| `commissions` | Platform cut per order — calculated from vendor rate |
| `reviews` | Customer ratings on products |
| `audit_logs` | Admin trail — who did what and when |

---

## Auth — Role Guards

Three roles, three separate JWT scopes:

```
customer  →  /api/customer/*
vendor    →  /api/vendor/*
admin     →  /api/admin/*
```

Each route group has its own middleware that checks the role claim in the JWT before letting the request through.
