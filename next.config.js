/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/mein-garten-app' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/mein-garten-app' : '',
}

module.exports = nextConfig