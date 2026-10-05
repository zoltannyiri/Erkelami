import { useEffect } from "react";
import SmartLink from "../components/common/SmartLink";

export default function NotFoundPage({
  title = "404",
  message = "Az oldal nem található.",
  description = "A keresett oldal el lett távolítva, megváltozott a címe vagy átmenetileg nem elérhető.",
}) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "404 - Az oldal nem található | Erkel Ferenc Alapfokú Művészeti Iskola";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-800">
          Hiba
        </p>
        <h1 className="mt-2 text-6xl font-bold tracking-tight text-slate-950 sm:text-7xl">
          {title}
        </h1>
        <h2 className="mt-4 text-xl font-medium text-slate-900 sm:text-2xl">
          {message}
        </h2>
        {description && (
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {description}
          </p>
        )}
        <div className="mt-8 flex justify-center">
          <SmartLink
            to="/"
            className="inline-flex items-center justify-center bg-slate-950 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
          >
            Vissza a kezdőlapra
          </SmartLink>
        </div>
      </div>
    </main>
  );
}
