import SmartLink from "./common/SmartLink";

const quickLinks = [
  { label: "Kezdőlap", href: "/" },
  { label: "Iskolánkról", href: "/iskolank" },
  { label: "Oktatás", href: "/aktualis" },
  { label: "Galéria", href: "/galeria" },
  { label: "Kapcsolat", href: "/kapcsolat" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <SmartLink to="/" className="inline-block">
              <span className="text-xl font-semibold tracking-tight text-white">
                Erkel Ferenc
              </span>
              <span className="block text-xs uppercase tracking-[0.2em] text-amber-500/90">
                Alapfokú Művészeti Iskola
              </span>
            </SmartLink>
            {/* <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
              Tatabánya zenei és művészeti oktatásának patinás intézménye.
            </p> */}
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Gyorslinkek
            </h4>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2.5 text-sm sm:flex-col sm:space-y-2.5 sm:gap-0">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <SmartLink
                    to={link.href}
                    className="text-slate-300 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800/80 pt-6 text-center text-xs text-slate-500 sm:flex sm:items-center sm:justify-between sm:text-left">
          <p>© {currentYear} Erkel Ferenc Alapfokú Művészeti Iskola</p>
          <p className="mt-2 text-slate-500 sm:mt-0">
            Zene • Közösség • Hagyomány
          </p>
        </div>
      </div>
    </footer>
  );
}
