import { useEffect } from "react";

export default function ImageLightbox({ isOpen, onClose, imageUrl, title }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-2 sm:p-4 md:p-6 backdrop-blur-sm select-none"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Plakát megtekintése"}
      onClick={onClose}
    >
      {/* Floating Top Controls (does not push or reduce image height) */}
      <div className="pointer-events-none fixed inset-x-3 top-3 z-[110] flex items-center justify-between sm:inset-x-6 sm:top-5">
        {title ? (
          <div className="pointer-events-auto max-w-[60vw] truncate rounded-full border border-white/15 bg-black/60 px-4 py-2 text-xs font-medium text-white shadow-xl backdrop-blur-md sm:max-w-[70vw] sm:text-sm">
            {title}
          </div>
        ) : (
          <div />
        )}

        <div className="pointer-events-auto flex items-center gap-2">

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer  inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-md transition hover:scale-105 hover:bg-white/25 active:scale-95 focus-visible:outline-2 focus-visible:outline-white sm:h-10 sm:w-10"
            aria-label="Bezárás"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Poster Container - Expands to full height without header obstruction */}
      <div
        className="relative flex max-h-[92vh] max-w-[94vw] cursor-default items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={title || "Plakát"}
          className="max-h-[90vh] w-auto max-w-[94vw] rounded-xl border border-white/15 object-contain shadow-[0_25px_70px_rgba(0,0,0,0.9)] sm:max-h-[93vh]"
        />
      </div>
    </div>
  );
}
