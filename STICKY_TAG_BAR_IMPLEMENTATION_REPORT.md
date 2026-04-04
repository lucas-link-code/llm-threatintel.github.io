# LLM ThreatIntel - Sticky Tag Bar and Home Feed UX Implementation Report

## Implementation Date
April 4, 2026

## Overview
This report documents the full implementation and follow-up correction cycle for the home feed tag bar and related home-page UX work on `llm-threatintel`.

The work started as a three-part UI improvement request:

1. Keep the home feed tag/category row available while users scroll through long post lists
2. Add a floating back-to-top button that works well on desktop and mobile
3. Slightly increase the visual vividness of the existing dark purple theme without redesigning the site

The implementation then went through several refinements:

- make `--header-h` a real single source of truth
- preserve the selected tag state across home re-renders
- respect `prefers-reduced-motion`
- correct the initial sticky-tag implementation when it did not behave correctly in Chrome/mobile
- remove the visual gap above the stuck tag bar
- change the tag order to a user-specified sequence
- confirm that no canonical tags were removed

The final state preserves the original design language, keeps the home filter row continuously available while scrolling, wraps tags on mobile instead of forcing sideways scroll, adds an accessible back-to-top button, and slightly strengthens the site palette.

---

## Original User Requests

### Primary UI Requests
- Freeze the tag/category selection row at the top while users scroll down the feed
- Add a floating button that returns the user to the top of the page
- Keep the floating button visually appropriate on both desktop and mobile
- Make the site colors slightly more vivid while keeping the same dark-theme identity

### Follow-Up Requirements
- Use `--header-h` as the real header height token, not just as a new variable name
- Restore active tag state from `App.currentFilter` on render
- Call `filterPosts()` after render so the UI does not reset visually
- Respect `prefers-reduced-motion` for scroll-to-top behavior
- Later, correct the fact that the initial sticky-tag implementation was not actually sticking correctly
- Later, remove mobile horizontal chip scrolling and use wrapping instead
- Later, remove the visible gap above the stuck tag bar
- Finally, set tag order to:
  - All
  - Malicious Tool
  - Supply Chain
  - Malware
  - Shadow AI
  - LLMjacking
  - Nation State
  - APT

---

## Files Involved

### Files Changed During the Work
- `index.html`
- `js/app.js`
- `css/style.css`

### Current Local Modified Files
At the time of writing this report, the current working tree still shows local modifications in:

- `js/app.js`
- `css/style.css`

`index.html` already contains the scroll-to-top button markup in the current working tree baseline and is not currently showing as modified.

---

## Implementation Summary by Area

## 1. Home Tag Bar

### Initial Intent
The original implementation direction was:

- render the category row inside a dedicated wrapper
- keep the existing sticky site header
- keep the filter row visible beneath the header as users scroll
- initially avoid multi-line wrapping by making the tag row horizontally scrollable

That first version matched the original plan but did not hold up in live Chrome/mobile behavior on this site.

### Current Final Implementation
The final implementation uses a JS-managed fixed-on-scroll approach instead of relying only on a CSS sticky wrapper.

#### Rendering and State
In `js/app.js`:

- `renderHome()` now renders the filter row inside `.filter-bar-wrap`
- the active tag is restored from `App.currentFilter`
- the feed is filtered immediately after render by calling `this.filterPosts()`
- the tag order is controlled explicitly by `homeTagOrder`
- any non-canonical future tags would still be appended after the known ordered set

#### Current Home Tag Order
The current display order is:

1. All
2. Malicious Tool
3. Supply Chain
4. Malware
5. Shadow AI
6. LLMjacking
7. Nation State
8. APT

#### Canonical Tag Set
No canonical tags were removed.

The current canonical set remains:

- `malicious-tool`
- `supply-chain`
- `malware`
- `shadow-ai`
- `llmjacking`
- `nation-state`
- `apt`

### Why the Implementation Changed
The first CSS-sticky version looked correct in source but failed in actual browser behavior:

- on desktop/Chrome, the row still scrolled away instead of behaving correctly
- on mobile, the row became a long sideways scroller, which was rejected as poor UX

To correct that:

