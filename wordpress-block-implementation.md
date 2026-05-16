# WordPress Block Implementation Guide
## FMNR Design System → fmnrhub.com.au

Practical developer guide for applying the blocks in `components.html` to the existing WordPress site. Written against the **confirmed installed plugin stack** — no additional paid plugins assumed.

> **Note on site inspection:** fmnrhub.com.au is currently returning 403 on all public paths (staging lock or Cloudflare rule). The developer should run `View Page Source` and check the browser Network tab on the live/staging admin to confirm the active theme name, existing `theme.json` contents, and any wp-content paths before starting. Steps that require this are marked **[inspect first]**.

---

## 1. Plugin Stack Reference

| Plugin | Status | Role |
|--------|--------|------|
| **Gutenberg** (core) | Active | Block editor |
| **Templately** 3.5.2 | Active | Pattern / page template cloud storage and sharing |
| **Essential Blocks** 6.0.6 | Active | ~70 ready-made blocks — Counter, Info Box, Feature Card, Post Grid, etc. |
| **GenerateBlocks** 2.2.1 | Active | Layout primitives — Container, Grid, Text, Button, Image |
| **Stackable** 3.19.7 | Active | Carousel, Accordion, Count Up, Columns, Icon Box, Image Box |
| **WPForms Lite** 1.10.0.2 | Active | Contact form (basic fields only — no conditional logic or file uploads) |
| **Safe SVG** 2.4.0 | Active | Allows SVG uploads to Media Library and sanitises them |
| **FileBird Lite** 6.4.9 | Active | Media folder organisation |
| **All in One SEO** 4.9.5.1 | Active | SEO meta for all templates |
| **MonsterInsights** 10.1.3 | Active | Google Analytics |
| **Post SMTP** 3.9.1 | Active | Transactional email delivery |
| **OptinMonster** 2.16.22 | Active | Newsletter sign-up forms and pop-ups |
| **Genesis Blocks** 3.1.8 | Inactive | Skip — covered by Essential Blocks + Stackable |
| **Twentig** 2.0 | Inactive | Activate only if additional core block style overrides are needed |
| **Document Library Lite** | Inactive | Activate for Resources page file download listings if needed |
| **FMNR Resource Library (×3)** | Inactive | Legacy custom plugins — do not activate |

### Two free plugins to add

```
WPCode Lite        — wordpress.org/plugins/insert-headers-and-footers
Icon Block         — wordpress.org/plugins/icon-block
```

- **WPCode Lite** — inject FMNR CSS/JS globally without editing theme files. Safer than `functions.php` edits for non-theme-developers.
- **Icon Block** (Nick Diego) — native SVG icon picker in the editor. Works with SVGs uploaded via Safe SVG.

---

## 2. Pre-Flight Checklist

Complete these steps before touching any blocks or templates.

### 2.1 Identify the active theme **[inspect first]**

1. In Chrome/Firefox, visit fmnrhub.com.au and open **View Page Source**.
2. Search for `wp-content/themes/` — the folder name immediately after is the active theme slug.
3. Check whether it is a **block theme (FSE)** or a **classic theme**:
   - Block theme: the theme folder contains `theme.json` at the root and templates in a `/templates/` directory.
   - Classic theme: uses `header.php`, `footer.php`, `functions.php` — no `/templates/` directory.
4. Record the theme slug — you need it to create the correct child theme.

### 2.2 Create a child theme

Never modify the parent theme directly — updates will wipe changes.

```
/wp-content/themes/fmnr-child/
  style.css
  functions.php
  theme.json          ← only for block themes
  screenshot.png      ← optional
  assets/
    css/
    js/
    icons/
    images/
```

**style.css** minimum:

```css
/*
Theme Name:  FMNR Child
Template:    <parent-theme-slug>   ← replace with actual slug
Version:     1.0.0
*/
```

**functions.php** minimum:

```php
<?php
// Enqueue parent theme styles
add_action( 'wp_enqueue_scripts', function() {
    wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );
} );
```

Activate the child theme via **Appearance → Themes** before proceeding.

### 2.3 Audit existing styles **[inspect first]**

1. In the browser Network tab, identify all CSS files loaded on the front end.
2. Check whether the parent theme sets global `font-family`, `color`, or `h1`–`h6` styles that would conflict with FMNR tokens.
3. Note any existing `--wp--preset--*` custom properties already defined — do not duplicate them in `theme.json`.
4. Note the WordPress version (visible in the `<meta name="generator">` tag) — `theme.json` `"version": 3` requires WordPress 6.6+. Use `"version": 2` for WP 6.0–6.5.

### 2.4 Fix Adobe Fonts before anything else

FatFrank will silently fail if the domain is not whitelisted:

