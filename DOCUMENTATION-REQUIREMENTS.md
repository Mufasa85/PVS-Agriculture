# PVS ONGD ASBL — Documentation & Éléments requis pour le développement

> Ce document liste **l'ensemble des informations, documents, contenus et médias** nécessaires pour développer et finaliser le site web de PVS ONGD ASBL. Chaque section indique ce qui est déjà en place (✅) et ce qui doit être fourni par le client (⚠️ [À FOURNIR]).

---

## 1. Informations légales & organisationnelles

| Élément | Statut | Détails |
|---|---|---|
| Nom de l'organisation | ✅ | PVS ONGD ASBL |
| Statut juridique | ✅ | ONGD · ASBL (Organisation Non Gouvernementale de Développement) |
| Siège / adresse complète | ⚠️ [À FOURNIR] | Actuellement : "Kinshasa, RDC" — adresse précise requise (commune, quartier, rue, numéro) |
| Numéro d'enregistrement / agrément | ⚠️ [À FOURNIR] | Numéro d'enregistrement officiel de l'ASBL |
| Année de création | ⚠️ [À FOURNIR] | Pour la section "À propos" et les mentions légales |
| Numéro de téléphone | ⚠️ [À FOURNIR] | Actuellement placeholder : `+243 900 000 000` |
| Numéro WhatsApp | ⚠️ [À FOURNIR] | Actuellement placeholder : `https://wa.me/243900000000` |
| Adresse email | ⚠️ [À FOURNIR] | Actuellement placeholder : `contact@pvs-ongd.org` |
| Horaires d'ouverture | ⚠️ [À VÉRIFIER] | Actuellement : "Lun – Sam · 8h00 – 17h00" — à confirmer |
| Logo vectoriel (SVG) | ⚠️ [À FOURNIR] | Le badge actuel est un composant React (`BrandBadge`), un logo officiel vectoriel serait préférable |
| Numéro RCCM ou équivalent | ⚠️ [À FOURNIR] | Pour les mentions légales |

---

## 2. Réseaux sociaux

| Plateforme | Statut | URL requise |
|---|---|---|
| Facebook | ⚠️ [À FOURNIR] | URL de la page Facebook de PVS |
| Instagram | ⚠️ [À FOURNIR] | URL du compte Instagram de PVS |
| LinkedIn | ⚠️ [À FOURNIR] | URL de la page LinkedIn de PVS |
| YouTube (optionnel) | ⚠️ [À FOURNIR] | Si PVS a une chaîne YouTube |
| TikTok (optionnel) | ⚠️ [À FOURNIR] | Si PVS a un compte TikTok |

---

## 3. Pages du site & structure

Le site comporte actuellement **9 pages** + 1 page 404 :

### 3.1 Page d'accueil (`/`)

| Section | Contenu requis | Statut |
|---|---|---|
| **Hero** | Titre, sous-titre, paragraphe, 2 CTA, 3 stats, 4 images carrousel, badge | ✅ Textes en place, ⚠️ images placeholder |
| **Agriculture Feature** | Titre, paragraphe, image, 6 points forts | ✅ Textes en place, ⚠️ image placeholder |
| **Activités** | Titre, sous-titre, 5 cartes d'activités (image + description) | ✅ Textes en place, ⚠️ images placeholder |
| **À propos (aperçu)** | Titre, 2 paragraphes, tags, 2 images | ✅ Textes en place, ⚠️ images placeholder |
| **Pourquoi nous choisir** | Titre, 5 items (tag + titre + description) | ✅ En place |
| **Contact (aperçu)** | Titre, sous-titre, formulaire, coordonnées | ✅ En place, ⚠️ coordonnées placeholder |
| **Footer** | 4 colonnes (marque, liens rapides, activités, coordonnées) + réseaux + légal | ✅ Structure en place, ⚠️ liens légaux vides |

### 3.2 Page Agriculture (`/agriculture`)

| Section | Contenu requis | Statut |
|---|---|---|
| **Hero** | Eyebrow, titre, paragraphe, image, badge | ✅ Textes en place, ⚠️ image placeholder |
| **Features** | Eyebrow, titre, paragraphe, image, 6 points | ✅ Textes en place, ⚠️ image placeholder |
| **Stats** | 3 statistiques | ✅ En place |
| **CTA** | Eyebrow, titre, texte, bouton | ✅ En place |

