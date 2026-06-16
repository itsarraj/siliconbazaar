import { uploadToImageKit, isImageKitConfigured } from "../util/imagekit.js";
import { saveLocalProductImage } from "../util/localStorage.js";

export const uploadProductImage = async (
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> => {
  if (isImageKitConfigured()) {
    return uploadToImageKit(buffer, fileName);
  }

  return saveLocalProductImage(buffer, fileName, mimeType);
};
