# WordPress Block Implementation Requirements
## FMNR Design System → fmnrhub.com.au (Gutenberg + Templately)

This document outlines everything needed to apply the blocks defined in `components.html` to the existing WordPress site at fmnrhub.com.au, which uses Gutenberg and Templately.

---

## 1. Pre-requisites & Environment

### WordPress Plugins Required

| Plugin | Purpose | Priority |
|--------|---------|----------|
| **Templately** (existing) | Save/reuse block patterns as templates | Required |
| **Advanced Custom Fields Pro (ACF Pro)** | Custom field groups for block data | Required |
| **Gutenberg** (core, already active) | Block editor | Required |
| **WPCode** (or Code Snippets) | Inject global CSS/JS without theme edits | Required |
| **Contact Form 7** or **WPForms** | Contact Form block backend | Required |
| **Leaflet Maps** or **Maps Block for Google Maps** | Interactive map block | Required |
| **Yoast SEO** or **RankMath** | SEO meta for templates | Recommended |

### Theme Requirements

- Use a **block theme** (FSE-compatible) — e.g. Twenty Twenty-Four, or a custom child theme — so Template Parts (Header, Footer) can be managed in the Site Editor.
- If the current theme is a classic theme, a **hybrid approach** is needed: register template parts via `theme.json` and use `get_template_part()` calls.
- The theme must **not** override core block styles in a way that conflicts with FMNR tokens.

### Assets to Deploy

All files from this repository must be accessible from the WordPress theme or a child theme directory:

```
/wp-content/themes/fmnr-child/
  assets/
    css/
      design-tokens.css   ← copy from repo
      styles.css          ← copy from repo
      decision-tree.css   ← copy from repo
    js/
      scroll-animations.js (extract from demo files)
      decision-trees-part-1-main.js
      decision-trees-part-1-helpers.js
      decision-trees-part-1-rAF-polyfill.js
    fonts/                ← FatFrank (via Adobe Typekit — licence required)
    icons/                ← copy /icons/ directory from repo
    images/               ← copy /images/ directory from repo
```

Enqueue in `functions.php`:

```php
function fmnr_enqueue_assets() {
    wp_enqueue_style( 'fmnr-tokens', get_stylesheet_directory_uri() . '/assets/css/design-tokens.css' );
    wp_enqueue_style( 'fmnr-styles', get_stylesheet_directory_uri() . '/assets/css/styles.css', ['fmnr-tokens'] );
    wp_enqueue_script( 'fmnr-animations', get_stylesheet_directory_uri() . '/assets/js/scroll-animations.js', [], null, true );
}
add_action( 'wp_enqueue_scripts', 'fmnr_enqueue_assets' );
```

Add Typekit font in `<head>` via `wp_head` hook or `theme.json` typography settings:

```php
add_action( 'wp_head', function() {
    echo '<link rel="stylesheet" href="https://use.typekit.net/ajf0nww.css">';
});
```

---

## 2. Design Tokens → theme.json

Register FMNR design tokens in `theme.json` so they are available natively in Gutenberg's color, typography, and spacing pickers. This prevents editors from picking off-brand values.

```json
{
  "version": 3,
  "settings": {
    "color": {
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
        { "slug": "heading", "fontFamily": "fatfrank, sans-serif",                          "name": "FatFrank (Heading)" },
        { "slug": "body",    "fontFamily": "Lato, Helvetica Neue, Helvetica, Arial, sans-serif", "name": "Lato (Body)" }
      ],
      "fontSizes": [
        { "slug": "xs",   "size": "12px", "name": "XS" },
        { "slug": "sm",   "size": "14px", "name": "SM" },
        { "slug": "base", "size": "16px", "name": "Base" },
        { "slug": "lg",   "size": "20px", "name": "LG" },
        { "slug": "xl",   "size": "24px", "name": "XL" },
        { "slug": "h6",   "size": "22px", "name": "H6" },
        { "slug": "h5",   "size": "28px", "name": "H5" },
        { "slug": "h4",   "size": "36px", "name": "H4" },
        { "slug": "h3",   "size": "48px", "name": "H3" },
        { "slug": "h2",   "size": "56px", "name": "H2" },
        { "slug": "h1",   "size": "72px", "name": "H1" },
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
  }
}
```

---

## 3. Block-by-Block Implementation

Each block is listed under its category, with the recommended Gutenberg implementation approach.

---

### 3A. Core Blocks (Atoms)

These map directly to native Gutenberg core blocks. Apply FMNR CSS classes and token values — no custom PHP blocks needed.

