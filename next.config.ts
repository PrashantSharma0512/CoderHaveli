import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-router": path.resolve(__dirname, "src/lib/router-compat"),
      "react-router-dom": path.resolve(__dirname, "src/lib/router-compat"),
      "@chakra-ui/react": path.resolve(__dirname, "src/lib/chakra-compat"),
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      "react-router": "./src/lib/router-compat",
      "react-router-dom": "./src/lib/router-compat",
      "@chakra-ui/react": "./src/lib/chakra-compat",
    },
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
