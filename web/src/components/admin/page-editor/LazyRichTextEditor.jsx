import { lazy, Suspense } from "react";

const RichTextEditor = lazy(() => import("./RichTextEditor"));

export default function LazyRichTextEditor(props) {
  return (
    <Suspense fallback={<div className="min-h-44 animate-pulse border border-slate-300 bg-slate-50" />}>
      <RichTextEditor {...props} />
    </Suspense>
  );
}
