# TypeRusher 🚀

A modern typing speed test application built with React, Vite, and Firebase. Track your typing speed, improve your WPM (Words Per Minute), and compete with achievements.

## Features

- **Real-time Typing Test**: Measure your typing speed with accurate WPM calculation
- **User Authentication**: Firebase-based authentication system
- **Achievements System**: Unlock achievements as you improve
- **Statistics Tracking**: Monitor your progress over time
- **Responsive Design**: Beautiful UI built with Tailwind CSS and Radix UI components
- **Dark Mode Support**: Toggle between light and dark themes

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, Radix UI components
- **Authentication**: Firebase
- **State Management**: React Hooks, TanStack Query
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Build Tool**: Vite

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd TypeRusher
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Running the App

Start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
TypeRusher/
├── src/
│   ├── api/           # API calls and services
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and contexts
│   ├── App.jsx        # Main app component
│   ├── main.jsx       # Entry point
│   └── index.css      # Global styles
├── public/            # Static assets
└── package.json       # Dependencies and scripts
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
