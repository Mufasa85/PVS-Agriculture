/** @type {import('next').NextConfig} */
const nextConfig = {
  // On force Webpack (au lieu de Turbopack) car les serveurs Hostinger
  // tournent sur une vieille glibc (< 2.29) qui ne supporte pas les
  // binaires natifs @next/swc-linux-x64-gnu. Turbopack n'accepte pas
  // les bindings WASM-only, donc on retombe sur Webpack qui les accepte.
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
