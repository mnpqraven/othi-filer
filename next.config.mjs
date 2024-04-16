/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  experimental: {
    swcPlugins: [
      ["@swc-jotai/debug-label", {}],
      ["@swc-jotai/react-refresh", {}],
    ],
  },
};

export default nextConfig;
