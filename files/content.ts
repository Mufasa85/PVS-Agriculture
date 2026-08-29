/**
 * lib/content.ts
 *
 * Contenu structuré du site PVS ONGD, extrait de la maquette validée par
 * le client (https://mufasa85.github.io/PVS-Agriculture/).
 *
 * Ne pas modifier les textes sans validation de Cesar (ArcaneCore) —
 * voir CLAUDE.md et MIGRATION-SPEC.md.
 *
 * Les champs marqués [PLACEHOLDER] doivent être remplacés par les vraies
 * informations du client avant mise en production.
 */

export type NavLink = {
  label: string;
  href: string;
};

export const navLinks: NavLink[] = [
  { label: "Accueil", href: "#accueil" },
  { label: "Agriculture", href: "#agriculture" },
  { label: "Élevage", href: "#elevage" },
  { label: "Pisciculture", href: "#pisciculture" },
  { label: "Produits pour animaux", href: "#produits" },
  { label: "À propos", href: "#apropos" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  eyebrow: "Agriculture · Élevage · Pisciculture",
  title: "Cultiver la terre, faire grandir l'élevage, nourrir l'avenir.",
  titleEmphasis: "l'élevage", // portion du titre à mettre en emphase/italique
  paragraph:
    "PVS ONGD ASBL accompagne la production agricole, l'élevage, la pisciculture et la porcherie à Kinshasa, avec des produits et aliments pour animaux de qualité. Une organisation locale au service d'une production durable.",
  ctaPrimary: { label: "Nous contacter", href: "#contact" },
  ctaSecondary: { label: "Découvrir nos activités", href: "#activites" },
  stats: [
    { value: "05", label: "Domaines d'activité" },
    { value: "100%", label: "Ancrage local" },
    { value: "ONGD", label: "Engagement durable" },
  ],
  imageAlt: "Champ agricole verdoyant au lever du soleil",
  badge: "🌾 Agriculture d'abord",
  floatingCardTitle: "Production durable",
  floatingCardText: "Une agriculture responsable, ancrée localement",
};

export const agricultureFeature = {
  eyebrow: "Notre cœur de métier",
  title: "L'agriculture, au centre de notre engagement",
  paragraph:
    "De la préparation du sol à la récolte, nous mettons en œuvre des pratiques agricoles rigoureuses pour produire des cultures saines, tout en respectant les cycles naturels de la terre.",
  imageAlt: "Rangées de cultures dans une exploitation agricole",
  points: [
    {
      title: "Production agricole",
      description: "Une production organisée, suivie du semis à la récolte.",
    },
    {
      title: "Cultures diversifiées",
      description: "Un éventail de cultures adaptées au climat local.",
    },
    {
      title: "Exploitation structurée",
      description: "Une exploitation organisée pour un rendement stable.",
    },
    {
      title: "Qualité des produits",
      description: "Un contrôle attentif à chaque étape de production.",
    },
    {
      title: "Production durable",
      description: "Des méthodes respectueuses des sols et des ressources.",
    },
    {
      title: "Suivi rigoureux",
      description: "Une organisation qui accompagne chaque cycle agricole.",
    },
  ],
};

export type Activity = {
  slug: string;
  title: string;
  description: string;
  href: string;
  imageAlt: string;
};

export const activitesSection = {
  eyebrow: "Nos domaines",
  title: "Nos activités",
  subtitle:
    "Cinq domaines complémentaires, pensés pour accompagner une production locale complète, de la terre à l'assiette.",
};

export const activities: Activity[] = [
  {
    slug: "agriculture",
    title: "Agriculture",
    description:
      "Production et exploitation de cultures vivrières adaptées au terroir local.",
    href: "#agriculture",
    imageAlt: "Champ de maïs",
  },
  {
    slug: "elevage",
    title: "Élevage",
    description:
      "Un élevage suivi avec soin pour une croissance saine du cheptel.",
    href: "#elevage", // maquette d'origine pointait vers #contact — à confirmer
    imageAlt: "Troupeau de bétail dans un pâturage",
  },
  {
    slug: "pisciculture",
    title: "Pisciculture",
    description:
      "Élevage de poissons en étangs contrôlés pour une production maîtrisée.",
    href: "#pisciculture", // maquette d'origine pointait vers #contact — à confirmer
    imageAlt: "Étang de pisciculture",
  },
  {
    slug: "porcherie",
    title: "Porcherie",
    description:
      "Une porcherie gérée selon des normes d'hygiène et de bien-être animal strictes.",
    href: "#contact",
    imageAlt: "Porcherie moderne",
  },
  {
    slug: "produits",
    title: "Produits & aliments pour animaux",
    description:
      "Vente de produits et d'aliments de qualité pour un élevage performant.",
    href: "#produits",
    imageAlt: "Sacs d'aliments pour animaux",
  },
];

export const ctaBanner = {
  eyebrow: "Un accompagnement complet",
  title: "Un projet en tête ?",
  text: "Parlons de vos besoins en agriculture, élevage ou approvisionnement.",
  cta: { label: "Demander un devis", href: "#contact" },
};

export const apropos = {
  eyebrow: "Qui sommes-nous",
  title: "Une organisation locale engagée pour une production durable",
  paragraphs: [
    "PVS ONGD ASBL est une organisation basée à Kinshasa, active dans l'agriculture, l'élevage, la pisciculture, la porcherie et la fourniture de produits pour animaux. Notre vocation est d'accompagner une production locale saine, structurée et durable.",
    "Notre vision repose sur une conviction simple : une production maîtrisée à chaque étape profite autant aux communautés qu'à la terre. Nous mettons notre expérience de terrain au service de partenaires et de clients exigeants.",
  ],
  tags: ["Vision durable", "Expertise terrain", "Ancrage local"],
};

export const pourquoiNousChoisir = {
  eyebrow: "Nos engagements",
  title: "Pourquoi nous choisir ?",
  items: [
    {
      tag: "Qualité",
      title: "Des produits contrôlés",
      description:
        "Un suivi rigoureux à chaque étape, de la production à la livraison.",
    },
    {
      tag: "Expertise",
      title: "Un savoir-faire de terrain",
      description:
        "Une connaissance concrète de l'agriculture et de l'élevage local.",
    },
    {
      tag: "Production",
      title: "Des capacités diversifiées",
      description:
        "Cinq activités complémentaires pour répondre à vos besoins.",
    },
    {
      tag: "Fiabilité",
      title: "Un partenaire de confiance",
      description:
        "Une organisation présente sur le long terme, aux côtés de ses partenaires.",
    },
    {
      tag: "Accompagnement",
      title: "À votre écoute",
      description:
        "Une équipe disponible pour conseiller et orienter chaque projet.",
    },
  ],
};

export const contact = {
  eyebrow: "Contact",
  title: "Parlons de votre projet",
  subtitle:
    "Une question, une demande de devis ou un besoin en agriculture, élevage ou pisciculture ? Notre équipe vous répond rapidement.",
  // ⚠️ [PLACEHOLDER] — remplacer par les vraies coordonnées du client
  phone: "+243 900 000 000",
  phoneHref: "tel:+243900000000",
  whatsappHref: "https://wa.me/243900000000",
  email: "contact@pvs-ongd.org",
  address: "Kinshasa, République Démocratique du Congo",
  hours: "Lun – Sam · 8h00 – 17h00",
  formSubjects: [
    "Demande d'information",
    "Demande de devis",
    "Agriculture",
    "Élevage",
    "Pisciculture",
    "Porcherie",
    "Produits pour animaux",
    "Autre",
  ],
  consentText:
    "En envoyant ce formulaire, vous acceptez d'être recontacté par notre équipe.",
};

export const footer = {
  brandName: "PVS",
  brandSubtitle: "ONGD · ASBL",
  description:
    "Organisation congolaise dédiée à l'agriculture, l'élevage, la pisciculture, la porcherie et la vente de produits pour animaux, au service d'une production locale durable.",
  quickLinks: [
    { label: "Accueil", href: "#accueil" },
    { label: "À propos", href: "#apropos" },
    { label: "Nos activités", href: "#activites" },
    { label: "Contact", href: "#contact" },
  ],
  activityLinks: [
    { label: "Agriculture", href: "#agriculture" },
    { label: "Élevage", href: "#elevage" },
    { label: "Pisciculture", href: "#pisciculture" },
    { label: "Produits pour animaux", href: "#produits" },
  ],
  legalLinks: [
    { label: "Mentions légales", href: "#" }, // contenu à créer
    { label: "Politique de confidentialité", href: "#" }, // contenu à créer
  ],
  copyright: "© PVS ONGD ASBL. Tous droits réservés.",
};
