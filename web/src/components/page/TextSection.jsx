export default function TextSection({ content }) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-[1200px] px-8">
        {content.heading && (
          <h2 className="mb-6 text-3xl font-semibold text-slate-950">
            {content.heading}
          </h2>
        )}

        {content.text && (
          <p className="whitespace-pre-line text-lg leading-8 text-slate-600">
            {content.text}
          </p>
        )}
      </div>
    </section>
  );
}