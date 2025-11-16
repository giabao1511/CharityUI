"use client";

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

interface FundFiltersProps {
  categories: string[];
  onFilterChange: (filters: {
    searchQuery: string;
    selectedCategory: string;
    sortBy: string;
  }) => void;
}

export function FundFilters({ categories, onFilterChange }: FundFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("recent");

  const handleFilterChange = (
    newSearchQuery?: string,
    newCategory?: string,
    newSortBy?: string
  ) => {
    const filters = {
      searchQuery: newSearchQuery ?? searchQuery,
      selectedCategory: newCategory ?? selectedCategory,
      sortBy: newSortBy ?? sortBy,
    };
    onFilterChange(filters);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleFilterChange(e.target.value, undefined, undefined);
            }}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <Select
          value={selectedCategory}
          onValueChange={(value) => {
            setSelectedCategory(value);
            handleFilterChange(undefined, value, undefined);
          }}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select
          value={sortBy}
          onValueChange={(value) => {
            setSortBy(value);
            handleFilterChange(undefined, undefined, value);
          }}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="mostFunded">Most Funded</SelectItem>
            <SelectItem value="trending">Most Backers</SelectItem>
            <SelectItem value="endingSoon">Ending Soon</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
