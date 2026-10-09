import { useEffect, useState } from "react";
import axios from "axios";

import RecursiveMenu from "./RecursiveMenu";
import SmartLink from "./common/SmartLink";

const mobileLinkClass = "rounded-sm px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-stone-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-700";

function MobileMenuItem({ item, onNavigate }) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children?.length > 0;

  return (
    <div className="border-b border-stone-200/70 last:border-b-0">
      <div className="flex items-center justify-between gap-2">
        {item.url ? (
          <SmartLink to={item.url} onClick={onNavigate} className="flex-1 py-2.5 text-sm font-medium text-slate-700 transition hover:text-amber-900">
            {item.label}
          </SmartLink>
        ) : (
          <span className="flex-1 py-2.5 text-sm font-medium text-slate-700">{item.label}</span>
        )}

        {hasChildren && (
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            aria-label={`${item.label} almenü ${open ? "összecsukása" : "lenyitása"}`}
            className="rounded-sm p-2 text-slate-500 transition hover:bg-stone-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-amber-700"
          >
            <span className={`inline-block text-[10px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▼</span>
          </button>
        )}
      </div>

      {hasChildren && open && (
        <div className="mb-2 ml-2 border-l border-amber-700/25 pl-4">
          {item.children.map((child) => (
            <MobileMenuItem key={child.id} item={child} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [successItems, setSuccessItems] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSuccessesOpen, setMobileSuccessesOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/navigation?menuKey=SUCCESSES`)
      .then((response) => setSuccessItems(response.data))
      .catch((error) => console.error("Navigation betöltési hiba:", error));
  }, []);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileSuccessesOpen(false);
  };

  const navClass = "rounded-full px-4 py-2.5 text-sm font-semibold text-slate-600 transition duration-200 hover:bg-stone-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700";

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/90 bg-[#fffefa]/90 shadow-[0_1px_0_rgba(15,23,42,0.02)] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.75rem] w-full max-w-7xl items-center justify-between gap-8 px-5 sm:px-8">
        <SmartLink to="/" onClick={closeMobile} className="group flex shrink-0 items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700">
          <span aria-hidden="true" className="h-9 w-[3px] bg-amber-700 transition group-hover:h-11" />
          <span className="flex flex-col">
            <span className="font-serif text-xl font-semibold leading-none tracking-[-0.02em] text-slate-950">Erkel Ferenc</span>
            <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.19em] text-slate-500">Alapfokú Művészeti Iskola</span>
          </span>
        </SmartLink>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Fő navigáció">
          <SmartLink to="/" className={navClass}>Kezdőlap</SmartLink>

          <div className="group relative">
            <button type="button" className={`${navClass} flex cursor-pointer items-center gap-2`}>
              Sikereink
              <span className="text-[9px] text-slate-400 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180">▼</span>
            </button>

            <div className="invisible absolute left-1/2 top-full min-w-[250px] -translate-x-1/2 pt-2 opacity-0 transition-opacity duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="rounded-sm border border-stone-200 bg-[#fffefa] p-2 shadow-[0_20px_55px_rgba(15,23,42,0.14)]">
                <RecursiveMenu items={successItems} />
              </div>
            </div>
          </div>

          <SmartLink to="/aktualis" className={navClass}>Oktatás</SmartLink>
          <SmartLink to="/iskolank" className={navClass}>Iskolánkról</SmartLink>
          <SmartLink to="/galeria" className={navClass}>Galéria</SmartLink>
          <SmartLink to="/kapcsolat" className={navClass}>Kapcsolat</SmartLink>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Menü bezárása" : "Menü megnyitása"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-slate-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 lg:hidden"
        >
          <span className="relative h-4 w-5" aria-hidden="true">
            <span className={`absolute left-0 top-0 h-[1.5px] w-5 bg-current transition ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`absolute left-0 top-[7px] h-[1.5px] w-5 bg-current transition ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 top-[14px] h-[1.5px] w-5 bg-current transition ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute inset-x-0 top-full border-b border-stone-200 bg-[#fffefa]/98 px-5 py-4 shadow-[0_20px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1" aria-label="Mobil navigáció">
            <SmartLink to="/" onClick={closeMobile} className={mobileLinkClass}>Kezdőlap</SmartLink>

            <div className="border-y border-stone-200/80 py-1">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-2 text-sm font-semibold text-slate-700">Sikereink</span>
                {successItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setMobileSuccessesOpen((current) => !current)}
                    aria-expanded={mobileSuccessesOpen}
                    aria-label={`Sikereink almenü ${mobileSuccessesOpen ? "összecsukása" : "lenyitása"}`}
                    className="rounded-full p-2.5 text-slate-500 transition hover:bg-stone-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-amber-700"
                  >
                    <span className={`inline-block text-[10px] transition-transform duration-200 ${mobileSuccessesOpen ? "rotate-180" : ""}`}>▼</span>
                  </button>
                )}
              </div>

              {mobileSuccessesOpen && successItems.length > 0 && (
                <div className="mx-3 mb-2 border-l border-amber-700/25 pl-4">
                  {successItems.map((item) => (
                    <MobileMenuItem key={item.id} item={item} onNavigate={closeMobile} />
                  ))}
                </div>
              )}
            </div>

            <SmartLink to="/aktualis" onClick={closeMobile} className={mobileLinkClass}>Oktatás</SmartLink>
            <SmartLink to="/iskolank" onClick={closeMobile} className={mobileLinkClass}>Iskolánkról</SmartLink>
            <SmartLink to="/galeria" onClick={closeMobile} className={mobileLinkClass}>Galéria</SmartLink>
            <SmartLink to="/kapcsolat" onClick={closeMobile} className={mobileLinkClass}>Kapcsolat</SmartLink>
          </nav>
        </div>
      )}
    </header>
  );
}
