/**
 * lib/retention.ts
 *
 * Purge automatique des données personnelles dépassant leur durée de
 * conservation — exigido par la politique de confidentialité
 * (/confidentialite, section « Ce que nous collectons » : le tableau
 * « Combien de temps »).
 *
 * ⚠️ Le texte de la politique et ces constantes doivent rester
 * synchronisés : si une durée change ici, elle change aussi dans
 * `lib/content.ts` (section « durees »), et inversement.
 *
 * La purge est « opportuniste » : elle est déclenchée à l'écriture
 * d'une nouvelle donnée, pas par un cron. Un site à faible trafic
 * conservera donc quelques données légèrement au-delà de la durée
 * annoncée, jusqu'au prochain enregistrement — c'est le sens de
 * « maximum ». Le backoffice dispose par ailleurs d'une action
 * « Réinitialiser » pour vider les statistiques immédiatement.
 */

import { prisma } from "@/lib/prisma";

/** Durée de conservation des statistiques de consultation (13 mois). */
export const ANALYTICS_RETENTION_MS = 395 * 24 * 60 * 60 * 1000;

/** Durée de conservation des messages du formulaire (3 ans). */
export const CONTACT_RETENTION_MS = 3 * 365 * 24 * 60 * 60 * 1000;

/** Fréquence minimale entre deux purges (évite un DELETE à chaque écriture). */
const PURGE_THROTTLE_MS = 60 * 60 * 1000;

const globalForRetention = globalThis as unknown as {
  __lastRetentionPurge?: number;
};

/**
 * Purge les événements d'analytics et les messages de contact dont la
 * durée de conservation est dépassée.
 *
 * @returns le nombre de lignes supprimées (statistiques + messages).
 */
export async function purgeExpiredPersonalData(): Promise<number> {
  const now = Date.now();
  const last = globalForRetention.__lastRetentionPurge ?? 0;
  if (now - last < PURGE_THROTTLE_MS) return 0;
  globalForRetention.__lastRetentionPurge = now;

  try {
    const analyticsCutoff = new Date(now - ANALYTICS_RETENTION_MS);
    const contactCutoff = new Date(now - CONTACT_RETENTION_MS);

    const [analytics, contacts] = await Promise.all([
      prisma.analyticsEvent.deleteMany({
        where: { createdAt: { lt: analyticsCutoff } },
      }),
      prisma.contactMessage.deleteMany({
        where: { createdAt: { lt: contactCutoff } },
      }),
    ]);

    const deleted = analytics.count + contacts.count;
    if (deleted > 0) {
      console.log(
        `[retention] Purge : ${analytics.count} événement(s) d'analytics, ` +
          `${contacts.count} message(s) de contact.`,
      );
    }
    return deleted;
  } catch (error) {
    console.error("[retention] Échec de la purge des données expirées:", error);
    return 0;
  }
}
