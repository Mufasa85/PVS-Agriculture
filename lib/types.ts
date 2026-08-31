export type NavLink = {
  label: string;
  href: string;
};

export type ServiceLink = {
  label: string;
  description: string;
  href: string;
  icon: string;
};

export type Cta = {
  label: string;
  href: string;
};

export type Stat = {
  value: string;
  label: string;
};

export type FeaturePoint = {
  title: string;
  description: string;
};

export type Activity = {
  slug: string;
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

export type SocialNetwork = "facebook" | "instagram" | "linkedin";

export type Social = {
  network: SocialNetwork;
  label: string;
  href: string;
};

export type ValueProp = {
  tag: string;
  title: string;
  description: string;
};

export type ContactInfo = {
  eyebrow: string;
  title: string;
  subtitle: string;
  phone: string;
  phoneHref: string;
  whatsappHref: string;
  email: string;
  address: string;
  hours: string;
  formSubjects: string[];
  consentText: string;
};

export type ActivityPageContent = {
  metaTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    title: string;
    titleEmphasis: string;
    titleLines: string[];
    paragraph: string;
    imageSrc: string;
    imageAlt: string;
    badge: string;
  };
  features: {
    eyebrow: string;
    title: string;
    paragraph: string;
    imageSrc: string;
    imageAlt: string;
    points: FeaturePoint[];
  };
  stats: Stat[];
  cta: {
    eyebrow: string;
    title: string;
    text: string;
    buttonLabel: string;
    buttonHref: string;
  };
};

export type AboutPageContent = {
  metaTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    title: string;
    titleEmphasis: string;
    titleLines: string[];
    paragraph: string;
    imageSrc: string;
    imageAlt: string;
  };
  mission: {
    eyebrow: string;
    title: string;
    statement: string;
    signature: string;
    signatureRole: string;
  };
  vision: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    tags: string[];
    images: { src: string; alt: string }[];
  };
  expertise: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { icon: string; title: string; description: string }[];
  };
  approach: {
    eyebrow: string;
    title: string;
    steps: { number: string; title: string; description: string }[];
  };
  values: {
    eyebrow: string;
    title: string;
    items: ValueProp[];
  };
  stats: Stat[];
  cta: {
    eyebrow: string;
    title: string;
    text: string;
    buttonLabel: string;
    buttonHref: string;
  };
};

export type ElevagePageContent = {
  metaTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    title: string;
    titleEmphasis: string;
    titleLines: string[];
    paragraph: string;
    imageSrc: string;
    imageAlt: string;
  };
  gallery: {
    eyebrow: string;
    title: string;
    subtitle: string;
    slides: { src: string; alt: string; caption: string }[];
  };
  practices: {
    eyebrow: string;
    title: string;
    paragraph: string;
    items: { icon: string; title: string; description: string }[];
  };
  process: {
    eyebrow: string;
    title: string;
    steps: { number: string; title: string; description: string }[];
  };
  stats: Stat[];
  cta: {
    eyebrow: string;
    title: string;
    text: string;
    buttonLabel: string;
    buttonHref: string;
  };
};

export type PisciculturePageContent = {
  metaTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    title: string;
    titleEmphasis: string;
    titleLines: string[];
    paragraph: string;
    imageSrc: string;
    imageAlt: string;
  };
  overview: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    tags: string[];
    imageSrc: string;
    imageAlt: string;
    products: { name: string; description: string; imageSrc: string; imageAlt: string }[];
  };
  features: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { icon: string; title: string; description: string }[];
  };
  pricing: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { name: string; description: string; price: string; unit: string; imageSrc: string; imageAlt: string; badge?: string }[];
  };
  stats: Stat[];
  cta: {
    eyebrow: string;
    title: string;
    text: string;
    buttonLabel: string;
    buttonHref: string;
  };
};

export type ProduitsAnimauxPageContent = {
  metaTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    title: string;
    titleEmphasis: string;
    titleLines: string[];
    paragraph: string;
    imageSrc: string;
    imageAlt: string;
  };
  overview: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    tags: string[];
    imageSrc: string;
    imageAlt: string;
    products: { name: string; description: string; imageSrc: string; imageAlt: string }[];
  };
  features: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { icon: string; title: string; description: string }[];
  };
  pricing: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { name: string; description: string; price: string; unit: string; imageSrc: string; imageAlt: string; badge?: string }[];
  };
  stats: Stat[];
  cta: {
    eyebrow: string;
    title: string;
    text: string;
    buttonLabel: string;
    buttonHref: string;
  };
};

export type PorcheriePageContent = {
  metaTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    title: string;
    titleEmphasis: string;
    titleLines: string[];
    paragraph: string;
    imageSrc: string;
    imageAlt: string;
  };
  overview: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    tags: string[];
    imageSrc: string;
    imageAlt: string;
    products: { name: string; description: string; imageSrc: string; imageAlt: string }[];
  };
  features: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { icon: string; title: string; description: string }[];
  };
  pricing: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { name: string; description: string; price: string; unit: string; imageSrc: string; imageAlt: string; badge?: string }[];
  };
  stats: Stat[];
  cta: {
    eyebrow: string;
    title: string;
    text: string;
    buttonLabel: string;
    buttonHref: string;
  };
};

export type PriceProduct = {
  name: string;
  description: string;
  price: string;
  unit: string;
  category: string;
  imageSrc: string;
  imageAlt: string;
};

export type PriceCategory = {
  id: string;
  label: string;
  icon: string;
};

export type TarifsPageContent = {
  metaTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    title: string;
    titleEmphasis: string;
    titleLines: string[];
    paragraph: string;
  };
  categories: PriceCategory[];
  products: PriceProduct[];
  info: {
    eyebrow: string;
    title: string;
    text: string;
  };
  cta: {
    eyebrow: string;
    title: string;
    text: string;
    buttonLabel: string;
    buttonHref: string;
  };
};
