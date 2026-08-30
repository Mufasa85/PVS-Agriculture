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

import type {
  AboutPageContent,
  Activity,
  ActivityPageContent,
  ContactInfo,
  Cta,
  ElevagePageContent,
  FeaturePoint,
  NavLink,
  PisciculturePageContent,
  PriceProduct,
  Social,
  Stat,
  TarifsPageContent,
  ValueProp,
} from "./types";

export const siteMeta = {
  title: "PVS — Agriculture, Élevage & Pisciculture | ONGD ASBL",
  description:
    "PVS ONGD ASBL — Organisation congolaise spécialisée en agriculture, élevage, pisciculture, porcherie et vente de produits pour animaux. Contactez-nous pour vos projets.",
};

export const brand = {
  name: "PVS",
  tagline: "ONGD · ASBL",
  homeHref: "/",
};

export const navLinks: NavLink[] = [
  { label: "Accueil", href: "/" },
  { label: "Agriculture", href: "/agriculture" },
  { label: "Élevage", href: "/elevage" },
  { label: "Pisciculture", href: "/pisciculture" },
  { label: "Produits pour animaux", href: "#produits" },
  { label: "À propos", href: "/a-propos" },
  { label: "Nos tarifs", href: "/tarifs" },
  { label: "Contact", href: "#contact" },
];

export const navCta: Cta = { label: "Nous contacter", href: "#contact" };

/** [PLACEHOLDER] Numéro WhatsApp à remplacer par le vrai numéro du client. */
export const whatsappHref = "https://wa.me/243900000000";

export const hero = {
  eyebrow: "Agriculture · Élevage · Pisciculture",
  title: "Cultiver la terre, faire grandir l'élevage, nourrir l'avenir.",
  titleEmphasis: "l'élevage", // portion du titre à mettre en emphase/italique
  // Même texte que `title`, découpé selon les retours à la ligne de la maquette.
  titleLines: [
    "Cultiver la terre,",
    "faire grandir l'élevage,",
    "nourrir l'avenir.",
  ],
  paragraph:
    "PVS ONGD ASBL accompagne la production agricole, l'élevage, la pisciculture et la porcherie à Kinshasa, avec des produits et aliments pour animaux de qualité. Une organisation locale au service d'une production durable.",
  ctaPrimary: { label: "Nous contacter", href: "#contact" } satisfies Cta,
  ctaSecondary: {
    label: "Découvrir nos activités",
    href: "#activites",
  } satisfies Cta,
  stats: [
    { value: "05", label: "Domaines d'activité" },
    { value: "100%", label: "Ancrage local" },
    { value: "ONGD", label: "Engagement durable" },
  ] satisfies Stat[],
  // [PLACEHOLDER] Unsplash — à remplacer par une vraie photo PVS ONGD.
  imageSrc:
    "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=900&q=80",
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
  // [PLACEHOLDER] Unsplash
  imageSrc:
    "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80",
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
  ] satisfies FeaturePoint[],
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
    href: "/agriculture",
    imageSrc:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Champ de maïs",
  },
  {
    slug: "elevage",
    title: "Élevage",
    description:
      "Un élevage suivi avec soin pour une croissance saine du cheptel.",
    href: "/elevage",
    imageSrc:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Troupeau de bétail dans un pâturage",
  },
  {
    slug: "pisciculture",
    title: "Pisciculture",
    description:
      "Élevage de poissons en étangs contrôlés pour une production maîtrisée.",
    href: "/pisciculture",
    imageSrc:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Étang de pisciculture",
  },
  {
    slug: "porcherie",
    title: "Porcherie",
    description:
      "Une porcherie gérée selon des normes d'hygiène et de bien-être animal strictes.",
    href: "#contact",
    imageSrc:
      "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Porcherie moderne",
  },
  {
    slug: "produits",
    title: "Produits & aliments pour animaux",
    description:
      "Vente de produits et d'aliments de qualité pour un élevage performant.",
    href: "#produits",
    imageSrc:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Sacs d'aliments pour animaux",
  },
];

export const ctaBanner = {
  eyebrow: "Un accompagnement complet",
  title: "Un projet en tête ?",
  text: "Parlons de vos besoins en agriculture, élevage ou approvisionnement.",
  cta: { label: "Demander un devis", href: "#contact" } satisfies Cta,
};

