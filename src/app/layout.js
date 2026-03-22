import './globals.css';
import Navbar from '@/components/Navbar/Navbar';
import Providers from '@/app/Providers';
import Footer from '@/components/Footer/Footer';

export const metadata = {
  title: 'LuxeShop — Premium E-Commerce',
  description: 'Discover premium products at unbeatable prices. Shop electronics, fashion, jewelry, and more at LuxeShop.',
  keywords: 'ecommerce, shop, fashion, electronics, jewelry, luxury',
  openGraph: {
    title: 'LuxeShop — Premium E-Commerce',
    description: 'Discover premium products at unbeatable prices.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main style={{ paddingTop: 'var(--nav-height)' }}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
