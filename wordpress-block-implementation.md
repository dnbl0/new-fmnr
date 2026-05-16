# WordPress Block Implementation Requirements
## FMNR Design System → fmnrhub.com.au (Gutenberg + Templately)

This document outlines everything needed to apply the blocks defined in `components.html` to the existing WordPress site at fmnrhub.com.au, based on the **confirmed installed plugin stack**.

---

## 1. Confirmed Plugin Stack & Roles

The following plugins are already installed. This document is written against this stack — no additional paid plugins are assumed.

| Plugin | Status | Role in this project |
|--------|--------|----------------------|
| **Gutenberg** (core) | Active | Block editor foundation |
| **Templately** 3.5.2 | Active | Save/share/reuse block patterns and full-page templates |
| **Essential Blocks** 6.0.6 | Active | Provides ~70 ready-made blocks — covers many molecule and organism needs |
| **GenerateBlocks** 2.2.1 | Active | Lightweight layout primitives (Container, Grid, Text, Image, Button) |
| **Stackable** 3.19.7 | Active | Advanced block library — columns, carousels, accordions, count-up, image boxes |
| **WPForms Lite** 1.10.0.2 | Active | Contact Form block (Lite: limited to basic fields, no conditional logic) |
| **Safe SVG** 2.4.0 | Active | SVG uploads allowed and sanitised — enables direct use of icon SVG files |
| **FileBird Lite** 6.4.9 | Active | Media folder organisation |
| **All in One SEO** 4.9.5.1 | Active | SEO metadata for all templates |
| **MonsterInsights** 10.1.3 | Active | Google Analytics |
| **Post SMTP** 3.9.1 | Active | Transactional email (WPForms submissions, newsletters) |
| **OptinMonster** 2.16.22 | Active | Newsletter pop-ups / inline sign-up forms |
| **Genesis Blocks** 3.1.8 | Inactive | Not needed — Essential Blocks + Stackable cover the same ground |
| **Twentig** 2.0 | Inactive | Can activate if additional core block enhancements are needed |
| **FMNR Resource Library (x3)** | Inactive | Legacy custom plugins — superseded by this design system |
| **Document Library Lite** | Inactive | May be useful for Resources page file downloads if needed |

### Plugins NOT installed that were assumed in a prior draft

- ~~ACF Pro~~ — **not installed**. All custom blocks are implemented using **Essential Blocks**, **GenerateBlocks**, **Stackable**, or `core/html` Custom HTML blocks instead. No ACF block registration is required.
- ~~Contact Form 7~~ — **not installed**. Use **WPForms Lite** (already active).
- ~~FacetWP~~ — not installed. Resources page filtering uses custom JS + WordPress REST API, or OptinMonster for email capture, or Document Library Lite for file listings.
- ~~Max Mega Menu~~ — not installed. See Section 3D for mega menu approach.
- ~~Yoast / RankMath~~ — **All in One SEO** already covers this.

### Plugins to add (free, recommended)

| Plugin | Why | Where to get |
|--------|-----|-------------|
| **WPCode Lite** | Inject global CSS/JS (design-tokens, scroll-animations) without editing theme files | wordpress.org/plugins/insert-headers-and-footers |
| **Icon Block** (Nick Diego) | Provides a proper SVG icon block in the editor — works with Safe SVG uploads | wordpress.org/plugins/icon-block |

---

## 2. Theme Requirements

- The current theme must support the **block editor** (Gutenberg). If it is a **classic theme**, the Site Editor (FSE) Template Parts for Header and Footer will not be available — those must be managed via `functions.php` and PHP template files instead.
- A **child theme** is strongly recommended so that `theme.json`, `functions.php`, and asset files survive theme updates.
- The theme must **not** apply global font-family or colour overrides that conflict with FMNR tokens — audit `style.css` for any `body`, `h1`–`h6`, or `a` rules that would need to be removed or scoped.
- **Twentig** (currently inactive) can be activated to enhance core block styling without PHP — useful as a zero-code styling layer. Activate it if fine-grained core block customisation is needed.

---

## 3. Design Tokens → theme.json

Add or update `theme.json` in the child theme root to register FMNR design tokens natively in Gutenberg's colour, typography, and spacing pickers. This locks editors to on-brand values.

