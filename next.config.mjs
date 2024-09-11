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
  /**
   * @param {import('webpack').Configuration} config
   * @param {{ isServer: boolean }} options
   */
  webpack: (config, { isServer }) => {
    // Ensure resolve is defined
    config.resolve = config.resolve || {};
  
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: 'crypto-browserify', // Use string in ESM
      };
    }
    return config;
  },
}  

export default withConfig(config);
