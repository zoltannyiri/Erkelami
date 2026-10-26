import { useState } from "react";

import SmartLink from "../common/SmartLink";
import ScrollReveal from "../ScrollReveal";
import ImageLightbox from "../common/ImageLightbox";

const tilePalettes = [
  {
    accent: "bg-rose-700",
    surface: "bg-rose-50/70",
    hoverBorder: "hover:border-rose-300",
    hoverText: "group-hover:text-rose-800",
    arrow: "bg-rose-100 text-rose-800 group-hover:bg-rose-700 group-hover:text-white",
    overlay: "from-rose-950/45 via-transparent to-amber-100/10",
    fallback: "from-rose-800 via-rose-950 to-slate-950",
  },
  {
    accent: "bg-teal-700",
    surface: "bg-teal-50/70",
    hoverBorder: "hover:border-teal-300",
    hoverText: "group-hover:text-teal-800",
    arrow: "bg-teal-100 text-teal-800 group-hover:bg-teal-700 group-hover:text-white",
    overlay: "from-teal-950/45 via-transparent to-cyan-100/10",
    fallback: "from-teal-800 via-teal-950 to-slate-950",
  },
  {
    accent: "bg-amber-600",
    surface: "bg-amber-50/75",
    hoverBorder: "hover:border-amber-300",
    hoverText: "group-hover:text-amber-800",
    arrow: "bg-amber-100 text-amber-800 group-hover:bg-amber-600 group-hover:text-white",
    overlay: "from-amber-950/40 via-transparent to-yellow-100/10",
    fallback: "from-amber-700 via-amber-950 to-slate-950",
  },
  {
    accent: "bg-indigo-700",
    surface: "bg-indigo-50/70",
    hoverBorder: "hover:border-indigo-300",
    hoverText: "group-hover:text-indigo-800",
    arrow: "bg-indigo-100 text-indigo-800 group-hover:bg-indigo-700 group-hover:text-white",
    overlay: "from-indigo-950/45 via-transparent to-violet-100/10",
    fallback: "from-indigo-800 via-indigo-950 to-slate-950",
  },
  {
    accent: "bg-emerald-700",
    surface: "bg-emerald-50/70",
    hoverBorder: "hover:border-emerald-300",
    hoverText: "group-hover:text-emerald-800",
    arrow: "bg-emerald-100 text-emerald-800 group-hover:bg-emerald-700 group-hover:text-white",
    overlay: "from-emerald-950/45 via-transparent to-lime-100/10",
    fallback: "from-emerald-800 via-emerald-950 to-slate-950",
  },
  {
    accent: "bg-fuchsia-800",
    surface: "bg-fuchsia-50/65",
    hoverBorder: "hover:border-fuchsia-300",
    hoverText: "group-hover:text-fuchsia-800",
    arrow: "bg-fuchsia-100 text-fuchsia-800 group-hover:bg-fuchsia-800 group-hover:text-white",
    overlay: "from-fuchsia-950/45 via-transparent to-pink-100/10",
    fallback: "from-fuchsia-800 via-fuchsia-950 to-slate-950",
  },
];

function ImageFallback({ title, palette }) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${palette.fallback}`}>
      <div aria-hidden="true" className="absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-25">
        {[0, 1, 2, 3, 4].map((line) => (
          <div key={line} className="mt-3 h-px bg-amber-100/80" />
        ))}
      </div>
      <span aria-hidden="true" className="absolute bottom-0 right-4 font-serif text-9xl leading-none text-white/[0.06]">
        {String(title || "E").trim().charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

function TileImage({ item, palette }) {
  const [failed, setFailed] = useState(false);

  if (!item.imageUrl || failed) {
    return <ImageFallback title={item.title} palette={palette} />;
  }

  return (
    <>
      <img
        src={item.imageUrl}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-gradient-to-t ${palette.overlay}`}
      />
    </>
  );
}

