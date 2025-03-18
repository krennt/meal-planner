import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI-Powered Meal Planner',
  description: 'Plan meals, manage groceries, and track your pantry inventory with AI assistance',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover',
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
          <div className="min-h-screen bg-gray-50 overflow-x-hidden">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}