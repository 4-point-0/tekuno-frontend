/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output:"standalone",
  async redirects() {
    return [
      {
        source: '/ar-filter',
        destination: 'https://www.instagram.com/ar/884655905923421/',
        permanent: false,
        basePath: false
      },
    ]
  },
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig);

