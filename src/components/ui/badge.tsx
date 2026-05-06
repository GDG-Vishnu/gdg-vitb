import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-2 border-black px-2.5 py-1 text-xs font-bold font-productSans transition-colors",
  {
    variants: {
      variant: {
        default: "bg-black text-white",
        secondary: "bg-blue-100 text-black",
        accent: "bg-yellow-200 text-black",
        success: "bg-green-200 text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
