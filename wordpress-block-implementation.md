# FMNR Block Implementation Guide
## No-dev approach — everything through the WordPress Admin

All blocks from `components.html` can be implemented through the WordPress admin interface alone. No SFTP, no file editing, no command line, no developer required for initial build.

The only "code" layer is **WPCode Lite**, which lets you paste CSS, JS, and PHP snippets directly in the admin — the same things that would otherwise require editing `functions.php` or theme files.

---

## 1. One-Time Setup (do this first)

### 1.1 Install WPCode Lite

1. **Plugins → Add New Plugin**
2. Search: `WPCode`
3. Install and activate **WPCode – Insert Headers and Footers + Custom Code Snippets**
4. It appears in the left menu as **Code Snippets**

### 1.2 Install Icon Block

1. **Plugins → Add New Plugin**
2. Search: `Icon Block`
3. Install and activate **Icon Block** by Nick Diego
4. This gives editors a proper SVG icon picker in the block editor

### 1.3 Upload FMNR SVG icons

1. **Media → Add New**
2. Upload all SVG files from the `/icons/` folder in this repo
3. Safe SVG is already active — SVGs are automatically sanitised on upload
4. Organise into a FileBird folder called "FMNR Icons" for easy finding

### 1.4 Fix Archivo Black font (urgent)

The Archivo Black font is currently loading from a bare server IP (`54.252.190.200`). This will break if the server changes.

1. **Appearance → Editor → Styles** (top right: pencil icon) → **Typography → Manage fonts**
2. Find Archivo Black — click the source URL
3. Download the font file from that IP and re-upload it via the font manager
4. Or: go to **Appearance → Editor** → open `theme.json` via the editor and update the Archivo Black `src` to use the proper uploaded path

---

## 2. CSS — Paste Once via WPCode

This adds all FMNR block styles on top of the existing site theme without touching any files.

1. Go to **Code Snippets → + Add Snippet**
2. Click **Add Your Custom Code (New Snippet)**
3. Name it: `FMNR Block Styles`
4. Set type to: **CSS Snippet**
5. Set location to: **Site Wide Header** (or Frontend only)
6. Paste the following into the code box:

