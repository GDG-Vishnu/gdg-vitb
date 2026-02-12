# Unused Files Report

> **Generated:** February 10, 2026  
> **Method:** Full import-graph traversal from all Next.js entry points (pages, layouts, API routes, middleware)  
> **Workspace:** `gdg-vishnu-app`

---

## Summary

| Category                             | Unused Files  | Estimated Cleanup |
| ------------------------------------ | :-----------: | :---------------: |
| UI Components (`src/components/ui/`) |      44       |    High impact    |
| Orphaned Components                  |      10       |   Medium impact   |
| Unused Hooks                         |       3       |    Low impact     |
| Unused Lib Utilities                 |       3       |    Low impact     |
| Unused API Routes                    |       3       |   Medium impact   |
| Dead Data Files                      |       2       |    Low impact     |
| Unused Assets & Static Files         |      10       |    Low impact     |
| Empty Directories                    |       5       |      Cleanup      |
| **Total**                            | **~80 files** |                   |

---

## 1. Unused UI Components (44 files)

These Shadcn/Radix UI components exist in `src/components/ui/` but are **never imported** by any page, layout, or component in the active import graph.

### Completely Unused (no imports anywhere)

| File                                           | Notes                                       |
| ---------------------------------------------- | ------------------------------------------- |
| `src/components/ui/accordion.tsx`              |                                             |
| `src/components/ui/alert.tsx`                  |                                             |
| `src/components/ui/alert-dialog.tsx`           |                                             |
| `src/components/ui/animated-theme-toggler.tsx` |                                             |
| `src/components/ui/app-card.tsx`               | Only imports badge/card/doodles internally  |
| `src/components/ui/aspect-ratio.tsx`           |                                             |
| `src/components/ui/bento-grid.tsx`             |                                             |
| `src/components/ui/breadcrumb.tsx`             |                                             |
| `src/components/ui/calendar.tsx`               |                                             |
| `src/components/ui/carousel.tsx`               |                                             |
| `src/components/ui/chart.tsx`                  |                                             |
| `src/components/ui/checkbox.tsx`               |                                             |
| `src/components/ui/collapsible.tsx`            |                                             |
| `src/components/ui/command.tsx`                | Only used by faceted.tsx (also unused)      |
| `src/components/ui/context-menu.tsx`           |                                             |
| `src/components/ui/dialog.tsx`                 | Only used by command.tsx (also unused)      |
| `src/components/ui/drawer.tsx`                 |                                             |
| `src/components/ui/dropdown-menu.tsx`          |                                             |
| `src/components/ui/faceted.tsx`                |                                             |
| `src/components/ui/form.tsx`                   |                                             |
| `src/components/ui/hover-card.tsx`             |                                             |
| `src/components/ui/input-otp.tsx`              |                                             |
| `src/components/ui/loading-fallbacks.tsx`      |                                             |
| `src/components/ui/loading-overlay.tsx`        |                                             |
| `src/components/ui/loading-page.tsx`           |                                             |
| `src/components/ui/menubar.tsx`                |                                             |
| `src/components/ui/navigation-menu.tsx`        |                                             |
| `src/components/ui/pagination.tsx`             |                                             |
| `src/components/ui/parallax-scroll.tsx`        |                                             |
| `src/components/ui/popup-animations.tsx`       |                                             |
| `src/components/ui/progress.tsx`               |                                             |
| `src/components/ui/radio-group.tsx`            |                                             |
| `src/components/ui/resizable.tsx`              |                                             |
| `src/components/ui/scroll-area.tsx`            |                                             |
| `src/components/ui/select.tsx`                 |                                             |
| `src/components/ui/separator.tsx`              |                                             |
| `src/components/ui/sheet.tsx`                  |                                             |
| `src/components/ui/skeleton.tsx`               |                                             |
| `src/components/ui/skeleton-loaders.tsx`       |                                             |
| `src/components/ui/slider.tsx`                 |                                             |
| `src/components/ui/sortable.tsx`               |                                             |
| `src/components/ui/spinner-components.ts`      |                                             |
| `src/components/ui/switch.tsx`                 |                                             |
| `src/components/ui/table.tsx`                  |                                             |
| `src/components/ui/tabs.tsx`                   |                                             |
| `src/components/ui/toggle.tsx`                 | Only used by toggle-group.tsx (also unused) |
| `src/components/ui/toggle-group.tsx`           |                                             |
| `src/components/ui/tooltip.tsx`                |                                             |