export const apropos = {
  eyebrow: "Qui sommes-nous",
  title: "Une organisation locale engagée pour une production durable",
  paragraphs: [
    "PVS ONGD ASBL est une organisation basée à Kinshasa, active dans l'agriculture, l'élevage, la pisciculture, la porcherie et la fourniture de produits pour animaux. Notre vocation est d'accompagner une production locale saine, structurée et durable.",
    "Notre vision repose sur une conviction simple : une production maîtrisée à chaque étape profite autant aux communautés qu'à la terre. Nous mettons notre expérience de terrain au service de partenaires et de clients exigeants.",
  ],
  tags: ["Vision durable", "Expertise terrain", "Ancrage local"],
  images: [
    {
      // [PLACEHOLDER] Unsplash
      src: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=700&q=80",
      alt: "Vue aérienne d'une exploitation agricole",
    },
    {
      // [PLACEHOLDER] Unsplash
      src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=500&q=80",
      alt: "Travailleur agricole au champ",
    },
  ],
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
  ] satisfies ValueProp[],
};

export const contactForm = {
  title: "Demande d'information / devis",
  subtitle: "Remplissez ce formulaire, nous revenons vers vous sous peu.",
  fields: {
    nom: { label: "Nom complet", placeholder: "Votre nom" },
    telephone: { label: "Téléphone", placeholder: "+243 ..." },
    email: { label: "Email", placeholder: "vous@exemple.com" },
    sujet: { label: "Sujet" },
    message: { label: "Message", placeholder: "Décrivez votre besoin..." },
  },
  submitLabel: "Envoyer le message",
  successLabel: "Message envoyé ✓",
};

export const contact: ContactInfo = {
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
    { label: "Accueil", href: "/" },
    { label: "À propos", href: "/a-propos" },
    { label: "Nos tarifs", href: "/tarifs" },
    { label: "Nos activités", href: "/#activites" },
    { label: "Contact", href: "/#contact" },
  ] satisfies NavLink[],
  activityLinks: [
    { label: "Agriculture", href: "/agriculture" },
    { label: "Élevage", href: "/elevage" },
    { label: "Pisciculture", href: "/pisciculture" },
    { label: "Produits pour animaux", href: "#produits" },
  ] satisfies NavLink[],
  // 4e colonne du footer de la maquette (index.html)
  contactLinks: [
    { label: "+243 900 000 000", href: "tel:+243900000000" },
    { label: "contact@pvs-ongd.org", href: "mailto:contact@pvs-ongd.org" },
    { label: "Kinshasa, RDC", href: "#" },
  ] satisfies NavLink[],
  // [PLACEHOLDER] URLs des réseaux sociaux à fournir par le client.
  socials: [
    { network: "facebook", label: "Facebook", href: "#" },
    { network: "instagram", label: "Instagram", href: "#" },
    { network: "linkedin", label: "LinkedIn", href: "#" },
  ] satisfies Social[],
  legalLinks: [
    { label: "Mentions légales", href: "#" }, // contenu à créer
    { label: "Politique de confidentialité", href: "#" }, // contenu à créer
  ] satisfies NavLink[],
  columnTitles: {
    quickLinks: "Liens rapides",
    activities: "Activités",
    contact: "Coordonnées",
  },
  // L'année est injectée dynamiquement, comme le <span id="year"> de la maquette.
  copyright: "PVS ONGD ASBL. Tous droits réservés.",
};

