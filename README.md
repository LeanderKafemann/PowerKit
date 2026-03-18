# PowerKit

**A modern, intuitive Web Styling Kit — inspired by BueroWebKit's professional aesthetics and RosaKi's warm rose palette.**

> Drop in two files. Style anything. Zero dependencies.

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

### Option A – Direct link (simplest)

```html
<!-- In <head> -->
<link rel="stylesheet" href="powerkit.css" />

<!-- Before </body> -->
<script src="powerkit.js"></script>
```

### Option B – CDN *(coming soon)*

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/LeanderKafemann/PowerKit-/powerkit.css" />
<script src="https://cdn.jsdelivr.net/gh/LeanderKafemann/PowerKit-/powerkit.js"></script>
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

### CSS Variable Overrides

Override any design token in your own stylesheet:

```css
:root {
  /* Change primary colour to violet */
  --pk-primary-500: #7c3aed;
  --pk-primary-600: #6d28d9;

  /* Change border radius to sharper corners */
  --pk-radius: 0.25rem;
}
```

---

## 🗂 File Structure

```
PowerKit-/
├── powerkit.css     ← Core stylesheet (design tokens + all components)
├── powerkit.js      ← Interactive components (modals, tabs, toasts…)
├── index.html       ← Live demo & documentation
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