```json
{
  "version": 3,
  "settings": {
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
        { "slug": "heading", "fontFamily": "fatfrank, sans-serif", "name": "FatFrank (Heading)" },
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
        { "slug": "sm", "size": "8px",  "name": "SM" },
        { "slug": "md", "size": "16px", "name": "MD" },
        { "slug": "lg", "size": "32px", "name": "LG" },
        { "slug": "xl", "size": "64px", "name": "XL" }
      ]
    }
  },
  "styles": {
    "typography": {
      "fontFamily": "var(--wp--preset--font-family--body)",
      "fontSize": "var(--wp--preset--font-size--base)"
    }
  }
}
```

---

## 4. Asset Deployment

Place all FMNR assets in the child theme. If a child theme is not yet set up, use **WPCode Lite** to inject the CSS/JS globally as an alternative.

```
/wp-content/themes/fmnr-child/
  theme.json
  functions.php
  style.css
  assets/
    css/
      design-tokens.css     ← copy from repo root
      styles.css            ← copy from repo root
      decision-tree.css     ← copy from repo root
    js/
      scroll-animations.js  ← extract from scroll-animations-demo.html
      timeline.js           ← extract from timeline-demo.html
      carousel.js           ← extract from stories-carousel-demo.html
      map.js                ← extract from map-demo.html
      mega-menu.js          ← extract from mega-menu-demo.html
      search.js             ← extract from search-demo.html
      video-hero.js         ← extract from video-hero-demo.html
      decision-trees-part-1-main.js
      decision-trees-part-1-helpers.js
      decision-trees-part-1-rAF-polyfill.js
    icons/                  ← copy /icons/ directory from repo
    images/                 ← copy /images/ directory from repo
```

### functions.php enqueue

```php
function fmnr_enqueue_assets() {
    wp_enqueue_style( 'fmnr-tokens', get_stylesheet_directory_uri() . '/assets/css/design-tokens.css' );
    wp_enqueue_style( 'fmnr-styles', get_stylesheet_directory_uri() . '/assets/css/styles.css', ['fmnr-tokens'] );
    wp_enqueue_script( 'fmnr-animations', get_stylesheet_directory_uri() . '/assets/js/scroll-animations.js', [], null, true );
    wp_enqueue_script( 'fmnr-mega-menu',  get_stylesheet_directory_uri() . '/assets/js/mega-menu.js', [], null, true );
    wp_enqueue_script( 'fmnr-search',     get_stylesheet_directory_uri() . '/assets/js/search.js', [], null, true );
    wp_enqueue_script( 'fmnr-video-hero', get_stylesheet_directory_uri() . '/assets/js/video-hero.js', [], null, true );
}
add_action( 'wp_enqueue_scripts', 'fmnr_enqueue_assets' );

// Adobe Typekit — FatFrank font
add_action( 'wp_head', function() {
    echo '<link rel="stylesheet" href="https://use.typekit.net/ajf0nww.css">';
}, 1 );

// Leaflet — only on pages with the map section
add_action( 'wp_enqueue_scripts', function() {
    if ( is_page() && has_shortcode( get_post()->post_content, 'fmnr_map' ) ) {
        wp_enqueue_style(  'leaflet', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', [], '1.9.4' );
        wp_enqueue_script( 'leaflet', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', [], '1.9.4', true );
        wp_enqueue_script( 'fmnr-map', get_stylesheet_directory_uri() . '/assets/js/map.js', ['leaflet'], null, true );
    }
} );

// Conditional: timeline JS only on pages that use it
add_action( 'wp_enqueue_scripts', function() {
    if ( is_page() && strpos( get_post()->post_content, 'fmnr-timeline' ) !== false ) {
        wp_enqueue_script( 'fmnr-timeline', get_stylesheet_directory_uri() . '/assets/js/timeline.js', [], null, true );
    }
} );

// Conditional: carousel JS
add_action( 'wp_enqueue_scripts', function() {
    if ( is_page() && strpos( get_post()->post_content, 'fmnr-carousel' ) !== false ) {
        wp_enqueue_script( 'fmnr-carousel', get_stylesheet_directory_uri() . '/assets/js/carousel.js', [], null, true );
    }
} );
```

---

## 5. Block-by-Block Implementation

### 5A. Core Blocks (Atoms)

