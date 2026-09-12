import { NextResponse } from "next/server";

/**
 * Enveloppe un handler de route API : toute erreur non interceptée
 * (ex. Prisma) renvoie un JSON 500 propre au lieu d'une page HTML d'erreur.
 */
export function withApiError<T extends unknown[]>(
  handler: (request: Request, ...args: T) => Response | Promise<Response>,
) {
  return async (request: Request, ...args: T): Promise<Response> => {
    try {
      return await handler(request, ...args);
    } catch (error) {
      console.error(`[api] ${request.method} ${request.url}`, error);
      return NextResponse.json(
        { error: "Erreur serveur. Réessayez plus tard." },
        { status: 500 },
      );
    }
  };
}
