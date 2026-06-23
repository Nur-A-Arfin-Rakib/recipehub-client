'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiUser, FiLink } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/axios';

export default function Profile() {
  const { user, setUser } = useAuth();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  useEffect(() => { if (user) reset({ name: user.name, image: user.image }); }, [user]);
  const onSubmit = async (data) => {
    try { const res = await api.put('/api/users/profile', data); setUser(prev => ({ ...prev, name: res.data.name, image: res.data.image })); toast.success('Profile updated!'); }
    catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
  };
  return (
    <div className="max-w-lg">
      <div className="mb-8"><h1 className="text-2xl font-bold dark:text-white">My Profile</h1><p className="text-gray-500 mt-1">Update your personal information</p></div>
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
          <img src={user?.image || `https://ui-avatars.com/api/?name=${user?.name}&background=E05C2A&color=fff`} alt={user?.name} className="w-16 h-16 rounded-full object-cover" />
          <div>
            <p className="font-semibold dark:text-white">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            {user?.isPremium && <span className="badge bg-amber-100 text-amber-700 mt-1">👑 Premium Member</span>}
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="label">Full Name</label><div className="relative"><FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input {...register('name', { required: 'Name required' })} className="input pl-11" /></div>{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}</div>
          <div><label className="label">Photo URL</label><div className="relative"><FiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input {...register('image')} className="input pl-11" placeholder="https://example.com/photo.jpg" /></div></div>
          <button type="submit" disabled={isSubmitting} className="btn-primary py-2.5 px-6 disabled:opacity-60">{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
    </div>
  );
}
