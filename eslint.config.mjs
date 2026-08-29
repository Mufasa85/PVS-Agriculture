import next from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      // Maquette HTML/CSS/JS d'origine conservée à la racine (source de vérité,
      // voir CLAUDE.md) — hors périmètre du lint Next.
      "script.js",
      "files/**",
    ],
  },
  ...next,
];

export default config;
