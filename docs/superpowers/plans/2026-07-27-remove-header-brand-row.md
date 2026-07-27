# Remove Header Brand Row Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the complete `VIDEO SHOTCRAFT / LOCAL INDEX / CN` row from the shot-library header without changing the rest of the page.

**Architecture:** Keep the existing hero component and layout. Delete the single brand-row subtree from `ShotLibrary`, remove CSS selectors used only by that subtree, and protect the result with the existing server-rendered HTML test.

**Tech Stack:** React 19, TypeScript, CSS, Node.js test runner, vinext

---

### Task 1: Protect the rendered header behavior

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Test: `tests/rendered-html.test.mjs`

- [ ] **Step 1: Write the failing test**

Replace the positive brand assertion in `server-renders the local shot library product shell` with:

```js
assert.doesNotMatch(html, /VIDEO SHOTCRAFT|LOCAL INDEX \/ CN/);
assert.match(html, /快速找到下一镜/);
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```bash
node --test tests/rendered-html.test.mjs
```

Expected: FAIL because the current server-rendered page still contains `VIDEO SHOTCRAFT`.

- [ ] **Step 3: Commit the failing test**

```bash
git add tests/rendered-html.test.mjs
git commit -m "test: require brand-free shot library header"
```

### Task 2: Remove the brand row and its styles

**Files:**
- Modify: `app/shot-library.tsx`
- Modify: `app/globals.css`
- Test: `tests/rendered-html.test.mjs`

- [ ] **Step 1: Delete the brand-row subtree**

Remove this block from the start of `<header className="hero">`:

```tsx
<div className="brand-row">
  <a
    className="brand"
    href="https://github.com/Vincentwei1021/video-shotcraft"
    target="_blank"
    rel="noreferrer"
  >
    <span className="brand-mark" aria-hidden="true">
      <span />
      <span />
    </span>
    VIDEO SHOTCRAFT
  </a>
  <span className="local-badge">LOCAL INDEX / CN</span>
</div>
```

- [ ] **Step 2: Delete CSS used only by the removed subtree**

Remove the base rules for:

```css
.brand-row
.brand
.brand-mark
.brand-mark::before
.brand-mark::after
.brand-mark span
.brand-mark span:first-child
.brand-mark span:last-child
.local-badge
```

Also remove the two compact-presentation override blocks:

```css
.brand-row {
  min-height: 40px;
}

.brand-mark::before,
.brand-mark::after,
.brand-mark span {
  background: var(--accent);
}
```

Do not change `.hero-copy`, the hero text, counts, search controls, filters, cards, or dialog.

- [ ] **Step 3: Run the focused test to verify it passes**

Run:

```bash
npm run build
node --test tests/rendered-html.test.mjs
```

Expected: the build completes, then the focused test passes with no rendered `VIDEO SHOTCRAFT` or `LOCAL INDEX / CN`.

- [ ] **Step 4: Run the complete validation**

Run:

```bash
npm test
npm run typecheck
```

Expected: all tests pass, the production build completes, and TypeScript reports no errors. Existing third-party CSS ordering and chunk-size warnings may remain unchanged.

- [ ] **Step 5: Commit the implementation**

```bash
git add app/shot-library.tsx app/globals.css
git commit -m "feat: remove shot library header branding"
```

### Task 3: Save a deployable Sites version

**Files:**
- Read: `.openai/hosting.json`
- Build output: `dist/`

- [ ] **Step 1: Build from the exact validated source**

Reuse the successful `npm test` build when the source has not changed.

- [ ] **Step 2: Push the exact source state**

Push a Sites-source commit based on the current production source, containing only:

```text
app/shot-library.tsx
app/globals.css
tests/rendered-html.test.mjs
```

- [ ] **Step 3: Package and save version 3**

Package the validated `dist/` with the Sites packaging helper and save it against the pushed commit SHA. Saving must not replace the public production site.

- [ ] **Step 4: Request public-deployment confirmation**

Tell the user version 3 is saved and ask for explicit confirmation before publishing it to the existing public site.
