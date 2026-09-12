# Améliorations — Site PVS

Feuille de route des améliorations identifiées sur le projet. Cocher `[x]` au fur et à mesure.

Légende priorité : 🔴 critique · 🟠 importante · 🟢 confort

---

## 🐛 Bugs à corriger

- [x] 🔴 Lien mort `/admin/products/new` — résolu : les liens pointent vers `/admin/products?new=1` qui ouvre la modale de création automatiquement.
- [x] 🔴 Pas de `try/catch` autour des appels Prisma dans les routes API → ajout du wrapper `withApiError` (`lib/api.ts`) sur toutes les routes admin + login/logout/upload. Les erreurs masquées en faux 404 remontent désormais en 500 propre (P2025 → 404, P2002 → 409).
- [x] 🟠 Fichiers orphelins : `lib/uploads.ts` (`deleteLocalUploads`) supprime les fichiers `/uploads/` lors du DELETE produit et du PUT (images remplacées/retirées).
- [x] 🟠 `middleware.ts` : vérifié — le cookie est déjà `httpOnly` + `sameSite: "lax"` + `secure` en prod.

## 🔒 Sécurité

- [x] 🔴 Rate limiting sur `/api/admin/login` — `lib/rate-limit.ts` (fenêtre fixe en mémoire) : 5 tentatives / IP / 5 min → 429 + `Retry-After`.
- [x] 🔴 Session JWT de 8h non révocable → `getFreshAdminSession()` (`lib/auth.ts`) re-vérifie `isActive`/`role` en base sur toutes les routes `/api/admin/users` (401/403).
- [x] 🟠 Upload : `detectImageMime()` (`lib/uploads.ts`) valide les magic bytes (JPEG/PNG/GIF/WebP/AVIF) et l'extension vient du type réel, pas du nom client.
- [x] 🟠 Politique de mot de passe : minimum 12 caractères (API users POST/PUT + `minLength` dans `UserForm`). Reste optionnel : forcer le changement à la 1re connexion + changer `ADMIN_PASSWORD` du `.env`.
- [x] 🟢 Headers de sécurité dans `next.config.js` : `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. (CSP stricte à étudier séparément — nécessite des nonces pour Next.)
- [x] 🟢 Historique des connexions : `lastLoginAt` déjà affiché dans `UsersTable` ; les IP sont dans le journal d'audit.

## 🧹 Qualité du code

- [x] 🟠 `getSessionFromRequest` dupliqué dans `products/route.ts`, `upload/route.ts`, etc. → factorisé dans `lib/auth.ts`, utilisé par toutes les routes.
- [x] 🟠 Validation manuelle (`validateInput`) → **zod** : `lib/validation.ts` (schémas produit, catégorie, utilisateurs, message, contact) utilisé par toutes les routes API.
- [x] 🟢 Pagination : audit-logs déjà paginé ; messages → `page`/`perPage`/`take`/`skip` + navigation Précédent/Suivant. Reste : produits API si le catalogue grossit.
- [x] 🟢 `components/charts_backup/` exclu du `tsconfig` (erreur `shimmering-text` résolue — supprimer le dossier si plus utile).
- [x] 🟢 Tests : Vitest + `tests/lib.test.ts` — 12 tests (slugify, formatProductPrice, rateLimit, detectImageMime, schémas zod). Script `npm test`. ⚠️ a déjà trouvé un bug : `slugify("Œufs")` → `"ufs"` (ligature œ non décomposée) — corrigé.
- [x] 🟢 `package.json#prisma` supprimé → `prisma.config.ts` (avec `dotenv/config` pour charger `.env`).

## 🎨 UX / Interface admin

