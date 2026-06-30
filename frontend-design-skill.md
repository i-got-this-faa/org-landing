---
name: frontend-design-taste
version: 1.0.0
description: Use this skill when designing, reviewing, or implementing frontend interfaces.
---

# Frontend Design Taste Skill

## Purpose

Use this skill to design frontend interfaces that feel like real tools, not decorated templates. The desired result should be technical, direct, personal, slightly raw, and shaped by the job the product performs.
The interface itself should become the identity. The visual language must grow from the product noun.

## Core Principle

Design from the object inward.

Before choosing colors, layout, or components, identify the product noun.

Then choose one visual metaphor that belongs to that noun. The interface should visually answer:

1. What is this thing?
2. What is the first action?
3. What proof makes it trustworthy?
4. What details matter immediately?
5. What details can wait?
6. What should this tool feel like in the hands of a technical user?

**identity → action → proof → detail**

## Visual Direction

Before choosing anything visual, identify the world the product belongs to. Research what things in that domain look likes. Commit to a direction that grows from the product noun. These archetypes are starting points to orient thinking, not templates to copy. If none fits, derive one that does.

### Dark / Dense

Native app feel, terminal-adjacent, high-density HUD. Surfaces layer over a receding background. High information density, structured panels, text readable at small sizes without being harsh.

### Multi-Pane App Shell

OS-like or dashboard-like. Independent panes, minimal border-radius, window chrome, tiny labels. Muted and calm at rest, responsive on interaction.

### Raw / Industrial

Mechanical, fast, uncompromising. Heavy typography, hard contrast. Feels closer to hardware documentation or print than to typical software.

### Paper / Document Tool

Warm, readable, document-like. Feels like a notebook or engineering sheet. Calm surfaces, ink-like text.

### Technical Editorial

Readable, searchable, scannable, copyable. Content is the interface. No decorative sections, no ego blocks, no unrelated sidebars.

### Compact Personal / Profile

Evidence first: name, status, selected work, links. No long biography unless that is explicitly the goal.

### Focused Single-Purpose Utility

One strong input or action upfront. Everything else revealed progressively after the user commits to the first action.

## Color Rules

Derive the palette from the product noun. Research what authentic tools, hardware, software, or editorial in this domain look like, not what generic SaaS products default to. Search the web if needed.

Build a controlled neutral world with one or two strong accents. Neutrals carry most of the interface; accents become meaningful precisely because they are rare.

Each accent must have a specific job: active state, primary action, error, brand signal. Never spread it everywhere and reserve it for selected states, focus rings, primary calls to action, progress, or one important proof point.

Avoid: generic blue-purple gradients, pure `#000` and `#fff`, "professional" teal, oversaturated palettes, and colors borrowed from unrelated industries.

## Typography Rules

### Monospace as UI Language

Use monospace for:

- commands
- paths
- labels
- metadata
- stats
- IDs
- code
- keyboard shortcuts
- technical details
- compact tables

Research a monospace font that fits the product's domain. Look at what adjacent terminals, editors, or technical tools in this space use. Search the web if needed. Avoid the most overused defaults.

### Display Type

Use one stronger identity font for big moments. Research fonts used in adjacent spaces. Mechanical products, editorial tools, infrastructure software, and hardware each have their own typographic traditions. Avoid generic geometric sans-serifs used by every SaaS product.

Use tight tracking and compressed line-height only when the page should feel poster-like or brutal.

### Micro Labels

Micro-labels should get out of the way so numbers, actions, and statuses speak.

## Layout Rules

The layout should show relationships, not just stack sections.

Use:

- constrained main width for intentionality
- stable shell for apps
- panels when different information types sit together
- left-to-right relationship when creation and management are paired
- single vertical stack for funnel-like utilities
- reading column + table of contents for long-form content
- desktop/window metaphor only when meaningful

### First Screen Rules

The first screen should be brutally clear. It should not explain everything.

Good openings:

- strong identity statement + one primary action
- focused input that starts the workflow
- command/install path that proves immediate usability
- dashboard shell with obvious work area
- document/tutorial list with search as the main affordance
- profile summary with strongest facts first

Avoid:

- broad hero fluff
- generic feature grid above the actual tool
- vague claims before proof
- pretending to serve everyone

### Density Rhythm

Use density intentionally:

- spacious for identity and decisions
- dense for scanning and management
- breathable for docs and reading
- compact for modals after the user asks for detail
- simplified for mobile

## Component Rules

### Buttons

The primary action should be the only high-accent or filled button in its area. Secondary actions should be outline, muted, or text-like.

### Cards and Panels

A card must have a job.

### Lists and Tables

Keep rows compact. Show statuses, dates, sizes, paths, or counts when useful. Do not replace obvious lists with decorative charts.

### Modals and Overlays

Use modals for focused temporary decisions
Include escape-to-close and click-outside-to-close when possible.

### Hover and Progressive Disclosure

Use muted resting states and reveal detail on hover/focus when it rewards exploration without hiding core actions.

Do not hide primary actions behind hover only.

## Interaction Rules

There should be ONLY ONE clear way to perform an action.

Interactions should be useful first, delightful second.

Good interaction patterns:

