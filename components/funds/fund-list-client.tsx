"use client";

import { useState, useMemo } from "react";
import { FundCard } from "@/components/funds/fund-card";
import { FundFilters } from "@/components/funds/fund-filters";
import { Fund } from "@/types";
import { BodyText } from "@/components/ui/typography";

interface FundListClientProps {
  funds: Fund[];
  categories: string[];
}

export function FundListClient({ funds, categories }: FundListClientProps) {
  const [filters, setFilters] = useState({
    searchQuery: "",
    selectedCategory: "All Categories",
    sortBy: "recent",
  });

  const filteredAndSortedFunds = useMemo(() => {
    // Filter funds
    let filtered = funds.filter((fund) => {
      const matchesSearch =
        fund.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        fund.shortDescription.toLowerCase().includes(filters.searchQuery.toLowerCase());

      const matchesCategory =
        filters.selectedCategory === "All Categories" ||
        fund.category === filters.selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort funds
    return [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case "recent":
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case "mostFunded":
          return b.currentAmount - a.currentAmount;
        case "trending":
          return b.backers - a.backers;
        case "endingSoon":
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        default:
          return 0;
      }
    });
  }, [funds, filters]);

  return (
    <>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        <FundFilters categories={categories} onFilterChange={setFilters} />

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredAndSortedFunds.length} of {funds.length} funds
        </div>
      </div>

      {/* Fund Grid */}
      {filteredAndSortedFunds.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedFunds.map((fund) => (
            <FundCard key={fund.id} fund={fund} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BodyText size="lg" muted>
            No funds found matching your criteria.
          </BodyText>
        </div>
      )}
    </>
  );
}
