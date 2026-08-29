import ContactForm from "@/components/sections/ContactForm";
import Reveal from "@/components/ui/Reveal";
import {
  ClockIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  WhatsAppOutlineIcon,
} from "@/components/ui/icons";
import { contact } from "@/lib/content";

const infoItems = [
  {
    icon: PhoneIcon,
    title: "Téléphone",
    value: contact.phone,
    href: contact.phoneHref,
  },
  {
    icon: WhatsAppOutlineIcon,
    title: "WhatsApp",
    value: contact.phone,
    href: contact.whatsappHref,
    external: true,
  },
  {
    icon: MailIcon,
    title: "Email",
    value: contact.email,
    href: `mailto:${contact.email}`,
  },
  { icon: PinIcon, title: "Adresse", value: contact.address },
  { icon: ClockIcon, title: "Horaires", value: contact.hours },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-brand-900 py-[76px] text-white nav:py-[110px]"
    >
      <div className="shell">
        <Reveal className="mb-14 max-w-[640px]">
          <span className="eyebrow text-gold-500 before:bg-gold-500">
            {contact.eyebrow}
          </span>
          <h2 className="mt-[14px] text-[clamp(30px,4vw,44px)] text-white">
            {contact.title}
          </h2>
          <p className="mt-4 text-[17px] text-muted">{contact.subtitle}</p>
        </Reveal>

        <div className="grid items-start gap-14 nav:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <ul className="mb-9 flex flex-col gap-[22px]">
              {infoItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.title} className="flex items-start gap-4">
                    <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[13px] border border-white/[0.14] bg-white/[0.08] text-gold-500">
                      <Icon size={19} />
                    </span>
                    <span className="block">
                      <span className="mb-[3px] block font-sans text-[15px] font-bold text-white">
                        {item.title}
                      </span>
                      {item.href ? (
                        <a
                          href={item.href}
                          {...(item.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="text-[14.5px] text-muted transition-colors hover:text-gold-500"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="block text-[14.5px] text-muted">
                          {item.value}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-wrap gap-3.5">
              <a href={contact.phoneHref} className="btn btn-gold btn-sm">
                Appeler maintenant
              </a>
              <a
                href={contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm border-[1.5px] border-white/25 text-white hover:-translate-y-[3px] hover:border-gold-500 hover:text-gold-500"
              >
                Écrire sur WhatsApp
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
