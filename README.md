# Site PVS — pvs-ongd

Site web Next.js 16 (App Router) avec panneau d'administration, base de données MySQL via Prisma, Tailwind CSS et analytics.

## Prérequis

- **Node.js** 18.18+ (recommandé : 20+)
- **MySQL** en local — Laragon fonctionne parfaitement (démarrer Laragon → MySQL actif sur `localhost:3306`)
- **npm** (fourni avec Node.js)

## 1. Installation des dépendances

```bash
npm install
```

## 2. Configuration de l'environnement

Créer un fichier `.env` à la racine du projet :

```env
# Base de données MySQL (Laragon : adapter user/password à votre config)
DATABASE_URL="mysql://root:root@localhost:3306/pvs_ongd"

# Secret pour signer les sessions admin (générer une chaîne aléatoire)
AUTH_SECRET="changez-moi-par-une-chaine-aleatoire-longue"

# Compte super admin créé par le seed
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="mot-de-passe-securise"

# Optionnel : envoi d'emails du formulaire de contact
# SMTP_HOST="smtp.example.com"
# SMTP_PORT="587"
# SMTP_USER="user"
# SMTP_PASS="pass"
# CONTACT_TO_EMAIL="contact@example.com"
# CONTACT_FROM_EMAIL="noreply@example.com"
```

Créer la base de données `pvs_ongd` dans Laragon (HeidiSQL / phpMyAdmin) ou en ligne de commande :

```bash
mysql -u root -proot -e "CREATE DATABASE pvs_ongd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

## 3. Initialiser la base de données

```bash
# Appliquer les migrations (crée les tables)
npm run db:migrate

# Générer le client Prisma (fait automatiquement par migrate, mais au cas où)
npm run db:generate

# Remplir la base : produits + super admin (utilise ADMIN_EMAIL / ADMIN_PASSWORD)
npm run db:seed
```

## 4. Lancer le projet

```bash
# Mode développement → http://localhost:3000
npm run dev
```

- Site public : http://localhost:3000
- Panneau admin : http://localhost:3000/admin/login (identifiants = `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

## Autres commandes utiles

```bash
npm run build        # Build de production
npm run start        # Démarrer le build de production → http://localhost:3000
npm run lint         # Vérifier le code avec ESLint
npm run typecheck    # Vérifier les types TypeScript
npm run test         # Lancer les tests (Vitest)
npm run db:studio    # Interface visuelle Prisma pour la BDD → http://localhost:5555
```

## Logo & icônes

Le logo affiché sur le site (navbar, footer, sidebar admin, favicon, icônes PWA)
provient de **`public/images/og-cover.jpg`**.

Après avoir remplacé cette image, régénérer tous les assets dérivés :

```bash
npm run logos:regen
```

