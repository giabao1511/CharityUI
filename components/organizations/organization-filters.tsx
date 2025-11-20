"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTransition, useState, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

interface OrganizationFiltersProps {
  defaultValues?: {
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  };
  currentPage?: number;
  totalPages?: number;
}

export function OrganizationFilters({
  defaultValues = {},
  currentPage = 1,
  totalPages = 1,
}: OrganizationFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("organizations.filter");
  const [searchValue, setSearchValue] = useState(defaultValues?.search || "");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const createQueryString = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams();

    // Start with current default values
    if (defaultValues.search) params.set("search", defaultValues.search);
    if (defaultValues.sortBy) params.set("sortBy", defaultValues.sortBy);
    if (defaultValues.sortOrder) params.set("sortOrder", defaultValues.sortOrder);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset to page 1 when filters change
    if (!updates.page) {
      params.set("page", "1");
    }

    return params.toString();
  };

  const handleFilterChange = (key: string, value: string | null) => {
    startTransition(() => {
      const queryString = createQueryString({ [key]: value });
      router.push(`${pathname}?${queryString}`, { scroll: false });
    });
  };

  const handleClearFilters = () => {
    setSearchValue("");
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const handlePageChange = (page: number) => {
    startTransition(() => {
      const queryString = createQueryString({ page: page.toString() });
      router.push(`${pathname}?${queryString}`, { scroll: false });
    });
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== defaultValues?.search) {
        handleFilterChange("search", searchValue || null);
        // Refocus the search input after debounce triggers
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchValue]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            placeholder={t("searchPlaceholder")}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
            disabled={isPending}
          />
        </div>

        {/* Sort By */}
        <Select
          value={defaultValues?.sortBy || "createdAt"}
          onValueChange={(value) => handleFilterChange("sortBy", value)}
          disabled={isPending}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={t("sortBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="orgName">{t("orgName")}</SelectItem>
            <SelectItem value="createdAt">{t("createdDate")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Order */}
        <Select
          value={defaultValues?.sortOrder || "DESC"}
          onValueChange={(value) => handleFilterChange("sortOrder", value)}
          disabled={isPending}
        >
          <SelectTrigger className="w-full md:w-[140px]">
            <SelectValue placeholder={t("order")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DESC">{t("descending")}</SelectItem>
            <SelectItem value="ASC">{t("ascending")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        <Button
          onClick={handleClearFilters}
          variant="outline"
          className="md:w-auto"
          disabled={isPending}
        >
          {t("clear")}
        </Button>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-4"
        />
      )}
    </div>
  );
}
