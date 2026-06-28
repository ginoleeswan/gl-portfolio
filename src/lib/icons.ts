// Maps brand/tech names to verified Iconify icon names (simple-icons / lucide).
// Returns null when no sensible logo exists, so callers fall back to text only.

export function socialIcon(label: string): string | null {
  const map: Record<string, string> = {
    github: "simple-icons:github",
    linkedin: "simple-icons:linkedin",
    x: "simple-icons:x",
    stackoverflow: "simple-icons:stackoverflow",
  };
  return map[label.toLowerCase()] ?? null;
}

const TECH_RULES: [string, string][] = [
  ["expo", "simple-icons:expo"],
  ["react native", "simple-icons:react"],
  ["react", "simple-icons:react"], // covers "React 19", "React Native", "expo-router (react)"
  ["supabase", "simple-icons:supabase"],
  ["tanstack", "simple-icons:reactquery"],
  ["vite", "simple-icons:vite"],
  ["mantine", "simple-icons:mantine"],
  ["openai", "simple-icons:openai"],
  ["resend", "simple-icons:resend"],
  ["gemini", "simple-icons:googlegemini"],
  ["posthog", "simple-icons:posthog"],
  ["revenuecat", "simple-icons:revenuecat"],
];

export function techIcon(name: string): string | null {
  const n = name.toLowerCase();
  for (const [key, icon] of TECH_RULES) if (n.includes(key)) return icon;
  return null;
}
