# Demo Mode

This document explains how to use the demo mode in the AI-Powered Meal Planning system.

## Overview

Demo mode allows you to explore and test the application without requiring authentication or a Firebase setup. This is useful for:

- Quick testing of the UI
- Demonstrating the application to stakeholders
- Development and debugging without authentication concerns

## How to Access Demo Mode

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Click the "Try Demo" button on the homepage to access the dashboard

## Features Available in Demo Mode

In demo mode, you can:

- View and navigate the dashboard
- Explore the meal planning interface
- See sample grocery lists and pantry items
- Test the UI functionality

## Limitations of Demo Mode

When using the application in demo mode:

- Data is not saved between sessions
- Changes are not persisted to a database
- User-specific features are simulated
- AI recommendations are using sample data, not personalized

## Switching to Full Mode

To switch from demo mode to full functionality:

1. Set up Firebase authentication and database (see README.md)
2. Create a `.env.local` file with your Firebase configuration
3. Restart the application
4. Use the login/signup pages to create an account

## Troubleshooting

If you encounter issues with demo mode:

- Make sure your development server is running
- Check the browser console for any JavaScript errors
- Ensure you're using the latest version of the application
- Try clearing your browser cache if you see outdated content
