'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiBookOpen, FiHeart, FiShoppingBag, FiStar, FiPlusCircle, FiThumbsUp } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/axios';

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ recipes: 0, favorites: 0, purchased: 0, totalLikes: 0 });

  useEffect(() => {
    Promise.all([api.get('/api/recipes/my'), api.get('/api/recipes/favorites'), api.get('/api/recipes/purchased')])
      .then(([r, f, p]) => {
        const totalLikes = r.data.reduce((sum, recipe) => sum + (recipe.likesCount || 0), 0);
        setStats({ recipes: r.data.length, favorites: f.data.length, purchased: p.data.length, totalLikes });
      });
  }, []);

  const cards = [
    { label: 'My Recipes', value: stats.recipes, icon: <FiBookOpen />, color: 'bg-orange-50 text-orange-600', to: '/dashboard/my-recipes' },
    { label: 'Favorites', value: stats.favorites, icon: <FiHeart />, color: 'bg-red-50 text-red-500', to: '/dashboard/favorites' },
    { label: 'Purchased', value: stats.purchased, icon: <FiShoppingBag />, color: 'bg-blue-50 text-blue-600', to: '/dashboard/purchased' },
    { label: 'Total Likes Received', value: stats.totalLikes, icon: <FiThumbsUp />, color: 'bg-green-50 text-green-600', to: '/dashboard/my-recipes' },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name?.split(' ')[0]}! 👋🍳</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your recipes</p>
        </div>
        {user?.isPremium && <span className="flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold">👑 Premium Member</span>}
      </div>
      {!user?.isPremium && (
        <div className="mb-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-5 flex items-center justify-between">
          <div><p className="text-white font-semibold">Upgrade to Premium</p><p className="text-orange-100 text-sm">Unlock unlimited recipe uploads for just $9/month</p></div>
          <Link href="/dashboard/premium" className="bg-white text-primary font-semibold text-sm px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2"><FiStar /> Upgrade</Link>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map(c => (
          <Link key={c.label} href={c.to} className="card p-5 flex items-center gap-4 hover:border-orange-200">
            <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center text-xl`}>{c.icon}</div>
            <div><p className="text-2xl font-bold text-gray-900 dark:text-white">{c.value}</p><p className="text-sm text-gray-500">{c.label}</p></div>
          </Link>
        ))}
      </div>
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/add-recipe" className="btn-primary flex items-center gap-2"><FiPlusCircle /> Add New Recipe</Link>
          <Link href="/recipes" className="btn-outline">Browse Recipes</Link>
          {!user?.isPremium && <Link href="/dashboard/premium" className="btn-outline flex items-center gap-2"><FiStar /> Go Premium</Link>}
        </div>
      </div>
    </div>
  );
}
