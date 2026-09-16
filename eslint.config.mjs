import next from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier";

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      // Maquette HTML/CSS/JS d'origine conservée à la racine (source de vérité,
      // voir CLAUDE.md) — hors périmètre du lint Next.
      "script.js",
      "files/**",
      // Dossier de backup hors périmètre (imports cassés, non utilisé par l'app)
      "components/charts_backup/**",
    ],
  },
  ...next,
  // Désactive les règles ESLint qui entrent en conflit avec Prettier.
  // Doit rester en dernière position du tableau.
  prettier,
];

export default config;
