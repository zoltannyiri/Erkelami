import { Link } from "react-router-dom";

export default function HomeFeatured({ items }) {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-8 px-8">

        {items.map((item, index) => (
          <article
            key={item.id}
            className={
              index === 0
                ? "bg-slate-950 p-10 text-white"
                : "border border-slate-200 bg-white p-10"
            }
          >
            <h2
              className={
                index === 0
                  ? "text-3xl font-semibold"
                  : "text-3xl font-semibold text-slate-950"
              }
            >
              {item.title}
            </h2>

            {item.description && (
              <p
                className={
                  index === 0
                    ? "mt-4 max-w-xl leading-7 text-slate-300"
                    : "mt-4 max-w-xl leading-7 text-slate-600"
                }
              >
                {item.description}
              </p>
            )}

            {item.linkUrl && (
              <Link
                to={item.linkUrl}
                className={
                  index === 0
                    ? "mt-8 inline-block border border-white px-5 py-3 text-sm font-medium transition hover:bg-white hover:text-slate-950"
                    : "mt-8 inline-block bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                }
              >
                {item.buttonText || "Tovább"}
              </Link>
            )}
          </article>
        ))}

      </div>
    </section>
  );
}