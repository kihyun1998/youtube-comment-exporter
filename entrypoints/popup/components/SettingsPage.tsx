import { ArrowLeftIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSettingsStore, type Language } from "@/lib/store/settings";

const languages: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ko", label: "한국어" },
];

export function SettingsPage({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const { apiKey, setApiKey, language, setLanguage } = useSettingsStore();

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
        <label className="text-sm text-muted-foreground">{t("language")}</label>
        <div className="flex gap-2">
          {languages.map(({ value, label }) => (
            <Button
              key={value}
              size="sm"
              variant={language === value ? "default" : "outline"}
              onClick={() => setLanguage(value)}
              className="flex-1"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
