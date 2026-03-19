# PowerKit

**A modern, intuitive Web Styling Kit — inspired by BueroWebKit's professional aesthetics and RosaKi's warm rose palette.**

> Drop in two files. Style anything. Zero dependencies.

🌐 **Live demo & docs:** [leanderkafemann.github.io/PowerKit](https://leanderkafemann.github.io/PowerKit)

---

## ✨ Features

- 🎨 **Rose colour palette** — warm, beautiful CSS custom properties for every tone
- 📐 **Layout utilities** — flex, auto-grid, stack, cluster, container
- 🔤 **Typography** — display headings, eyebrows, lead text, code, blockquotes
- ⚡ **Buttons** — 10 variants (solid, outline, ghost, soft, gradient, link) × 5 sizes × multiple shapes
- 📋 **Forms** — inputs, selects, textareas, checkboxes, radios, toggles, range sliders, file uploads
- 🃏 **Cards** — flat, raised, hover, glass, dark, rose
- 🏷️ **Badges & Tags** — soft, solid, outlined, dot indicators, dismissible tags
- 🔔 **Alerts** — 5 semantic variants with dismiss animation
- 🪟 **Modals & Drawer** — focus trap, keyboard dismiss, scroll lock
- 📂 **Dropdowns** — click-activated, keyboard-navigable, Esc to close
- 📑 **Tabs** — underline & pill/segmented styles with arrow-key navigation
- 📦 **Accordion** — single or multiple open panels
- 📊 **Tables** — responsive, striped, hover
- ⏳ **Progress & Loaders** — progress bars, spinners, dots, skeleton screens
- 👤 **Avatars** — sizes, status indicators, avatar groups
- 💬 **Toasts** — JS API with auto-dismiss, types, and persistent option
- 🌙 **Dark mode** — auto via `prefers-color-scheme` + manual `.pk-dark` / JS API
- ♿ **Accessible** — ARIA attributes, focus management, keyboard navigation

---

## 🚀 Quick Start

### Option A – GitHub Pages (recommended, always up-to-date)

The easiest way to embed PowerKit without downloading anything is to load the files directly from the hosted GitHub Pages URL:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My App</title>

  <!-- 1. PowerKit core styles -->
  <link rel="stylesheet" href="https://leanderkafemann.github.io/PowerKit/powerkit.css" />

  <!-- 2. Optional: choose one colour theme (see Themes section below) -->
  <!-- <link rel="stylesheet" href="https://leanderkafemann.github.io/PowerKit/powerkit-blue.css" /> -->
  <!-- <link rel="stylesheet" href="https://leanderkafemann.github.io/PowerKit/powerkit-pro.css" /> -->
</head>
<body>

  <button class="pk-btn pk-btn-primary">Hello PowerKit 👋</button>

  <!-- 3. PowerKit interactive components -->
  <script src="https://leanderkafemann.github.io/PowerKit/powerkit.js"></script>
</body>
</html>
```

> **Tip:** The GitHub Pages URL always reflects the latest `main` branch.  
> For a version-locked copy, download the files directly from the [releases page](https://github.com/LeanderKafemann/PowerKit/releases).

### Option B – Self-hosted (download & host yourself)

Download `powerkit.css`, the desired theme file (optional), and `powerkit.js` from the repository, then reference them locally:

```html
<link rel="stylesheet" href="powerkit.css" />
<!-- optional theme -->
<link rel="stylesheet" href="powerkit-blue.css" />

<script src="powerkit.js"></script>
```

---

## 🎨 Colour Themes

PowerKit ships with three ready-made colour themes. All themes are **drop-in CSS overrides** — just add one `<link>` tag after `powerkit.css` and everything updates automatically. No build step required.

| File | Colour | Best for |
|---|---|---|
| *(default)* | 🌹 Rose + Gold | Warm, creative, consumer products |
| `powerkit-blue.css` | 🔵 Blue + Cyan | Apps, dashboards, SaaS, tech |
| `powerkit-pro.css` | 🖤 Charcoal + Glass | Corporate, professional, B2B |

### Rose (default — no extra file needed)

```html
<link rel="stylesheet" href="https://leanderkafemann.github.io/PowerKit/powerkit.css" />
```

### Blue

```html
<link rel="stylesheet" href="https://leanderkafemann.github.io/PowerKit/powerkit.css" />
<link rel="stylesheet" href="https://leanderkafemann.github.io/PowerKit/powerkit-blue.css" />
```

### Professional (Black · White · Glass)

```html
<link rel="stylesheet" href="https://leanderkafemann.github.io/PowerKit/powerkit.css" />
<link rel="stylesheet" href="https://leanderkafemann.github.io/PowerKit/powerkit-pro.css" />
```

The Professional theme also provides an extra utility class `.pk-glass` for applying a frosted-glass effect to any element:

```html
<div class="pk-glass" style="padding: 2rem; border-radius: 1rem;">
  Glassmorphism card
</div>
```

### Custom colours

You can also override any design token directly in your own CSS without using a theme file:

```css
:root {
  --pk-primary-500: #7c3aed; /* violet */
  --pk-primary-600: #6d28d9;
  --pk-primary-700: #5b21b6;
  --pk-bg-subtle:   #f5f3ff;
  --pk-shadow-rose: 0 4px 14px 0 rgba(124, 58, 237, 0.35);
}
```

---

## 📖 Usage

### Buttons

```html
<button class="pk-btn pk-btn-primary">Primary</button>
<button class="pk-btn pk-btn-gradient pk-btn-pill">Gradient Pill</button>
<button class="pk-btn pk-btn-outline pk-btn-lg">Large Outline</button>
```

### Cards

```html
<div class="pk-card">
  <div class="pk-card-body">
    <h3>Card Title</h3>
    <p>Card content goes here.</p>
  </div>
</div>

<!-- Hover effect -->
<div class="pk-card pk-card-hover">…</div>

<!-- Glass effect -->
<div class="pk-card pk-card-glass">…</div>
```

### Modal

```html
<!-- Trigger -->
<button data-modal-open="#my-modal">Open</button>

<!-- Modal HTML -->
<div class="pk-overlay pk-hidden" id="my-modal" data-modal role="dialog" aria-modal="true">
  <div class="pk-modal">
    <div class="pk-modal-header">
      <h2 class="pk-modal-title">Title</h2>
      <button class="pk-modal-close" data-modal-close>✕</button>
    </div>
    <div class="pk-modal-body">Content…</div>
    <div class="pk-modal-footer">
      <button class="pk-btn pk-btn-outline-gray" data-modal-close>Cancel</button>
      <button class="pk-btn pk-btn-primary" data-modal-close>Confirm</button>
    </div>
  </div>
</div>
```

### Toast

```js
// Show a toast
PowerKit.toast.show({ message: 'Saved!', type: 'success' });

// Options
PowerKit.toast.show({
  message:  'Low disk space',
  type:     'warning',   // 'success' | 'error' | 'warning' | 'info'
  duration: 5000,        // ms before auto-close (0 = persistent)
});
```

### Dark Mode

```html
<!-- Toggle button -->
<button data-theme-toggle>Toggle Dark Mode</button>
```

```js
// Programmatic control
PowerKit.theme.apply('dark');   // force dark
PowerKit.theme.apply('light');  // force light
PowerKit.theme.toggle();        // flip current
PowerKit.theme.getCurrent();    // → 'dark' | 'light'
```

---

## 🗂 File Structure

```
PowerKit/
├── powerkit.css         ← Core stylesheet (design tokens + all components)
├── powerkit-blue.css    ← Blue colour theme override
├── powerkit-pro.css     ← Professional (charcoal/glass) theme override
├── powerkit.js          ← Interactive components (modals, tabs, toasts…)
├── index.html           ← Live demo & documentation
└── README.md
```

---

## 📐 CSS Custom Properties (excerpt)

| Token | Default | Purpose |
|---|---|---|
| `--pk-primary-500` | `#f43f5e` | Main brand colour |
| `--pk-radius` | `0.5rem` | Default border radius |
| `--pk-font-sans` | `'Inter', system-ui` | Body font stack |
| `--pk-space-4` | `1rem` | Base spacing unit |
| `--pk-shadow-md` | … | Medium drop shadow |
| `--pk-duration` | `200ms` | Default transition time |

A full list is available at the top of `powerkit.css` under **CSS Custom Properties**.

---

## 📜 License

[MIT](LICENSE) © 2026 [LeanderKafemann](https://github.com/LeanderKafemann)
