'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '@/utils/axios';

export default function MyFavorites() {
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/api/recipes/favorites').then(r => setFavs(r.data)).finally(() => setLoading(false)); }, []);
  const remove = async (recipeId) => { await api.delete(`/api/recipes/${recipeId}/favorite`); setFavs(prev => prev.filter(f => f.recipeId?._id !== recipeId)); toast.success('Removed'); };
  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Favorites</h1><p className="text-gray-500 mt-1">{favs.length} saved recipe{favs.length !== 1 ? 's' : ''}</p></div>
      {favs.length === 0 ? (<div className="card p-16 text-center"><div className="text-5xl mb-4">❤️</div><h3 className="font-semibold dark:text-white mb-2">No favorites yet</h3><Link href="/recipes" className="btn-primary inline-flex mt-4">Browse Recipes</Link></div>) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {favs.map(f => { const r = f.recipeId; if (!r) return null; return (
            <div key={f._id} className="card flex gap-4 p-4">
              <img src={r.recipeImage} alt={r.recipeName} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold dark:text-white truncate">{r.recipeName}</h3>
                <p className="text-xs text-gray-500 mt-1">{r.cuisineType} · {r.preparationTime} min</p>
                <p className="text-xs text-gray-400 mt-1">❤️ {r.likesCount} likes</p>
                <Link href={`/recipes/${r._id}`} className="inline-flex items-center gap-1 mt-2 text-xs text-primary font-medium hover:underline">View Details →</Link>
              </div>
              <button onClick={() => remove(r._id)} className="p-2 h-fit rounded-lg border border-gray-200 dark:border-gray-700 text-red-400 hover:text-red-600 transition-colors"><FiTrash2 /></button>
            </div>
          ); })}
        </div>
      )}
    </div>
  );
}
// fav
