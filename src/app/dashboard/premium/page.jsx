'use client';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { FiStar, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '@/utils/axios';
import { useAuth } from '@/context/AuthContext';
import CheckoutForm from '@/components/shared/CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
const features = ['Unlimited recipe uploads', 'Premium profile badge', 'Priority in featured section', 'Early access to new features', 'Exclusive community access'];

export default function PremiumCheckout() {
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);

  if (user?.isPremium) return (<div className="max-w-lg mx-auto text-center py-16"><div className="text-6xl mb-4">👑</div><h1 className="text-2xl font-bold dark:text-white mb-2">You're already Premium!</h1><p className="text-gray-500">Enjoy unlimited recipe uploads and all premium features.</p></div>);

  const handleStart = async () => {
    setLoading(true);
    try { const res = await api.post('/api/payments/create-intent', { amount: 9, type: 'premium' }); setClientSecret(res.data.clientSecret); }
    catch { toast.error('Failed to initialize payment'); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center"><h1 className="text-2xl font-bold dark:text-white">Upgrade to Premium</h1><p className="text-gray-500 mt-1">Unlock the full RecipeHub experience</p></div>
      <div className="card p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3"><div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center"><FiStar className="text-amber-600 text-xl" /></div><div><h2 className="font-bold dark:text-white">Premium Plan</h2><p className="text-gray-500 text-sm">Everything you need</p></div></div>
          <div className="text-right"><div className="text-3xl font-bold dark:text-white">$9</div><div className="text-gray-500 text-sm">per month</div></div>
        </div>
        <ul className="space-y-3 mb-6">{features.map(f => (<li key={f} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"><div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"><FiCheck className="text-green-600 text-xs" /></div>{f}</li>))}</ul>
        {!clientSecret ? (
          <button onClick={handleStart} disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-60">{loading ? 'Setting up...' : 'Get Premium — $9/mo'}</button>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm amount={9} type="premium" onClose={() => setClientSecret('')} />
          </Elements>
        )}
      </div>
    </div>
  );
}
// premium
