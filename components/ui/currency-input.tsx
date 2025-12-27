"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: number | string;
  onChange: (value: number) => void;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState("");

    // Format number with thousand separators
    const formatNumber = (num: number | string): string => {
      const numStr = num.toString().replace(/\D/g, "");
      if (!numStr) return "";
      return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // Update display value when prop value changes
    React.useEffect(() => {
      const numericValue = typeof value === "string" ? value.replace(/\D/g, "") : value.toString();
      setDisplayValue(formatNumber(numericValue));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      // Remove all non-digit characters
      const numericValue = input.replace(/\D/g, "");

      // Update display with formatted value
      setDisplayValue(formatNumber(numericValue));

      // Pass numeric value to parent
      onChange(numericValue ? parseInt(numericValue, 10) : 0);
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        className={cn(className)}
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
