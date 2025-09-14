/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@a11y-scanner/shared", "@a11y-scanner/ui"],
  images: {
    domains: ["localhost"],
    dangerouslyAllowSVG: true,
  },
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  },
};

module.exports = nextConfig;
