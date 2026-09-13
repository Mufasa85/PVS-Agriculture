import { generateSecret, generateURI, verify } from "otplib";
import QRCode from "qrcode";

const ISSUER = "PVS-ONGD Admin";

export function generateTotpSecret(): string {
  return generateSecret();
}

export async function totpQrCodeDataUrl(
  email: string,
  secret: string,
): Promise<string> {
  const uri = generateURI({ issuer: ISSUER, label: email, secret });
  return QRCode.toDataURL(uri, { margin: 2, width: 240 });
}

/** epochTolerance 30 = ±1 période de 30 s pour absorber le décalage d'horloge. */
export async function verifyTotp(
  secret: string,
  code: string,
): Promise<boolean> {
  try {
    const result = await verify({
      secret,
      token: code.trim(),
      epochTolerance: 30,
    });
    return result.valid;
  } catch {
    return false;
  }
}
