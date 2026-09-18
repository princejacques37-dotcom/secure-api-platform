/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async rewrites() {
    const apiInternalUrl = process.env.API_INTERNAL_URL || 'http://127.0.0.1:8000';
    return [{
      source: '/api/:path*',
      destination: `${apiInternalUrl}/:path*`,
    }];
  },
};

export default nextConfig;
