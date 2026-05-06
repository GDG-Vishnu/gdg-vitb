"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type DevelopmentComponent = {
  id: string;
  name: string;
  description: string;
  component: React.ReactNode;
};

const previewCardClassName =
  "rounded-2xl border border-black/10 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)]";

export const developmentRegistry: DevelopmentComponent[] = [
  {
    id: "button-set",
    name: "Button Variants",
    description: "Validate hover states, spacing, and variant consistency.",
    component: (
      <div className={previewCardClassName}>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Button variant="default">Primary</Button>
          <Button variant="blue">Blue</Button>
          <Button variant="green">Green</Button>
          <Button variant="yellow">Yellow</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <p className="text-sm text-black/70">
          Use this block to test button states before moving to a production
          page.
        </p>
      </div>
    ),
  },
  {
    id: "contact-form-fields",
    name: "Form Field Group",
    description: "Test form controls in one place before integrating forms.",
    component: (
      <div className={previewCardClassName}>
        <div className="space-y-3">
          <Input placeholder="Your name" aria-label="Name" />
          <Input placeholder="you@example.com" aria-label="Email" />
          <Textarea placeholder="Write your message" aria-label="Message" />
          <div className="flex justify-end">
            <Button variant="default">Submit</Button>
          </div>
        </div>
      </div>
    ),
  },
];
