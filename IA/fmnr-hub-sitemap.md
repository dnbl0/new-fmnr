# FMNR Hub — Site Map & Information Architecture
> **For AI coding agents (Claude Code / GitHub Copilot)**
> Use this file as the source of truth for page structure, routing, component requirements, and content priorities.
> All page slugs are relative to `https://fmnrhub.com.au/`

---

## Agent instructions

- `[NEW]` = build from scratch, no existing page
- `[IMPROVE]` = existing WordPress page/template needs rework
- `[GAP]` = requirement explicitly called out in client brief — must not be skipped
- `[URGENT]` = client has active referrals landing here now; build first
- Tags stack: a page can be `[NEW][GAP][URGENT]`
- WordPress stack: existing site. Add templates/blocks; do not rebuild from scratch
- Mobile-first: all templates must be responsive; field workers are a primary audience
- CMS-editable: WVA staff must be able to update content without developer help

---

## Priority order for build sequence

```
1. /partner/faith-based          [NEW][GAP][URGENT]
2. /partner/                     [NEW]
3. /partner/funders              [NEW][GAP]
4. /partner/ngos                 [NEW][GAP]
5. /partner/governments          [NEW]
6. /about/tony-rinaudo           [IMPROVE][GAP]
7. /impact/resource-hub          [IMPROVE][GAP]
8. /impact/dashboard             [NEW][GAP]
9. /learn/fmnr-fundamentals      [IMPROVE][GAP]
10. /learn/global-activity       [IMPROVE][GAP]
```

---

## Navigation structure

Top-level nav: **5 items, max 1–2 words each**

```
Learn  |  Adopt  |  Partner  |  Impact  |  About
```

> [GAP] Current nav headings are too long and hierarchy is unclear (per brief).
> Replace with the 5 items above. Remove all existing verbose nav labels.

---

## Global / persistent elements

### Homepage `/`  [IMPROVE]

**Component requirements:**
- `HeroSection` — full-width, must support embedded YouTube/Vimeo player [GAP: currently static image, no video]
- `AudienceSelectorCards` — 4 cards: Faith · NGO · Government · Funder → each routes to `/partner/{type}`
- `OneBillionHectareBanner` — prominent stat/statement endorsing 1B ha vision [GAP: missing site-wide]
- `GlobalMapTeaser` — small preview map linking to `/learn/global-activity`
- `EDMSignupBlock` — two visible tracks: "Adopter updates" + "Partner/funder updates" [GAP: box exists, content strategy undefined]
- `FeaturedStoryCarousel` — 3 cards pulled from resource hub

**Layout note:** Homepage is a junction, not a destination. Content must be scannable in under 30 seconds.

---

### EDM / Newsletter strategy  [GAP]

> Brief status: sign-up box integrated ✓ — content strategy still marked ⚠ undefined

Two tracks must be configured in the email platform:

| Track | Audience | Cadence | Content focus |
|---|---|---|---|
| `adopter-track` | Farmers, field workers, WV staff | Monthly | Practical how-to, new field guides, country updates |
| `partner-track` | Faith leaders, NGOs, funders, govt | Quarterly | Impact data, partnership news, Tony's recognition, 1B ha progress |

**Implementation:** Sign-up form must capture track preference at point of signup. Both tracks must have a welcome sequence and at minimum 4 planned sends before launch.

---

## 1 — Learn `/learn/`

> Entry point for newcomers, media, journalists, students, community leaders.

### 1.1 FMNR Fundamentals `/learn/fmnr-fundamentals`  [IMPROVE][GAP]

**Gap (R5):** Currently long-scroll text blocks. Must convert to carousel/tile format.

**Component requirements:**
- `FundamentalsCarousel` — horizontal swipe, 5–7 tiles, each tile: icon + heading + 2-line description
- `VideoEmbed` — YouTube/Vimeo player, FMNR explainer video [GAP: video missing from current homepage]
- `OneBillionHectareSection` — full-width statement block [GAP: 1B ha vision not currently endorsed]
- `ComparisonBlock` — FMNR vs conventional land restoration, side-by-side
- `CTABlock` → links to `/adopt/getting-started` and `/partner/`

