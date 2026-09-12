/** @type {import('next').NextConfig} */
const nextConfig = {
  // Évite que Turbopack remonte au-delà du projet pour deviner la racine
  // (un pnpm-lock.yaml traîne dans le dossier utilisateur parent).
  turbopack: {
    root: __dirname,
  },
  serverExternalPackages: ["geoip-lite", "i18n-iso-countries"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
