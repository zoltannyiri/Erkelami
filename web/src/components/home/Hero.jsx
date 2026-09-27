import { useEffect, useState } from "react";

const heroImages = [
  {
    src: "/zongora.jpg",
    position: "center 85%",
  },
  {
    src: "/hegedu.jpg",
    position: "center 50%",
  },
  {
    src: "/zenekar.jpg",
    position: "center 30%",
  },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex min-h-[550px] w-full items-center justify-center overflow-hidden">

      {heroImages.map((image, index) => (
        <div
          key={image.src}
          className={`
            absolute inset-0
            bg-cover
            transition-opacity duration-[1500ms]
            ${index === activeIndex ? "opacity-100" : "opacity-0"}
          `}
          style={{
            backgroundImage: `url(${image.src})`,
            backgroundPosition: image.position,
          }}
        />
      ))}

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