### UI Components That ARE Used (keep these)

| File                                | Used By                                                             |
| ----------------------------------- | ------------------------------------------------------------------- |
| `src/components/ui/3d-button.tsx`   | Home/page.tsx, ComingSoonPage.tsx                                   |
| `src/components/ui/avatar.tsx`      | Home/page.tsx, ComingSoonPage.tsx                                   |
| `src/components/ui/back_to_top.tsx` | app/layout.tsx                                                      |
| `src/components/ui/badge.tsx`       | Internal (app-card) — but app-card is unused itself                 |
| `src/components/ui/button.tsx`      | not-found.tsx, events/page.tsx, contactus/page.tsx, Home/events.tsx |
| `src/components/ui/doodles.tsx`     | Internal (app-card) — but app-card is unused itself                 |
| `src/components/ui/input.tsx`       | contactus/page.tsx                                                  |
| `src/components/ui/label.tsx`       | Internal (form.tsx) — but form.tsx is unused itself                 |
| `src/components/ui/loading.tsx`     | Internal (loading-fallbacks, 3d-button)                             |
| `src/components/ui/popover.tsx`     | Internal (faceted) — but faceted is unused itself                   |
| `src/components/ui/sonner.tsx`      | providers.tsx                                                       |
| `src/components/ui/spinner.tsx`     | Internal (loading.tsx)                                              |
| `src/components/ui/textarea.tsx`    | contactus/page.tsx                                                  |

> **Note:** `badge`, `card`, `doodles`, `label`, `popover` are only used by **other unused** UI components. They can be safely removed as part of the cleanup.

---

## 2. Orphaned Components (10 files)

These components exist but are never imported by any active page or layout.

| File                                             | Reason                                    |
| ------------------------------------------------ | ----------------------------------------- |
| `src/components/DotBackground.tsx`               | No imports found anywhere                 |
| `src/components/icons.tsx`                       | No imports found anywhere                 |
| `src/components/stack-component.tsx`             | No imports found anywhere                 |
| `src/components/chat/ChatBox.tsx`                | Import in layout.tsx is **commented out** |
| `src/components/coming-soon/ComingSoonPage.tsx`  | No external imports                       |
| `src/components/coming-soon/index.ts`            | Barrel export for unused ComingSoonPage   |
| `src/components/global/GradientCard.tsx`         | No imports found anywhere                 |
| `src/components/toast/index.ts`                  | No external imports                       |
| `src/components/toast/toast-notifications.ts`    | Only re-exported by toast/index.ts        |
| `src/components/loadingPage/developmentpage.tsx` | Not re-exported from barrel, no imports   |

### Orphaned Client Sub-Components

These files in `src/app/client/contactus/` were refactored out but the parent page (`contactus/page.tsx`) never imports them — it uses its own inline implementation instead.

| File                                            | Reason                             |
| ----------------------------------------------- | ---------------------------------- |
| `src/app/client/contactus/ContactForm.tsx`      | Not imported by contactus/page.tsx |
| `src/app/client/contactus/ContactInfoCards.tsx` | Not imported by contactus/page.tsx |
| `src/app/client/contactus/PageHeader.tsx`       | Not imported by contactus/page.tsx |
| `src/app/client/contactus/SocialLinks.tsx`      | Not imported by contactus/page.tsx |

### Orphaned Page File

| File                        | Reason                                                        |
| --------------------------- | ------------------------------------------------------------- |
| `src/app/events/events.tsx` | Never imported — `events/page.tsx` has its own implementation |

---

## 3. Unused Hooks (3 files)

| File                                  | Reason                                                     |
| ------------------------------------- | ---------------------------------------------------------- |
| `src/hooks/use-callback-ref.ts`       | Only imported by `use-debounced-callback.ts` (also unused) |
| `src/hooks/use-debounced-callback.ts` | No imports found                                           |
| `src/hooks/use-popup-animations.ts`   | No imports found                                           |

---

## 4. Unused Lib Utilities (3 files)

| File                      | Reason                                   |
| ------------------------- | ---------------------------------------- |
| `src/lib/compose-refs.ts` | Only imported by `sortable.tsx` (unused) |
| `src/lib/format.ts`       | No imports found                         |
| `src/lib/id.ts`           | No imports found                         |

### Lib Files That ARE Used (keep these)

- `src/lib/utils.ts` — Used by Navbar components, ChatBox
- `src/lib/auth.ts` — Used by NextAuth API route
- `src/lib/prisma.ts` — Used by 6 API routes

