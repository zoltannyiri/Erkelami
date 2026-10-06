import { useState } from "react";
import SmartLink from "./common/SmartLink";

export default function RecursiveMenu({ items }) {
  const [openItemId, setOpenItemId] = useState(null);

  if (!items || items.length === 0) return null;

  return (
    <>
      {items.map((item) => {
        const hasChildren = item.children?.length > 0;
        const isOpen = openItemId === item.id;

        return (
          <div
            key={item.id}
            className="relative"
            onMouseEnter={() => {
              if (hasChildren) {
                setOpenItemId(item.id);
              }
            }}
            onMouseLeave={() => {
              if (hasChildren) {
                setOpenItemId(null);
              }
            }}
          >
            {item.url ? (
              <SmartLink
                to={item.url}
                className="
                  flex min-w-[240px] items-center justify-between
                  px-5 py-3 text-sm text-slate-700
                  transition-colors
                  hover:bg-slate-50 hover:text-blue-700
                "
              >
                {item.label}

                {hasChildren && (
                  <span className="ml-6 text-slate-400">
                    ›
                  </span>
                )}
              </SmartLink>
            ) : (
              <div
                className="
                  flex min-w-[240px] cursor-default
                  items-center justify-between
                  px-5 py-3 text-sm text-slate-700
                  transition-colors
                  hover:bg-slate-50 hover:text-blue-700
                "
              >
                {item.label}

                {hasChildren && (
                  <span className="ml-6 text-slate-400">
                    ›
                  </span>
                )}
              </div>
            )}

            {hasChildren && isOpen && (
              <div
                className="
                  absolute left-full top-0
                  ml-[1px] min-w-[240px]
                  border border-slate-200 bg-white
                  py-2 shadow-xl
                "
              >
                <RecursiveMenu items={item.children} />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}