```css
/* ============================================================
   FMNR Block Styles
   ============================================================ */

/* Heading — uppercase variant */
.fmnr-heading {
    font-family: var(--wp--preset--font-family--fatfrank);
    text-transform: uppercase;
    line-height: 0.9;
}

/* Tag / Pill label */
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
    margin-bottom: 8px;
}

/* Button — Primary */
.wp-block-button.is-style-primary .wp-block-button__link {
    background-color: var(--wp--preset--color--custom-dark-green-fmnr) !important;
    color: #fff !important;
    border: none !important;
    border-radius: 4px;
    font-weight: 700;
    padding: 14px 28px;
    transition: background 0.2s;
}
.wp-block-button.is-style-primary .wp-block-button__link:hover {
    background-color: var(--wp--preset--color--custom-green) !important;
}

/* Button — Secondary (outline) */
.wp-block-button.is-style-secondary .wp-block-button__link {
    background: transparent !important;
    border: 2px solid var(--wp--preset--color--custom-dark-green-fmnr) !important;
    color: var(--wp--preset--color--custom-dark-green-fmnr) !important;
    border-radius: 4px;
    font-weight: 700;
    padding: 12px 26px;
    transition: all 0.2s;
}
.wp-block-button.is-style-secondary .wp-block-button__link:hover {
    background: var(--wp--preset--color--custom-dark-green-fmnr) !important;
    color: #fff !important;
}

/* Button — Ghost */
.wp-block-button.is-style-ghost .wp-block-button__link {
    background: transparent !important;
    border: none !important;
    color: inherit !important;
    text-decoration: underline !important;
    padding: 0 !important;
}

/* Dividers */
.wp-block-separator.is-style-fmnr-green { border-color: var(--wp--preset--color--custom-dark-green-fmnr) !important; }
.wp-block-separator.is-style-fmnr-orange { border-color: var(--wp--preset--color--custom-orange-fmnr) !important; }

/* Ken Burns image animation */
.fmnr-ken-burns img,
.fmnr-ken-burns .wp-block-cover__image-background {
    animation: fmnr-kb 20s ease-in-out infinite alternate;
    transform-origin: center center;
}
@keyframes fmnr-kb {
    from { transform: scale(1)    translateX(0)   translateY(0); }
    to   { transform: scale(1.12) translateX(-2%) translateY(-1%); }
}

/* Parallax cover */
.fmnr-cover--parallax .wp-block-cover__image-background {
    background-attachment: fixed;
}

/* Pull Quote band */
.fmnr-pull-quote {
    padding: 64px clamp(24px, 5vw, 96px);
    text-align: center;
}
.fmnr-pull-quote .wp-block-quote p {
    font-family: var(--wp--preset--font-family--fatfrank);
    font-size: clamp(1.4rem, 4vw, 2.5rem);
    line-height: 1.1;
    text-transform: uppercase;
    margin-bottom: 16px;
}
.fmnr-pull-quote cite {
    font-size: 0.9rem;
    opacity: 0.65;
    font-style: normal;
}

/* CTA Band */
.fmnr-cta-band {
    padding: clamp(48px, 8vw, 96px) clamp(24px, 5vw, 96px);
    text-align: center;
}

/* Stat number (count-up span) */
.fmnr-stat-number {
    font-family: var(--wp--preset--font-family--fatfrank);
    font-size: clamp(3rem, 8vw, 6rem);
    line-height: 1;
    color: var(--wp--preset--color--custom-teal);
    display: block;
}

/* Photo grid — hover caption reveal */
.fmnr-photo-grid figure { position: relative; overflow: hidden; margin: 0; }
.fmnr-photo-grid figcaption {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.75));
    color: #fff;
    padding: 32px 16px 14px;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    font-size: 0.85rem;
}
.fmnr-photo-grid figure:hover figcaption { transform: translateY(0); }

/* Progress bar (injected by JS) */
.fmnr-progress-bar {
    position: fixed;
    top: 0; left: 0;
    height: 3px; width: 0%;
    background: var(--wp--preset--color--custom-lime);
    z-index: 99999;
    transition: width 0.1s linear;
}

/* Scroll hint chevron (injected by JS) */
.fmnr-scroll-hint {
    position: absolute;
    bottom: 32px; left: 50%;
    transform: translateX(-50%);
    color: #fff; opacity: 0.8;
    animation: fmnr-bounce 1.5s ease-in-out infinite;
    cursor: pointer;
}
@keyframes fmnr-bounce {
    0%,100% { transform: translateX(-50%) translateY(0); }
    50%      { transform: translateX(-50%) translateY(8px); }
}

/* Hero video controls (injected by JS) */
.fmnr-hero-controls {
    position: absolute;
    bottom: 32px; right: 32px;
    display: flex; gap: 8px; z-index: 10;
}
.fmnr-hero-controls button {
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.3);
    color: #fff; border-radius: 50%;
    width: 40px; height: 40px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
}
.fmnr-hero-controls button:hover { background: rgba(255,255,255,0.3); }

/* Pillar card */
.fmnr-pillar-card { padding: 32px; border-radius: 8px; }
.fmnr-pillar-card .fmnr-number {
    font-family: var(--wp--preset--font-family--fatfrank);
    font-size: 4rem; line-height: 1;
    color: var(--wp--preset--color--custom-dark-green-fmnr);
    margin-bottom: 8px; display: block;
}

/* Horizontal card layout */
.fmnr-card--horizontal {
    display: flex !important;
    flex-direction: row;
    gap: 24px;
    align-items: flex-start;
}
.fmnr-card--horizontal .wp-block-column:first-child { flex: 0 0 40%; }
.fmnr-card--horizontal .wp-block-column:last-child  { flex: 1; }
@media (max-width: 600px) { .fmnr-card--horizontal { flex-direction: column; } }

/* WPForms styling */
.wpforms-field input[type="text"],
.wpforms-field input[type="email"],
.wpforms-field input[type="number"],
.wpforms-field textarea,
.wpforms-field select {
    border: 1px solid #464646 !important;
    border-radius: 4px !important;
    font-family: var(--wp--preset--font-family--lato) !important;
    font-size: 1rem !important;
    padding: 12px 16px !important;
    width: 100% !important;
    background: #fff !important;
    transition: border-color 0.2s;
}
.wpforms-field input:focus,
.wpforms-field textarea:focus {
    outline: none !important;
    border-color: var(--wp--preset--color--custom-dark-green-fmnr) !important;
}
.wpforms-field label { font-weight: 700; font-size: 0.875rem; margin-bottom: 6px; display: block; }
.wpforms-submit-container .wpforms-submit {
    background: var(--wp--preset--color--custom-dark-green-fmnr) !important;
    color: #fff !important;
    font-weight: 700 !important;
    border: none !important;
    border-radius: 4px !important;
    padding: 14px 28px !important;
    cursor: pointer !important;
    font-size: 1rem !important;
    transition: background 0.2s;
}
.wpforms-submit-container .wpforms-submit:hover {
    background: var(--wp--preset--color--custom-green) !important;
}

/* Scroll animation base states */
[data-animate] { transition: opacity 0.6s ease, transform 0.6s ease; }
[data-animate="fade-up"]  { opacity: 0; transform: translateY(40px); }
[data-animate="scale-in"] { opacity: 0; transform: scale(0.92); }
[data-animate="slide-in"] { opacity: 0; transform: translateX(-40px); }
[data-animate].fmnr-animated {
    opacity: 1 !important;
    transform: none !important;
}
```

