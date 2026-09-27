export default function ImageSection({ content }) {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-[1200px] px-8">
        <img
          src={content.imageUrl}
          alt={content.alt || ""}
          className="w-full object-cover"
        />
      </div>
    </section>
  );
}