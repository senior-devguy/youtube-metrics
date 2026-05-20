# Design System — Fleetmule-style

> Design language distilled from the Fleetmule platform web app. This is the **source of truth** for all UI work in this repo, independent of folder structure.
> Whenever a future prompt asks for design / theme / UI / styling — refer back to this file.

---

## 1. Stack & Foundations

| Concern         | Choice                                                   |
| --------------- | -------------------------------------------------------- |
| Framework       | React + TypeScript                                        |
| Build           | Vite                                                      |
| Styling engine  | **Tailwind CSS v4** (with `@theme` directive)             |
| Component kit   | **shadcn/ui** — `style: "new-york"`, `baseColor: "slate"` |
| Animations      | `tw-animate-css` + custom `@keyframes`                    |
| Icons           | **Lucide** (primary). Default `stroke-width: 1`           |
| Theming         | `next-themes` — **class-based dark mode** (`.dark`)       |
| Forms           | `react-hook-form` + `zod`                                 |
| Toasts          | `sonner` (always through a thin wrapper, never imported directly) |
| Tables / data   | `@tanstack/react-table`, `recharts`                       |
| DnD             | `@hello-pangea/dnd`                                       |
| Path alias      | `@/*` → source root                                       |
| Class merging   | A `cn()` helper combining `clsx` + `tailwind-merge`       |

**Golden rule:** never hand-edit shadcn primitives — they are regenerated via the shadcn CLI. Compose on top, don't patch them.

---

## 2. Design Tokens (CSS variables)

All colors live as **HSL triplets** in `:root` / `.dark`, exposed to Tailwind via `@theme`. Always reference tokens — **never hard-code hex/HSL values** in components.

### Color tokens

| Token (Tailwind class)                       | Light                  | Dark                   | Use for                          |
| -------------------------------------------- | ---------------------- | ---------------------- | -------------------------------- |
| `background` / `foreground`                  | `0 0% 100%` / `222 47% 11%` | `222 47% 6%` / `210 40% 98%` | page bg, body text       |
| `card` / `card-foreground`                   | white / slate-900      | `222 47% 8%`           | raised surfaces                  |
| `popover` / `popover-foreground`             | white                  | `222 47% 8%`           | menus, hover-cards               |
| `primary` / `primary-foreground`             | **`235 100% 71%`** (indigo-violet) / white | same | brand CTAs, accents |
| `secondary` / `secondary-foreground`         | `220 14% 96%`          | `217 19% 14%`          | subdued bg                       |
| `muted` / `muted-foreground`                 | `220 14% 96%` / `220 11% 36%` | `217 19% 14%` / `215 20% 65%` | de-emphasized text, skeletons |
| `accent` / `accent-foreground`               | `220 14% 96%`          | `217 19% 14%`          | hover states                     |
| `destructive` / `destructive-foreground`     | `0 72% 50%` / `0 85% 97%` | `0 84% 60%`         | delete, errors, danger CTAs      |
| `success` / `success-foreground`             | `142 72% 35%`          | `142 72% 40%`          | active, completed, signed        |
| `warning` / `warning-foreground`             | `38 92% 50%`           | `38 92% 55%`           | pending, in-progress             |
| `info` / `info-foreground`                   | `200 80% 50%`          | `200 80% 55%`          | sent, scheduled, AI hints        |
| `border` / `input`                           | `210 25% 90%`          | `217 19% 18%`          | dividers, input borders          |
| `ring`                                       | `235 100% 71%`         | same                   | focus ring (matches `primary`)   |

### Sidebar tokens (separate palette)

`sidebar-background`, `sidebar-foreground`, `sidebar-primary`, `sidebar-accent`, `sidebar-accent-foreground`, `sidebar-border`, `sidebar-ring`, `sidebar-muted` — scoped so the sidebar can theme independently of the main canvas. Use them inside the rail; outside, use the main palette.

### Chart palette

`chart-1` … `chart-5` — desaturated cool greys/blues. Designed to look quiet (data first, not chrome), not to compete with brand color.

