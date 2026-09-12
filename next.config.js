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
        hostname: "*.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
