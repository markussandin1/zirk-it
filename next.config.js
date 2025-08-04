/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export for Vercel deployment
  // output: 'export',
  // trailingSlash: true,
  images: {
    // unoptimized: true // Enable image optimization on Vercel
  }
}

module.exports = nextConfig