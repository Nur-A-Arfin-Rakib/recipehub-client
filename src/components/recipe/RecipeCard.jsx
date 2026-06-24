import Link from 'next/link';
import { FiHeart, FiClock, FiUser } from 'react-icons/fi';

const diffColors = { Easy: 'bg-green-100 text-green-700', Medium: 'bg-yellow-100 text-yellow-700', Hard: 'bg-red-100 text-red-700' };

export default function RecipeCard({ recipe }) {
  return (
    <Link href={`/recipes/${recipe._id}`} className="card group flex flex-col">
      <div className="relative overflow-hidden rounded-t-xl">
        <img src={recipe.recipeImage} alt={recipe.recipeName} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
        <span className={`absolute top-3 right-3 badge ${diffColors[recipe.difficultyLevel] || 'bg-gray-100 text-gray-600'}`}>{recipe.difficultyLevel}</span>
        {recipe.isFeatured && <span className="absolute top-3 left-3 badge bg-amber-100 text-amber-700">⭐ Featured</span>}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{recipe.recipeName}</h3>
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="badge bg-orange-50 text-orange-600">{recipe.cuisineType}</span>
          <span className="flex items-center gap-1"><FiClock /> {recipe.preparationTime} min</span>
        </div>
        <div className="mt-auto">
          <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-3 mb-3">
            <span className="flex items-center gap-1.5"><FiUser className="text-gray-400" />{recipe.authorName}</span>
            <span className="flex items-center gap-1 text-primary font-medium"><FiHeart /> {recipe.likesCount}</span>
          </div>
          <div className="w-full text-center bg-primary-light text-primary text-xs font-medium py-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
            View Details →
          </div>
        </div>
      </div>
    </Link>
  );
}
// card
