import { unlink } from "fs/promises";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * Supprime un fichier uploadé localement (URL commençant par /uploads/).
 * Ignore silencieusement les URLs externes et les fichiers déjà absents.
 */
export async function deleteLocalUpload(url: string | null | undefined) {
  if (!url || !url.startsWith("/uploads/")) return;

  const relative = url.slice("/uploads/".length);
  const filePath = path.join(UPLOADS_DIR, relative);

  // Garde-fou contre la traversée de répertoires
  if (!path.resolve(filePath).startsWith(path.resolve(UPLOADS_DIR))) return;

  try {
    await unlink(filePath);
  } catch {
    // Fichier déjà absent du disque — rien à faire
  }
}

export async function deleteLocalUploads(urls: (string | null | undefined)[]) {
  await Promise.all(urls.map(deleteLocalUpload));
}

/**
 * Détecte le type MIME réel d'une image via ses magic bytes.
 * Retourne null si la signature n'est pas une image reconnue.
 */
export function detectImageMime(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  // JPEG : FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // PNG : 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }

  // GIF : "GIF8"
  if (buffer.subarray(0, 4).toString("ascii") === "GIF8") {
    return "image/gif";
  }

  // WebP : "RIFF"...."WEBP"
  if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }

  // AVIF : ...."ftyp" + brand "avif"/"avis"
  if (
    buffer.subarray(4, 8).toString("ascii") === "ftyp" &&
    ["avif", "avis"].includes(buffer.subarray(8, 12).toString("ascii"))
  ) {
    return "image/avif";
  }

  return null;
}
