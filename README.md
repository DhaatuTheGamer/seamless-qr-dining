# Seamless QR Dining

Welcome to the **Seamless QR Dining** project! This is a web application designed to make ordering food at restaurants easier and faster.

## What is this?

This app allows customers to order food directly from their table by scanning a QR code. It also provides a screen for the kitchen staff to see orders as they come in.

## Features

### 🍽️ For Customers
- **Digital Menu**: Browse food items with beautiful pictures and descriptions.
- **Easy Ordering**: Add items to your cart and place an order instantly.
- **Categories**: Quickly find Starters, Mains, Desserts, and Drinks.
- **Virtual Waiter**: Request water, the bill, or a waiter with a single click.
- **Dietary Info**: See if items are Vegan, Gluten-Free, or Spicy.

### 👨‍🍳 For Kitchen Staff
- **Kitchen Dashboard**: View all incoming orders in one place.
- **Table Tracking**: Know exactly which table placed the order.

## Tech Stack

We used modern and popular tools to build this app:
- **React**: A library for building user interfaces.
- **Next.js**: The React framework for the web.
- **TypeScript**: A tool that helps catch errors in our code.
- **Tailwind CSS**: A tool for styling the app and making it look good.

## How to Start

Follow these simple steps to run the project on your computer:

1. **Install Tools**: Open your terminal (command prompt) and run this command to download the necessary tools:
   ```bash
   npm install
   ```

2. **Run the App**: Start the application by running:
   ```bash
   npm run dev
   ```

3. **Open in Browser**: You will see a link in the terminal (usually `http://localhost:3000`). Click it to open the app!

## Project Structure

- `src/app`: Main application code (App Router).
  - `page.tsx`: Customer view.
  - `kitchen/page.tsx`: Kitchen view.
- `src/components`: Reusable UI components.
- `src/contexts`: State management (Orders, Auth, Toast).
- `src/data`: Contains the list of menu items.