All map to native Gutenberg `core/*` blocks. FMNR styling is applied via `theme.json` token registration and CSS class overrides in `styles.css`.

| Block | Gutenberg Block | Plugin | Implementation Notes |
|-------|----------------|--------|----------------------|
| **Heading** | `core/heading` | Core | Font family set to FatFrank via `theme.json`. Add CSS class `fmnr-heading` for uppercase + clamp sizing. |
| **Body Text** | `core/paragraph` | Core | Lato applied globally via `theme.json` body typography. Use classes `fmnr-body--small`, `fmnr-body--caption` for variants. |
| **Button** | `core/button` | Core | Register block styles `primary`, `secondary`, `ghost` in `functions.php` via `register_block_style()`. Style in `styles.css`. |
| **Icon** | **Icon Block** plugin | Icon Block (free, install) | Upload SVG files from `/icons/` via Media Library (Safe SVG is active — SVGs are allowed). The Icon Block provides a picker UI. Alternatively use `core/html` with inline SVG. |
| **Image** | `core/image` | Core | Add class `fmnr-ken-burns` for Ken Burns animation. `scroll-animations.js` handles it via IntersectionObserver. |
| **Video** | `core/video` | Core | Attributes: `autoplay`, `muted`, `loop`, `playsinline`. Add class `fmnr-video`. |
| **Tag** | `core/paragraph` with style | Core | Register a block style `fmnr-tag` for `core/paragraph` via `register_block_style()`. Pill appearance in `styles.css`. |
| **Stat Number** | **Essential Blocks → Counter** | Essential Blocks | Provides animated count-up natively. Style `.eb-counter-wrapper` in `styles.css` to match FMNR Stat Number design. Or use `core/html` with `<span class="fmnr-stat-number" data-target="…">` and handle via `scroll-animations.js`. |
| **Divider** | `core/separator` | Core | Register block styles `green`, `orange` via `register_block_style()`. CSS in `styles.css`. |
| **Spacer** | `core/spacer` | Core | Token heights available in `theme.json` spacing. |
| **Form Field** | **WPForms Lite** field | WPForms Lite | WPForms Lite supports: text, email, textarea, dropdown, checkbox. Style `.wpforms-field` in `styles.css` to match FMNR form field design. Note: WPForms Lite does **not** support multi-page forms, conditional logic, or file uploads — upgrade to Pro if needed. |
| **List Item** | `core/list` / `core/list-item` | Core | Add class `fmnr-list-item`. For icon list items, use **GenerateBlocks → Icon** within a list container. |

### Block Style Registration (functions.php)

```php
add_action( 'init', function() {
    // Button variants
    register_block_style( 'core/button', [ 'name' => 'primary',   'label' => 'Primary (Green)' ] );
    register_block_style( 'core/button', [ 'name' => 'secondary', 'label' => 'Secondary (Outline)' ] );
    register_block_style( 'core/button', [ 'name' => 'ghost',     'label' => 'Ghost' ] );
    // Divider variants
    register_block_style( 'core/separator', [ 'name' => 'green',  'label' => 'Green' ] );
    register_block_style( 'core/separator', [ 'name' => 'orange', 'label' => 'Orange' ] );
    // Tag on paragraph
    register_block_style( 'core/paragraph', [ 'name' => 'fmnr-tag', 'label' => 'Tag / Pill' ] );
});
```

---

### 5B. Custom Blocks (Molecules)

No ACF Pro is available. Each block is implemented using the installed plugin stack or `core/html`.

