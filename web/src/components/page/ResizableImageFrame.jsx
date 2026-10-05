const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

export default function ResizableImageFrame({
  children,
  className = "",
  editorMode = false,
  widthPercent,
  heightPx,
  onResize,
}) {
  const safeWidth = Number.isFinite(Number(widthPercent)) ? clamp(Number(widthPercent), 25, 100) : null;
  const safeHeight = Number.isFinite(Number(heightPx)) ? clamp(Number(heightPx), 160, 720) : null;

  const startResize = (event, axis) => {
    event.preventDefault();
    event.stopPropagation();
    const handle = event.currentTarget;
    const frame = handle.parentElement;
    const parent = frame?.parentElement;
    if (!frame || !parent) return;

    handle.setPointerCapture(event.pointerId);
    handle.dataset.resizeAxis = axis;
    handle.dataset.resizeStartX = String(event.clientX);
    handle.dataset.resizeStartY = String(event.clientY);
    handle.dataset.resizeStartWidth = String(safeWidth || (frame.getBoundingClientRect().width / parent.getBoundingClientRect().width) * 100);
    handle.dataset.resizeStartHeight = String(safeHeight || frame.getBoundingClientRect().height);
    handle.dataset.resizeParentWidth = String(parent.getBoundingClientRect().width);
  };

  const handleResize = (event) => {
    const handle = event.currentTarget;
    const axis = handle.dataset.resizeAxis;
    if (!axis || !onResize) return;

    const startX = Number(handle.dataset.resizeStartX);
    const startY = Number(handle.dataset.resizeStartY);
    const startWidth = Number(handle.dataset.resizeStartWidth);
    const startHeight = Number(handle.dataset.resizeStartHeight);
    const parentWidth = Number(handle.dataset.resizeParentWidth);

    const next = {};
    if (axis.includes("x")) {
      next.widthPercent = Math.round(clamp(startWidth + ((event.clientX - startX) / parentWidth) * 100, 25, 100));
    }
    if (axis.includes("y")) {
      next.heightPx = Math.round(clamp(startHeight + event.clientY - startY, 160, 720));
    }
    onResize(next);
  };

  const stopResize = (event) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    delete event.currentTarget.dataset.resizeAxis;
  };

  const customStyle = {
    ...(safeWidth ? { "--image-editor-width": `${safeWidth}%` } : {}),
    ...(safeHeight ? { "--image-editor-height": `${safeHeight}px` } : {}),
  };
  const dimensionClasses = `${safeWidth ? "w-full md:w-[var(--image-editor-width)]" : ""} ${safeHeight ? "md:h-[var(--image-editor-height)] md:max-h-[min(70vh,720px)]" : ""}`;

  const handleProps = (axis) => ({
    onPointerDown: (event) => startResize(event, axis),
    onPointerMove: handleResize,
    onPointerUp: stopResize,
    onPointerCancel: stopResize,
    style: { touchAction: "none" },
  });

  return (
    <div style={customStyle} className={`relative ${dimensionClasses} ${className}`}>
      {children}
      {editorMode && onResize && (
        <>
          <button type="button" aria-label="Kép szélességének módosítása" title="Húzd a kép szélességéhez" {...handleProps("x")} className="absolute inset-y-0 right-0 z-20 w-3 cursor-ew-resize border-r-4 border-amber-500/90 bg-transparent" />
          <button type="button" aria-label="Kép magasságának módosítása" title="Húzd a kép magasságához" {...handleProps("y")} className="absolute inset-x-0 bottom-0 z-20 h-3 cursor-ns-resize border-b-4 border-amber-500/90 bg-transparent" />
          <button type="button" aria-label="Kép méretének módosítása" title="Húzd a kép méretéhez" {...handleProps("xy")} className="absolute bottom-0 right-0 z-30 h-5 w-5 cursor-nwse-resize border-2 border-white bg-amber-500 shadow" />
        </>
      )}
    </div>
  );
}
