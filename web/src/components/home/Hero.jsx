import { useEffect, useState } from "react";

const heroImages = [
  { src: "/zongora.jpg", position: "center 72%", label: "Zongora" },
  { src: "/hegedu.jpg", position: "center 50%", label: "Hegedű" },
  { src: "/zenekar.jpg", position: "center 30%", label: "Zenekar" },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroImages.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative isolate flex min-h-[22rem] items-center overflow-hidden bg-slate-950 sm:min-h-[25rem] lg:min-h-[27rem]">
      {heroImages.map((image, index) => (
        <img
          key={image.src}
          src={image.src}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1600ms] motion-reduce:transition-none ${
            index === activeIndex ? "scale-100 opacity-100" : "scale-[1.02] opacity-0"
          }`}
          style={{ objectPosition: image.position }}
        />
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,15,28,0.88)_0%,rgba(8,15,28,0.62)_48%,rgba(8,15,28,0.20)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-slate-950/10" />

      <div aria-hidden="true" className="absolute right-0 top-[24%] hidden w-[38%] opacity-15 lg:block">
        {[0, 1, 2, 3, 4].map((line) => (
          <div key={line} className="mt-3 h-px bg-white" />
        ))}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="max-w-3xl">
          <div className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-200 sm:text-xs">
            <span className="h-px w-8 bg-amber-300/80" />
            Tatabánya
          </div>
          <h1 className="font-serif text-[clamp(3rem,7vw,5.75rem)] leading-[0.9] tracking-[-0.05em] text-white">
            Erkel Ferenc
          </h1>
          <p className="mt-4 text-xl font-light tracking-[-0.02em] text-white/90 sm:text-2xl">
            Alapfokú Művészeti Iskola
          </p>
        </div>
      </div>

      <div className="absolute bottom-6 right-5 z-20 flex items-center gap-2 sm:right-8" aria-label="Hero képek">
        {heroImages.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`${image.label} kép megjelenítése`}
            aria-pressed={activeIndex === index}
            className={`h-1.5 transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
              activeIndex === index ? "w-9 bg-amber-300" : "w-5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
