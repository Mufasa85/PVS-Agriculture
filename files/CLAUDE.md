# PVS ONGD — Site vitrine (migration HTML/CSS/JS → Next.js)

## Contexte

Ce projet est la migration vers Next.js d'une maquette HTML/CSS/JS statique
déjà **réalisée et validée par le client** (PVS ONGD). La maquette de
référence reste consultable ici :

👉 https://mufasa85.github.io/PVS-Agriculture/

**Règle d'or : le contenu, la structure et le design de cette maquette sont
la source de vérité.** Le rôle de cette migration est de reproduire
fidèlement l'existant dans une architecture Next.js propre et évolutive —
pas de le réinventer. Toute section, texte ou couleur non présent dans la
maquette d'origine ne doit pas être ajouté sans validation explicite de
Cesar (ArcaneCore).

Devis validé : `ARCANECORE-DEVIS-2026-PVS01` — 750 USD, périmètre figé au
contenu de la maquette. Toute fonctionnalité supplémentaire (ex. CMS, back-
office de tarifs dynamiques) sort du périmètre actuel et doit être signalée,
pas développée d'initiative.

## Stack imposée

- **Next.js 14+ (App Router)** + **TypeScript**
- **Tailwind CSS** pour le style (pas de CSS-in-JS, pas de styled-components)
- **Framer Motion** pour les animations d'apparition / transitions de survol
- **GSAP + `@gsap/react` (`useGSAP`)** uniquement si un effet de scroll
  (parallax, reveal séquencé) constaté dans la maquette originale n'est pas
  raisonnablement faisable avec Framer Motion seul
- **`next/image`** pour toutes les images (jamais de balise `<img>` brute)
- **`next/font`** pour le chargement des polices
- Déploiement cible : Vercel (à confirmer avec Cesar — l'hébergement est
  géré séparément du forfait de développement, voir devis)

## Structure de dossiers attendue

```
app/
  layout.tsx          # <html>, <body>, meta globales, polices
  page.tsx             # Assemble les sections dans l'ordre de la maquette
  globals.css          # Reset + variables Tailwind
components/
  layout/
    Navbar.tsx
    Footer.tsx
    WhatsAppButton.tsx  # Bouton flottant, lien wa.me
  sections/
    Hero.tsx
    AgricultureFeature.tsx   # Bloc "L'agriculture au centre de notre engagement"
    ActivitesGrid.tsx        # Grille des 5 activités
    ActivityCard.tsx
    CtaBanner.tsx             # "Un projet en tête ?"
    APropos.tsx
    PourquoiNousChoisir.tsx
    Contact.tsx               # Coordonnées + formulaire
    ContactForm.tsx
lib/
  content.ts            # Toutes les données textuelles structurées
  types.ts               # Types partagés (Activity, ContactInfo, etc.)
public/
  images/                # Images optimisées (remplacent les URLs Unsplash)
```

## Règles de migration

1. **Contenu** : reprendre le texte exact de `lib/content.ts` (généré à
   partir de la maquette validée). Ne pas paraphraser, ne pas "améliorer"
   le texte sans demande explicite.
2. **Sections** : respecter l'ordre et le découpage de la maquette :
   Accueil (hero) → Bloc Agriculture → Nos activités (5 cartes) → Bandeau
   CTA → À propos → Pourquoi nous choisir → Contact → Footer.
3. **Ancres de navigation** : conserver les identifiants d'ancre existants
   (`#accueil`, `#agriculture`, `#elevage`, `#pisciculture`, `#produits`,
   `#apropos`, `#contact`) pour ne pas casser les liens internes.
4. **Formulaire de contact** : DOIT être fonctionnel en production (la
   version HTML statique ne l'était pas). Avant de coder, confirmer avec
   Cesar le backend choisi (Route Handler Next.js + service d'envoi
   d'email, ou service tiers). Ne pas laisser un formulaire qui ne fait
   rien en silence.
5. **Bouton WhatsApp** : conserver le lien `https://wa.me/243900000000`
   (numéro à confirmer/remplacer par le vrai numéro du client) en bouton
   flottant sur toutes les pages.
6. **Images** : les images actuelles viennent d'Unsplash (placeholders).
   Les intégrer via `next/image` avec le domaine Unsplash autorisé dans
   `next.config.js` dans un premier temps, en prévoyant un remplacement
   facile par de vraies photos PVS ONGD plus tard (props `src` centralisées
   dans `lib/content.ts`, pas codées en dur dans les composants).
7. **Responsive** : mobile-first, comportement identique à la maquette sur
   mobile, tablette, desktop.
8. **Pas de nouvelles dépendances** non listées ci-dessus sans les
   justifier (éviter d'alourdir le bundle pour un site vitrine simple).

## Ce qu'il ne faut PAS faire

- Ne pas changer la palette de couleurs, la typographie ou la structure des
  sections par rapport à la maquette validée sans validation préalable.
- Ne pas inventer de nouveau contenu (témoignages, chiffres, sections)
  absent de la maquette d'origine.
- Ne pas committer de clés API, mots de passe ou identifiants en dur dans
  le code — utiliser des variables d'environnement (`.env.local`, jamais
  commité).
- Ne pas supprimer ou modifier `MIGRATION-SPEC.md` — c'est le référentiel
  de contenu source de vérité pour cette migration.

## Documents liés (dans ce dépôt)

- `MIGRATION-SPEC.md` — découpage détaillé section par section avec le
  contenu exact à reprendre
- `lib/content.ts` — données structurées prêtes à l'emploi
