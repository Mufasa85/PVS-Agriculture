/** @type {import('next').NextConfig} */
const nextConfig = {
  // Évite que Turbopack remonte au-delà du projet pour deviner la racine
  // (un pnpm-lock.yaml traîne dans le dossier utilisateur parent).
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
