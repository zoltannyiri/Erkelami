export async function trimTransparentEdges(file) {
  if (!file || !["image/png", "image/webp"].includes(file.type)) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      if (!width || !height) return resolve(file);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return resolve(file);

      ctx.drawImage(img, 0, 0);
      let imgData;
      try {
        imgData = ctx.getImageData(0, 0, width, height);
      } catch {
        return resolve(file);
      }
      const data = imgData.data;

      let top = null;
      let bottom = null;
      let left = width;
      let right = 0;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const alpha = data[(y * width + x) * 4 + 3];
          if (alpha > 15) {
            if (top === null) top = y;
            bottom = y;
            if (x < left) left = x;
            if (x > right) right = x;
          }
        }
      }

      if ( top === null || (top <= 2 && bottom >= height - 3 && left <= 2 && right >= width - 3)) {
        return resolve(file);
      }

      const cropWidth = right - left + 1;
      const cropHeight = bottom - top + 1;

      if (cropWidth <= 0 || cropHeight <= 0) return resolve(file);

      const croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = cropWidth;
      croppedCanvas.height = cropHeight;
      const croppedCtx = croppedCanvas.getContext("2d");
      if (!croppedCtx) return resolve(file);

      croppedCtx.drawImage(
        canvas,
        left,
        top,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      croppedCanvas.toBlob(
        (blob) => {
          if (!blob) return resolve(file);
          const trimmedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(trimmedFile);
        },
        file.type
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}
