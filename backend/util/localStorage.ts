import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, "../uploads/products");

const mimeToExtension = (mimeType: string): string => {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
  };
  return map[mimeType] || ".jpg";
};

export const getPublicApiBaseUrl = (): string => {
  if (process.env.API_PUBLIC_URL) {
    return process.env.API_PUBLIC_URL.replace(/\/$/, "");
  }
  const port = process.env.PORT || "9002";
  return `http://localhost:${port}`;
};

export const saveLocalProductImage = async (
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> => {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const ext = path.extname(fileName) || mimeToExtension(mimeType);
  const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  const filePath = path.join(UPLOAD_DIR, uniqueName);

  await fs.writeFile(filePath, buffer);

  return `${getPublicApiBaseUrl()}/uploads/products/${uniqueName}`;
};
