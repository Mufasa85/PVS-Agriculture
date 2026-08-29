"use client";

import { useState } from "react";

import { contact, contactForm } from "@/lib/content";

const fieldClass =
  "w-full rounded-[10px] border-[1.5px] border-line bg-brand-50 px-[15px] py-[13px] font-sans text-[14.5px] text-ink-900 transition-colors duration-300 focus:border-brand-600 focus:bg-white focus:outline-none";
const labelClass =
  "mb-[7px] block text-[13px] font-bold text-brand-900";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  /**
   * ⚠️ Envoi non branché : reproduit pour l'instant le retour visuel de la
   * maquette (script.js). Le backend (Route Handler + service d'email) reste
   * à décider — voir CLAUDE.md, règle 4.
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();
    setSent(true);
    window.setTimeout(() => setSent(false), 2600);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-pvs-lg bg-white px-[22px] py-7 shadow-float mid:p-[42px]"
    >
      <h3 className="mb-1.5 text-[22px] text-brand-900">{contactForm.title}</h3>
      <p className="mb-[26px] text-sm text-ink-500">{contactForm.subtitle}</p>

      <div className="grid grid-cols-1 gap-[18px] mid:grid-cols-2">
        <div className="mb-[18px]">
          <label htmlFor="nom" className={labelClass}>
            {contactForm.fields.nom.label}
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            placeholder={contactForm.fields.nom.placeholder}
            required
            className={fieldClass}
          />
        </div>
        <div className="mb-[18px]">
          <label htmlFor="telephone" className={labelClass}>
            {contactForm.fields.telephone.label}
          </label>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            placeholder={contactForm.fields.telephone.placeholder}
            required
            className={fieldClass}
          />
        </div>
      </div>

      <div className="mb-[18px]">
        <label htmlFor="email" className={labelClass}>
          {contactForm.fields.email.label}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder={contactForm.fields.email.placeholder}
          required
          className={fieldClass}
        />
      </div>

      <div className="mb-[18px]">
        <label htmlFor="sujet" className={labelClass}>
          {contactForm.fields.sujet.label}
        </label>
        <select id="sujet" name="sujet" className={fieldClass}>
          {contact.formSubjects.map((subject) => (
            <option key={subject}>{subject}</option>
          ))}
        </select>
      </div>

      <div className="mb-[18px]">
        <label htmlFor="message" className={labelClass}>
          {contactForm.fields.message.label}
        </label>
        <textarea
          id="message"
          name="message"
          placeholder={contactForm.fields.message.placeholder}
          required
          className={`${fieldClass} min-h-[110px] resize-y`}
        />
      </div>

      <button
        type="submit"
        className={`btn mt-1.5 w-full ${
          sent
            ? "bg-[#2f9e5e] text-white"
            : "btn-primary"
        }`}
      >
        {sent ? contactForm.successLabel : contactForm.submitLabel}
      </button>

      <p className="mt-3.5 text-center text-xs text-ink-500">
        {contact.consentText}
      </p>
    </form>
  );
}
