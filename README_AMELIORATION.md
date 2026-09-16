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

- [x] 🟠 **Export CSV** — `GET /api/admin/export?type=products|messages|analytics` (séparateur `;` + BOM UTF-8, compatible Excel FR). Boutons dans les en-têtes produits/messages/analytics.
- [x] 🟠 **Historique produit** — onglet « Historique » dans `ProductModal` (édition) listant les `AuditLog` via `GET /api/admin/products/[id]/history`.
- [x] 🟢 **Dupliquer un produit** — `POST /api/admin/products/[id]/duplicate` (`slug-copie`, `isPublished=false`, images copiées) + bouton tableau.
- [x] 🟢 **Lien « Voir sur le site »** — icône ↗ sur les lignes produits et catégories, ouvre `/{category-slug}` dans un nouvel onglet.
- [x] 🟢 **Purge corbeille** — `DELETE /api/admin/products/[id]?permanent=1` (exige le passage par la corbeille) + bouton « Supprimer définitivement » avec `ConfirmDialog` dans `TrashPanel`. Purge auto après N jours : non implémentée (optionnel).
- [x] 🟢 **Recherche globale admin** — `GlobalSearch` dans la topbar (debounce 250 ms) → `GET /api/admin/search?q=` : produits + messages + utilisateurs (réservés SUPER_ADMIN).
- [x] 🟢 **Profil utilisateur + changement de mot de passe** — page `/admin/profile` (lien depuis la sidebar), `PUT /api/admin/profile`, `POST /api/admin/profile/password`.
- [x] 🟢 **Mot de passe oublié** — `/admin/forgot-password` : email → code OTP (Resend/SMTP via `lib/mail.ts`) → nouveau mot de passe. Codes à usage unique, 10 min, 5 essais max.
- [x] 🟢 **Réponse intégrée aux messages** — compositeur dans le panneau détail → `POST /api/admin/messages/[id]/reply` (envoi via `lib/mail.ts`, audit `MESSAGE_REPLY`, message marqué lu).
- [ ] 🟢 **Notifications temps réel** — le badge non-lus pollue toutes les 60 s ; SSE/polling plus fin optionnel.

## 🚀 Performance

- [x] 🟠 **Cache du catalogue public** — `export const revalidate = 60` sur les 5 pages catalogue (`agriculture`, `pisciculture`, `porcherie`, `produits-animaux`, `tarifs`) + `revalidatePath` via `lib/revalidate-catalog.ts` sur toutes les mutations produits/catégories (create, update, delete, restore, duplicate, reorder).
- [x] 🟠 **Images externes Unsplash** — migrées vers `public/images/` par `scripts/migrate-unsplash.mjs` (31 photos + `og-cover.jpg`, réécriture `lib/content.ts`/`prisma/seed.ts`/pages admin + BDD). 11 photos supprimées d'Unsplash (404) remplacées par des substituts locaux thématiquement proches. `remotePatterns` retiré de `next.config.js`.
- [x] 🟢 **Bundle admin** — charts visx/d3 et carte topojson/i18n-iso-countries extraits dans `components/admin/analytics/` (`DevicesChart`, `SourcesChart`, `VisitorsMap`) et chargés via `next/dynamic` avec skeletons.
- [x] 🟢 **Audit des index DB** — index composites ajoutés sur `products` (`category,isPublished,deletedAt,sortOrder` et `isPublished,deletedAt,category,sortOrder`) → migration `catalog_composite_indexes` appliquée.
- [x] 🟢 **`loading.tsx` public** — `components/ui/CatalogSkeleton.tsx` + `loading.tsx` dédiés sur les 8 routes publiques (hero + grille produits, `role="status"`).

## 🌍 SEO / Accessibilité (site public)

- [x] 🟠 **`app/sitemap.ts` + `app/robots.ts`** — sitemap des 9 routes publiques (URLs issues de `siteUrl`) ; robots disallow `/admin` + `/api` avec lien sitemap.
- [x] 🟠 **Open Graph / Twitter cards** — `lib/seo.ts` (`pageMetadata`) : `metadataBase`, canonical, OG (title/description/url/siteName/locale fr_FR/image 1200×630) et `summary_large_image` sur toutes les pages publiques ; `robots: noindex` sur l'admin.
- [x] 🟢 **JSON-LD** — `NGO` (adresse Kinshasa, téléphone) dans le layout racine + `ItemList` de `Product`/`Offer` (prix FC → CDF) sur les pages catalogue via `components/seo/JsonLd.tsx`.
- [x] 🟢 **Audit a11y complet** — Navbar : Échap ferme dropdown/menu, `aria-haspopup`/`aria-controls`, focus restauré, `role="dialog" aria-modal` sur le menu mobile. ElevageGallery : pause auto au survol/focus, flèches ←/→, `aria-roledescription="carrousel"`, `aria-current` sur les pastilles. TarifsFilter : `aria-pressed` + `role="group"` + compteur `aria-live`. ContactForm : `role="status"` + `aria-busy`. Pastilles décoratives `aria-hidden`.

## 📦 Déploiement / Ops

- [x] 🟠 **`.env.example`** — créé avec `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_*`, `NEXT_PUBLIC_SITE_URL`, `EMAIL_*`, `SMTP_*`, `CONTACT_*`.
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

1. � `AUTH_SECRET`/`ADMIN_PASSWORD` de prod + `NEXT_PUBLIC_SITE_URL` (le `.env.example` est en place)
2. ~~🟠 Cache catalogue public (`revalidate`)~~ → fait (ISR 60 s + `revalidatePath`)
3. ~~🟠 `sitemap.ts` + `robots.ts` + OpenGraph~~ → fait (+ JSON-LD, a11y, images locales, lazy-load admin, index DB, loading.tsx)
4. 🟠 `/api/health` + CI
5. ~~🟠 Export CSV + historique produit~~ → déjà fait
6. 🟠 Tests API/E2E
