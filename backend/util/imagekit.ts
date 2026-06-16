import ImageKit, { toFile } from "@imagekit/nodejs";

let imageKitClient: ImageKit | null = null;

export const getImageKitUrlEndpoint = (): string => {
  if (process.env.IMAGEKIT_URL_ENDPOINT) {
    return process.env.IMAGEKIT_URL_ENDPOINT.replace(/\/$/, "");
  }
  if (process.env.IMAGEKIT_ID) {
    return `https://ik.imagekit.io/${process.env.IMAGEKIT_ID}`;
  }
  return "";
};

export const isImageKitConfigured = (): boolean => {
  return Boolean(process.env.IMAGEKIT_PRIVATE_KEY);
};

export const getImageKitClient = (): ImageKit => {
  if (!isImageKitConfigured()) {
    throw new Error(
      "ImageKit is not configured. Set IMAGEKIT_PRIVATE_KEY in your environment."
    );
  }

  if (!imageKitClient) {
    imageKitClient = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    });
  }

  return imageKitClient;
};

export const uploadToImageKit = async (
  buffer: Buffer,
  fileName: string
): Promise<string> => {
  const safeName = fileName || `product-${Date.now()}.jpg`;

  const response = await getImageKitClient().files.upload({
    file: await toFile(buffer, safeName),
    fileName: safeName,
    folder: process.env.IMAGEKIT_FOLDER || "/siliconbazaar",
  });

  if (!response.url) {
    throw new Error("ImageKit upload did not return a URL");
  }

  return response.url;
};
