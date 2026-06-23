'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiHeart, FiBookmark, FiFlag, FiClock, FiUser, FiShoppingCart } from 'react-icons/fi';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import api from '@/utils/axios';
import { useAuth } from '@/context/AuthContext';
import CheckoutForm from '@/components/shared/CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function RecipeDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    api.get(`/api/recipes/${id}`).then(r => {
      setRecipe(r.data);
      if (user) setLiked(r.data.likedBy?.includes(user.email));
    }).finally(() => setLoading(false));
  }, [id, user]);

  const handleLike = async () => {
    if (!user) return router.push('/login');
    if (liked) return toast.error('Already liked');
    if (recipe.authorEmail === user.email) return toast.error('Cannot like your own recipe');
    try {
      const res = await api.post(`/api/recipes/${id}/like`);
      setRecipe(prev => ({ ...prev, likesCount: res.data.likesCount }));
      setLiked(true);
      toast.success('Recipe liked!');
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleFavorite = async () => {
    if (!user) return router.push('/login');
    try {
      await api.post(`/api/recipes/${id}/favorite`);
      toast.success('Added to favorites!');
    } catch (err) { toast.error(err.response?.data?.message || 'Already in favorites'); }
  };

  const handleReport = async () => {
    if (!user) return router.push('/login');
    const { value: reason } = await Swal.fire({
      title: 'Report Recipe', input: 'select',
      inputOptions: { Spam: 'Spam', 'Offensive Content': 'Offensive Content', 'Copyright Issue': 'Copyright Issue' },
      inputPlaceholder: 'Select a reason', showCancelButton: true, confirmButtonColor: '#E05C2A',
    });
    if (reason) { await api.post(`/api/recipes/${id}/report`, { reason }); toast.success('Report submitted'); }
  };

  const handlePurchase = async () => {
    if (!user) return router.push('/login');
    try {
      const res = await api.post('/api/payments/create-intent', { amount: 500, type: 'recipe', recipeId: id });
      setClientSecret(res.data.clientSecret);
      setShowCheckout(true);
    } catch (err) { toast.error(err.response?.data?.message || 'Payment setup failed'); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!recipe) return <div className="text-center py-20 text-gray-400">Recipe not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <img src={recipe.recipeImage} alt={recipe.recipeName} className="w-full h-80 object-cover rounded-2xl shadow-lg" />
          <div className="flex gap-3 mt-4">
            <button onClick={handleLike} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-colors ${liked ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'}`}>
              <FiHeart className={liked ? 'fill-red-500' : ''} /> {recipe.likesCount} Likes
            </button>
            <button onClick={handleFavorite} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:border-primary hover:text-primary text-sm font-medium transition-colors">
              <FiBookmark /> Favorite
            </button>
            <button onClick={handleReport} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-500 text-sm font-medium transition-colors">
              <FiFlag />
            </button>
          </div>
        </div>
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="badge bg-orange-50 text-orange-600">{recipe.cuisineType}</span>
            <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-800">{recipe.category}</span>
            <span className={`badge ${recipe.difficultyLevel === 'Easy' ? 'bg-green-100 text-green-700' : recipe.difficultyLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{recipe.difficultyLevel}</span>
            {recipe.isFeatured && <span className="badge bg-amber-100 text-amber-700">⭐ Featured</span>}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{recipe.recipeName}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span className="flex items-center gap-1.5"><FiUser />{recipe.authorName}</span>
            <span className="flex items-center gap-1.5"><FiClock />{recipe.preparationTime} min</span>
          </div>
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients?.map((ing, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />{ing}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Instructions</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{recipe.instructions}</p>
          </div>
          <button onClick={handlePurchase} className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base">
            <FiShoppingCart /> Buy Full Recipe — $5
          </button>
        </div>
      </div>

      {showCheckout && clientSecret && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Complete Purchase</h2>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm amount={500} type="recipe" recipeId={id} onClose={() => setShowCheckout(false)} />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
}