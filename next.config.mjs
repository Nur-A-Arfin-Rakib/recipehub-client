/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.ibb.co', 'lh3.googleusercontent.com', 'images.unsplash.com', 'ui-avatars.com'],
  },
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
};

export default nextConfig;
