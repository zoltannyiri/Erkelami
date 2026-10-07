import SmartLink from "./common/SmartLink";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
        <div className="grid gap-8 text-center md:text-left md:grid-cols-2 md:items-center">

          <div>
            <SmartLink to="/" className="inline-block">
              <span className="block text-2xl font-semibold text-white">
                Erkel Ferenc
              </span>

              <span className="mt-1 block text-base text-slate-400">
                Alapfokú Művészeti Iskola
              </span>
            </SmartLink>

            <p className="mt-3 text-base text-slate-500">
              Tatabánya
            </p>
          </div>

          <div className="md:text-right">
            <p className="text-sm uppercase tracking-[0.15em] text-slate-500">
              A weboldalt készítette
            </p>

            <SmartLink
              to="https://www.zoltannyiri.hu"
              className="group mt-2 inline-flex items-center gap-2 text-2xl font-semibold text-white transition-colors hover:text-sky-400"
            >
              Nyiri Zoltán
            </SmartLink>
            <div className="mt-1 text-sm text-slate-500">
              www.zoltannyiri.hu
            </div>
              
          </div>

        </div>

        <div className="mt-8 border-t border-slate-800 pt-5 text-sm text-slate-500">
          © {currentYear} Erkel Ferenc Alapfokú Művészeti Iskola
        </div>
      </div>
    </footer>
  );
}