### 3.3 Page Élevage (`/elevage`)

| Section | Contenu requis | Statut |
|---|---|---|
| **Hero** | Eyebrow, titre, paragraphe, image | ✅ Textes en place, ⚠️ image placeholder |
| **Galerie** | Eyebrow, titre, sous-titre, 5 slides (image + légende) | ✅ Textes en place, ⚠️ images placeholder |
| **Pratiques** | Eyebrow, titre, paragraphe, 6 items (icône + titre + description) | ✅ En place |
| **Processus** | Eyebrow, titre, 5 étapes numérotées | ✅ En place |
| **Stats** | 3 statistiques | ✅ En place |
| **CTA** | Eyebrow, titre, texte, bouton | ✅ En place |

### 3.4 Page Pisciculture (`/pisciculture`)

| Section | Contenu requis | Statut |
|---|---|---|
| **Hero** | Eyebrow, titre, paragraphe, image | ✅ Textes en place, ⚠️ image placeholder |
| **Overview** | Eyebrow, titre, 2 paragraphes, tags, image, 3 produits (nom + description + image) | ✅ Textes en place, ⚠️ images placeholder |
| **Features** | Eyebrow, titre, sous-titre, 6 items (icône + titre + description) | ✅ En place |
| **Pricing** | Eyebrow, titre, sous-titre, 4 items (nom + description + prix + unité + image + badge) | ✅ Textes en place, ⚠️ images placeholder, ⚠️ prix à confirmer |
| **Stats** | 3 statistiques | ✅ En place |
| **CTA** | Eyebrow, titre, texte, bouton | ✅ En place |

### 3.5 Page Porcherie (`/porcherie`)

| Section | Contenu requis | Statut |
|---|---|---|
| **Hero** | Eyebrow, titre, paragraphe, image | ✅ Textes en place, ⚠️ image placeholder |
| **Overview** | Eyebrow, titre, 2 paragraphes, tags, image, 3 produits (nom + description + image) | ✅ Textes en place, ⚠️ images placeholder |
| **Features** | Eyebrow, titre, sous-titre, 6 items (icône + titre + description) | ✅ En place |
| **Pricing** | Eyebrow, titre, sous-titre, 4 items (nom + description + prix + unité + image + badge) | ✅ Textes en place, ⚠️ images placeholder, ⚠️ prix à confirmer |
| **Stats** | 3 statistiques | ✅ En place |
| **CTA** | Eyebrow, titre, texte, bouton | ✅ En place |

### 3.6 Page Produits pour animaux (`/produits-animaux`)

| Section | Contenu requis | Statut |
|---|---|---|
| **Hero** | Eyebrow, titre, paragraphe, image | ✅ Textes en place, ⚠️ image placeholder |
| **Overview** | Eyebrow, titre, 2 paragraphes, tags, image, 4 produits (nom + description + image) | ✅ Textes en place, ⚠️ images placeholder |
| **Features** | Eyebrow, titre, sous-titre, 6 items (icône + titre + description) | ✅ En place |
| **Pricing** | Eyebrow, titre, sous-titre, 4 items (nom + description + prix + unité + image + badge) | ✅ Textes en place, ⚠️ images placeholder, ⚠️ prix à confirmer |
| **Stats** | 3 statistiques | ✅ En place |
| **CTA** | Eyebrow, titre, texte, bouton | ✅ En place |

### 3.7 Page À propos (`/a-propos`)

| Section | Contenu requis | Statut |
|---|---|---|
| **Hero** | Eyebrow, titre, paragraphe, image | ✅ Textes en place, ⚠️ image placeholder |
| **Mission** | Eyebrow, titre, déclaration (citation), signature + rôle | ✅ En place, ⚠️ signature à confirmer (qui signe ?) |
| **Vision** | Eyebrow, titre, 2 paragraphes, tags, 2 images | ✅ Textes en place, ⚠️ images placeholder |
| **Expertise** | Eyebrow, titre, sous-titre, 5 items (icône + titre + description) | ✅ En place |
| **Approche** | Eyebrow, titre, 4 étapes numérotées | ✅ En place |
| **Valeurs** | Eyebrow, titre, 5 items (tag + titre + description) | ✅ En place |
| **Stats** | 3 statistiques | ✅ En place |
| **CTA** | Eyebrow, titre, texte, bouton | ✅ En place |

