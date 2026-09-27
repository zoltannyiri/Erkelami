import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import PageSectionRenderer from "../components/page/PageSectionRenderer";

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
      <div className="mx-auto max-w-[1200px] px-8 pt-16">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          {page.title}
        </h1>
      </div>

      {page.sections?.map((section) => (
        <PageSectionRenderer
          key={section.id}
          section={section}
        />
      ))}
    </main>
  );
}