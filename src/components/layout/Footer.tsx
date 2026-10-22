import Link from "next/link";
import { authorsNav, mainNav, site, socials } from "@/content/site";
import { Brand, Heart } from "@/components/icons";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  const sections = mainNav.filter((i) => !i.children);

  return (
    <footer className="mt-24 px-3 pb-6 sm:px-4">
      <div className="card mx-auto max-w-6xl px-6 py-10 sm:px-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo size="lg" />
            <p className="max-w-sm text-sm text-ink-soft">{site.tagline}.</p>
            <ul className="flex flex-wrap gap-2" aria-label="Соцсети">
              {socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={s.label}
                    title={s.label}
                    className="grid size-10 place-items-center rounded-full bg-azure-50 text-azure-600 transition duration-200 ease-(--ease-bounce) hover:-translate-y-0.5 hover:bg-blush-100 hover:text-blush-500"
                  >
                    <Brand name={s.id} size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <FooterNav title="Разделы" items={sections} />
          <FooterNav title="Авторы" items={authorsNav} />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t-2 border-dashed border-azure-100 pt-6 text-xs text-ink-soft sm:flex-row">
          <p>
            {/* {site.name} */}Здесь могла быть ваша реклама.
          </p>
          <p className="inline-flex items-center gap-1.5">
            zxc
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterNav({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <p className="mb-3 font-display text-sm font-bold text-azure-700">{title}</p>
      <ul className="space-y-2 text-sm">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="text-ink-soft transition hover:text-blush-500">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