**Content tiles (carousel):**
1. What is FMNR?
2. How it works
3. Why it matters
4. The underground forest
5. Community ownership
6. Cost & scale
7. The 1-billion-hectare vision

---

### 1.2 Science & Evidence `/learn/evidence`  [IMPROVE]

**Component requirements:**
- `EvidenceIntro` — punchy one-liner stats above fold
- `ResearchCards` — filterable by: topic / country / publication year
- `ImpactMetricTiles` — 3 tiles linking to dashboard detail:
  - Livelihoods [GAP: missing]
  - Fragile & conflict contexts [GAP: missing]
  - Water & ecosystem [GAP: missing]
- `CTABlock` → `/impact/resource-hub`

---

### 1.3 Global Activity `/learn/global-activity`  [IMPROVE][GAP]

**Gap (R4):** Interactive map exists but is missing WV office + adopter data layer.

**Component requirements:**
- `InteractiveMap` — base layer: FMNR activity by country
  - Toggle layer 1: WV office locations [GAP: not yet on map]
  - Toggle layer 2: Adopter/partner activity across partnership [GAP: not yet on map]
  - Flagship country pins: Niger, Ethiopia, Zambia, Mali — click → country page
- `MovementTracker` — live or manually updated stat: adopter count / hectares
- `FlagshipCountryCards` — 4 cards (Niger, Ethiopia, Zambia, Mali)
- `CTABlock` → `/adopt/country-examples`

**Country sub-pages** `/learn/global-activity/{country}`  [IMPROVE]

Applies to: `niger` · `ethiopia` · `zambia` · `mali`

> [GAP] Zambia page singled out in brief as "very wordy". Redesign all four using GGW page format as the template benchmark.

**Component requirements per country page:**
- `CountryHero` — full-width image, country name, 1-line impact stat
- `ImpactStatRow` — 3–4 punchy numbers (ha restored, people reached, years active)
- `VideoEmbed` (if available)
- `StoryCards` — 2–3 stories from that country, linked to resource hub
- `CTABlock` → `/partner/` or `/adopt/getting-started`

---

## 2 — Adopt `/adopt/`

> For farmers, field workers, community practitioners, WV programme staff. Mobile-first.

### 2.1 Getting Started `/adopt/getting-started`  [IMPROVE]

**Component requirements:**
- `StepByStepGuide` — numbered steps, collapsible on mobile
- `VideoLibrary` — YouTube/Vimeo embed grid [NEW][GAP: video capability missing]
- `DownloadableResources` — field guides, PDFs, CMS-managed list [NEW]
- `ComplementaryTechniqueBlock` — how FMNR sits alongside other programmes [NEW]
- `CTABlock` → `/adopt/connect` and `/learn/global-activity`

---

### 2.2 Country Examples `/adopt/country-examples`  [IMPROVE]

Links to country sub-pages under `/learn/global-activity/{country}`.
Show as 4-card grid with GGW-style visual treatment.

---

### 2.3 Connect to Adopt `/adopt/connect`  [NEW]

**Component requirements:**
- `LocalContactFinder` — filter by country/region → WV office contact [NEW]
- `StorySubmissionForm` — submit an adoption story [NEW]
- `EDMSignupBlock` — adopter track only
- `CommunityLinks` — LinkedIn group, external community links [NEW]

---

## 3 — Partner `/partner/`  ★ TOP PRIORITY

> All pages in this section are new builds.
> The homepage audience selector must be visible immediately on load — visitors must self-identify within 5 seconds.

### 3.0 Partner Hub landing `/partner/`  [NEW]

**Component requirements:**
- `PartnerHubHero` — headline: "Find your path into the FMNR movement"
- `AudienceSelectorGrid` — 4 large cards:

| Card | Label | Routes to |
|---|---|---|
| 1 | Faith communities | `/partner/faith-based` |
| 2 | NGOs & implementers | `/partner/ngos` |
| 3 | Governments & policy | `/partner/governments` |
| 4 | Funders & supporters | `/partner/funders` |

- `PartnershipPrinciplesBlock` — 3 short principles (why partner, not donate)
- `CTABlock` → `/about/tony-rinaudo` (credibility signal)

---

### 3.1 Faith-based actors `/partner/faith-based`  [NEW][GAP][URGENT]

