import { Link } from "react-router-dom";

export default function RecursiveMenu({ items }) {
  return (
    <>
      {items.map((item) => {
        const hasChildren = item.children?.length > 0;

        return (
          <div key={item.id} className="group/item relative">
            {item.url ? (
              <Link
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
                  <span className="ml-6 text-slate-400">›</span>
                )}
              </Link>
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
                  <span className="ml-6 text-slate-400">›</span>
                )}
              </div>
            )}

            {hasChildren && (
              <div
                className="
                  invisible absolute left-full top-0
                  ml-[1px] min-w-[240px]
                  border border-slate-200 bg-white
                  py-2 opacity-0 shadow-xl
                  transition-all duration-150
                  group-hover/item:visible
                  group-hover/item:opacity-100
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