Le script `scripts/regen-pvs-logos.mjs` détecte automatiquement le logo dans la
photo, puis produit `source-logo.png` (master), `logo-fixed.png` (opaque, pour
`og:logo` et le JSON-LD), `logo-transparent.png` (alpha circulaire, pour l'UI) et
l'ensemble des icônes aux dimensions correctes.

> Si vous changez le logo, pensez à **incrémenter la version des caches** dans
> `public/sw.js` et `public/pvs-pwa/sw.js` (`v2` → `v3`…), sinon les visiteurs
> continueront de voir l'ancien logo depuis leur cache.

## Mesure d'audience & politique de confidentialité

La page **`/confidentialite`** (accessible depuis le footer) décrit les
traitements de données tels qu'ils sont réellement implémentés dans le code.

La mesure d'audience (`/api/track`) **ne démarre qu'après consentement** :

| Fichier                                | Rôle                                                                                                         |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `lib/consent.ts`                       | Lecture/écriture du cookie local `pvs-consent` (`accepted` / `refused`, 12 mois)                             |
| `components/layout/ConsentBanner.tsx`  | Bandeau « Refuser / Accepter » affiché tant qu'aucun choix n'a été fait                                      |
| `components/layout/ConsentManager.tsx` | Bloc « Modifier mon choix / Retirer mon consentement » dans la section « Votre choix » de `/confidentialite` |
| `lib/track.ts`                         | Point de passage central : **aucun** événement n'est envoyé sans consentement                                |
| `lib/retention.ts`                     | Purge automatique des statistiques (13 mois) et messages de contact (3 ans)                                  |
| `components/sections/ContactForm.tsx`  | Case de consentement explicite (art. 196) : l'envoi est bloqué tant qu'elle n'est pas cochée                 |

> ⚠️ Si tu modifies les traitements (nouvelles données collectées, nouvelle
> source externe, nouvelle durée de conservation), **mets à jour
> `lib/content.ts` (`confidentialitePage`) en même temps**, sinon la page
> légale décrit un fonctionnement qui n'est plus le sien. Les durées de
> conservation sont partagées entre `lib/retention.ts` et la section « Ce que
> nous collectons » de la politique.

> ⚠️ `NEXT_PUBLIC_SITE_URL` doit être défini **avant le build** : c'est cette
> variable qui produit les URL canoniques, le sitemap et le JSON-LD.

> ⚠️ Le formulaire de contact capture un **consentement explicite** (case à
> cocher, art. 196 du Code du numérique) et affiche un rappel de ne pas
> transmettre de données sensibles (art. 195). Si tu ajoutes un champ au
> formulaire, vérifie s'il relève de la collecte de données sensibles.

## Dépannage

- **PowerShell : `npm.ps1 ... l'exécution de scripts est désactivée`** → exécuter une fois :

  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

  puis rouvrir le terminal. Alternative sans changement : utiliser `npm.cmd run ...` ou un terminal **cmd** au lieu de PowerShell.

- **`P1001: Can't reach database server`** → MySQL n'est pas démarré (lancer Laragon) ou `DATABASE_URL` est incorrecte.
- **Tables manquantes / erreurs Prisma** → relancer `npm run db:migrate`.
- **Impossible de se connecter à l'admin** → vérifier que `ADMIN_EMAIL` / `ADMIN_PASSWORD` étaient définis avant `npm run db:seed`.
- **Port 3000 déjà utilisé** → `npm run dev -- -p 3001`.

### ⚠️ Page bloquée sur le loader en production (écran blanc / PageLoader figé)

Ce symptôme n'est **PAS** lié aux migrations Prisma. La cause est la
Content-Security-Policy définie dans `proxy.ts` : si elle contient un
`'nonce-…'` **et** `'strict-dynamic'`, le navigateur bloque **tous** les
scripts des pages prérendues (elles sont sérialisées au build, sans
attribut `nonce`), donc React ne s'hydrate pas et la page reste figée sur
`app/loading.tsx`.

Vérification rapide (console du navigateur) :

```text
Loading the script '…/_next/static/chunks/…' violates the following
Content Security Policy directive: "script-src 'self' 'nonce-…' 'strict-dynamic'"
```

Correctif : **ne jamais utiliser de nonce dans la CSP** de ce projet.
La CSP actuelle (`script-src 'self' 'unsafe-inline'`) est compatible pages
statiques **et** dynamiques. Le commentaire de `proxy.ts` explique pourquoi.

### ⚠️ `prisma migrate deploy` échoue en production (P3018)

Cause : le dossier `prisma/migrations/` contenait des migrations en
doublon (`20260912213922_add_2fa_and_password_reset` et
`20260913140350_catalog_composite_indexes` appliquent du SQL déjà
appliqué par `20260918104015_add_users_2fa_and_password_reset`), d'où
`Duplicate column name 'twoFactorEnabled'` ou
`Can't DROP INDEX 'products_category_idx'`.

Les migrations en doublon ont été supprimées. Si vous régénérez des
migrations, **ne dupliquez jamais** un `ALTER TABLE`/`CREATE INDEX` déjà
présent dans une migration antérieure.

Vérification avant déploiement :

```bash
npx prisma migrate status   # doit afficher "Database schema is up to date!"
```

> Note : `index.html`, `style.css` et `script.js` à la racine sont les anciens fichiers statiques du site — le projet actif est l'application Next.js dans `app/` et `components/`.
