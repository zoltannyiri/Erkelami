export default function Topbar() {
  return (
    <div className="bg-red-500 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-x-8 gap-y-2 px-5 py-2.5 text-xs font-medium sm:px-8 lg:justify-start">
        
        <a
          href="tel:34/311-238"
          className="flex items-center gap-2 transition hover:text-blue-300"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 4h3l2 5-2 1.5a15 15 0 0 0 5.5 5.5L15 14l5 2v3a2 2 0 0 1-2 2C10.3 21 3 13.7 3 6a2 2 0 0 1 2-2Z"
            />
          </svg>

          <span>34/311-238</span>
        </a>

        <a
          href="tel:30/214-3243"
          className="flex items-center gap-2 transition hover:text-blue-300"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 4h3l2 5-2 1.5a15 15 0 0 0 5.5 5.5L15 14l5 2v3a2 2 0 0 1-2 2C10.3 21 3 13.7 3 6a2 2 0 0 1 2-2Z"
            />
          </svg>

          <span>30/214-3243</span>
        </a>

        <a
          href="mailto:info@erkelami.hu"
          className="flex items-center gap-2 transition hover:text-blue-300"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 6h18v12H3V6Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m3 7 9 7 9-7"
            />
          </svg>

          <span>info@erkelami.hu</span>
        </a>

        <div className="hidden items-center gap-2 sm:flex">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 4h10v16H7V4Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 8h4M10 12h4"
            />
          </svg>

          <span>
            OM azonosító: <strong>039940</strong>
          </span>
        </div>

      </div>
    </div>
  );
}