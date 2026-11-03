/**
 * lib/consent.ts
 *
 * Consentement à la mesure d'audience (cookie local « pvs-consent »).
 *
 * La politique de confidentialité (/confidentialite) annonce que la mesure
 * d'audience ne démarre qu'après acceptation : le code doit donc REFUSER
 * de tracer tant que l'utilisateur n'a pas donné son accord.
 *
 * Le cookie ne contient qu'un indicateur de choix (« accepted » ou
 * « refused »). Il n'est pas accessible aux scripts d'une page tierce
 * (pas de domaine externe, pas de lecture par un tiers).
 *
 * ⚠️ Toute évolution de ce mécanisme doit être répercutée dans
 * `lib/content.ts` (section « Cookies et stockage local »), sinon la
 * politique de confidentialité décrit un fonctionnement qui n'est plus le
 * sien.
 */

export const CONSENT_COOKIE_NAME = "pvs-consent";

/** 12 mois — durée annoncée dans la politique de confidentialité. */
export const CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type ConsentChoice = "accepted" | "refused";

/** Événement émis quand le choix change, pour réactiver le traceur. */
export const CONSENT_CHANGED_EVENT = "pvs:consent-changed";

/** Événement émis pour rouvrir le bandeau (lien « Gérer mes préférences »). */
export const CONSENT_REQUEST_EVENT = "pvs:consent-request";

/**
 * Événement émis à chaque ouverture/fermeture du bandeau, avec
 * `detail.visible`. Permet à d'autres composants (bouton WhatsApp
 * flottant) de se positionner sans dupliquer la logique du bandeau.
 */
export const CONSENT_BANNER_EVENT = "pvs:consent-banner";

/**
 * Lit le choix enregistré. Retourne `null` si l'utilisateur n'a jamais
 * répondu (le bandeau doit alors être affiché).
 */
export function readConsent(): ConsentChoice | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE_NAME}=([^;]*)`),
  );
  const value = match?.[1];
  return value === "accepted" || value === "refused" ? value : null;
}

/** Enregistre le choix pour 12 mois. */
export function writeConsent(choice: ConsentChoice): void {
  if (typeof document === "undefined") return;
  const secure =
    typeof location !== "undefined" && location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${CONSENT_COOKIE_NAME}=${choice}; Max-Age=${CONSENT_COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

/** Le traceur d'audience ne s'active que si le consentement est « accepted ». */
export function hasAnalyticsConsent(): boolean {
  return readConsent() === "accepted";
}

/** Signale le changement de choix aux composants à l'écoute. */
export function notifyConsentChanged(choice: ConsentChoice): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<{ choice: ConsentChoice }>(CONSENT_CHANGED_EVENT, {
      detail: { choice },
    }),
  );
}
