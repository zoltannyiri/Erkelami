import { useEffect, useState } from "react";
import axios from "axios";

import { DYNAMIC_NAVBAR_MENU_KEY, NAVBAR_MENUS } from "../config/navigationMenus";
import RecursiveMenu from "./RecursiveMenu";
import SmartLink from "./common/SmartLink";

const mobileLinkClass = "flex-1 rounded-sm px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-stone-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-700";
const navClass = "rounded-full px-4 py-2.5 text-sm font-semibold text-slate-600 transition duration-200 hover:bg-stone-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700";

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

function DesktopNavbarItem({ menu, items }) {
  const hasChildren = items.length > 0;
  const content = (
    <>
      {menu.label}
      {hasChildren && (
        <span className="text-[9px] text-slate-400 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180">
          ▼
        </span>
      )}
    </>
  );

  if (!hasChildren) {
    return menu.url ? (
      <SmartLink to={menu.url} className={navClass}>{menu.label}</SmartLink>
    ) : (
      <span className={navClass}>{menu.label}</span>
    );
  }

  return (
    <div className="group relative">
      {menu.url ? (
        <SmartLink to={menu.url} className={`${navClass} flex items-center gap-2`}>
          {content}
        </SmartLink>
      ) : (
        <button type="button" className={`${navClass} flex cursor-pointer items-center gap-2`}>
          {content}
        </button>
      )}

      <div className="invisible absolute left-1/2 top-full min-w-[250px] -translate-x-1/2 pt-2 opacity-0 transition-opacity duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="rounded-sm border border-stone-200 bg-[#fffefa] p-2 shadow-[0_20px_55px_rgba(15,23,42,0.14)]">
          <RecursiveMenu items={items} />
        </div>
      </div>
    </div>
  );
}

function MobileNavbarItem({ menu, items, onNavigate }) {
  const [open, setOpen] = useState(false);
  const hasChildren = items.length > 0;

  return (
    <div className="border-b border-stone-200/80 py-1 last:border-b-0">
      <div className="flex items-center justify-between gap-2">
        {menu.url ? (
          <SmartLink to={menu.url} onClick={onNavigate} className={mobileLinkClass}>
            {menu.label}
          </SmartLink>
        ) : (
          <span className={mobileLinkClass}>{menu.label}</span>
        )}

        {hasChildren && (
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            aria-label={`${menu.label} almenü ${open ? "összecsukása" : "lenyitása"}`}
            className="rounded-full p-2.5 text-slate-500 transition hover:bg-stone-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-amber-700"
          >
            <span className={`inline-block text-[10px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▼</span>
          </button>
        )}
      </div>

      {hasChildren && open && (
        <div className="mx-3 mb-2 border-l border-amber-700/25 pl-4">
          {items.map((item) => (
            <MobileMenuItem key={item.id} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [menuItems, setMenuItems] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let ignore = false;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/navigation?grouped=true`)
      .then((response) => {
        if (!ignore) setMenuItems(response.data);
      })
      .catch((error) => console.error("Navigáció betöltési hiba:", error));

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);
  const dynamicNavbarItems = menuItems[DYNAMIC_NAVBAR_MENU_KEY] || [];

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/90 bg-[#fffefa]/90 shadow-[0_1px_0_rgba(15,23,42,0.02)] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.75rem] w-full max-w-7xl items-center justify-between gap-8 px-5 sm:px-8">
        <SmartLink to="/" onClick={closeMobile} className="group flex shrink-0 items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700">
          <span aria-hidden="true" className="h-11 w-[3px] bg-amber-700 transition group-hover:h-12" />
          <span className="flex flex-col">
            <span className="mb-1 text-[10px] font-semibold uppercase tracking-[0.19em] text-slate-500">Tatabányai</span>
            <span className="font-serif text-xl font-semibold leading-none tracking-[-0.02em] text-slate-950">Erkel Ferenc</span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.19em] text-slate-500">Alapfokú Művészeti Iskola</span>
          </span>
        </SmartLink>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Fő navigáció">
          {NAVBAR_MENUS.map((menu) => (
            <DesktopNavbarItem
              key={menu.menuKey}
              menu={menu}
              items={menuItems[menu.menuKey] || []}
            />
          ))}
          {dynamicNavbarItems.map((item) => (
            <DesktopNavbarItem
              key={item.id}
              menu={item}
              items={item.children || []}
            />
          ))}
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
          <nav className="mx-auto flex max-w-7xl flex-col" aria-label="Mobil navigáció">
            {NAVBAR_MENUS.map((menu) => (
              <MobileNavbarItem
                key={menu.menuKey}
                menu={menu}
                items={menuItems[menu.menuKey] || []}
                onNavigate={closeMobile}
              />
            ))}
            {dynamicNavbarItems.map((item) => (
              <MobileNavbarItem
                key={item.id}
                menu={item}
                items={item.children || []}
                onNavigate={closeMobile}
              />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