### Radius scale

```css
--radius: 0.625rem;          /* base (10px) */
--radius-sm: calc(var(--radius) - 4px);   /* 6px */
--radius-md: calc(var(--radius) - 2px);   /* 8px */
--radius-lg: var(--radius);               /* 10px */
--radius-xl: calc(var(--radius) + 4px);   /* 14px */
```

Cards typically use `rounded-xl`; buttons/inputs `rounded-md`; pills/badges `rounded-full`.

### Shadow scale (very subtle)

Shadows are intentionally **flat and tight** — 1–8 px offsets, 4–10 % alpha. "Modern admin" feel, not skeuomorphic.

```
--shadow-2xs, --shadow-xs, --shadow-sm   /* 0 1px 2px 0 rgb(0 0 0 / 0.04) */
--shadow, --shadow-md                    /* 0 2px 8px -2px rgb(0 0 0 / 0.06) */
--shadow-lg, --shadow-xl, --shadow-2xl   /* slightly deeper */
```

Cards default to `shadow-sm`; hover bumps to `shadow-md`. Avoid `shadow-lg+` for normal content — reserve for popovers / modals.

---

## 3. Typography

Three families. **Default everything to Inter.**

```css
--font-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
--font-serif: 'Source Serif 4', 'Crimson Pro', ui-serif, Georgia, ...;
--font-mono: 'SF Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, ...;
```

Inter ligatures are enabled (`font-feature-settings: "cv02","cv03","cv04","cv11"` on `body`).

Decorative scripts (`Dancing Script`, `Great Vibes`, `Caveat`) are loaded for **signature pads only** — do not use them for general UI.

### Type scale (in practice)

| Role                     | Class                                          |
| ------------------------ | ---------------------------------------------- |
| Page H1 / Hero title     | `text-3xl font-semibold tracking-tight`        |
| Section H2               | `text-xl font-semibold` or `text-lg font-semibold` |
| Card title               | `text-2xl font-semibold leading-none tracking-tight` |
| Sheet/Dialog title       | `text-lg font-semibold leading-none tracking-tight` |
| Body                     | `text-sm` (default UI text)                    |
| Meta / muted captions    | `text-sm text-muted-foreground`                |
| Tiny labels (uppercase)  | `text-xs font-medium uppercase tracking-wider text-muted-foreground` |
| Section header in sidebar| `text-xs font-medium uppercase tracking-wider text-sidebar-muted` |
| Form labels              | `text-sm font-medium`                          |
| Buttons / inputs / cells | `text-sm`                                      |
| Badges                   | `text-xs font-semibold` or `text-xs font-medium` |

**Tracking:** `tracking-tight` on big headings; `tracking-wider` on uppercase eyebrow labels. Default elsewhere.

---

## 4. Layout

### Shell

```
┌──────────┬─────────────────────────────────────────────────┐
│          │  main (flex-1, h-screen, overflow-auto)         │
│ Sidebar  │  └─ mx-auto max-w-[1600px] w-full              │
│ (272 px) │     └─ Outlet                                   │
│          │                                                 │
└──────────┴─────────────────────────────────────────────────┘
```

- App container: `flex h-screen w-full overflow-hidden bg-background`
- Sidebar: `md:w-[272px]` expanded, `md:w-16` collapsed. Mobile = full-screen drawer with backdrop (`bg-background/80 backdrop-blur-sm`).
- Main content: capped at `max-w-[1600px]`, centered, scrollable.
- Content sub-pages tighten further: dashboard hero `max-w-5xl`, inner prompt area `max-w-3xl`.
- Page padding: `px-6 pb-12` is a common convention; tabs/forms commonly use `p-6`.

### Spacing

