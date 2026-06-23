'use client';
import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import api from '@/utils/axios';
import RecipeCard from '@/components/recipe/RecipeCard';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Drinks', 'Vegan'];

export default function BrowseRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 9 });
    if (category !== 'All') params.append('category', category);
    api.get(`/api/recipes?${params}`).then(r => {
      setRecipes(r.data.recipes);
      setTotalPages(r.data.pages);
    }).finally(() => setLoading(false));
  }, [category, page]);

  const filtered = recipes.filter(r => r.recipeName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Browse Recipes</h1>
        <p className="text-gray-500">Discover amazing recipes from our community</p>
      </div>
      <div className="relative mb-5">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search recipes..." className="input pl-11" />
      </div>
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => { setCategory(c); setPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === c ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-orange-50 hover:text-primary'}`}>
            {c}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400"><div className="text-5xl mb-4">🍽️</div><p>No recipes found</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(r => <RecipeCard key={r._id} recipe={r} />)}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 hover:bg-orange-50 hover:text-primary'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
