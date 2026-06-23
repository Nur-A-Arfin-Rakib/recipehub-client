import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import api from '@/utils/axios';
import { useRouter } from 'next/navigation';

export default function CheckoutForm({ amount, type, recipeId, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });
      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        await api.post('/api/payments/confirm', {
          transactionId: paymentIntent.id,
          amount: amount / 100,  // cents → dollars
          type,
          recipeId,
        });
        toast.success('Payment successful!');
        onClose();
        router.push('/payment-success');
      }
    } catch (err) {
      toast.error('Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement className="mb-4" />
      <div className="flex gap-3 mt-4">
        <button type="button" onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium">
          Cancel
        </button>
        <button type="submit" disabled={!stripe || processing}
          className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium disabled:opacity-60">
          {processing ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
        </button>
      </div>
    </form>
  );
}