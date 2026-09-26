import { Link } from "react-router-dom";

export default function HomeHighlights({ title, items }) {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[1400px] px-8">

        <div className="mb-12">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
            Aktuális
          </span>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {items.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    Kép helye
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-950">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="mt-3 leading-7 text-slate-600">
                    {item.description}
                  </p>
                )}

                {item.linkUrl && (
                  <Link
                    to={item.linkUrl}
                    className="mt-6 inline-block text-sm font-semibold text-blue-700 hover:text-blue-900"
                  >
                    {item.buttonText || "Tovább"} →
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}