# Seamless QR Dining

Welcome to the **Seamless QR Dining** project! This is a modern web application designed to streamline the dining experience by allowing customers to order directly from their tables using QR codes, while providing kitchen staff with a real-time dashboard.

## 🌟 Overview

This application bridges the gap between customers and kitchen staff.
- **Customers** scan a QR code (simulated by URL parameters) to access a digital menu, customize their orders, and place them instantly.
- **Kitchen Staff** use a dedicated dashboard to receive, track, and manage orders from preparation to delivery.

## ✨ Features

### 🍽️ For Customers
- **Digital Menu**: Browse a visually appealing menu with categories (Starters, Mains, Desserts, Drinks).
- **Customization**: Personalize orders with options like cook level, sides, and add-ons.
- **Cart Management**: Add items, adjust quantities, and review the total before ordering.
- **Virtual Waiter**: Request service (Water, Bill, Waiter) or send custom messages to staff.
- **Order History**: Track the status of placed orders in real-time.
- **Dietary Information**: clear indicators for Vegan, Gluten-Free, and Spicy items.

### 👨‍🍳 For Kitchen Staff
- **Real-Time Dashboard**: See new orders instantly as they arrive (with sound alerts).
- **Order Management**: Update status from 'Pending' -> 'Preparing' -> 'Ready' -> 'Delivered' -> 'Completed'.
- **Kitchen Display System (KDS)**: Organized view of active tickets with timers and table details.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for responsive and modern design.
- **State Management**: React Context API (`OrderContext`, `AuthContext`).
- **Animations**: [Framer Motion](https://www.framer.com/motion/).
- **Testing**: Jest and React Testing Library.

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/seamless-qr-dining.git
   cd seamless-qr-dining
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open the application:**
   - **Customer View**: Visit `http://localhost:3000/?table=1` (Change `table=1` to simulate different tables).
   - **Kitchen Dashboard**: Visit `http://localhost:3000/kitchen`.

## 📁 Project Structure

The project is organized as follows within the `src` directory:

- **`app/`**: Next.js App Router pages.
  - `page.tsx`: The main customer landing page (Login/Menu).
  - `kitchen/page.tsx`: The kitchen dashboard page.
- **`components/`**: React components.
  - `Customer/`: Components specific to the customer interface (Menu, Cart, ItemDetail).
  - `Kitchen/`: Components specific to the kitchen interface (Dashboard).
  - `Shared/`: Reusable UI components (Button, Card, Modal).
- **`contexts/`**: Global state management.
  - `AuthContext.tsx`: Manages user authentication (guest/login).
  - `OrderContext.tsx`: Handles cart state, placed orders, and service requests.
  - `ToastContext.tsx`: Manages global notifications.
- **`data/`**: Static data files.
  - `menu.ts`: Defines the menu items and categories.

## 🧪 Testing

Run the test suite to ensure everything is working correctly:

```bash
npm test
```

## 📝 Documentation

The codebase is fully documented using TSDoc/JSDoc. You can hover over functions, classes, and interfaces in your IDE to see detailed descriptions of their purpose, parameters, and return values.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
