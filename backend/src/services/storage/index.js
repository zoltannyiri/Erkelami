import * as localStorage from "./localStorage.js";
import * as supabaseStorage from "./supabaseStorage.js";

const getStorageProvider = () => {
  const driver = process.env.STORAGE_DRIVER || "local";

  switch (driver) {
    case "local":
      return localStorage;

    case "supabase":
      return supabaseStorage;

    default:
      throw new Error(`Ismeretlen storage driver: ${driver}`);
  }
};

export const uploadFile = async (options) => {
  const provider = getStorageProvider();

  return provider.uploadFile(options);
};
