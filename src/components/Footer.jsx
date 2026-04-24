import { Link } from 'react-router-dom';
import VisitorCounter from './VisitorCounter';

export default function Footer() {
  return (
    <footer className="bg-rich-brown text-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block">
              <span className="font-display text-2xl font-bold text-cream">Khapal </span>
              <span className="font-display text-xl text-gold">Foods</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(253,246,236,0.6)' }}>
              Bringing you the goodness of tradition with love and care.
              Premium homemade products, made from 100% natural ingredients.
            </p>
            <div className="flex gap-4 mt-5">
              <a
                href="https://instagram.com/khapalfoods"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
                style={{ color: 'rgba(253,246,236,0.4)' }}
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://facebook.com/khapalfoods"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
                style={{ color: 'rgba(253,246,236,0.4)' }}
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-bold text-cream mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/#products" className="text-sm hover:text-gold transition-colors" style={{ color: 'rgba(253,246,236,0.6)' }}>
                  Products
                </a>
              </li>
              <li>
                <a href="/#benefits" className="text-sm hover:text-gold transition-colors" style={{ color: 'rgba(253,246,236,0.6)' }}>
                  Benefits
                </a>
              </li>
              <li>
                <a href="/#ingredients" className="text-sm hover:text-gold transition-colors" style={{ color: 'rgba(253,246,236,0.6)' }}>
                  Ingredients
                </a>
              </li>
              <li>
                <a href="/#about" className="text-sm hover:text-gold transition-colors" style={{ color: 'rgba(253,246,236,0.6)' }}>
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-bold text-cream mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <p style={{ color: 'rgba(253,246,236,0.6)' }}>
                <span className="text-gold">@khapalfoods</span> on Instagram & Facebook
              </p>
              <p style={{ color: 'rgba(253,246,236,0.6)' }}>
                Premium Quality • 100% Natural • Homemade
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ borderTop: '1px solid rgba(253,246,236,0.1)', color: 'rgba(253,246,236,0.4)' }}>
          <p>© {new Date().getFullYear()} Khapal Foods. All rights reserved. Made with ❤️</p>
          <VisitorCounter />
        </div>
      </div>
    </footer>
  );
}
