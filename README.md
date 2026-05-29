# Recurrly 💳

A modern React Native app for managing recurring subscriptions and tracking your spending. Built with Expo, TypeScript, and NativeWind.

## Overview

Recurrly is a subscription management application that helps users track their recurring payments, manage billing cycles, and gain insights into their spending patterns. The app provides an intuitive interface to add, view, and manage all your subscriptions in one place.

## Features

- 🔐 **Authentication**: Secure user authentication with Clerk
- 📊 **Dashboard**: Overview of all subscriptions with total balance and upcoming payments
- ➕ **Add Subscriptions**: Easy-to-use modal to create new subscription entries
- 💰 **Expense Tracking**: Monitor subscription costs and billing cycles
- 📈 **Insights**: View spending trends and subscription analytics
- ⚙️ **Settings**: Manage app preferences and user profile
- 🎨 **Modern UI**: Beautiful, responsive design with NativeWind styling
- 📱 **Cross-platform**: Runs on iOS, Android, and Web

## Tech Stack

- **Framework**: [Expo](https://expo.dev) + [React Native](https://reactnative.dev)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Navigation**: [Expo Router](https://expo.dev/router) with file-based routing
- **Styling**: [NativeWind](https://nativewind.dev) + [TailwindCSS](https://tailwindcss.com)
- **Authentication**: [Clerk](https://clerk.com)
- **State Management**: React Context API
- **UI Components**: React Native built-ins + [Vector Icons](https://docs.expo.dev/guides/icons)
- **Date Handling**: [Day.js](https://day.js.org)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (optional: `npm install -g expo-cli`)

### Installation

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the development server

   ```bash
   npm start
   ```

3. Run on your preferred platform:

   ```bash
   # iOS Simulator
   npm run ios

   # Android Emulator
   npm run android

   # Web
   npm run web

   # Or use Expo Go by scanning the QR code
   npx expo start
   ```

## Project Structure

```
recurrly/
├── app/                      # Expo Router app directory (file-based routing)
│   ├── (auth)/              # Authentication screens (sign-in, sign-up)
│   ├── (tabs)/              # Tab-based main app screens
│   │   ├── index.tsx        # Home/Dashboard
│   │   ├── subscriptions.tsx # Subscriptions list
│   │   ├── insights.tsx     # Analytics and insights
│   │   └── settings.tsx     # User settings
│   └── onboarding.tsx       # Onboarding screen
├── components/              # Reusable React components
│   ├── SubscriptionCard.tsx
│   ├── CreateSubscriptionModal.tsx
│   ├── UpComingSubscription.tsx
│   └── ...
├── constants/               # App constants and configurations
│   ├── data.ts             # Mock data
│   ├── icons.ts            # Icon definitions
│   ├── images.ts           # Image paths
│   └── theme.ts            # Design tokens (colors, spacing)
├── lib/                     # Utility functions and hooks
│   ├── subscriptions.tsx   # Subscription context and hooks
│   ├── auth.ts             # Authentication utilities
│   └── utils.ts            # Helper functions
├── assets/                  # Images, icons, and fonts
│   ├── images/
│   ├── icons/
│   └── fonts/
└── global.css              # Global styles (Tailwind)
```

## Available Scripts

```bash
# Start development server
npm start

# Run on Android emulator
npm run android

# Run on iOS simulator
npm run ios

# Run on Web
npm run web

# Lint the project
npm lint

# Reset project (clear node_modules and reinstall)
npm run reset-project
```

## Key Features Implementation

### Authentication

The app uses Clerk for secure user authentication with support for email/password and social login options.

### Subscription Management

Users can create and manage subscriptions with details including:

- Subscription name and category
- Billing amount and frequency
- Renewal dates
- Payment methods
- Subscription status

### Context-Based State Management

Subscriptions are managed using React Context API for global state management across the app.

### Styling

The project uses NativeWind (Tailwind for React Native) for consistent, utility-first styling. Global styles are defined in `global.css`.

## Development

### Code Quality

- ESLint configured for code consistency
- TypeScript for type safety
- Follows React best practices and patterns

### Environment Setup

Make sure you have a `.env` file with necessary Clerk credentials:

```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
```

## Learn More

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [Expo Router Guide](https://expo.dev/router)
- [NativeWind Documentation](https://nativewind.dev)
- [Clerk Documentation](https://clerk.com/docs)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
