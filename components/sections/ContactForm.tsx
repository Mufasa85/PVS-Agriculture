"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import Link from "next/link";

import PageLoader from "@/components/ui/PageLoader";
import { contact, contactForm } from "@/lib/content";
import { trackQuoteRequest } from "@/lib/track";

const fieldClass =
  "w-full rounded-[10px] border-[1.5px] border-line bg-brand-50 px-[15px] py-[13px] font-sans text-[14.5px] text-ink-900 transition-[border-color,background-color] duration-200 ease-out focus:border-brand-600 focus:bg-white focus:outline-none";
const labelClass = "mb-[7px] block text-[13px] font-bold text-brand-900";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  // Case de consentement explicite (art. 196 du Code du numérique) :
  // jamais pré-cochée, et bloquante pour l'envoi.
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Garde-fou : le navigateur bloque l'envoi si la case n'est pas
    // cochée (attribut `required`). Ce test couvre le cas d'un envoi
    // déclenché sans interaction (autofill, script).
    if (!consent) {
      setStatus("error");
      setErrorMsg("Merci d'accepter le traitement de vos coordonnées.");
      window.setTimeout(() => setStatus("idle"), 5000);
      return;
    }
    const sujetStr = String(formData.get("sujet") || "");
    const payload = {
      nom: formData.get("nom"),
      telephone: formData.get("telephone"),
      email: formData.get("email"),
      sujet: sujetStr,
      message: formData.get("message"),
      website: formData.get("website"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Échec de l'envoi.");
      }

      // Track quote request event for analytics
      trackQuoteRequest({
        sujet: sujetStr,
        productName:
          sujetStr.includes("Devis") || sujetStr.includes("Commande")
            ? sujetStr
            : undefined,
      });

      form.reset();
      setConsent(false);
      setStatus("success");
      window.setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Une erreur est survenue.",
      );
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <div className="relative">
      {/* Loader animé plein écran pendant l'envoi du message */}
      <AnimatePresence>
        {status === "submitting" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="status"
            aria-label="Envoi de votre message en cours"
            className="fixed inset-0 z-[3000] flex items-center justify-center bg-white/95 backdrop-blur-sm"
          >
            <PageLoader caption="Envoi de votre message…" />
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleSubmit}
        aria-busy={status === "submitting"}
        className="rounded-pvs-lg bg-white px-[22px] py-7 shadow-float mid:p-[42px]"
      >
        {/* Annonce lecteur d'écran du résultat d'envoi */}
        <p role="status" aria-live="polite" className="sr-only">
          {status === "success"
            ? contactForm.successLabel
            : status === "error"
              ? errorMsg || "Échec de l'envoi du message."
              : ""}
        </p>

        <h3 className="mb-1.5 text-[22px] text-brand-900">
          {contactForm.title}
        </h3>
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

        {/* Honeypot anti-bot : invisible pour les humains */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden"
        >
          <label htmlFor="website">Site web</label>
          <input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
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
          disabled={status === "submitting"}
          className={`btn mt-1.5 w-full transition-[transform,background-color,opacity] duration-200 ease-out active:scale-[0.97] ${
            status === "success"
              ? "bg-[#2f9e5e] text-white"
              : status === "error"
                ? "bg-red-600 text-white"
                : "btn-primary"
          } ${status === "submitting" ? "opacity-70" : ""}`}
        >
          {status === "submitting"
            ? "Envoi en cours..."
            : status === "success"
              ? contactForm.successLabel
              : status === "error"
                ? errorMsg || "Échec de l'envoi"
                : contactForm.submitLabel}
        </button>

        {/* Case de consentement explicite — art. 196 du Code du numérique.
            Non pré-cochée : le consentement doit être libre et explicite. */}
        <div className="mt-5">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="consent"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              required
              aria-describedby="pvs-consent-notice"
              className="mt-[3px] h-[17px] w-[17px] shrink-0 cursor-pointer accent-brand-600"
            />
            <span className="text-[13px] leading-[1.6] text-ink-700">
              {contactForm.consentLabel}{" "}
              <Link
                href={contactForm.consentLinkHref}
                className="font-bold text-brand-600 underline underline-offset-2 hover:text-brand-700"
              >
                {contactForm.consentLinkLabel}
              </Link>
              .
            </span>
          </label>

          {/* Rappel : ne pas transmettre de données sensibles. */}
          <p
            id="pvs-consent-notice"
            className="mt-3 border-l-[3px] border-line pl-3 text-[12px] leading-[1.6] text-ink-500"
          >
            {contactForm.sensitiveNotice}
          </p>
        </div>
      </form>
    </div>
  );
}
