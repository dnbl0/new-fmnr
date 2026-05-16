# WordPress Block Implementation Guide
## FMNR Design System → fmnrhub.com.au

Practical developer guide for applying the blocks in `components.html` to the existing WordPress site.

---

## 1. What We Know About the Existing Site

Extracted from live page source on fmnrhub.com.au.

### Theme

| Item | Value |
|------|-------|
| **Parent theme** | `twentytwentyfour` (Twenty Twenty-Four) |
| **Child theme slug** | `fmnr` |
| **Child theme path** | `wp-content/themes/fmnr/` |
| **Theme type** | **Block theme (FSE)** — Site Editor is available |
| **WordPress version** | 6.9.4 |
| **Content width** | 620px |
| **Wide width** | 1280px |

The child theme `fmnr` already exists. All changes go there.

### Fonts — already self-hosted, no external service needed

All fonts are loaded via `@font-face` from `wp-content/uploads/fonts/`. **Do not add Adobe Typekit or Google Fonts links** — they are already handled.

| Font | File | Weight(s) |
|------|------|-----------|
| **FatFrank** | `uploads/fonts/fatfrank.otf` | 900 |
| **Lato** | `uploads/fonts/S6uyw4BMUTPHvxw6XweuBCY.woff2` etc. | 400, 700, 900 (normal + italic) |
| **Archivo Black** | Loaded from `54.252.190.200` (server IP) | 400 |
| Inter | From TT4 parent theme | 300–900 |
| Cardo | From TT4 parent theme | 400, 700 |

> ⚠️ **Archivo Black is loading from a bare IP address (`54.252.190.200`), not a domain.** This will break if the server IP changes. The font file should be copied into `wp-content/uploads/fonts/` and the `@font-face` in `theme.json` updated to a proper path.

### Existing `theme.json` tokens

The FMNR colour palette and font families **are already registered**. These `--wp--preset--*` variables are live on the site:

**Colours (already in theme.json):**

| Slug | Value | Matches design token |
|------|-------|----------------------|
| `custom-orange-fmnr` | `#ff6600` | Close to `--color-orange: #FA6B01` |
| `custom-dark-green-fmnr` | `#00552f` | Close to `--color-green: #077D57` — used for buttons |
| `custom-lime` | `#b8fa1a` | Exact match — `--color-lime` |
| `custom-teal` | `#0dfaab` | Close to `--color-teal: #0FFBAB` |
| `custom-light-green` | `#d0ffef` | New — not in design tokens file |
| `custom-green` | `#2da57f` | Mid green — used for GenerateBlocks cards |

