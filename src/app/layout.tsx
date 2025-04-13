import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';

// Import the Firestore test utility
import '@/lib/firebase/testFirestore';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI-Powered Meal Planner',
  description: 'Plan meals, manage groceries, and track your pantry inventory with AI assistance'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <DataProvider>
            <div className="min-h-screen bg-gray-50 overflow-x-hidden">
              {children}
            </div>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}