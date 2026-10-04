import { getSectionClassNames } from "../../config/pageSectionStyles";

export default function PageSectionContainer({
  content = {},
  defaults,
  children,
  className = "",
  innerClassName = "",
  sectionStyle,
}) {
  const classes = getSectionClassNames(content?.style, defaults);

  return (
    <section style={sectionStyle} className={`${classes.section} ${className}`}>
      <div className={`mx-auto px-5 sm:px-8 ${classes.inner} ${innerClassName}`}>
        {children}
      </div>
    </section>
  );
}