| Block | Plugin / Approach | Notes |
|-------|------------------|-------|
| **Pull Quote** | **Stackable → Blockquote** or `core/quote` + `core/group` | Full-width coloured band. Use a `core/group` with background colour token, containing a `core/quote`. Style `.wp-block-quote.fmnr-pull-quote` in `styles.css`. |
| **CTA Band** | **GenerateBlocks → Container + Grid** or `core/group` | Dark background group with heading, paragraph, and two `core/button` blocks. Save as a Templately pattern. |
| **Card** | **Essential Blocks → Feature Card** or **Stackable → Image Box** | Map each card variant (image/video/icon/blog/podcast/award/horizontal) to an EB or Stackable block style. Save variants to Templately. |
| **Bar Chart** | `core/html` (Custom HTML) | Render FMNR bar chart HTML directly. Paste markup from `bar-chart-demo.html`. `scroll-animations.js` handles bar-fill animation. This block is not editable via the UI — update figures by editing the HTML block. |
| **Stat Tile** | **Essential Blocks → Counter** or **Stackable → Count Up** | Both provide animated number count-up. Style wrapper to match FMNR Stat Tile. |
| **Nav Item** | Part of Header Template Part — not a page block | Icon + title + description links live inside the mega menu structure. See Section 5D. |
| **Scroll Animation** | CSS class + `scroll-animations.js` | Apply the relevant class (`fmnr-animate`, `data-animate="fade-up"` etc.) to any block via the **Additional CSS class** field in the block inspector. No separate block needed. |
| **Timeline Entry** | `core/html` or **Stackable → Accordion** | For a fully FMNR-styled accordion timeline, paste markup from `timeline-demo.html` into a `core/html` block. `timeline.js` handles expand/collapse. Alternatively, Stackable Accordion can approximate the layout with custom CSS. |
| **Pillar Card** | **Essential Blocks → Feature List** or `core/group` | Numbered card with stat + heading + body. Use a `core/group` with a manually typed number heading + EB Counter + paragraph. Save as a Templately pattern. |
| **Award Card** | **Essential Blocks → Info Box** or **Stackable → Icon Box** | Icon badge + heading + description. Both plugins have native icon+text block types. |
| **Search Result** | WordPress search template PHP | Style `search.php` / `searchform.php` to output `fmnr-search-result`-classed markup. Not editor-placed. |
| **Media Card** | **Essential Blocks → Post Grid** (for auto-populated) or `core/group` (manual) | Video/image thumbnail + heading + tag. EB Post Grid handles dynamic content. For manual cards, use a `core/group` with `core/image`/`core/video` + `core/paragraph` (tag style) + `core/heading`. |
| **Video Controls** | `core/html` + `video-hero.js` | Play/pause and mute buttons injected by `video-hero.js` after page load alongside the hero cover block. Not editor-placed. |
| **Progress Bar** | Theme JS (no block needed) | Fixed scroll-progress `<div>` injected via `wp_footer` hook in `functions.php`. |
| **Scroll Hint** | `core/html` | Paste the animated chevron HTML from `video-hero-demo.html` into a Custom HTML block. Save to Templately for reuse. |

---

### 5C. Block Patterns (Organisms)

Build each pattern in the editor using the blocks listed, then:
1. Select the outermost `core/group` or `generateblocks/container`.
2. Click the three-dot menu → **Create pattern** (WordPress 6.3+) or **Save to Templately**.
3. Store all patterns in a Templately workspace folder named **FMNR Patterns**.

Register patterns in code so they appear in the **Patterns** inserter tab:

```php
// functions.php
register_block_pattern_category( 'fmnr', [ 'label' => 'FMNR' ] );
```

Each serialised pattern can then be registered with `register_block_pattern()` once built in the editor and copied from the Code Editor view.