**Gap (R1):** No faith-specific landing page exists. JR is actively referring faith leaders and partners to the site. This page must be built first.

**URL:** `https://fmnrhub.com.au/partner/faith-based`

**SEO title:** "FMNR & Faith Communities — Partnering for Creation Care"

**Component requirements:**
- `FaithHero` — headline using creation care / stewardship language (not generic "environment")
- `JRIntroBlock` — short personal message from JR, photo, quote [NEW]
- `ValuesAlignmentSection` — 3 columns: creation care · community dignity · restoration theology
- `FaithCaseStudyCards` — 2–3 stories of faith-led FMNR adoption [NEW]
- `FaithNetworkMap` — where faith partners are active globally [NEW]
- `ResourceKit` — downloadable: sermon guide, congregation talking points, shareable assets [NEW]
- `EDMSignupBlock` — partner track, faith-audience copy
- `FaithContactForm` → routes to WV faith engagement team (not generic contact@) [NEW]
- `CTABlock` → `/about/tony-rinaudo`

**Content brief for copywriter:**
- Use "creation care" and "stewardship" language throughout
- Avoid secular environmental framing
- Acknowledge JR as a fellow faith actor, not just a scientist
- Primary CTA: "Get the congregation resource kit"
- Secondary CTA: "Connect with our faith partnerships team"

---

### 3.2 NGOs & implementing orgs `/partner/ngos`  [NEW][GAP]

**Gap (R1):** No NGO-specific landing page. NGO programme managers doing due diligence have no dedicated entry point.

**Component requirements:**
- `NGOHero` — headline: "Integrate FMNR into your programmes"
- `ProgrammeIntegrationSection` — how FMNR sits alongside food security, DRR, livelihoods, climate adaptation
- `TechnicalEvidencePack` — downloadable PDF: research + outcomes data + citations ready for proposal use [NEW]
- `FragileContextData` — results in conflict/displacement/drought contexts [GAP: R6]
- `PartnershipModelBlock` — how other NGOs have partnered with WV to roll out FMNR
- `CountryOutcomeCards` — filterable by region, links to flagship country pages
- `EDMSignupBlock` — partner track
- `NGOEnquiryForm` → routes to WV programme team [NEW]

**Primary CTA:** "Download the technical evidence pack"
**Secondary CTA:** "Enquire about technical partnership"

---

### 3.3 Governments & policy `/partner/governments`  [NEW]

**Component requirements:**
- `GovtHero` — headline: "FMNR at national scale — a policy opportunity"
- `PolicyCaseSection` — alignment to NDC, AFR100, Bonn Challenge, UNCCD language [NEW]
- `NationalScaleEvidence` — Niger 5M ha, Ethiopia adoption — with governance context
- `CostEffectivenessBlock` — FMNR vs tree planting vs other restoration — cost per ha [NEW]
- `WVCountryPresenceMap` — where WV offices can support government rollout
- `PolicyBriefDownload` — 2-page PDF brief for ministers/senior officials [NEW]
- `GovtEnquiryForm` → routes to WV government relations team [NEW]

**Primary CTA:** "Download the policy brief"
**Secondary CTA:** "Speak with our government partnerships team"

---

### 3.4 Funders & supporters `/partner/funders`  [NEW][GAP]

**Gap (R1):** Site reads as a knowledge hub, not an investment opportunity. No funder-specific framing, no cost-effectiveness data, no clear path to a fundraising conversation.

**Note:** Developed in collaboration with WV private funding team. Brief states: "work with private funding on this."

**Component requirements:**
- `FunderHero` — headline: "The highest-leverage land restoration investment available"
- `InvestmentCaseSection` — cost per ha restored, lives improved per dollar, scale potential [NEW]
- `ImpactROITiers` — what $10k / $100k / $1M unlocks — concrete outcomes [NEW]
- `CurrentFundingPriorities` — specific gaps: country programmes, training, research [NEW]
- `WVAccountabilityBlock` — annual reports, audit credentials, stewardship track record
- `FunderStoriesBlock` — what previous funders say about impact [NEW]
- `ConfidentialEnquiryForm` → routes directly to WV private fundraising team [NEW]

