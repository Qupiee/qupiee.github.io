"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav, site } from "@/content/site";
import { ChevronDown, Close, Menu } from "@/components/icons";
import { Logo } from "./Logo";

const norm = (p: string) => (p.endsWith("/") ? p : `${p}/`);
const isActive = (pathname: string, href: string) =>
  href === "/" ? norm(pathname) === "/" : norm(pathname).startsWith(href);

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // закрываем меню при переходе на другую страницу
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
    setDropdown(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!dropdown && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdown(false);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdown(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, [dropdown, mobileOpen]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-white/80 px-3 py-2 backdrop-blur-lg transition-all duration-300 sm:px-4 ${
          scrolled ? "bg-white/85 shadow-lift" : "bg-white/65 shadow-soft"
        }`}
      >
        <Link href="/" className="shrink-0 rounded-full" aria-label={`${site.name} — на главную`}>
          <Logo />
        </Link>

        {/* десктоп */}
        <nav aria-label="Основное меню" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) =>
              item.children ? (
                <li
                  key={item.href}
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={() => setDropdown(true)}
                  onMouseLeave={() => setDropdown(false)}
                >
                  <button
                    type="button"
                    aria-expanded={dropdown}
                    aria-controls="authors-menu"
                    onClick={() => setDropdown((v) => !v)}
                    className={navItemClass(isActive(pathname, item.href))}
                  >
                    {item.label}
                    <ChevronDown size={16} className={`transition-transform duration-300 ${dropdown ? "rotate-180" : ""}`} />
                  </button>
                  {/* pt-3 — «мостик», чтобы меню не закрывалось при переводе курсора */}
                  <div
                    id="authors-menu"
                    className={`absolute top-full left-1/2 w-72 -translate-x-1/2 pt-3 transition duration-200 ${
                      dropdown ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
                    }`}
                  >
                    <ul className="card space-y-1 p-2">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={`block rounded-2xl px-4 py-2.5 transition hover:bg-azure-50 ${
                              isActive(pathname, child.href) ? "bg-azure-50" : ""
                            }`}
                          >
                            <span className="block font-display text-sm font-bold text-azure-700">{child.label}</span>
                            <span className="block text-xs text-ink-soft">{child.description}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={navItemClass(isActive(pathname, item.href))}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        {/* мобильная кнопка */}
        <button
          type="button"
          className="grid size-11 place-items-center rounded-full bg-azure-50 text-azure-700 transition hover:bg-azure-100 md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <Close /> : <Menu />}
        </button>
      </div>

      {/* мобильное меню */}
      <nav
        id="mobile-menu"
        aria-label="Мобильное меню"
        className={`mx-auto mt-2 max-w-6xl origin-top transition duration-300 ease-(--ease-bounce) md:hidden ${
          mobileOpen ? "visible scale-100 opacity-100" : "invisible pointer-events-none h-0 scale-95 opacity-0"
        }`}
      >
        <ul className="card space-y-1 p-3">
          {mainNav.map((item) => (
            <li key={item.href}>
              {item.children ? (
                <div className="rounded-3xl bg-azure-50/70 p-2">
                  <p className="px-3 pt-1 pb-2 font-display text-xs font-bold tracking-wider text-ink-soft uppercase">{item.label}</p>
                  <ul className="space-y-1">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} className={mobileItemClass(isActive(pathname, child.href))}>
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Link href={item.href} className={mobileItemClass(isActive(pathname, item.href))}>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function navItemClass(active: boolean) {
  return `relative inline-flex items-center gap-1 rounded-full px-4 py-2 font-display text-sm font-bold transition ${
    active ? "bg-azure-100 text-azure-700" : "text-ink-soft hover:bg-azure-50 hover:text-azure-700"
  }`;
}

function mobileItemClass(active: boolean) {
  return `block rounded-2xl px-4 py-3 font-display font-bold transition ${
    active ? "bg-white text-azure-700 shadow-soft" : "text-ink-soft hover:bg-white/80"
  }`;
}
