import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import RecursiveMenu from "./RecursiveMenu";

export default function Navbar() {
  const [successItems, setSuccessItems] = useState([]);

  useEffect(() => {
    axios
      .get(
        import.meta.env.VITE_API_URL +
          "/api/navigation?menuKey=SUCCESSES"
      )
      .then((response) => {
        setSuccessItems(response.data);
      })
      .catch((error) => {
        console.error("Navigation betöltési hiba:", error);
      });
  }, []);

  const navClass =
    "relative py-7 text-[15px] font-medium text-slate-700 " +
    "transition-colors duration-200 hover:text-slate-950 " +
    "after:absolute after:bottom-5 after:left-0 after:h-[2px] " +
    "after:w-0 after:bg-blue-700 after:transition-all " +
    "after:duration-300 hover:after:w-full";

  return (
    <header className="relative z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8">

        <Link to="/" className="flex flex-col">
          <span className="text-xl font-semibold tracking-tight text-slate-950">
            Erkel Ferenc
          </span>

          <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Alapfokú Művészeti Iskola
          </span>
        </Link>

        <nav className="flex items-center gap-9">
          <Link to="/" className={navClass}>
            Kezdőlap
          </Link>

          <Link to="/iskolank" className={navClass}>
            Iskolánk
          </Link>

          <Link to="/oktatas" className={navClass}>
            Oktatás
          </Link>

          <div className="group relative">
            <button className={`${navClass} flex items-center gap-1`}>
              Sikereink

              <span className="text-xs transition-transform duration-200 group-hover:rotate-180">
                ▼
              </span>
            </button>

            <div
              className="
                invisible absolute left-1/2 top-full
                min-w-[240px] -translate-x-1/2 translate-y-2
                border border-slate-200 bg-white
                py-2 opacity-0 shadow-xl
                transition-all duration-200
                group-hover:visible
                group-hover:translate-y-0
                group-hover:opacity-100
              "
            >
              <RecursiveMenu items={successItems} />
            </div>
          </div>

          <Link to="/galeria" className={navClass}>
            Galéria
          </Link>

          <Link to="/kapcsolat" className={navClass}>
            Kapcsolat
          </Link>
        </nav>
      </div>
    </header>
  );
}