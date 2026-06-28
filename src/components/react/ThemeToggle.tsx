import { useState } from "react";

export function nextTheme(current: "dark" | "light"): "dark" | "light" {
  return current === "dark" ? "light" : "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">(
    () => (typeof document !== "undefined" && (document.documentElement.dataset.theme as "dark" | "light")) || "dark",
  );
  function toggle() {
    const t = nextTheme(theme);
    setTheme(t);
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem("theme", t); } catch {}
  }
  return (
    <button aria-label="Toggle theme" onClick={toggle} className="rounded-full border border-white/15 px-3 py-1 text-xs">
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