### 3.8 Page Tarifs (`/tarifs`)

| Section | Contenu requis | Statut |
|---|---|---|
| **Hero** | Eyebrow, titre, paragraphe | ✅ En place |
| **Catégories** | 6 filtres (Tous, Bovins, Caprins, Pisciculture, Volailles, Produits) | ✅ En place |
| **Produits** | 14 produits (nom + description + prix + unité + catégorie + image) | ✅ Textes en place, ⚠️ images placeholder, ⚠️ prix à confirmer |
| **Info** | Eyebrow, titre, texte | ✅ En place |
| **CTA** | Eyebrow, titre, texte, bouton | ✅ En place |

### 3.9 Page Contact (`/contact`)

| Section | Contenu requis | Statut |
|---|---|---|
| **En-tête** | Eyebrow, titre, sous-titre | ✅ En place |
| **Formulaire** | 5 champs (nom, téléphone, email, sujet, message) + consentement | ✅ En place |
| **Coordonnées** | Téléphone, WhatsApp, email, adresse, horaires | ✅ Structure en place, ⚠️ valeurs placeholder |
| **API d'envoi** | Route API `/api/contact` avec Nodemailer | ✅ En place, ⚠️ configuration SMTP requise |

### 3.10 Page 404 (`/not-found`)

| Section | Contenu requis | Statut |
|---|---|---|
| **Message 404** | Grand "404", titre, message, 2 CTA, 6 liens rapides | ✅ En place |

---

## 4. Photographies & images

> **Toutes les images actuelles sont des placeholders Unsplash.** Elles doivent être remplacées par de vraies photos de PVS ONGD ASBL.

### 4.1 Images du Hero (page d'accueil) — 4 images

| # | Description | Format recommandé | Statut |
|---|---|---|---|
| 1 | Champ agricole / culture de PVS | 900×900px, paysage | ⚠️ [À FOURNIR] |
| 2 | Bétail / élevage de PVS | 900×900px, paysage | ⚠️ [À FOURNIR] |
| 3 | Étang de pisciculture de PVS | 900×900px, paysage | ⚠️ [À FOURNIR] |
| 4 | Porcherie de PVS | 900×900px, paysage | ⚠️ [À FOURNIR] |

### 4.2 Images page Agriculture — 2 images

| # | Description | Format recommandé | Statut |
|---|---|---|---|
| 1 | Hero : vue d'ensemble des champs | 1200×800px | ⚠️ [À FOURNIR] |
| 2 | Features : rangées de cultures / travail du sol | 800×600px | ⚠️ [À FOURNIR] |

### 4.3 Images page Élevage — 6 images

| # | Description | Format recommandé | Statut |
|---|---|---|---|
| 1 | Hero : vaches au pâturage | 1600×900px | ⚠️ [À FOURNIR] |
| 2 | Galerie : bovins au pâturage | 1200×800px | ⚠️ [À FOURNIR] |
| 3 | Galerie : volailles en élevage libre | 1200×800px | ⚠️ [À FOURNIR] |
| 4 | Galerie : caprins en stabulation | 1200×800px | ⚠️ [À FOURNIR] |
| 5 | Galerie : ovins au repos | 1200×800px | ⚠️ [À FOURNIR] |
| 6 | Galerie : suivi vétérinaire | 1200×800px | ⚠️ [À FOURNIR] |

### 4.4 Images page Pisciculture — 8 images

| # | Description | Format recommandé | Statut |
|---|---|---|---|
| 1 | Hero : étang de pisciculture | 1600×900px | ⚠️ [À FOURNIR] |
| 2 | Overview : bassin d'élevage | 800×600px | ⚠️ [À FOURNIR] |
| 3 | Produit : tilapia frais | 800×600px | ⚠️ [À FOURNIR] |
| 4 | Produit : poisson-chat frais | 800×600px | ⚠️ [À FOURNIR] |
| 5 | Produit : alevins dans bassin | 800×600px | ⚠️ [À FOURNIR] |
| 6 | Pricing : tilapia | 600×400px | ⚠️ [À FOURNIR] |
| 7 | Pricing : poisson-chat | 600×400px | ⚠️ [À FOURNIR] |
| 8 | Pricing : alevins + aliment | 600×400px (×2) | ⚠️ [À FOURNIR] |

