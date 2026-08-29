export type NavLink = {
  label: string;
  href: string;
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