| Pattern | Block Composition | Plugin(s) Used |
|---------|------------------|---------------|
| **Card Grid** | `core/group` → `core/columns` (1–4 col) → EB Feature Card per column | Essential Blocks, Core |
| **Hero Video** | `core/cover` (video bg, full-height) → `core/group` (heading + paragraph + button) | Core |
| **Hero Image** | `core/cover` (image bg, full-height, class `fmnr-ken-burns`) → eyebrow tag + heading + button | Core |
| **Split Bio** | `core/columns` (2-col) → `core/image` (col 1) + `core/group` (tag + heading + body) (col 2) | Core |
| **Timeline** | `core/html` (full timeline markup from `timeline-demo.html`) | Core (`core/html`) |
| **Numbered Pillars** | `core/columns` (3-col) → each col: `core/group` (number heading + EB Counter + paragraph) | Core, Essential Blocks |
| **Awards Grid** | `core/columns` (3-col) → EB Info Box or Stackable Icon Box per col | Essential Blocks or Stackable |
| **Media Grid** | `core/columns` (4-col) → `core/group` per col (image/video + heading + tag) | Core |
| **Contact Form** | `core/group` → `core/columns` → WPForms block | WPForms Lite, Core |
| **Map Section** | `core/html` (Leaflet map markup) + `map.js` | Core (`core/html`) |
| **Stat Stack** | `core/group` → `core/columns` → EB Counter per col | Essential Blocks, Core |
| **Search Overlay** | `core/html` (search trigger button) — overlay rendered by `search.js` | Core (`core/html`) |
| **Intro Strip** | `core/columns` (2-col) → `core/heading` (large display, left) + `core/group` (body copy, right) | Core |
| **Editorial Band** | `core/cover` (full-bleed, parallax/fixed, class `fmnr-cover--parallax`) → eyebrow + heading + paragraph | Core |
| **Twin Panels** | `core/columns` (2-col) → each: `core/cover` (image + overlay tag + heading + button) | Core |
| **Photo Grid** | `core/gallery` (3-col, class `fmnr-photo-grid`) — overlay captions via CSS `:hover` | Core |
| **Hub Section** | `core/columns` (2-col) → `core/video`/`core/image` (col 1) + `core/group` (heading + icon list) (col 2) | Core, Icon Block |
| **Stories Carousel** | **Stackable → Carousel** or `core/html` (carousel markup) + `carousel.js` | Stackable or Core |
| **Story Block** | `core/cover` (full-bleed, class `fmnr-cover--parallax`) → `core/quote` + `core/button` | Core |
| **Growth Steps** | `core/columns` (4-col) → each: `core/group` (step number + `core/image` illustration + heading + body) | Core |
| **Newsletter** | `core/group` (centred, bg colour) → heading + paragraph + **WPForms** block (email field only) or **OptinMonster** inline form | WPForms Lite or OptinMonster, Core |

---

### 5D. Template Parts

For **block themes (FSE)**: manage in **Appearance → Editor → Template Parts**.
For **classic themes**: create PHP template files and call via `get_template_part()`.

#### Header

Build in the Site Editor as `header.html` (block theme) or `header.php` (classic):

```
core/group (sticky header, white bg, FMNR header classes)
  ├── core/site-logo (FMNR SVG logo — /fmnr-logo.svg)
  ├── core/navigation (main nav — see mega menu note below)
  └── core/group (right actions)
        ├── core/search (or custom HTML search trigger button)
        └── core/button (style: primary — "Get Involved" CTA)
```

**Mega Menu — the key constraint:** `core/navigation` does **not** natively support mega menu panels with icon+title+description nav items. With the current plugin stack, the two options are:

**Option A (recommended — no new plugins):** Build the mega menu as a `core/html` Custom HTML block inside the header template part, using the full HTML from `mega-menu-demo.html`. Style is already defined in `styles.css`. `mega-menu.js` handles open/close and keyboard navigation. This is the lowest-effort approach but the menu must be maintained in HTML rather than the WP menu admin.

**Option B (editor-friendly):** Install the free **Responsive Menu** or **WP Responsive Menu** plugin, configure it to match the FMNR mega menu layouts (Standard 3-col, Compact List, Immersive Dark), and override its output CSS with FMNR tokens. This allows non-technical editors to manage the menu via **Appearance → Menus**.

#### Footer

Build in the Site Editor as `footer.html` or `footer.php`:

```
core/group (dark bg — #000 or charcoal token)
  ├── core/columns
  │     ├── core/group (logo + tagline)
  │     ├── core/navigation (footer links col 1)
  │     ├── core/navigation (footer links col 2)
  │     └── core/group (newsletter WPForms or OptinMonster)
  └── core/group (bottom bar)
        ├── core/paragraph (copyright)
        └── core/social-links
```

---

### 5E. Page Templates

Build as full-page Gutenberg content, or register as Site Editor templates (`front-page.html`, `single.html`, etc.). Save completed pages to Templately as full-page templates.

| Template | WordPress Template File | Block Composition |
|----------|------------------------|-------------------|
| **Homepage** | `front-page.html` | Hero Video → Intro Strip → Stat Stack → Card Grid → Editorial Band → Story Block → CTA Band |
| **Tony Rinaudo** | Custom page (no template file needed) | Hero Image → Split Bio → Timeline → Awards Grid → CTA Band |
| **Resources** | `page-resources.php` or custom page | Filter bar (custom JS + REST API, or Document Library Lite) + Card Grid + Pagination |
| **Impact & Evidence** | Custom page | Hero Image → Stat Stack → Bar Charts (`core/html`) → Editorial Band → Card Grid |
| **Partner With Us** | Custom page | Hero Image → Numbered Pillars → Stat Stack → Media Grid → Contact Form |
| **Blog Listing** | `home.html` or `index.html` | Featured post (`core/cover`) → EB Post Grid (auto-populated) |
| **Blog Post (Single)** | `single.html` | Hero Image → `core/post-content` → Related posts (`core/query`) |
| **Search Results** | `search.html` | Search bar → `core/query` (search results loop styled as List Items) |