| Block | Gutenberg Core Block | Implementation Notes |
|-------|---------------------|----------------------|
| **Heading** | `core/heading` | Set font family to FatFrank via `theme.json`. Use `clamp()` sizes via Additional CSS Class `fmnr-heading`. Text-transform uppercase applied in `styles.css`. |
| **Body Text** | `core/paragraph` | Lato font applied globally. Add classes `fmnr-body`, `fmnr-body--small`, `fmnr-body--caption` for variants. |
| **Button** | `core/button` | Register three styles in `theme.json` styles: `primary` (green fill), `secondary` (outline), `ghost` (transparent). Override via `.wp-block-button.is-style-primary` etc. in `styles.css`. |
| **Icon** | `core/html` (Custom HTML) or SVG Media | Inline SVG block. Use the `/icons/` directory SVG files. Consider a lightweight icon block plugin (e.g. Icon Block by Nick Diego) for editor UX. |
| **Image** | `core/image` | Add `fmnr-ken-burns` class for Ken Burns animation. Handled in `scroll-animations.js`. |
| **Video** | `core/video` | Set `autoplay`, `muted`, `loop`, `playsinline` via block attributes. Add `fmnr-video` class for poster frame handling. |
| **Tag** | `core/html` or custom ACF block | Small pill label. Can use `core/paragraph` with class `fmnr-tag`, or a minimal ACF block with a single text field. |
| **Stat Number** | `core/html` or ACF block | Requires JS count-up animation. Register as a simple ACF block with `number`, `suffix`, `colour` fields. Outputs `<span class="stat-number" data-target="…">`. |
| **Divider** | `core/separator` | Register colour variants (`is-style-green`, `is-style-orange`) in `theme.json`. Override `.wp-block-separator` in `styles.css`. |
| **Spacer** | `core/spacer` | Map token sizes in `theme.json` spacing. Editors select height from predefined token values. |
| **Form Field** | WPForms / CF7 field | Style the plugin's rendered HTML to match FMNR `fmnr-form-field` styles in `styles.css`. |
| **List Item** | `core/list` / `core/list-item` | Add class `fmnr-list-item`. Optional icon via `core/html` within list items. |

---

### 3B. Custom Blocks (Molecules)

These require either ACF Blocks, custom Gutenberg blocks (registered via `register_block_type()`), or Templately saved patterns with Custom HTML. ACF Blocks are recommended for editor-friendliness without a build step.

| Block | Recommended Approach | Fields / Notes |
|-------|---------------------|----------------|
| **Pull Quote** | ACF Block | Fields: `quote_text`, `attribution`, `bg_colour` (token selector). Renders full-width coloured band. |
| **CTA Band** | ACF Block or Templately pattern | Fields: `heading`, `body`, `button_1_label`, `button_1_url`, `button_2_label`, `button_2_url`. Dark background variant. |
| **Card** | ACF Block | Fields: `variant` (image/video/icon/blog/podcast/award/horizontal), `image`, `video_url`, `icon`, `heading`, `body`, `tag`, `link_url`. |
| **Bar Chart** | ACF Block with Repeater | Repeater field: `label`, `percentage`, `colour`. Renders animated horizontal bars. Requires `fmnr-animations.js` for bar-fill animation. |
| **Stat Tile** | ACF Block | Fields: `number`, `prefix`, `suffix`, `label`, `colour`. Uses count-up animation. |
| **Nav Item** | Part of Header template part | Icon + title + description. Managed in the Header Template Part, not as a standalone page block. |
| **Scroll Animation** | ACF Block (wrapper) | Fields: `animation_type` (fade-up / stagger / parallax / scale-in / count-up / slide-in / bar-fill / ken-burns), `delay`. Wraps InnerBlocks. Applies `data-animate` attribute for JS to target. |
| **Timeline Entry** | ACF Block with Repeater | Fields: `year`, `tag`, `heading`, `body`, `image`. Renders expandable accordion row. Requires toggle JS. |
| **Pillar Card** | ACF Block | Fields: `number`, `stat`, `heading`, `body`. Numbered feature card. |
| **Award Card** | ACF Block | Fields: `icon`, `heading`, `description`. |
| **Search Result** | Rendered by WordPress search template | Style `search-results.php` template to match `fmnr-search-result` class. Not an editor-placed block. |
| **Media Card** | ACF Block | Fields: `type` (video/image), `thumbnail`, `heading`, `tag`, `link_url`. |
| **Video Controls** | Custom HTML block / Theme JS | Play/pause and mute buttons injected by theme JS alongside the Hero Video block. Not typically editor-placed. |
| **Progress Bar** | Theme JS (no block needed) | Fixed scroll-progress bar injected via theme `wp_footer` hook. CSS in `styles.css`. |
| **Scroll Hint** | Custom HTML block | Simple animated chevron. Can be a reusable `core/html` snippet saved in Templately. |

