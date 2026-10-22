import type { Credit } from "@/content/types";
import { Heart } from "@/components/icons";

/** Блок «Авторы»: список авторов с ролями и ссылками. */
export function Credits({ credits, title = "Авторы" }: { credits: Credit[]; title?: string }) {
  if (!credits.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 inline-flex items-center gap-1.5 font-display text-sm font-bold text-ink-soft">
        <Heart size={14} className="text-blush-400" />
        {title}:
      </span>
      {credits.map((c) => (
        <span key={`${c.name}-${c.role}`} className="chip">
          {c.role && <span className="font-normal text-ink-soft">{c.role} —</span>}
          {c.url ? (
            <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline decoration-blush-300 decoration-2 underline-offset-2 hover:text-blush-500">
              {c.name}
            </a>
          ) : (
            c.name
          )}
        </span>
      ))}
    </div>
  );
}
