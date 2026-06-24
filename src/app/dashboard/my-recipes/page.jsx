'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiEdit2, FiTrash2, FiPlusCircle, FiClock } from 'react-icons/fi';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import api from '@/utils/axios';

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/api/recipes/my').then(r => setRecipes(r.data)).finally(() => setLoading(false)); }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: 'Delete Recipe?', text: 'This cannot be undone.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#E05C2A', confirmButtonText: 'Delete' });
    if (result.isConfirmed) { await api.delete(`/api/recipes/${id}`); setRecipes(prev => prev.filter(r => r._id !== id)); toast.success('Recipe deleted'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Recipes</h1><p className="text-gray-500 mt-1">{recipes.length} recipe{recipes.length !== 1 ? 's' : ''} published</p></div>
        <Link href="/dashboard/add-recipe" className="btn-primary flex items-center gap-2"><FiPlusCircle /> Add Recipe</Link>
      </div>
      {recipes.length === 0 ? (
        <div className="card p-16 text-center"><div className="text-5xl mb-4">🍳</div><h3 className="font-semibold text-gray-900 dark:text-white mb-2">No recipes yet</h3><Link href="/dashboard/add-recipe" className="btn-primary inline-flex items-center gap-2 mt-4"><FiPlusCircle /> Add your first recipe</Link></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recipes.map(r => (
            <div key={r._id} className="card flex gap-4 p-4">
              <img src={r.recipeImage} alt={r.recipeName} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{r.recipeName}</h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-3"><span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">{r.cuisineType}</span><span className="flex items-center gap-1"><FiClock />{r.preparationTime} min</span></p>
                <p className="text-xs text-gray-400 mt-1">❤️ {r.likesCount} likes</p>
              </div>
              <div className="flex flex-col gap-2">
                <Link href={`/dashboard/edit-recipe/${r._id}`} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-primary hover:border-primary transition-colors"><FiEdit2 /></Link>
                <button onClick={() => handleDelete(r._id)} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-red-500 hover:border-red-300 transition-colors"><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// my