- copy buttons for commands, links, paths, IDs
- fast search focus
- filters that update visible content without ceremony
- hover previews where always-visible previews would be too heavy
- expand/collapse for advanced details
- modals for focused actions
- context menus for desktop-like tools
- keyboard shortcuts for power-user interfaces
- progress bars and status text for long-running actions
- useful empty/loading/error/success states

Micro-interactions should confirm the system understood: copied, selected, loading, complete, failed, active, open, closed.

Avoid playful interactions that do not help the task.

## Motion Rules

Motion must be state-driven or atmosphere-driven.

### Functional Motion

Use inside apps:

- hover transitions
- progress fill
- skeleton shimmer
- modal fade/scale
- loading indicators
- active status pulse
- small row/list transitions

Keep it fast and predictable.

### Theatrical Motion

Use mostly on landing pages or first-impression moments:

- parallax
- scroll-based product reveal
- animated background
- glowing CTA
- media reveal
- large typography movement
- 3D perspective flattening

Tie motion to the product atmosphere. A storage product can move like machinery. A desktop portfolio can move like workspaces. A hardware tool can feel like a terminal connection.

## Imagery and Media Rules

Use media as proof, not wallpaper.

Prefer:

- screenshots of the actual product
- terminal captures
- real hardware photos
- file previews
- release assets
- diagrams only when they explain structure
- media thumbnails only when relevant

Avoid:

- generic stock photography
- fake 3D people
- abstract SaaS illustrations
- screenshots everywhere just to fill space

When mixed media appears, unify it with dark frames, muted opacity, grayscale treatment, consistent borders, or controlled containers.

ASCII art and inline SVGs can be used as primary visuals when they fit the code-native identity.

## Content Hierarchy Rules

Show concrete things early.

Good early proof:

- exact command
- source link
- file list
- release asset
- metric
- status
- compatibility note
- real screenshot
- code/config sample
- realistic empty state

Avoid early:

- generic feature grids
- long founder/team prose
- abstract productivity promises
- testimonials unless central
- full onboarding explanations for technical audiences
- decorative sections that do not change what the user knows or can do

## What to Display

Display items that perform one of five jobs:

1. **Orientation:** title, path, nav, selected state, current page, status.
2. **Action:** upload, download, deploy, publish, copy, connect, refresh, open, delete.
3. **Proof:** screenshot, metric, real file name, release asset, source link, compatibility fact.
4. **Control:** settings, filters, format selectors, quality selectors, view toggles.
5. **Feedback:** progress, loading, success, error, active badge, disabled reason.

If an item does none of these jobs, remove it or make it quieter.

## What to Hide

Hide secondary detail when it damages default focus.

Good hidden/detail-later content:

- advanced settings before basic flow works
- full metadata before item selection
- media galleries before user asks for media
- upgrade details before a limit or intent appears
- long docs before the user chooses to read
- destructive actions before proper context
- troubleshooting config before failure

Hiding secondary detail is not anti-power-user; it preserves the main path.

## State Design

Design empty, loading, error, success, disabled, and completed states as part of the product.

### Empty

Tell the user what to do next. Show a command, input, upload area, demo data option, or example object.

### Loading

Show progress when possible. If exact progress is unknown, show stable skeletons or state text.

### Error

Use plain language. Explain what failed and provide a retry or next action.

### Success

Confirm completion and expose the next useful action.

### Disabled

Explain why an action is unavailable when the reason is not obvious.

## Mobile Rules (** only if the user asks for it **)

Mobile should preserve purpose, not exact shape.

- turn complex desktop shells into stacked flows
- replace sidebars with drawers or sections
- keep primary actions reachable
- reduce density when readability suffers
- allow horizontal scroll for truly tabular data
- do not force clever desktop/window metaphors onto small screens

A heavily desktop-oriented UI can have a separate mobile experience.

## Design Process

When asked to design a frontend:

1. Identify the product noun and target user.
2. Choose a visual direction (or derive one) that belongs to this product's domain.
3. Define the first screen: identity, action, proof.
4. Choose surface language depending on the product type.
5. Research and derive colors: look at authentic tools, hardware, or editorial in this product's domain. Set neutral world, identity accent, and signal accent so each has a specific job.
6. Research and derive typography: find fonts that belong to this product's space. Set display, body, and mono label roles.
7. Design the main shell and spatial model.
8. Decide what appears immediately and what is hidden behind interaction.
9. Include state design: empty, loading, error, success, disabled.
10. Remove anything that exists only because other websites usually have it.
11. When producing code, make sure the implementation visibly reflects the chosen mode and do not use generic component-library defaults.

## Design Smells to Avoid

A design is drifting away from this taste if:

- it looks like a generic SaaS landing page
- the first screen has many claims but no action
- accent color is used everywhere
- decorative gradients do not relate to the product
- typography is trendy but unrelated to the object
- real technical primitives are hidden behind vague marketing words
- navigation exists for things that do not exist yet
- charts replace simple honest lists
- media appears only because the page feels empty
- large rounded cards are used everywhere without reason
- the product pretends to be enterprise-scale when it is focused and small
- empty/loading/error states are afterthoughts
- default component-library styling is still visible

## Final Taste Statement

Build interfaces that feel like tools with a world around them.

The best result is specific, technical, useful, and personal. It does not chase broad appeal. It does not hide the machine completely. It does not decorate for decoration's sake. It uses concrete data, strong surfaces, controlled color, practical motion, and focused hierarchy to make small products feel real.

The page should look like it knows what it is.