7. Toggle the snippet to **Active**
8. Click **Save Snippet**

---

## 3. JavaScript — Paste via WPCode

Create one WPCode snippet per JS file. For each:

1. **Code Snippets → + Add Snippet → Add Your Custom Code**
2. Type: **JavaScript Snippet**
3. Location: **Footer**
4. Toggle **Active** and save

### Snippet 1: Scroll Animations

Name: `FMNR Scroll Animations`

Paste the full contents of `scroll-animations-demo.html`'s `<script>` block, wrapped in:

```js
(function() {
    // Do not run inside the Gutenberg block editor
    if (document.body.classList.contains('block-editor-page')) return;

    // ... paste the scroll-animations script content here ...
})();
```

### Snippet 2: Video Hero Controls

Name: `FMNR Video Hero`

Paste the contents of `video-hero-demo.html`'s `<script>` block, wrapped in the same editor guard above.

### Snippet 3: Mega Menu

Name: `FMNR Mega Menu`

Paste the contents of `mega-menu-demo.html`'s `<script>` block.

### Snippet 4: Search Overlay

Name: `FMNR Search`

Paste the contents of `search-demo.html`'s `<script>` block.

### Snippet 5: Timeline

Name: `FMNR Timeline`

Paste the contents of `timeline-demo.html`'s `<script>` block.

### Snippet 6: Stories Carousel

Name: `FMNR Carousel`

Paste the contents of `stories-carousel-demo.html`'s `<script>` block.

### Snippet 7: Map (Leaflet)

Name: `FMNR Map`

```js
(function() {
    // Only initialise if the map element exists on this page
    var mapEl = document.getElementById('fmnr-leaflet-map');
    if (!mapEl) return;

    // Load Leaflet CSS
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet JS then initialise
    var script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = function() {
        // Paste map.js initialisation code here
    };
    document.head.appendChild(script);
})();
```

> This self-installs Leaflet only when a `#fmnr-leaflet-map` element is found on the page — no server file access needed, and Leaflet won't load on pages that don't have a map.

---

## 4. PHP — Block Styles via WPCode

This registers the button, divider, and tag pill styles so they appear in the block editor's **Styles** panel.

1. **Code Snippets → + Add Snippet → Add Your Custom Code**
2. Name: `FMNR Block Style Registration`
3. Type: **PHP Snippet**
4. Location: **Run Everywhere**
5. Paste:

```php
// Button variants
register_block_style('core/button', ['name' => 'primary',   'label' => 'Primary (Green)']);
register_block_style('core/button', ['name' => 'secondary', 'label' => 'Secondary (Outline)']);
register_block_style('core/button', ['name' => 'ghost',     'label' => 'Ghost']);

// Divider colours
register_block_style('core/separator', ['name' => 'fmnr-green',  'label' => 'FMNR Green']);
register_block_style('core/separator', ['name' => 'fmnr-orange', 'label' => 'FMNR Orange']);

// Tag pill on paragraph
register_block_style('core/paragraph', ['name' => 'fmnr-tag', 'label' => 'Tag / Pill']);

// FMNR pattern category
register_block_pattern_category('fmnr', ['label' => 'FMNR Design System']);
```

6. Toggle **Active** and save

Once saved, open any page in the editor — `core/button` blocks will now show Primary / Secondary / Ghost in the right-hand Styles panel.

---

## 5. Missing Colour Tokens — Add via Site Editor

The existing `theme.json` already has the main FMNR colours registered. A few are missing. Add them without touching any files:

