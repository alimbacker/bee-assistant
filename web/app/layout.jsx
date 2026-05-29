import '@/styles/globals.css';
import { UIProvider } from '@/components/UIProvider';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';

export const metadata = {
  title: 'Bee Assistant — AllBee Solutions',
  description: 'All Problems, Bee Solutions. Multilingual AI voice, chat & business assistant.',
  themeColor: '#ffffff',
};

export const viewport = { width: 'device-width', initialScale: 1, maximumScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UIProvider>
          <div id="app">
            <TopBar />
            {children}
          </div>
          <BottomNav />
        </UIProvider>
      </body>
    </html>
  );
}
