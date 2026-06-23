'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FiHome, FiPlusCircle, FiBookOpen, FiHeart, FiShoppingBag, FiStar, FiUsers, FiAlertCircle, FiDollarSign, FiLogOut, FiChevronRight, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function DashboardLayout({ children, isAdmin }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (!loading && user && isAdmin && user.role !== 'admin') router.push('/');
  }, [user, loading]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    router.push('/');
  };

  const userLinks = [
    { href: '/dashboard', label: 'Overview', icon: <FiHome /> },
    { href: '/dashboard/add-recipe', label: 'Add Recipe', icon: <FiPlusCircle /> },
    { href: '/dashboard/my-recipes', label: 'My Recipes', icon: <FiBookOpen /> },
    { href: '/dashboard/favorites', label: 'Favorites', icon: <FiHeart /> },
    { href: '/dashboard/purchased', label: 'Purchased', icon: <FiShoppingBag /> },
    { href: '/dashboard/premium', label: 'Go Premium', icon: <FiStar /> },
    { href: '/dashboard/profile', label: 'Profile', icon: <FiUser /> },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: <FiHome /> },
    { href: '/admin/users', label: 'Manage Users', icon: <FiUsers /> },
    { href: '/admin/recipes', label: 'Manage Recipes', icon: <FiBookOpen /> },
    { href: '/admin/reports', label: 'Reports', icon: <FiAlertCircle /> },
    { href: '/admin/payments', label: 'Payments', icon: <FiDollarSign /> },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col fixed h-full z-20">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-light flex-shrink-0">
              {user?.image ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" /> : <span className="w-full h-full flex items-center justify-center text-primary font-semibold">{user?.name?.[0]}</span>}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{isAdmin ? 'Admin' : user?.isPremium ? '⭐ Premium' : 'Free'}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map(link => {
            const isActive = link.href === '/dashboard' || link.href === '/admin' ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary-light text-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                <span className="text-base">{link.icon}</span>
                {link.label}
                <FiChevronRight className="ml-auto text-xs opacity-40" />
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
