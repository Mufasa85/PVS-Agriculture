/** @type {import('next').NextConfig} */
const nextConfig = {
  // Évite que Turbopack remonte au-delà du projet pour deviner la racine
  // (un pnpm-lock.yaml traîne dans le dossier utilisateur parent).
  turbopack: {
    root: __dirname,
  },
  serverExternalPackages: ["geoip-lite", "i18n-iso-countries"],
  // Toutes les images de contenu sont locales (public/images) — pas de
  // remotePatterns : les seules URLs next/image acceptées sont /images/*
  // et /uploads/* (fichiers administrés via l'upload admin).
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