**Standard WP palette also present:** `base` (#f9f9f9), `base-2` (#ffffff), `contrast` (#111111), `contrast-2` (#636363), `contrast-3` (#A4A4A4), and accent colours from TT4.

**Font families (already registered):**

| Slug | Font | CSS variable |
|------|------|-------------|
| `fatfrank` | FatFrank | `--wp--preset--font-family--fatfrank` |
| `lato` | Lato | `--wp--preset--font-family--lato` |
| `archivo-black` | Archivo Black | `--wp--preset--font-family--archivo-black` |
| `body` | Inter (TT4 default) | `--wp--preset--font-family--body` |
| `heading` | Cardo (TT4 default) | `--wp--preset--font-family--heading` |

**Global styles already applied:**
- `body`: font-family Lato, font-size medium (1.05rem), line-height 1.5
- `h1–h6`: font-family FatFrank, font-weight 400, line-height 0.9
- Buttons: background `custom-dark-green-fmnr` (#00552f), border-radius 0.33rem
- Links (non-button): font-family Archivo Black, no underline

### Active plugins confirmed in source

| Plugin | Evidence in source |
|--------|--------------------|
| Essential Blocks 6.0.6 | `eb-style/frontend/frontend-*.min.css`, `eb-reusable-block-style-661`, `eb-fse-style-636` |
| GenerateBlocks 2.2.1 | `.gb-container-*`, `.gb-headline-*` inline CSS |
| Stackable 3.19.7 | `stackable-ultimate-gutenberg-blocks/dist/frontend_blocks.css` |
| All in One SEO 4.9.5.1 | Meta tags, schema JSON-LD |
| MonsterInsights 10.1.3 | GA tracking script (ID: G-68QWYTD0RR) |
| WPForms Lite 1.10.0.2 | Admin bar CSS |
| jQuery 3.7.1 | Loaded from wp-includes |

---

## 2. Plugin Stack Reference

| Plugin | Status | Role in this project |
|--------|--------|---------------------|
| **Gutenberg** (core) | Active | Block editor |
| **Templately** 3.5.2 | Active | Pattern / page template cloud — save and share reusable sections |
| **Essential Blocks** 6.0.6 | Active | Counter, Info Box, Feature Card, Post Grid, and ~65 more blocks |
| **GenerateBlocks** 2.2.1 | Active | Already in use — Container, Grid, Text, Button, Image primitives |
| **Stackable** 3.19.7 | Active | Carousel, Accordion, Count Up, Icon Box, Columns |
| **WPForms Lite** 1.10.0.2 | Active | Contact forms — basic fields only (see Section 8) |
| **Safe SVG** 2.4.0 | Active | SVG uploads to Media Library are allowed |
| **All in One SEO** 4.9.5.1 | Active | SEO meta |
| **MonsterInsights** 10.1.3 | Active | GA4 (ID: G-68QWYTD0RR) |
| **Post SMTP** 3.9.1 | Active | Email delivery for form submissions |
| **FileBird Lite** 6.4.9 | Active | Media library folder organisation |
| **OptinMonster** 2.16.22 | Active | Newsletter popups and inline forms |
| **Genesis Blocks** 3.1.8 | Inactive | Skip — covered by EB + Stackable |
| **Twentig** 2.0 | Inactive | Can activate for additional core block style options |
| **Document Library Lite** | Inactive | Activate for Resources page file download listings |

### Two free plugins to add

```
WPCode Lite   — wordpress.org/plugins/insert-headers-and-footers
Icon Block    — wordpress.org/plugins/icon-block
```

- **WPCode Lite** — inject FMNR CSS/JS globally without editing `functions.php` directly. Safer for deployments where direct file access is restricted.
- **Icon Block** (Nick Diego) — proper SVG icon picker in the editor. Works with Safe SVG uploads.

---

## 3. Child Theme Setup

The child theme `fmnr` already exists at `wp-content/themes/fmnr/`. Do not create a new one. All work goes into this directory.

### 3.1 Verify the child theme is active

In **Appearance → Themes**, confirm **FMNR** (or similar name) is the active theme, not Twenty Twenty-Four directly.

### 3.2 Child theme file structure

Add the following structure inside the existing `fmnr` child theme:

```
wp-content/themes/fmnr/
  style.css          ← already exists
  functions.php      ← already exists or create it
  theme.json         ← already exists — edit carefully (see Section 4)
  assets/
    css/
      fmnr-blocks.css     ← NEW — all FMNR block overrides
      decision-tree.css   ← copy from repo
    js/
      scroll-animations.js
      timeline.js
      carousel.js
      map.js
      mega-menu.js
      search.js
      video-hero.js
      decision-trees-part-1-main.js
      decision-trees-part-1-helpers.js
      decision-trees-part-1-rAF-polyfill.js
    icons/              ← copy /icons/ from repo
    images/             ← copy /images/ from repo
    data/
      countries.json    ← map section country data
```

> **Do not copy `design-tokens.css` or `styles.css` wholesale into the theme.** The existing site already has its own `theme.json` tokens and global styles. Instead, create `fmnr-blocks.css` as a targeted override file that only adds what's missing (see Section 5).

### 3.3 Copy assets from repo

```bash
# Run from the repo root. Replace /path/to/wp/ with the actual WP root.
THEME="/path/to/wp/wp-content/themes/fmnr"

cp decision-tree.css   "$THEME/assets/css/"
cp -r icons/           "$THEME/assets/icons/"
cp -r images/          "$THEME/assets/images/"

# JS files (copy existing standalone files directly)
cp decision-trees-part-1-main.js      "$THEME/assets/js/"
cp decision-trees-part-1-helpers.js   "$THEME/assets/js/"
cp decision-trees-part-1-rAF-polyfill.js "$THEME/assets/js/"
```

### 3.4 Extract JavaScript from demo HTML files

Each demo file has its JS in a `<script>` tag at the bottom. Cut-and-paste each into a standalone file:

| Target file | Source demo file | What to extract |
|-------------|-----------------|----------------|
| `assets/js/scroll-animations.js` | `scroll-animations-demo.html` | Full `<script>` block — IntersectionObserver for all animation types |
| `assets/js/timeline.js` | `timeline-demo.html` | Expand/collapse accordion logic |
| `assets/js/carousel.js` | `stories-carousel-demo.html` | Horizontal scroll + prev/next controls |
| `assets/js/map.js` | `map-demo.html` | Leaflet init + country data handlers |
| `assets/js/mega-menu.js` | `mega-menu-demo.html` | Open/close + keyboard nav |
| `assets/js/search.js` | `search-demo.html` | Overlay open/close + predictive results |
| `assets/js/video-hero.js` | `video-hero-demo.html` | Play/pause, mute toggle, progress bar, scroll hint |

### 3.5 Guard animations against the block editor

At the top of `scroll-animations.js`, add:

```js
document.addEventListener('DOMContentLoaded', function () {
    // Do not run animations inside the Gutenberg block editor
    if (
        document.body.classList.contains('block-editor-page') ||
        (window.wp && window.wp.blocks)
    ) return;

    // ... rest of scroll-animations init code
});
```

Apply the same guard to `timeline.js`, `carousel.js`, and `video-hero.js`.

---

## 4. theme.json — What to Add vs What Already Exists

> **Do not replace the existing `theme.json`** — it already has working font registrations, colour tokens, and global styles. Only add what is missing.

Open `wp-content/themes/fmnr/theme.json` and make the following targeted additions:

### 4.1 Add missing FMNR colours

The existing palette has `custom-orange-fmnr`, `custom-dark-green-fmnr`, `custom-lime`, `custom-teal`, `custom-light-green`, `custom-green`. The following are **not yet registered** and should be added to the `settings.color.palette` array:

```json
{ "slug": "fmnr-pear",    "color": "#DDEB4A", "name": "FMNR Pear" },
{ "slug": "fmnr-olive",   "color": "#5C7D0D", "name": "FMNR Olive" },
{ "slug": "fmnr-cedar",   "color": "#7D3600", "name": "FMNR Cedar" },
{ "slug": "fmnr-amber",   "color": "#F2AA00", "name": "FMNR Amber" },
{ "slug": "fmnr-sand",    "color": "#E0CAA0", "name": "FMNR Sand" },
{ "slug": "fmnr-cream",   "color": "#EFE9DC", "name": "FMNR Cream" },
{ "slug": "fmnr-charcoal","color": "#464646", "name": "FMNR Charcoal" }
```

### 4.2 Colour token mapping — use existing slugs

When referencing colours in block settings or CSS, use the **existing slug names**, not the ones from `design-tokens.css`:

| Design token | Existing WP preset slug | CSS variable |
|-------------|------------------------|-------------|
| `--color-green` (#077D57) | `custom-dark-green-fmnr` | `--wp--preset--color--custom-dark-green-fmnr` |
| `--color-orange` (#FA6B01) | `custom-orange-fmnr` | `--wp--preset--color--custom-orange-fmnr` |
| `--color-teal` (#0FFBAB) | `custom-teal` | `--wp--preset--color--custom-teal` |
| `--color-lime` (#B8FA1A) | `custom-lime` | `--wp--preset--color--custom-lime` |
| `--color-green` (mid) | `custom-green` | `--wp--preset--color--custom-green` |
| `--font-heading` | `fatfrank` | `--wp--preset--font-family--fatfrank` |
| `--font-body` | `lato` | `--wp--preset--font-family--lato` |

### 4.3 Fix Archivo Black font source

The current `theme.json` loads Archivo Black from a bare IP address. Update it to use the uploaded font file:

1. Upload `Archivo Black` woff2 to `wp-content/uploads/fonts/` via **Appearance → Editor → Styles → Typography → Manage fonts**
2. Or edit `theme.json` directly — find the `ArchivoBlack` font face entry and change the `src` to a proper URL: `https://fmnrhub.com.au/wp-content/uploads/fonts/archivo-black.woff2`

---

## 5. FMNR Block CSS — fmnr-blocks.css

Create `wp-content/themes/fmnr/assets/css/fmnr-blocks.css`. This file adds FMNR design system styles on top of the existing theme without conflicting with it.

```css
/* ============================================================
   FMNR Block Overrides
   Loaded on: front-end + editor (via add_editor_style)
   ============================================================ */

/* --- Headings: ensure FatFrank is uppercase where FMNR design requires it --- */
.fmnr-heading {
    font-family: var(--wp--preset--font-family--fatfrank);
    text-transform: uppercase;
    line-height: 0.9;
}

/* --- Tag / Pill label --- */
.wp-block-paragraph.is-style-fmnr-tag,
.fmnr-tag {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    background: rgba(0, 85, 47, 0.1);
    color: var(--wp--preset--color--custom-dark-green-fmnr);
    padding: 4px 12px;
    border-radius: 100px;
    line-height: 1.6;
}

/* --- Button variants --- */
.wp-block-button.is-style-primary .wp-block-button__link {
    background-color: var(--wp--preset--color--custom-dark-green-fmnr);
    color: #fff;
    border: none;
}
.wp-block-button.is-style-primary .wp-block-button__link:hover {
    background-color: var(--wp--preset--color--custom-green);
}
.wp-block-button.is-style-secondary .wp-block-button__link {
    background: transparent;
    border: 2px solid currentColor;
    color: var(--wp--preset--color--custom-dark-green-fmnr);
    padding: calc(0.6rem - 2px) calc(1rem - 2px);
}
.wp-block-button.is-style-secondary .wp-block-button__link:hover {
    background: var(--wp--preset--color--custom-dark-green-fmnr);
    color: #fff;
}
.wp-block-button.is-style-ghost .wp-block-button__link {
    background: transparent;
    border: none;
    color: inherit;
    text-decoration: underline;
}

/* --- Dividers --- */
.wp-block-separator.is-style-fmnr-green { border-color: var(--wp--preset--color--custom-dark-green-fmnr); }
.wp-block-separator.is-style-fmnr-orange { border-color: var(--wp--preset--color--custom-orange-fmnr); }

/* --- Ken Burns image animation --- */
.fmnr-ken-burns img,
.fmnr-ken-burns .wp-block-cover__image-background {
    animation: fmnr-ken-burns 20s ease-in-out infinite alternate;
    transform-origin: center center;
}
@keyframes fmnr-ken-burns {
    0%   { transform: scale(1)    translateX(0)    translateY(0); }
    100% { transform: scale(1.12) translateX(-2%)  translateY(-1%); }
}

/* --- Parallax cover --- */
.fmnr-cover--parallax .wp-block-cover__image-background,
.fmnr-cover--parallax .wp-block-cover__video-background {
    background-attachment: fixed;
}

/* --- Pull Quote band --- */
.fmnr-pull-quote {
    padding: 64px var(--wp--preset--spacing--40);
    text-align: center;
}
.fmnr-pull-quote .wp-block-quote p {
    font-family: var(--wp--preset--font-family--fatfrank);
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    line-height: 1.1;
    text-transform: uppercase;
}
.fmnr-pull-quote cite {
    font-size: 0.9rem;
    opacity: 0.7;
    font-style: normal;
}

/* --- CTA Band --- */
.fmnr-cta-band {
    padding: var(--wp--preset--spacing--50) var(--wp--preset--spacing--40);
    text-align: center;
}

/* --- Stat number (count-up target) --- */
.fmnr-stat-number {
    font-family: var(--wp--preset--font-family--fatfrank);
    font-size: clamp(3rem, 8vw, 6rem);
    line-height: 1;
    color: var(--wp--preset--color--custom-teal);
    display: block;
}

/* --- Photo grid overlay captions --- */
.fmnr-photo-grid figure { position: relative; overflow: hidden; }
.fmnr-photo-grid figcaption {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.7));
    color: #fff;
    padding: 24px 16px 12px;
    transform: translateY(100%);
    transition: transform 0.3s ease;
}
.fmnr-photo-grid figure:hover figcaption { transform: translateY(0); }

/* --- Progress bar (scroll indicator) --- */
.fmnr-progress-bar {
    position: fixed;
    top: 0; left: 0;
    height: 3px;
    width: 0%;
    background: var(--wp--preset--color--custom-lime);
    z-index: 9999;
    transform-origin: left;
    transition: width 0.1s linear;
}

/* --- WPForms styling to match FMNR --- */
.wpforms-field input[type="text"],
.wpforms-field input[type="email"],
.wpforms-field input[type="number"],
.wpforms-field textarea,
.wpforms-field select {
    border: 1px solid #464646;
    border-radius: 4px;
    font-family: var(--wp--preset--font-family--lato);
    font-size: 1rem;
    padding: 12px 16px;
    width: 100%;
    background: #fff;
    transition: border-color 0.2s;
}
.wpforms-field input:focus,
.wpforms-field textarea:focus,
.wpforms-field select:focus {
    outline: none;
    border-color: var(--wp--preset--color--custom-dark-green-fmnr);
}
.wpforms-field label { font-weight: 700; font-size: 0.875rem; margin-bottom: 6px; display: block; }
.wpforms-submit-container .wpforms-submit {
    background: var(--wp--preset--color--custom-dark-green-fmnr);
    color: #fff;
    font-family: var(--wp--preset--font-family--lato);
    font-weight: 700;
    border: none;
    border-radius: 4px;
    padding: 14px 28px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s;
}
.wpforms-submit-container .wpforms-submit:hover {
    background: var(--wp--preset--color--custom-green);
}

/* --- Pillar card --- */
.fmnr-pillar-card {
    padding: 32px;
    border-radius: 8px;
}
.fmnr-pillar-card__number {
    font-family: var(--wp--preset--font-family--fatfrank);
    font-size: 4rem;
    color: var(--wp--preset--color--custom-dark-green-fmnr);
    line-height: 1;
    margin-bottom: 8px;
}

/* --- Hero video controls (injected by video-hero.js) --- */
.fmnr-hero-controls {
    position: absolute;
    bottom: 32px;
    right: 32px;
    display: flex;
    gap: 8px;
    z-index: 10;
}
.fmnr-hero-controls button {
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.3);
    color: #fff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
}
.fmnr-hero-controls button:hover { background: rgba(255,255,255,0.3); }

/* --- Scroll hint (animated chevron) --- */
.fmnr-scroll-hint {
    position: absolute;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    animation: fmnr-bounce 1.5s ease-in-out infinite;
    color: #fff;
    opacity: 0.8;
}
@keyframes fmnr-bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50%       { transform: translateX(-50%) translateY(8px); }
}
```

---

## 6. Enqueue Assets in functions.php

Open `wp-content/themes/fmnr/functions.php` and add (or merge with existing content):

```php
<?php
/**
 * FMNR child theme asset enqueue
 */
add_action( 'wp_enqueue_scripts', 'fmnr_enqueue_assets' );
function fmnr_enqueue_assets() {

    // FMNR block CSS overrides
    wp_enqueue_style(
        'fmnr-blocks',
        get_stylesheet_directory_uri() . '/assets/css/fmnr-blocks.css',
        [],
        '1.0'
    );

    // Core JS — load on every page
    wp_enqueue_script( 'fmnr-scroll-animations',
        get_stylesheet_directory_uri() . '/assets/js/scroll-animations.js', [], '1.0', true );
    wp_enqueue_script( 'fmnr-mega-menu',
        get_stylesheet_directory_uri() . '/assets/js/mega-menu.js', [], '1.0', true );
    wp_enqueue_script( 'fmnr-search',
        get_stylesheet_directory_uri() . '/assets/js/search.js', [], '1.0', true );
    wp_enqueue_script( 'fmnr-video-hero',
        get_stylesheet_directory_uri() . '/assets/js/video-hero.js', [], '1.0', true );

    // Conditional: only enqueue JS when the page content needs it
    if ( is_singular() && has_blocks() ) {
        $content = get_post()->post_content ?? '';

        if ( strpos( $content, 'fmnr-timeline' ) !== false ) {
            wp_enqueue_script( 'fmnr-timeline',
                get_stylesheet_directory_uri() . '/assets/js/timeline.js', [], '1.0', true );
        }

        if ( strpos( $content, 'fmnr-carousel' ) !== false ) {
            wp_enqueue_script( 'fmnr-carousel',
                get_stylesheet_directory_uri() . '/assets/js/carousel.js', [], '1.0', true );
        }

        if ( strpos( $content, 'fmnr-map' ) !== false ) {
            wp_enqueue_style(  'leaflet',
                'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', [], '1.9.4' );
            wp_enqueue_script( 'leaflet',
                'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', [], '1.9.4', true );
            wp_enqueue_script( 'fmnr-map',
                get_stylesheet_directory_uri() . '/assets/js/map.js', ['leaflet'], '1.0', true );
            wp_localize_script( 'fmnr-map', 'fmnrMapData', [
                'countriesUrl' => get_stylesheet_directory_uri() . '/assets/data/countries.json',
                'mapCentre'    => [ -5.0, 25.0 ],
                'mapZoom'      => 3,
            ]);
        }
    }
}

// Editor stylesheet — makes blocks look right inside the WP editor too
add_action( 'after_setup_theme', function() {
    add_editor_style( 'assets/css/fmnr-blocks.css' );
} );

// Register FMNR block styles (button variants, divider colours, tag pill)
add_action( 'init', 'fmnr_register_block_styles' );
function fmnr_register_block_styles() {
    register_block_style( 'core/button',    [ 'name' => 'primary',      'label' => 'Primary (Green)' ] );
    register_block_style( 'core/button',    [ 'name' => 'secondary',    'label' => 'Secondary (Outline)' ] );
    register_block_style( 'core/button',    [ 'name' => 'ghost',        'label' => 'Ghost' ] );
    register_block_style( 'core/separator', [ 'name' => 'fmnr-green',   'label' => 'FMNR Green' ] );
    register_block_style( 'core/separator', [ 'name' => 'fmnr-orange',  'label' => 'FMNR Orange' ] );
    register_block_style( 'core/paragraph', [ 'name' => 'fmnr-tag',     'label' => 'Tag / Pill' ] );
}

// Register FMNR block pattern category
add_action( 'init', function() {
    register_block_pattern_category( 'fmnr', [ 'label' => 'FMNR Design System' ] );
} );
```

---

## 7. Block-by-Block Implementation

### 7A. Core Blocks (Atoms)

All are native Gutenberg blocks. Styling is handled by `fmnr-blocks.css` and the existing `theme.json`.

| Block | Gutenberg Block | How to apply FMNR style |
|-------|----------------|------------------------|
| **Heading** | `core/heading` | Font is already FatFrank globally via `theme.json`. Add class `fmnr-heading` for uppercase. |
| **Body Text** | `core/paragraph` | Lato already applied globally. Use classes `fmnr-body--small` / `fmnr-body--caption` as needed. |
| **Button** | `core/button` | In Styles panel select Primary / Secondary / Ghost (registered in `functions.php`). |
| **Icon** | **Icon Block** plugin | Install Icon Block. Upload SVGs from repo `/icons/` via Media Library (Safe SVG is active). |
| **Image** | `core/image` | Add class `fmnr-ken-burns` for Ken Burns animation on scroll. |
| **Video** | `core/video` | Enable Autoplay, Mute, Loop in block settings. Add class `fmnr-video`. |
| **Tag** | `core/paragraph` | In Styles panel select **Tag / Pill**. |
| **Stat Number** | **Essential Blocks → Counter** | Provides count-up natively. Style with class `fmnr-stat-number` or override `.eb-counter-wrapper`. |
| **Divider** | `core/separator` | In Styles panel select **FMNR Green** or **FMNR Orange**. |
| **Spacer** | `core/spacer` | Set height using spacing token values (16, 32, 64px). |
| **Form Field** | **WPForms Lite** field | Styled automatically by `fmnr-blocks.css`. |
| **List Item** | `core/list` | Add class `fmnr-list-item`. For icon lists, use Icon Block + `core/paragraph` in a `core/group`. |

---

### 7B. Custom Blocks (Molecules)

#### Pull Quote

```
core/group
  class: fmnr-pull-quote
  background: custom-cream or custom-teal token
  └── core/quote (large italic text)
  └── core/paragraph (attribution — small, dimmed)
```

Save to Templately as "FMNR Pull Quote — Cream", "FMNR Pull Quote — Teal" etc.

---

#### CTA Band

```
core/group
  class: fmnr-cta-band
  background: #000 (contrast token)
  color: white
  └── core/heading  (FatFrank, white, text-align center)
  └── core/paragraph (body, white 70% opacity)
  └── core/buttons
        ├── core/button (style: primary)
        └── core/button (style: secondary)
```

---

#### Card (all variants)

**Image / Blog / Icon variants:** Use **Essential Blocks → Feature Card**. Configure, then save each variant to Templately.

**Award variant:** Use **Stackable → Icon Box** or **Essential Blocks → Info Box**.

**Horizontal variant:**
```
core/columns (2-col, no-stack-on-mobile)
  class: fmnr-card--horizontal
  ├── core/column (40% — image)
  └── core/column (60% — tag + heading + body + button)
```

**Media card (video/image thumbnail):**
```
core/group (link via GenerateBlocks Container with href)
  ├── core/image or core/video
  ├── core/paragraph (style: Tag / Pill)
  └── core/heading (H4)
```

---

#### Bar Chart

No plugin equivalent. Use `core/html` — paste the bar chart HTML directly from `bar-chart-demo.html`. `scroll-animations.js` targets `.fmnr-bar` elements for the `bar-fill` animation.

To edit values later: open the Custom HTML block in **Code Editor view** and update `data-fill` percentages and label text.

---

#### Stat Tile

Use **Essential Blocks → Counter** or **Stackable → Count Up**. Both animate on scroll.

EB Counter configuration:
- Number colour: choose `custom-teal` or `custom-lime` from the palette
- Font: FatFrank
- Enable "Count Up on Scroll"

---

#### Scroll Animation

**No separate block needed.** Apply animations by adding a CSS class to any block via the **Additional CSS class(es)** field.

Available animations (handled by `scroll-animations.js`):

| Animation | Class / attribute needed |
|-----------|------------------------|
| Fade up | class `fmnr-animate`, attribute `data-animate="fade-up"` |
| Stagger children | class `fmnr-animate`, attribute `data-animate="stagger"` |
| Parallax | class `fmnr-animate`, attribute `data-animate="parallax"` |
| Scale in | class `fmnr-animate`, attribute `data-animate="scale-in"` |
| Slide in | class `fmnr-animate`, attribute `data-animate="slide-in"` |
| Bar fill | class `fmnr-animate`, attribute `data-animate="bar-fill"` |
| Count up | handled by EB Counter or `fmnr-stat-number` + JS |

**Problem:** The standard block inspector only accepts CSS class names — not `data-*` attributes. Two solutions:

**Option A — GenerateBlocks Container (already installed, recommended):**
Wrap content in a **GenerateBlocks → Container**. In the Container's **Advanced** tab, add an HTML Attribute:
- Name: `data-animate`
- Value: `fade-up` (or whichever type)

**Option B — Code Editor view:**
Press `Ctrl+Shift+Alt+M` (Mac: `⌘+Shift+Option+M`) to open Code Editor, then manually add `data-animate="fade-up"` to the block's opening tag.

---

#### Timeline

Use `core/html` for pixel-accurate FMNR output. Paste the full timeline markup from `timeline-demo.html`. Ensure the wrapper has class `fmnr-timeline` so `timeline.js` is conditionally enqueued.

Alternatively, **Stackable → Accordion** approximates the layout — override its CSS to match FMNR's timeline style (year + tag + expand/collapse).

---

#### Pillar Card / Numbered Pillars

```
core/group
  class: fmnr-pillar-card
  ├── core/paragraph  (number "01" — FatFrank, large, green)
  ├── core/paragraph  (stat — EB Counter or fmnr-stat-number span)
  ├── core/heading    (H3)
  └── core/paragraph  (body)
```

For the Numbered Pillars pattern, wrap three in `core/columns` (3-col):
```
core/columns (3-col, unwrap on mobile)
  ├── core/column → fmnr-pillar-card
  ├── core/column → fmnr-pillar-card
  └── core/column → fmnr-pillar-card
```

---

#### Award Card

Use **Essential Blocks → Info Box** or **Stackable → Icon Box**. Upload the relevant icon SVG from `/icons/` via Media Library (Safe SVG allows it).

---

#### Media Card

Manual (static content):
```
core/group (class: fmnr-media-card)
  ├── core/image or core/video (thumbnail)
  ├── core/paragraph (style: Tag / Pill)
  └── core/heading (H4)
```

Dynamic (pulls from posts): **Essential Blocks → Post Grid** — configure post type, category filters, and card template.

---

#### Video Controls / Progress Bar / Scroll Hint

These are injected at runtime by `video-hero.js` — not editor-placed blocks.

- **Progress Bar:** `video-hero.js` appends a `<div class="fmnr-progress-bar">` to `<body>` on load and updates its width on scroll.
- **Video Controls:** Injected adjacent to the `<video>` element inside any `core/cover` block that has the class `fmnr-video-hero`.
- **Scroll Hint:** Appended inside any `.fmnr-hero` container.

When building the Hero Video block, add class `fmnr-video-hero` to the outer `core/cover` block so `video-hero.js` knows to target it.

---

### 7C. Block Patterns (Organisms)

Build each pattern in the editor, then save to Templately workspace **FMNR Patterns**. Also register in `functions.php` via `register_block_pattern()` (paste serialised block markup from Code Editor view into the `content` field).

| Pattern | Block composition | Plugin(s) |
|---------|-----------------|-----------|
| **Card Grid** | `core/columns` (1–4 col) → EB Feature Card per col | Essential Blocks |
| **Hero Video** | `core/cover` (video bg, full-height, class `fmnr-video-hero`) → heading + para + buttons | Core |
| **Hero Image** | `core/cover` (image, class `fmnr-ken-burns`) → tag + heading + button | Core |
| **Split Bio** | `core/columns` 2-col → `core/image` + `core/group` (tags + heading + body) | Core |
| **Timeline** | `core/html` (paste from `timeline-demo.html`, class `fmnr-timeline` on wrapper) | Core |
| **Numbered Pillars** | `core/columns` 3-col → `core/group` (fmnr-pillar-card) per col | Core |
| **Awards Grid** | `core/columns` 3-col → EB Info Box or Stackable Icon Box per col | EB or Stackable |
| **Media Grid** | `core/columns` 4-col → `core/group` (image/video + tag + heading) per col | Core |
| **Contact Form** | `core/group` → WPForms block | WPForms Lite |
| **Map Section** | `core/html` (Leaflet map div, class `fmnr-map`) — `map.js` initialises on load | Core |
| **Stat Stack** | `core/columns` → EB Counter per col | Essential Blocks |
| **Search Overlay** | `core/html` (search trigger button) — overlay rendered by `search.js` | Core |
| **Intro Strip** | `core/columns` 2-col → large heading left + body group right | Core |
| **Editorial Band** | `core/cover` (fixed/parallax, class `fmnr-cover--parallax`) → eyebrow + heading + body | Core |
| **Twin Panels** | `core/columns` 2-col → `core/cover` per col (overlay text + tag + link) | Core |
| **Photo Grid** | `core/gallery` 3-col (class `fmnr-photo-grid`) | Core |
| **Hub Section** | `core/columns` 2-col → media + `core/group` (heading + icon list) | Core, Icon Block |
| **Stories Carousel** | **Stackable → Carousel** + FMNR CSS overrides, or `core/html` + `carousel.js` | Stackable |
| **Story Block** | `core/cover` (parallax, `fmnr-cover--parallax`) → `core/quote` + `core/button` | Core |
| **Growth Steps** | `core/columns` 4-col → step number + image + heading + body per col | Core |
| **Newsletter** | `core/group` (centred, bg colour) → heading + para + WPForms or OptinMonster | WPForms / OptinMonster |

---

### 7D. Header & Footer — Template Parts

The site is FSE (block theme). Manage template parts in **Appearance → Editor → Template Parts**.

#### Header

The existing header template part (ID 636 is referenced in EB styles — confirm in **Editor → Template Parts**) should already exist. Modify it to match the FMNR mega menu design:

```
core/group (sticky, z-index:10, white bg)   ← already exists per core-block-supports CSS
  ├── core/site-logo (FMNR SVG)
  ├── core/navigation (main nav)
  └── core/group (right actions — flex-end layout)
        ├── core/search trigger (Custom HTML button)
        └── core/button (style: primary — "Get Involved")
```

**Mega menu:** `core/navigation` cannot natively render icon+description panel menus. Two options:

**Option A — Custom HTML block (no new plugin, recommended to start):**
Replace the `core/navigation` block in the header template part with a Custom HTML block containing the full header + mega menu HTML from `mega-menu-demo.html`. `mega-menu.js` handles all open/close and keyboard interactions. Editors cannot update links via the WP menus admin — a developer must edit the HTML block directly.

**Option B — Use a free mega menu plugin:**
Install **Responsive Menu** (free) or similar. Style its output using classes from `fmnr-blocks.css` to match the three FMNR mega menu layouts. Editors can then manage links via **Appearance → Menus**.

#### Footer

Edit or create the footer template part:

```
core/group  (bg: contrast/#000, class: fmnr-footer)
  core/group  (max-width 1280px, centred)
    core/columns  (4-col desktop, stacked mobile)
      core/group  (logo + tagline)
        core/site-logo
        core/paragraph
      core/group  (nav col 1)
        core/navigation
      core/group  (nav col 2)
        core/navigation
      core/group  (newsletter)
        core/heading
        WPForms block  (email-only form)
    core/group  (bottom bar — flex, space-between)
      core/paragraph  (© copyright)
      core/social-links
```

---

### 7E. Page Templates

Build in the Site Editor (**Appearance → Editor → Templates**) or as full-page Gutenberg content, then save to Templately.

| Page | Template | Block composition summary |
|------|----------|--------------------------|
| **Homepage** | `front-page.html` | Hero Video → Intro Strip → Stat Stack → Card Grid → Story Block → CTA Band |
| **Tony Rinaudo** | Standard page | Hero Image → Split Bio → Timeline → Awards Grid → CTA Band |
| **Resources** | `page-resources.html` or `page-resources.php` | Filter bar + Card Grid. Activate **Document Library Lite** for file listings. |
| **Impact & Evidence** | Standard page | Hero Image → Stat Stack → Bar Charts → Editorial Band → Card Grid |
| **Partner With Us** | Standard page | Hero Image → Numbered Pillars → Media Grid → Contact Form |
| **Blog Listing** | `home.html` | Featured post (`core/cover`) → EB Post Grid |
| **Blog Post** | `single.html` | Hero Image → `core/post-content` → Related (`core/query`) |
| **Search Results** | `search.html` | Search bar → `core/query` loop styled as List Items |

---

## 8. WPForms Lite — Scope & Limits

WPForms Lite (installed) supports:
- ✅ Text, email, textarea, dropdown, checkbox, radio, number fields
- ✅ Honeypot spam protection
- ✅ Email notifications via Post SMTP
- ✅ Gutenberg block embed

Does **not** support (requires WPForms Pro):
- ❌ File upload fields
- ❌ Conditional logic (show/hide fields based on answers)
- ❌ Multi-step forms
- ❌ reCAPTCHA / Cloudflare Turnstile

For the Contact Form pattern (name + email + subject + message), Lite is sufficient. If the Partnership inquiry form needs conditional logic or file uploads, either upgrade to WPForms Pro or install the free **Forminator** plugin.

---

## 9. Map Section Setup

```
core/html
  <div class="fmnr-map" id="fmnr-leaflet-map" style="height: 500px; width: 100%;"></div>
```

`map.js` initialises Leaflet on `#fmnr-leaflet-map`. The `fmnr-map` class in page content triggers conditional Leaflet enqueue (see `functions.php` in Section 6).

Country data is stored in `assets/data/countries.json` and passed to JS via `wp_localize_script` as `fmnrMapData.countriesUrl`.

---

## 10. Templately Workspace

1. **Appearance → Templately → My Templates → Cloud** — create workspace: **FMNR Design System**
2. Invite all content editors
3. Build and save in this order (dependencies first):

| Order | Template | Folder |
|-------|----------|--------|
| 1 | CTA Band | FMNR / Molecules |
| 2 | Pull Quote (cream, teal, orange) | FMNR / Molecules |
| 3 | Card — Image | FMNR / Molecules |
| 4 | Card — Blog | FMNR / Molecules |
| 5 | Card — Icon | FMNR / Molecules |
| 6 | Card — Award | FMNR / Molecules |
| 7 | Card — Horizontal | FMNR / Molecules |
| 8 | Stat Tile | FMNR / Molecules |
| 9 | Stat Stack | FMNR / Patterns |
| 10 | Card Grid | FMNR / Patterns |
| 11 | Hero Video | FMNR / Patterns |
| 12 | Hero Image | FMNR / Patterns |
| 13 | Numbered Pillars | FMNR / Patterns |
| 14 | Editorial Band | FMNR / Patterns |
| 15 | Contact Form | FMNR / Patterns |
| 16 | Newsletter | FMNR / Patterns |
| 17 | Timeline | FMNR / Patterns |
| 18 | Full page — Homepage | FMNR / Pages |
| 19 | Full page — Blog Post | FMNR / Pages |
| 20 | Full page — Resources | FMNR / Pages |
| 21 | Full page — Impact & Evidence | FMNR / Pages |

---

## 11. Custom CSS Classes Reference

Apply via the **Additional CSS class(es)** field in the block inspector sidebar.

| Class | Block | Effect |
|-------|-------|--------|
| `fmnr-heading` | `core/heading` | FatFrank + uppercase |
| `fmnr-body--small` | `core/paragraph` | Smaller body text |
| `fmnr-body--caption` | `core/paragraph` | Caption text |
| `fmnr-ken-burns` | `core/image`, `core/cover` | Pan/zoom animation |
| `fmnr-cover--parallax` | `core/cover` | Fixed-attachment parallax |
| `fmnr-video-hero` | `core/cover` (video) | Signals `video-hero.js` to inject controls |
| `fmnr-pull-quote` | `core/group` | Full-width quote band |
| `fmnr-cta-band` | `core/group` | CTA band layout |
| `fmnr-pillar-card` | `core/group` | Numbered pillar card layout |
| `fmnr-card--horizontal` | `core/group` | Horizontal card layout |
| `fmnr-photo-grid` | `core/gallery` | Hover overlay captions |
| `fmnr-timeline` | `core/html` wrapper | Signals `timeline.js` to load |
| `fmnr-carousel` | `core/html` wrapper | Signals `carousel.js` to load |
| `fmnr-map` | `core/html` | Signals Leaflet + `map.js` to load |
| `fmnr-stat-number` | `<span>` inside `core/html` | Count-up animation target |

---

## 12. Implementation Checklist

### Phase 1 — Environment & Assets (Day 1)

- [ ] **1.1** SSH or SFTP into the server — navigate to `wp-content/themes/fmnr/`
- [ ] **1.2** Create `assets/css/`, `assets/js/`, `assets/icons/`, `assets/images/`, `assets/data/` directories
- [ ] **1.3** Copy assets from repo (see Section 3.3)
- [ ] **1.4** Extract JS from demo HTML files into `assets/js/` (see Section 3.4)
- [ ] **1.5** Add block editor guards to `scroll-animations.js` and other JS files (see Section 3.5)
- [ ] **1.6** Create `assets/css/fmnr-blocks.css` (copy from Section 5)
- [ ] **1.7** Add enqueue code and block style registrations to `functions.php` (Section 6)
- [ ] **1.8** Install **WPCode Lite** and **Icon Block** plugins
- [ ] **1.9** Fix Archivo Black font — copy woff2 to `uploads/fonts/` and update `theme.json` src from the bare IP
- [ ] **1.10** Open `theme.json` — add missing FMNR colour tokens (Section 4.1)
- [ ] **1.11** Verify on front end: open DevTools → check `--wp--preset--color--fmnr-pear` exists in `:root`
- [ ] **1.12** Verify: FatFrank renders on `h1`–`h6` (already configured — check it works)
- [ ] **1.13** Verify: `fmnr-blocks.css` is loading (Network tab)
- [ ] **1.14** Verify: no console errors on homepage

### Phase 2 — Header & Footer (Day 1–2)

- [ ] **2.1** Open **Appearance → Editor → Template Parts** — identify existing header template part
- [ ] **2.2** Choose mega menu approach (Option A: HTML block / Option B: plugin)
- [ ] **2.3** Build header: logo + nav/mega menu + search + CTA button
- [ ] **2.4** Build footer: nav columns + newsletter form + social links + copyright
- [ ] **2.5** Test mega menu: open/close on click, keyboard ESC closes, mobile hamburger works
- [ ] **2.6** Test footer form: submit a test entry, verify email arrives via Post SMTP

### Phase 3 — Molecule Blocks (Day 2–3)

Build, check, save to Templately:

- [ ] **3.1** CTA Band (dark bg + heading + 2 buttons)
- [ ] **3.2** Pull Quote — Cream variant
- [ ] **3.3** Pull Quote — Teal variant
- [ ] **3.4** Card — Image variant (EB Feature Card)
- [ ] **3.5** Card — Blog variant
- [ ] **3.6** Card — Icon variant
- [ ] **3.7** Card — Award variant (Stackable Icon Box)
- [ ] **3.8** Card — Horizontal variant
- [ ] **3.9** Stat Tile (EB Counter — verify count-up fires on scroll)
- [ ] **3.10** Bar Chart (`core/html` paste — verify bar-fill animation)
- [ ] **3.11** Timeline (`core/html` paste — verify expand/collapse, `timeline.js` loads)

### Phase 4 — Patterns (Day 3–4)

- [ ] **4.1** Card Grid (2, 3, 4 column variants)
- [ ] **4.2** Hero Video — verify: video autoplays muted, controls inject, progress bar shows, scroll hint shows
- [ ] **4.3** Hero Image — verify: Ken Burns animation on load
- [ ] **4.4** Stat Stack — verify: count-up fires on scroll into view
- [ ] **4.5** Numbered Pillars
- [ ] **4.6** Awards Grid
- [ ] **4.7** Intro Strip
- [ ] **4.8** Editorial Band — verify: parallax effect on scroll
- [ ] **4.9** Story Block
- [ ] **4.10** Twin Panels
- [ ] **4.11** Photo Grid — verify: caption reveals on hover
- [ ] **4.12** Hub Section
- [ ] **4.13** Growth Steps
- [ ] **4.14** Newsletter section (WPForms or OptinMonster inline form)
- [ ] **4.15** Contact Form section
- [ ] **4.16** Map Section — verify: Leaflet only loads on pages with `fmnr-map` (check homepage Network tab — no Leaflet)
- [ ] **4.17** Search Overlay — verify: overlay opens, results populate, ESC closes
- [ ] **4.18** Stories Carousel — verify: scroll works, prev/next controls respond

### Phase 5 — Page Templates (Day 4–6)

- [ ] **5.1** Homepage — assemble from patterns, check desktop + mobile (390px)
- [ ] **5.2** Tony Rinaudo profile page
- [ ] **5.3** Blog listing page (EB Post Grid — test with real posts)
- [ ] **5.4** Blog post single template (set as default via Site Editor)
- [ ] **5.5** Resources page (activate Document Library Lite if using for downloads)
- [ ] **5.6** Impact & Evidence page
- [ ] **5.7** Partner With Us page
- [ ] **5.8** Search results template

### Phase 6 — QA (Day 6–7)

- [ ] **6.1** All scroll animations fire correctly — none fire inside the WP block editor
- [ ] **6.2** All count-up numbers animate when scrolled into view
- [ ] **6.3** Bar charts animate on scroll
- [ ] **6.4** Timeline accordion expands/collapses correctly
- [ ] **6.5** Carousel scrolls and prev/next controls respond
- [ ] **6.6** Leaflet map loads only on Impact/Resources page — not on homepage (confirm via Network tab)
- [ ] **6.7** All WPForms submissions trigger email notification — check Post SMTP → Email Log
- [ ] **6.8** FatFrank loads on all pages (check `/wp-content/uploads/fonts/fatfrank.otf` in Network tab)
- [ ] **6.9** Archivo Black loads from correct path (not bare IP `54.252.190.200`)
- [ ] **6.10** Mobile: all patterns responsive at 390px — no horizontal scroll
- [ ] **6.11** No console errors on any page
- [ ] **6.12** All Templately patterns saved and shared to FMNR workspace

---

## 13. Known Complexity Areas

| Area | Issue | Resolution |
|------|-------|-----------|
| **Mega Menu** | `core/navigation` doesn't support icon+description panels | Option A: `core/html` block (no new plugin). Option B: free mega menu plugin with FMNR CSS override. |
| **Bar Chart** | No plugin equivalent | `core/html` paste — editors must use Code Editor view to change values. |
| **Timeline** | No plugin that matches FMNR design exactly | `core/html` paste. Stackable Accordion as a fallback with CSS overrides. |
| **`data-animate` attribute** | Block inspector only accepts CSS classes | Use GenerateBlocks Container HTML Attributes field, or Code Editor view. |
| **Video Hero controls** | `core/cover` doesn't expose native play/pause | `video-hero.js` injects controls — verify it targets `.wp-block-cover video` correctly after render. |
| **Archivo Black loading from bare IP** | Will break if server IP changes | Copy font file to `uploads/fonts/` and update `theme.json` font src immediately. |
| **Stories Carousel** | Stackable Carousel may need CSS overrides for progress bar + custom controls | Start with Stackable; fall back to `core/html` + `carousel.js` if controls don't match. |
| **Resources page filtering** | No FacetWP installed | Use Document Library Lite (activate it) for file-based listings, or build a custom REST API + JS filter. |
| **WPForms Lite limits** | No file uploads or conditional logic | Upgrade to Pro or swap in free Forminator plugin for complex forms. |
| **Decision Tree** | Multi-file interactive JS requiring Backbone.js + underscore.js | Embed as `<iframe>` in a `core/html` block pointing to the standalone decision tree HTML page. |
| **Animations in editor** | `scroll-animations.js` must not run inside the block editor | Guard all IntersectionObserver init with the `block-editor-page` class check (Section 3.5). |