export const agriculturePage: ActivityPageContent = {
  metaTitle: "Agriculture — PVS ONGD ASBL",
  metaDescription:
    "Découvrez l'engagement agricole de PVS ONGD ASBL : production de cultures vivrières, pratiques durables et suivi rigoureux, de la préparation du sol à la récolte.",

  hero: {
    eyebrow: "Notre cœur de métier",
    title: "L'agriculture, au centre de notre engagement",
    titleEmphasis: "engagement",
    titleLines: [
      "L'agriculture, au centre",
      "de notre engagement.",
    ],
    paragraph:
      "De la préparation du sol à la récolte, PVS ONGD ASBL met en œuvre des pratiques agricoles rigoureuses pour produire des cultures saines, tout en respectant les cycles naturels de la terre à Kinshasa.",
    // [PLACEHOLDER] Unsplash
    imageSrc:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Champ agricole verdoyant au lever du soleil",
    badge: "🌾 Agriculture d'abord",
  },

  features: {
    eyebrow: "Nos pratiques agricoles",
    title: "Une production organisée, du semis à la récolte",
    paragraph:
      "De la préparation du sol à la récolte, nous mettons en œuvre des pratiques agricoles rigoureuses pour produire des cultures saines, tout en respectant les cycles naturels de la terre.",
    // [PLACEHOLDER] Unsplash
    imageSrc:
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80",
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
  },

  stats: [
    { value: "6", label: "Points forts agricoles" },
    { value: "100%", label: "Ancrage local" },
    { value: "ONGD", label: "Engagement durable" },
  ],

  cta: {
    eyebrow: "Un accompagnement complet",
    title: "Un projet agricole en tête ?",
    text: "Parlons de vos besoins en production agricole ou approvisionnement. Notre équipe vous accompagne à chaque étape.",
    buttonLabel: "Demander un devis",
    buttonHref: "/#contact",
  },
};

export const aproposPage: AboutPageContent = {
  metaTitle: "À propos — PVS ONGD ASBL",
  metaDescription:
    "Découvrez PVS ONGD ASBL : une organisation congolaise basée à Kinshasa, engagée pour une production locale durable en agriculture, élevage, pisciculture et porcherie.",

  hero: {
    eyebrow: "Qui sommes-nous",
    title: "Une organisation locale engagée pour une production durable",
    titleEmphasis: "durable",
    titleLines: [
      "Une organisation locale",
      "engagée pour une production",
      "durable.",
    ],
    paragraph:
      "PVS ONGD ASBL est une organisation congolaise basée à Kinshasa, active dans l'agriculture, l'élevage, la pisciculture, la porcherie et la fourniture de produits pour animaux. Notre vocation est d'accompagner une production locale saine, structurée et durable.",
    // [PLACEHOLDER] Unsplash
    imageSrc:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Vue aérienne d'une exploitation agricole",
  },

  mission: {
    eyebrow: "Notre mission",
    title: "Accompagner une production locale saine et durable",
    statement:
      "« Nous croyons qu'une production maîtrisée à chaque étape profite autant aux communautés qu'à la terre. Notre rôle est de mettre notre expérience de terrain au service de partenaires et de clients exigeants, pour une agriculture responsable et un élevage sain. »",
    signature: "L'équipe PVS ONGD ASBL",
    signatureRole: "Organisation non gouvernementale de développement",
  },

  vision: {
    eyebrow: "Notre vision",
    title: "Une production maîtrisée au service des communautés",
    paragraphs: [
      "PVS ONGD ASBL est une organisation basée à Kinshasa, active dans l'agriculture, l'élevage, la pisciculture, la porcherie et la fourniture de produits pour animaux. Notre vocation est d'accompagner une production locale saine, structurée et durable.",
      "Notre vision repose sur une conviction simple : une production maîtrisée à chaque étape profite autant aux communautés qu'à la terre. Nous mettons notre expérience de terrain au service de partenaires et de clients exigeants.",
    ],
    tags: ["Vision durable", "Expertise terrain", "Ancrage local"],
    images: [
      {
        // [PLACEHOLDER] Unsplash
        src: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=700&q=80",
        alt: "Vue aérienne d'une exploitation agricole",
      },
      {
        // [PLACEHOLDER] Unsplash
        src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=500&q=80",
        alt: "Travailleur agricole au champ",
      },
    ],
  },

  expertise: {
    eyebrow: "Nos domaines",
    title: "Cinq domaines d'expertise complémentaires",
    subtitle:
      "Du champ à l'élevage, en passant par l'eau et l'approvisionnement, nous couvrons l'ensemble de la chaîne de production locale.",
    items: [
      {
        icon: "sprout",
        title: "Agriculture",
        description:
          "Production et exploitation de cultures vivrières adaptées au terroir local.",
      },
      {
        icon: "cattle",
        title: "Élevage",
        description:
          "Un élevage suivi avec soin pour une croissance saine du cheptel.",
      },
      {
        icon: "fish",
        title: "Pisciculture",
        description:
          "Élevage de poissons en étangs contrôlés pour une production maîtrisée.",
      },
      {
        icon: "pig",
        title: "Porcherie",
        description:
          "Une porcherie gérée selon des normes d'hygiène et de bien-être animal strictes.",
      },
      {
        icon: "feedbag",
        title: "Produits pour animaux",
        description:
          "Vente de produits et d'aliments de qualité pour un élevage performant.",
      },
    ],
  },

  approach: {
    eyebrow: "Notre approche",
    title: "Une méthode rigoureuse, de la terre à l'assiette",
    steps: [
      {
        number: "01",
        title: "Analyse du terrain",
        description:
          "Évaluation des sols, du climat et des besoins locaux pour définir les cultures et élevages les plus adaptés.",
      },
      {
        number: "02",
        title: "Planification",
        description:
          "Élaboration d'un plan de production structuré, respectueux des cycles naturels et des ressources disponibles.",
      },
      {
        number: "03",
        title: "Mise en œuvre",
        description:
          "Application de pratiques agricoles et d'élevage rigoureuses, avec un suivi constant à chaque étape.",
      },
      {
        number: "04",
        title: "Suivi & accompagnement",
        description:
          "Contrôle qualité, conseil et accompagnement des partenaires et clients sur le long terme.",
      },
    ],
  },

  values: {
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
  },

  stats: [
    { value: "05", label: "Domaines d'activité" },
    { value: "100%", label: "Ancrage local" },
    { value: "ONGD", label: "Engagement durable" },
  ],

  cta: {
    eyebrow: "Travaillons ensemble",
    title: "Un projet en tête ?",
    text: "Parlons de vos besoins en agriculture, élevage, pisciculture ou approvisionnement. Notre équipe vous répond rapidement.",
    buttonLabel: "Nous contacter",
    buttonHref: "/#contact",
  },
};