---

## 5. Unused API Routes (3 files)

These API routes exist but are never called via `fetch()` or referenced anywhere in the client code.

| File                                     | Endpoint                 | Reason                                                 |
| ---------------------------------------- | ------------------------ | ------------------------------------------------------ |
| `src/app/api/gallery/route.ts`           | `/api/gallery`           | Gallery page uses hardcoded data, never calls this API |
| `src/app/api/teams/get-by-name/route.ts` | `/api/teams/get-by-name` | No fetch calls found                                   |
| `src/app/api/teams/name-rank/route.ts`   | `/api/teams/name-rank`   | No fetch calls found                                   |

### API Routes That ARE Used (keep these)

- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth convention
- `src/app/api/events/list/route.ts` — Called by events page & home page
- `src/app/api/events/[id]/route.ts` — Called by event detail page
- `src/app/api/teams/list/route.ts` — Called by Teams page

---

## 6. Unused Data Files (2 files)

| File                      | Reason                         |
| ------------------------- | ------------------------------ |
| `src/data/countries.json` | No imports or references found |
| `src/data/states.json`    | No imports or references found |

---

## 7. Unused Assets & Static Files (10 files)

| File                          | Reason                                              |
| ----------------------------- | --------------------------------------------------- |
| `src/assets/Logo.jpg`         | No imports or references found                      |
| `src/app/favicon.jpg`         | Not referenced (only `favicon.ico` is used)         |
| `src/app/favicon-64.ico`      | Not referenced                                      |
| `src/app/favicon-128.ico`     | Not referenced                                      |
| `src/app/favicon-256.ico`     | Not referenced                                      |
| `src/app/favicon-512.ico`     | Not referenced                                      |
| `public/cursor/Vector 16.png` | No references found                                 |
| `public/llms-new.txt`         | No references (may be intentional for AI crawlers)  |
| `public/llms.txt`             | No references (may be intentional for AI crawlers)  |
| `kn.html` (root)              | Standalone HTML email template, not part of the app |

### Questionable

| File                              | Notes                                                                                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `routes.json` (root)              | Developer reference doc, not consumed by code. Keep or remove at discretion.                                                                |
| `src/assets/assignment-task.docx` | Referenced as `/assignment-task.docx` in recruitment page, but lives in `src/assets/` — may need to be moved to `public/` to actually work. |

---

## 8. Empty Directories (5 directories)

These directories contain no files and serve no purpose.

| Directory                                                                      |
| ------------------------------------------------------------------------------ |
| `src/config/`                                                                  |
| `src/constants/`                                                               |
| `src/components/about/`                                                        |
| `src/utils/toasts/`                                                            |
| `src/components/footer/constants/`, `schema/`, `sections/`, `types/`, `utils/` |

---

## 9. Type Declaration Files

| File                           | Status     | Reason                                       |
| ------------------------------ | ---------- | -------------------------------------------- |
| `src/types/next-auth.d.ts`     | **KEEP**   | Ambient type augmentation for NextAuth       |
| `src/types/dnd-kit-shims.d.ts` | **UNUSED** | Only supports `sortable.tsx` which is unused |

---

## Recommendations

### Immediate Cleanup (Safe to Delete)

1. **44 unused UI components** — These are Shadcn scaffolding components that were never integrated. Removing them significantly declutters the project.
2. **Orphaned components** (DotBackground, icons, stack-component, ChatBox, coming-soon, GradientCard, toast, developmentpage) — Dead code with no consumers.
3. **Unused contactus sub-components** (ContactForm, ContactInfoCards, PageHeader, SocialLinks) — Superseded by inline implementation.
4. **Orphaned events.tsx** in `src/app/events/` — Duplicate logic that's never imported.
5. **All 3 unused hooks** and **3 unused lib files**.
6. **Empty directories** — No purpose.

### Review Before Deleting

- **Unused API routes** (`/api/gallery`, `/api/teams/get-by-name`, `/api/teams/name-rank`) — May be planned for future use.
- **`public/llms.txt` and `public/llms-new.txt`** — May be intentionally served for AI/LLM crawlers.
- **`routes.json`** — Useful as developer documentation even if not consumed by code.
- **Unused favicon variants** — May be needed for PWA or different platforms.

### Action Required

- **`src/assets/assignment-task.docx`** — The recruitment page links to `/assignment-task.docx` but the file is in `src/assets/`, not `public/`. Move to `public/` or fix the link.
