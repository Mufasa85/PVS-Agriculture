# Spécification de migration — Site PVS ONGD

Référence : maquette validée https://mufasa85.github.io/PVS-Agriculture/
Cette spec décrit chaque section dans l'ordre d'apparition, avec le contenu
texte exact à reprendre (source : maquette validée par le client) et la
correspondance composant Next.js.

---

## 1. Navbar — `components/layout/Navbar.tsx`

- Logo texte : « PVS » + sous-titre « PVSONGD · ASBL »
- Liens de nav (ancres) : Accueil, Agriculture, Élevage, Pisciculture,
  Produits pour animaux, À propos, Contact
- Bouton CTA à droite : « Nous contacter » → `#contact`
- Doit devenir sticky/fixe au scroll (comportement présent dans la
  maquette d'origine, à vérifier en inspectant le JS/CSS source)
- Menu mobile (burger) reprenant les mêmes liens

## 2. Hero — `components/sections/Hero.tsx` (`id="accueil"`)

- Eyebrow : « Agriculture · Élevage · Pisciculture »
- Titre (H1) : « Cultiver la terre, faire grandir *l'élevage*, nourrir
  l'avenir. » (le mot « l'élevage » est mis en emphase/italique dans
  l'original)
- Paragraphe : « PVS ONGD ASBL accompagne la production agricole,
  l'élevage, la pisciculture et la porcherie à Kinshasa, avec des produits
  et aliments pour animaux de qualité. Une organisation locale au service
  d'une production durable. »
- Deux CTA : « Nous contacter » (→ `#contact`, style primaire) et
  « Découvrir nos activités » (→ `#activites`, style secondaire)
- 3 chiffres clés (stat cards) :
  - **05** — Domaines d'activité
  - **100%** — Ancrage local
  - **ONGD** — Engagement durable
- Image d'illustration : champ agricole au lever du soleil (remplacer
  l'URL Unsplash par une vraie photo à terme)
- Badge flottant sur l'image : « 🌾 Agriculture d'abord »
- Carte flottante sur l'image : « Production durable — Une agriculture
  responsable, ancrée localement »

## 3. Bloc Agriculture — `components/sections/AgricultureFeature.tsx`

- Eyebrow : « Notre cœur de métier »
- Titre (H2) : « L'agriculture, au centre de notre engagement »
- Paragraphe : « De la préparation du sol à la récolte, nous mettons en
  œuvre des pratiques agricoles rigoureuses pour produire des cultures
  saines, tout en respectant les cycles naturels de la terre. »
- Image : rangées de cultures
- Grille de 6 points forts (icône + titre + description courte) :
  1. **Production agricole** — Une production organisée, suivie du semis
     à la récolte.
  2. **Cultures diversifiées** — Un éventail de cultures adaptées au
     climat local.
  3. **Exploitation structurée** — Une exploitation organisée pour un
     rendement stable.
  4. **Qualité des produits** — Un contrôle attentif à chaque étape de
     production.
  5. **Production durable** — Des méthodes respectueuses des sols et des
     ressources.
  6. **Suivi rigoureux** — Une organisation qui accompagne chaque cycle
     agricole.

## 4. Nos activités — `components/sections/ActivitesGrid.tsx` (`id="activites"`)

- Eyebrow : « Nos domaines »
- Titre (H2) : « Nos activités »
- Sous-titre : « Cinq domaines complémentaires, pensés pour accompagner
  une production locale complète, de la terre à l'assiette. »
- 5 cartes (`ActivityCard.tsx`), chacune avec image + titre + description
  + lien « En savoir plus » :

  | Activité | Ancre | Description |
  |---|---|---|
  | Agriculture | `#agriculture` | Production et exploitation de cultures vivrières adaptées au terroir local. |
  | Élevage | `#elevage` | Un élevage suivi avec soin pour une croissance saine du cheptel. |
  | Pisciculture | `#pisciculture` | Élevage de poissons en étangs contrôlés pour une production maîtrisée. |
  | Porcherie | — | Une porcherie gérée selon des normes d'hygiène et de bien-être animal strictes. |
  | Produits & aliments pour animaux | `#produits` | Vente de produits et d'aliments de qualité pour un élevage performant. |

  > Note : dans la maquette d'origine, plusieurs liens « En savoir plus »
  > pointent tous vers `#contact` faute de pages dédiées. À clarifier avec
  > Cesar : garde-t-on des ancres internes uniquement, ou prévoit-on de
  > vraies sous-pages (`/activites/agriculture`, etc.) dans une itération
  > future ? Hors périmètre du devis actuel si sous-pages.

## 5. Bandeau CTA — `components/sections/CtaBanner.tsx`

- Eyebrow : « Un accompagnement complet »
- Titre (H3) : « Un projet en tête ? »
- Texte : « Parlons de vos besoins en agriculture, élevage ou
  approvisionnement. »
- Bouton : « Demander un devis » → `#contact`
- 2 images d'illustration (vue aérienne d'exploitation + travailleur au
  champ)

## 6. À propos — `components/sections/APropos.tsx` (`id="apropos"`)

