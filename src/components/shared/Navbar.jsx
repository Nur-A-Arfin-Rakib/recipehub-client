'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/recipes', label: 'Browse Recipes' },
  ];

  const isActive = (href) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-lg text-gray-900 dark:text-white">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            🍳
          </div>
          RecipeHub
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(l.href) ? 'text-primary bg-primary-light' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
              {l.label}
            </Link>
          ))}
          {user && (
            <>
              <Link href={user.role === 'admin' ? '/admin' : '/dashboard'}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith('/dashboard') || pathname.startsWith('/admin') ? 'text-primary bg-primary-light' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                Dashboard
              </Link>
              <Link href="/dashboard/profile"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/dashboard/profile' ? 'text-primary bg-primary-light' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                Profile
              </Link>
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <button onClick={() => setDark(!dark)} className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            {dark ? <FiSun /> : <FiMoon />}
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <img src={user.image || `https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                <span className="text-sm font-medium dark:text-white">{user.name.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="btn-outline text-sm py-2 px-4">Logout</button>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-outline text-sm py-2 px-4">Log in</Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-4">Get started</Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 space-y-1">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${isActive(l.href) ? 'text-primary bg-primary-light' : 'text-gray-600 dark:text-gray-400'}`}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-500">Logout</button>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link href="/login" onClick={() => setOpen(false)} className="btn-outline text-sm py-2 flex-1 text-center">Log in</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="btn-primary text-sm py-2 flex-1 text-center">Sign up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}