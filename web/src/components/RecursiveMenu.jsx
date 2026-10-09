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
                className="flex min-w-[232px] items-center justify-between rounded-sm px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-stone-100 hover:text-amber-900 focus-visible:outline-2 focus-visible:outline-amber-700"
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
                className="flex min-w-[232px] cursor-default items-center justify-between rounded-sm px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-stone-100 hover:text-amber-900"
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
              <div className="absolute left-full top-0 w-[358px] pl-2">
                <div className="max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain rounded-sm border border-stone-200 bg-[#fffefa] p-2 shadow-[0_20px_55px_rgba(15,23,42,0.14)]">
                  <RecursiveMenu items={item.children} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
