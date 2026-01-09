# Unused / "Admin Side" Files Report

Based on the analysis of the project structure and file usage, the following files and directories appear to be unused or part of an "Admin/Dashboard" system that is not integrated into the main client-side application.

## 1. Admin/Dashboard Components (Unused)

These files are associated with a dashboard layout (Sidebar, Admin Navigation) but are not imported by the main application routes.

- `src/components/app-sidebar.tsx`
- `src/components/enhanced-sidebar-provider.tsx`
- `src/components/nav-main.tsx`
- `src/components/nav-projects.tsx`
- `src/components/nav-user.tsx`
- `src/components/sidebar-right.tsx`
- `src/components/team-switcher.tsx`
- `src/components/ui/sidebar.tsx` (Shadcn Sidebar component)
- `src/hooks/use-mobile.ts`
- `src/components/analytics/` (Folder - Charts/Graphs)

## 2. Unused Client-Side Logic (Redundant)

The `src/app/events` and `src/app/hack-a-tron-3.0` routes implement their logic directly, making the corresponding `client` folder versions redundant.

- `src/app/client/events/` (Folder - `page.tsx`, `[id]/page.tsx`) - **TRASH** (Active route is `src/app/events/`)
- `src/app/client/hack-a-tron-3.0/` (Folder - `page.tsx`) - **TRASH** (Active route is `src/app/hack-a-tron-3.0/`)

**Note:** Other folders in `src/app/client/` (`about`, `contactus`, `gallery`, `Teams`, `Home`) **ARE USED** by the main routes.

## 3. Development & Examples (Trash)

Files used for testing, examples, or development sandboxes.

- `src/app/development/` (Folder)
- `src/examples/` (Folder - e.g., `form-configs.ts`)
- `src/components/combobox/` (Folder - Component examples)
- `src/components/ui/parallax-scroll-demo.tsx`
- `src/app/client/parallax-demo/`

## 4. Complex Form/Table Extensions (Likely Unused)

These appear to be unused extensions for forms and data tables, common in admin templates.

- `src/components/ui/extension/` (Folder - `date-time-picker`, `multi-select`, etc.)
- `src/config/data-table.ts`
- `src/hooks/use-data-table.ts`
- `src/lib/data-table.ts`
- `src/types/data-table.ts`
- `src/types/reusable-table.ts`

## 5. Admin API Routes

These API endpoints support admin Create/Update/Delete operations which have no corresponding UI in the client app.

- `src/app/api/teams/create/`
- `src/app/api/teams/delete/`
- `src/app/api/teams/update/`
google-site-verification=jv2S0joNU078TvBLWJLpx5_zFcN2sU4rNxKsU5K8bRw