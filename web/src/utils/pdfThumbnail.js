import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

// Set worker source using Vite's URL asset import
if (typeof window !== "undefined" && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
}

/**
 * Renders the first page of a PDF (from a File, Blob, ArrayBuffer, or URL)
 * into a JPEG Blob suitable for a tile cover image.
 *
 * @param {File|Blob|ArrayBuffer|string} source
 * @param {number} [maxWidth=1200]
 * @returns {Promise<Blob>}
 */
export async function generatePdfThumbnailBlob(source, maxWidth = 1200) {
  let loadingTask;

  if (typeof source === "string") {
    loadingTask = pdfjsLib.getDocument({ url: source });
  } else if (source instanceof File || source instanceof Blob) {
    const arrayBuffer = await source.arrayBuffer();
    loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  } else if (source instanceof ArrayBuffer) {
    loadingTask = pdfjsLib.getDocument({ data: source });
  } else {
    throw new Error("Érvénytelen PDF forrás.");
  }

  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);

  // Calculate scale based on desired maximum width
  const unscaledViewport = page.getViewport({ scale: 1 });
  const scale = Math.min(maxWidth / unscaledViewport.width, 2);
  const viewport = page.getViewport({ scale: Math.max(scale, 1) });

  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);

  const canvasContext = canvas.getContext("2d", { alpha: false });
  if (!canvasContext) {
    throw new Error("A böngésző nem tudott 2D canvas kontextust létrehozni.");
  }

  // White background in case PDF has transparent areas
  canvasContext.fillStyle = "#ffffff";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({
    canvasContext,
    viewport,
  }).promise;

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Nem sikerült a képet előállítani a canvasból."));
      },
      "image/jpeg",
      0.88
    );
  });

  return blob;
}
