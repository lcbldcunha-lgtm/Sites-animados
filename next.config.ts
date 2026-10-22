import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const isStaticExport = isGitHubPages || process.env.CLOUDFLARE_PAGES === 'true';

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: 'export' as const, trailingSlash: true, images: { unoptimized: true } } : {}),
  ...(isGitHubPages
    ? { output: 'export' as const, basePath: '/Sites-animados', trailingSlash: true }
    : {}),
};

export default nextConfig;
