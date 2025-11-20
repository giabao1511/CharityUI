"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
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

export function OrganizationFiltersServer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("organizations.filter");

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "createdAt");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "DESC");

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when filters change
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSearchSubmit = () => {
    updateFilters({ search: searchQuery });
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value);
    updateFilters({ sortBy: value });
  };

  const handleSortOrderChange = (value: string) => {
    setSortOrder(value);
    updateFilters({ sortOrder: value });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSortBy("createdAt");
    setSortOrder("DESC");
    router.push(window.location.pathname);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder") || "Search organizations..."}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            className="pl-10"
          />
        </div>

        <Button onClick={handleSearchSubmit} variant="secondary" className="md:w-auto">
          {t("search") || "Search"}
        </Button>

        {/* Sort By */}
        <Select value={sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={t("sortBy") || "Sort by"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="orgName">Organization Name</SelectItem>
            <SelectItem value="createdAt">Created Date</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Order */}
        <Select value={sortOrder} onValueChange={handleSortOrderChange}>
          <SelectTrigger className="w-full md:w-[140px]">
            <SelectValue placeholder={t("order") || "Order"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DESC">Descending</SelectItem>
            <SelectItem value="ASC">Ascending</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        <Button onClick={handleClearFilters} variant="outline" className="md:w-auto">
          {t("clear") || "Clear"}
        </Button>
      </div>
    </div>
  );
}
