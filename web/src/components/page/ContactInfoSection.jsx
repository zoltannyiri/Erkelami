import { useState } from "react";

import { getSectionTone } from "../../config/pageSectionStyles";
import PageSectionContainer from "./PageSectionContainer";

const defaults = { background: "white", width: "wide", spacing: "large" };

const phoneHref = (phone) => `tel:${String(phone || "").replace(/[^+\d]/g, "")}`;
const websiteHref = (website) => {
  const value = String(website || "").trim();
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

function DetailLink({ label, href, children, external = false }) {
  if (!children) return null;
  const body = (
    <>
      <span className="text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-400">{label}</span>
      <span className="mt-1.5 block text-base font-semibold leading-7 text-slate-950">{children}</span>
    </>
  );

  return href ? (
    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="block border-t border-slate-200 py-5 transition hover:border-amber-700">
      {body}
    </a>
  ) : (
    <div className="border-t border-slate-200 py-5">{body}</div>
  );
}

function ContactForm({ title, intro }) {
  const [status, setStatus] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus("Az online üzenetküldés még nincs bekötve, ezért az adatokat nem továbbítottuk.");
  };

  const fieldClass = "mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-amber-600 focus:ring-4 focus:ring-amber-500/10";

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-stone-200 bg-stone-50/75 p-6 shadow-[0_22px_60px_rgba(51,39,24,0.07)] sm:p-8 lg:p-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-800">Kapcsolatfelvétel</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-slate-950">{title || "Írjon nekünk"}</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">{intro || "Kérdését vagy üzenetét az alábbi mezőkben készítheti elő."}</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Név</span>
          <input name="name" autoComplete="name" required className={fieldClass} placeholder="Az Ön neve" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">E-mail-cím</span>
          <input name="email" type="email" autoComplete="email" required className={fieldClass} placeholder="nev@pelda.hu" />
        </label>
      </div>
      <label className="mt-5 block">
        <span className="text-sm font-semibold text-slate-700">Tárgy</span>
        <input name="subject" required className={fieldClass} placeholder="Miben segíthetünk?" />
      </label>
      <label className="mt-5 block">
        <span className="text-sm font-semibold text-slate-700">Üzenet</span>
        <textarea name="message" required rows={6} className={`${fieldClass} resize-y`} placeholder="Írja ide az üzenetét…" />
      </label>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-5 text-slate-500">Az űrlap jelenleg előnézeti állapotban van, nem küld adatot külső címre.</p>
        <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-amber-700 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700">
          Üzenet elküldése
        </button>
      </div>
      {status && <p role="status" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">{status}</p>}
    </form>
  );
}

export default function ContactInfoSection({ content = {} }) {
  const phones = Array.isArray(content.phones) ? content.phones.filter(Boolean) : [];
  const contacts = Array.isArray(content.contacts)
    ? content.contacts.filter((contact) => contact?.name?.trim() || contact?.position?.trim())
    : [];
  const privacyOfficer = content.privacyOfficer || {};
  const tone = getSectionTone(content.style, defaults);
  const mapQuery = content.coordinates || content.address || content.institutionName || "Tatabánya";
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=16&output=embed`;
  const homepageHref = websiteHref(content.website);

  return (
    <PageSectionContainer content={content} defaults={defaults}>
      <section className="relative overflow-hidden rounded-3xl border border-stone-200 bg-stone-100 shadow-[0_24px_70px_rgba(51,39,24,0.09)]">
        <iframe
          title={`${content.institutionName || "Az intézmény"} térképe`}
          src={mapEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[28rem] w-full border-0 sm:h-[32rem]"
        />
        <div className="border-t border-stone-200 bg-white p-6 sm:absolute sm:bottom-6 sm:left-6 sm:max-w-md sm:rounded-2xl sm:border sm:p-7 sm:shadow-[0_18px_55px_rgba(15,23,42,0.14)] sm:backdrop-blur-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-800">Itt talál minket</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.02em] text-slate-950">{content.institutionName}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{content.address}</p>
          <a href={mapHref} target="_blank" rel="noreferrer" className="mt-5 inline-flex border-b border-amber-700 pb-1 text-sm font-semibold text-amber-800 transition hover:text-slate-950">
            Megnyitás a Google Térképen
          </a>
        </div>
      </section>

      <div className="contact-content-grid mt-12 grid gap-10 sm:mt-16 lg:gap-14">
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-800">Elérhetőségeink</p>
          <h2 className={`mt-3 text-3xl font-semibold tracking-[-0.025em] ${tone.heading}`}>Keressen minket közvetlenül</h2>

          <div className="mt-8 rounded-2xl border border-stone-200 bg-white px-6 sm:px-7">
            {phones.map((phone, index) => (
              <DetailLink key={`${phone}-${index}`} label={index === 0 ? "Telefon" : "Mobiltelefon"} href={phoneHref(phone)}>{phone}</DetailLink>
            ))}
            <DetailLink label="E-mail" href={content.generalEmail ? `mailto:${content.generalEmail}` : ""}>{content.generalEmail}</DetailLink>
            <DetailLink label="Honlap" href={homepageHref} external>{content.website}</DetailLink>
          </div>

          {contacts.length > 0 && (
            <div className="mt-10">
              <h2 className={`text-2xl font-semibold tracking-[-0.02em] ${tone.heading}`}>Kapcsolattartók</h2>
              <div className="mt-5 divide-y divide-stone-200 border-y border-stone-200">
                {contacts.map((contact, index) => (
                  <article key={`${contact.name}-${index}`} className="grid gap-2 py-5 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-800">{contact.position}</p>
                      <h3 className="mt-1.5 text-base font-semibold text-slate-950">{contact.name}</h3>
                    </div>
                    {contact.email && <a href={`mailto:${contact.email}`} className="self-end break-all text-sm text-slate-600 transition hover:text-amber-800 sm:text-right">{contact.email}</a>}
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        <ContactForm title={content.formTitle} intro={content.formIntro} />
      </div>

      {(privacyOfficer.name || privacyOfficer.organization || privacyOfficer.email) && (
        <section className="mt-14 rounded-2xl border border-stone-200 bg-amber-50/35 p-6 sm:mt-18 sm:p-8 lg:p-10">
          <div className="grid gap-7 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-amber-800">Adatvédelem</p>
              <h2 className={`mt-3 text-2xl font-semibold tracking-[-0.02em] ${tone.heading}`}>Adatvédelmi tisztviselő</h2>
            </div>
            <div className="grid gap-x-10 sm:grid-cols-2">
              <DetailLink label="Név">{privacyOfficer.name}</DetailLink>
              <DetailLink label="Szervezet">{privacyOfficer.organization}</DetailLink>
              <DetailLink label="Cím">{privacyOfficer.address}</DetailLink>
              <DetailLink label="E-mail" href={privacyOfficer.email ? `mailto:${privacyOfficer.email}` : ""}>{privacyOfficer.email}</DetailLink>
            </div>
          </div>
        </section>
      )}
    </PageSectionContainer>
  );
}
