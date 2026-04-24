# Seamless QR Dining

> A full-stack, real-time restaurant ordering system that lets customers scan a QR code, browse a digital menu, and place orders directly from their table — while kitchen staff manage everything from a live dashboard.

[![CI](https://github.com/dhaatrik/seamless-qr-dining/actions/workflows/ci.yml/badge.svg)](https://github.com/dhaatrik/seamless-qr-dining/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Node.js](https://img.shields.io/badge/Node.js-18%20%7C%2020-green)

---

## Table of Contents

- [Why This Project?](#why-this-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

---

## Why This Project?

Traditional restaurant workflows rely on paper menus, manual waiter calls, and verbal order relay — all of which introduce delays, miscommunication, and friction for both customers and staff.

**Seamless QR Dining** eliminates these bottlenecks by digitizing the entire flow:

1. **Customer scans a QR code** → lands on a table-specific digital menu.
2. **Browses, customizes, and places an order** → all from their phone.
3. **Kitchen receives the order instantly** → with audio alerts and a real-time dashboard.
4. **Staff updates order status** → customer sees live progress.

The result is a faster, quieter, and more accurate dining experience — no app install required.

---

## Features

### For Customers

| Feature | Description |
|---------|-------------|
| **Digital Menu** | Categorized menu (Starters, Mains, Desserts, Drinks) with images and prices |
| **Item Customization** | Cook level, sides, add-ons, and special instructions per item |
| **Cart & Checkout** | Review order, adjust quantities, choose payment method, and add notes |
| **Virtual Waiter** | One-tap requests for water, the bill, or a waiter — plus custom messages |
| **Order Tracking** | Real-time status updates (Pending → Preparing → Ready → Delivered) |
| **Guest Access** | No account needed — enter a table number and start ordering |
| **OTP Login** | Optional phone-based authentication with simulated OTP verification |

### For Kitchen Staff

| Feature | Description |
|---------|-------------|
| **Live Dashboard** | New orders appear instantly with audio notification alerts |
| **Order Pipeline** | Three-column view: New → Active → Completed |
| **Status Updates** | One-click status transitions with visual progress indicators |
| **Table Tracking** | Every order shows its originating table number and time elapsed |

---

## Tech Stack

This project was built with a modern, production-oriented stack chosen for type safety, performance, and developer experience.

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) | Server-side rendering, file-based routing, API routes |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Compile-time type safety across the entire codebase |
| **UI** | [React 19](https://react.dev/) | Component-based architecture with hooks |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS for rapid, responsive design |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | Declarative animations and gesture handling |
| **State** | React Context API | Lightweight global state (Auth, Orders, Toasts) |
| **Testing** | [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/) | 77 tests across 18 suites (unit + benchmark) |
| **CI/CD** | [GitHub Actions](https://github.com/features/actions) | Automated lint, test, and build on every push/PR |
| **Linting** | [ESLint 9](https://eslint.org/) + `eslint-config-next` | Code quality enforcement with flat config |

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/dhaatrik/seamless-qr-dining.git
cd seamless-qr-dining

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **`http://localhost:3000`**.

---

## Usage

### Customer View

Open a browser and navigate to:

```
http://localhost:3000/?table=1
```

The `table` parameter simulates scanning a QR code at a specific table. Change the number to simulate different tables (`?table=2`, `?table=3`, etc.).

From here you can:
- Enter a table number and tap **View Menu** to browse as a guest
- Or tap **Log In** to authenticate with a phone number (simulated OTP: use phone `1234567890`, OTP `1234`)

### Kitchen Dashboard

Open a separate browser tab and navigate to:

```
http://localhost:3000/kitchen
```

Orders placed from the customer view will appear here in real time with audio alerts. Use the dashboard to accept, prepare, and complete orders.

---

## Project Structure

```
seamless-qr-dining/
├── .github/workflows/     # CI/CD pipeline (GitHub Actions)
│   └── ci.yml
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── page.tsx       # Customer landing page (Login / Menu)
│   │   ├── kitchen/       # Kitchen dashboard route
│   │   │   └── page.tsx
│   │   ├── api/auth/      # API routes
│   │   │   └── verify-otp/route.ts
│   │   ├── layout.tsx     # Root layout
│   │   └── globals.css    # Global styles
│   ├── components/
│   │   ├── Customer/      # Cart, Login, Menu, MenuItem, ItemDetail,
│   │   │                  # CartFloatingBar, VirtualWaiter, OrderHistory
│   │   ├── Kitchen/       # Dashboard
│   │   └── Shared/        # Button, Card, Modal, Drawer, ToastContainer
│   ├── contexts/          # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── OrderContext.tsx
│   │   └── ToastContext.tsx
│   ├── data/              # Static data (menu items & categories)
│   ├── hooks/             # Custom hooks (useBodyScrollLock)
│   ├── types/             # TypeScript declaration files
│   └── utils/             # Utility functions (encryption/security)
├── tests/                 # All test files (mirrors src/ structure)
│   ├── api/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   └── utils/
├── eslint.config.mjs      # ESLint 9 flat config
├── jest.config.cjs        # Jest configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── CONTRIBUTING.md        # Contribution guidelines
├── LICENSE                # MIT License
└── package.json
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint on the `src/` directory |
| `npm run test` | Run the full Jest test suite |

---

## Testing

The project includes **77 tests across 18 test suites**, covering unit tests and performance benchmarks.

```bash
# Run the full test suite
npm run test

# Run a specific test file
npx jest --config jest.config.cjs tests/contexts/AuthContext.test.tsx

# Run tests in watch mode
npx jest --config jest.config.cjs --watch
```

### Test Coverage

| Area | Suites | What's Tested |
|------|--------|---------------|
| **Contexts** | 3 | Auth flow, order lifecycle, toast notifications |
| **Components** | 12 | Cart, Login, Menu, Dashboard, Modal, Drawer, Card, etc. |
| **Hooks** | 1 | Body scroll lock behavior |
| **Utils** | 1 | Data encryption and decryption |
| **API Routes** | 1 | OTP verification endpoint |
| **Benchmarks** | 4 | Render time, sort performance, reduce optimization |

---

## Contributing

Contributions are welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md) before getting started.

In short:

1. Fork the repo and create a feature branch
2. Write code with tests
3. Ensure `npm run lint` and `npm run test` pass
4. Open a Pull Request with a clear description

---

## Author

**Dhaatrik Chowdhury** — [github.com/dhaatrik](https://github.com/dhaatrik)

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