1. **Appearance → Editor** (Site Editor)
2. Click **Styles** (circle icon, top right)
3. Click the three-dot menu → **Edit CSS** — or use **Styles → Colors → Palette → Custom**
4. Add each missing colour to the custom palette:

| Name to add | Hex value |
|-------------|-----------|
| FMNR Pear | `#DDEB4A` |
| FMNR Olive | `#5C7D0D` |
| FMNR Cedar | `#7D3600` |
| FMNR Amber | `#F2AA00` |
| FMNR Sand | `#E0CAA0` |
| FMNR Cream | `#EFE9DC` |
| FMNR Charcoal | `#464646` |

Alternatively, add them directly in **Appearance → Editor → Styles → CSS** as CSS custom properties (this requires no file access):

```css
:root {
    --color-pear:    #DDEB4A;
    --color-olive:   #5C7D0D;
    --color-cedar:   #7D3600;
    --color-amber:   #F2AA00;
    --color-sand:    #E0CAA0;
    --color-cream:   #EFE9DC;
    --color-charcoal:#464646;
}
```

---

## 6. Existing Token Reference

When choosing colours in the block editor colour picker, use these — they are **already registered** in the site's `theme.json`:

| FMNR design token | Block editor palette name | CSS variable |
|-------------------|--------------------------|-------------|
| Primary green | **Custom Dark Green FMNR** | `--wp--preset--color--custom-dark-green-fmnr` |
| Orange | **Custom Orange FMNR** | `--wp--preset--color--custom-orange-fmnr` |
| Teal | **Custom Teal** | `--wp--preset--color--custom-teal` |
| Lime | **Custom Lime** | `--wp--preset--color--custom-lime` |
| Mid green | **Custom Green** | `--wp--preset--color--custom-green` |
| Light green | **Custom Light Green** | `--wp--preset--color--custom-light-green` |

FatFrank and Lato are already set as global heading and body fonts — **no font setup needed**.

---

## 7. Block-by-Block: How to Build Each One

### Core Blocks (Atoms)

| Block | How to build | Where the style comes from |
|-------|-------------|---------------------------|
| **Heading** | `core/heading` | FatFrank already applied globally. Add class `fmnr-heading` for uppercase. |
| **Body Text** | `core/paragraph` | Lato already applied globally. |
| **Button — Primary** | `core/button` → Styles panel → **Primary (Green)** | WPCode CSS snippet |
| **Button — Secondary** | `core/button` → Styles panel → **Secondary (Outline)** | WPCode CSS snippet |
| **Button — Ghost** | `core/button` → Styles panel → **Ghost** | WPCode CSS snippet |
| **Icon** | **Icon Block** plugin → upload SVG from `/icons/` | Safe SVG + Icon Block plugin |
| **Image with Ken Burns** | `core/image` → Additional CSS class: `fmnr-ken-burns` | WPCode CSS snippet |
| **Video** | `core/video` → Settings: enable Autoplay, Mute, Loop | Core |
| **Tag / Pill** | `core/paragraph` → Styles panel → **Tag / Pill** | WPCode CSS + PHP snippet |
| **Stat Number (count-up)** | **Essential Blocks → Counter** — enable count-up on scroll | EB built-in |
| **Divider — green** | `core/separator` → Styles panel → **FMNR Green** | WPCode CSS + PHP snippet |
| **Divider — orange** | `core/separator` → Styles panel → **FMNR Orange** | WPCode CSS + PHP snippet |
| **Spacer** | `core/spacer` — set height | Core |
| **Form Field** | **WPForms** → create form → embed block | WPCode CSS for styling |
| **List Item** | `core/list` → add class `fmnr-list-item`, or Icon Block + paragraph | Core |

---

### Custom Blocks (Molecules)

#### Pull Quote Band

In the block editor:

```
core/group
  ↳ Background colour: Custom Cream (or Teal, or Lime)
  ↳ Padding: Large (use spacing preset)
  ↳ Additional CSS class: fmnr-pull-quote
  ↳ Text align: center

  core/quote
    ↳ Type quote text here
    ↳ Font: FatFrank (set in Typography panel)
    ↳ Text size: X-Large or XX-Large

  core/paragraph (attribution)
    ↳ Colour: Contrast 2 (dimmed)
    ↳ Font size: Small
```

Save to Templately as: **FMNR Pull Quote — Cream / Teal / Lime**

---

#### CTA Band

