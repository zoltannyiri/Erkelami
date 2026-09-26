export default function Hero() {
  return (
    <section
      className="
        relative flex min-h-[520px] w-full
        items-center justify-center
        bg-cover bg-center
      "
      style={{
        backgroundImage: "url('/public/zongora.jpg')",
      }}
    >
      {/* sötétítés */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 mx-auto max-w-5xl px-8 text-center text-white">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-white/80">
          Tatabánya
        </p>

        <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
          Erkel Ferenc
        </h1>

        <p className="mt-3 text-xl font-light tracking-wide md:text-2xl">
          Alapfokú Művészeti Iskola
        </p>

        <div className="mx-auto mt-7 h-[1px] w-20 bg-white/60" />

        <p className="mt-7 text-sm uppercase tracking-[0.25em] text-white/90">
          Zene • Közösség • Hagyomány
        </p>
      </div>
    </section>
  );
}