**Primary CTA:** "Talk to our funding team"
**Secondary CTA:** "See the impact ROI"

---

## 4 — Impact `/impact/`

> For existing partners, researchers, media, donors doing due diligence.

### 4.1 Resource Hub `/impact/resource-hub`  [IMPROVE][GAP]

**Gap (R3):** Stories, research, and case studies are currently spread across multiple separate pages. Must be consolidated into one unified, filterable hub.

**Component requirements:**
- `ResourceHubHero` — search bar prominent above fold
- `FilterBar` — filter by: Content type (story / research / case study) · Country · Topic · Audience type
- `ResourceGrid` — card grid, CMS-managed, filterable client-side [IMPROVE]
- `FeaturedStoryCarousel` — editorial picks, 3 cards [IMPROVE]
- `StorySubmissionCTA` → `/adopt/connect` submission form
- `EDMSignupBlock` — partner track

---

### 4.2 Impact Dashboard `/impact/dashboard`  [NEW][GAP]

**Gap (R6 + R7):** Livelihood, fragile-context, water/ecosystem metrics and 1B ha vision are all currently absent.

**Component requirements:**
- `ImpactStatHero` — 3 headline numbers: hectares restored · people reached · countries active
- `LivelihoodsMetricSection` — income, food security, resilience outcomes [GAP: R6]
- `FragileContextSection` — results in conflict/displacement/drought settings [GAP: R6]
- `WaterEcosystemSection` — groundwater, biodiversity, rainfall outcomes [GAP: R6]
- `OneBillionHectareSection` — dedicated full-width section: vision statement + progress bar + call to action [GAP: R7]
- `GlobalProgressMap` — hectares by country, updated annually

**Data note:** This is NOT a live data platform. Stats are manually updated by WVA staff. Build with CMS-editable stat fields, not API data feeds.

---

### 4.3 Reporting & Updates `/impact/reporting`  [NEW]

**Component requirements:**
- `AnnualHighlightsBlock` — latest year summary, downloadable PDF
- `NewsletterArchive` — past EDM sends, both tracks [IMPROVE]
- `EDMStrategyVisual` — diagram showing two-track EDM approach for partners/adopters [NEW]
- `LinkedInCommunityBlock` — link to WV FMNR LinkedIn presence [NEW]

---

## 5 — About `/about/`

### 5.1 Tony Rinaudo `/about/tony-rinaudo`  [IMPROVE][GAP]

**Gap (R2):** Tony's page currently lacks external validation signals. Podcasts, awards, press, and embedded media are all missing. This page is a credibility anchor for every audience on the site — especially media, faith leaders, and funders.

**Component requirements:**
- `TonyHero` — full-width portrait, mission statement, primary quote
- `TonyStorySection` — origin story, discovery of underground forest, FMNR journey [IMPROVE]
- `PodcastEmbedGrid` — embedded podcast players (Spotify/Apple/direct) [GAP: R2]
- `ArticlesMediaSection` — press coverage cards with external links [GAP: R2]
- `AwardsRecognitionSection` — award tiles with logos, year, awarding body [GAP: R2]
- `SpeakingEnquiryForm` — keynote / speaking request form [NEW]
- `CTABlock` → `/partner/` and `/about/`

**Primary CTA:** "Invite Tony to speak"
**Secondary CTA:** "Listen to Tony's podcast appearances"

---

### 5.2 About FMNR Hub `/about/fmnr-hub`  [IMPROVE]

**Component requirements:**
- `HubMissionBlock` — what the hub is / what it is not (from brief)
- `WVRelationshipBlock` — World Vision Australia context
- `OpenSourceBlock` — commitment to open knowledge
- `TeamContactBlock` [NEW]

---

### 5.3 Connect `/about/connect`  [IMPROVE]

**Component requirements:**
- `ContactForm` — general enquiry [IMPROVE]
- `EDMSignupBlock` — both tracks visible
- `LinkedInBlock` [NEW]
- `PartnerEnquiryCTA` → `/partner/` [NEW]

> Remove underused "Connect with us" widget from current site if not actively monitored.

---

## Component library — reusable blocks

These components appear across multiple pages. Build once, reuse via WordPress blocks/ACF.

