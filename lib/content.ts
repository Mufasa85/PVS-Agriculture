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
  FeaturePoint,
  NavLink,
  Social,
  Stat,
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
  { label: "Élevage", href: "#elevage" },
  { label: "Pisciculture", href: "#pisciculture" },
  { label: "Produits pour animaux", href: "#produits" },
  { label: "À propos", href: "/a-propos" },
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
    href: "#elevage", // maquette d'origine pointait vers #contact — à confirmer
    imageSrc:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Troupeau de bétail dans un pâturage",
  },
  {
    slug: "pisciculture",
    title: "Pisciculture",
    description:
      "Élevage de poissons en étangs contrôlés pour une production maîtrisée.",
    href: "#pisciculture", // maquette d'origine pointait vers #contact — à confirmer
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
    { label: "Nos activités", href: "/#activites" },
    { label: "Contact", href: "/#contact" },
  ] satisfies NavLink[],
  activityLinks: [
    { label: "Agriculture", href: "/agriculture" },
    { label: "Élevage", href: "#elevage" },
    { label: "Pisciculture", href: "#pisciculture" },
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
