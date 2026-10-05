import { useState } from "react";

import SmartLink from "../common/SmartLink";

function ImageFallback({ title }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
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

function TileImage({ item }) {
  const [failed, setFailed] = useState(false);

  if (!item.imageUrl || failed) return <ImageFallback title={item.title} />;

  return (
    <img
      src={item.imageUrl}
      alt=""
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transition-none"
    />
  );
}

function HomeTile({ item }) {
  const content = (
    <>
      <div className="aspect-[4/3] overflow-hidden bg-slate-900">
        <TileImage item={item} />
      </div>

      <div className="flex min-h-28 flex-1 items-center gap-5 border-t border-stone-200/80 px-5 py-5 sm:px-6">
        <h3 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-slate-900 transition-colors group-hover:text-amber-900 sm:text-xl">
          {item.title}
        </h3>
        {item.linkUrl && (
          <span aria-hidden="true" className="ml-auto shrink-0 text-xl text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-amber-800">
            →
          </span>
        )}
      </div>
    </>
  );

  const className = "group flex h-full flex-col overflow-hidden border border-stone-200 bg-[#fffefa] shadow-[0_8px_28px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700";

  return item.linkUrl
    ? <SmartLink to={item.linkUrl} className={className}>{content}</SmartLink>
    : <article className={className}>{content}</article>;
}

export default function HomeHighlights({ title, items = [] }) {
  if (items.length === 0) return null;

  return (
    <section className="bg-[#f4f1eb] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-9 border-t border-slate-300/80 pt-5 sm:mb-10 sm:flex sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-800 sm:text-[11px]">
              Az iskola életéből
            </p>
            <h2 className="mt-2 font-serif text-3xl leading-tight tracking-[-0.025em] text-slate-950 sm:text-4xl">
              {title || "Hírek és tudnivalók"}
            </h2>
          </div>
          <span className="mt-3 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500 sm:mt-0">
            Aktuális
          </span>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {items.map((item) => <HomeTile key={item.id} item={item} />)}
        </div>
      </div>
    </section>
  );
}