- [x] 🟠 Toasts de confirmation → `sonner` (`<Toaster richColors>` dans le layout admin) : succès sur produit/utilisateur/catégorie, `toast.error` remplace les `alert()` des suppressions.
- [x] 🟠 Badge « non lus » sur l'item **Messages** de la sidebar — compteur ambré rafraîchi à la navigation + toutes les 60 s.
- [x] 🟢 Drag & drop : `@dnd-kit` sur `CategoriesTable` (lignes réordonnables) et `ProductsTable` (poignée ⋮⋮ active quand un onglet catégorie est sélectionné, sans recherche). Endpoints `PATCH /api/admin/{categories,products}/reorder` (transaction `sortOrder` + audit).
- [x] 🟢 Corbeille : onglet « Corbeille » sur `/admin/products` (`TrashPanel`), `GET /api/admin/products?trash=1`, `POST /api/admin/products/[id]/restore` (audit `PRODUCT_RESTORE`).
- [x] 🟢 Réponse aux messages : bouton « Répondre » `mailto:` pré-rempli (sujet `Re : …` + corps citant le message) dans le détail.
- [x] 🟢 Skeletons : `app/admin/(dashboard)/loading.tsx` (squelette animé sur les navigations admin) + spinners existants dans messages/modals.
- [x] 🟢 Raccourcis clavier : `Esc` fermeture des modals (déjà présent), `/` focus recherche (produits + messages), `N` nouveau produit.
- [x] 🟢 Modales accessibles : `role="dialog"` + `aria-modal` + `aria-labelledby` + focus trap (`lib/use-modal-a11y.ts`) sur les 3 modales.

## ⚡ Fonctionnalités

- [ ] 🟠 Export CSV : analytics, produits, messages.
- [ ] 🟠 Historique par produit : l'audit log existe → onglet « Historique » dans `ProductModal`/fiche produit.
- [ ] 🟢 Duplication de produit : bouton « Dupliquer » dans les actions du tableau.
- [ ] 🟢 Aperçu public du produit : lien « Voir sur le site » depuis l'admin.
- [ ] 🟢 Notifications : badge temps réel ou polling léger pour nouveaux messages contact.
- [ ] 🟢 Recherche globale admin (produits + messages + utilisateurs).
- [ ] 🟢 Statistiques rapides dans les mails de contact (ex : nb de messages/semaine).

## 🚀 Performance

- [ ] 🟠 Cache produits publics : `unstable_cache`/`revalidate` sur les requêtes catalogue au lieu de `force-dynamic` partout.
- [ ] 🟠 Images : beaucoup d'images Unsplash externes → migrer vers `public/uploads` ou CDN propre + `next/image` partout, formats AVIF/WebP.
- [ ] 🟢 Bundle : analyser avec `@next/bundle-analyzer` — `framer-motion` + `visx` + `d3` sont lourds ; lazy-load des charts admin.
- [ ] 🟢 Fonts : vérifier `next/font` (display: swap, preload).
- [ ] 🟢 `loading.tsx` par route admin pour éviter les écrans blancs.
- [ ] 🟢 Index DB : vérifier les requêtes analytics lentes (`@@index` déjà présents sur les bons champs — à re-valider avec du volume).

## 🌍 SEO / Accessibilité (site public)

- [ ] 🟠 `sitemap.xml` + `robots.txt` (`app/sitemap.ts`, `app/robots.ts`).
- [ ] 🟠 Open Graph / Twitter cards : `openGraph` dans les metadata + image OG par page.
- [ ] 🟢 Données structurées JSON-LD (Organization, Product) sur les fiches.
- [ ] 🟢 Audit a11y : contrastes, `aria-label` sur boutons icône, navigation clavier des modals.
- [ ] 🟢 `alt` des images Unsplash déjà présents — vérifier les images uploadées via l'admin.

## 📦 Déploiement / Ops

- [ ] 🟠 `.env.example` à versionner (sans secrets) pour faciliter l'onboarding.
- [ ] 🟠 CI GitHub Actions : `lint` + `typecheck` + `build` sur chaque push.
- [ ] 🟢 Healthcheck `/api/health` (DB + version) pour le monitoring.
- [ ] 🟢 Backup BDD : script `mysqldump` planifié (cron Laragon).
- [ ] 🟢 `npm audit` : 5 vulnérabilités signalées → `npm audit fix` et revue des paquets.

---

## Ordre suggéré (quick wins d'abord)

1. ~~🔴 Lien mort `/admin/products/new`~~ ✅
2. 🔴 Rate limiting login
3. ~~🟠 Factoriser `getSessionFromRequest`~~ ✅
4. 🟠 Toasts (`sonner`)
5. ~~🟠 try/catch API~~ ✅ + `.env.example`
6. 🟠 Badge messages non lus + cache catalogue