| Component | Used on | Notes |
|---|---|---|
| `EDMSignupBlock` | Homepage, all Partner pages, Resource Hub, Connect | Must support track selection: adopter vs partner |
| `CTABlock` | Every page | Configurable headline + 1–2 buttons |
| `VideoEmbed` | Homepage, Adopt, Country pages | YouTube + Vimeo. Lazy load. |
| `ImpactStatTile` | Dashboard, country pages, evidence | CMS-editable number + label + unit |
| `ResourceCard` | Resource Hub, country pages | Image + type badge + title + country tag + CTA |
| `AudienceSelectorGrid` | Homepage, Partner hub | 4 cards, icon + label + route |
| `OneBillionHectareSection` | Homepage, Fundamentals, Dashboard | Full-width, consistent treatment site-wide |
| `FlagshipCountryCard` | Global Activity, Adopt | Image + country + 1 stat + link |
| `FaithCaseStudyCard` | Faith-based partner page | Story card with faith-context tag |
| `DownloadBlock` | NGO, Govt, Funder, Tony pages | File name + description + download CTA |
| `EnquiryForm` | All Partner pages | Must route to correct WV team per audience |

---

## URL map (complete)

```
/                                   Homepage
/learn/                             Learn hub
/learn/fmnr-fundamentals            FMNR Fundamentals
/learn/evidence                     Science & Evidence
/learn/global-activity              Global Activity + map
/learn/global-activity/niger        Niger country page
/learn/global-activity/ethiopia     Ethiopia country page
/learn/global-activity/zambia       Zambia country page
/learn/global-activity/mali         Mali country page

/adopt/                             Adopt hub
/adopt/getting-started              Getting Started
/adopt/country-examples             Country Examples
/adopt/connect                      Connect to Adopt

/partner/                           Partner Hub landing     ★ TOP PRIORITY
/partner/faith-based                Faith-based actors      ★ BUILD FIRST
/partner/ngos                       NGOs & implementers
/partner/governments                Governments & policy
/partner/funders                    Funders & supporters

/impact/                            Impact hub
/impact/resource-hub                Resource Hub (unified)
/impact/dashboard                   Impact Dashboard
/impact/reporting                   Reporting & Updates

/about/                             About hub
/about/tony-rinaudo                 Tony Rinaudo
/about/fmnr-hub                     About FMNR Hub
/about/connect                      Connect / Contact
```

---

## Brief requirement cross-reference

| ID | Requirement | Page(s) | Status |
|---|---|---|---|
| R1 | Dedicated landing pages: faith, NGO, funder | `/partner/faith-based` `/partner/ngos` `/partner/funders` | 🔴 All missing — build first |
| R2 | Tony page: podcasts, articles, awards | `/about/tony-rinaudo` | 🔴 All missing |
| R3 | Consolidated Resource Hub | `/impact/resource-hub` | 🟡 Page exists, not unified |
| R4 | Global map: WV offices + adopter layer | `/learn/global-activity` | 🟡 Map exists, layers missing |
| R5 | FMNR Fundamentals → carousel format | `/learn/fmnr-fundamentals` | 🟡 Page exists, format wrong |
| R6 | Impact: livelihoods, fragile, water | `/impact/dashboard` | 🔴 All missing |
| R7 | 1-billion-hectare vision endorsed site-wide | Homepage + Fundamentals + Dashboard | 🔴 Not present |
| R8 | EDM content strategy (not just sign-up box) | Homepage + `/impact/reporting` | 🟡 Box exists, strategy undefined |

> 🔴 Missing entirely — must build
> 🟡 Partially exists — must improve

---

## Key contacts (from IE mini brief)

**World Vision Australia**
- Lauren Lailaw — Change Lead, FMNR Scale Up
- Fiona O'Loghlin — FMNR Global Engagement Lead
- Lachlan McIntyre — Head of Digital Delivery
- Leslie Timm — Digital Delivery Lead

**IE (agency)**
- Rakesh Patel — CFO
- Jason Watt — Developer
- Adam McLeod — Product

---

*Source: FMNR IE Mini Brief + WVA brainstorm session (Thursday 5 March 2026) + IA workshop*
*Stack: WordPress · ACF · YouTube/Vimeo embed · Mobile-first · CMS-editable by WVA staff*