### 4.5 Images page Porcherie — 8 images

| # | Description | Format recommandé | Statut |
|---|---|---|---|
| 1 | Hero : porcherie moderne | 1600×900px | ⚠️ [À FOURNIR] |
| 2 | Overview : porcs en enclos propre | 800×600px | ⚠️ [À FOURNIR] |
| 3 | Produit : porcs charcutiers | 800×600px | ⚠️ [À FOURNIR] |
| 4 | Produit : porcelets | 800×600px | ⚠️ [À FOURNIR] |
| 5 | Produit : reproducteurs | 800×600px | ⚠️ [À FOURNIR] |
| 6 | Pricing : porc charcutier | 600×400px | ⚠️ [À FOURNIR] |
| 7 | Pricing : porcelet sevré | 600×400px | ⚠️ [À FOURNIR] |
| 8 | Pricing : truie + verrat | 600×400px (×2) | ⚠️ [À FOURNIR] |

### 4.6 Images page Produits pour animaux — 9 images

| # | Description | Format recommandé | Statut |
|---|---|---|---|
| 1 | Hero : sacs d'aliment | 1600×900px | ⚠️ [À FOURNIR] |
| 2 | Overview : granulés d'aliment | 800×600px | ⚠️ [À FOURNIR] |
| 3-6 | Produits : aliment bovin, caprin, volailles, poisson | 800×600px (×4) | ⚠️ [À FOURNIR] |
| 7-9 | Pricing : aliment poulet, bovin, poisson, caprin | 600×400px (×4) | ⚠️ [À FOURNIR] |

### 4.7 Images page À propos — 3 images

| # | Description | Format recommandé | Statut |
|---|---|---|---|
| 1 | Hero : vue aérienne exploitation | 1200×800px | ⚠️ [À FOURNIR] |
| 2 | Vision : vue aérienne | 700×500px | ⚠️ [À FOURNIR] |
| 3 | Vision : travailleur agricole | 500×500px | ⚠️ [À FOURNIR] |

### 4.8 Images page Tarifs — 14 images

| # | Description | Format recommandé | Statut |
|---|---|---|---|
| 1-3 | Bovins : bœuf adulte, vache laitière, veau sevré | 600×400px (×3) | ⚠️ [À FOURNIR] |
| 4-5 | Caprins : chèvre adulte, bouc reproducteur, chevreau | 600×400px (×3) | ⚠️ [À FOURNIR] |
| 6-8 | Pisciculture : tilapia, alevins, poisson-chat | 600×400px (×3) | ⚠️ [À FOURNIR] |
| 9-11 | Volailles : poulet fermier, poules pondeuses, œufs | 600×400px (×3) | ⚠️ [À FOURNIR] |
| 12-14 | Produits : aliment poulet, bovin, poisson | 600×400px (×3) | ⚠️ [À FOURNIR] |

### 4.9 Images page d'accueil (sections) — 7 images

| # | Description | Format recommandé | Statut |
|---|---|---|---|
| 1 | AgricultureFeature : rangées de cultures | 800×600px | ⚠️ [À FOURNIR] |
| 2-6 | Activités : agriculture, élevage, pisciculture, porcherie, produits | 700×500px (×5) | ⚠️ [À FOURNIR] |
| 7 | APropos : vue aérienne | 700×500px | ⚠️ [À FOURNIR] |

### 4.10 Logo & favicon

| Élément | Format | Statut |
|---|---|---|
| Logo vectoriel (SVG) | SVG, couleur + noir + blanc | ⚠️ [À FOURNIR] |
| Favicon | 32×32px, 16×16px, .ico et .png | ⚠️ [À FOURNIR] |
| Apple Touch Icon | 180×180px | ⚠️ [À FOURNIR] |
| Open Graph image (partage réseaux) | 1200×630px | ⚠️ [À FOURNIR] |

> **Total images à fournir : ~65 photos**

---

## 5. Copywriting / Textes

### 5.1 Textes validés (✅)

