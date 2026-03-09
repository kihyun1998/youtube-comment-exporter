import { ArrowLeftIcon, ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useSettingsStore, type Language } from "@/lib/store/settings";

const SPLIT_PRESETS = [0, 50, 100, 200, 500, 1000];
const CUSTOM_VALUE = "custom";

const languages: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ko", label: "한국어" },
  { value: "ja", label: "日本語" },
  { value: "zh-CN", label: "中文(简体)" },
  { value: "zh-TW", label: "中文(繁體)" },
  { value: "es", label: "Español" },
  { value: "pt", label: "Português" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "hi", label: "हिन्दी" },
  { value: "id", label: "Bahasa Indonesia" },
  { value: "vi", label: "Tiếng Việt" },
  { value: "th", label: "ไทย" },
  { value: "ru", label: "Русский" },
  { value: "tr", label: "Türkçe" },
  { value: "ar", label: "العربية" },
];

export function SettingsPage({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const { apiKey, setApiKey, language, setLanguage, splitSize, setSplitSize } =
    useSettingsStore();
  const isCustom = splitSize > 0 && !SPLIT_PRESETS.includes(splitSize);
  const [showCustomInput, setShowCustomInput] = useState(isCustom);
  const [customValue, setCustomValue] = useState(isCustom ? String(splitSize) : "");

  const dropdownValue = showCustomInput ? CUSTOM_VALUE : String(splitSize);

  const handleDropdownChange = (v: string) => {
    if (v === CUSTOM_VALUE) {
      setShowCustomInput(true);
      setCustomValue("");
    } else {
      setShowCustomInput(false);
      setSplitSize(Number(v));
    }
  };

  const applyCustomValue = () => {
    const n = Math.max(0, Math.floor(Number(customValue) || 0));
    setSplitSize(n);
    setCustomValue(String(n));
    if (n === 0 || SPLIT_PRESETS.includes(n)) {
      setShowCustomInput(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" onClick={onBack}>
          <ArrowLeftIcon className="size-4" />
        </Button>
        <h2 className="text-lg font-bold">{t("settings")}</h2>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="api-key" className="text-sm text-muted-foreground">
          {t("apiKey")}
        </label>
        <Input
          id="api-key"
          type="password"
          placeholder={t("apiKeyPlaceholder")}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-muted-foreground">
          {t("splitExport")}
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="justify-between">
              {splitSize === 0 && !showCustomInput
                ? "Off"
                : showCustomInput
                  ? t("custom")
                  : `${splitSize} ${t("threads")}`}
              <ChevronDownIcon className="size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[var(--radix-dropdown-menu-trigger-width)]"
          >
            <DropdownMenuRadioGroup
              value={dropdownValue}
              onValueChange={handleDropdownChange}
            >
              {SPLIT_PRESETS.map((v) => (
                <DropdownMenuRadioItem key={v} value={String(v)}>
                  {v === 0 ? "Off" : `${v} ${t("threads")}`}
                </DropdownMenuRadioItem>
              ))}
              <DropdownMenuRadioItem value={CUSTOM_VALUE}>
                {t("custom")}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {showCustomInput && (
          <div className="flex gap-1.5">
            <Input
              type="number"
              min="1"
              placeholder={t("customPlaceholder")}
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyCustomValue()}
              className="flex-1"
            />
            <Button size="sm" onClick={applyCustomValue}>
              {t("apply")}
            </Button>
          </div>
        )}
        <p className="text-xs text-muted-foreground">{t("splitDescription")}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-muted-foreground">{t("language")}</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="justify-between">
              {languages.find((l) => l.value === language)?.label}
              <ChevronDownIcon className="size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
            <DropdownMenuRadioGroup
              value={language}
              onValueChange={(v) => setLanguage(v as Language)}
            >
              {languages.map(({ value, label }) => (
                <DropdownMenuRadioItem key={value} value={value}>
                  {label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
