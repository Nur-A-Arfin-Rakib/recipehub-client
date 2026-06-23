'use client';
import { useEffect, useState } from 'react';
import api from '@/utils/axios';

export default function ManagePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/api/admin/payments').then(r => setPayments(r.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold dark:text-white">Payment History</h1><p className="text-gray-500 mt-1">{payments.length} total transactions</p></div>
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700"><tr>{['User','Type','Amount','Transaction ID','Payment Status','Date'].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {payments.map(p => (<tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">{p.userEmail}</td>
              <td className="px-5 py-3"><span className={`badge ${p.type === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{p.type}</span></td>
              <td className="px-5 py-3 text-sm font-semibold dark:text-white">${p.amount}</td>
              <td className="px-5 py-3 text-xs text-gray-400 font-mono truncate max-w-[140px]">{p.transactionId}</td>
              <td className="px-5 py-3"><span className={`badge ${p.paymentStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.paymentStatus}</span></td>
              <td className="px-5 py-3 text-sm text-gray-500">{new Date(p.paidAt).toLocaleDateString()}</td>
            </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
