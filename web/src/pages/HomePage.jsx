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
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1400px] px-8 animate-pulse">
            <div className="mx-auto mb-12 h-8 w-64 rounded bg-slate-200 text-center" />
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              <div className="aspect-[4/3] rounded bg-slate-100" />
              <div className="aspect-[4/3] rounded bg-slate-100" />
              <div className="aspect-[4/3] rounded bg-slate-100" />
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