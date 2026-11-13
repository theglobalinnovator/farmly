// src/app/layout.tsx
import { Inter, Bricolage_Grotesque } from 'next/font/google';
import './globals.css';
import { AppProvider } from "./context/AppContext";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage', 
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${bricolage.variable}`}>
      <body className="antialiased m-0 p-0">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}