import { SunIcon, MoonIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/lib/store/settings";

function resolveTheme(theme: string): "light" | "dark" {
  if (theme === "dark" || theme === "light") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  const { theme, setTheme } = useSettingsStore();

  const resolved = resolveTheme(theme);

  const toggle = () => {
    setTheme(resolved === "dark" ? "light" : "dark");
  };

  const Icon = resolved === "dark" ? SunIcon : MoonIcon;

  return (
    <Button variant="ghost" size="icon-sm" onClick={toggle}>
      <Icon className="size-4" />
    </Button>
  );
}