function HomeTile({ item, index, onOpenPoster }) {
  const palette = tilePalettes[index % tilePalettes.length];

  const isPoster = Boolean(
    item.imageUrl &&
      (item.linkUrl === item.imageUrl ||
        item.linkUrl === "#poster" ||
        /\.(jpg|jpeg|png|webp)($|\?)/i.test(item.linkUrl || ""))
  );

  const isPdf =
    !isPoster &&
    Boolean(
      item.linkUrl &&
        (/\.pdf($|\?)/i.test(item.linkUrl) || item.linkUrl.includes("/documents/"))
    );

  const content = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
        <TileImage item={item} palette={palette} />
        <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 z-20 h-1 ${palette.accent}`} />

        {isPoster && (
          <span className="absolute right-3 top-3 z-20 rounded-md border border-white/15 bg-slate-950/85 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white shadow-sm backdrop-blur-sm">
            PLAKÁT
          </span>
        )}

        {isPdf && (
          <span className="absolute right-3 top-3 z-20 rounded-md border border-white/15 bg-slate-950/85 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white shadow-sm backdrop-blur-sm">
            PDF
          </span>
        )}
      </div>

      <div className={`flex min-h-28 flex-1 items-center gap-4 border-t border-white/80 px-5 py-5 sm:px-6 ${palette.surface}`}>
        <span aria-hidden="true" className={`h-10 w-1 shrink-0 rounded-full ${palette.accent}`} />
        <h3 className={`text-lg font-semibold leading-snug tracking-[-0.015em] text-slate-900 transition-colors sm:text-xl ${palette.hoverText}`}>
          {item.title}
        </h3>

        {(item.linkUrl || isPoster) && (
          <span
            aria-hidden="true"
            className={`ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition duration-300 group-hover:translate-x-1 ${palette.arrow}`}
            title={
              isPoster
                ? "Plakát megnyitása"
                : isPdf
                ? "PDF megnyitása"
                : "Megnyitás"
            }
          >
            {isPoster ? (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            ) : isPdf ? (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            )}
          </span>
        )}
      </div>
    </>
  );

  const className = `group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_10px_30px_rgba(51,38,34,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(51,38,34,0.14)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700 ${palette.hoverBorder}`;

  if (isPoster) {
    return (
      <button
        type="button"
        onClick={() => onOpenPoster(item)}
        className={`${className} cursor-pointer text-left w-full`}
      >
        {content}
      </button>
    );
  }

  return item.linkUrl
    ? <SmartLink to={item.linkUrl} className={className}>{content}</SmartLink>
    : <article className={className}>{content}</article>;
}

export default function HomeHighlights({ items = [] }) {
  const [activePoster, setActivePoster] = useState(null);

  if (items.length === 0) return null;

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#f8f1e8] py-14 sm:py-16 lg:py-20">
        <div aria-hidden="true" className="absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full bg-rose-200/35 blur-3xl" />
        <div aria-hidden="true" className="absolute -right-20 top-1/3 -z-10 h-80 w-80 rounded-full bg-teal-200/35 blur-3xl" />
        <div aria-hidden="true" className="absolute bottom-0 left-1/3 -z-10 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl" />

        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <ScrollReveal direction="up" threshold={0.05}>
            <div className="mb-9 sm:mb-10">
              <div aria-hidden="true" className="mb-5 h-px w-full bg-gradient-to-r from-rose-700 via-amber-500 to-teal-700" />
              <div className="sm:flex sm:items-end sm:justify-between">
                <div>
                  <h2 className="mt-2 font-serif text-3xl leading-tight tracking-[-0.025em] text-slate-950 sm:text-4xl">
                    Hírek és tudnivalók
                  </h2>
                </div>
                <span className="mt-4 inline-flex rounded-full bg-teal-800 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm sm:mt-0">
                  Aktuális
                </span>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {items.map((item, index) => (
              <ScrollReveal
                key={item.id}
                direction="up"
                delay={index * 120}
                threshold={0.05}
                className="h-full"
              >
                <HomeTile
                  item={item}
                  index={index}
                  onOpenPoster={(posterItem) => setActivePoster(posterItem)}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <ImageLightbox
        isOpen={Boolean(activePoster)}
        onClose={() => setActivePoster(null)}
        imageUrl={activePoster?.imageUrl}
        title={activePoster?.title}
      />
    </>
  );
}
