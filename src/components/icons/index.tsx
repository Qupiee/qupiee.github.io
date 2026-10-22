import type { SVGProps } from "react";
import { brandIcons, type BrandIcon } from "./brand-icons";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number, props: IconProps) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  focusable: false,
  ...props,
});

export function Brand({ name, size = 24, ...props }: IconProps & { name: BrandIcon }) {
  return (
    <svg {...base(size, props)} fill="currentColor">
      <path d={brandIcons[name].path} />
    </svg>
  );
}

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const Heart = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size, p)} fill="currentColor">
    <path d="M12 21s-7.5-4.6-9.8-9.2C.6 8.4 2.4 4.5 6.1 4.5c2.2 0 3.9 1.3 5 3 1.1-1.7 2.8-3 5-3 3.7 0 5.5 3.9 3.9 7.3C19.5 16.4 12 21 12 21z" />
  </svg>
);

export const Sparkle = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size, p)} fill="currentColor">
    <path d="M12 0c.8 6.4 5.6 11.2 12 12-6.4.8-11.2 5.6-12 12-.8-6.4-5.6-11.2-12-12C6.4 11.2 11.2 6.4 12 0z" />
  </svg>
);

/** Маленькие демонические рожки — фирменный знак логотипа */
export const Horns = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size, p)} fill="currentColor">
    <path d="M5.2 2.5c-1.6 2.6-1.8 5.9.4 8.4.9 1 2.2 1.6 3.5 1.7-1.2-.9-2-2.2-2.1-3.7-.2-2 .1-4.2-1.8-6.4zM18.8 2.5c1.6 2.6 1.8 5.9-.4 8.4-.9 1-2.2 1.6-3.5 1.7 1.2-.9 2-2.2 2.1-3.7.2-2-.1-4.2 1.8-6.4z" />
    <path d="M12 9.5c3.9 0 7 3 7 6.7S15.9 22 12 22s-7-2.1-7-5.8S8.1 9.5 12 9.5z" opacity=".25" />
  </svg>
);

export const ChevronDown = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size, p)} {...stroke}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
export const ChevronLeft = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size, p)} {...stroke}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);
export const ChevronRight = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size, p)} {...stroke}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);
export const Close = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size, p)} {...stroke}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
export const Menu = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size, p)} {...stroke}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);
export const Search = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size, p)} {...stroke}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
export const ArrowRight = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size, p)} {...stroke}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const ZoomIn = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size, p)} {...stroke}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5M11 8v6M8 11h6" />
  </svg>
);
export const Gift = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size, p)} {...stroke}>
    <rect x="3" y="8" width="18" height="4" rx="1.5" />
    <path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5" />
  </svg>
);
export const Play = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size, p)} fill="currentColor">
    <path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.4-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5z" />
  </svg>
);
