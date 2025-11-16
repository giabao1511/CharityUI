"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Users } from "lucide-react";
import { RewardTier } from "@/types";
import { cn } from "@/lib/utils";
import { BodyText } from "@/components/ui/typography";
import { formatCurrency } from "@/lib/currency";
import { useLocale } from "next-intl";

interface RewardTierCardProps {
  tier: RewardTier;
  selected: boolean;
  onSelect: (tierId: string) => void;
  disabled?: boolean;
}

export function RewardTierCard({ tier, selected, onSelect, disabled = false }: RewardTierCardProps) {
  const locale = useLocale() as 'en' | 'vi';
  const isSoldOut = tier.backerLimit ? tier.backersCount >= tier.backerLimit : false;
  const isDisabled = disabled || isSoldOut;

  const handleClick = () => {
    if (!isDisabled) {
      onSelect(tier.id);
    }
  };

  const getButtonText = () => {
    if (selected) return "Selected";
    if (isSoldOut) return "Sold Out";
    return "Select Reward";
  };

  return (
    <Card 
      className={cn(
        "relative cursor-pointer transition-all duration-200 hover:shadow-md",
        selected && "ring-2 ring-primary shadow-md",
        isDisabled && "opacity-60 cursor-not-allowed"
      )}
      onClick={handleClick}
    >
      {/* Selected indicator */}
      {selected && (
        <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
        </div>
      )}

      {/* Sold out badge */}
      {isSoldOut && (
        <div className="absolute top-4 right-4">
          <Badge variant="destructive">Sold Out</Badge>
        </div>
      )}

      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold">
            {formatCurrency(tier.amount, locale)}
          </CardTitle>
          <CardDescription className="text-base font-semibold text-foreground">
            {tier.title}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <BodyText className="text-muted-foreground">
          {tier.description}
        </BodyText>

        {/* Reward items */}
        {tier.items && tier.items.length > 0 && (
          <div className="space-y-2">
            <BodyText weight="semibold" size="sm">Includes:</BodyText>
            <ul className="space-y-1">
              {tier.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Estimated delivery */}
        {tier.estimatedDelivery && (
          <BodyText size="sm" className="text-muted-foreground">
            <span className="font-semibold">Estimated delivery:</span> {tier.estimatedDelivery}
          </BodyText>
        )}

        {/* Backer stats */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
          <Users className="h-4 w-4" aria-hidden="true" />
          <span>
            {tier.backersCount} {tier.backersCount === 1 ? 'backer' : 'backers'}
            {tier.backerLimit && (
              <span className="ml-1">
                ({tier.backerLimit - tier.backersCount} of {tier.backerLimit} remaining)
              </span>
            )}
          </span>
        </div>

        {/* Select button */}
        <Button 
          variant={selected ? "default" : "outline"}
          className="w-full mt-4"
          onClick={handleClick}
          disabled={isDisabled}
          aria-label={`Select ${tier.title} reward tier for $${tier.amount}`}
        >
          {getButtonText()}
        </Button>
      </CardContent>
    </Card>
  );
}
