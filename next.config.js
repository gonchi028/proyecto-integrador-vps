/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Skip static generation errors during build (pages will be dynamic)
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Allow build to continue even if some pages fail to pre-render
  // These pages will be rendered on-demand at runtime
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
