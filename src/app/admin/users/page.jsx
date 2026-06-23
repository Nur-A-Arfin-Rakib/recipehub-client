'use client';
import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '@/utils/axios';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/api/admin/users').then(r => setUsers(r.data)).finally(() => setLoading(false)); }, []);
  const toggleBlock = async (id) => { const res = await api.patch(`/api/admin/users/${id}/block`); setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: res.data.isBlocked } : u)); toast.success(res.data.message); };
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold dark:text-white">Manage Users</h1><p className="text-gray-500 mt-1">{users.length} total users</p></div>
      <div className="relative mb-5"><FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="input pl-11" /></div>
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700"><tr>{['User','Email','Role','Status','Action'].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map(u => (<tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className="px-5 py-3"><div className="flex items-center gap-3"><img src={u.image || `https://ui-avatars.com/api/?name=${u.name}`} alt={u.name} className="w-8 h-8 rounded-full object-cover" /><span className="text-sm font-medium dark:text-white">{u.name}</span></div></td>
              <td className="px-5 py-3 text-sm text-gray-500">{u.email}</td>
              <td className="px-5 py-3"><span className={`badge ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span></td>
              <td className="px-5 py-3"><span className={`badge ${u.isBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{u.isBlocked ? 'Blocked' : 'Active'}</span></td>
              <td className="px-5 py-3"><button onClick={() => toggleBlock(u._id)} className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${u.isBlocked ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>{u.isBlocked ? 'Unblock' : 'Block'}</button></td>
            </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