export const elevagePage: ElevagePageContent = {
  metaTitle: "Élevage — PVS ONGD ASBL",
  metaDescription:
    "Découvrez l'élevage de PVS ONGD ASBL : un cheptel suivi avec soin, des pratiques rigoureuses et un bien-être animal respecté, pour une production saine et durable à Kinshasa.",

  hero: {
    eyebrow: "Notre savoir-faire",
    title: "Un élevage suivi avec soin et rigueur",
    titleEmphasis: "soin",
    titleLines: [
      "Un élevage suivi",
      "avec soin et rigueur.",
    ],
    paragraph:
      "L'élevage est l'un des piliers de PVS ONGD ASBL. Nous assurons un suivi attentif du cheptel, avec des pratiques d'hygiène strictes et une alimentation contrôlée, pour garantir des produits sains et une croissance harmonieuse des animaux.",
    // [PLACEHOLDER] Unsplash
    imageSrc:
      "https://images.unsplash.com/photo-1600428853876-6b57d20b9da6?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Vaches paissant dans un pâturage verdoyant",
  },

  gallery: {
    eyebrow: "Notre cheptel en images",
    title: "Des animaux bien soignés, dans un environnement sain",
    subtitle:
      "Découvrez notre élevage à travers ces images : des conditions d'hébergement propres, un cheptel vigoureux et un suivi quotidien attentif.",
    slides: [
      {
        // [PLACEHOLDER] Unsplash
        src: "https://images.unsplash.com/photo-1600428853876-6b57d20b9da6?auto=format&fit=crop&w=1200&q=80",
        alt: "Vaches dans un pâturage",
        caption: "Bovins au pâturage",
      },
      {
        // [PLACEHOLDER] Unsplash
        src: "https://images.unsplash.com/photo-1516467508483-a7212febe7da?auto=format&fit=crop&w=1200&q=80",
        alt: "Poules en élevage libre",
        caption: "Volailles en élevage libre",
      },
      {
        // [PLACEHOLDER] Unsplash
        src: "https://images.unsplash.com/photo-1564492300010-3a6a3f4e1e1e?auto=format&fit=crop&w=1200&q=80",
        alt: "Chèvres dans une étable",
        caption: "Caprins en stabulation",
      },
      {
        // [PLACEHOLDER] Unsplash
        src: "https://images.unsplash.com/photo-1592875811445-9ad3c67b0c9e?auto=format&fit=crop&w=1200&q=80",
        alt: "Moutons dans un enclos",
        caption: "Ovins au repos",
      },
      {
        // [PLACEHOLDER] Unsplash
        src: "https://images.unsplash.com/photo-1543374996-3a5d6b3e5e4e?auto=format&fit=crop&w=1200&q=80",
        alt: "Soignant s'occupant d'un animal",
        caption: "Suivi vétérinaire quotidien",
      },
    ],
  },

  practices: {
    eyebrow: "Nos pratiques d'élevage",
    title: "Une approche rigoureuse à chaque étape",
    paragraph:
      "Notre élevage repose sur des principes simples mais exigeants : bien-être animal, hygiène stricte et alimentation de qualité. Chaque aspect est suivi de près pour garantir la santé du cheptel et la qualité des produits.",
    items: [
      {
        icon: "check",
        title: "Bien-être animal",
        description:
          "Des conditions d'hébergement adaptées, de l'espace et une attention quotidienne au comportement des animaux.",
      },
      {
        icon: "lock",
        title: "Hygiène stricte",
        description:
          "Nettoyage régulier des installations et protocoles sanitaires respectés à chaque étape de l'élevage.",
      },
      {
        icon: "feedbag",
        title: "Alimentation contrôlée",
        description:
          "Une alimentation équilibrée et tracée, adaptée à chaque espèce et à chaque stade de croissance.",
      },
      {
        icon: "cycle",
        title: "Suivi vétérinaire",
        description:
          "Des visites régulières et un suivi de santé rigoureux pour prévenir et traiter rapidement.",
      },
      {
        icon: "barn",
        title: "Hébergement adapté",
        description:
          "Des installations pensées pour le confort et la sécurité des animaux, en toutes saisons.",
      },
      {
        icon: "check",
        title: "Traçabilité",
        description:
          "Un suivi documenté de chaque animal, de la naissance à la commercialisation.",
      },
    ],
  },

  process: {
    eyebrow: "Comment fonctionne notre élevage",
    title: "Du choix des races à la commercialisation",
    steps: [
      {
        number: "01",
        title: "Sélection des races",
        description:
          "Choix de races adaptées au climat local et aux conditions d'élevage, pour une croissance saine et productive.",
      },
      {
        number: "02",
        title: "Hébergement & acclimatation",
        description:
          "Installation des animaux dans des infrastructures propres, spacieuses et sécurisées, avec une période d'adaptation surveillée.",
      },
      {
        number: "03",
        title: "Alimentation & croissance",
        description:
          "Rationnement équilibré et adapté à chaque stade, avec un suivi quotidien de la prise de poids et de la santé.",
      },
      {
        number: "04",
        title: "Suivi sanitaire",
        description:
          "Vaccinations, contrôles vétérinaires et protocoles d'hygiène appliqués rigoureusement tout au long du cycle.",
      },
      {
        number: "05",
        title: "Commercialisation",
        description:
          "Mise sur le marché d'animaux et de produits sains, issus d'un élevage maîtrisé et responsable.",
      },
    ],
  },

  stats: [
    { value: "06", label: "Pratiques rigoureuses" },
    { value: "05", label: "Étapes maîtrisées" },
    { value: "100%", label: "Suivi vétérinaire" },
  ],

  cta: {
    eyebrow: "Un élevage de confiance",
    title: "Besoin d'animaux sains ou de conseils en élevage ?",
    text: "Notre équipe vous accompagne dans vos projets d'élevage, de l'approvisionnement en animaux au conseil sanitaire. Contactez-nous pour en discuter.",
    buttonLabel: "Demander un devis",
    buttonHref: "/#contact",
  },
};

