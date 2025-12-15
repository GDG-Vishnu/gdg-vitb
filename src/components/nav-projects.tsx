"use client";

import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const pathname = usePathname();
  const { state } = useSidebar();

  const getActiveStyles = (url: string, index: number) => {
    const isActive = pathname === url;

    if (isActive) {
      // Google colors rotation
      const colors = [
        {
          bg: "bg-blue-100 dark:bg-blue-900/30",
          text: "text-blue-800 dark:text-blue-200",
          border: "border-blue-500 dark:border-blue-400",
          icon: "text-blue-600 dark:text-blue-400",
        },
        {
          bg: "bg-red-100 dark:bg-red-900/30",
          text: "text-red-800 dark:text-red-200",
          border: "border-red-500 dark:border-red-400",
          icon: "text-red-600 dark:text-red-400",
        },
        {
          bg: "bg-yellow-100 dark:bg-yellow-900/30",
          text: "text-yellow-800 dark:text-yellow-200",
          border: "border-yellow-500 dark:border-yellow-400",
          icon: "text-yellow-600 dark:text-yellow-400",
        },
        {
          bg: "bg-green-100 dark:bg-green-900/30",
          text: "text-green-800 dark:text-green-200",
          border: "border-green-500 dark:border-green-400",
          icon: "text-green-600 dark:text-green-400",
        },
      ];
      const colorSet = colors[index % colors.length];
      return {
        className: `${colorSet.bg} ${colorSet.text} border-l-${
          state === "collapsed" ? "2" : "4"
        } ${colorSet.border} shadow-sm`,
        iconClassName: colorSet.icon,
      };
    }
    return {
      className: "hover:bg-accent hover:text-accent-foreground",
      iconClassName: "text-muted-foreground group-hover:text-foreground",
    };
  };

  return (
    <SidebarGroup>
      <SidebarMenu className="py-3">
        {projects.map((item, index) => {
          const styles = getActiveStyles(item.url, index);
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <a
                  href={item.url}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${styles.className}`}
                >
                  <item.icon className={`h-4 w-4 ${styles.iconClassName}`} />
                  <span className="group-data-[collapsible=icon]:hidden font-productSans">
                    {item.name}
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
