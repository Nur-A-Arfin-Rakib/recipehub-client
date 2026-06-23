'use client';
import { useEffect, useState } from 'react';
import { FiTrash2, FiStar, FiEdit2, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '@/utils/axios';

const CATEGORIES = ['Breakfast','Lunch','Dinner','Dessert','Snacks','Drinks','Vegan'];
const CUISINES = ['Italian','Indian','Chinese','Mexican','Thai','Japanese','Moroccan','American','Bengali','Other'];

export default function ManageRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => { api.get('/api/admin/recipes').then(r => setRecipes(r.data)).finally(() => setLoading(false)); }, []);
  const toggleFeature = async (id) => { const res = await api.patch(`/api/admin/recipes/${id}/feature`); setRecipes(prev => prev.map(r => r._id === id ? { ...r, isFeatured: res.data.isFeatured } : r)); toast.success(res.data.message); };
  const deleteRecipe = async (id) => { await api.delete(`/api/admin/recipes/${id}`); setRecipes(prev => prev.filter(r => r._id !== id)); toast.success('Deleted'); };
  const startEdit = (recipe) => { setEditing(recipe._id); setEditData({ recipeName: recipe.recipeName, category: recipe.category, cuisineType: recipe.cuisineType, difficultyLevel: recipe.difficultyLevel, preparationTime: recipe.preparationTime }); };
  const saveEdit = async (id) => { await api.put(`/api/recipes/${id}`, editData); setRecipes(prev => prev.map(r => r._id === id ? { ...r, ...editData } : r)); setEditing(null); toast.success('Updated'); };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold dark:text-white">Manage Recipes</h1><p className="text-gray-500 mt-1">{recipes.length} active recipes</p></div>
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md">
            <h2 className="font-semibold dark:text-white mb-4">Edit Recipe</h2>
            <div className="space-y-3">
              <input value={editData.recipeName} onChange={e => setEditData(p => ({ ...p, recipeName: e.target.value }))} className="input" />
              <select value={editData.category} onChange={e => setEditData(p => ({ ...p, category: e.target.value }))} className="input">{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
              <select value={editData.cuisineType} onChange={e => setEditData(p => ({ ...p, cuisineType: e.target.value }))} className="input">{CUISINES.map(c => <option key={c}>{c}</option>)}</select>
              <select value={editData.difficultyLevel} onChange={e => setEditData(p => ({ ...p, difficultyLevel: e.target.value }))} className="input">{['Easy','Medium','Hard'].map(d => <option key={d}>{d}</option>)}</select>
              <input value={editData.preparationTime} onChange={e => setEditData(p => ({ ...p, preparationTime: e.target.value }))} type="number" className="input" />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setEditing(null)} className="btn-outline flex-1 flex items-center justify-center gap-2"><FiX /> Cancel</button>
              <button onClick={() => saveEdit(editing)} className="btn-primary flex-1 flex items-center justify-center gap-2"><FiCheck /> Save</button>
            </div>
          </div>
        </div>
      )}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700"><tr>{['Recipe','Author','Category','Likes','Featured','Actions'].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {recipes.map(r => (<tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className="px-5 py-3"><div className="flex items-center gap-3"><img src={r.recipeImage} alt={r.recipeName} className="w-10 h-10 rounded-lg object-cover" /><span className="text-sm font-medium dark:text-white">{r.recipeName}</span></div></td>
              <td className="px-5 py-3 text-sm text-gray-500">{r.authorName}</td>
              <td className="px-5 py-3"><span className="badge bg-orange-50 text-orange-600">{r.category}</span></td>
              <td className="px-5 py-3 text-sm text-gray-500">❤️ {r.likesCount}</td>
              <td className="px-5 py-3"><span className={`badge ${r.isFeatured ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{r.isFeatured ? '⭐ Yes' : 'No'}</span></td>
              <td className="px-5 py-3"><div className="flex gap-2">
                <button onClick={() => startEdit(r)} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"><FiEdit2 /></button>
                <button onClick={() => toggleFeature(r._id)} className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 transition-colors"><FiStar /></button>
                <button onClick={() => deleteRecipe(r._id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"><FiTrash2 /></button>
              </div></td>
            </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