---

## 6. Templately Workspace Setup

1. Go to **Templately → My Cloud** and create a workspace named **FMNR Design System**.
2. Invite all site editors to the workspace (Templately allows team sharing).
3. Save templates in this order (dependencies first):

| Priority | What to save | Templately folder |
|----------|-------------|-------------------|
| 1 | CTA Band | FMNR / Molecules |
| 2 | Pull Quote | FMNR / Molecules |
| 3 | Card (each variant) | FMNR / Molecules |
| 4 | Stat Stack | FMNR / Patterns |
| 5 | Card Grid | FMNR / Patterns |
| 6 | Hero Video | FMNR / Patterns |
| 7 | Hero Image | FMNR / Patterns |
| 8 | Numbered Pillars | FMNR / Patterns |
| 9 | Editorial Band | FMNR / Patterns |
| 10 | Newsletter | FMNR / Patterns |
| 11 | Contact Form section | FMNR / Patterns |
| 12 | Full page — Homepage | FMNR / Pages |
| 13 | Full page — Blog Post | FMNR / Pages |
| 14 | Full page — Resources | FMNR / Pages |

---

## 7. Custom CSS Classes Reference

These classes are defined in `styles.css` and triggered by adding them to any block's **Additional CSS class** field in the block inspector.

| CSS Class | Block(s) | Effect |
|-----------|---------|--------|
| `fmnr-heading` | `core/heading` | FatFrank font, uppercase, token sizing |
| `fmnr-body--small` | `core/paragraph` | Small body text variant |
| `fmnr-body--caption` | `core/paragraph` | Caption text variant |
| `fmnr-tag` | `core/paragraph` | Pill / category label |
| `fmnr-ken-burns` | `core/image`, `core/cover` | Ken Burns pan/zoom animation |
| `fmnr-animate` | Any block | Enable scroll animation — also add `data-animate` attr via `core/html` wrapper |
| `data-animate="fade-up"` | Group/Container | Fade up on scroll |
| `data-animate="stagger"` | Columns/Grid | Stagger child elements |
| `data-animate="parallax"` | Cover blocks | Parallax scroll |
| `data-animate="scale-in"` | Any block | Scale in on scroll |
| `data-animate="count-up"` | Stat number | Trigger count-up JS |
| `data-animate="bar-fill"` | Bar chart rows | Animate bar widths |
| `fmnr-cover--parallax` | `core/cover` | CSS fixed-attachment parallax |
| `fmnr-photo-grid` | `core/gallery` | Hover overlay captions |
| `fmnr-pull-quote` | `core/quote`, `core/group` | Full-width quote band |
| `fmnr-card--horizontal` | Card group | Horizontal card layout |
| `fmnr-divider--green` | `core/separator` | Green coloured divider |
| `fmnr-divider--orange` | `core/separator` | Orange coloured divider |

**How to add `data-animate` without a plugin:** The `data-animate` attribute cannot be added via the standard block inspector (it only exposes CSS classes). Options:
- Use the **Code Editor** view (`Ctrl+Shift+Alt+M`) to manually add the attribute to the block's wrapper HTML.
- Or wrap content in a `core/html` block that outputs the correct attribute.
- Or use **GenerateBlocks → Container** which allows arbitrary HTML attributes via its inspector.

---

## 8. Fonts & Licensing