Tous les textes actuels du site sont rédigés et structurés dans `lib/content.ts`. Ils couvrent :
- Hero, sections d'accueil, toutes les pages d'activités
- Page À propos (mission, vision, expertise, approche, valeurs)
- Page Tarifs (14 produits avec descriptions et prix)
- Page Contact (formulaire, coordonnées)
- Footer (description, liens, copyright)

### 5.2 Textes à créer / valider (⚠️)

| Élément | Description | Statut |
|---|---|---|
| **Mentions légales** | Page complète : statut ASBL, adresse, numéro d'enregistrement, directeur de publication, hébergeur | ⚠️ [À FOURNIR] |
| **Politique de confidentialité** | RGPD/conformité : collecte de données via formulaire, cookies, droits des utilisateurs | ⚠️ [À FOURNIR] |
| **CGV (optionnel)** | Conditions générales de vente si vente de produits | ⚠️ [À FOURNIR] |
| **Signature de la mission** | Nom et titre de la personne qui signe la citation dans "À propos" | ⚠️ [À FOURNIR] |
| **Témoignages clients (optionnel)** | Retours de partenaires ou clients sur PVS | ⚠️ [À FOURNIR] |
| **FAQ (optionnel)** | Questions fréquentes sur les produits, livraison, paiement | ⚠️ [À FOURNIR] |

---

## 6. Tarifs & catalogue produits

> Les prix actuels sont des **estimations**. Ils doivent être confirmés par PVS.

### 6.1 Bovins

| Produit | Prix actuel | Prix réel | Unité |
|---|---|---|---|
| Bœuf adulte | 1 200 000 FC | ⚠️ [À CONFIRMER] | / tête |
| Vache laitière | 1 500 000 FC | ⚠️ [À CONFIRMER] | / tête |
| Veau sevré | 450 000 FC | ⚠️ [À CONFIRMER] | / tête |

### 6.2 Caprins

| Produit | Prix actuel | Prix réel | Unité |
|---|---|---|---|
| Chèvre adulte | 180 000 FC | ⚠️ [À CONFIRMER] | / tête |
| Bouc reproducteur | 250 000 FC | ⚠️ [À CONFIRMER] | / tête |
| Chevreau sevré | 75 000 FC | ⚠️ [À CONFIRMER] | / tête |

### 6.3 Pisciculture

| Produit | Prix actuel | Prix réel | Unité |
|---|---|---|---|
| Tilapia frais | 8 000 FC | ⚠️ [À CONFIRMER] | / kg |
| Alevins tilapia | 500 FC | ⚠️ [À CONFIRMER] | / unité |
| Poisson-chat | 10 000 FC | ⚠️ [À CONFIRMER] | / kg |

### 6.4 Volailles

| Produit | Prix actuel | Prix réel | Unité |
|---|---|---|---|
| Poulet fermier | 15 000 FC | ⚠️ [À CONFIRMER] | / pièce |
| Poules pondeuses | 12 000 FC | ⚠️ [À CONFIRMER] | / pièce |
| Œufs frais | 3 000 FC | ⚠️ [À CONFIRMER] | / douzaine |

### 6.5 Produits pour animaux

| Produit | Prix actuel | Prix réel | Unité |
|---|---|---|---|
| Aliment poulet | 25 000 FC | ⚠️ [À CONFIRMER] | / sac 50 kg |
| Aliment bovin | 35 000 FC | ⚠️ [À CONFIRMER] | / sac 50 kg |
| Aliment poisson | 40 000 FC | ⚠️ [À CONFIRMER] | / sac 25 kg |
| Aliment caprin | 28 000 FC | ⚠️ [À CONFIRMER] | / sac 50 kg |

### 6.6 Porcherie

| Produit | Prix actuel | Prix réel | Unité |
|---|---|---|---|
| Porc charcutier | 180 000 FC | ⚠️ [À CONFIRMER] | / unité |
| Porcelet sevré | 45 000 FC | ⚠️ [À CONFIRMER] | / unité |
| Truie reproductrice | 250 000 FC | ⚠️ [À CONFIRMER] | / unité |
| Verrat reproducteur | 280 000 FC | ⚠️ [À CONFIRMER] | / unité |

---

## 7. Configuration technique

### 7.1 Email / SMTP (formulaire de contact)

