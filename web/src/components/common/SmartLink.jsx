import { Link } from "react-router-dom";

export default function SmartLink({
  to,
  href,
  children,
  className = "",
  target,
  rel,
  onClick,
  ...props
}) {
  const destination = String(to || href || "").trim();

  if (!destination) {
    return (
      <span className={className} {...props}>
        {children}
      </span>
    );
  }

  const isExternal =
    /^https?:\/\//i.test(destination) ||
    destination.startsWith("mailto:") ||
    destination.startsWith("tel:");

  if (isExternal) {
    return (
      <a
        href={destination}
        target={target || "_blank"}
        rel={rel || "noreferrer"}
        className={className}
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      to={destination}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </Link>
  );
}
