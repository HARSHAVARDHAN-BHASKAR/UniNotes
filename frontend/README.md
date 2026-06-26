# UniNotes Frontend

A modern, responsive React frontend for the UniNotes application built with TypeScript, Vite, and Tailwind CSS.

## Features

- **Modern UI/UX**: Beautiful glass-morphism design with 3D background effects
- **Authentication**: Complete signup, login, OTP verification, and password reset flow
- **Note Management**: Upload, view, and manage notes with search functionality
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **TypeScript**: Full type safety and better development experience
- **Component Library**: Built with shadcn/ui components for consistency

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **shadcn/ui** for UI components
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## API Integration

The frontend is configured to connect to the backend API running on `http://13.63.165.198:5001`. 

### Available Endpoints

- **Authentication**: `/signup`, `/login`, `/google`
- **OTP**: `/otp/send-otp`, `/otp/verify-otp`, `/otp/send-resetpassword-otp`, `/otp/verify-resetpassword-otp`, `/otp/update-password`
- **Notes**: `/notes/upload`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Background3D.tsx
│   ├── NoteCard.tsx
│   └── UploadModal.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and API config
├── pages/              # Page components
│   ├── Auth.tsx
│   ├── Dashboard.tsx
│   ├── OTPVerification.tsx
│   ├── ResetPassword.tsx
│   └── ...
└── App.tsx             # Main app component
```

## Features Overview

### Authentication Flow
1. **Signup**: User creates account with name, email, and password
2. **OTP Verification**: Email verification with 6-digit OTP
3. **Login**: Secure login with email and password
4. **Password Reset**: OTP-based password reset flow

### Dashboard Features
- **Note Upload**: Upload notes with title, description, and file
- **Search**: Real-time search through notes
- **User Management**: Profile access and logout functionality
- **Responsive Grid**: Adaptive layout for different screen sizes

## Development

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting

### Key Components
- `Auth.tsx`: Handles login/signup with backend integration
- `Dashboard.tsx`: Main notes management interface
- `OTPVerification.tsx`: Email verification flow
- `ResetPassword.tsx`: Password reset with OTP verification

## Environment Configuration

The API base URL is configured in `src/lib/api.ts`. Update this file if your backend runs on a different port or domain.

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new components
3. Test authentication flows thoroughly
4. Ensure responsive design for all screen sizes