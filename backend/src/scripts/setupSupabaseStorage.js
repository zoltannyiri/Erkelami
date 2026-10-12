import "dotenv/config";
import { ensureStorageBucket } from "../services/storage/supabaseStorage.js";

try {
  const { bucketName, created } = await ensureStorageBucket();
  const action = created ? "létrehozva" : "ellenőrizve és frissítve";

  console.log(`A(z) "${bucketName}" Supabase Storage bucket ${action}.`);
  console.log("A bucket nyilvános; a feltöltött fájlok publikus URL-ről érhetők el.");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
