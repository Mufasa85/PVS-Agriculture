"use client";

import { useState } from "react";

import { contact, contactForm } from "@/lib/content";
import { trackQuoteRequest } from "@/lib/track";

const fieldClass =
  "w-full rounded-[10px] border-[1.5px] border-line bg-brand-50 px-[15px] py-[13px] font-sans text-[14.5px] text-ink-900 transition-colors duration-300 focus:border-brand-600 focus:bg-white focus:outline-none";
const labelClass =
  "mb-[7px] block text-[13px] font-bold text-brand-900";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const sujetStr = String(formData.get("sujet") || "");
    const payload = {
      nom: formData.get("nom"),
      telephone: formData.get("telephone"),
      email: formData.get("email"),
      sujet: sujetStr,
      message: formData.get("message"),
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
        productName: sujetStr.includes("Devis") || sujetStr.includes("Commande") ? sujetStr : undefined,
      });

      form.reset();
      setStatus("success");
      window.setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Une erreur est survenue.");
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 5000);
    }
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
        disabled={status === "submitting"}
        className={`btn mt-1.5 w-full ${
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
              ? "Échec de l'envoi"
              : contactForm.submitLabel}
      </button>

      {status === "error" && errorMsg && (
        <p className="mt-3 text-center text-sm text-red-600">{errorMsg}</p>
      )}

      <p className="mt-3.5 text-center text-xs text-ink-500">
        {contact.consentText}
      </p>
    </form>
  );
}