1. Log in at [fonts.adobe.com](https://fonts.adobe.com)
2. Open kit **`ajf0nww`**
3. Under **Allowed Domains**, add:
   - `fmnrhub.com.au`
   - `www.fmnrhub.com.au`
   - `staging.fmnrhub.com.au` (or whatever the staging URL is)
4. Save and publish the kit.

---

## 3. Asset Deployment

### 3.1 Copy files from this repo

```bash
# From the repo root, copy to the child theme
cp design-tokens.css  /path/to/wp-content/themes/fmnr-child/assets/css/
cp styles.css         /path/to/wp-content/themes/fmnr-child/assets/css/
cp style.css          /path/to/wp-content/themes/fmnr-child/assets/css/fmnr-style.css
cp decision-tree.css  /path/to/wp-content/themes/fmnr-child/assets/css/
cp -r icons/          /path/to/wp-content/themes/fmnr-child/assets/icons/
cp -r images/         /path/to/wp-content/themes/fmnr-child/assets/images/
```

### 3.2 Extract JavaScript from demo files

Each demo HTML file contains its JS in a `<script>` tag at the bottom. Extract each to a standalone `.js` file.

| Target file | Source HTML file | What to extract |
|-------------|-----------------|----------------|
| `assets/js/scroll-animations.js` | `scroll-animations-demo.html` | The full `<script>` block — IntersectionObserver logic for all animation types |
| `assets/js/timeline.js` | `timeline-demo.html` | Toggle/expand accordion logic |
| `assets/js/carousel.js` | `stories-carousel-demo.html` | Scroll + prev/next controls |
| `assets/js/map.js` | `map-demo.html` | Leaflet initialisation + country data |
| `assets/js/mega-menu.js` | `mega-menu-demo.html` | Open/close + keyboard navigation |
| `assets/js/search.js` | `search-demo.html` | Overlay open/close + predictive results |
| `assets/js/video-hero.js` | `video-hero-demo.html` | Play/pause, mute toggle, progress bar, scroll hint |

Copy existing standalone JS files directly:

```bash
cp decision-trees-part-1-main.js    /path/to/wp-content/themes/fmnr-child/assets/js/
cp decision-trees-part-1-helpers.js /path/to/wp-content/themes/fmnr-child/assets/js/
cp decision-trees-part-1-rAF-polyfill.js /path/to/wp-content/themes/fmnr-child/assets/js/
```

### 3.3 Guard animations against the block editor

Add this at the top of `scroll-animations.js` to prevent animations firing in the WP admin editor:

```js
if ( document.body.classList.contains('wp-admin') ) { /* stop */ }
// Or more reliably:
if ( window.wp && window.wp.blocks ) { /* stop */ }
```

Replace any bare `DOMContentLoaded` init calls with:

```js
document.addEventListener('DOMContentLoaded', function() {
    if ( document.body.classList.contains('block-editor-page') ) return;
    // ... rest of init
});
```

### 3.4 Enqueue everything in functions.php

```php
<?php
add_action( 'wp_enqueue_scripts', 'fmnr_enqueue_assets' );
function fmnr_enqueue_assets() {
    // Parent theme
    wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );

    // FMNR design system
    wp_enqueue_style( 'fmnr-tokens',  get_stylesheet_directory_uri() . '/assets/css/design-tokens.css', [], '1.0' );
    wp_enqueue_style( 'fmnr-styles',  get_stylesheet_directory_uri() . '/assets/css/styles.css', ['fmnr-tokens'], '1.0' );

    // Core JS (load on every page)
    wp_enqueue_script( 'fmnr-animations', get_stylesheet_directory_uri() . '/assets/js/scroll-animations.js', [], '1.0', true );
    wp_enqueue_script( 'fmnr-mega-menu',  get_stylesheet_directory_uri() . '/assets/js/mega-menu.js',         [], '1.0', true );
    wp_enqueue_script( 'fmnr-search',     get_stylesheet_directory_uri() . '/assets/js/search.js',            [], '1.0', true );
    wp_enqueue_script( 'fmnr-video-hero', get_stylesheet_directory_uri() . '/assets/js/video-hero.js',        [], '1.0', true );

    // Conditional: timeline — only on pages that use it
    if ( is_singular() && has_blocks() ) {
        $content = get_post()->post_content;
        if ( strpos( $content, 'fmnr-timeline' ) !== false ) {
            wp_enqueue_script( 'fmnr-timeline', get_stylesheet_directory_uri() . '/assets/js/timeline.js', [], '1.0', true );
        }
        if ( strpos( $content, 'fmnr-carousel' ) !== false ) {
            wp_enqueue_script( 'fmnr-carousel', get_stylesheet_directory_uri() . '/assets/js/carousel.js', [], '1.0', true );
        }
        // Leaflet for map section
        if ( strpos( $content, 'fmnr-map' ) !== false ) {
            wp_enqueue_style(  'leaflet', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', [], '1.9.4' );
            wp_enqueue_script( 'leaflet', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',  [], '1.9.4', true );
            wp_enqueue_script( 'fmnr-map', get_stylesheet_directory_uri() . '/assets/js/map.js', ['leaflet'], '1.0', true );
        }
    }
}

// Adobe Typekit — FatFrank — inject before any other styles
add_action( 'wp_head', function() {
    echo '<link rel="stylesheet" href="https://use.typekit.net/ajf0nww.css">' . "\n";
}, 1 );

// Editor stylesheet — so blocks look right in the WP editor too
add_action( 'after_setup_theme', function() {
    add_editor_style( 'assets/css/design-tokens.css' );
    add_editor_style( 'assets/css/styles.css' );
} );
```

---

## 4. theme.json

Only add this file if the active theme is a **block theme (FSE)**. For a classic theme, skip this section — tokens are applied purely via `design-tokens.css`.

Create `/wp-content/themes/fmnr-child/theme.json`:

```json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 3,
  "settings": {
    "useRootPaddingAwareAlignments": true,
    "color": {
      "defaultPalette": false,
      "palette": [
        { "slug": "green",    "color": "#077D57", "name": "Green" },
        { "slug": "orange",   "color": "#FA6B01", "name": "Orange" },
        { "slug": "teal",     "color": "#0FFBAB", "name": "Teal" },
        { "slug": "lime",     "color": "#B8FA1A", "name": "Lime" },
        { "slug": "olive",    "color": "#5C7D0D", "name": "Olive" },
        { "slug": "cedar",    "color": "#7D3600", "name": "Cedar" },
        { "slug": "amber",    "color": "#F2AA00", "name": "Amber" },
        { "slug": "sand",     "color": "#E0CAA0", "name": "Sand" },
        { "slug": "cream",    "color": "#EFE9DC", "name": "Cream" },
        { "slug": "pear",     "color": "#DDEB4A", "name": "Pear" },
        { "slug": "black",    "color": "#000000", "name": "Black" },
        { "slug": "charcoal", "color": "#464646", "name": "Charcoal" }
      ]
    },
    "typography": {
      "fontFamilies": [
        { "slug": "heading", "fontFamily": "fatfrank, sans-serif",                               "name": "FatFrank (Heading)" },
        { "slug": "body",    "fontFamily": "Lato, Helvetica Neue, Helvetica, Arial, sans-serif", "name": "Lato (Body)" }
      ],
      "fontSizes": [
        { "slug": "xs",      "size": "12px", "name": "XS" },
        { "slug": "sm",      "size": "14px", "name": "SM" },
        { "slug": "base",    "size": "16px", "name": "Base" },
        { "slug": "lg",      "size": "20px", "name": "LG" },
        { "slug": "xl",      "size": "24px", "name": "XL" },
        { "slug": "h6",      "size": "22px", "name": "H6" },
        { "slug": "h5",      "size": "28px", "name": "H5" },
        { "slug": "h4",      "size": "36px", "name": "H4" },
        { "slug": "h3",      "size": "48px", "name": "H3" },
        { "slug": "h2",      "size": "56px", "name": "H2" },
        { "slug": "h1",      "size": "72px", "name": "H1" },
        { "slug": "display", "size": "96px", "name": "Display" }
      ]
    },
    "spacing": {
      "spacingSizes": [
        { "slug": "sm", "size": "8px",  "name": "Small" },
        { "slug": "md", "size": "16px", "name": "Medium" },
        { "slug": "lg", "size": "32px", "name": "Large" },
        { "slug": "xl", "size": "64px", "name": "XL" }
      ]
    }
  },
  "styles": {
    "typography": {
      "fontFamily": "var(--wp--preset--font-family--body)",
      "fontSize":   "var(--wp--preset--font-size--base)"
    }
  }
}
```

---

## 5. Block Style Registration

Add to `functions.php` to expose FMNR button, divider, and tag variants in the block editor sidebar:

```php
add_action( 'init', 'fmnr_register_block_styles' );
function fmnr_register_block_styles() {
    // Buttons
    register_block_style( 'core/button', [ 'name' => 'primary',   'label' => 'Primary (Green)' ] );
    register_block_style( 'core/button', [ 'name' => 'secondary', 'label' => 'Secondary (Outline)' ] );
    register_block_style( 'core/button', [ 'name' => 'ghost',     'label' => 'Ghost' ] );
    // Dividers
    register_block_style( 'core/separator', [ 'name' => 'green',  'label' => 'FMNR Green' ] );
    register_block_style( 'core/separator', [ 'name' => 'orange', 'label' => 'FMNR Orange' ] );
    // Tag / pill label
    register_block_style( 'core/paragraph', [ 'name' => 'fmnr-tag', 'label' => 'Tag / Pill' ] );
}
```

These styles are activated by clicking **Styles** in the block inspector sidebar. The CSS for each (`is-style-primary`, `is-style-green`, etc.) must be present in `styles.css`.

---

## 6. Block-by-Block Implementation

### 6A. Core Blocks (Atoms)

These are native Gutenberg blocks — no plugin required. Styling comes entirely from `styles.css` and `theme.json`.

| Block | Gutenberg Block | How to apply FMNR style |
|-------|----------------|------------------------|
| **Heading** | `core/heading` | In block inspector: set Font → FatFrank. Add CSS class `fmnr-heading` for uppercase + clamp sizing. |
| **Body Text** | `core/paragraph` | Font set globally via `theme.json`. Use classes `fmnr-body--small` or `fmnr-body--caption` for variants. |
| **Button** | `core/button` | In Styles panel: select Primary / Secondary / Ghost (registered above). |
| **Icon** | **Icon Block** plugin | Install Icon Block. Upload SVGs from `/icons/` directory via Media Library (Safe SVG is already active). Use the Icon Block's media picker to select them. |
| **Image** | `core/image` | Add Additional CSS class `fmnr-ken-burns` for Ken Burns animation on scroll. |
| **Video** | `core/video` | In block settings: enable Autoplay, Mute, Loop. Add class `fmnr-video`. |
| **Tag** | `core/paragraph` | In Styles panel: select **Tag / Pill** (registered above). |
| **Stat Number** | `core/html` or **Essential Blocks → Counter** | EB Counter provides native count-up. Style `.eb-counter-wrapper` to match FMNR. Or use `core/html`: `<span class="fmnr-stat-number" data-target="500">500</span>` — `scroll-animations.js` handles the count-up. |
| **Divider** | `core/separator` | In Styles panel: select **FMNR Green** or **FMNR Orange**. |
| **Spacer** | `core/spacer` | Set height in pixels using token values (8, 16, 32, 64). |
| **Form Field** | **WPForms** field | Create a WPForms form; embed via WPForms block. Style `.wpforms-field` in `styles.css`. |
| **List Item** | `core/list` | Add class `fmnr-list-item`. For icon list items, place **Icon Block** inside a `core/group` before a `core/paragraph`. |

---

### 6B. Custom Blocks (Molecules)

No ACF Pro is available. Each block uses the installed plugin stack or `core/html`.

#### Pull Quote

**Use: `core/group` + `core/quote`**

```
core/group
  background: colour token (e.g. var(--color-cream))
  CSS class: fmnr-pull-quote
  ├── core/quote
  │     text: quote content
  └── core/paragraph (attribution)
```

Save as a Templately pattern named "FMNR Pull Quote — [colour variant]".

---

#### CTA Band

**Use: `core/group` + `core/columns`**

```
core/group
  background: #000 or charcoal token
  CSS class: fmnr-cta-band
  ├── core/heading (text: white, font: FatFrank)
  ├── core/paragraph (text: rgba(255,255,255,0.7))
  └── core/buttons
        ├── core/button (style: primary)
        └── core/button (style: secondary)
```

---

#### Card (all variants)

**Use: Essential Blocks → Feature Card** for image/icon/blog variants.
**Use: `core/group`** with manual layout for video, horizontal, podcast, award variants.

Configure each variant, then save each to Templately:
- `fmnr-card--image` — EB Feature Card with image header
- `fmnr-card--blog` — EB Feature Card with tag + date meta
- `fmnr-card--icon` — EB Feature Card with icon instead of image
- `fmnr-card--horizontal` — `core/columns` (image left, content right), CSS class `fmnr-card--horizontal`
- `fmnr-card--award` — **Stackable Icon Box**
- `fmnr-card--media` — `core/group` with `core/video`/`core/image` + heading + tag

---

#### Bar Chart

**Use: `core/html`**

The bar chart requires the FMNR custom HTML markup. There is no equivalent plugin block. Paste the bar chart section from `bar-chart-demo.html` directly into a Custom HTML block. The `scroll-animations.js` `bar-fill` animation targets `.fmnr-bar` elements.

To update figures: open the Custom HTML block in Code Editor view and change the `data-fill` percentage values and label text.

---

#### Stat Tile

**Use: Essential Blocks → Counter** (preferred) or **Stackable → Count Up**

EB Counter settings to match FMNR Stat Tile:
- Number colour: choose a token colour (Green, Teal, Pear)
- Font: FatFrank
- Enable animation on scroll

Style the wrapper via `styles.css`:

```css
.eb-counter-wrapper.fmnr-stat-tile { /* match design */ }
```

---

#### Scroll Animation (wrapper)

**No separate block needed.** Apply animations via the **Additional CSS class** field on any block:

| Animation | CSS class to add |
|-----------|-----------------|
| Fade up | `fmnr-animate" data-animate="fade-up` ⚠ |
| Stagger children | `fmnr-animate" data-animate="stagger` ⚠ |
| Parallax | `fmnr-animate" data-animate="parallax` ⚠ |
| Scale in | `fmnr-animate" data-animate="scale-in` ⚠ |
| Slide in | `fmnr-animate" data-animate="slide-in` ⚠ |

⚠ **The `data-animate` attribute cannot be added via the CSS class field** — the block inspector only accepts class names, not attributes. Two options:

**Option A — GenerateBlocks Container (recommended):**
Wrap content in a **GenerateBlocks → Container** block. In the Container's **Advanced** tab → **HTML Attributes**, add:
- Attribute name: `data-animate`
- Attribute value: `fade-up` (or whichever type)

**Option B — Code Editor:**
Switch to Code Editor view (`Ctrl+Shift+Alt+M` or `⌘+Shift+Option+M`), find the block's opening tag, and manually add `data-animate="fade-up"`.

---

#### Timeline Entry

**Use: `core/html`** for pixel-accurate FMNR output.

Paste the full timeline markup from `timeline-demo.html` into a Custom HTML block. `timeline.js` handles expand/collapse. The `fmnr-timeline` CSS class on the container is required for the conditional JS enqueue to work (see Section 3.4).

Alternatively use **Stackable → Accordion** for a simpler, editor-friendly approach — override its CSS to approximate the FMNR timeline style.

---

#### Pillar Card / Numbered Pillars

**Use: `core/group` per card, or EB Feature Card**

```
core/group (CSS class: fmnr-pillar-card)
  ├── core/paragraph  (number — e.g. "01", colour: green token, font: FatFrank, large)
  ├── core/paragraph  (stat — optional, colour: teal token, count-up class)
  ├── core/heading    (heading — H3, FatFrank)
  └── core/paragraph  (body text)
```

Wrap three in a `core/columns` (3-col) for the Numbered Pillars pattern.

---

#### Award Card

**Use: Essential Blocks → Info Box** or **Stackable → Icon Box**

Both blocks have native icon + heading + description layout. Upload the relevant icon SVG from `/icons/` via Icon Block or as a media image.

---

#### Media Card

**Use: `core/group`** (manual) or **Essential Blocks → Post Grid** (auto from posts).

Manual variant for static content:
```
core/group (CSS class: fmnr-media-card, link wrapper)
  ├── core/image or core/video (thumbnail)
  ├── core/paragraph (style: Tag / Pill)
  └── core/heading (H4)
```

---

#### Video Controls / Progress Bar / Scroll Hint

These are **not editor-placed blocks**. They are injected by `video-hero.js` and `scroll-animations.js` at runtime:

- **Progress Bar** — fixed `<div class="fmnr-progress-bar">` injected on `DOMContentLoaded` targeting the `<body>`.
- **Video Controls** — play/pause and mute buttons injected adjacent to the `<video>` element inside any `core/cover` that has class `fmnr-video-hero`.
- **Scroll Hint** — animated chevron appended inside any `.fmnr-hero` container.

The developer must ensure these JS files target the correct selectors when the blocks are rendered by WordPress (selectors may differ from the demo HTML).

---

### 6C. Block Patterns (Organisms)

Build each pattern in the block editor, then save to Templately workspace **FMNR Patterns**.

Register the pattern category in `functions.php`:

```php
add_action( 'init', function() {
    register_block_pattern_category( 'fmnr', [ 'label' => 'FMNR Design System' ] );
} );
```

To register a pattern from code (paste the block markup from Code Editor view into the `content` field):

```php
add_action( 'init', function() {
    register_block_pattern( 'fmnr/cta-band', [
        'title'       => 'FMNR CTA Band',
        'description' => 'Dark full-width call-to-action with two buttons.',
        'categories'  => ['fmnr'],
        'content'     => '<!-- paste serialised block markup here -->',
    ] );
} );
```

| Pattern | Primary blocks used | Plugin(s) |
|---------|-------------------|-----------|
| **Card Grid** | `core/columns` (1–4 col) → EB Feature Card | Essential Blocks |
| **Hero Video** | `core/cover` (video bg, full height, class `fmnr-video-hero`) → heading + paragraph + buttons | Core |
| **Hero Image** | `core/cover` (image bg, class `fmnr-ken-burns`) → tag + heading + button | Core |
| **Split Bio** | `core/columns` 2-col → `core/image` + `core/group` (tags + heading + body) | Core |
| **Timeline** | `core/html` (full markup from `timeline-demo.html`) | Core |
| **Numbered Pillars** | `core/columns` 3-col → `core/group` (number + heading + body) per col | Core |
| **Awards Grid** | `core/columns` 3-col → EB Info Box or Stackable Icon Box per col | Essential Blocks or Stackable |
| **Media Grid** | `core/columns` 4-col → `core/group` per col (image + tag + heading) | Core |
| **Contact Form** | `core/group` → WPForms block | WPForms Lite |
| **Map Section** | `core/html` (Leaflet markup — see Section 7) | Core |
| **Stat Stack** | `core/columns` → EB Counter per col | Essential Blocks |
| **Search Overlay** | `core/html` (search trigger button — overlay rendered by `search.js`) | Core |
| **Intro Strip** | `core/columns` 2-col → large heading left, body group right | Core |
| **Editorial Band** | `core/cover` (fixed/parallax, class `fmnr-cover--parallax`) → eyebrow + heading + body | Core |
| **Twin Panels** | `core/columns` 2-col → `core/cover` per col (overlay text + tag + link) | Core |
| **Photo Grid** | `core/gallery` 3-col, class `fmnr-photo-grid` | Core |
| **Hub Section** | `core/columns` 2-col → media col + `core/group` (heading + icon list) | Core, Icon Block |
| **Stories Carousel** | **Stackable → Carousel** + FMNR CSS overrides, or `core/html` + `carousel.js` | Stackable |
| **Story Block** | `core/cover` (parallax, class `fmnr-cover--parallax`) → `core/quote` + `core/button` | Core |
| **Growth Steps** | `core/columns` 4-col → step number + `core/image` + heading + body per col | Core |
| **Newsletter** | `core/group` (centred, bg colour) → heading + paragraph + WPForms or OptinMonster inline form | WPForms / OptinMonster |

---

### 6D. Template Parts — Header & Footer

#### Block theme (FSE): Site Editor approach

Go to **Appearance → Editor → Template Parts** and create or edit:

- `header` — logo + nav + search trigger + CTA button
- `footer` — nav columns + newsletter + social links

#### Classic theme: PHP approach

Edit `header.php` and `footer.php` in the child theme. Use `wp_nav_menu()` for navigation output.

---

#### Mega Menu

`core/navigation` does not support icon+title+description mega menu panels natively. Two options:

**Option A — `core/html` block in the header template part (no new plugin):**

Paste the full header + mega menu HTML from `mega-menu-demo.html` (or `mega-menu-v2-demo.html`) into a Custom HTML block inside the header template part. Edit links directly in the HTML. `mega-menu.js` handles open/close and keyboard navigation.

Pros: pixel-accurate to design, zero new plugins.
Cons: non-technical editors cannot update the menu via **Appearance → Menus** — a developer must edit the HTML block.

**Option B — install a free mega menu plugin:**

Options: **Responsive Menu** (free tier), or **WP Responsive Menu**. Configure the plugin's panel layout to match FMNR's three variants (Standard 3-col, Compact List, Immersive Dark) using CSS overrides from `styles.css`.

Pros: editors update links via **Appearance → Menus** as normal.
Cons: plugin CSS must be overridden extensively to match FMNR design.

---

#### Footer structure

```
core/group  (background: #000, CSS class: fmnr-footer)
  core/group  (inner max-width container)
    core/columns  (4-col on desktop, 1-col on mobile)
      core/group  (col 1 — logo + tagline)
        core/site-logo
        core/paragraph  (tagline)
      core/group  (col 2 — nav links)
        core/navigation  (footer nav menu 1)
      core/group  (col 3 — nav links)
        core/navigation  (footer nav menu 2)
      core/group  (col 4 — newsletter)
        core/heading  (sign up heading)
        WPForms block  (email field only form)
  core/group  (bottom bar)
    core/paragraph  (© copyright)
    core/social-links
```

---

### 6E. Page Templates

For block themes, create template files in the child theme's `/templates/` directory. For classic themes, create `page-{slug}.php` files.

| Page | Template file | Block composition summary |
|------|--------------|--------------------------|
| **Homepage** | `templates/front-page.html` | Hero Video → Intro Strip → Stat Stack → Card Grid → Story Block → CTA Band |
| **Tony Rinaudo** | Standard page, no template file | Hero Image → Split Bio → Timeline → Awards Grid → CTA Band |
| **Resources** | `templates/page-resources.html` or `page-resources.php` | Filter bar + Card Grid. Use Document Library Lite (activate it) for downloadable file listings, or a custom REST API query with JS filter. |
| **Impact & Evidence** | Standard page | Hero Image → Stat Stack → Bar Charts → Editorial Band → Card Grid |
| **Partner With Us** | Standard page | Hero Image → Numbered Pillars → Media Grid → Contact Form |
| **Blog Listing** | `templates/home.html` or `home.php` | Featured post (`core/cover`) → EB Post Grid (auto-populated from posts) |
| **Blog Post** | `templates/single.html` or `single.php` | Hero Image → `core/post-content` → Related posts (`core/query`) |
| **Search Results** | `templates/search.html` or `search.php` | Search bar → `core/query` loop styled as List Items |

---

## 7. Map Section Setup

The Map Section uses Leaflet.js and requires a country data source.

### 7.1 Country data

Store country data as a JSON file in the theme:

```
/wp-content/themes/fmnr-child/assets/data/countries.json
```

The structure matches what is used in `map-demo.html`. Localise the JSON to the WordPress page via `wp_localize_script`:

```php
// In functions.php, inside the Leaflet conditional block:
wp_localize_script( 'fmnr-map', 'fmnrMapData', [
    'countriesUrl' => get_stylesheet_directory_uri() . '/assets/data/countries.json',
    'mapCentre'    => [ -5.0, 25.0 ],
    'mapZoom'      => 3,
] );
```

### 7.2 Embedding the map

Since Leaflet is loaded conditionally when `fmnr-map` appears in page content (see Section 3.4), the map section must include an element with the CSS class `fmnr-map`:

```
core/html
  <div class="fmnr-map" id="fmnr-leaflet-map" style="height:500px;"></div>
```

`map.js` initialises Leaflet targeting `#fmnr-leaflet-map`.

---

## 8. WPForms Lite — Scope & Limits

WPForms Lite supports for the FMNR Contact Form:
- ✅ Name, email, text, textarea, dropdown, number fields
- ✅ Honeypot spam protection
- ✅ Email notifications (routed through Post SMTP)
- ✅ Gutenberg block embed

Does **not** support without upgrading to Pro:
- ❌ File upload fields
- ❌ Conditional field logic
- ❌ Multi-step forms
- ❌ reCAPTCHA / Cloudflare Turnstile

For the Partnership inquiry form (which likely needs file uploads or conditional tiers), either upgrade to WPForms Pro or swap in **Forminator** (free, supports file uploads).

Style WPForms output in `styles.css`:

```css
/* Match FMNR form field style */
.wpforms-field input,
.wpforms-field textarea,
.wpforms-field select {
    border: 1px solid var(--color-charcoal);
    border-radius: 4px;
    font-family: var(--font-body);
    font-size: var(--text-base);
    padding: 12px 16px;
    width: 100%;
}
.wpforms-submit {
    /* Match primary button style */
    background: var(--color-green);
    color: #fff;
    font-family: var(--font-body);
    font-weight: var(--weight-bold);
    border: none;
    border-radius: 4px;
    padding: 14px 28px;
    cursor: pointer;
}
```

---

## 9. Templately Workspace Setup

1. Go to **Templately → My Templates → Cloud** and create a workspace: **FMNR Design System**
2. Invite all content editors to the workspace
3. Build and save templates in this order:

| Order | Template | Folder |
|-------|----------|--------|
| 1 | CTA Band | FMNR / Molecules |
| 2 | Pull Quote (each colour) | FMNR / Molecules |
| 3 | Card — Image variant | FMNR / Molecules |
| 4 | Card — Blog variant | FMNR / Molecules |
| 5 | Card — Icon variant | FMNR / Molecules |
| 6 | Card — Award variant | FMNR / Molecules |
| 7 | Stat Tile | FMNR / Molecules |
| 8 | Stat Stack | FMNR / Patterns |
| 9 | Card Grid | FMNR / Patterns |
| 10 | Hero Video | FMNR / Patterns |
| 11 | Hero Image | FMNR / Patterns |
| 12 | Numbered Pillars | FMNR / Patterns |
| 13 | Editorial Band | FMNR / Patterns |
| 14 | Contact Form section | FMNR / Patterns |
| 15 | Newsletter section | FMNR / Patterns |
| 16 | Timeline | FMNR / Patterns |
| 17 | Full page — Homepage | FMNR / Pages |
| 18 | Full page — Blog Post | FMNR / Pages |
| 19 | Full page — Resources | FMNR / Pages |
| 20 | Full page — Impact & Evidence | FMNR / Pages |

---

## 10. Custom CSS Classes Reference

Apply these via the **Additional CSS class(es)** field in the block inspector sidebar.

| Class | Block | Effect |
|-------|-------|--------|
| `fmnr-heading` | `core/heading` | FatFrank, uppercase, clamp sizing |
| `fmnr-body--small` | `core/paragraph` | Small body text |
| `fmnr-body--caption` | `core/paragraph` | Caption text |
| `fmnr-ken-burns` | `core/image`, `core/cover` | Ken Burns pan/zoom on scroll |
| `fmnr-cover--parallax` | `core/cover` | Fixed-attachment parallax |
| `fmnr-video-hero` | `core/cover` (video) | Signals `video-hero.js` to inject play/pause controls |
| `fmnr-pull-quote` | `core/group` | Full-width quote band styling |
| `fmnr-cta-band` | `core/group` | Dark CTA section styling |
| `fmnr-pillar-card` | `core/group` | Numbered feature card |
| `fmnr-card--horizontal` | `core/group` | Horizontal card layout |
| `fmnr-photo-grid` | `core/gallery` | Overlay caption on hover |
| `fmnr-timeline` | `core/html` wrapper | Signals `timeline.js` to initialise |
| `fmnr-carousel` | `core/html` wrapper | Signals `carousel.js` to initialise |
| `fmnr-map` | `core/html` | Signals Leaflet + `map.js` to load |
| `fmnr-stat-number` | `core/html` `<span>` | Count-up animation target |
| `fmnr-footer` | `core/group` | Footer dark background and layout |

---

## 11. Implementation Sequence

Work through these in order. Each step depends on the previous.

### Phase 1 — Environment (Day 1)

- [ ] **1.1** Identify active theme name by inspecting page source (look for `wp-content/themes/<slug>`)
- [ ] **1.2** Create child theme with `style.css`, `functions.php`
- [ ] **1.3** Activate child theme via Appearance → Themes
- [ ] **1.4** Install WPCode Lite and Icon Block plugins
- [ ] **1.5** Add `fmnrhub.com.au` and `www.fmnrhub.com.au` to the Adobe Fonts kit `ajf0nww` allowed domains
- [ ] **1.6** Copy `design-tokens.css`, `styles.css`, `/icons/`, `/images/` into child theme `/assets/`
- [ ] **1.7** Extract JS files from demo HTML files into child theme `/assets/js/`
- [ ] **1.8** Add all enqueue hooks to `functions.php` (Section 3.4)
- [ ] **1.9** Add Typekit `wp_head` hook to `functions.php`
- [ ] **1.10** Add editor stylesheets via `add_editor_style()` (Section 3.4)
- [ ] **1.11** If block theme: create `theme.json` (Section 4)
- [ ] **1.12** Add block style registrations to `functions.php` (Section 5)
- [ ] **1.13** Add `fmnr` block pattern category to `functions.php`
- [ ] **1.14** Verify: FatFrank loads on the front end (check Network tab — `ajf0nww`)
- [ ] **1.15** Verify: FMNR CSS variables are present in DevTools (check `--color-green`, `--font-heading`)

### Phase 2 — Header & Footer (Day 1–2)

- [ ] **2.1** Choose mega menu approach (Option A: HTML block, or Option B: plugin)
- [ ] **2.2** Build Header template part (logo + nav + search + CTA)
- [ ] **2.3** Build Footer template part (nav cols + newsletter + social)
- [ ] **2.4** Verify mega menu open/close and keyboard navigation work
- [ ] **2.5** Verify footer newsletter form submits (check Post SMTP log)

### Phase 3 — Molecule Blocks (Day 2–3)

Build each block, verify it renders correctly, then save to Templately workspace:

- [ ] **3.1** CTA Band
- [ ] **3.2** Pull Quote (green, cream, orange variants)
- [ ] **3.3** Card — Image variant
- [ ] **3.4** Card — Blog variant
- [ ] **3.5** Card — Icon variant
- [ ] **3.6** Card — Award variant
- [ ] **3.7** Card — Horizontal variant
- [ ] **3.8** Stat Tile (EB Counter styled)
- [ ] **3.9** Bar Chart (`core/html` paste)
- [ ] **3.10** Timeline (`core/html` paste — verify `timeline.js` initialises)
- [ ] **3.11** Stories Carousel (Stackable or `core/html`)

### Phase 4 — Patterns (Day 3–4)

- [ ] **4.1** Card Grid (1–4 column variants)
- [ ] **4.2** Hero Video (verify video plays, controls appear, progress bar shows)
- [ ] **4.3** Hero Image (verify Ken Burns fires on load)
- [ ] **4.4** Stat Stack (verify count-up fires on scroll)
- [ ] **4.5** Numbered Pillars
- [ ] **4.6** Awards Grid
- [ ] **4.7** Intro Strip
- [ ] **4.8** Editorial Band (verify parallax on scroll)
- [ ] **4.9** Story Block
- [ ] **4.10** Twin Panels
- [ ] **4.11** Photo Grid
- [ ] **4.12** Hub Section
- [ ] **4.13** Growth Steps
- [ ] **4.14** Newsletter section
- [ ] **4.15** Contact Form section
- [ ] **4.16** Map Section (verify Leaflet loads only on pages with `fmnr-map` class)
- [ ] **4.17** Search Overlay (verify overlay opens/closes, results populate)

### Phase 5 — Page Templates (Day 4–6)

Build pages using the saved Templately patterns:

- [ ] **5.1** Homepage — assemble, review on desktop + mobile
- [ ] **5.2** Tony Rinaudo profile page
- [ ] **5.3** Blog listing page
- [ ] **5.4** Blog post single template (set as default single template)
- [ ] **5.5** Resources page (activate Document Library Lite if using for downloads)
- [ ] **5.6** Impact & Evidence page
- [ ] **5.7** Partner With Us page
- [ ] **5.8** Search results template

### Phase 6 — QA (Day 6–7)

- [ ] **6.1** Scroll animations fire correctly and do not trigger in WP editor
- [ ] **6.2** All count-up numbers animate on scroll entry
- [ ] **6.3** Bar charts animate on scroll
- [ ] **6.4** Timeline accordion expands/collapses
- [ ] **6.5** Carousel scrolls and prev/next controls work
- [ ] **6.6** Map loads only on the Impact or Resources page (check Network tab on homepage — Leaflet should NOT load)
- [ ] **6.7** All WPForms submissions receive email notification (check Post SMTP log)
- [ ] **6.8** FatFrank renders on all headings across all pages
- [ ] **6.9** Mobile responsiveness — test all patterns at 390px width
- [ ] **6.10** No console errors on any page

---

## 12. Known Complexity Areas

| Area | Issue | Resolution |
|------|-------|-----------|
| **Mega Menu** | `core/navigation` doesn't support icon+description nav items | Use `core/html` block (Option A) or install a free mega menu plugin (Option B) |
| **Bar Chart** | No plugin equivalent | `core/html` paste — editors must use Code Editor view to update values |
| **Timeline** | No plugin equivalent that matches FMNR design | `core/html` paste — or Stackable Accordion with heavy CSS override |
| **Map Section** | Requires Leaflet + data source | `core/html` + JSON data file in theme + conditional enqueue |
| **Stories Carousel** | Stackable Carousel is close but may need CSS override for progress bar + controls | Start with Stackable; fall back to `core/html` if controls don't match |
| **`data-animate` attribute** | Block inspector only accepts CSS classes | Use GenerateBlocks Container (HTML Attributes field) or Code Editor view |
| **Video Hero controls** | `core/cover` doesn't expose play/pause natively | `video-hero.js` injects controls — verify it targets the correct `.wp-block-cover video` selector |
| **Resources page filtering** | No FacetWP installed | Use Document Library Lite (already installed, inactive) for file-based filtering; or build a custom REST API + JS filter matching the `resources.html` design |
| **WPForms Lite limits** | No file uploads or conditional logic | Upgrade to Pro or replace with free Forminator plugin for complex forms |
| **Decision Tree** | Multi-file interactive JS tool | Embed as `<iframe>` in a `core/html` block pointing to a standalone hosted page |
| **Animations in editor** | `scroll-animations.js` must not fire inside the block editor | Guard all IntersectionObserver init with `if (document.body.classList.contains('block-editor-page')) return;` |
