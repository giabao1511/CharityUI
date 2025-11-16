'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Use next-intl's router.replace with locale option
    // This automatically handles the locale prefix based on routing config
    router.replace(pathname, { locale: newLocale });
  };

  const currentLanguage = languages.find((lang) => lang.code === locale);
  const otherLanguage = languages.find((lang) => lang.code !== locale);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => otherLanguage && switchLocale(otherLanguage.code)}
      aria-label={`Switch to ${otherLanguage?.name}`}
      className="gap-2"
    >
      <Globe className="h-4 w-4" aria-hidden="true" />
      <span>{currentLanguage?.flag} {currentLanguage?.code.toUpperCase()}</span>
    </Button>
  );
}
