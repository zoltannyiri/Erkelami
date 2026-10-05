import { useEffect, useState } from "react";
import axios from "axios";

import Hero from "../components/home/Hero";
import HomeHighlights from "../components/home/HomeHighlights";

export default function HomePage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Erkel Ferenc Alapfokú Művészeti Iskola";
  }, []);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/home")
      .then((response) => {
        setSections(response.data);
      })
      .catch((error) => {
        console.error("Homepage betöltési hiba:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const highlights = sections.find(
    (section) => section.key === "HIGHLIGHTS"
  );

  return (
    <main>
      <Hero />

      {loading ? (
        <section className="bg-[#f4f1eb] py-16 sm:py-20 lg:py-24" aria-label="Tartalom betöltése">
          <div className="mx-auto max-w-7xl animate-pulse px-5 sm:px-8">
            <div className="mb-10 border-t border-slate-300/80 pt-6 sm:mb-12">
              <div className="h-3 w-36 bg-stone-300" />
              <div className="mt-4 h-12 w-full max-w-md bg-stone-300/80" />
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {[0, 1, 2].map((item) => (
                <div key={item} className="overflow-hidden border border-stone-200 bg-[#fffefa]">
                  <div className="aspect-[4/3] bg-slate-300" />
                  <div className="h-28 border-t border-stone-300" />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : highlights ? (
        <HomeHighlights
          title={highlights.title}
          items={highlights.items}
        />
      ) : null}
    </main>
  );
}
