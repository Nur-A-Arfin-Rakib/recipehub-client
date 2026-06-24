'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const { login, googleLogin } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [showPass, setShowPass] = useState(false);

  const onSubmit = async (data) => {
    try {
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      router.push(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
  };

  const handleGoogle = async () => {
    try {
      const user = await googleLogin();
      toast.success(`Welcome, ${user.name.split(' ')[0]}!`);
      router.push(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch { toast.error('Google login failed'); }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 to-red-500 p-12 text-white">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 text-4xl">🍳</div>
        <h2 className="text-3xl font-bold mb-3">Welcome back!</h2>
        <p className="text-orange-100 text-center leading-relaxed">Sign in to access your recipes, favorites, and cooking community.</p>
        <img src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&q=80" alt="Food" className="mt-10 rounded-2xl shadow-2xl w-full max-w-xs object-cover h-52" />
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2 text-primary font-semibold text-lg mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">🍳</div>
              RecipeHub
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sign in to your account</h1>
            <p className="text-gray-500 mt-1">Don't have an account? <Link href="/register" className="text-primary font-medium hover:underline">Sign up</Link></p>
          </div>
          <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-700 rounded-xl py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mb-6">
            <FcGoogle className="text-xl" /> Continue with Google
          </button>
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div>
            <div className="relative flex justify-center text-xs text-gray-400 bg-white dark:bg-gray-950 px-3">or continue with email</div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} type="email" placeholder="you@example.com" className="input pl-11" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input {...register('password', { required: 'Password required' })} type={showPass ? 'text' : 'password'} placeholder="••••••••" className="input pl-11 pr-11" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{showPass ? <FiEyeOff /> : <FiEye />}</button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3 text-base disabled:opacity-60">
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}// login
