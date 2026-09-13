# Améliorations — Site PVS

Audit du projet après refonte (admin sécurisé, toasts, drag & drop, corbeille, a11y, profil/2FA/OTP, tests, lint). Ne contient que ce qui **reste à faire**. Cocher `[x]` au fur et à mesure.

Légende priorité : 🔴 critique · 🟠 importante · 🟢 confort

---

## 🔒 Sécurité

- [x] 🔴 **Rate limiting sur `/api/contact`** — 5 msg / IP / 10 min + honeypot `website` invisible (bot → faux succès).
- [x] 🔴 **Rate limiting + validation sur `/api/track`** — 120 evt / IP / min, `trackEventSchema` zod (types whitelist), metadata ≤ 2 Ko.
- [x] 🟠 **Anonymisation IP dans `/api/track`** — `anonymizeIp()` : dernier octet IPv4 → 0, IPv6 tronquée. Géoloc sur l'IP réelle avant anonymisation.
- [ ] 🟠 **Secrets `.env` de production** — `AUTH_SECRET`, `ADMIN_PASSWORD` (seed : `changeme123`) à remplacer. Générer un secret fort (`openssl rand -base64 48`), changer le mot de passe admin.
- [x] 🟠 **CSP (Content-Security-Policy)** — nonce par requête dans `middleware.ts` (matcher étendu à tout le site) : `script-src 'nonce-…' 'strict-dynamic'`, `unsafe-eval` en dev uniquement.
- [x] 🟠 **`npm audit`** — `geoip-lite` monté en 2.x (fix `ip-address`), `overrides.deepmerge-ts@8` pour la CVE transitie de `prisma`. **0 vulnérabilité**.
- [ ] 🟢 **Forcer le changement de mot de passe à la 1re connexion** — le compte seed part d'un mot de passe connu.
- [ ] 🟢 **Rate limiting multi-instance** — `lib/rate-limit.ts` est en mémoire ; si plusieurs instances, passer à un store partagé (Redis/Upstash).
- [x] 🟢 **2FA admin** — TOTP via `otplib`, QR code dans `/admin/profile`, exigé au login si activé.

## 🐛 Bugs / Nettoyage

- [x] 🟠 **`components/charts_backup/`** — supprimé (~50 fichiers morts exclus du build). `components/charts_backup` peut aussi être retiré du `exclude` de `tsconfig.json`.
- [x] 🟠 **`app/admin/(dashboard)/chart-playground/`** — page de démo dev supprimée.
- [x] 🟢 **Dump SQL à la racine** — `*.sql` et `files.zip` ajoutés au `.gitignore` (fichiers conservés sur disque pour référence).
- [ ] 🟢 **Fichiers de la maquette d'origine** — `index.html`, `script.js`, `style.css`, `files/` servent de référence. Une fois la migration validée, les archiver hors du repo ou documenter leur rôle.
- [x] 🟢 **`window.location.href` dans `Sidebar.tsx`** — remplacé par `router.push` + `router.refresh`. Lint 100 % propre.
- [x] 🟢 **`confirm()` natifs** — remplacés par `ConfirmDialog` (modale accessible via `useModalA11y`) : produits, catégories, utilisateurs, messages, analytics.

## ⚡ Fonctionnalités

- [ ] 🟠 **Export CSV** — analytics (événements/KPIs), produits, messages. Endpoint `?format=csv` ou bouton dédié.
- [ ] 🟠 **Historique produit** — l'audit log existe : onglet « Historique » dans `ProductModal` listant les `AuditLog` `entityType=Product, entityId=id`.
- [ ] 🟢 **Dupliquer un produit** — bouton dans les actions du tableau (`POST /api/admin/products/[id]/duplicate` : copie avec `slug-copy`, `isPublished=false`).
- [ ] 🟢 **Lien « Voir sur le site »** — depuis une ligne produit/catégorie admin, ouvrir la page publique correspondante dans un nouvel onglet.
- [ ] 🟢 **Purge corbeille** — la restauration existe ; ajouter une suppression définitive (avec confirmation) + purge auto après N jours optionnelle.
- [ ] 🟢 **Recherche globale admin** — recherche produits + messages + utilisateurs dans la topbar.
- [x] 🟢 **Profil utilisateur + changement de mot de passe** — page `/admin/profile` (lien depuis la sidebar), `PUT /api/admin/profile`, `POST /api/admin/profile/password`.
- [x] 🟢 **Mot de passe oublié** — `/admin/forgot-password` : email → code OTP (Resend/SMTP via `lib/mail.ts`) → nouveau mot de passe. Codes à usage unique, 10 min, 5 essais max.
- [ ] 🟢 **Réponse intégrée aux messages** — remplacer le `mailto:` par un envoi direct depuis l'admin (`lib/mail.ts` existe désormais, multi-provider).
- [ ] 🟢 **Notifications temps réel** — le badge non-lus pollue toutes les 60 s ; SSE/polling plus fin optionnel.