| Élément | Description | Statut |
|---|---|---|
| Service SMTP | Fournisseur d'email (Gmail, Outlook, service tiers) | ⚠️ [À FOURNIR] |
| Adresse d'envoi | Email qui envoie les messages du formulaire | ⚠️ [À FOURNIR] |
| Mot de passe / clé SMTP | Mot de passe d'application ou clé API | ⚠️ [À FOURNIR] |
| Email de réception | Adresse qui reçoit les messages du formulaire | ⚠️ [À FOURNIR] |
| Variables d'environnement | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO_EMAIL` | ⚠️ [À CONFIGURER] |

### 7.2 Domaine & hébergement

| Élément | Description | Statut |
|---|---|---|
| Nom de domaine | ex: `pvs-ongd.org`, `pvs-ongd.cd` | ⚠️ [À FOURNIR] |
| Hébergement | Vercel, Netlify, ou autre | ⚠️ [À DÉCIDER] |
| Certificat SSL | HTTPS (généralement inclus par l'hébergeur) | ⚠️ [À CONFIGURER] |
| Google Analytics (optionnel) | ID de suivi | ⚠️ [À FOURNIR] |
| Google Search Console | Propriété du site | ⚠️ [À CONFIGURER] |

### 7.3 SEO

| Élément | Description | Statut |
|---|---|---|
| Meta title (page d'accueil) | ✅ | "PVS — Agriculture, Élevage & Pisciculture | ONGD ASBL" |
| Meta description (page d'accueil) | ✅ | En place |
| Meta titles par page | ✅ | Chaque page a son `metaTitle` |
| Meta descriptions par page | ✅ | Chaque page a sa `metaDescription` |
| Sitemap.xml | ⚠️ [À GÉNÉRER] | Next.js peut le générer automatiquement |
| Robots.txt | ⚠️ [À CRÉER] | À ajouter dans `app/robots.ts` |
| Open Graph tags | ⚠️ [À AJOUTER] | Pour le partage sur réseaux sociaux |
| Schema.org structured data | ⚠️ [À AJOUTER] | Organization, LocalBusiness |
| Mots-clés cibles | ⚠️ [À DÉFINIR] | Stratégie SEO à définir |

---

## 8. Design system & charte graphique

### 8.1 Couleurs (déjà configurées dans Tailwind)

| Couleur | Rôle | Statut |
|---|---|---|
| `brand` (vert) | Couleur principale — agriculture, nature | ✅ Configurée (50-900) |
| `gold` (or) | Couleur d'accent — CTA, highlights | ✅ Configurée (400-600) |
| `ink` (gris foncé) | Texte principal | ✅ Configurée (500-900) |
| `muted` | Texte secondaire | ✅ Configurée |
| `line` | Bordures, séparateurs | ✅ Configurée |

> ⚠️ [À VÉRIFIER] : Les couleurs actuelles correspondent-elles à la charte graphique officielle de PVS ? Si PVS a un logo avec des couleurs spécifiques, la palette doit être ajustée.

### 8.2 Typographie

| Police | Rôle | Statut |
|---|---|---|
| Fraunces (serif) | Titres, headings | ✅ Configurée |
| Inter (sans-serif) | Corps de texte, UI | ✅ Configurée |

> ⚠️ [À VÉRIFIER] : Ces polices conviennent-elles à l'identité de PVS ?

### 8.3 Composants UI

| Composant | Description | Statut |
|---|---|---|
| Boutons (`.btn`, `.btn-primary`) | Styles de boutons | ✅ En place |
| Cards | Cartes d'activités, de produits | ✅ En place |
| FurrowDivider | Séparateur vague animé | ✅ En place |
| HeroImageCarousel | Carrousel d'images avec crossfade | ✅ En place |
| Navbar avec dropdown | Menu desktop + sidebar mobile | ✅ En place |
| WhatsAppButton | Bouton flottant WhatsApp | ✅ En place |
| Footer | Pied de page 4 colonnes | ✅ En place |
| Icônes SVG | Sprout, Cattle, Fish, Pig, FeedBag, Chevron, Arrow, Social | ✅ En place |

---

## 9. Fonctionnalités à développer / finaliser

| Fonctionnalité | Description | Statut |
|---|---|---|
| **Formulaire de contact** | Route API + Nodemailer configuré | ⚠️ SMTP à configurer |
| **Bouton WhatsApp** | Lien vers WhatsApp | ⚠️ Numéro à remplacer |
| **Recherche (optionnel)** | Barre de recherche de produits | ⚠️ [À DÉCIDER] |
| **Blog / actualités (optionnel)** | Articles d'actualité de PVS | ⚠️ [À DÉCIDER] |
| **Galerie photos (optionnel)** | Galerie dédiée aux photos de l'exploitation | ⚠️ [À DÉCIDER] |
| **Multi-langue (optionnel)** | Français + Anglais | ⚠️ [À DÉCIDER] |
| **E-commerce (optionnel)** | Vente en ligne de produits | ⚠️ [À DÉCIDER] |
| **Newsletter (optionnel)** | Inscription email | ⚠️ [À DÉCIDER] |
| **Carte Google Maps** | Localisation de l'exploitation | ⚠️ [À FOURNIR] adresse + clé API |

---

## 10. Pages légales à créer

| Page | Route | Contenu requis | Statut |
|---|---|---|---|
| Mentions légales | `/mentions-legales` | ASBL, adresse, n° d'enregistrement, directeur de publication, hébergeur | ⚠️ [À CRÉER] |
| Politique de confidentialité | `/confidentialite` | Données collectées, cookies, droits RGPD, durée de conservation | ⚠️ [À CRÉER] |
| CGV (si vente) | `/cgv` | Conditions de vente, livraison, paiement, réclamation | ⚠️ [À CRÉER] |

---

## 11. Checklist finale avant mise en production

- [ ] Remplacer toutes les photos placeholder Unsplash par de vraies photos PVS
- [ ] Remplacer le numéro de téléphone (`+243 900 000 000`)
- [ ] Remplacer le numéro WhatsApp (`https://wa.me/243900000000`)
- [ ] Remplacer l'email (`contact@pvs-ongd.org`)
- [ ] Remplacer l'adresse précise (commune, quartier, rue)
- [ ] Confirmer les horaires d'ouverture
- [ ] Fournir les URLs des réseaux sociaux (Facebook, Instagram, LinkedIn)
- [ ] Fournir le logo vectoriel (SVG)
- [ ] Fournir le favicon
- [ ] Confirmer ou corriger tous les prix des produits
- [ ] Configurer le service SMTP pour le formulaire de contact
- [ ] Créer les pages Mentions légales et Politique de confidentialité
- [ ] Acheter / configurer le nom de domaine
- [ ] Choisir l'hébergeur et déployer
- [ ] Configurer Google Analytics (optionnel)
- [ ] Générer sitemap.xml et robots.txt
- [ ] Ajouter les balises Open Graph pour le partage réseaux sociaux
- [ ] Ajouter Schema.org structured data
- [ ] Vérifier la conformité RGPD (bannière cookies si analytics)
- [ ] Tester le formulaire de contact en production
- [ ] Tester l'affichage sur mobile, tablette et desktop
- [ ] Valider l'accessibilité (contrastes, navigation clavier, ARIA)

---

## 12. Structure du projet (référence)

```
PVS-Agriculture/
├── app/
│   ├── a-propos/page.tsx
│   ├── agriculture/page.tsx
│   ├── api/contact/route.ts
│   ├── contact/page.tsx
│   ├── elevage/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── page.tsx
│   ├── pisciculture/page.tsx
│   ├── porcherie/page.tsx
│   ├── produits-animaux/page.tsx
│   └── tarifs/page.tsx
├── components/
│   ├── layout/
│   │   ├── BrandBadge.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── WhatsAppButton.tsx
│   ├── sections/
│   │   ├── APropos.tsx
│   │   ├── Activites.tsx
│   │   ├── AgricultureFeature.tsx
│   │   ├── Contact.tsx
│   │   ├── Hero.tsx
│   │   ├── HeroImageCarousel.tsx
│   │   └── whyus.tsx
│   └── ui/
│       ├── FurrowDivider.tsx
│       └── icons.tsx
├── lib/
│   ├── content.ts      ← Tout le contenu textuel du site
│   └── types.ts        ← Types TypeScript pour le contenu
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

*Document généré le 02/09/2026 — à mettre à jour au fur et à mesure de la réception des éléments.*
