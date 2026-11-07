# Timber and Tare — Artisanal Coffee E-Commerce Web Platform

A modern artisanal coffee e-commerce web application built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**.

---

## 🌟 Key Features
- **Dynamic Coffee Catalog & Brewing Guides:** Interactive product cards with bean origins, tasting notes, roast levels, and custom cup size/temperature customizers.
- **Subscription Engine & Loyalty Rewards Club:** Seamless multi-tier subscription selection and digital stamp-card reward redemption state machines.
- **Strict 8px Design System:** Engineered with consistent vertical rhythm, semantic typography hierarchies, and accessible WCAG AA color contrasts.
- **Fluid Micro-Interactions:** Tactile spring physics powered by **Framer Motion**, slide-out cart drawer, and interactive checkout modals.
- **Session & Auth Management:** Integrated with **Firebase Authentication** for secure onboarding and order tracking.

---

## 🛠️ Tech Stack
- **Frontend Framework:** React 19, TypeScript, Vite
- **Styling & Design System:** Tailwind CSS v4, Lucide Icons
- **State Management:** Custom React Reducer Store (`useBrewStore`)
- **Animation:** Framer Motion, Canvas Confetti
- **Authentication & Backend:** Firebase Auth

---

## 🚀 Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```

---

## 📁 Project Architecture
```text
src/
├── components/         # Modular UI components (CartDrawer, CoffeeCatalog, BrewGuides, etc.)
├── hooks/              # Centralized useBrewStore state reducer
├── data/               # Coffee item catalogs and reward tier configurations
├── lib/                # Firebase and utility helpers
└── types/              # TypeScript interfaces for brews, orders, and subscriptions
```