---

### 3C. Block Patterns (Organisms)

Register as **WordPress Block Patterns** via `register_block_pattern()` in `functions.php`, or save to Templately for reuse across pages. Each pattern is a composition of the blocks above.

```php
// Example registration in functions.php
register_block_pattern_category( 'fmnr', [ 'label' => 'FMNR' ] );

register_block_pattern( 'fmnr/card-grid', [
    'title'      => 'FMNR Card Grid',
    'categories' => ['fmnr'],
    'content'    => '<!-- wp:acf/card-grid /-->',  // replace with full serialised block markup
]);
```

| Pattern | Composition | Notes |
|---------|------------|-------|
| **Card Grid** | `core/group` → repeating `acf/card` | 1–4 column responsive grid. Register column count as a block style. |
| **Hero Video** | `core/cover` (video source) + `core/group` (overlay content) + `acf/video-controls` | Full-viewport. Use `core/cover` with video background. Gradient overlay via CSS class. |
| **Hero Image** | `core/cover` (image source) + Ken Burns class | Eyebrow label as `fmnr-tag` block. |
| **Split Bio** | `core/columns` (2-col) → col 1: `core/image`, col 2: `core/group` (tags + heading + body) | Responsive stack on mobile. |
| **Timeline** | `acf/timeline` (with repeater) | Full accordion component. Single ACF block handles all entries. |
| **Numbered Pillars** | `core/columns` (3-col) → repeating `acf/pillar-card` | Values / steps / principles. |
| **Awards Grid** | `core/columns` (3-col) → repeating `acf/award-card` | |
| **Media Grid** | `core/columns` (4-col) → repeating `acf/media-card` | |
| **Contact Form** | `core/group` → `core/columns` → CF7 / WPForms block | Style plugin output to match FMNR form field styles. |
| **Map Section** | `acf/map-section` (custom ACF block) | Embeds Leaflet map. Requires Leaflet JS/CSS loaded conditionally when block is present. |
| **Stat Stack** | `core/group` → `core/columns` → repeating `acf/stat-tile` | Count-up animation triggered on scroll. |
| **Search Overlay** | Theme JS + `core/html` trigger button | Full-screen overlay rendered by theme, not Gutenberg. Register a "Search Trigger" button block. |
| **Intro Strip** | `core/columns` (2-col) → `core/heading` (large, left) + `core/group` (body right) | |
| **Editorial Band** | `core/cover` (parallax image) + overlay group | Full-bleed parallax. Use `core/cover` with fixed background option. |
| **Twin Panels** | `core/columns` (2-col) → each col: `core/cover` (image + overlay text/tag/link) | |
| **Photo Grid** | `core/gallery` with `fmnr-photo-grid` class, or `core/columns` (3-col) | Overlay captions via CSS `:hover`. |
| **Hub Section** | `core/columns` (2-col) → col 1: `core/video`/`core/image`, col 2: `core/group` (heading + icon list) | |
| **Stories Carousel** | `acf/stories-carousel` | Horizontal scroll + prev/next controls. Requires carousel JS. Register as ACF block with repeater. |
| **Story Block** | `core/cover` (parallax) + `core/quote` + `core/button` | Full-bleed image, gradient scrim, blockquote, CTA. |
| **Growth Steps** | `core/columns` (4-col) → each col: `core/group` (number + illustration + heading + body) | How-it-works. |
| **Newsletter** | `acf/newsletter` or MailChimp/Mailpoet block | Centered email sign-up. Can use a form plugin's block styled with FMNR classes. |

---

### 3D. Template Parts

Manage in the **WordPress Site Editor** (Appearance → Editor → Template Parts) for block themes, or via `get_template_part()` in classic themes.

| Template Part | Implementation |
|---------------|---------------|
| **Header** | Site Editor Template Part: `header.html`. Contains: logo `core/site-logo`, mega-menu `core/navigation` (with FMNR mega menu CSS), search trigger button, CTA button. Register mega-menu panel layout via a custom Navigation block variation or `core/html`. |
| **Mega Menu (Standard 3-col)** | Custom Navigation Walker (classic theme) or `core/navigation` with custom CSS classes for the mega menu panel. The three layout variants (Standard 3-col, Compact List, Immersive Dark) are applied via CSS classes on the `<nav>` element. |
| **Footer** | Site Editor Template Part: `footer.html`. Contains: logo, `core/navigation` (footer links), newsletter form, `core/social-links`. |

