import { getSectionTone } from "../../config/pageSectionStyles";
import PageSectionContainer from "./PageSectionContainer";

const defaults = { background: "white", width: "wide", spacing: "large" };

function memberCountLabel(count) {
  return `${count} ${count === 1 ? "munkatárs" : "munkatárs"}`;
}

function FeaturedGroup({ group, tone }) {
  return (
    <section className="border-t border-slate-300 pt-7 sm:pt-9">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className={`text-2xl font-semibold tracking-[-0.02em] sm:text-3xl ${tone.heading}`}>
          {group.title}
        </h2>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          {memberCountLabel(group.members.length)}
        </p>
      </div>
      <div className="mt-7 grid gap-px overflow-hidden border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
        {group.members.map((member, index) => (
          <article key={`${member.name}-${index}`} className="relative min-h-44 bg-[#fffefa] p-6 sm:p-7">
            <span className="absolute inset-x-0 top-0 h-0.5 bg-amber-700" aria-hidden="true" />
            <p className="text-[11px] font-semibold tabular-nums tracking-[0.14em] text-amber-800">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className={`mt-8 text-xl font-semibold leading-snug tracking-[-0.015em] ${tone.heading}`}>
              {member.name}
            </h3>
            {member.role && <p className={`mt-2 text-sm leading-6 ${tone.body}`}>{member.role}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}

function StandardGroup({ group, tone }) {
  return (
    <section className="grid gap-6 border-t border-slate-300 pt-7 sm:pt-9 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
      <div>
        <h2 className={`text-2xl font-semibold tracking-[-0.02em] ${tone.heading}`}>{group.title}</h2>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
          {memberCountLabel(group.members.length)}
        </p>
      </div>
      <div className="grid gap-x-10 sm:grid-cols-2">
        {group.members.map((member, index) => (
          <article key={`${member.name}-${index}`} className="border-t border-slate-200 py-5 first:border-t-0 sm:[&:nth-child(2)]:border-t-0">
            <h3 className={`text-[1.05rem] font-semibold leading-snug ${tone.heading}`}>{member.name}</h3>
            {member.role && <p className={`mt-1.5 text-sm leading-6 ${tone.body}`}>{member.role}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}

export default function StaffDirectorySection({ content = {} }) {
  const groups = Array.isArray(content.groups)
    ? content.groups
        .map((group) => ({
          ...group,
          members: Array.isArray(group.members)
            ? group.members.filter((member) => member?.name?.trim())
            : [],
        }))
        .filter((group) => group.title?.trim() && group.members.length > 0)
    : [];
  const tone = getSectionTone(content.style, defaults);

  return (
    <PageSectionContainer content={content} defaults={defaults}>
      <div className="mb-11 flex flex-col gap-5 border-b border-slate-200 pb-8 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          {content.academicYear && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">
              {content.academicYear}-es tanév
            </p>
          )}
          {content.intro && <p className={`mt-4 text-lg leading-8 ${tone.body}`}>{content.intro}</p>}
        </div>
        <p className="shrink-0 text-sm font-medium tabular-nums text-slate-500">
          {memberCountLabel(groups.reduce((sum, group) => sum + group.members.length, 0))}
        </p>
      </div>

      <div className="space-y-12 sm:space-y-16">
        {groups.map((group, index) => (
          group.featured
            ? <FeaturedGroup key={`${group.title}-${index}`} group={group} tone={tone} />
            : <StandardGroup key={`${group.title}-${index}`} group={group} tone={tone} />
        ))}
      </div>
    </PageSectionContainer>
  );
}