```
core/group
  ↳ Background: Black (#000) or Contrast token
  ↳ Text colour: White (Base 2)
  ↳ Padding: XL
  ↳ Additional CSS class: fmnr-cta-band
  ↳ Align: Full width

  core/heading (H2)
    ↳ Colour: White
    ↳ Text align: center

  core/paragraph
    ↳ Colour: white 70% — use Custom CSS: `opacity: 0.7`
    ↳ Text align: center

  core/buttons
    ↳ Justification: center
    ↳ core/button → style: Primary (Green)
    ↳ core/button → style: Secondary (Outline) — set text colour to white
```

---

#### Card (Image variant)

Use **Essential Blocks → Feature Card**:
- Image at top
- Heading (FatFrank)
- Body text (Lato)
- Button (link to post/page)
- Set card colours using the FMNR palette

Save each variant (Image, Blog, Icon, Award) to Templately as individual molecules.

**Card — Horizontal variant:**

```
core/columns (2-col, do not stack on mobile)
  ↳ Additional CSS class: fmnr-card--horizontal
  core/column (40% width)
    ↳ core/image
  core/column (60% width)
    ↳ core/paragraph (style: Tag / Pill)
    ↳ core/heading (H3)
    ↳ core/paragraph (body)
    ↳ core/button (style: Ghost)
```

**Card — Award variant:**

Use **Stackable → Icon Box**:
- Upload icon SVG via Icon Block or media picker
- Heading: FatFrank
- Body: Lato

---

#### Bar Chart

No plugin is needed. In the editor, add a **Custom HTML** block and paste the bar chart HTML from `bar-chart-demo.html`. The WPCode scroll-animations snippet handles the `bar-fill` animation targeting `.fmnr-bar` elements.

To update chart values later: click the Custom HTML block → **Edit as HTML** → change the `data-fill` percentage values and label text.

---

#### Stat Tile

Use **Essential Blocks → Counter**:
- Set number, prefix, suffix
- Enable **Count Up on Scroll**
- Set number colour to Custom Teal or Custom Lime from the palette
- Set font to FatFrank (Typography panel)

---

#### Scroll Animation Wrapper

Any block can be given a scroll animation. The WPCode JS snippet watches for `data-animate` attributes.

**How to add a data attribute without touching code:**

Use a **GenerateBlocks → Container** as the wrapper block (already installed and in use on the site):
1. Add **GenerateBlocks → Container**
2. Place your content blocks inside it
3. In the Container's right-hand panel → **Advanced → HTML Attributes**
4. Add attribute: `data-animate` = `fade-up` (or `stagger`, `scale-in`, `slide-in`, `parallax`)

Available animation values:

| Value | Effect |
|-------|--------|
| `fade-up` | Fades in from below |
| `stagger` | Each child block fades in one by one |
| `scale-in` | Scales up from 92% |
| `slide-in` | Slides in from the left |
| `parallax` | Slow parallax scroll on images |
| `bar-fill` | Animates bar chart fills |

---

#### Timeline

Add a **Custom HTML** block and paste the full timeline markup from `timeline-demo.html`. The WPCode timeline JS snippet handles expand/collapse.

Ensure the outer container has `class="fmnr-timeline"` in the HTML — this is already in the demo markup.

---

#### Pillar Card

```
core/group
  ↳ Additional CSS class: fmnr-pillar-card
  ↳ Background: Light (cream or white)
  ↳ Padding: Large

  core/paragraph
    ↳ Text: "01" (or 02, 03...)
    ↳ Additional CSS class: fmnr-number
    ↳ Font: FatFrank
    ↳ Colour: Custom Dark Green FMNR

  core/heading (H3)
    ↳ Heading text

  core/paragraph
    ↳ Body text
```

Wrap three in `core/columns` (3-col) for the Numbered Pillars pattern.

---

#### Award Card

Use **Stackable → Icon Box** or **Essential Blocks → Info Box**:
- Icon: upload SVG from Media Library (Safe SVG active)
- Heading: FatFrank
- Description: Lato
- No background

---

#### Media Card

```
core/group (set as a link — use GenerateBlocks Container with href attribute)
  core/image or core/video (thumbnail, aspect ratio 16:9)
  core/paragraph → style: Tag / Pill
  core/heading (H4, FatFrank)
```

For auto-populated media from posts: use **Essential Blocks → Post Grid** and configure the card template.

---

#### Video Controls, Progress Bar, Scroll Hint

These are automatically injected by the WPCode **FMNR Video Hero** JS snippet. They appear on any `core/cover` block (with video) that has the CSS class `fmnr-video-hero`.

