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
npm run db:studio    # Interface visuelle Prisma pour la BDD → http://localhost:5555
```

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

> Note : `index.html`, `style.css` et `script.js` à la racine sont les anciens fichiers statiques du site — le projet actif est l'application Next.js dans `app/` et `components/`.
