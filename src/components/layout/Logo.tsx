import { Horns } from "@/components/icons";
import { site } from "@/content/site";

export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={`grid shrink-0 place-items-center rounded-full bg-linear-to-br from-blush-200 to-blush-300 text-blush-500 shadow-glow-pink ${
          size === "lg" ? "size-12" : "size-9"
        }`}
      >
        <Horns size={size === "lg" ? 28 : 22} />
      </span>
      <span className={`font-display font-bold text-chrome ${size === "lg" ? "text-2xl" : "text-lg"}`}>{site.name}</span>
    </span>
  );
}
