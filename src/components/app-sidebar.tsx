"use client";

import * as React from "react";
import Image from "next/image";
import {
  GalleryVerticalEnd,
  FormInput,
  Users,
  Search,
  HelpCircle,
  Settings,
  LogOut,
  Cloud,
  Calendar,
} from "lucide-react";
// Auth removed: no session or signOut
import { useRouter } from "next/navigation";
import Logo from "@/assets/Logo.webp";

import { NavProjects } from "@/components/nav-projects";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

// This is sample data.
/*
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}
*/

// New simplified data structure
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  // Admin navigation is disabled to prevent admin pages from compiling.
  // If you want to re-enable admin routes later, restore the entries below.
  projects: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, toggleSidebar } = useSidebar();
  const session = null as any;
  const router = useRouter();
  const isCollapsed = state === "collapsed";
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [shouldFocusSearch, setShouldFocusSearch] = React.useState(false);

  // Focus search input when sidebar opens after clicking search button
  React.useEffect(() => {
    if (!isCollapsed && shouldFocusSearch && searchInputRef.current) {
      // Small delay to ensure the transition is complete
      setTimeout(() => {
        searchInputRef.current?.focus();
        setShouldFocusSearch(false);
      }, 300);
    }
  }, [isCollapsed, shouldFocusSearch]);

  const handleSearchButtonClick = () => {
    setShouldFocusSearch(true);
    toggleSidebar();
  };

  const handleLogout = () => {
    router.push("/");
  };

  // Fallback user data if session is not available
  const userData = session?.user
    ? {
        name: session.user.name || "User",
        email: session.user.email || "",
        avatar: session.user.image || "",
      }
    : data.user;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        {/* Logo Section */}
        <div className="px-4 pt-4 pb-2 text-center">
          {!isCollapsed ? (
            <>
              <div className="mb-3 flex justify-center">
                <div className="relative">
                  {/* Circular border with 4 colored segments */}
                  <div
                    className="w-16 h-16 rounded-full p-1 flex items-center justify-center"
                    style={{
                      background: `conic-gradient(
            #4285F4 0deg 90deg,
            #EA4335 90deg 180deg,
            #FBBC04 180deg 270deg,
            #34A853 270deg 360deg
          )`,
                    }}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-gray-900">
                      <Image
                        src={Logo}
                        alt="GDG Logo"
                        width={64}
                        height={64}
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Developer Groups Text */}
              <h1 className="text-sm font-medium tracking-wide text-foreground mb-2 font-productSans">
                Google Developer Groups
              </h1>
            </>
          ) : (
            <div className="flex justify-center mb-2">
              <div className="relative">
                {/* Smaller logo for collapsed state */}
                <div
                  className="w-8 h-8 rounded-full p-0.5 flex items-center justify-center"
                  style={{
                    background: `conic-gradient(
          #4285F4 0deg 90deg,
          #EA4335 90deg 180deg,
          #FBBC04 180deg 270deg,
          #34A853 270deg 360deg
        )`,
                  }}
                >
                  <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-gray-900">
                    <Image
                      src={Logo}
                      alt="GDG Logo"
                      width={32}
                      height={32}
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Bar for collapsed state - below logo */}
        {isCollapsed && (
          <div className="flex justify-center pb-4">
            <button
              onClick={handleSearchButtonClick}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-transparent border-0 hover:bg-accent/50 hover:text-accent-foreground transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Open search"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        )}

        {/* Search Bar for expanded state */}
        {!isCollapsed && (
          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search..."
                className="pl-10 h-9 bg-muted/50 border-muted-foreground/20 focus:border-primary transition-colors"
              />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {/* Help Line and Settings Section */}
        {!isCollapsed && (
          <div className="px-2 py-1 space-y-1">
            <button className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
              <Settings className="h-4 w-4" />
              <span className="font-productSans">Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-productSans">Log Out</span>
            </button>
          </div>
        )}

        {/* Collapsed state icons */}
        {isCollapsed && (
          <div className="flex flex-col items-center py-2 space-y-2">
            <button className="flex items-center justify-center w-10 h-10 rounded-lg bg-transparent hover:bg-accent/50 transition-colors">
              <Settings className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-transparent hover:bg-accent/50 transition-colors"
            >
              <LogOut className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        )}

        {/* User Profile Section */}
        <div
          className={`border-t border-sidebar-border ${
            isCollapsed ? "flex justify-center py-2" : "p-3"
          }`}
        >
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="rounded-lg">
                  {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate font-productSans">
                  {userData.name}
                </p>
                <p className="text-xs text-muted-foreground truncate font-productSans">
                  {userData.email}
                </p>
              </div>
            </div>
          ) : (
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback className="rounded-lg">
                {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Theme Toggle */}
        <div className="flex justify-center py-2 border-t border-sidebar-border">
          <AnimatedThemeToggler />
        </div>

        {/* Sidebar Trigger */}
        <div className="px-2 pb-2">
          <SidebarTrigger className="w-full" />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
