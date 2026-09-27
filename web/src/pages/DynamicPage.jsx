import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function DynamicPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/pages/${slug}`)
      .then((response) => {
        setPage(response.data);
      })
      .catch((error) => {
        console.error(error);
        setError("Az oldal nem található.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return null;
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <main>
      <h1>{page.title}</h1>

      {page.sections.map((section) => (
        <div key={section.id}>
          {section.type}
        </div>
      ))}
    </main>
  );
}