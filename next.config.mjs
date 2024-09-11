// @ts-expect-error
import { withGlobalCss } from "next-global-css";
import path from 'path';

await import("./src/env.mjs");

const withConfig = withGlobalCss();


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
 

  
  
  
  
};

export default withConfig(config);
