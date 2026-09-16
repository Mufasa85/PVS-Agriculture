import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

import { getSessionFromRequest } from "@/lib/auth";
import { withApiError } from "@/lib/api";
import { detectImageMime } from "@/lib/uploads";

export const runtime = "nodejs";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export const POST = withApiError(async (request: Request) => {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Aucun fichier fourni." },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      {
        error:
          "Type de fichier non autorisé. Formats acceptés : JPG, PNG, WebP, AVIF, GIF.",
      },
      { status: 422 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Le fichier dépasse la taille maximale de 5 Mo." },
      { status: 422 },
    );
  }

  // Vérifie la signature réelle du fichier — file.type est fourni par le
  // client et falsifiable.
  const buffer = Buffer.from(await file.arrayBuffer());
  const detectedMime = detectImageMime(buffer);

  if (!detectedMime || !ALLOWED_TYPES.includes(detectedMime)) {
    return NextResponse.json(
      { error: "Le contenu du fichier n'est pas une image valide." },
      { status: 422 },
    );
  }

  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const fileName = `product-${timestamp}-${random}.${MIME_TO_EXT[detectedMime]}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  const url = `/uploads/products/${fileName}`;

  return NextResponse.json({ url }, { status: 201 });
});