When building the Hero Video pattern, add `fmnr-video-hero` to the `core/cover` block's **Additional CSS class** field.

---

### Block Patterns (Organisms)

Build each pattern using the blocks above, then save to Templately. Use the insert pattern button (the `/` command in the editor) to drop them into any page.

| Pattern | How to build |
|---------|-------------|
| **Card Grid** | `core/group` → `core/columns` (1–4 col) → EB Feature Card in each column |
| **Hero Video** | `core/cover` (video bg, full height, class `fmnr-video-hero`) → group with heading + body + buttons |
| **Hero Image** | `core/cover` (image, class `fmnr-ken-burns`) → tag + heading + button |
| **Split Bio** | `core/columns` 2-col → `core/image` (left) + group with tag + heading + body (right) |
| **Timeline** | Custom HTML block — paste from `timeline-demo.html` |
| **Numbered Pillars** | `core/columns` 3-col → fmnr-pillar-card group in each column |
| **Awards Grid** | `core/columns` 3-col → Stackable Icon Box per column |
| **Media Grid** | `core/columns` 4-col → fmnr-media-card group per column |
| **Contact Form** | `core/group` → WPForms block |
| **Map Section** | Custom HTML block: `<div class="fmnr-map" id="fmnr-leaflet-map" style="height:500px"></div>` |
| **Stat Stack** | `core/columns` → EB Counter per column |
| **Search Overlay** | Custom HTML block — paste trigger button from `search-demo.html` |
| **Intro Strip** | `core/columns` 2-col → large heading (left) + body group (right) |
| **Editorial Band** | `core/cover` (class `fmnr-cover--parallax`, fixed bg) → eyebrow tag + heading + body |
| **Twin Panels** | `core/columns` 2-col → `core/cover` per column with overlay content |
| **Photo Grid** | `core/gallery` 3-col + Additional CSS class: `fmnr-photo-grid` |
| **Hub Section** | `core/columns` 2-col → media (left) + group with heading + icon list (right) |
| **Stories Carousel** | **Stackable → Carousel** — apply FMNR colours in Stackable's style panel |
| **Story Block** | `core/cover` (class `fmnr-cover--parallax`) → `core/quote` + `core/button` |
| **Growth Steps** | `core/columns` 4-col → step number + `core/image` + heading + body per column |
| **Newsletter** | `core/group` (centred, coloured bg) → heading + paragraph + WPForms or OptinMonster |

---

### Template Parts — Header & Footer

Go to **Appearance → Editor → Template Parts**.

#### Header

Edit the existing header template part. The site already has one (referenced in the page source as template part 636).

**Mega Menu — two options:**

**Option A — Custom HTML block (no new plugin):**
Replace the existing `core/navigation` with a Custom HTML block containing the full header markup from `mega-menu-demo.html`. The WPCode mega-menu JS snippet handles all open/close behaviour. Links must be edited directly inside the HTML block.

**Option B — Use the existing `core/navigation` with sub-menus:**
For a simpler menu without icon+description panels, keep `core/navigation` and use WordPress's built-in sub-menu dropdowns, styled with the existing FMNR CSS. Not pixel-perfect to the design but requires zero custom code.

#### Footer

Edit the existing footer template part:

```
core/group (bg: Contrast / Black, class: fmnr-footer)
  core/columns (4-col)
    col 1: core/site-logo + core/paragraph (tagline)
    col 2: core/navigation (footer links set 1)
    col 3: core/navigation (footer links set 2)
    col 4: core/heading (Sign up) + WPForms block (email-only form)
  core/group (bottom bar)
    core/paragraph (© 2025 FMNR Hub)
    core/social-links
```

---

### Page Templates

Build each page in the editor using patterns from Templately, then save the finished page as a Templately template for reuse.

Go to **Appearance → Editor → Templates** to create or assign:

| Page | Template to create/assign | Pattern assembly |
|------|--------------------------|-----------------|
| **Homepage** | `front-page` | Hero Video → Intro Strip → Stat Stack → Card Grid → Story Block → CTA Band |
| **Tony Rinaudo** | Standard page | Hero Image → Split Bio → Timeline → Awards Grid → CTA Band |
| **Resources** | `page-resources` | Activate Document Library Lite for file listings. Or: filter bar (custom HTML) + Card Grid |
| **Impact & Evidence** | Standard page | Hero Image → Stat Stack → Bar Charts → Editorial Band → Card Grid |
| **Partner With Us** | Standard page | Hero Image → Numbered Pillars → Media Grid → Contact Form |
| **Blog Listing** | `home` | Featured post (Cover block) → EB Post Grid (auto) |
| **Blog Post** | `single` | Hero Image → Post Content block → Related (Query Loop block) |
| **Search Results** | `search` | Search bar → Query Loop styled as list items |