| Font | Licence | Action Required |
|------|---------|----------------|
| **FatFrank** | Adobe Typekit — requires an active Creative Cloud licence | Log in to [fonts.adobe.com](https://fonts.adobe.com), open kit `ajf0nww`, and add `fmnrhub.com.au` and `www.fmnrhub.com.au` to the **Allowed Domains** list. Without this the font will not load on the live domain. |
| **Lato** | Google Fonts — free, no action needed | Loaded via `@import` in `design-tokens.css` |

---

## 9. WPForms Lite Constraints

WPForms Lite (the installed version) supports:
- ✅ Text, email, number, textarea, dropdown, checkbox, radio fields
- ✅ Basic spam protection (honeypot)
- ✅ Email notifications on submission
- ✅ WPForms Gutenberg block for embedding forms

It does **not** support (requires WPForms Pro):
- ❌ Conditional logic (show/hide fields based on input)
- ❌ File upload fields
- ❌ Multi-page forms
- ❌ Payment fields
- ❌ Advanced anti-spam (CAPTCHA, turnstile)

For the **Contact Form** pattern (name + email + subject + message), WPForms Lite is sufficient. If the Partnership inquiry form requires more complex logic, upgrade to WPForms Pro or replace with a free alternative like **Forminator**.

---

## 10. Implementation Sequence

1. **Child theme** — create child theme with `style.css`, `functions.php`, `theme.json`. Confirm parent theme is block-editor compatible.
2. **Adobe Fonts** — add `fmnrhub.com.au` to the Typekit kit `ajf0nww` allowed domains.
3. **Deploy assets** — copy `design-tokens.css`, `styles.css`, extracted JS files, `/icons/`, `/images/` into the child theme `/assets/` directory.
4. **Enqueue** — add `fmnr_enqueue_assets()` and Typekit `wp_head` hook to `functions.php`.
5. **theme.json** — add colour palette, font families, font sizes, and spacing tokens.
6. **Block styles** — register button, divider, and tag styles via `register_block_style()` in `functions.php`.
7. **Install Icon Block plugin** — upload FMNR SVGs to Media Library; confirm Safe SVG allows them.
8. **WPCode Lite** — install as a fallback CSS/JS injection method if child theme enqueue is problematic.
9. **Build Template Parts** — Header (with mega menu via Option A or B) and Footer in Site Editor.
10. **Build and save molecules** — Pull Quote, CTA Band, Card variants, Stat Tile, etc. → save to Templately workspace.
11. **Build and save patterns** — Card Grid, Hero sections, Stat Stack, Timeline, Carousels, etc. → save to Templately.
12. **Build page templates** — Homepage first, then Blog, Resources, Impact, Partner, Blog Post.
13. **Verify animations** — scroll-triggered animations, count-up, carousel, timeline accordion, map on staging.
14. **Editor handover** — share Templately workspace; brief editors on which patterns to use for each content type.

---

## 11. Known Complexity Areas

| Area | Risk | Recommended Approach |
|------|------|---------------------|
| **Mega Menu** | `core/navigation` does not support icon+desc nav items natively | Option A: `core/html` block with full menu markup + `mega-menu.js`. Option B: install a free mega menu plugin. |
| **Bar Chart** | No plugin equivalent in the current stack | Use `core/html` with pasted markup. Not live-editable by editors — must be updated in Code Editor view. |
| **Timeline** | Stackable Accordion approximates it but requires CSS to match FMNR design | Use `core/html` with full timeline markup for pixel-accurate output. |
| **Map Section** | Requires Leaflet JS and a country data source | Render via `core/html`; store country data as a JSON file in the theme or as a WordPress option. |
| **Stories Carousel** | Stackable Carousel covers basic carousel; complex progress bar + controls need custom CSS | Start with Stackable Carousel; apply FMNR CSS overrides. If insufficient, use `core/html` with carousel markup. |
| **Video Hero** | `core/cover` supports video backgrounds but not native play/pause controls | `video-hero.js` injects controls after page load by targeting the cover block's video element. |
| **Resources Filter UI** | FacetWP is not installed; WP query filtering requires a solution | Option A: use **Document Library Lite** (already installed, inactive) for file listings with search. Option B: custom REST API endpoint + JS filter (matches the existing `resources.html` design). |
| **Scroll Animation data attributes** | Can't add `data-animate` via standard block inspector | Use GenerateBlocks Container (supports custom attributes) or Code Editor view. |
| **Decision Tree** | Complex multi-file interactive JS tool | Embed as a standalone page loaded in an `<iframe>` via a `core/html` block. All three JS files are already in the repo. |
| **`data-animate` in editor** | Animations fire in the editor context if JS is loaded globally | Guard all `IntersectionObserver` init with `if ( ! document.body.classList.contains('wp-admin') )` check in `scroll-animations.js`. |
