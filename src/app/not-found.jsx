import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
      <div className="text-center max-w-md">
        <svg viewBox="0 0 400 300" className="w-72 mx-auto mb-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="200" cy="260" rx="160" ry="20" fill="#FDE8D8" />
          <rect x="120" y="80" width="160" height="140" rx="16" fill="#FFF3ED" stroke="#E05C2A" strokeWidth="2"/>
          <rect x="140" y="100" width="60" height="8" rx="4" fill="#E05C2A" opacity="0.3"/>
          <rect x="140" y="116" width="120" height="6" rx="3" fill="#E05C2A" opacity="0.2"/>
          <rect x="140" y="130" width="90" height="6" rx="3" fill="#E05C2A" opacity="0.2"/>
          <circle cx="200" cy="175" r="24" fill="#FDE8D8" stroke="#E05C2A" strokeWidth="2"/>
          <text x="192" y="182" fontSize="20" fill="#E05C2A">?</text>
          <text x="60" y="70" fontSize="48" opacity="0.15" fill="#E05C2A" fontWeight="bold">404</text>
        </svg>
        <h1 className="text-5xl font-bold text-gray-200 dark:text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8">Oops! Looks like this recipe doesn't exist or has been removed from our kitchen. 🍽️</p>
        <Link href="/" className="btn-primary px-8 py-3 text-base inline-flex items-center gap-2">🏠 Back to Home</Link>
      </div>
    </div>
  );
}
