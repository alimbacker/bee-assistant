/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // proxy /api/* to the Express server so the frontend needs no API URL config
  async rewrites() {
    return [{ source: '/api/:path*', destination: 'http://localhost:4000/api/:path*' }];
  },
};
module.exports = nextConfig;
