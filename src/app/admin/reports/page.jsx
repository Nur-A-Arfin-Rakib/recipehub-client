'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/utils/axios';

export default function ManageReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/api/admin/reports').then(r => setReports(r.data)).finally(() => setLoading(false)); }, []);
  const handle = async (id, action) => { await api.patch(`/api/admin/reports/${id}`, { action }); setReports(prev => prev.filter(r => r._id !== id)); toast.success(action === 'remove' ? 'Recipe removed' : 'Report dismissed'); };
  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold dark:text-white">Manage Reports</h1><p className="text-gray-500 mt-1">{reports.length} pending report{reports.length !== 1 ? 's' : ''}</p></div>
      {reports.length === 0 ? (<div className="card p-16 text-center"><div className="text-5xl mb-4">✅</div><h3 className="font-semibold dark:text-white">No pending reports</h3></div>) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700"><tr>{['Recipe','Reported By','Reason','Actions'].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {reports.map(r => (<tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-5 py-3 text-sm font-medium dark:text-white">{r.recipeId?.recipeName || 'Deleted'}</td>
                <td className="px-5 py-3 text-sm text-gray-500">{r.reporterEmail}</td>
                <td className="px-5 py-3"><span className="badge bg-red-100 text-red-600">{r.reason}</span></td>
                <td className="px-5 py-3"><div className="flex gap-2">
                  <button onClick={() => handle(r._id, 'remove')} className="text-xs font-medium px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">Remove Recipe</button>
                  <button onClick={() => handle(r._id, 'dismiss')} className="text-xs font-medium px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">Dismiss</button>
                </div></td>
              </tr>))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
