import assert from "node:assert/strict";
import test from "node:test";

test("létrehozza a bucketet és publikus Supabase URL-t ad vissza", async (t) => {
  const originalFetch = globalThis.fetch;
  const originalEnvironment = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET,
  };
  const requests = [];

  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SECRET_KEY = "sb_secret_test-key";
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.SUPABASE_STORAGE_BUCKET = "erkelami-test";

  globalThis.fetch = async (input, options = {}) => {
    const url = String(input);
    const method = options.method || "GET";
    requests.push({ method, url });

    if (method === "GET" && url.endsWith("/storage/v1/bucket/erkelami-test")) {
      return Response.json({ message: "Bucket not found" }, { status: 404 });
    }

    if (method === "POST" && url.endsWith("/storage/v1/bucket")) {
      return Response.json({ name: "erkelami-test" });
    }

    if (method === "POST" && url.includes("/storage/v1/object/erkelami-test/documents/")) {
      return Response.json({ Id: "file-id", Key: "erkelami-test/documents/file.pdf" });
    }

    return Response.json({ message: `Nem várt kérés: ${method} ${url}` }, { status: 500 });
  };

  t.after(() => {
    globalThis.fetch = originalFetch;

    for (const [name, value] of Object.entries(originalEnvironment)) {
      if (value === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = value;
      }
    }
  });

  const { uploadFile } = await import("../src/services/storage/supabaseStorage.js");
  const result = await uploadFile({
    file: {
      originalname: "tajekoztato.pdf",
      mimetype: "application/pdf",
      size: 4,
      buffer: Buffer.from("test"),
    },
    category: "document",
  });

  assert.match(
    result.url,
    /^https:\/\/example\.supabase\.co\/storage\/v1\/object\/public\/erkelami-test\/documents\/.+\.pdf$/,
  );
  assert.equal(result.originalName, "tajekoztato.pdf");
  assert.deepEqual(
    requests.map(({ method }) => method),
    ["GET", "POST", "POST"],
  );
});
