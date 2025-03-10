import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Load Inter font
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Form Showcase - Accessible Form Examples with Next.js',
  description: 'A showcase of different form patterns and techniques using Next.js, React, and TypeScript with a focus on accessibility',
  keywords: ['Next.js', 'React', 'TypeScript', 'Forms', 'Accessibility', 'A11y', 'React Hook Form', 'Zod'],
  authors: [{ name: 'Aaron Perez' }],
};

/**
 * Root layout component that wraps all pages
 * Includes the Header and Footer components
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        {/* Skip link for keyboard users */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:p-2 focus:bg-indigo-600 focus:text-white focus:rounded-md"
        >
          Skip to main content
        </a>
        
        <div className="flex flex-col min-h-screen">
          <Header />
          <main id="main-content" className="flex-grow">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}