## 🚀 Performance

- [ ] 🟠 **Cache du catalogue public** — `agriculture`, `elevage`, `pisciculture`, `porcherie`, `produits-animaux`, `tarifs` sont tous `force-dynamic` → requête BDD à chaque visite. Passer à `export const revalidate = 60` (+ `revalidatePath` dans les mutations admin) ou `unstable_cache`.
- [ ] 🟠 **Images externes Unsplash** — dépendance externe + domaine wildcard `*.unsplash.com`. Migrer les images de contenu vers `public/uploads` ou un CDN propre.
- [ ] 🟢 **Bundle admin** — `framer-motion` + `visx` + `d3` + `topojson` + `i18n-iso-countries` sont lourds : lazy-load (`next/dynamic`) des charts analytics et de la carte du monde.
- [ ] 🟢 **Audit des index DB** — les `@@index` existent sur les bons champs ; re-valider les requêtes analytics lentes avec du volume réel.
- [ ] 🟢 **`loading.tsx` public** — existe à la racine ; vérifier les pages catalogue (skeletons produits).

## 🌍 SEO / Accessibilité (site public)

- [ ] 🟠 **`app/sitemap.ts` + `app/robots.ts`** — absents : sitemap des pages publiques + disallow `/admin`, `/api`.
- [ ] 🟠 **Open Graph / Twitter cards** — seuls `title`/`description` sont définis ; ajouter `openGraph` (image OG), `twitter`, `metadataBase`.
- [ ] 🟢 **JSON-LD** — données structurées `Organization` (layout) et `Product` (fiches catalogue).
- [ ] 🟢 **Audit a11y complet** — contrastes, `aria-label` sur les boutons icône restants, focus-visible cohérent, navigation clavier du carrousel/menu public.

## 📦 Déploiement / Ops

- [ ] 🟠 **`.env.example`** — fichier versionné sans secrets (DATABASE_URL, AUTH_SECRET, ADMIN__, EMAIL_PROVIDER, EMAIL_FROM, EMAIL_API_KEY, SMTP__, CONTACT_*) pour l'onboarding.
- [ ] 🟠 **CI GitHub Actions** — workflow `lint` + `typecheck` + `test` + `build` sur chaque push/PR.
- [ ] 🟠 **`/api/health`** — endpoint healthcheck (DB ping + version) pour le monitoring.
- [ ] 🟢 **Backup BDD** — script `mysqldump` planifié (cron/Tâches planifiées Windows sous Laragon).
- [ ] 🟢 **Environnement de staging** — base + déploiement de test avant prod.

## 🧪 Tests

- [ ] 🟠 **Tests des routes API** — actuellement seuls les utilitaires sont testés (12 tests). Ajouter des tests d'intégration (auth, validation zod, reorder, restore) avec une base de test.
- [ ] 🟢 **Tests E2E** — Playwright : parcours login admin, CRUD produit, formulaire contact public.
- [ ] 🟢 **Couverture** — seuil minimal Vitest (`--coverage`) dans la CI.

---

## Ordre suggéré (prochaines étapes)

1. � `.env.example` + secrets de prod
2. 🟠 Cache catalogue public (`revalidate`)
3. 🟠 `sitemap.ts` + `robots.ts` + OpenGraph
4. 🟠 `/api/health` + CI
5. 🟠 Export CSV + historique produit
