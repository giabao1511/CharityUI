import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { Slot as SlotPrimitive } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export const headingVariants = cva("capitalize not-italic tracking-tight", {
  variants: {
    level: {
      1: "scroll-m-20 text-4xl font-bold lg:text-5xl",
      2: "scroll-m-20 text-3xl font-semibold lg:text-4xl",
      3: "scroll-m-20 text-2xl font-semibold lg:text-3xl",
      4: "scroll-m-20 text-xl font-semibold lg:text-2xl",
      5: "scroll-m-20 text-lg font-semibold lg:text-xl",
      6: "scroll-m-20 text-base font-semibold lg:text-lg",
    },
    gutterBottom: {
      true: "mb-4",
    },
  },
});

type HeadingVariants = VariantProps<typeof headingVariants>;

interface HeadingProps
  extends React.ComponentPropsWithoutRef<"h1">,
    Omit<HeadingVariants, "level">,
    Required<Pick<HeadingVariants, "level">> {
  asChild?: boolean;
}

export function Heading({
  level,
  asChild,
  gutterBottom,
  className,
  ...props
}: HeadingProps) {
  const tags = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
  const Tag = tags[(level || 1) - 1];

  if (asChild) {
    return (
      <SlotPrimitive
        className={cn(headingVariants({ level, gutterBottom }), className)}
        {...props}
      />
    );
  }

  return React.createElement(Tag, {
    className: cn(headingVariants({ level, gutterBottom }), className),
    ...props,
  });
}

export const bodyTextVariants = cva("tracking-normal not-italic leading-7", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    muted: {
      true: "text-muted-foreground",
      false: "",
    },
    gutterBottom: {
      true: "mb-4",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "normal",
    muted: false,
  },
});

interface BodyTextProps
  extends React.ComponentPropsWithoutRef<"p">,
    VariantProps<typeof bodyTextVariants> {
  asChild?: boolean;
}

export function BodyText({
  size,
  weight,
  muted,
  gutterBottom,
  asChild,
  className,
  ...props
}: BodyTextProps) {
  const Comp = asChild ? SlotPrimitive : "p";

  return (
    <Comp
      className={cn(
        bodyTextVariants({ size, weight, muted, gutterBottom }),
        className
      )}
      {...props}
    />
  );
}

export const leadVariants = cva(
  "text-xl text-muted-foreground leading-relaxed not-italic",
  {
    variants: {
      gutterBottom: {
        true: "mb-4",
      },
    },
  }
);

interface LeadProps
  extends React.ComponentPropsWithoutRef<"p">,
    VariantProps<typeof leadVariants> {
  asChild?: boolean;
}

export function Lead({
  asChild,
  gutterBottom,
  className,
  ...props
}: LeadProps) {
  const Comp = asChild ? SlotPrimitive : "p";

  return (
    <Comp
      className={cn(leadVariants({ gutterBottom }), className)}
      {...props}
    />
  );
}

export const largeVariants = cva("text-lg font-semibold not-italic", {
  variants: {
    gutterBottom: {
      true: "mb-4",
    },
  },
});

interface LargeProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof largeVariants> {
  asChild?: boolean;
}

export function Large({
  asChild,
  gutterBottom,
  className,
  ...props
}: LargeProps) {
  const Comp = asChild ? SlotPrimitive : "div";

  return (
    <Comp
      className={cn(largeVariants({ gutterBottom }), className)}
      {...props}
    />
  );
}

// ==================== SMALL TEXT ====================

export const smallVariants = cva(
  "text-sm font-medium leading-none not-italic",
  {
    variants: {
      gutterBottom: {
        true: "mb-4",
      },
    },
  }
);

interface SmallProps
  extends React.ComponentPropsWithoutRef<"p">,
    VariantProps<typeof smallVariants> {
  asChild?: boolean;
}

export function Small({
  asChild,
  gutterBottom,
  className,
  ...props
}: SmallProps) {
  const Comp = asChild ? SlotPrimitive : "p";

  return (
    <Comp
      className={cn(smallVariants({ gutterBottom }), className)}
      {...props}
    />
  );
}

// ==================== MUTED TEXT ====================

export const mutedVariants = cva("text-sm text-muted-foreground not-italic", {
  variants: {
    gutterBottom: {
      true: "mb-4",
    },
  },
});

interface MutedProps
  extends React.ComponentPropsWithoutRef<"p">,
    VariantProps<typeof mutedVariants> {
  asChild?: boolean;
}

export function Muted({
  asChild,
  gutterBottom,
  className,
  ...props
}: MutedProps) {
  const Comp = asChild ? SlotPrimitive : "p";

  return (
    <Comp
      className={cn(mutedVariants({ gutterBottom }), className)}
      {...props}
    />
  );
}

// ==================== INLINE CODE ====================

export const inlineCodeVariants = cva(
  "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
);

interface InlineCodeProps
  extends React.ComponentPropsWithoutRef<"code">,
    VariantProps<typeof inlineCodeVariants> {
  asChild?: boolean;
}

export function InlineCode({ asChild, className, ...props }: InlineCodeProps) {
  const Comp = asChild ? SlotPrimitive : "code";

  return <Comp className={cn(inlineCodeVariants(), className)} {...props} />;
}

// ==================== BLOCKQUOTE ====================

export const blockquoteVariants = cva(
  "mt-6 border-l-4 border-primary pl-6 italic",
  {
    variants: {
      gutterBottom: {
        true: "mb-4",
      },
    },
  }
);

interface BlockquoteProps
  extends React.ComponentPropsWithoutRef<"blockquote">,
    VariantProps<typeof blockquoteVariants> {
  asChild?: boolean;
}

export function Blockquote({
  asChild,
  gutterBottom,
  className,
  ...props
}: BlockquoteProps) {
  const Comp = asChild ? SlotPrimitive : "blockquote";

  return (
    <Comp
      className={cn(blockquoteVariants({ gutterBottom }), className)}
      {...props}
    />
  );
}

// ==================== LIST ====================

export const listVariants = cva("my-6 ml-6 list-disc [&>li]:mt-2");

interface ListProps
  extends React.ComponentPropsWithoutRef<"ul">,
    VariantProps<typeof listVariants> {
  asChild?: boolean;
}

export function List({ asChild, className, ...props }: ListProps) {
  const Comp = asChild ? SlotPrimitive : "ul";

  return <Comp className={cn(listVariants(), className)} {...props} />;
}

// ==================== EXPORTS ====================

// Legacy exports for backward compatibility
export const H1 = (props: Omit<HeadingProps, "level">) => (
  <Heading level={1} {...props} />
);
export const H2 = (props: Omit<HeadingProps, "level">) => (
  <Heading level={2} {...props} />
);
export const H3 = (props: Omit<HeadingProps, "level">) => (
  <Heading level={3} {...props} />
);
export const H4 = (props: Omit<HeadingProps, "level">) => (
  <Heading level={4} {...props} />
);
export const H5 = (props: Omit<HeadingProps, "level">) => (
  <Heading level={5} {...props} />
);
export const H6 = (props: Omit<HeadingProps, "level">) => (
  <Heading level={6} {...props} />
);

// Type exports
export type {
  HeadingProps,
  BodyTextProps,
  LeadProps,
  LargeProps,
  SmallProps,
  MutedProps,
  InlineCodeProps,
  BlockquoteProps,
  ListProps,
};
