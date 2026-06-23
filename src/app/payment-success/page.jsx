'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';

function PaymentSuccessContent() {
  const params = useSearchParams();
  const txn = params.get('txn');
  const type = params.get('type');
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <FiCheckCircle className="text-green-500 text-3xl" />
        </div>
        <h1 className="text-2xl font-bold dark:text-white mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-6">{type === 'premium' ? 'You are now a Premium member!' : 'Your recipe purchase is complete!'}</p>
        {txn && <p className="text-xs text-gray-400 font-mono bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-6">TXN: {txn}</p>}
        <div className="flex gap-3">
          <Link href="/dashboard" className="btn-primary flex-1 py-2.5">Dashboard</Link>
          <Link href="/recipes" className="btn-outline flex-1 py-2.5">Browse Recipes</Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}