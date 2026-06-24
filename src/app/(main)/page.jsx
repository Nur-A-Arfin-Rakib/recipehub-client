'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiHeart, FiClock, FiUsers, FiBookOpen, FiStar, FiShield } from 'react-icons/fi';
import api from '@/utils/axios';
import RecipeCard from '@/components/recipe/RecipeCard';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    api.get('/api/recipes/featured').then(r => setFeatured(r.data));
    api.get('/api/recipes/popular').then(r => setPopular(r.data));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 text-xs font-medium bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full mb-5">🔥 12,000+ recipes & growing</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-5">
              Share your <span className="text-primary">passion</span> for food with the world
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">RecipeHub is the ultimate platform for food lovers to create, discover and share recipes from every corner of the globe.</p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/recipes" className="btn-primary flex items-center gap-2 text-base px-6 py-3">Browse Recipes <FiArrowRight /></Link>
              <Link href="/register" className="btn-outline text-base px-6 py-3">Join for free</Link>
            </div>
            <div className="flex gap-8 mt-10">
              {[['12k+', 'Recipes shared'], ['4.8k', 'Active chefs'], ['100+', 'Cuisines']].map(([num, label]) => (
                <div key={label}>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{num}</div>
                  <div className="text-sm text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="hidden md:block">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80" alt="Cooking" className="rounded-2xl shadow-2xl w-full object-cover h-96" />
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-xl">❤️</div>
                <div><p className="text-xs font-semibold dark:text-white">Recipe liked!</p><p className="text-xs text-gray-500">342 people love this</p></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div><h2 className="section-title">Featured Recipes</h2><p className="text-gray-500 mt-1">Handpicked by our team</p></div>
          <Link href="/recipes" className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">See all <FiArrowRight /></Link>
        </div>
        {featured.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((r, i) => (
              <motion.div key={r._id} initial="hidden" animate="visible" custom={i} variants={fadeUp}>
                <RecipeCard recipe={r} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Popular Recipes */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div><h2 className="section-title">Most Popular</h2><p className="text-gray-500 mt-1">Based on community likes</p></div>
            <Link href="/recipes" className="text-primary text-sm font-medium flex items-center gap-1">See all <FiArrowRight /></Link>
          </div>
          <div className="space-y-3">
            {popular.map((r, i) => (
              <Link key={r._id} href={`/recipes/${r._id}`}>
                <motion.div initial="hidden" animate="visible" custom={i} variants={fadeUp}
                  className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex items-center gap-4 hover:border-orange-200 transition-colors">
                  <span className="text-3xl font-bold text-gray-200 dark:text-gray-700 w-10 text-center">{String(i + 1).padStart(2, '0')}</span>
                  <img src={r.recipeImage} alt={r.recipeName} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{r.recipeName}</h3>
                    <p className="text-sm text-gray-500">by {r.authorName} · {r.cuisineType}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-primary font-semibold text-sm flex-shrink-0"><FiHeart /> {r.likesCount}</div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why RecipeHub */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-title">Why RecipeHub?</h2>
          <p className="text-gray-500 mt-2">Built for food lovers, by food lovers</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <FiUsers className="text-2xl" />, color: 'bg-orange-100 text-orange-600', title: 'Vibrant Community', desc: 'Connect with thousands of passionate home cooks and professional chefs around the world.' },
            { icon: <FiShield className="text-2xl" />, color: 'bg-green-100 text-green-600', title: 'Safe & Moderated', desc: 'Our admin team reviews reports and keeps the platform clean, respectful and high-quality.' },
            { icon: <FiBookOpen className="text-2xl" />, color: 'bg-blue-100 text-blue-600', title: 'Free to Start', desc: "Sign up for free, add up to 2 recipes, and upgrade to premium whenever you're ready." },
          ].map((item, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp} className="card p-6">
              <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>{item.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Premium CTA */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-10 md:p-14 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 text-orange-100 text-sm mb-3"><FiStar /> Premium membership</div>
            <h2 className="text-3xl font-bold text-white mb-3">Cook without limits</h2>
            <p className="text-orange-100 leading-relaxed mb-6">Upload unlimited recipes, earn a premium badge, and get featured on the homepage. All for just $9/month.</p>
            <ul className="space-y-2 mb-8">
              {['Unlimited recipe uploads', 'Premium profile badge', 'Priority in featured section', 'Early access to new features'].map(f => (
                <li key={f} className="flex items-center gap-2 text-white text-sm"><span className="text-orange-200">✓</span> {f}</li>
              ))}
            </ul>
            <Link href="/dashboard/premium" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors">
              Upgrade to Premium <FiArrowRight />
            </Link>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur rounded-2xl p-8 text-center text-white">
              <div className="text-5xl mb-3">👑</div>
              <div className="text-4xl font-bold">$9</div>
              <div className="text-orange-100">per month</div>
              <div className="mt-4 bg-white/20 rounded-full px-4 py-1 text-sm">Premium Member</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
