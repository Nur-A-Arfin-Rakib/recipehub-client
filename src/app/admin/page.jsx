'use client';
import { useEffect, useState } from 'react';
import { FiUsers, FiBookOpen, FiStar, FiAlertCircle } from 'react-icons/fi';
import api from '@/utils/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalRecipes: 0, totalPremium: 0, totalReports: 0 });
  useEffect(() => { api.get('/api/admin/stats').then(r => setStats(r.data)); }, []);
  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: <FiUsers />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Recipes', value: stats.totalRecipes, icon: <FiBookOpen />, color: 'bg-orange-50 text-orange-600' },
    { label: 'Premium Members', value: stats.totalPremium, icon: <FiStar />, color: 'bg-amber-50 text-amber-600' },
    { label: 'Total Reports', value: stats.totalReports, icon: <FiAlertCircle />, color: 'bg-red-50 text-red-500' },
  ];
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold dark:text-white">Admin Dashboard</h1><p className="text-gray-500 mt-1">Platform overview</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(c => (<div key={c.label} className="card p-5"><div className={`w-11 h-11 rounded-xl ${c.color} flex items-center justify-center text-lg mb-4`}>{c.icon}</div><div className="text-2xl font-bold dark:text-white">{c.value}</div><div className="text-sm text-gray-500 mt-1">{c.label}</div></div>))}
      </div>
    </div>
  );
}
