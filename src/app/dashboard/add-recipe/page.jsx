'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FiUpload, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '@/utils/axios';
import { uploadImage } from '@/utils/uploadImage';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Drinks', 'Vegan'];
const CUISINES = ['Italian', 'Indian', 'Chinese', 'Mexican', 'Thai', 'Japanese', 'Moroccan', 'American', 'Bengali', 'Other'];

export default function AddRecipe() {
  const router = useRouter();
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [recipeCount, setRecipeCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    api.get('/api/recipes/my').then(r => {
      setRecipeCount(r.data.length);
      if (!user?.isPremium && r.data.length >= 2) setLimitReached(true);
    });
  }, [user]);

  const handleImg = (e) => {
    const f = e.target.files[0];
    if (f) { setImgFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const addIngredient = () => setIngredients([...ingredients, '']);
  const updateIngredient = (i, val) => { const arr = [...ingredients]; arr[i] = val; setIngredients(arr); };
  const removeIngredient = (i) => setIngredients(ingredients.filter((_, idx) => idx !== i));

  const onSubmit = async (data) => {
    if (!imgFile) return toast.error('Please upload an image');
    try {
      const recipeImage = await uploadImage(imgFile);
      await api.post('/api/recipes', {
        ...data,
        recipeImage,
        preparationTime: Number(data.preparationTime),
        ingredients: ingredients.filter(i => i.trim()),
      });
      toast.success('Recipe added successfully!');
      router.push('/dashboard/my-recipes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add recipe');
    }
  };

  // Limit reached — show upgrade message
  if (limitReached) return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Recipe</h1>
        <p className="text-gray-500 mt-1">Share your culinary creation with the community</p>
      </div>
      <div className="card p-10 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
          <FiLock className="text-3xl text-orange-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recipe Limit Reached</h2>
        <p className="text-gray-500">You have used <span className="font-semibold text-primary">{recipeCount}/2</span> free recipe slots. Upgrade to Premium to add unlimited recipes!</p>
        <button
          onClick={() => router.push('/dashboard/premium')}
          className="btn-primary px-8 py-3 mt-2">
          🌟 Upgrade to Premium
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Recipe</h1>
        <p className="text-gray-500 mt-1">Share your culinary creation with the community</p>
        {!user?.isPremium && (
          <p className="text-sm text-orange-500 mt-2 font-medium">
            Free plan: {recipeCount}/2 recipes used
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 dark:text-white">Basic Info</h2>
          <div>
            <label className="label">Recipe Image</label>
            <label className="block w-full h-40 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-primary transition-colors overflow-hidden">
              {preview
                ? <img src={preview} className="w-full h-full object-cover" alt="preview" />
                : <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2"><FiUpload className="text-2xl" /><span className="text-sm">Click to upload recipe image</span></div>
              }
              <input type="file" accept="image/*" onChange={handleImg} className="hidden" />
            </label>
          </div>
          <div>
            <label className="label">Recipe Name</label>
            <input {...register('recipeName', { required: 'Recipe name required' })} placeholder="e.g. Spaghetti Carbonara" className="input" />
            {errors.recipeName && <p className="text-red-500 text-xs mt-1">{errors.recipeName.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select {...register('category', { required: true })} className="input">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Cuisine Type</label>
              <select {...register('cuisineType', { required: true })} className="input">
                {CUISINES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Difficulty Level</label>
              <select {...register('difficultyLevel')} className="input">
                {['Easy', 'Medium', 'Hard'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Preparation Time (min)</label>
              <input {...register('preparationTime', { required: true, min: 1 })} type="number" placeholder="30" className="input" />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Ingredients</h2>
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2">
              <input value={ing} onChange={e => updateIngredient(i, e.target.value)} placeholder={`Ingredient ${i + 1}`} className="input flex-1" />
              {ingredients.length > 1 && <button type="button" onClick={() => removeIngredient(i)} className="px-3 text-red-400 hover:text-red-600">✕</button>}
            </div>
          ))}
          <button type="button" onClick={addIngredient} className="text-primary text-sm font-medium hover:underline">+ Add ingredient</button>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Instructions</h2>
          <textarea {...register('instructions', { required: 'Instructions required' })} rows={6} placeholder="Describe the cooking steps..." className="input resize-none" />
          {errors.instructions && <p className="text-red-500 text-xs mt-1">{errors.instructions.message}</p>}
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => router.push('/dashboard/my-recipes')} className="btn-outline flex-1 py-3">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 py-3 disabled:opacity-60">
            {isSubmitting ? 'Publishing...' : 'Publish Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
}