- the filter row was switched from CSS `position: sticky` to a JS-managed `.is-stuck` mode
- while unstuck, the row remains in normal flow
- when the row reaches the header boundary, JS adds `.is-stuck`
- when stuck, the inner `.filter-bar` becomes `position: fixed`
- the wrapper reserves the current bar height with `--filter-bar-height` to prevent layout jumping
- cleanup logic removes listeners when routing away from `#home`

### Mobile Behavior Change
The initial implementation used a single horizontal row with overflow scrolling.

That was later changed to:

- `flex-wrap: wrap`
- no horizontal chip scrolling
- chip labels stay on one line via `white-space: nowrap`
- the row itself wraps onto multiple lines on narrow screens

This was done specifically because the user reported that mobile users should not need to scroll sideways to access categories.

### Gap Bug and Final Correction
After the JS-sticky version was in place, a new issue appeared:

- the bar was sticking, but there was a visible gap above it

This was traced to the fixed bar being positioned as if there were still an extra sticky gap above it.

The final correction was:

- restore the header’s own sticky behavior reliably
- position the stuck tag bar directly under the header at `top: var(--header-h)`
- remove the extra top offset that caused the visible gap

The final live browser measurement after scroll confirmed:

- header `top: 0`
- header `bottom: 65`
- tag bar `top: 64`
- tag bar `position: fixed`
- wrapper class includes `is-stuck`

That confirmed the gap issue was resolved and the bar was sitting flush under the header.

---

## 2. Back-to-Top Button

### What Was Added
A global floating back-to-top button was added to the main shell so it survives route changes.

#### Markup
In `index.html`:

- a button with id `scroll-top-btn` was added after `<main>` and before `<footer>`
- it includes `aria-label`, `aria-hidden`, `title`, and `tabindex`

#### Behavior
In `js/app.js`:

- `initScrollTopButton()` binds one scroll listener
- the button becomes visible after the page scroll exceeds a threshold
- clicking it scrolls back to the top
- visibility is re-synced after route changes

#### Accessibility
The button handler checks:

- `window.matchMedia('(prefers-reduced-motion: reduce)')`

If reduced motion is enabled:

- the button scrolls instantly with `behavior: 'auto'`

If reduced motion is not enabled:

- it scrolls smoothly

#### Styling
In `css/style.css`:

- the button is fixed to the lower-right area
- desktop positioning keeps it near the content column
- mobile positioning uses a smaller button and respects safe-area insets
- visibility is animated with fade/translate

---

## 3. Reduced Motion

### Requested Refinement
After the first pass, a specific accessibility refinement was requested:

- disable sitewide smooth scrolling when `prefers-reduced-motion` is enabled

### What Was Done
In `css/style.css`:

- the reduced-motion media query now includes:
  - `html { scroll-behavior: auto; }`

This means:

- global anchor/hash and programmatic scroll behavior no longer stays smooth for reduced-motion users
- the scroll-to-top button behavior and the CSS default now agree

---

## 4. Header Height Source of Truth

### Requirement
The header height token should be real and used consistently, not just declared.

### What Was Implemented
In `css/style.css`:

- `--header-h: 64px` was added to `:root`
- `.header-inner` height uses `var(--header-h)`
- the mobile nav dropdown top offset uses `var(--header-h)`
- the stuck tag bar uses `var(--header-h)` for its fixed top position

This removed the dependency on repeated hardcoded header-offset literals for active layout logic.

---

## 5. Palette / Theme Lift

### Request
The user liked the existing dark purple aesthetic but wanted slightly stronger separation and more visible gradients.

### What Was Changed
In `css/style.css`:

- root palette tokens were adjusted to slightly stronger values
- the ambient background gradients were strengthened
- hover shadows on stat cards and post cards were increased modestly

### Design Intent
This was explicitly not a redesign.

The theme remains:

- dark
- purple-led
- subtle
- consistent with the original visual identity

---

## Detailed Code Change Log

## `js/app.js`

