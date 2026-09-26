import { Link } from "react-router-dom";

export default function HomeHighlights({ title, items }) {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[1400px] px-8">

        <div className="mb-12 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">
            Hírek és tudnivalók
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const content = (
              <>
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="
                        h-full w-full object-cover
                        transition duration-500
                        group-hover:scale-105
                      "
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      Kép
                    </div>
                  )}
                </div>

                <div className="flex min-h-[86px] items-center px-6 py-5">
                  <h3
                    className="
                      text-lg font-semibold text-slate-900
                      transition-colors
                      group-hover:text-blue-700
                    "
                  >
                    {item.title}
                  </h3>

                  <span className="ml-auto text-xl text-slate-400 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </>
            );

            return item.linkUrl?.startsWith("http") ? (
              <a
                key={item.id}
                href={item.linkUrl}
                target="_blank"
                rel="noreferrer"
                className="
                  group overflow-hidden
                  border border-slate-200 bg-white
                  transition duration-300
                  hover:-translate-y-1 hover:shadow-xl
                "
              >
                {content}
              </a>
            ) : (
              <Link
                key={item.id}
                to={item.linkUrl || "#"}
                className="
                  group overflow-hidden
                  border border-slate-200 bg-white
                  transition duration-300
                  hover:-translate-y-1 hover:shadow-xl
                "
              >
                {content}
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}