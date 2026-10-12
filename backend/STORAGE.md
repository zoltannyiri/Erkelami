# Fájltárolás

A backend két tárolási módot támogat:

- `local`: a fájlokat a `backend/uploads` mappába menti;
- `supabase`: a fájlokat egy nyilvános Supabase Storage bucketbe tölti.

## Supabase Storage beállítása

1. A Supabase projekt **Settings / API Keys** oldalán keresd ki a projekt URL-jét és hozz létre vagy másold ki a Secret key-t.
2. A lokális és a VPS-en használt backend `.env` fájlban állítsd be:

   ```env
   STORAGE_DRIVER=supabase
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_SECRET_KEY=sb_secret_your-secret-key
   SUPABASE_STORAGE_BUCKET=erkelami-public
   ```

3. A backend mappájában futtasd:

   ```sh
   npm run storage:setup
   ```

A parancs létrehozza a bucketet, ha még nincs, illetve nyilvánosra állítja és beállítja a jelenlegi fájltípus- és méretkorlátokat. Az első feltöltés ugyanezt az ellenőrzést automatikusan is elvégzi.

## Biztonság

A `SUPABASE_SECRET_KEY` teljes hozzáférést ad a Storage-hoz. Kizárólag a backend `.env` fájljában legyen, ne kerüljön frontend-kódba, Gitbe vagy Vercel frontend-változóba. A régi `SUPABASE_SERVICE_ROLE_KEY` változót a kód átmenetileg továbbra is elfogadja.