- Eyebrow : « Qui sommes-nous »
- Titre (H2) : « Une organisation locale engagée pour une production
  durable »
- Paragraphe 1 : « PVS ONGD ASBL est une organisation basée à Kinshasa,
  active dans l'agriculture, l'élevage, la pisciculture, la porcherie et
  la fourniture de produits pour animaux. Notre vocation est
  d'accompagner une production locale saine, structurée et durable. »
- Paragraphe 2 : « Notre vision repose sur une conviction simple : une
  production maîtrisée à chaque étape profite autant aux communautés
  qu'à la terre. Nous mettons notre expérience de terrain au service de
  partenaires et de clients exigeants. »
- 3 tags : Vision durable / Expertise terrain / Ancrage local

## 7. Pourquoi nous choisir — `components/sections/PourquoiNousChoisir.tsx`

- Eyebrow : « Nos engagements »
- Titre (H2) : « Pourquoi nous choisir ? »
- 5 cartes (icône/tag + titre + description) :
  1. **Qualité** — Des produits contrôlés — Un suivi rigoureux à chaque
     étape, de la production à la livraison.
  2. **Expertise** — Un savoir-faire de terrain — Une connaissance
     concrète de l'agriculture et de l'élevage local.
  3. **Production** — Des capacités diversifiées — Cinq activités
     complémentaires pour répondre à vos besoins.
  4. **Fiabilité** — Un partenaire de confiance — Une organisation
     présente sur le long terme, aux côtés de ses partenaires.
  5. **Accompagnement** — À votre écoute — Une équipe disponible pour
     conseiller et orienter chaque projet.

## 8. Contact — `components/sections/Contact.tsx` (`id="contact"`)

- Eyebrow : « Contact »
- Titre (H2) : « Parlons de votre projet »
- Sous-titre : « Une question, une demande de devis ou un besoin en
  agriculture, élevage ou pisciculture ? Notre équipe vous répond
  rapidement. »
- Bloc coordonnées :
  - Téléphone : `+243 900 000 000` (⚠️ numéro placeholder — à remplacer
    par le vrai numéro du client)
  - WhatsApp : lien `https://wa.me/243900000000` (même placeholder)
  - Email : `contact@pvs-ongd.org` (⚠️ à confirmer)
  - Adresse : Kinshasa, République Démocratique du Congo
  - Horaires : Lun – Sam · 8h00 – 17h00
  - Boutons : « Appeler maintenant » (`tel:`) / « Écrire sur WhatsApp »
- Formulaire (`ContactForm.tsx`) — champs :
  - Nom complet (texte, requis)
  - Téléphone (tel, requis)
  - Email (email, requis)
  - Sujet (select, requis) : Demande d'information / Demande de devis /
    Agriculture / Élevage / Pisciculture / Porcherie / Produits pour
    animaux / Autre
  - Message (textarea, requis)
  - Bouton : « Envoyer le message »
  - Mention légale sous le bouton : « En envoyant ce formulaire, vous
    acceptez d'être recontacté par notre équipe. »
  - ⚠️ **Fonctionnel requis** : contrairement à la maquette statique, ce
    formulaire doit réellement envoyer les données (voir CLAUDE.md,
    règle 4)

## 9. Footer — `components/layout/Footer.tsx`

- Bloc identité : « PVS » + « ONGD · ASBL » + description courte :
  « Organisation congolaise dédiée à l'agriculture, l'élevage, la
  pisciculture, la porcherie et la vente de produits pour animaux, au
  service d'une production locale durable. »
- 3 icônes réseaux sociaux (liens `#` dans la maquette — à compléter avec
  les vrais liens si le client en fournit)
- Colonne « Liens rapides » : Accueil, À propos, Nos activités, Contact
- Colonne « Activités » : Agriculture, Élevage, Pisciculture, Produits
  pour animaux
- Colonne « Coordonnées » : téléphone, email, « Kinshasa, RDC »
- Ligne de copyright : « © PVS ONGD ASBL. Tous droits réservés. »
- Liens légaux : Mentions légales / Politique de confidentialité (pages
  actuellement vides dans la maquette — à créer ou laisser en ancre `#`
  selon décision de Cesar)

## 10. Bouton WhatsApp flottant — `components/layout/WhatsAppButton.tsx`

- Visible sur toutes les sections, position fixe
- Lien : `https://wa.me/243900000000` (placeholder à remplacer)

---

## Points à trancher avant / pendant le développement

- [ ] Numéro de téléphone et email réels du client (actuellement
      placeholders dans la maquette)
- [ ] Backend du formulaire de contact (Route Handler + Resend/Nodemailer
      vs service tiers)
- [ ] Sous-pages dédiées par activité ou simple ancrage sur la page
      unique (impact sur le périmètre du devis)
- [ ] Vraies photos PVS ONGD pour remplacer les images Unsplash
      placeholder
- [ ] Liens réseaux sociaux réels (actuellement `#`)
- [ ] Contenu des pages « Mentions légales » / « Politique de
      confidentialité »