export const tarifsPage: TarifsPageContent = {
  metaTitle: "Nos tarifs — PVS ONGD ASBL",
  metaDescription:
    "Consultez les prix des produits de PVS ONGD ASBL : élevage bovin, caprin, pisciculture, volailles et produits pour animaux. Filtrez par catégorie pour trouver rapidement ce que vous cherchez.",

  hero: {
    eyebrow: "Nos tarifs",
    title: "Un aperçu clair de nos prix",
    titleEmphasis: "prix",
    titleLines: [
      "Un aperçu clair",
      "de nos prix.",
    ],
    paragraph:
      "Consultez les tarifs de nos produits par catégorie. Sélectionnez une catégorie pour filtrer les prix et trouver rapidement ce qui vous intéresse. Les prix sont indicatifs et peuvent varier selon la disponibilité et la saison.",
  },

  categories: [
    { id: "tous", label: "Tous", icon: "check" },
    { id: "bovin", label: "Bovins", icon: "cattle" },
    { id: "capra", label: "Caprins", icon: "cattle" },
    { id: "pisciculture", label: "Pisciculture", icon: "fish" },
    { id: "volailles", label: "Volailles", icon: "cattle" },
    { id: "produits", label: "Produits pour animaux", icon: "feedbag" },
  ],

  products: [
    {
      name: "Bœuf adulte",
      description: "Bœuf élevé en pâturage, prêt pour la commercialisation.",
      price: "1 200 000 FC",
      unit: "/ tête",
      category: "bovin",
      imageSrc:
        "https://images.unsplash.com/photo-1600428853876-6b57d20b9da6?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Bœuf au pâturage",
    },
    {
      name: "Vache laitière",
      description: "Vache laitière en pleine production, race locale adaptée.",
      price: "1 500 000 FC",
      unit: "/ tête",
      category: "bovin",
      imageSrc:
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Vache laitière",
    },
    {
      name: "Veau sevré",
      description: "Veau sevré de 6 à 8 mois, en bonne santé et vacciné.",
      price: "450 000 FC",
      unit: "/ tête",
      category: "bovin",
      imageSrc:
        "https://images.unsplash.com/photo-1570042225831-d1fa9b5c9b29?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Veau dans un pâturage",
    },
    {
      name: "Chèvre adulte",
      description: "Chèvre adulte en bonne santé, adaptée au climat local.",
      price: "180 000 FC",
      unit: "/ tête",
      category: "capra",
      imageSrc:
        "https://images.unsplash.com/photo-1564492300010-3a6a3f4e1e1e?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Chèvre dans une étable",
    },
    {
      name: "Bouc reproducteur",
      description: "Bouc reproducteur sélectionné, robuste et bien constitué.",
      price: "250 000 FC",
      unit: "/ tête",
      category: "capra",
      imageSrc:
        "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Bouc dans un enclos",
    },
    {
      name: "Chevreau sevré",
      description: "Chevreau de 3 à 4 mois, sevré et vacciné.",
      price: "75 000 FC",
      unit: "/ tête",
      category: "capra",
      imageSrc:
        "https://images.unsplash.com/photo-1533418436585-5c2c24e0c5dc?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Chevreau au pâturage",
    },
    {
      name: "Tilapia frais",
      description: "Tilapia élevé en étang contrôlé, pêché du jour.",
      price: "8 000 FC",
      unit: "/ kg",
      category: "pisciculture",
      imageSrc:
        "https://images.unsplash.com/photo-1535473895227-bdecb20fb373?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Tilapia frais",
    },
    {
      name: "Alevins tilapia",
      description: "Alevins de tilapia pour démarrer votre propre étang.",
      price: "500 FC",
      unit: "/ unité",
      category: "pisciculture",
      imageSrc:
        "https://images.unsplash.com/photo-1559473242-3740c6c65e1e?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Alevins dans un bassin",
    },
    {
      name: "Poisson-chat",
      description: "Poisson-chat élevé en étang, chair ferme et savoureuse.",
      price: "10 000 FC",
      unit: "/ kg",
      category: "pisciculture",
      imageSrc:
        "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Poisson-chat",
    },
    {
      name: "Poulet fermier",
      description: "Poulet élevé en plein air, nourri aux céréales.",
      price: "15 000 FC",
      unit: "/ pièce",
      category: "volailles",
      imageSrc:
        "https://images.unsplash.com/photo-1516467508483-a7212febe7da?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Poulet fermier",
    },
    {
      name: "Poules pondeuses",
      description: "Poules pondeuses en pleine production, vaccinées.",
      price: "12 000 FC",
      unit: "/ pièce",
      category: "volailles",
      imageSrc:
        "https://images.unsplash.com/photo-1548559934-4e3a06e1d434?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Poules pondeuses",
    },
    {
      name: "Œufs frais",
      description: "Œufs frais de poules élevées en plein air.",
      price: "3 000 FC",
      unit: "/ douzaine",
      category: "volailles",
      imageSrc:
        "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Œufs frais",
    },
    {
      name: "Aliment poulet",
      description: "Aliment complet pour poulets, riche en protéines.",
      price: "25 000 FC",
      unit: "/ sac 50 kg",
      category: "produits",
      imageSrc:
        "https://images.unsplash.com/photo-1604908554049-29bf08f5d1a9?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Sac d'aliment pour volailles",
    },
    {
      name: "Aliment bovin",
      description: "Complément alimentaire pour bovins, croissance et lait.",
      price: "35 000 FC",
      unit: "/ sac 50 kg",
      category: "produits",
      imageSrc:
        "https://images.unsplash.com/photo-1604908554049-29bf08f5d1a9?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Sac d'aliment pour bovins",
    },
    {
      name: "Aliment poisson",
      description: "Granulés pour poissons d'élevage, formulation équilibrée.",
      price: "40 000 FC",
      unit: "/ sac 25 kg",
      category: "produits",
      imageSrc:
        "https://images.unsplash.com/photo-1604908554049-29bf08f5d1a9?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Granulés pour poissons",
    },
  ],

  info: {
    eyebrow: "Bon à savoir",
    title: "Des prix transparents et justes",
    text: "Nos tarifs reflètent la qualité de notre élevage et de nos produits. Ils peuvent varier selon la disponibilité, la saison et les quantités commandées. Pour les commandes en gros ou les partenariats durables, des tarifs préférentiels peuvent être appliqués. Contactez-nous pour un devis personnalisé.",
  },

  cta: {
    eyebrow: "Besoin d'un devis ?",
    title: "Contactez-nous pour un tarif personnalisé",
    text: "Que vous cherchiez un animal, un produit ou un partenariat, notre équipe vous répond rapidement avec une offre adaptée.",
    buttonLabel: "Demander un devis",
    buttonHref: "/#contact",
  },
};