---

## 8. Templately Workspace Setup

1. Go to **Templately → My Templates → Cloud**
2. Create workspace: **FMNR Design System**
3. Invite all content editors to the workspace
4. Build and save in this order:

| Order | Save as | Folder |
|-------|---------|--------|
| 1 | CTA Band | FMNR / Molecules |
| 2 | Pull Quote — Cream | FMNR / Molecules |
| 3 | Pull Quote — Teal | FMNR / Molecules |
| 4 | Card — Image | FMNR / Molecules |
| 5 | Card — Blog | FMNR / Molecules |
| 6 | Card — Icon | FMNR / Molecules |
| 7 | Card — Award | FMNR / Molecules |
| 8 | Card — Horizontal | FMNR / Molecules |
| 9 | Stat Tile | FMNR / Molecules |
| 10 | Stat Stack | FMNR / Patterns |
| 11 | Card Grid — 3col | FMNR / Patterns |
| 12 | Card Grid — 4col | FMNR / Patterns |
| 13 | Hero Video | FMNR / Patterns |
| 14 | Hero Image | FMNR / Patterns |
| 15 | Numbered Pillars | FMNR / Patterns |
| 16 | Editorial Band | FMNR / Patterns |
| 17 | Contact Form Section | FMNR / Patterns |
| 18 | Newsletter Section | FMNR / Patterns |
| 19 | Timeline | FMNR / Patterns |
| 20 | Full page — Homepage | FMNR / Pages |
| 21 | Full page — Blog Post | FMNR / Pages |
| 22 | Full page — Resources | FMNR / Pages |
| 23 | Full page — Impact & Evidence | FMNR / Pages |

Once saved, any editor can insert a pattern by clicking the **+** icon in the editor → **Patterns** tab → **FMNR Design System**.

---

## 9. Implementation Checklist

### Phase 1 — One-time setup (2–3 hours)

- [ ] Install **WPCode Lite** plugin
- [ ] Install **Icon Block** plugin
- [ ] Fix Archivo Black font — copy file to uploads, update source in Site Editor font manager
- [ ] Upload all SVGs from `/icons/` to Media Library → organise in FileBird folder "FMNR Icons"
- [ ] Create WPCode snippet: **FMNR Block Styles** (CSS — Section 2)
- [ ] Create WPCode snippet: **FMNR Scroll Animations** (JS — Section 3)
- [ ] Create WPCode snippet: **FMNR Video Hero** (JS — Section 3)
- [ ] Create WPCode snippet: **FMNR Mega Menu** (JS — Section 3)
- [ ] Create WPCode snippet: **FMNR Search** (JS — Section 3)
- [ ] Create WPCode snippet: **FMNR Timeline** (JS — Section 3)
- [ ] Create WPCode snippet: **FMNR Carousel** (JS — Section 3)
- [ ] Create WPCode snippet: **FMNR Map** (JS — Section 3)
- [ ] Create WPCode snippet: **FMNR Block Style Registration** (PHP — Section 4)
- [ ] Add missing colour tokens via Site Editor Styles (Section 5)
- [ ] Verify: open any page editor → `core/button` block → Styles panel shows Primary / Secondary / Ghost
- [ ] Verify: FatFrank loads on headings (check Network tab — `fatfrank.otf`)
- [ ] Verify: FMNR CSS snippet loads (check Network tab or DevTools — look for `.fmnr-tag` rule)

### Phase 2 — Header & Footer (2–4 hours)

- [ ] Open **Appearance → Editor → Template Parts → Header**
- [ ] Choose mega menu approach (Option A: HTML block / Option B: nav block + sub-menus)
- [ ] Build header: logo + navigation + search + CTA button
- [ ] Open **Appearance → Editor → Template Parts → Footer**
- [ ] Build footer: 4-column layout + newsletter form + social links + copyright
- [ ] Test: mega menu opens/closes, keyboard ESC works, mobile hamburger toggles
- [ ] Test: footer form submits — confirm email in **Post SMTP → Email Log**

