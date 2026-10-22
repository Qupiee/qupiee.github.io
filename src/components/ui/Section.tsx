import type { ReactNode } from "react";
import type { Credit } from "@/content/types";
import { Credits } from "./Credits";

type Props = {
  id?: string;
  title: string;
  description?: ReactNode;
  credits?: Credit[];
  children: ReactNode;
  className?: string;
};

/** Контентный блок страницы: карточка с заголовком, описанием и авторами. */
export function Section({ id, title, description, credits, children, className = "" }: Props) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className={`card scroll-mt-28 p-5 sm:p-8 ${className}`}>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id={headingId} className="text-2xl sm:text-3xl">
            {title}
          </h2>
          {description && <p className="mt-2 max-w-2xl text-ink-soft">{description}</p>}
        </div>
      </div>
      {children}
      {credits && credits.length > 0 && (
        <div className="mt-6 border-t-2 border-dashed border-azure-100 pt-5">
          <Credits credits={credits} />
        </div>
      )}
    </section>
  );
}
