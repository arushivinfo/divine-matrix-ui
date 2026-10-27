import type { NextConfig } from "next";

/** Set by the GitHub Pages workflow to build a static site served from /<repo>/. */
const pagesBasePath = process.env.PAGES_BASE_PATH;

const nextConfig: NextConfig = {
  ...(pagesBasePath === undefined
    ? { cacheComponents: true, partialPrefetching: true }
    : // Static export can't use partial prerendering.
      { output: "export", basePath: pagesBasePath, trailingSlash: true, images: { unoptimized: true } }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