**Note on Mega Menu:** Gutenberg's `core/navigation` block does not natively support mega menus with icon+title+description nav items. Two options:
1. Use a plugin like **Max Mega Menu** or **WP Mega Menu** and style to match FMNR designs.
2. Implement a custom Navigation block variation with `InnerBlocks` and a custom panel template — requires a build step (`@wordpress/scripts`).

---

### 3E. Page Templates

Register full-page compositions as **WordPress Templates** in the Site Editor, or as Templately templates.

| Template | WordPress Template | Notes |
|----------|--------------------|-------|
| **Homepage** | `front-page.html` | Video Hero → Intro Strip → Stat Stack → Card Grid → Story Block → CTA Band → Footer |
| **Tony Rinaudo** | Custom page template or single page with Gutenberg blocks | Timeline + Split Bio + Awards Grid |
| **Resources** | Custom archive/page template `resources.html` | Filter UI requires custom JS + REST API queries or a plugin like FacetWP |
| **Impact & Evidence** | Custom page | Stat Stacks + Bar Charts + Editorial Bands |
| **Partner With Us** | Custom page | Pillars + Benefits grid + Contact Form |
| **Blog Listing** | `home.html` (blog template) | Featured post block + Card Grid of posts |
| **Blog Post (Single)** | `single.html` | Hero Image + Article content + Sidebar |
| **Search Results** | `search.html` | Search Overlay + List Items |

---

## 4. Templately Integration

### Saving Blocks as Templately Templates

1. Build each Block Pattern in the Gutenberg editor.
2. Select the outermost Group block, open the three-dot menu → **Save to Templately**.
3. Organise into a **Templately workspace folder** called `FMNR Design System`.
4. Share the workspace with all site editors so they can insert pre-built sections.

### Recommended Templately Save Order

Build and save in this order (dependencies first):

1. Core tokens (handled by `theme.json` — no Templately save needed)
2. Individual molecule blocks (Pull Quote, CTA Band, Card, Stat Tile, etc.)
3. Organism patterns (Card Grid, Hero sections, Stat Stack, etc.)
4. Full page templates (Homepage, Blog, Resources, etc.)

---

## 5. Custom CSS Classes Reference

These classes must be present in `styles.css` and `design-tokens.css` (both enqueued globally):

| CSS Class | Applied To | Effect |
|-----------|-----------|--------|
| `fmnr-heading` | `core/heading` | FatFrank font, uppercase, token sizing |
| `fmnr-body`, `fmnr-body--small`, `fmnr-body--caption` | `core/paragraph` | Lato variants |
| `fmnr-tag` | Inline elements | Pill label style |
| `fmnr-ken-burns` | `core/image`, `core/cover` | Ken Burns pan/zoom animation |
| `fmnr-animate` + `data-animate="…"` | Any block | Triggers scroll animation via JS |
| `fmnr-stat-number` + `data-target="…"` | Stat number spans | Count-up animation |
| `fmnr-card--horizontal` | Card blocks | Horizontal layout variant |
| `fmnr-divider--green`, `--orange` | `core/separator` | Coloured divider variants |
| `fmnr-photo-grid` | `core/gallery` | Overlay caption hover style |
| `fmnr-cover--parallax` | `core/cover` | CSS parallax background |

---

## 6. JavaScript Dependencies

The following scripts must be enqueued on the front end. Extract from demo HTML files and place in `/assets/js/`:

| Script | Source File | Purpose |
|--------|------------|---------|
| `scroll-animations.js` | Extracted from `scroll-animations-demo.html` | IntersectionObserver for fade-up, stagger, scale-in, slide-in, parallax, count-up, bar-fill, Ken Burns |
| `timeline.js` | Extracted from `timeline-demo.html` | Expand/collapse timeline accordion |
| `carousel.js` | Extracted from `stories-carousel-demo.html` | Stories carousel scroll + controls |
| `map.js` | Extracted from `map-demo.html` | Leaflet map initialisation + country data |
| `mega-menu.js` | Extracted from `mega-menu-demo.html` | Mega menu open/close + keyboard nav |
| `search.js` | Extracted from `search-demo.html` | Search overlay open/close + predictive results |
| `video-hero.js` | Extracted from `video-hero-demo.html` | Play/pause, mute toggle, progress bar, scroll hint |
| `decision-trees-part-1-main.js` | Existing file | Decision tree interactive tool |

Load Leaflet conditionally only on pages that use the Map Section:

```php
add_action( 'wp_enqueue_scripts', function() {
    if ( has_block( 'acf/map-section' ) ) {
        wp_enqueue_style( 'leaflet', 'https://unpkg.com/leaflet/dist/leaflet.css' );
        wp_enqueue_script( 'leaflet', 'https://unpkg.com/leaflet/dist/leaflet.js', [], null, true );
        wp_enqueue_script( 'fmnr-map', get_stylesheet_directory_uri() . '/assets/js/map.js', ['leaflet'], null, true );
    }
});
```

---

## 7. ACF Block Registration Checklist

Register all custom ACF blocks in `functions.php` or a dedicated `blocks/` directory. Minimum required:

- [ ] `acf/stat-tile` — number, suffix, label, colour
- [ ] `acf/stat-number` — number, colour (standalone animated digit)
- [ ] `acf/pull-quote` — quote, attribution, bg_colour
- [ ] `acf/cta-band` — heading, body, button_1, button_2
- [ ] `acf/card` — variant, image, video_url, icon, heading, body, tag, link_url
- [ ] `acf/bar-chart` — repeater: label, percentage, colour
- [ ] `acf/scroll-animation` — animation_type, delay, InnerBlocks
- [ ] `acf/timeline` — repeater: year, tag, heading, body, image
- [ ] `acf/pillar-card` — number, stat, heading, body
- [ ] `acf/award-card` — icon, heading, description
- [ ] `acf/media-card` — type, thumbnail, heading, tag, link_url
- [ ] `acf/map-section` — map data source (JSON or CPT), initial zoom/centre
- [ ] `acf/stories-carousel` — repeater: image, quote, attribution, tag, link_url
- [ ] `acf/newsletter` — heading, body, form_shortcode (CF7 or WPForms)
- [ ] `acf/hub-section` — media (image/video), heading, body, link list (repeater)

---

## 8. Fonts & Licensing

| Font | Licence | How to Load |
|------|---------|------------|
| **FatFrank** | Adobe Typekit — requires active Creative Cloud licence assigned to the site | `<link rel="stylesheet" href="https://use.typekit.net/ajf0nww.css">` in `<head>`. Verify the kit ID `ajf0nww` is configured to allow `fmnrhub.com.au` as an allowed domain in Adobe Fonts. |
| **Lato** | Google Fonts — free | Loaded via `@import` in `design-tokens.css` |

**Action required:** Log in to [fonts.adobe.com](https://fonts.adobe.com), open the kit `ajf0nww`, and add `fmnrhub.com.au` and `www.fmnrhub.com.au` to the allowed domains list. Without this, FatFrank will not load on the live site.

---

## 9. Implementation Sequence

1. **Set up theme** — create or configure a block-compatible child theme; add `theme.json` with FMNR tokens.
2. **Enqueue assets** — `design-tokens.css`, `styles.css`, animation JS files via `functions.php`.
3. **Fix fonts** — add `fmnrhub.com.au` to the Adobe Fonts kit allowed domains.
4. **Register ACF blocks** — build PHP block registrations and template files for all custom blocks listed in section 7.
5. **Style core blocks** — add `styles.css` overrides for `core/button`, `core/heading`, `core/separator`, `core/cover`, etc.
6. **Build patterns** — assemble each Block Pattern in the editor; save to Templately workspace.
7. **Build template parts** — create Header and Footer template parts in the Site Editor; implement mega menu.
8. **Build page templates** — build each full-page layout in the Site Editor or as Gutenberg page content.
9. **Test animations** — verify scroll-triggered animations, count-up numbers, carousel, map, and timeline on staging.
10. **Handover to editors** — document which Templately templates to use for each content type; train editors on block insertion.

---

## 10. Known Complexity Areas

| Area | Risk | Mitigation |
|------|------|-----------|
| Mega Menu | `core/navigation` has limited panel layout support | Use Max Mega Menu plugin styled to FMNR spec, or build a custom Navigation block variation |
| Map Section | Leaflet + country data requires a data source | Store country data as a CPT or JSON file; the ACF block reads and passes it to Leaflet |
| Stories Carousel | No native Gutenberg carousel | Custom ACF block with rendered PHP template + carousel JS |
| Video Hero | `core/cover` supports video but not play/pause controls natively | Inject controls via theme JS after block renders |
| Scroll Animations | Must not break in the editor | Wrap IntersectionObserver init in a `DOMContentLoaded` check; disable in editor context using `window.wp?.blocks` check |
| Resources Filter UI | Requires live filtering by category/type | Use FacetWP plugin or custom REST API + JS filtering |
| Decision Tree | Complex interactive JS tool | Render as a standalone embedded page or `<iframe>` within an ACF block rather than natively in Gutenberg |