export const pisciculturePage: PisciculturePageContent = {
  metaTitle: "Pisciculture — PVS ONGD ASBL",
  metaDescription:
    "Découvrez la pisciculture de PVS ONGD ASBL : élevage de poissons en étangs contrôlés, tilapia et poisson-chat, avec des prix transparents et une production maîtrisée à Kinshasa.",

  hero: {
    eyebrow: "Notre savoir-faire",
    title: "Une pisciculture maîtrisée en étangs contrôlés",
    titleEmphasis: "maîtrisée",
    titleLines: [
      "Une pisciculture",
      "maîtrisée en étangs",
      "contrôlés.",
    ],
    paragraph:
      "La pisciculture est l'un de nos métiers de cœur. Nous élevons des poissons en étangs contrôlés, avec une gestion rigoureuse de la qualité de l'eau, de l'alimentation et du suivi sanitaire, pour une production saine et durable.",
    // [PLACEHOLDER] Unsplash
    imageSrc:
      "https://images.unsplash.com/photo-1535473895227-bdecb20fb373?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Étang de pisciculture avec poissons",
  },

  overview: {
    eyebrow: "La pisciculture chez PVS",
    title: "Des étangs contrôlés pour une production saine",
    paragraphs: [
      "Notre exploitation piscicole repose sur des étangs aménagés et contrôlés, où chaque paramètre — qualité de l'eau, oxygénation, densité, alimentation — est suivi de près pour garantir la santé et la croissance des poissons.",
      "Nous élevons principalement du tilapia et du poisson-chat, deux espèces bien adaptées au climat local et appréciées pour leur chair. Notre objectif est de fournir un poisson frais, sain et issu d'une production responsable.",
    ],
    tags: ["Tilapia", "Poisson-chat", "Étangs contrôlés", "Eau de qualité", "Production locale"],
    // [PLACEHOLDER] Unsplash
    imageSrc:
      "https://images.unsplash.com/photo-1559473242-3740c6c65e1e?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Bassin d'élevage de poissons",
  },

  features: {
    eyebrow: "Nos pratiques piscicoles",
    title: "Une approche rigoureuse à chaque étape",
    subtitle:
      "De la gestion de l'eau à la commercialisation, chaque aspect de notre pisciculture est suivi avec attention pour garantir la qualité du poisson.",
    items: [
      {
        icon: "check",
        title: "Qualité de l'eau",
        description:
          "Contrôle régulier des paramètres de l'eau : pH, oxygène, température, pour un environnement sain.",
      },
      {
        icon: "feedbag",
        title: "Alimentation adaptée",
        description:
          "Granulés équilibrés et dosés selon l'espèce et le stade de croissance, pour une croissance optimale.",
      },
      {
        icon: "cycle",
        title: "Densité maîtrisée",
        description:
          "Un nombre de poissons par étang calculé pour éviter la surpopulation et garantir le bien-être.",
      },
      {
        icon: "lock",
        title: "Suivi sanitaire",
        description:
          "Observation quotidienne, prévention des maladies et intervention rapide en cas de besoin.",
      },
      {
        icon: "fish",
        title: "Espèces adaptées",
        description:
          "Tilapia et poisson-chat, choisis pour leur résistance et leur adaptation au climat local.",
      },
      {
        icon: "check",
        title: "Pêche du jour",
        description:
          "Un poisson pêché le jour même, frais et savoureux, directement disponible à la vente.",
      },
    ],
  },

  pricing: {
    eyebrow: "Nos prix",
    title: "Tarifs de nos produits de pisciculture",
    subtitle:
      "Un aperçu des prix de nos poissons et alevins. Les prix sont indicatifs et peuvent varier selon la disponibilité et la saison.",
    items: [
      {
        name: "Tilapia frais",
        description: "Tilapia élevé en étang contrôlé, pêché du jour.",
        price: "8 000 FC",
        unit: "/ kg",
        // [PLACEHOLDER] Unsplash
        imageSrc:
          "https://images.unsplash.com/photo-1535473895227-bdecb20fb373?auto=format&fit=crop&w=600&q=80",
        imageAlt: "Tilapia frais",
        badge: "Best-seller",
      },
      {
        name: "Poisson-chat",
        description: "Poisson-chat élevé en étang, chair ferme et savoureuse.",
        price: "10 000 FC",
        unit: "/ kg",
        // [PLACEHOLDER] Unsplash
        imageSrc:
          "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?auto=format&fit=crop&w=600&q=80",
        imageAlt: "Poisson-chat",
      },
      {
        name: "Alevins tilapia",
        description: "Alevins de tilapia pour démarrer votre propre étang.",
        price: "500 FC",
        unit: "/ unité",
        // [PLACEHOLDER] Unsplash
        imageSrc:
          "https://images.unsplash.com/photo-1559473242-3740c6c65e1e?auto=format&fit=crop&w=600&q=80",
        imageAlt: "Alevins dans un bassin",
        badge: "Dès",
      },
      {
        name: "Aliment poisson",
        description: "Granulés pour poissons d'élevage, formulation équilibrée.",
        price: "40 000 FC",
        unit: "/ sac 25 kg",
        // [PLACEHOLDER] Unsplash
        imageSrc:
          "https://images.unsplash.com/photo-1604908554049-29bf08f5d1a9?auto=format&fit=crop&w=600&q=80",
        imageAlt: "Granulés pour poissons",
      },
    ],
  },

  stats: [
    { value: "02", label: "Espèces élevées" },
    { value: "06", label: "Pratiques rigoureuses" },
    { value: "100%", label: "Eau contrôlée" },
  ],

  cta: {
    eyebrow: "Poisson frais garanti",
    title: "Besoin de poisson frais ou d'alevins ?",
    text: "Notre équipe vous accompagne dans vos besoins en pisciculture, de l'achat de poisson frais au démarrage de votre propre étang. Contactez-nous pour en discuter.",
    buttonLabel: "Demander un devis",
    buttonHref: "/#contact",
  },
};