### Phase 3 — Molecule blocks (3–4 hours)

Build each, verify appearance, save to Templately:

- [ ] CTA Band
- [ ] Pull Quote (Cream + Teal variants)
- [ ] Card — Image (EB Feature Card)
- [ ] Card — Blog (EB Feature Card with date/tag)
- [ ] Card — Icon (EB Feature Card with icon)
- [ ] Card — Award (Stackable Icon Box)
- [ ] Card — Horizontal
- [ ] Stat Tile (EB Counter — verify count-up fires)
- [ ] Bar Chart (Custom HTML — verify bar-fill animation fires)
- [ ] Timeline (Custom HTML — verify expand/collapse works)

### Phase 4 — Patterns (4–6 hours)

- [ ] Card Grid (2-col, 3-col, 4-col variants)
- [ ] Hero Video — test: autoplay, controls inject, progress bar shows, scroll hint shows
- [ ] Hero Image — test: Ken Burns animation
- [ ] Stat Stack — test: count-up fires on scroll
- [ ] Numbered Pillars
- [ ] Awards Grid
- [ ] Intro Strip
- [ ] Editorial Band — test: parallax effect
- [ ] Story Block
- [ ] Twin Panels
- [ ] Photo Grid — test: caption reveals on hover
- [ ] Hub Section
- [ ] Growth Steps
- [ ] Newsletter section
- [ ] Contact Form section
- [ ] Map Section — test: Leaflet loads, map renders, does NOT load on homepage (check Network tab)
- [ ] Search Overlay — test: opens, results populate, ESC closes
- [ ] Stories Carousel — test: scroll, prev/next buttons

### Phase 5 — Page templates (4–8 hours)

- [ ] Homepage
- [ ] Tony Rinaudo
- [ ] Blog listing
- [ ] Blog post single (assign as default single template)
- [ ] Resources
- [ ] Impact & Evidence
- [ ] Partner With Us
- [ ] Search results

### Phase 6 — QA (2 hours)

- [ ] All scroll animations fire — none fire inside the block editor
- [ ] Count-up numbers animate on scroll
- [ ] Bar chart bars animate on scroll
- [ ] Timeline accordion works
- [ ] Carousel prev/next buttons work
- [ ] Leaflet does NOT load on pages without a map
- [ ] WPForms submission → email received (Post SMTP log)
- [ ] FatFrank on all headings, all pages
- [ ] Archivo Black loading from correct uploaded path (not bare IP)
- [ ] No horizontal scroll on mobile (390px)
- [ ] No console errors on any page

---

## 10. WPForms Lite — What's Possible

WPForms Lite (installed) is sufficient for the Contact Form and Newsletter patterns:
- ✅ Text, email, textarea, dropdown, checkbox fields
- ✅ Honeypot spam protection
- ✅ Email notification on submit → delivered via Post SMTP

Not available without upgrading to WPForms Pro:
- ❌ File uploads
- ❌ Conditional logic (show/hide fields)
- ❌ Multi-step forms

If the Partnership inquiry form needs file uploads or conditional fields, either upgrade to WPForms Pro or install the free **Forminator** plugin instead.

---

## 11. Known Constraints

| Block | Constraint | Workaround |
|-------|-----------|-----------|
| **Bar Chart** | Not available as an editable UI block | Custom HTML block — edit values in Code Editor view |
| **Timeline** | No plugin matches FMNR design exactly | Custom HTML block — edit content in Code Editor view |
| **`data-animate` attribute** | Block inspector only accepts CSS classes | Use GenerateBlocks Container → Advanced → HTML Attributes |
| **Mega Menu (icon+desc panels)** | `core/navigation` doesn't support this natively | Custom HTML block (Option A) or a simpler nav with sub-menus (Option B) |
| **Map country data** | Needs a data source | Embed country data as a JSON object directly in the Map WPCode JS snippet |
| **Decision Tree** | Multi-file Backbone.js tool — cannot run as a Gutenberg block | Embed as `<iframe>` in a Custom HTML block pointing to the standalone decision tree HTML page hosted on the same server |
| **Stories Carousel controls** | Stackable Carousel may not match FMNR's custom progress bar | Use Stackable as base; override in WPCode CSS snippet if needed |
| **Video Hero play/pause controls** | Injected by JS — target selector must match WP's rendered cover block HTML | In `video-hero.js`, target `.wp-block-cover video` (the class WordPress outputs for a cover block with video) |
