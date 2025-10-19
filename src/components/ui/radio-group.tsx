"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  children?: React.ReactNode;
}) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        // pill-like visible option
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-700 text-sm transition-colors duration-200 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        // checked state: filled primary bg and white text
        "data-[state=checked]:bg-primary data-[state=checked]:text-white data-[state=checked]:border-primary",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        {/* inner dot ONLY renders when checked (Radix Indicator appears only for selected item) */}
        <span className="block w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-white shadow-inner transform transition-transform duration-150" />
      </RadioGroupPrimitive.Indicator>

      {/* show the option label/text so options are visible without clicking */}
      {children && <span className="leading-none">{children}</span>}
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
