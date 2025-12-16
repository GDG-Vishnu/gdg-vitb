"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarRight } from "@/components/sidebar-right";
import { Button3D } from "@/components/ui/3d-button";
import { SidebarInset } from "@/components/ui/sidebar";
import { EnhancedSidebarProvider } from "@/components/enhanced-sidebar-provider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Calendar } from "lucide-react";
import { useState, useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
