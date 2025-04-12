# AI-Powered Meal Planning & Grocery Management System

A modern web-based application for AI-assisted meal planning, grocery list management, and pantry tracking.

## Features

- **Meal Planning**: Plan meals for the week with AI-assisted recommendations
- **Grocery List Management**: Auto-generate grocery lists from meal plans
- **Pantry Tracking**: Keep track of your pantry inventory and expiration dates
- **Shopping Optimization**: Compare prices and organize grocery lists by store layout
- **AI Integration**: Get personalized meal suggestions and intelligent insights
- **Collaborative Access**: Share meal plans and grocery lists with family members

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore Database)
- **AI Integration**: OpenAI API (planned)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase account (for authentication and database)

### TypeScript Configuration

This project uses TypeScript with strict type checking. The `tsconfig.json` has the following important configurations:

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": false,
    "noImplicitAny": true,
    // other options...
  }
}
```

Important TypeScript guidelines to follow:
- Always add explicit return types to React components: `function MyComponent(): React.ReactNode`
- Add explicit type annotations to callback parameters in array methods: `.map((item: ItemType) => ...)`
- Avoid using `any` types in your code

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd meal-planner
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up Firebase:
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Authentication (Email/Password) and Firestore Database
   - Create a web app in your Firebase project to get configuration values

4. Create a `.env.local` file in the root directory with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing Without Authentication

For development and testing purposes, you can access the application without setting up Firebase:

1. Start the development server with `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000) in your browser
3. Click the "Try Demo" button to access the dashboard in demo mode

This allows you to explore the UI and functionality without requiring authentication.

## Deployment

### Build Process

Before deploying, it's important to test the production build locally to catch any TypeScript errors:

```bash
npm run build
```

Common build issues and solutions:

1. **TypeScript errors**: Ensure all components have proper return types (React.ReactNode) and callback parameters have explicit type annotations
2. **Missing null checks**: Use optional chaining (`?.`) for properties that might be undefined
3. **Build vs Dev differences**: Some errors only appear in production build due to stricter type checking

### Deploy to Firebase Hosting

The project is set up for Firebase Hosting deployment:

1. Ensure you're logged in to Firebase:
   ```bash
   firebase login
   ```

2. Run the deploy script:
   ```bash
   npm run deploy
   ```

This script will build the application and deploy it to Firebase Hosting.

### Deploy to Vercel

The easiest way to deploy your Next.js app is using Vercel:

1. Create an account at [vercel.com](https://vercel.com)
2. Install the Vercel CLI: `npm install -g vercel`
3. Run `vercel` in the project directory and follow the prompts
4. Configure the environment variables in the Vercel dashboard

### Alternative Deployment Options

- **Firebase Hosting**: Use `firebase init` and `firebase deploy` commands
- **Netlify**: Connect your GitHub repository and configure the build settings
- **AWS Amplify**: Connect your repository and configure build settings in the AWS console

## Project Structure

```
meal-planner/
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── dashboard/        # Dashboard pages
│   │   ├── login/            # Authentication pages
│   │   ├── signup/           # User registration
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   ├── components/           # React components
│   │   ├── auth/             # Authentication components
│   │   └── ...               # Other UI components
│   └── lib/                  # Utility functions
│       ├── firebase/         # Firebase integration
│       └── ...               # Other utilities
├── public/                   # Static assets
├── package.json              # Dependencies and scripts
└── ...                       # Configuration files
```

## Development Roadmap

### Phase 1: MVP Development
- User authentication
- Basic meal planning
- Simple grocery list management
- Initial UI implementation

### Phase 2: AI Integration
- AI-powered meal suggestions
- Recipe modification based on available ingredients
- Price comparison features
- Enhanced inventory tracking

### Phase 3: Mobile App
- React Native mobile application
- Barcode scanning for inventory management
- Push notifications for expiration alerts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
