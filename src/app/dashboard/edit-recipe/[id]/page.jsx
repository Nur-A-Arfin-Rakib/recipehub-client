'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/utils/axios';

const CATEGORIES = ['Breakfast','Lunch','Dinner','Dessert','Snacks','Drinks','Vegan'];
const CUISINES = ['Italian','Indian','Chinese','Mexican','Thai','Japanese','Moroccan','American','Bengali','Other'];

export default function EditRecipe() {
  const { id } = useParams();
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get(`/api/recipes/${id}`).then(r => { reset(r.data); setLoading(false); }); }, [id]);
  const onSubmit = async (data) => {
    try { await api.put(`/api/recipes/${id}`, data); toast.success('Recipe updated!'); router.push('/dashboard/my-recipes'); }
    catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
  };
  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  return (
    <div className="max-w-2xl">
      <div className="mb-8"><h1 className="text-2xl font-bold dark:text-white">Edit Recipe</h1></div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="card p-6 space-y-5">
          <div><label className="label">Recipe Name</label><input {...register('recipeName', { required: true })} className="input" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Category</label><select {...register('category')} className="input">{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
            <div><label className="label">Cuisine Type</label><select {...register('cuisineType')} className="input">{CUISINES.map(c => <option key={c}>{c}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Difficulty</label><select {...register('difficultyLevel')} className="input">{['Easy','Medium','Hard'].map(d => <option key={d}>{d}</option>)}</select></div>
            <div><label className="label">Prep Time (min)</label><input {...register('preparationTime')} type="number" className="input" /></div>
          </div>
          <div><label className="label">Instructions</label><textarea {...register('instructions')} rows={5} className="input resize-none" /></div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => router.push('/dashboard/my-recipes')} className="btn-outline flex-1 py-3">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 py-3 disabled:opacity-60">{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
}
