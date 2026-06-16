import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const getUploadDir = (): string => {
  if (process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT) {
    throw new Error(
      "Local uploads are not supported on serverless. Set IMAGEKIT_PRIVATE_KEY."
    );
  }

  const dirname = path.dirname(fileURLToPath(import.meta.url));
  return path.join(dirname, "../uploads/products");
};

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
  const uploadDir = getUploadDir();
  await fs.mkdir(uploadDir, { recursive: true });

  const ext = path.extname(fileName) || mimeToExtension(mimeType);
  const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  const filePath = path.join(uploadDir, uniqueName);

  await fs.writeFile(filePath, buffer);

  return `${getPublicApiBaseUrl()}/uploads/products/${uniqueName}`;
};
