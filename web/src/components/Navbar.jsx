import { useEffect, useState } from "react";
import axios from "axios";
import RecursiveMenu from "./RecursiveMenu";
import SmartLink from "./common/SmartLink";

function MobileMenuItem({ item, onNavigate }) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children?.length > 0;

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <div className="flex items-center justify-between">
        {item.url ? (
          <SmartLink
            to={item.url}
            onClick={onNavigate}
            className="flex-1 py-2.5 text-sm font-medium text-slate-700 transition hover:text-slate-950"
          >
            {item.label}
          </SmartLink>
        ) : (
          <span className="flex-1 py-2.5 text-sm font-medium text-slate-700">
            {item.label}
          </span>
        )}

        {hasChildren && (
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-label={`${item.label} almenü ${open ? "összecsukása" : "lenyitása"}`}
            className="cursor-pointer p-2 text-slate-500 hover:text-slate-900"
          >
            <span
              className={`inline-block text-xs transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>
        )}
      </div>

      {hasChildren && open && (
        <div className="ml-3 space-y-1 border-l border-slate-200 pl-3 pb-2">
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
      .get(
        import.meta.env.VITE_API_URL +
          "/api/navigation?menuKey=SUCCESSES"
      )
      .then((response) => {
        setSuccessItems(response.data);
      })
      .catch((error) => {
        console.error("Navigation betöltési hiba:", error);
      });
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const navClass =
    "relative py-7 text-[15px] font-medium text-slate-700 " +
    "transition-colors duration-200 hover:text-slate-950 " +
    "after:absolute after:bottom-5 after:left-0 after:h-[2px] " +
    "after:w-0 after:bg-blue-700 after:transition-all " +
    "after:duration-300 hover:after:w-full";

  return (
    <header className="relative z-50 border-b border-slate-200 bg-white">
      {/* Desktop & Mobile Header Bar */}
      <div className="mx-auto flex w-full items-center justify-between px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        {/* Brand / Logo */}
        <div className="py-4 lg:justify-self-center lg:py-0">
          <SmartLink to="/" onClick={closeMobile} className="flex flex-col">
            <span className="text-xl font-semibold tracking-tight text-slate-950">
              Erkel Ferenc
            </span>

            <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Alapfokú Művészeti Iskola
            </span>
          </SmartLink>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-9 lg:flex">
          <SmartLink to="/" className={navClass}>
            Kezdőlap
          </SmartLink>

          <div className="group relative">
            <button
              type="button"
              className={`${navClass} flex cursor-pointer items-center gap-1`}
            >
              Sikereink
              <span className="text-xs transition-transform duration-200 group-hover:rotate-180">
                ▼
              </span>
            </button>

            <div
              className="
                invisible absolute left-1/2 top-full
                min-w-[240px] -translate-x-1/2 translate-y-2
                border border-slate-200 bg-white
                py-2 opacity-0 shadow-xl
                transition-all duration-200
                group-hover:visible
                group-hover:translate-y-0
                group-hover:opacity-100
              "
            >
              <RecursiveMenu items={successItems} />
            </div>
          </div>

          <SmartLink to="/aktualis" className={navClass}>
            Oktatás
          </SmartLink>

          <SmartLink to="/iskolank" className={navClass}>
            Iskolánkról
          </SmartLink>

          <SmartLink to="/galeria" className={navClass}>
            Galéria
          </SmartLink>

          <SmartLink to="/kapcsolat" className={navClass}>
            Kapcsolat
          </SmartLink>
        </nav>

        {/* Desktop right spacer */}
        <div className="hidden lg:block" />

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Menü bezárása" : "Menü megnyitása"}
            className="cursor-pointer rounded-sm p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-slate-950"
          >
            {mobileOpen ? (
              <svg
                className="h-6 w-6"
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
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Panel */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 shadow-lg lg:hidden">
          <nav className="flex flex-col space-y-1 text-[15px]">
            <SmartLink
              to="/"
              onClick={closeMobile}
              className="border-b border-slate-100 py-3 font-medium text-slate-700 transition hover:text-slate-950"
            >
              Kezdőlap
            </SmartLink>

            {/* Sikereink mobile accordion */}
            <div className="border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="py-3 font-medium text-slate-700">
                  Sikereink
                </span>
                {successItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setMobileSuccessesOpen((prev) => !prev)}
                    aria-expanded={mobileSuccessesOpen}
                    aria-label={`Sikereink almenü ${
                      mobileSuccessesOpen ? "összecsukása" : "lenyitása"
                    }`}
                    className="cursor-pointer p-2 text-slate-500 hover:text-slate-900"
                  >
                    <span
                      className={`inline-block text-xs transition-transform duration-200 ${
                        mobileSuccessesOpen ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                )}
              </div>

              {mobileSuccessesOpen && successItems.length > 0 && (
                <div className="ml-3 space-y-1 border-l border-slate-200 pl-3 pb-2">
                  {successItems.map((item) => (
                    <MobileMenuItem
                      key={item.id}
                      item={item}
                      onNavigate={closeMobile}
                    />
                  ))}
                </div>
              )}
            </div>

            <SmartLink
              to="/aktualis"
              onClick={closeMobile}
              className="border-b border-slate-100 py-3 font-medium text-slate-700 transition hover:text-slate-950"
            >
              Oktatás
            </SmartLink>

            <SmartLink
              to="/iskolank"
              onClick={closeMobile}
              className="border-b border-slate-100 py-3 font-medium text-slate-700 transition hover:text-slate-950"
            >
              Iskolánkról
            </SmartLink>

            <SmartLink
              to="/galeria"
              onClick={closeMobile}
              className="border-b border-slate-100 py-3 font-medium text-slate-700 transition hover:text-slate-950"
            >
              Galéria
            </SmartLink>

            <SmartLink
              to="/kapcsolat"
              onClick={closeMobile}
              className="py-3 font-medium text-slate-700 transition hover:text-slate-950"
            >
              Kapcsolat
            </SmartLink>
          </nav>
        </div>
      )}
    </header>
  );
}