'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/utils/axios';

export default function PurchasedRecipes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/api/recipes/purchased').then(r => setItems(r.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold dark:text-white">Purchased Recipes</h1><p className="text-gray-500 mt-1">{items.length} recipe{items.length !== 1 ? 's' : ''} purchased</p></div>
      {items.length === 0 ? (<div className="card p-16 text-center"><div className="text-5xl mb-4">🛍️</div><h3 className="font-semibold dark:text-white mb-2">No purchased recipes</h3><Link href="/recipes" className="btn-primary inline-flex mt-4">Browse Recipes</Link></div>) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map(item => { const r = item.recipeId; if (!r) return null; return (
            <div key={item._id} className="card flex gap-4 p-4">
              <img src={r.recipeImage} alt={r.recipeName} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold dark:text-white truncate">{r.recipeName}</h3>
                <p className="text-xs text-gray-500 mt-1">{r.cuisineType} · {r.preparationTime} min</p>
                <p className="text-xs text-green-600 mt-1 font-medium">✓ Purchased · ${item.amount}</p>
                <Link href={`/recipes/${r._id}`} className="inline-flex items-center gap-1 mt-2 text-xs text-primary font-medium hover:underline">View Details →</Link>
              </div>
            </div>
          ); })}
        </div>
      )}
    </div>
  );
}
// purchased