Standard Tailwind scale — no custom spacing tokens. Common patterns:
- Section vertical rhythm: `space-y-8` between major sections, `space-y-4` within a section.
- Stat tile grid: `grid grid-cols-1 sm:grid-cols-3 gap-4`.
- Card grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`.
- Page header: `flex items-center justify-between` with `space-y-2` for the title cluster.

### Breakpoints

Default Tailwind: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.
The sidebar auto-collapses below `lg` and becomes a drawer below `md`.

---

## 5. Component patterns

### Buttons

Variants: `default | destructive | outline | secondary | ghost | link`.
Sizes: `default (h-10 px-4) | sm (h-9 px-3) | lg (h-11 px-8) | icon (h-10 w-10)`.

- Always include `cursor-pointer`.
- Use `asChild` to wrap a router link / anchor so the styling carries over.
- Icon-only buttons use `size="icon"` and always include `<span className="sr-only">` for a11y.
- Loading states: disable the button; let the `disabled:opacity-50` baseline handle visuals.

### Cards

`Card` baseline: `rounded-lg border bg-card text-card-foreground shadow-sm`. Override to `rounded-xl` for dashboard tiles.
Structure: `<Card><CardHeader/><CardContent/><CardFooter/></Card>`. `CardHeader` is `p-6 space-y-1.5`; `CardContent` is `p-6 pt-0`.

**Hover affordance for clickable cards:** `cursor-pointer hover:shadow-md hover:border-primary/20 transition`.

### Inputs

`h-10 rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm`.
Focus ring: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
Date / time inputs need custom `::-webkit-calendar-picker-indicator` styling (opacity 0.6 → 1 on hover, flush right edge).

### Badges & status

Two flavors:
1. **Plain `Badge`** (shadcn): `rounded-full px-2.5 py-0.5 text-xs font-semibold`. Variants: `default | secondary | destructive | outline`. For one-off labels.
2. **`StatusBadge`** — semantic status pill with soft tint. **Use this for any status / state indicator.** Variants:
   - `success` → green tint (active, completed, signed, hired, passed)
   - `warning` → amber (pending, in_progress, screening, withdrawn)
   - `destructive` → red (inactive, failed, rejected, terminated, revoked)
   - `info` → blue (sent, scheduled)
   - `default` → primary tint
   - `muted` → grey

   Pattern: `bg-{variant}/10 text-{variant} border-{variant}/20`, optional leading status dot.

### Dialogs vs Sheets vs Drawers — when to use which

- **Dialog**: centered modal, `max-w-lg`, dim overlay (`bg-black/80`). For short confirmations, focused edits, dangerous actions. Animations: zoom + slide-in.
- **Sheet**: side panel, `w-3/4 sm:max-w-sm`. **Right side is the default** for inspection / detail views and form sheets. Bottom sheet on mobile.
- **Drawer** (vaul-based): mobile-first bottom sheet. Use for mobile primary flows.
- **Popover / HoverCard / DropdownMenu / Tooltip**: short, transient. Tooltip = info on hover, Popover = clickable content, DropdownMenu = list of actions.
- For destructive confirms, use an **AlertDialog**, not a plain Dialog.

### Tables

- Compact density: `h-9 px-3` headers, `px-3 py-2` cells, `text-sm`.
- Header text: `text-left align-middle font-medium text-muted-foreground` (muted, not bold).
- Row hover: `hover:bg-muted/50`. Selected: `data-[state=selected]:bg-muted`.
- Skeleton state: a `TableSkeleton` helper that maps `columns × rows` of pulsing bars.

### Empty states

Centered, vertical: muted circular icon container (`rounded-full bg-muted p-4`) → `Icon h-8 w-8 text-muted-foreground` → `text-lg font-semibold` title → `text-sm text-muted-foreground` description → optional primary `Button` action. `py-16 text-center`.

### Loading / skeletons

- Use a `skeleton-pulse` utility: `animate-pulse bg-muted rounded`.
- Provide helpers: table skeleton, card skeleton, page-header skeleton.
- For inline placeholders, use a `Skeleton` component sized to the final dimensions (`h-5 w-32`, etc.).

### Toasts

Always go through a thin Sonner wrapper (with sound effects). Expose `toast.success`, `toast.error`, `toast.info`, etc. Don't import `sonner` directly in feature code.

### Forms

- `react-hook-form` + `zod` schemas.
- Field layout: `<Label>` (text-sm font-medium) above input/select/etc., with field-level error message in `text-destructive text-xs`.
- Submit row: `flex justify-end gap-2` — `Cancel` (variant `outline` or `ghost`) on the left, primary action on the right.

### Sidebar nav items

The pattern is reused throughout — copy it when adding nav-style links:

```tsx
className={({ isActive }) =>
  cn(
    "flex items-center rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer",
    collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-2 px-3 py-2",
    isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-bold"
      : "text-sidebar-foreground hover:bg-sidebar-accent/50",
  )
}
```

Icons are `h-5 w-5 shrink-0`. Section headers above groups: `px-3 pt-5 pb-2 text-xs font-medium uppercase tracking-wider text-sidebar-muted`.

---

## 6. Iconography

- **Lucide** is the default set; `stroke-width: 1` globally (much thinner than Lucide's default of 2 — gives the UI a delicate, modern look).
- Icon sizes by context:
  - In buttons: `h-4 w-4` (shadcn enforces `[&_svg]:size-4`)
  - In nav rows / list items: `h-5 w-5 shrink-0`
  - In hero / empty-state badges: `h-6 w-6` or `h-8 w-8`
  - In small inline indicators: `h-3.5 w-3.5` or `h-4 w-4`
- Always pair icons with `shrink-0` when they sit beside flexible text to prevent squashing.

---

## 7. Motion

Transitions are short, eased, and almost always on color / opacity / transform. **Never animate layout-affecting properties (`width`, `height`) on hover.**

Standard durations:
- `transition-colors duration-150` — interactive hover states
- `duration-200` — dialog/sheet open
- `duration-300` (close) / `duration-500` (open) — sheet asymmetric timing
- `transition-transform` — chevrons, ticker rotations

Custom keyframes worth standardising (define once in global CSS, reuse via utility classes):
- `animate-progress-shimmer` — sliding gradient over progress bars
- `animate-progress-heartbeat` — pulsing height + color burst (use for milestones)
- `animate-milestone` — celebratory pop-in
- `animate-typing-dot` — chat typing indicator
- `animate-ticker-slide-up` / `animate-ticker-slide-up-out` — paired cube-rotation carousel for rotating placeholders
- `animate-thinking-shimmer` — text-clip lightning sweep for AI "thinking" states
- `ai-glow` + `autofill-flash` — `info`-tinted halo after AI autofill (`.autofill-highlight`)

When building **AI-related affordances** (chat, autofill, suggestions), reach for `info`-colored glows and shimmer animations — they are the established "AI is doing something" visual vocabulary.

---

## 8. Scrollbar styling

Three reusable scrollbar classes — pick by context:
- `.sidebar-scrollbar` — near-invisible at rest, thumb appears on sidebar hover (6 px, sidebar-muted)
- `.kanban-scrollbar` — 5 px, hidden until hover, muted-foreground (use inside kanban columns)
- `.chat-scrollbar` — 8 px, always faintly visible, modeled on claude.ai's chat
- `.scrollbar-hide` — fully hide native scrollbar (use sparingly)

Add the class to the scrolling container — don't reinvent scrollbar styling per component.

---

## 9. Dark mode

- Toggled by adding/removing `.dark` on the root (via `next-themes`).
- A `ModeToggle` component renders a rounded ghost button with rotating sun/moon icons.
- **Every color must use a token** — no `dark:` overrides in component code; the CSS variables handle it automatically.
- When introducing a new color, add **both** light and dark HSL values to `:root` and `.dark`.

---

## 10. Accessibility & interaction

- All interactive controls must show a focus ring: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
- Icon-only controls: include `<span className="sr-only">` describing the action, or `aria-label`.
- Click targets: minimum `h-9 w-9` (small) / `h-10 w-10` (default) / `h-11 w-11` (touch).
- Disabled state: `disabled:opacity-50 disabled:pointer-events-none`.
- Tooltips appear on `group-hover` in collapsed sidebar; use the same pattern for any rail-style nav.

---

## 11. Datetime handling (UI contract)

If a backend returns timestamps in UTC, **never pass a raw API timestamp into `new Date()`** — pipe through a `parseUTC()` helper first, or use formatter helpers built on top of it:

| Helper                | Output                          |
| --------------------- | ------------------------------- |
| `formatDate(s)`       | `MM/dd/yyyy`                    |
| `formatDateOnly(s)`   | same, but strictly local-Y-M-D  |
| `formatDateTime(s)`   | `MM/dd/yyyy h:mm a`             |
| `formatFriendlyDateTime(s)` | `MM/dd/yyyy, at h:mm am`   |

Skipping UTC parsing causes off-by-N-hours bugs.

---

## 12. Voice & content tone

- **Friendly, professional, slightly warm.** Examples:
  - "Welcome back, {firstName}!"
  - "Here's your fleet at a glance."
  - "Wheels up. Here's the rundown."
- **Use sentence case** for buttons and labels ("Add driver", not "Add Driver"). Exceptions: proper nouns and brand/feature names.
- **Empty states** use a short, hopeful one-liner — never just "No data". Pair with a primary action when possible.
- **Errors** in toasts are direct and human ("Invalid credentials. Please try again.") — never expose stack traces or status codes.

---

## 13. Quick reference — when in doubt, do this

| Want to add a…           | Use                                                       |
| ------------------------ | --------------------------------------------------------- |
| Page header              | `<h1 className="text-3xl font-semibold tracking-tight">` + muted `<p>` |
| Stat tile                | `<Card className="rounded-xl shadow-sm">` + icon in `rounded-lg bg-primary/10 p-2.5` |
| Status indicator         | `<StatusBadge variant={…} dot>` (semantic-tint pill)      |
| Primary CTA              | `<Button>` (default variant)                              |
| Secondary / cancel       | `<Button variant="outline">` or `"ghost"`                 |
| Danger action            | `<Button variant="destructive">`                          |
| Side panel form          | `<Sheet side="right">`                                    |
| Confirm dialog           | `<AlertDialog>` (not `<Dialog>`) for destructive confirms |
| Empty state              | `<EmptyState icon={…} title={…} description={…} action={…} />` |
| Loading list             | `<TableSkeleton columns=… />` or `<CardSkeleton />`       |
| Conditional class merge  | `cn("base", isActive && "…")`                             |
| Toast                    | Thin wrapper over Sonner — never import `sonner` directly |

---

## 14. Adding new colors / tokens

1. Add the HSL triplet to **both** `:root` and `.dark` in global CSS.
2. Wire it into the `@theme` block (`--color-foo: hsl(var(--foo))`).
3. Reference it as `bg-foo`, `text-foo`, `border-foo` — never inline `hsl(...)` in components.
4. If it's a status color, also extend `StatusBadge`'s `Variant` union and `variantStyles` map.

---

## 15. Anti-patterns (don't)

- ❌ Hard-coded hex colors (`#3B82F6`, `bg-blue-500`, etc.) — use tokens.
- ❌ `dark:` modifiers in component code — let `:root` / `.dark` handle theming.
- ❌ Editing shadcn primitives by hand — re-run the shadcn CLI instead.
- ❌ Mixing icon libraries within one feature — pick Lucide unless you have a reason.
- ❌ `text-base` for normal UI — use `text-sm`. Reserve `text-base` for marketing / landing copy.
- ❌ Custom shadow values inline (`shadow-[0_4px_8px_…]`) — use the scale.
- ❌ Border radii outside the scale.
- ❌ Animating width / height on hover — use `scale` or skip animation.
- ❌ Calling `new Date(apiTimestamp)` directly when timestamps come back as UTC — always parse first.

---

**TL;DR design vibe:** Clean, dense, modern admin UI. Indigo-violet primary on near-white canvas. Soft shadows, generous radii, thin-stroke Lucide icons, sentence-case copy. Heavy on shadcn primitives composed with Tailwind utility classes. Status communicated through soft-tinted pill badges. AI features get blue (`info`) glows and shimmer animations.
