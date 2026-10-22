import type { Credit } from "@/content/types";

/** Имя автора — гиперссылка на его соцсеть (если она указана). */
export function CreditLink({ credit, tone = "dark" }: { credit: Pick<Credit, "name" | "url">; tone?: "dark" | "light" }) {
  if (!credit.url) return <span className="font-semibold">{credit.name}</span>;
  return (
    <a
      href={credit.url}
      target="_blank"
      rel="noopener noreferrer"
      className={
        tone === "light"
          ? "font-semibold text-blush-200 underline decoration-blush-300/60 underline-offset-4 hover:text-white"
          : "link"
      }
    >
      {credit.name}
    </a>
  );
}
