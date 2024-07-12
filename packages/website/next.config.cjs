/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/js/script.outbound-links.js',
        destination: 'https://plausible.io/js/script.outbound-links.js',
      },
      {
        source: '/api/event',
        destination: 'https://plausible.io/api/event',
      },
    ];
  },
};

module.exports = nextConfig;
