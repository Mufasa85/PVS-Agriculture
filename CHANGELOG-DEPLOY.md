# Changelog & Guide de déploiement Hostinger

> Récapitulatif de toutes les modifications apportées au projet PVS ONGD ASBL
> pour réussir le déploiement sur **Hostinger** (et hébergeurs mutualisés similaires),
> avec une configuration OpenGraph, Twitter Cards, JSON-LD et SEO complète.

**Date de la session :** 20 septembre 2026
**Développeur :** ArcaneCore (César Paysayo) · Assistant IA
**Cible :** `azure-sandpiper-407473.hostingersite.com`

---

## 📑 Table des matières

1. [Contexte](#1-contexte)
2. [Récapitulatif des problèmes résolus](#2-récapitulatif-des-problèmes-résolus)
3. [Configuration de Hostinger](#3-configuration-de-hostinger)
4. [Variables d'environnement](#4-variables-denvironnement)
5. [Modifications du code](#5-modifications-du-code)
6. [Configuration OpenGraph & SEO](#6-configuration-opengraph--seo)
7. [Commandes à exécuter](#7-commandes-à-exécuter)
8. [Tests & validation](#8-tests--validation)
9. [Rollback en cas de problème](#9-rollback-en-cas-de-problème)
10. [Pistes d'amélioration futures](#10-pistes-damélioration-futures)

---

## 1. Contexte

Le projet **PVS ONGD ASBL** (Next.js 16.3.4 + React 19) devait être déployé sur
l'hébergement mutualisé Hostinger (`azure-sandpiper-407473.hostingersite.com`).
Plusieurs incompatibilités ont été détectées et corrigées :

| #   | Problème                                        | Origine                                                                                   |
| --- | ----------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | `GLIBC_2.29 not found` au build                 | Binaire natif `@next/swc-linux-x64-gnu` non compatible avec la vieille glibc de Hostinger |
| 2   | `Turbopack is not supported`                    | Next.js 16 utilise Turbopack par défaut, qui refuse les bindings WASM                     |
| 3   | `middleware-to-proxy` warning                   | Next.js 16 a renommé la convention `middleware.ts` → `proxy.ts`                           |
| 4   | `export const runtime` interdit dans `proxy.ts` | Route segment config non autorisée dans un fichier proxy                                  |
| 5   | `Authentication failed against database server` | Credentials DB invalides / non configurés au moment du build                              |
| 6   | `Export encountered an error on /agriculture`   | Prisma appelé pendant le prérendu statique (ISR) → DB inaccessible                        |
| 7   | URL DB en clair dans une seule variable         | Pas idéal pour la sécurité et la configuration hébergeur                                  |
| 8   | OpenGraph / Twitter / Logo incomplets           | Image OG sans `alt`/`type`, pas de `og:logo`, JSON-LD sans `logo`/`sameAs`/`contactPoint` |

---

## 2. Récapitulatif des problèmes résolus

### A. Compatibilité Next.js 16 + Hostinger

✅ **Turbopack → Webpack** : `package.json` utilise `next build --webpack` et `next dev --webpack`.
✅ **Migration `middleware.ts` → `proxy.ts`** : conforme à Next.js 16.

### B. Connexion à la base de données

✅ **Variables DB séparées** (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`) au lieu d'une URL complète unique.
✅ **Helper `safeDbCall`** : tolère une DB inaccessible au moment du build (fallback sur `[]`).
✅ **Builder `ensureDatabaseUrl()`** : construit l'URL Prisma depuis les variables `DB_*` au démarrage.

### C. SEO / OpenGraph

✅ **Image OG de couverture** : `/images/og-cover.jpg` (1200×630, déjà existant) avec tous les champs (`url`, `width`, `height`, `alt`, `type`).
✅ **Logo d'organisation** : `/pvs-pwa/logo-fixed.png` (87×71, déjà existant) exposé via `og:logo` et JSON-LD.
✅ **Bloc OpenGraph complet** : `og:title`, `og:description`, `og:url`, `og:site_name`, `og:locale`, `og:type`, `og:image:*`, `og:logo`.
✅ **Twitter Cards** : `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`.
✅ **JSON-LD Organization** enrichi : `@id`, `alternateName`, `legalName`, `logo` (ImageObject), `image`, `contactPoint`, `sameAs` (depuis env).
✅ **Viewport / Theme color** : variantes light/dark pour Chrome Android, Safari iOS.
✅ **Robots fins** : `max-image-preview:large`, `max-snippet:-1`, `max-video-preview:-1`.
✅ **Keywords + authors + creator + publisher + category** : enrichis pour le SEO.
✅ **Format detection désactivée** : empêche la transformation auto des numéros de téléphone en liens cliquables iOS.

---

## 3. Configuration de Hostinger

### 3.1. Activer l'accès SSH (fortement recommandé)

1. Connectez-vous à **hPanel Hostinger** → **Hébergement** → votre domaine.
2. **Avancé** → **Accès SSH** → Activer (l'activation peut prendre quelques minutes).
3. Notez les identifiants (généralement `u143417747@azure-sandpiper-407473.hostingersite.com`).

### 3.2. Sélectionner la version Node.js

1. Toujours dans hPanel → **Avancé** → **Configuration Node.js**.
2. Sélectionnez **Node.js 20 LTS** (ou 18.18+ minimum requis par Next.js 16).
3. **Commande de démarrage** : `npm start` (ou laissez la valeur par défaut).
4. **Commande de build** : `npm run build` (qui exécutera `next build --webpack`).
5. **Répertoire de l'application** : `public_html` (ou le sous-dossier défini par votre type d'hébergement).

### 3.3. Base de données MySQL

1. **Bases de données MySQL** : votre base `u143417747_ongd_pvs` est déjà créée (1 MB).
2. Notez les identifiants :
   - **Hôte** : `localhost` (vérifiez sur la ligne de votre base dans hPanel)
   - **Port** : `3306`
   - **Utilisateur** : `u143417747_pvs`
   - **Mot de passe** : celui que vous avez défini
   - **Nom de la base** : `u143417747_ongd_pvs`

### 3.4. Variables d'environnement

Voir section dédiée [§4 Variables d'environnement](#4-variables-denvironnement).

### 3.5. Connexion au domaine

Dans **Domaines** → vérifiez que `azure-sandpiper-407473.hostingersite.com` pointe bien vers le dossier `public_html` (ou celui où Next.js produit le `.next/`).

---

## 4. Variables d'environnement

### 4.1. Variables **obligatoires** (à configurer sur Hostinger)

Dans hPanel → **Avancé** → **Variables d'environnement**, ajoutez :

| Variable               | Valeur                                             | Obligatoire | Notes                                                                                                                                 |
| ---------------------- | -------------------------------------------------- | :---------: | ------------------------------------------------------------------------------------------------------------------------------------- |
| `DB_HOST`              | `localhost`                                        |     ✅      | Vérifier dans hPanel que c'est bien `localhost` et non une IP externe                                                                 |
| `DB_PORT`              | `3306`                                             |     ✅      |                                                                                                                                       |
| `DB_USER`              | `u143417747_pvs`                                   |     ✅      |                                                                                                                                       |
| `DB_PASSWORD`          | `Arcanecore_2026`                                  |     ✅      | Le mot de passe que vous avez défini lors de la création de la BDD                                                                    |
| `DB_NAME`              | `u143417747_ongd_pvs`                              |     ✅      |                                                                                                                                       |
| `NEXT_PUBLIC_SITE_URL` | `https://azure-sandpiper-407473.hostingersite.com` |     ✅      | Sans slash final. Utilisé par OG, canonical, JSON-LD                                                                                  |
| `AUTH_SECRET`          | _(générer)_                                        |     ✅      | Clé secrète pour signer les sessions admin. Générer avec : `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `ADMIN_EMAIL`          | `admin@pvs-ongd.org`                               |     ✅      | Utilisé par `npm run db:seed`                                                                                                         |
| `ADMIN_PASSWORD`       | _(un mot de passe fort)_                           |     ✅      | Utilisé par `npm run db:seed`                                                                                                         |
| `SMTP_HOST`            | `smtp.gmail.com`                                   |     ✅      | Si vous utilisez Gmail (sinon ajuster)                                                                                                |
| `SMTP_PORT`            | `465`                                              |     ✅      | SSL. Pour TLS utilisez `587`                                                                                                          |
| `SMTP_USER`            | _(votre Gmail)_                                    |     ✅      |                                                                                                                                       |
| `SMTP_PASS`            | _(App Password 16 caractères)_                     |     ✅      | Pas votre mot de passe Gmail ! Créez un "Mot de passe d'application" sur https://myaccount.google.com/apppasswords                    |
| `CONTACT_FROM_EMAIL`   | _(votre Gmail)_                                    |     ✅      |                                                                                                                                       |
| `CONTACT_TO_EMAIL`     | `contact@pvs-ongd.org`                             |     ✅      | L'adresse qui reçoit les messages                                                                                                     |

### 4.2. Variables **optionnelles** (recommandées plus tard)

| Variable                      | Valeur                                      | Effet                                                                                                                                                                      |
| ----------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SOCIAL_FACEBOOK` | `https://www.facebook.com/pvsongd`          | Ajouté au JSON-LD `sameAs` (Google Knowledge Graph)                                                                                                                        |
| `NEXT_PUBLIC_SOCIAL_LINKEDIN` | `https://www.linkedin.com/company/pvs-ongd` | Idem                                                                                                                                                                       |
| `NEXT_PUBLIC_SOCIAL_YOUTUBE`  | `https://www.youtube.com/@pvsongd`          | Idem                                                                                                                                                                       |
| `NEXT_PUBLIC_TWITTER`         | `@pvs_ongd`                                 | Active `twitter:site` et `twitter:creator` (nécessite édition manuelle de `lib/og.ts` pour l'instant — voir [§10 Pistes d'amélioration](#10-pistes-damélioration-futures)) |

### 4.3. Format de `.env` local (dev)

Votre `.env` local peut utiliser **l'ancien format `DATABASE_URL` complet** — il est rétro-compatible. Si vous voulez tester le nouveau format localement :

```bash
# Base de données
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="root"
DB_PASSWORD="root"
DB_NAME="pvs_ongd"

# URL publique
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Admin
ADMIN_EMAIL="admin@pvs-ongd.org"
ADMIN_PASSWORD="changeme123"
AUTH_SECRET="replace-with-a-long-random-secret-string"

# SMTP
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="votre.adresse@gmail.com"
SMTP_PASS="abcd-efgh-ijkl-mnop"
CONTACT_FROM_EMAIL="votre.adresse@gmail.com"
CONTACT_TO_EMAIL="contact@pvs-ongd.org"

# Réseaux sociaux (optionnel, décommentez)
# NEXT_PUBLIC_SOCIAL_FACEBOOK="https://www.facebook.com/pvsongd"
# NEXT_PUBLIC_SOCIAL_LINKEDIN="https://www.linkedin.com/company/pvs-ongd"
# NEXT_PUBLIC_SOCIAL_YOUTUBE="https://www.youtube.com/@pvsongd"
```

Le fichier `.env.example` à la racine du projet contient ces mêmes variables documentées.

---

## 5. Modifications du code

### 5.1. `package.json` — Scripts de build

**Diff :**

```diff
   "scripts": {
-    "dev": "next dev",
-    "build": "next build",
+    "dev": "next dev --webpack",
+    "build": "next build --webpack",
     "start": "next start",
     ...
+    "test:db-config": "tsx scripts/test-db-config.ts",
+    "test:og": "tsx scripts/test-og.ts",
   }
```

**Pourquoi :** Next.js 16 utilise Turbopack par défaut pour le build, mais Turbopack
nécessite des binaires natifs (`@next/swc-linux-x64-gnu.node`) qui demandent
**GLIBC ≥ 2.29**. Hostinger tourne sur une distribution avec GLIBC plus ancienne.
**Webpack**, lui, accepte les bindings WASM en fallback.

### 5.2. `next.config.js` — Suppression du bloc Turbopack

**Diff :**

```diff
 const nextConfig = {
-  // Évite que Turbopack remonte au-delà du projet…
-  turbopack: {
-    root: __dirname,
-  },
   serverExternalPackages: ["geoip-lite", "i18n-iso-countries"],
   ...
 };
```

**Pourquoi :** Inutile maintenant qu'on force Webpack via la CLI.

### 5.3. `middleware.ts` → `proxy.ts`

**Action :** Renommer le fichier `middleware.ts` → `proxy.ts` à la racine du projet.

**Diff dans `proxy.ts` :**

```diff
-export async function middleware(request: NextRequest) {
+export async function proxy(request: NextRequest) {
   ...
 }

-export const runtime = "nodejs";   // ← SUPPRIMER (interdit dans proxy.ts)
```

**Pourquoi :** Next.js 16 a renommé la convention `middleware` en `proxy` (avec
warning de dépréciation). La fonction exportée doit aussi être renommée.
De plus, `export const runtime` est désormais **interdit** dans un fichier proxy
(le proxy tourne toujours sur Node.js par défaut).

### 5.4. `lib/db-config.ts` (NOUVEAU)

Module qui :

- Lit les variables `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
- Construit l'URL MySQL `mysql://USER:PASSWORD@HOST:PORT/DATABASE` (avec encodage
  automatique des caractères spéciaux du mot de passe).
- L'injecte dans `process.env.DATABASE_URL` au plus tôt (avant Prisma).
- **Rétro-compatible** : si `DATABASE_URL` est déjà définie, elle est utilisée telle
  quelle.

**Exports :**

```ts
buildDatabaseUrl(): string  // URL construite (sans effet de bord)
ensureDatabaseUrl(): string  // URL construite + injectée dans process.env.DATABASE_URL
```

### 5.5. `lib/prisma.ts` — Injection de l'URL DB

**Diff :**

```diff
 import { PrismaClient } from "@prisma/client";

+import { ensureDatabaseUrl } from "@/lib/db-config";
+
+// On construit/injecte `DATABASE_URL` depuis les variables DB_*
+// AVANT d'instancier PrismaClient.
+ensureDatabaseUrl();
+
 const globalForPrisma = globalThis as unknown as {
   prisma: PrismaClient | undefined;
 };
```

### 5.6. `prisma.config.ts` — Idem pour la CLI Prisma

**Diff :**

```diff
 import "dotenv/config";
 import { defineConfig } from "prisma/config";

+import { ensureDatabaseUrl } from "./lib/db-config";
+
+// La CLI Prisma (`migrate`, `db pull`, `db push`, etc.) lit aussi
+// `DATABASE_URL`. On la construit depuis DB_* si besoin.
+ensureDatabaseUrl();
+
 export default defineConfig({ ... });
```

### 5.7. `lib/db-resilience.ts` (NOUVEAU)

Helper `safeDbCall<T>(query, fallback, context)` qui intercepte les erreurs Prisma
transitoires (`P1000` auth, `P1001` timeout, `P1002` unreachable, etc.) et renvoie
un fallback (par défaut `[]`) au lieu de faire échouer le build.

**Usage :**

```ts
import { safeDbCall } from "@/lib/db-resilience";

const pricingItems = await safeDbCall(
  () =>
    prisma.product.findMany({
      where: { category: "agriculture", deletedAt: null, isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      take: 4,
    }),
  [], // fallback si la DB est inaccessible
  "agriculture:pricingItems", // contexte pour les logs
);
```

**Important :** À n'utiliser **QUE** pour les requêtes de page non-critiques
(listes publiques, sections facultatives). Les actions admin (mutations,
recherche, export) doivent garder leur gestion d'erreur explicite.

### 5.8. Pages publiques protégées par `safeDbCall`

Cinq pages utilisent désormais `safeDbCall` autour de leurs requêtes Prisma :

- `app/agriculture/page.tsx`
- `app/tarifs/page.tsx`
- `app/pisciculture/page.tsx`
- `app/porcherie/page.tsx`
- `app/produits-animaux/page.tsx`

**Pattern appliqué :**

```diff
-const pricingItems = await prisma.product.findMany({ ... });
+const pricingItems = await safeDbCall(
+  () => prisma.product.findMany({ ... }),
+  [],
+  "agriculture:pricingItems",
+);
```

---

## 6. Configuration OpenGraph & SEO

### 6.1. `lib/og.ts` (NOUVEAU) — Module central

**Exports principaux :**

| Export               | Type                    | Description                                                        |
| -------------------- | ----------------------- | ------------------------------------------------------------------ |
| `siteUrl`            | `string`                | URL canonique du site (résout `NEXT_PUBLIC_SITE_URL`)              |
| `siteName`           | `string`                | `"PVS ONGD ASBL"`                                                  |
| `ogCover`            | `const`                 | Image OG : `{ url, width, height, alt, type }`                     |
| `ogLogo`             | `const`                 | Logo : `{ url, width, height, alt, type }`                         |
| `favicons`           | `const`                 | Chemins des favicons                                               |
| `social`             | `const`                 | `{ twitter, facebook, linkedin, youtube }` (à éditer manuellement) |
| `openGraphBase`      | `Metadata["openGraph"]` | Bloc OG réutilisable                                               |
| `twitterBase`        | `Metadata["twitter"]`   | Bloc Twitter réutilisable                                          |
| `robots`             | `Metadata["robots"]`    | Directives robots fines                                            |
| `icons`              | `Metadata["icons"]`     | Bloc icons complet                                                 |
| `logoAbsoluteUrl`    | `string`                | URL absolue du logo (pour JSON-LD)                                 |
| `ogCoverAbsoluteUrl` | `string`                | URL absolue de l'image OG                                          |
| `absoluteUrl(path)`  | `function`              | Convertit un chemin relatif en URL absolue                         |

**Note importante :** ce module est volontairement "feuille" (pas d'import depuis
`@/lib/seo`) pour éviter une circular dependency.

### 6.2. `lib/seo.ts` — Réorganisation

**Changements :**

- `siteUrl` et `siteName` sont désormais **réexportés** depuis `@/lib/og`.
  Les imports existants `import { siteUrl } from "@/lib/seo"` continuent de
  fonctionner.
- `pageMetadata()` enrichi avec `og:image:alt`, `og:image:type` explicites.
- `organizationJsonLd()` enrichi avec :
  - `@id` : `${siteUrl}/#organization`
  - `alternateName` : `["PVS", "PVS ONGD", "PVS ASBL"]`
  - `legalName` : `"PVS ONGD ASBL"`
  - `logo` : `{ "@type": "ImageObject", url, width, height }`
  - `image` : URL du logo
  - `contactPoint` : tableau avec téléphone, email, langues, zone
  - `sameAs` : depuis les variables `NEXT_PUBLIC_SOCIAL_*`

### 6.3. `app/layout.tsx` — Métadonnées racine

**Bloc `viewport` :**

```ts
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3b52c4" },
    { media: "(prefers-color-scheme: dark)", color: "#1a2456" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};
```

**Bloc `metadata` :**

- `title.template` : `"%s | PVS ONGD ASBL"`
- `keywords` : 13 mots-clés (PVS, ONGD, ASBL, Kinshasa, RDC, agriculture, etc.)
- `authors`, `creator`, `publisher` : tous à `PVS ONGD ASBL`
- `category` : `"agriculture"`
- `robots` : `index: true, follow: true, max-image-preview: large, max-snippet: -1, max-video-preview: -1`
- `manifest` : `"/pvs-pwa/manifest.json"` (vérifiez que ce fichier existe dans `public/pvs-pwa/`)
- `formatDetection` : désactive la transformation auto des téléphones/emails/adresses
- `openGraph` : bloc complet (voir §6.4)
- `twitter` : bloc complet (voir §6.5)
- `other` :
  - `"og:logo"` : URL absolue du logo
  - `"msapplication-TileColor"` : `#3b52c4`
  - `"msapplication-TileImage"` : `/pvs-pwa/icons/icon-144x144.png`
  - `"theme-color"` : `#3b52c4`

### 6.4. Balises OpenGraph générées

Pour chaque page, le `<head>` HTML contiendra :

```html
<meta property="og:title" content="…" />
<meta property="og:description" content="…" />
<meta property="og:url" content="…" />
<meta property="og:site_name" content="PVS ONGD ASBL" />
<meta property="og:locale" content="fr_FR" />
<meta property="og:type" content="website" />
<meta property="og:image" content="/images/og-cover.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta
  property="og:image:alt"
  content="PVS ONGD ASBL — Agriculture, Élevage, Pisciculture à Kinshasa"
/>
<meta property="og:image:type" content="image/jpeg" />
<meta
  property="og:logo"
  content="https://azure-sandpiper-407473.hostingersite.com/pvs-pwa/logo-fixed.png"
/>
```

### 6.5. Balises Twitter Card générées

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="…" />
<meta name="twitter:description" content="…" />
<meta name="twitter:image" content="/images/og-cover.jpg" />
<meta name="twitter:image:alt" content="…" />
```

### 6.6. JSON-LD Organization généré

```json
{
  "@context": "https://schema.org",
  "@type": "NGO",
  "@id": "https://azure-sandpiper-407473.hostingersite.com/#organization",
  "name": "PVS ONGD ASBL",
  "alternateName": ["PVS", "PVS ONGD", "PVS ASBL"],
  "legalName": "PVS ONGD ASBL",
  "url": "https://azure-sandpiper-407473.hostingersite.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://azure-sandpiper-407473.hostingersite.com/pvs-pwa/logo-fixed.png",
    "width": 87,
    "height": 71
  },
  "image": "https://azure-sandpiper-407473.hostingersite.com/pvs-pwa/logo-fixed.png",
  "description": "…",
  "telephone": "+243 999 916 552",
  "email": "…",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "3 Avenue Dokolo, Q/ Kimwenza gare, C/ Mont Ngafula",
    "addressLocality": "Kinshasa",
    "addressRegion": "Kinshasa",
    "postalCode": "—",
    "addressCountry": "CD"
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "telephone": "+243 999 916 552",
      "email": "…",
      "availableLanguage": ["French", "Lingala"],
      "areaServed": "CD"
    }
  ],
  "sameAs": [
    "https://www.facebook.com/pvsongd",
    "https://www.linkedin.com/company/pvs-ongd",
    "https://www.youtube.com/@pvsongd"
  ]
}
```

### 6.7. `.env.example`

Le fichier `.env.example` à la racine documente maintenant :

- Les variables DB (Format A : séparées / Format B : URL complète — rétro-compatible)
- L'URL publique du site
- L'admin et l'authentification
- Le SMTP Gmail
- Les réseaux sociaux (commentés, à décommenter quand les comptes existent)

---

## 7. Commandes à exécuter

### 7.1. En local (avant déploiement)

```bash
# Installer les dépendances
npm install

# Vérifier la config DB (6 cas testés)
npm run test:db-config

# Vérifier les métadonnées OG générées
npm run test:og

# Typecheck
npm run typecheck

# Linter
npm run lint

# Build de production (avec DB accessible ou non — safeDbCall protège)
npm run build
```

### 7.2. Sur Hostinger (via SSH)

```bash
# Se connecter en SSH
ssh u143417747@azure-sandpiper-407473.hostingersite.com

# Aller dans le dossier du projet
cd domains/azure-sandpiper-407473.hostingersite.com/public_html

# Si vous n'avez pas encore cloné le repo
git clone <votre-repo-git> .
# Ou uploadez via FTP les fichiers modifiés

# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate

# Appliquer les migrations à la base de données
npx prisma migrate deploy

# Optionnel : peupler la base avec le compte admin initial
npm run db:seed

# Builder le projet (utilise `next build --webpack` automatiquement)
npm run build

# Démarrer le serveur Next.js
npm start
```

### 7.3. Alternative : import SQL via phpMyAdmin

Si vous avez le dump SQL `pvs_ongd-2026-09-12_182022-dump.sql` :

1. hPanel → **Bases de données MySQL** → **Enter phpMyAdmin**
2. Sélectionnez `u143417747_ongd_pvs`
3. Onglet **Importer** → choisissez le fichier `.sql`
4. Cliquez sur **Importer**

---

## 8. Tests & validation

### 8.1. Tester la configuration DB

```bash
npm run test:db-config
```

Affiche 6 cas de figure :

- DATABASE_URL seule (ancien format, dev local)
- DB_* séparées (nouveau format, Hostinger)
- Conflit (DATABASE_URL prioritaire)
- Variables partielles (erreur explicite)
- Mot de passe avec caractères spéciaux (auto-encodé)
- buildDatabaseUrl() sans effet de bord

### 8.2. Tester les métadonnées OG

```bash
npm run test:og
```

Affiche toutes les balises `<meta>` qui seront générées dans le `<head>`.

### 8.3. Valider après déploiement (en ligne)

Une fois déployé sur Hostinger, utilisez ces outils gratuits :

| Plateforme          | Outil             | URL                                          |
| ------------------- | ----------------- | -------------------------------------------- |
| Facebook            | Sharing Debugger  | https://developers.facebook.com/tools/debug/ |
| Twitter / X         | Card Validator    | https://cards-dev.twitter.com/validator      |
| LinkedIn            | Post Inspector    | https://www.linkedin.com/post-inspector/     |
| OpenGraph générique | OpenGraph.xyz     | https://www.opengraph.xyz/                   |
| Google Rich Results | Rich Results Test | https://search.google.com/test/rich-results  |

Pour chaque URL à tester, entrez :

```
https://azure-sandpiper-407473.hostingersite.com/
https://azure-sandpiper-407473.hostingersite.com/agriculture
https://azure-sandpiper-407473.hostingersite.com/tarifs
https://azure-sandpiper-407473.hostingersite.com/contact
```

### 8.4. Script de check déjà présent dans le projet

Le projet contient déjà `scripts/check-meta.mjs` qui parse les balises OG/Twitter/JSON-LD :

```bash
node scripts/check-meta.mjs http://localhost:3000
```

---

## 9. Rollback en cas de problème

Si quelque chose se passe mal après déploiement :

### 9.1. Rollback des modifications du code

Tous les nouveaux fichiers sont isolés, vous pouvez les supprimer sans casser le reste :

```bash
# Restaurer l'ancien middleware (au lieu de proxy.ts)
mv proxy.ts.bak middleware.ts
# Rééditer middleware.ts pour remettre `export async function middleware`

# Supprimer les nouveaux helpers (optionnel, ils ne cassent rien)
rm lib/db-config.ts
rm lib/db-resilience.ts
rm scripts/test-db-config.ts
rm scripts/test-og.ts

# Restaurer package.json original
git checkout package.json

# Restaurer next.config.js (réintroduire le bloc turbopack)
git checkout next.config.js
```

### 9.2. Rollback de la configuration Hostinger

Dans hPanel → **Variables d'environnement**, supprimez simplement les variables
posées. Remettez `DATABASE_URL` si vous préférez l'ancien format unique :

```
DATABASE_URL=mysql://u143417747_pvs:Arcanecore_2026@localhost:3306/u143417747_ongd_pvs
```

### 9.3. Forcer un redéploiement

Sur Hostinger, dans **Hébergement** → **Avancé** → **Configuration Node.js**, vous
pouvez déclencher un nouveau build en cliquant sur **"Réexécuter le script de
build"** ou en uploadant à nouveau un fichier (même identique) qui force le
déclenchement du webhook Git.

---

## 10. Pistes d'amélioration futures

### 10.1. Activer `twitter:site` et `twitter:creator`

Pour l'instant `social.twitter` est à `undefined` dans `lib/og.ts`. Pour l'activer :

```ts
// lib/og.ts
export const social = {
  twitter: "@pvs_ongd", // ← décommenter et renseigner
  facebook: undefined,
  linkedin: undefined,
  youtube: undefined,
} as const;
```

Une fois cette modification faite, `app/layout.tsx` ajoutera automatiquement
`twitter:site="@pvs_ongd"` et `twitter:creator="@pvs_ongd"` aux balises générées.

### 10.2. Ajouter un sitemap OpenGraph pour chaque page

Pour l'instant toutes les pages utilisent la même image `og-cover.jpg`. Vous
pourriez créer des images spécifiques par page (1200×630 chacune) :

- `public/images/og-agriculture.jpg`
- `public/images/og-tarifs.jpg`
- `public/images/og-pisciculture.jpg`
- etc.

Puis modifier `pageMetadata()` dans `lib/seo.ts` pour accepter une `image`
personnalisée :

```ts
export function pageMetadata({
  title,
  description,
  path,
  image,  // ← nouveau paramètre
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  // ...
  images: [
    {
      url: image ?? ogCover.url,
      width: 1200,
      height: 630,
      alt: title,
      type: "image/jpeg",
    },
  ],
}
```

### 10.3. Internationalisation (i18n)

Si vous voulez proposer une version anglaise du site :

1. Décommenter dans `app/layout.tsx` :
   ```ts
   alternates: {
     canonical: "/",
     languages: {
       "fr-CD": "/",
       "en-US": "/en",
     },
   },
   ```
2. Ajouter `alternateLocale: ["en_US"]` dans `openGraphBase` (lib/og.ts).
3. Créer un dossier `app/en/` avec les pages traduites.

### 10.4. Composant `<SocialPreview />` dans le back-office admin

Pour prévisualiser le rendu Facebook/Twitter/LinkedIn depuis l'admin avant de
modifier une page produit. Utiliserait `<iframe src="https://www.opengraph.xyz/url/..." />`
ou un rendu local custom.

### 10.5. OG Image dynamique par produit

Utiliser `@vercel/og` ou `next/og` (intégré à Next.js 14+) pour générer à la
demande une image OG par produit (avec son nom + prix + image), servie en
`/api/og?product=123`. Améliore massivement le taux de clic sur les partages.

---

## 📋 Checklist de déploiement

À cocher au fur et à mesure :

- [ ] **Variables d'environnement Hostinger configurées** (§4.1)
- [ ] **Node.js 20 LTS sélectionné** dans hPanel
- [ ] **Accès SSH activé** (recommandé)
- [ ] **Code pushé** sur le repo Git lié à Hostinger (ou upload FTP)
- [ ] **Base de données peuplée** (via Prisma migrate OU import phpMyAdmin)
- [ ] **Build lancé** (`npm run build` côté serveur ou via hPanel)
- [ ] **App démarrée** (`npm start` ou automatique)
- [ ] **URL testée** : `https://azure-sandpiper-407473.hostingersite.com/`
- [ ] **OG validés** sur Facebook Sharing Debugger
- [ ] **Twitter Card validée** sur Card Validator
- [ ] **JSON-LD validé** sur Google Rich Results Test
- [ ] **Variables `NEXT_PUBLIC_SOCIAL_*`** ajoutées quand les comptes existent
- [ ] **Compte admin créé** (`npm run db:seed` ou via SQL)

---

## 📂 Fichiers créés ou modifiés — récapitulatif

### Créés

| Fichier                     | Rôle                                                 |
| --------------------------- | ---------------------------------------------------- |
| `lib/og.ts`                 | Module central OG / Twitter / Logo                   |
| `lib/db-config.ts`          | Builder d'URL DB depuis variables `DB_*`             |
| `lib/db-resilience.ts`      | Helper `safeDbCall` pour tolérer une DB inaccessible |
| `scripts/test-db-config.ts` | Test de la config DB                                 |
| `scripts/test-og.ts`        | Test des métadonnées OG                              |
| `proxy.ts`                  | Ex-`middleware.ts` (convention Next.js 16)           |
| `CHANGELOG-DEPLOY.md`       | Ce document                                          |

### Modifiés

| Fichier                         | Changements                                                                                                |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `package.json`                  | Scripts `build`/`dev` avec `--webpack` ; ajout `test:db-config` et `test:og`                               |
| `next.config.js`                | Suppression du bloc `turbopack`                                                                            |
| `app/layout.tsx`                | Métadonnées OG/Twitter complètes, viewport, theme-color, manifest, formatDetection, robots, keywords, etc. |
| `lib/seo.ts`                    | Réorganisation (réexport depuis `lib/og`), `pageMetadata` enrichi, `organizationJsonLd` enrichi            |
| `app/agriculture/page.tsx`      | `safeDbCall` autour de la requête produit                                                                  |
| `app/tarifs/page.tsx`           | `safeDbCall` autour des deux requêtes (produits + catégories)                                              |
| `app/pisciculture/page.tsx`     | `safeDbCall` autour de la requête produit                                                                  |
| `app/porcherie/page.tsx`        | `safeDbCall` autour de la requête produit                                                                  |
| `app/produits-animaux/page.tsx` | `safeDbCall` autour de la requête produit                                                                  |
| `prisma.config.ts`              | Appel de `ensureDatabaseUrl()` avant `defineConfig`                                                        |
| `lib/prisma.ts`                 | Appel de `ensureDatabaseUrl()` avant `new PrismaClient`                                                    |
| `.env.example`                  | Documentation complète (DB, social, OG)                                                                    |

### Supprimés

| Fichier         | Raison                                          |
| --------------- | ----------------------------------------------- |
| `middleware.ts` | Remplacé par `proxy.ts` (convention Next.js 16) |

---

**Fin du document.** Pour toute question ou problème, contactez ArcaneCore.
