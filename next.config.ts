import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@pmd/ui', '@pmd/core'],
};

export default nextConfig;
