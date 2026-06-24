import Link from 'next/link';
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-semibold text-lg mb-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">🍳</div>
              RecipeHub
            </div>
            <p className="text-sm leading-relaxed max-w-xs">A home for food lovers to share, discover and celebrate great cooking from every culture around the world.</p>
            <div className="flex gap-3 mt-5">
              {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Icon />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Quick Links</h4>
            <div className="space-y-2 text-sm">
              {[['/', 'Home'], ['/recipes', 'Browse Recipes'], ['/dashboard', 'Dashboard'], ['/dashboard/premium', 'Premium']].map(([href, label]) => (
                <Link key={href} href={href} className="block hover:text-white transition-colors">{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Support</h4>
            <div className="space-y-2 text-sm">
              <a href="mailto:hello@recipehub.com" className="block hover:text-white transition-colors">hello@recipehub.com</a>
              <a href="#" className="block hover:text-white transition-colors">Help Center</a>
              <a href="#" className="block hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="block hover:text-white transition-colors">Terms of Use</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
          <p>© 2026 RecipeHub. All rights reserved. 🍳</p>
          <p>Made with ❤️ for food lovers</p>
        </div>
      </div>
    </footer>
  );
}// footer
