import { withGlobalCss } from "next-global-css";
import path from 'path';

// Import environment variables if necessary
await import("./src/env.mjs");

const withConfig = withGlobalCss();

/**
 * @type {import('next').NextConfig}
 */
const config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src/styles')],
  },
  experimental: {
    // runtime: 'experimental-edge',
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.fallback = {
      crypto: require.resolve('crypto-browserify'),
    };
    return webpackConfig;
  },
};

export default withConfig(config);