### Added / Changed
- Added `homeTagOrder`
- Later changed `homeTagOrder` to the user-requested tag sequence
- Added `scrollTopButtonHandler`
- Added `scrollTopButtonBound`
- Added `cleanupHomeFilterBar`
- Added `initScrollTopButton()`
- Added `setupHomeFilterBar()`
- Updated `route()` to:
  - clean up home filter listeners before rendering a new route
  - re-sync scroll-top button state after route scroll reset
- Updated `renderHome()` to:
  - restore active filter from `currentFilter`
  - render the active chip correctly
  - call `filterPosts()` immediately after render
  - initialize home filter stickiness after render

### Net Result
`js/app.js` now controls:

- canonical filter ordering
- active filter persistence
- global back-to-top behavior
- fixed-on-scroll tag-bar state
- cleanup of sticky-bar listeners across route changes

## `css/style.css`

### Added / Changed
- strengthened root design tokens
- added `--header-h`
- added `--sticky-gap`
- added `--content-pad-x`
- changed `overflow-x` from `hidden` to `clip` on `html` and `body`
- updated header and mobile nav to use `var(--header-h)`
- changed filter row from CSS-sticky/horizontal-scroll behavior to:
  - normal-flow wrapped layout while unstuck
  - fixed-position layout while `.is-stuck`
- added wrapper height reservation using `--filter-bar-height`
- updated mobile filter chip spacing
- added reduced-motion override for global smooth scrolling
- added reduced-motion override for the back-to-top button animation
- added scroll-top button styling

### Net Result
`css/style.css` now handles:

- the final stuck/unstuck presentation of the tag bar
- wrapped mobile tags instead of sideways scrolling
- stronger but still subtle palette definition
- reduced-motion compatibility
- global back-to-top button visuals

## `index.html`

### Added
- global back-to-top button markup:
  - `id="scroll-top-btn"`
  - accessible attributes
  - arrow glyph inside the button

### Net Result
The app shell now has a persistent scroll control independent of route rendering.

---

## Verification Performed

### Static Validation
- `node --check js/app.js` passed after JS changes

### Browser Validation
Real browser validation was used during debugging of the sticky tag bar.

The following behavior was verified during the final correction cycle:

- the header is sticky at the top during scroll
- the tag bar enters the stuck state when scrolling past the trigger point
- the tag bar is fixed beneath the header
- the visual gap above the stuck bar is removed

### What Was Verified Indirectly by Code
The following are strongly supported by the code now in place:

- active filter state persists across home re-renders
- canonical tags were not removed
- mobile chips wrap instead of requiring horizontal scrolling
- reduced-motion users do not get sitewide smooth scrolling

---

## Current State

### Home Feed Tag Bar
- rendered on the home feed below the page subtitle
- ordered according to the user-specified sequence
- restores active filter state
- filters the feed immediately after render
- becomes fixed beneath the sticky header while scrolling
- wraps across lines on mobile instead of forcing horizontal scroll

### Back-to-Top Button
- globally present in the shell
- appears after the user scrolls down
- scrolls to top
- respects reduced-motion
- works across routes

### Theme
- same dark purple theme
- slightly more vivid accent/background separation
- no redesign of layout or typography

### Tag Integrity
- canonical tag names remain intact
- no canonical tags removed
- only order was changed

---

## Remaining Notes

### Deployment / Cache
Because this work changed shell JS and CSS, Cloudflare purges were recommended for:

- homepage shell
- `index.html`
- `css/style.css`
- `js/app.js`

### Future Enhancement Options
If desired later, the following could still be refined:

- clamp the number of visible wrapped rows for mobile if the tag set grows
- animate stuck/unstuck transitions more explicitly
- add a subtle shadow/border transition when the bar becomes stuck
- add end-to-end visual regression screenshots for desktop and mobile states

---

## Final Summary
This work started as a simple sticky-filter request but ended up being a full home-feed UX pass across filtering, scrolling, motion preferences, and visual polish.

The final implementation now provides:

- a persistent home feed tag bar
- correct active tag persistence
- wrapped mobile chip behavior
- a global back-to-top button
- reduced-motion-safe scrolling
- a slightly richer version of the site’s existing dark theme
- the exact user-requested tag order
- no removal of canonical tags

This report reflects the current implementation state in the repository at the time it was written.
