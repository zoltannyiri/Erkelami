import { useEffect, useState } from "react";
import axios from "axios";

import Hero from "../components/home/Hero";
import HomeHighlights from "../components/home/HomeHighlights";
import HomeFeatured from "../components/home/HomeFeatured";

export default function Home() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const featured = sections.find(
    (section) => section.key === "FEATURED"
  );

  if (loading) {
    return null;
  }

  return (
    <main>
      {/* FIX FRONTEND KOMPONENS */}
      <Hero />

      {/* ADMINBÓL SZERKESZTHETŐ */}
      {highlights && (
        <HomeHighlights
          title={highlights.title}
          items={highlights.items}
        />
      )}

      {/* ADMINBÓL SZERKESZTHETŐ */}
      {featured && (
        <HomeFeatured items={featured.items} />
      )}
    </main>
  );
}