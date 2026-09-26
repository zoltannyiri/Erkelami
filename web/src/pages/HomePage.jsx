import { useEffect, useState } from "react";
import axios from "axios";

import Hero from "../components/home/Hero";
import HomeHighlights from "../components/home/HomeHighlights";

export default function HomePage() {
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

  if (loading) {
    return null;
  }

  return (
    <main>
      <Hero />

      {highlights && (
        <HomeHighlights
          title={highlights.title}
          items={highlights.items}
        />
      )}
    </main>
  );
}