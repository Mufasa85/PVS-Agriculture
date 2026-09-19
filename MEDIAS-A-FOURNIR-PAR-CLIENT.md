# 📸 PVS ONGD ASBL — Médias & textes à fournir par le propriétaire du site

> **Document à transmettre au propriétaire du site (PVS ONGD ASBL)**
>
> Ce document recense **tous les éléments visuels (images) et textes** qui sont actuellement en **placeholders** sur le site web et qui doivent être remplacés par les contenus réels de PVS ONGD ASBL (photos de l'exploitation, vrais textes validés, etc.).
>
> ⚠️ **Important** : les images actuellement sur le site sont des photos **génériques téléchargées depuis Unsplash** (banque d'images libres de droits). Elles servent uniquement de **maquettes provisoires** pour visualiser le rendu. Elles devront être remplacées par de **vraies photos de l'exploitation PVS** avant la mise en production.

---

## 📑 Table des matières

1. [Spécifications techniques des images](#1-spécifications-techniques-des-images)
2. [Procédure de fourniture des fichiers](#2-procédure-de-fourniture-des-fichiers)
3. [Images à fournir — Page d'accueil](#3-images-à-fournir--page-daccueil-)
4. [Images à fournir — Page Agriculture](#4-images-à-fournir--page-agriculture-agriculture)
5. [Images à fournir — Page Élevage](#5-images-à-fournir--page-élevage-elevage)
6. [Images à fournir — Page Pisciculture](#6-images-à-fournir--page-pisciculture-pisciculture)
7. [Images à fournir — Page Porcherie](#7-images-à-fournir--page-porcherie-porcherie)
8. [Images à fournir — Page Produits pour animaux](#8-images-à-fournir--page-produits-pour-animaux-produits-animaux)
9. [Images à fournir — Page À propos](#9-images-à-fournir--page-à-propos-a-propos)
10. [Images à fournir — Page Tarifs](#10-images-à-fournir--page-tarifs-tarifs)
11. [Images à fournir — Page Contact](#11-images-à-fournir--page-contact-contact)
12. [Images à fournir — Espace administrateur](#12-images-à-fournir--espace-administrateur)
13. [Textes du Hero — Page d'accueil](#13-textes-du-hero--page-daccueil)
14. [Textes du Hero — autres pages](#14-textes-du-hero--autres-pages)
15. [Résumé global — Tableau récapitulatif](#15-résumé-global--tableau-récapitulatif)

---

## 1. Spécifications techniques des images

| Critère | Spécification |
|---|---|
| **Format** | `.jpg` (recommandé pour les photos) ou `.webp` (encore mieux pour le web) |
| **Mode colorimétrique** | sRGB (standard web) |
| **Orientation** | Conserver celle indiquée dans le tableau ci-dessous pour chaque image |
| **Poids max par fichier** | 500 Ko idéalement (≤ 1 Mo maximum). Le site compresse et sert en plusieurs tailles automatiquement (Next/Image). |
| **Noms de fichiers** | Pas d'accents, pas d'espaces. Préférer le format : `pvs-<categorie>-<description>.jpg` (ex : `pvs-agriculture-champ-mont-ngafula.jpg`) |
| **Texte alternatif (alt)** | Pour chaque photo fournie, merci d'indiquer une **courte description** (5-10 mots) qui sera utilisée comme `alt` (accessibilité + SEO). Ex : « Rangées de cultures maraîchères à Mont Ngafula ». |
| **Droits d'usage** | Vous devez disposer des droits sur les photos (photos prises par vous/votre équipe, ou photos libres de droits). Aucune photo protégée par un tiers ne doit être envoyée. |

---

## 2. Procédure de fourniture des fichiers

**Option A — Envoi par e-mail / WeTransfer (recommandé pour un petit nombre d'images)**

1. Regrouper toutes les photos dans un dossier compressé (`.zip`) nommé : `pvs-photos-site-2026.zip`
2. Joindre un fichier `correspondance.txt` listant pour chaque photo :
   - le **nom du fichier** envoyé
   - le **nom du placeholder** à remplacer (colonne « Nom du fichier placeholder » des tableaux ci-dessous)
   - le **texte alternatif** proposé (colonne « Texte alternatif actuel »)
3. Envoyer à l'adresse de l'équipe de développement.

**Option B — Mise à disposition via l'interface d'administration**

L'espace admin permet d'ores et déjà d'uploader des photos de produits. Pour les autres sections (hero, hero de chaque page, etc.), merci de privilégier l'option A.

**Option C — Mise à disposition via Google Drive / OneDrive**

Partager un lien de dossier avec téléchargement autorisé. Indiquer dans le mail la correspondance entre fichiers envoyés et placeholders à remplacer.

---


## 3. Images à fournir — Page d'accueil (`/`)

Cette page est la plus consultée. Elle comporte **8 images** distinctes à remplacer.

### 3.1 Carrousel d'images du Hero (page d'accueil)

Le hero affiche un **carrousel de 5 photos** qui alternent en fondu toutes les 4,5 secondes.

| # | Nom du fichier placeholder | Emplacement dans la page | Dimensions actuelles du placeholder | Résolution minimale recommandée | Format | Sujet attendu |
|---|---|---|---|---|---|---|
| 1 | `photo-1500595046743-cd271d694d30.jpg` | Hero — slide 1 (affichée en premier) | **900 × 598 px** (paysage) | **1600 × 1067 px** | JPG paysage | Vue d'ensemble de l'exploitation / champ cultivé — photo principale, lumineuse, qui donne envie de découvrir l'organisation |
| 2 | `photo-1500382017468-9049fed747ef.jpg` | Hero — slide 2 | **1600 × 900 px** (paysage) | **1600 × 900 px** | JPG paysage | Vaches au pâturage, scène d'élevage en plein air |
| 3 | `photo-1529313780224-1a12b68bed16.jpg` | Hero — slide 3 | **2048 × 3072 px** (portrait) | **1200 × 1800 px** | JPG portrait | Plate-bande de légumes cultivés (vue de près ou en plongée) |
| 4 | `photo-1516467508483-a7212febe31a.jpg` | Hero — slide 4 | **1600 × 1064 px** (paysage) | **1600 × 1064 px** | JPG paysage | Porcherie intérieure — enclos propres, porcs en bonne santé |
| 5 | `photo-1515735543535-12664d2453f8.jpg` | Hero — slide 5 | **3186 × 2124 px** (paysage) | **1920 × 1280 px** | JPG paysage | Étang de pisciculture — vue d'ensemble avec eau propre |

> 💡 Toutes les photos du carrousel doivent avoir **la même orientation (paysage de préférence)** pour un rendu fluide. Éviter les portraits pour cette section, sauf si vous souhaitez un fort impact visuel (auquel cas, redimensionner en conséquence).

### 3.2 Section « Agriculture, au centre de notre engagement » (page d'accueil)

| # | Nom du fichier placeholder | Emplacement | Dimensions actuelles | Résolution minimale recommandée | Format | Sujet attendu |
|---|---|---|---|---|---|---|
| 6 | `photo-1515150144380-bca9f1650ed9.jpg` | Section agriculture — illustration principale | **3840 × 5760 px** (portrait, très grand) | **1200 × 1800 px** | JPG portrait | Rangées de cultures maraîchères — vue plongeante ou en perspective, montrant l'organisation des plates-bandes |

### 3.3 Section « Nos activités » (5 cartes d'activité, page d'accueil)

Chaque carte affiche une photo illustrative en haut.

| # | Nom du fichier placeholder | Carte | Dimensions actuelles | Résolution minimale recommandée | Format | Sujet attendu |
|---|---|---|---|---|---|---|
| 7 | `photo-1500382017468-9049fed747ef.jpg` *(à dupliquer ou fournir 1 autre photo d'agriculture)* | Carte « Agriculture » | **1600 × 900 px** (paysage) | **1200 × 800 px** | JPG paysage | Champ cultivé / plantation en croissance |
| 8 | `photo-1500534623283-312aade485b7.jpg` | Carte « Élevage » | **700 × 467 px** (paysage) | **1200 × 800 px** | JPG paysage | Troupeau de bétail au pâturage |
| 9 | `photo-1544551763-46a013bb70d5.jpg` | Carte « Pisciculture » | **700 × 467 px** (paysage) | **1200 × 800 px** | JPG paysage | Étang piscicole — vue d'ensemble |
| 10 | `photo-1516467508483-a7212febe31a.jpg` *(à dupliquer ou fournir 1 autre photo de porcherie)* | Carte « Porcherie » | **1600 × 1064 px** (paysage) | **1200 × 800 px** | JPG paysage | Porcherie intérieure ou porcs en enclos |
| 11 | `photo-1574943320219-553eb213f72d.jpg` | Carte « Produits & aliments pour animaux » | **700 × 514 px** (paysage) | **1200 × 800 px** | JPG paysage | Sacs d'aliments / produits pour animaux empilés |

### 3.4 Section « À propos » (page d'accueil — 2 images côte à côte)

| # | Nom du fichier placeholder | Emplacement | Dimensions actuelles | Résolution minimale recommandée | Format | Sujet attendu |
|---|---|---|---|---|---|---|
| 12 | `photo-1625246333195-78d9c38ad449.jpg` | Section À propos — image 1 | **1200 × 800 px** (paysage) | **1200 × 800 px** | JPG paysage | Vue d'ensemble du site / équipe au travail |
| 13 | `photo-1593113598332-cd288d649433.jpg` | Section À propos — image 2 | **500 × 333 px** (paysage, trop petit) | **1200 × 800 px** | JPG paysage | Travailleur / membre de l'équipe en action sur le terrain |

---

## 4. Images à fournir — Page Agriculture (`/agriculture`)

| # | Nom du fichier placeholder | Emplacement | Dimensions actuelles | Résolution minimale recommandée | Format | Sujet attendu |
|---|---|---|---|---|---|---|
| 14 | `photo-1500382017468-9049fed747ef.jpg` | Hero de la page Agriculture | **1600 × 900 px** (paysage) | **1920 × 1080 px** | JPG paysage | Champ agricole de PVS à Mont Ngafula — vue d'ensemble, lumière naturelle |
| 15 | `photo-1515150144380-bca9f1650ed9.jpg` | Section « Notre exploitation » — image principale | **3840 × 5760 px** (portrait) | **1200 × 1800 px** | JPG portrait | Plates-bandes alignées, montrant la rigueur de l'organisation |
| 16 | `photo-1576045057995-568f588f82fb.jpg` | Fiche produit « Épinard » | **700 × 700 px** (carré) | **1000 × 1000 px** | JPG carré | Plate-bande d'épinards (vue de près) |
| 17 | `photo-1523348837708-15d4a09cfac2.jpg` | Fiche produit « Oseille » | **700 × 467 px** (paysage) | **1000 × 1000 px** | JPG carré | Plate-bande d'oseille |
| 18 | `photo-1500382017468-9049fed747ef.jpg` *(doublon possible, à remplacer par une vraie photo de nduda si possible)* | Fiche produit « Nduda » | **1600 × 900 px** (paysage) | **1000 × 1000 px** | JPG carré | Plate-bande de nduda |

---

## 5. Images à fournir — Page Élevage (`/elevage`)

| # | Nom du fichier placeholder | Emplacement | Dimensions actuelles | Résolution minimale recommandée | Format | Sujet attendu |
|---|---|---|---|---|---|---|
| 19 | `photo-1600428853876-6b57d20b9da6.jpg` | Hero de la page Élevage | **900 × 598 px** (paysage, trop petit) | **1920 × 1280 px** | JPG paysage | Vaches paissant dans un pâturage verdoyant |
| 20 | `photo-1587213128862-80345e23a71a.jpg` | Galerie « Notre cheptel en images » — slide 1 « Porcs » | **3024 × 4032 px** (portrait) | **1200 × 1600 px** | JPG portrait | Porcs dans leurs enclos |
| 21 | `photo-1548550023-2bdb3c5beed7.jpg` | Galerie — slide 2 « Volailles » | **1200 × 1800 px** (portrait) | **1200 × 1600 px** | JPG portrait | Poules en élevage libre |
| 22 | `photo-1564492300010-3a6a3f4e1e1e.jpg` | Galerie — slide 3 « Caprins » | **1600 × 1064 px** (paysage) | **1200 × 1600 px** | JPG portrait ou paysage | Chèvres dans une étable |
| 23 | `photo-1648141499246-97a0eb56c2fd.jpg` | Galerie — slide 4 « Œufs frais » | **3024 × 4032 px** (portrait) | **1200 × 1600 px** | JPG portrait | Œufs frais (en plateau, en panier, etc.) |
| 24 | `photo-1543374996-3a5d6b3e5e4e.jpg` | Galerie — slide 5 « Suivi vétérinaire » | **3024 × 4032 px** (portrait) | **1200 × 1600 px** | JPG portrait | Soignant / vétérinaire s'occupant d'un animal |
| 25 | `photo-1500382017468-9049fed747ef.jpg` | Section « Notre cheptel » — image 1 (compétences) | **1600 × 900 px** | **1200 × 800 px** | JPG paysage | Troupeau bovin au pâturage |
| 26 | `photo-1500534623283-312aade485b7.jpg` | Section « Notre cheptel » — image 2 | **700 × 467 px** | **1200 × 800 px** | JPG paysage | Élevage bovin / scènes de pâturage |
| 27 | `photo-1535473895227-bdecb20fb373.jpg` | Section « Notre cheptel » — image 3 | **800 × 524 px** | **1200 × 800 px** | JPG paysage | Élevage piscicole (si transversal, sinon vue générale) |
| 28 | `photo-1516467508483-a7212febe31a.jpg` | Section « Notre cheptel » — image 4 | **1600 × 1064 px** | **1200 × 800 px** | JPG paysage | Porcs en enclos |
| 29 | `photo-1604908554049-29bf08f5d1a9.jpg` | Section « Notre cheptel » — image 5 | **500 × 333 px** (trop petit) | **1200 × 800 px** | JPG paysage | Aliments / nutrition animale |
| 30 | `photo-1593113598332-cd288d649433.jpg` | Section « Nos valeurs » (carte avec image, page À propos) | **500 × 333 px** | **1200 × 800 px** | JPG paysage | Équipe au travail |

---


## 6. Images à fournir — Page Pisciculture (`/pisciculture`)

| # | Nom du fichier placeholder | Emplacement | Dimensions actuelles | Résolution minimale recommandée | Format | Sujet attendu |
|---|---|---|---|---|---|---|
| 31 | `photo-1535473895227-bdecb20fb373.jpg` | Hero de la page Pisciculture | **800 × 524 px** (paysage, trop petit) | **1920 × 1280 px** | JPG paysage | Étang de pisciculture — vue d'ensemble avec eau propre |
| 32 | `photo-1559473242-3740c6c65e1e.jpg` | Section « Notre exploitation piscicole » — image principale | **800 × 524 px** (paysage, trop petit) | **1200 × 800 px** | JPG paysage | Bassin d'élevage de poissons |
| 33 | `photo-1574781330855-d0db8cc6a79c.jpg` | Fiche produit « Tilapia » | **800 × 524 px** | **1000 × 1000 px** | JPG carré | Tilapia (poisson entier ou en gros plan) |
| 34 | `photo-1574781330855-d0db8cc6a79c.jpg` *(doublon possible)* | Fiche produit « Poisson-chat » | **800 × 524 px** | **1000 × 1000 px** | JPG carré | Poisson-chat (poisson entier ou en gros plan) |

---

## 7. Images à fournir — Page Porcherie (`/porcherie`)

| # | Nom du fichier placeholder | Emplacement | Dimensions actuelles | Résolution minimale recommandée | Format | Sujet attendu |
|---|---|---|---|---|---|---|
| 35 | `photo-1516467508483-a7212febe31a.jpg` | Hero de la page Porcherie | **1600 × 1064 px** (paysage) | **1920 × 1280 px** | JPG paysage | Porcherie moderne et propre — vue d'ensemble |
| 36 | `photo-1516467508483-a7212febe31a.jpg` *(doublon)* | Section « Notre porcherie » — image principale | **1600 × 1064 px** | **1200 × 800 px** | JPG paysage | Porcs dans un enclos propre |
| 37 | `photo-1516467508483-a7212febe31a.jpg` *(doublon)* | Fiche produit « Porcs charcutiers » | **1600 × 1064 px** | **1000 × 1000 px** | JPG carré | Porcs charcutiers en enclos |
| 38 | `photo-1516467508483-a7212febe31a.jpg` *(doublon)* | Fiche produit « Porcelets » | **1600 × 1064 px** | **1000 × 1000 px** | JPG carré | Porcelets en bonne santé |

> 💡 Si vous avez plusieurs photos de porcherie (porcs adultes, porcelets, intérieur, extérieur, etc.), merci d'en fournir **plusieurs différentes** plutôt que d'utiliser la même partout.

---

## 8. Images à fournir — Page Produits pour animaux (`/produits-animaux`)

| # | Nom du fichier placeholder | Emplacement | Dimensions actuelles | Résolution minimale recommandée | Format | Sujet attendu |
|---|---|---|---|---|---|---|
| 39 | `photo-1604908554049-29bf08f5d1a9.jpg` | Hero de la page Produits pour animaux | **500 × 333 px** (trop petit) | **1920 × 1280 px** | JPG paysage | Sacs d'aliments pour animaux empilés — vue d'ensemble |
| 40 | `photo-1589923188651-268a976c1753.jpg` | Section « Nos produits » — image principale | **500 × 333 px** (trop petit) | **1200 × 800 px** | JPG paysage | Granulés d'aliments pour animaux (gros plan ou en sac) |
| 41 | `photo-1604908554049-29bf08f5d1a9.jpg` *(doublon)* | Fiche « Aliment pour bovins » | **500 × 333 px** | **1000 × 1000 px** | JPG carré | Sac d'aliment pour bovins |
| 42 | `photo-1589923188651-268a976c1753.jpg` *(doublon)* | Fiche « Aliment pour caprins » | **500 × 333 px** | **1000 × 1000 px** | JPG carré | Sac / granulés d'aliment pour caprins |

---


## 9. Images à fournir — Page À propos (`/a-propos`)

| # | Nom du fichier placeholder | Emplacement | Dimensions actuelles | Résolution minimale recommandée | Format | Sujet attendu |
|---|---|---|---|---|---|---|
| 43 | `photo-1500595046743-cd271d694d30.jpg` | Hero de la page À propos (image de fond) | **900 × 598 px** | **2400 × 1600 px** | JPG paysage | Vue d'ensemble du site / équipe / activité — image forte, impactante |
| 44 | `photo-1625246333195-78d9c38ad449.jpg` | Section « Vision » — image 1 | **1200 × 800 px** | **1200 × 800 px** | JPG paysage | Vue d'ensemble de l'exploitation |
| 45 | `photo-1593113598332-cd288d649433.jpg` | Section « Vision » — image 2 | **500 × 333 px** | **1200 × 800 px** | JPG paysage | Travailleur agricole / équipe au champ |
| 46 | `photo-1500382017468-9049fed747ef.jpg` | Section « Expertise » — image 1 | **1600 × 900 px** | **1200 × 800 px** | JPG paysage | Culture / champ |
| 47 | `photo-1500534623283-312aade485b7.jpg` | Section « Expertise » — image 2 | **700 × 467 px** | **1200 × 800 px** | JPG paysage | Élevage / troupeau |
| 48 | `photo-1535473895227-bdecb20fb373.jpg` | Section « Expertise » — image 3 | **800 × 524 px** | **1200 × 800 px** | JPG paysage | Pisciculture / étang |
| 49 | `photo-1516467508483-a7212febe31a.jpg` | Section « Expertise » — image 4 | **1600 × 1064 px** | **1200 × 800 px** | JPG paysage | Porcherie / porcs |
| 50 | `photo-1604908554049-29bf08f5d1a9.jpg` | Section « Expertise » — image 5 | **500 × 333 px** | **1200 × 800 px** | JPG paysage | Produits pour animaux |
| 51 | `photo-1593113598332-cd288d649433.jpg` | Section « Valeurs » (carte avec image) | **500 × 333 px** | **1200 × 800 px** | JPG paysage | Équipe au travail |

---

## 10. Images à fournir — Page Tarifs (`/tarifs`)

| # | Nom du fichier placeholder | Emplacement | Dimensions actuelles | Résolution minimale recommandée | Format | Sujet attendu |
|---|---|---|---|---|---|---|
| 52 | `photo-1600428853876-6b57d20b9da6.jpg` | Fiche produit « Bœuf adulte » | **900 × 598 px** | **1000 × 1000 px** | JPG carré | Bœuf au pâturage |
| 53 | `photo-1500534623283-312aade485b7.jpg` | Fiche produit « Vache laitière » | **700 × 467 px** | **1000 × 1000 px** | JPG carré | Vache laitière |
| 54 | `photo-1570042225831-d1fa9b5c9b29.jpg` | Fiche produit « Génisse » | **600 × 450 px** | **1000 × 1000 px** | JPG carré | Génisse |
| 55 | `photo-1564492300010-3a6a3f4e1e1e.jpg` | Fiche produit « Chèvre » | **1600 × 1064 px** | **1000 × 1000 px** | JPG carré | Chèvre |
| 56 | `photo-1484557985045-edf25e08da73.jpg` | Fiche produit « Bouc reproducteur » | **600 × 450 px** | **1000 × 1000 px** | JPG carré | Bouc reproducteur |
| 57 | `photo-1533418436585-5c2c24e0c5dc.jpg` | Fiche produit « Chevreau » | **3186 × 2124 px** | **1000 × 1000 px** | JPG carré | Chevreau |
| 58 | `photo-1535473895227-bdecb20fb373.jpg` | Fiche produit « Tilapia » | **800 × 524 px** | **1000 × 1000 px** | JPG carré | Tilapia |
| 59 | `photo-1574781330855-d0db8cc6a79c.jpg` | Fiche produit « Poisson-chat » | **800 × 524 px** | **1000 × 1000 px** | JPG carré | Poisson-chat |
| 60 | `photo-1516467508483-a7212febe31a.jpg` | Fiche produit « Poulet fermier » | **1600 × 1064 px** | **1000 × 1000 px** | JPG carré | Poulet fermier |
| 61 | `photo-1548559934-4e3a06e1d434.jpg` | Fiche produit « Poules pondeuses » | **1200 × 1800 px** (portrait) | **1000 × 1000 px** | JPG carré | Poule pondeuse |
| 62 | `photo-1582722872445-44dc5f7e3c8f.jpg` | Fiche produit « Œufs frais » | **600 × 400 px** | **1000 × 1000 px** | JPG carré | Œufs frais (en plateau, en panier) |
| 63 | `photo-1604908554049-29bf08f5d1a9.jpg` | Fiche produit « Aliment poulet » | **500 × 333 px** | **1000 × 1000 px** | JPG carré | Sac d'aliment pour volailles |
| 64 | `photo-1604908554049-29bf08f5d1a9.jpg` *(doublon)* | Fiche produit « Aliment bovin » | **500 × 333 px** | **1000 × 1000 px** | JPG carré | Sac d'aliment pour bovins |
| 65 | `photo-1604908554049-29bf08f5d1a9.jpg` *(doublon)* | Fiche produit « Aliment poisson » | **500 × 333 px** | **1000 × 1000 px** | JPG carré | Granulés pour poissons |

---

## 11. Images à fournir — Page Contact (`/contact`)

| # | Nom du fichier placeholder | Emplacement | Dimensions actuelles | Résolution minimale recommandée | Format | Sujet attendu |
|---|---|---|---|---|---|---|
| 66 | `photo-1500595046743-cd271d694d30.jpg` | Hero de la page Contact (image de fond plein écran) | **900 × 598 px** | **2400 × 1600 px** | JPG paysage | Vue d'ensemble du site / équipe / paysage — image impactante servant de fond |

---

## 12. Images à fournir — Espace administrateur (`/admin/login` et `/admin/forgot-password`)

| # | Nom du fichier placeholder | Emplacement | Dimensions actuelles | Résolution minimale recommandée | Format | Sujet attendu |
|---|---|---|---|---|---|---|
| 67 | `photo-1492496913980-501348b61469.jpg` | Panneau latéral — page de connexion admin (`/admin/login`) | **1200 × 1800 px** (portrait) | **1200 × 1800 px** | JPG portrait | Mains tenant de la terre fertile / symbole du travail agricole — visuel « corporate » sobre |
| 68 | `photo-1492496913980-501348b61469.jpg` *(doublon)* | Panneau latéral — page mot de passe oublié (`/admin/forgot-password`) | **1200 × 1800 px** (portrait) | **1200 × 1800 px** | JPG portrait | Mêmes spécifications que ci-dessus |

---


## 13. Textes du Hero — Page d'accueil

Voici les **textes actuellement en place** sur le hero de la page d'accueil. Merci de les **valider** ou de nous transmettre une version corrigée :

| Élément | Texte actuel | À valider / remplacer par |
|---|---|---|
| **Eyebrow** (au-dessus du titre) | `Agriculture · Élevage · Pisciculture` | ☐ Validé / ☐ À remplacer par : `__________________` |
| **Titre principal** (3 lignes) | Ligne 1 : `Cultiver la terre,`<br>Ligne 2 : `faire grandir l'élevage,`<br>Ligne 3 : `nourrir l'avenir.` | ☐ Validé / ☐ À remplacer par : `__________________` |
| **Mot en emphase** (surbrillance visuelle dans le titre) | `l'élevage` (dans « faire grandir l'élevage ») | ☐ Validé / ☐ À remplacer par : `__________________` |
| **Paragraphe (sous le titre)** | `PVS ONGD ASBL accompagne la production agricole, l'élevage, la pisciculture et la porcherie à Kinshasa, avec des produits et aliments pour animaux de qualité. Une organisation locale au service d'une production durable.` | ☐ Validé / ☐ À remplacer par : `__________________` |
| **CTA primaire** (bouton principal) | Libellé : `Nous contacter` → Lien : `#contact` | ☐ Validé / ☐ Nouveau libellé : `__________________` / ☐ Nouveau lien : `__________________` |
| **CTA secondaire** (bouton secondaire) | Libellé : `Découvrir nos activités` → Lien : `#activites` | ☐ Validé / ☐ Nouveau libellé : `__________________` / ☐ Nouveau lien : `__________________` |
| **Statistique 1** | Valeur : `05` / Libellé : `Domaines d'activité` | ☐ Validé / ☐ À remplacer par : `__________________` |
| **Statistique 2** | Valeur : `100%` / Libellé : `Ancrage local` | ☐ Validé / ☐ À remplacer par : `__________________` |
| **Statistique 3** | Valeur : `ONGD` / Libellé : `Engagement durable` | ☐ Validé / ☐ À remplacer par : `__________________` |
| **Badge flottant** (en haut à droite de l'image) | `🌾 Agriculture d'abord` | ☐ Validé / ☐ Nouveau texte : `__________________` |
| **Carte flottante** (en bas à gauche) | Titre : `Production durable` / Sous-titre : `Une agriculture responsable, ancrée localement` | ☐ Validé / ☐ À remplacer par : `__________________` |

---


## 14. Textes du Hero — autres pages

### 14.1 Hero — Page Agriculture (`/agriculture`)

| Élément | Texte actuel | À valider |
|---|---|---|
| Eyebrow | `Notre cœur de métier` | ☐ Validé / ☐ À remplacer |
| Titre (2 lignes) | Ligne 1 : `L'agriculture, au centre` / Ligne 2 : `de notre engagement.` | ☐ Validé / ☐ À remplacer |
| Mot en emphase | `engagement` | ☐ Validé / ☐ À remplacer |
| Paragraphe | `Sur nos parcelles de Mont Ngafula, nous cultivons des légumes-feuilles adaptés au climat de Kinshasa. Chaque plate-bande est suivie individuellement, du semis à la récolte, pour une production saine et traçable.` | ☐ Validé / ☐ À remplacer |

### 14.2 Hero — Page Élevage (`/elevage`)

| Élément | Texte actuel | À valider |
|---|---|---|
| Eyebrow | `Notre savoir-faire` | ☐ Validé / ☐ À remplacer |
| Titre (2 lignes) | Ligne 1 : `Un élevage suivi` / Ligne 2 : `avec soin et rigueur.` | ☐ Validé / ☐ À remplacer |
| Mot en emphase | `soin` | ☐ Validé / ☐ À remplacer |
| Paragraphe | `L'élevage est l'un des piliers de PVS ONGD ASBL. Nous assurons un suivi attentif du cheptel, avec des pratiques d'hygiène strictes et une alimentation contrôlée, pour garantir des produits sains et une croissance harmonieuse des animaux.` | ☐ Validé / ☐ À remplacer |

### 14.3 Hero — Page Pisciculture (`/pisciculture`)

| Élément | Texte actuel | À valider |
|---|---|---|
| Eyebrow | `Notre savoir-faire` | ☐ Validé / ☐ À remplacer |
| Titre (3 lignes) | Ligne 1 : `Une pisciculture` / Ligne 2 : `maîtrisée en étangs` / Ligne 3 : `contrôlés.` | ☐ Validé / ☐ À remplacer |
| Mot en emphase | `maîtrisée` | ☐ Validé / ☐ À remplacer |
| Paragraphe | `La pisciculture est l'un de nos métiers de cœur. Nous élevons des poissons en étangs contrôlés, avec une gestion rigoureuse de la qualité de l'eau, de l'alimentation et du suivi sanitaire, pour une production saine et durable.` | ☐ Validé / ☐ À remplacer |

### 14.4 Hero — Page Porcherie (`/porcherie`)

| Élément | Texte actuel | À valider |
|---|---|---|
| Eyebrow | `Élevage porcin` | ☐ Validé / ☐ À remplacer |
| Titre (3 lignes) | Ligne 1 : `Des porcs sains, élevés` / Ligne 2 : `dans les meilleures` / Ligne 3 : `conditions.` | ☐ Validé / ☐ À remplacer |
| Mot en emphase | `sains` | ☐ Validé / ☐ À remplacer |
| Paragraphe | `PVS ONGD ASBL exploite une porcherie moderne à Kinshasa, où hygiène, alimentation contrôlée et bien-être animal se conjuguent pour produire une viande de qualité. Ne cherchez plus : commandez dès maintenant vos porcs ou lancez votre propre élevage avec notre accompagnement.` | ☐ Validé / ☐ À remplacer |

### 14.5 Hero — Page Produits pour animaux (`/produits-animaux`)

| Élément | Texte actuel | À valider |
|---|---|---|
| Eyebrow | `Nos produits` | ☐ Validé / ☐ À remplacer |
| Titre (3 lignes) | Ligne 1 : `Une alimentation` / Ligne 2 : `saine et adaptée` / Ligne 3 : `pour vos animaux.` | ☐ Validé / ☐ À remplacer |
| Mot en emphase | `saine` | ☐ Validé / ☐ À remplacer |
| Paragraphe | `PVS ONGD ASBL propose une gamme de produits pour animaux pensée pour répondre aux besoins nutritionnels de vos bovins, caprins, volailles et poissons. Qualité, traçabilité et prix justes : tout pour nourrir au mieux votre élevage.` | ☐ Validé / ☐ À remplacer |

### 14.6 Hero — Page À propos (`/a-propos`)

| Élément | Texte actuel | À valider |
|---|---|---|
| Eyebrow | (à confirmer — voir `lib/content.ts` → `aproposPage.hero.eyebrow`) | ☐ Validé / ☐ À remplacer |
| Titre (multi-lignes) | (à confirmer — voir `lib/content.ts` → `aproposPage.hero.titleLines`) | ☐ Validé / ☐ À remplacer |
| Mot en emphase | (à confirmer — voir `lib/content.ts` → `aproposPage.hero.titleEmphasis`) | ☐ Validé / ☐ À remplacer |
| Paragraphe | (à confirmer — voir `lib/content.ts` → `aproposPage.hero.paragraph`) | ☐ Validé / ☐ À remplacer |

### 14.7 Hero — Page Tarifs (`/tarifs`)

| Élément | Texte actuel | À valider |
|---|---|---|
| Eyebrow | `Nos tarifs` | ☐ Validé / ☐ À remplacer |
| Titre (2 lignes) | Ligne 1 : `Un aperçu clair` / Ligne 2 : `de nos prix.` | ☐ Validé / ☐ À remplacer |
| Mot en emphase | `prix` | ☐ Validé / ☐ À remplacer |
| Paragraphe | `Consultez les tarifs de nos produits par catégorie. Sélectionnez une catégorie pour filtrer les prix et trouver rapidement ce qui vous intéresse. Les prix sont indicatifs et peuvent varier selon la disponibilité et la saison.` | ☐ Validé / ☐ À remplacer |

### 14.8 Hero — Page Contact (`/contact`)

| Élément | Texte actuel | À valider |
|---|---|---|
| Eyebrow | `Contact` | ☐ Validé / ☐ À remplacer |
| Titre | `Parlons de votre projet` | ☐ Validé / ☐ À remplacer |
| Sous-titre | `Une question, une demande de devis ou un besoin en agriculture, élevage ou pisciculture ? Notre équipe vous répond rapidement.` | ☐ Validé / ☐ À remplacer |

---


## 15. Résumé global — Tableau récapitulatif

| Catégorie | Nombre d'images placeholder |
|---|---|
| Page d'accueil (`/`) | **13 images** |
| Page Agriculture (`/agriculture`) | **5 images** |
| Page Élevage (`/elevage`) | **12 images** |
| Page Pisciculture (`/pisciculture`) | **4 images** |
| Page Porcherie (`/porcherie`) | **4 images** |
| Page Produits pour animaux (`/produits-animaux`) | **4 images** |
| Page À propos (`/a-propos`) | **9 images** |
| Page Tarifs (`/tarifs`) | **14 images** |
| Page Contact (`/contact`) | **1 image** |
| Espace admin (`/admin/login`, `/admin/forgot-password`) | **1 image** (utilisée 2 fois) |
| **TOTAL** | **~67 emplacements d'images** (certains utilisent la même photo plusieurs fois) |

> 💡 Si plusieurs sections utilisent la même photo (par ex. la photo de porcherie sert à la fois sur la page d'accueil, sur la page Porcherie, et sur la page Tarifs), vous pouvez fournir **une seule photo** qui sera réutilisée. Mais nous recommandons tout de même de fournir des photos **différentes** pour chaque section afin d'enrichir visuellement le site.

---

## 📌 Notes complémentaires

1. **Droits à l'image** : si des personnes sont reconnaissables sur vos photos (employés, partenaires, clients), merci de vous assurer qu'elles ont consenti à l'utilisation de leur image sur le site web.

2. **Image Open Graph (réseaux sociaux)** : une image dédiée aux partages sur Facebook/LinkedIn/WhatsApp est automatiquement générée depuis la première photo du carrousel du hero (dimensions actuelles : **1200 × 630 px**). Aucune action spécifique requise — elle sera mise à jour en même temps que les photos du hero.

3. **Performance** : le site utilise la technologie Next/Image qui compresse et redimensionne automatiquement les images. Vous n'avez pas besoin de fournir plusieurs tailles : **une seule image en haute qualité** suffit.

4. **Calendrier** : dès réception de l'ensemble des photos et textes validés, l'intégration peut être réalisée sous **3 à 5 jours ouvrés**.

5. **Textes** : tous les textes du site (au-delà du hero) sont également à valider. Le document `DOCUMENTATION-REQUIREMENTS.md` (présent à la racine du projet) recense l'ensemble des contenus textuels à fournir ou valider (coordonnées de contact, descriptions d'activités, mentions légales, etc.).

6. **Image de marque & logo** : si vous disposez d'un logo vectoriel (.svg) de PVS ONGD ASBL, merci de le fournir en complément — il remplacera le composant `BrandBadge` actuellement utilisé dans la navbar et le panneau admin.

---

*Document généré le 19/09/2026 — à mettre à jour au fur et à mesure de la réception des éléments.*

*Pour toute question, contactez l'équipe de développement ArcaneCore.*

