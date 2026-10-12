import path from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_BUCKET_NAME = "erkelami-public";
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "application/x-zip-compressed",
];

let client;
let bucketReadyPromise;

const getFolderName = (category) => {
  switch (category) {
    case "image":
      return "images";

    case "document":
      return "documents";

    case "video":
      return "videos";

    default:
      throw new Error(`Ismeretlen fájlkategória: ${category}`);
  }
};

const getConfig = () => {
  const url = process.env.SUPABASE_URL?.trim();
  const secretKey =
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const bucketName = process.env.SUPABASE_STORAGE_BUCKET?.trim() || DEFAULT_BUCKET_NAME;

  const missingVariables = [
    ["SUPABASE_URL", url],
    ["SUPABASE_SECRET_KEY (vagy a régi SUPABASE_SERVICE_ROLE_KEY)", secretKey],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missingVariables.length > 0) {
    throw new Error(
      `A Supabase Storage nincs beállítva. Hiányzó környezeti változók: ${missingVariables.join(", ")}.`,
    );
  }

  return { url, secretKey, bucketName };
};

const getClient = () => {
  if (!client) {
    const { url, secretKey } = getConfig();

    client = createClient(url, secretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }

  return client;
};

const isNotFoundError = (error) =>
  Number(error?.status) === 404 || Number(error?.statusCode) === 404;

const getBucketOptions = () => ({
  public: true,
  fileSizeLimit: MAX_FILE_SIZE,
  allowedMimeTypes: ALLOWED_MIME_TYPES,
});

const prepareBucket = async () => {
  const supabase = getClient();
  const { bucketName } = getConfig();
  const { data: bucket, error: getBucketError } = await supabase.storage.getBucket(bucketName);

  if (getBucketError && !isNotFoundError(getBucketError)) {
    throw new Error(`Nem sikerült lekérni a Supabase Storage bucketet: ${getBucketError.message}`);
  }

  if (!bucket) {
    const { error: createBucketError } = await supabase.storage.createBucket(
      bucketName,
      getBucketOptions(),
    );

    if (createBucketError) {
      throw new Error(`Nem sikerült létrehozni a Supabase Storage bucketet: ${createBucketError.message}`);
    }

    return { bucketName, created: true };
  }

  const { error: updateBucketError } = await supabase.storage.updateBucket(
    bucketName,
    getBucketOptions(),
  );

  if (updateBucketError) {
    throw new Error(`Nem sikerült beállítani a Supabase Storage bucketet: ${updateBucketError.message}`);
  }

  return { bucketName, created: false };
};

export const ensureStorageBucket = async () => {
  if (!bucketReadyPromise) {
    bucketReadyPromise = prepareBucket().catch((error) => {
      bucketReadyPromise = undefined;
      throw error;
    });
  }

  return bucketReadyPromise;
};

export const uploadFile = async ({ file, category }) => {
  const { bucketName } = await ensureStorageBucket();
  const folderName = getFolderName(category);
  const extension = path.extname(file.originalname).toLowerCase();
  const objectPath = `${folderName}/${Date.now()}-${randomUUID()}${extension}`;
  const supabase = getClient();

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(objectPath, file.buffer, {
      contentType: file.mimetype,
      cacheControl: "31536000",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Nem sikerült feltölteni a fájlt a Supabase Storage-ba: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(objectPath);

  return {
    url: data.publicUrl,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    category,
  };
};
