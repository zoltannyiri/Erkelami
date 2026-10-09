import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceBaseUrl = "https://www.erkelzistb.hu";
const outputDirectory = path.resolve(
  process.cwd(),
  "..",
  "downloads",
  "sikereink-2025-26"
);

const pages = [
  ["Ifjúsági gitárverseny \"Luigi Legnani\" Párkány", "/ifjusagi-gitarverseny--luigi-legnani--parkany.html"],
  ["III. Soproni Regionális „Kicsinyek” Fúvós Fesztiválja Horváth Rudolf emlékére", "/iii.-soproni-regionalis--kicsinyek--fuvos-fesztivalja-horvath-rudolf-emlekere.html"],
  ["Szőnyi Erzsébet Regionális Szolfézsverseny", "/sz-nyi-erzsebet-regionalis-szolfezsverseny.html"],
  ["I. Egressy fuvolaverseny, Komárom", "/i.-egressy-fuvolaverseny%2C-komarom.html"],
  ["MENNER BERNÁT és VINCZE IMRE SZÓLÓHANGSZERES ZENEI VERSENY", "/menner-bernat-es-vincze-imre-szolohangszeres-zenei-verseny.html"],
  ["II. KONDOR FERENC SZINTETIZÁTOR-KEYBOARD VERSENY", "/ii.-kondor-ferenc-szintetizator-keyboard-verseny.html"],
  ["VI. Nemzetközi Zongoramesék Zongoraverseny", "/vi.-nemzetkoezi-zongoramesek-zongoraverseny.html"],
  ["V. Komárom-Esztergom Vármegyei Művészeti Iskolák Négykezes Fesztiválja", "/v.-komarom-esztergom-varmegyei-m-veszeti-iskolak-negykezes-fesztivalja.html"],
  ["VI. Egressy Regionális Trombitaverseny", "/vi.-egressy-regionalis-trombitaverseny.html"],
  ["LX. Komárom-Esztergom Vármegyei Zeneiskolák Kamarazene Fesztiválja", "/lx.-komarom-esztergom-varmegyei-zeneiskolak-kamarazene-fesztivalja.html"],
  ["XXI. VÉRTES – DUNAZUG RÉGIÓ ZENEISKOLÁINAK GITÁR VERSENYE", "/xxi.-vertes---dunazug-regio-zeneiskolainak-gitar-versenye-.html"],
  ["III. Zeneiskolai Rézfúvós Fesztivál", "/iii.-zeneiskolai-rezfuvos-fesztival.html"],
  ["„Horváth József” Regionális Vonós és Akkordikus Fesztivál", "/-horvath-jozsef--regionalis-vonos-es-akkordikus-fesztival.html"],
  ["Danubia Talents Nemzetközi Zenei Verseny", "/danubia-talents-nemzetkoezi-zenei-verseny.html"],
  ["Erkel háziverseny", "/erkel-haziverseny.html"],
  ["Hegedű-, brácsa- és gordonkaverseny", "/heged---bracsa--es-gordonkaverseny.html"],
  ["XV. Fafúvós Fesztivál", "/xv.-fafuvos-fesztival.html"],
];

const decodeHtml = (value) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&#x2F;", "/");

const safeFilePart = (value) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 90);

const extractPdfUrls = (html, pageUrl) => {
  const candidates = [];
  const attributePattern = /(?:href|src|data-src|data-url)=["']([^"']+)["']/gi;
  const rawUrlPattern = /https?:\\?\/\\?\/[^"'<>\s]+?\.pdf(?:\?[^"'<>\s]*)?/gi;

  for (const match of html.matchAll(attributePattern)) {
    candidates.push(decodeHtml(match[1]).replaceAll("\\/", "/"));
  }

  for (const match of html.matchAll(rawUrlPattern)) {
    candidates.push(decodeHtml(match[0]).replaceAll("\\/", "/"));
  }

  const pdfUrls = new Set();

  for (const candidate of candidates) {
    if (!candidate.toLowerCase().includes(".pdf")) continue;

    try {
      const resolved = new URL(candidate, pageUrl);

      if (resolved.pathname.toLowerCase().endsWith(".pdf")) {
        pdfUrls.add(resolved.href);
        continue;
      }

      for (const value of resolved.searchParams.values()) {
        if (!value.toLowerCase().includes(".pdf")) continue;
        pdfUrls.add(new URL(value, pageUrl).href);
      }
    } catch {
      // A hibás, nem URL-ként értelmezhető oldalrészleteket kihagyjuk.
    }
  }

  return [...pdfUrls];
};

const downloadPdf = async (pdfUrl, targetPath) => {
  const response = await fetch(pdfUrl);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = Buffer.from(await response.arrayBuffer());

  if (data.subarray(0, 5).toString("ascii") !== "%PDF-") {
    throw new Error("A letöltött tartalom nem PDF.");
  }

  await writeFile(targetPath, data);
  return data.length;
};

async function main() {
  await mkdir(outputDirectory, { recursive: true });

  const manifest = [];
  let downloadedCount = 0;

  for (const [pageIndex, [title, pagePath]] of pages.entries()) {
    const pageUrl = new URL(pagePath, sourceBaseUrl).href;
    const pageResponse = await fetch(pageUrl);

    if (!pageResponse.ok) {
      manifest.push({
        title,
        pageUrl,
        files: [],
        error: `Az oldal nem tölthető le: HTTP ${pageResponse.status}`,
      });
      continue;
    }

    const html = await pageResponse.text();
    const pdfUrls = extractPdfUrls(html, pageUrl);
    const files = [];

    for (const [pdfIndex, pdfUrl] of pdfUrls.entries()) {
      const urlFileName = decodeURIComponent(
        new URL(pdfUrl).pathname.split("/").at(-1) || "dokumentum.pdf"
      );
      const originalBaseName = path.basename(urlFileName, path.extname(urlFileName));
      const fileName = [
        String(pageIndex + 1).padStart(2, "0"),
        safeFilePart(title),
        pdfUrls.length > 1 ? String(pdfIndex + 1).padStart(2, "0") : null,
        safeFilePart(originalBaseName),
      ]
        .filter(Boolean)
        .join("--")
        .concat(".pdf");
      const targetPath = path.join(outputDirectory, fileName);

      try {
        const size = await downloadPdf(pdfUrl, targetPath);
        files.push({ fileName, sourceUrl: pdfUrl, size });
        downloadedCount += 1;
      } catch (error) {
        files.push({ sourceUrl: pdfUrl, error: error.message });
      }
    }

    manifest.push({ title, pageUrl, files });
  }

  const manifestPath = path.join(outputDirectory, "jegyzek.json");
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log(
    JSON.stringify(
      {
        outputDirectory,
        pagesChecked: pages.length,
        downloadedCount,
        pagesWithPdf: manifest.filter((entry) =>
          entry.files.some((file) => file.fileName)
        ).length,
        pagesWithoutPdf: manifest
          .filter((entry) => !entry.files.some((file) => file.fileName))
          .map((entry) => entry.title),
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
