# Care & Flair Website Full Technical Specification

## 0. Головне правило

Цей сайт не має бути статичною “вітриною”, де все зашито в коді.

ВСЕ, що бачить клієнт на сайті, має максимально керуватись з адмінки:

- тексти;
- заголовки;
- описи;
- ціни;
- пакети;
- property categories;
- property types;
- optional upgrades;
- CTA mappings;
- секції homepage;
- порядок секцій;
- visibility on/off;
- before/after images;
- service cards;
- SEO meta;
- areas served;
- FAQs;
- testimonials;
- quote builder logic;
- form fields;
- required/optional fields;
- admin presets.

Код має бути стабільною системою, а контент має редагуватись через admin.

---

# 1. Project overview

## Project name

Care & Flair website rebuild / stabilization.

## Business positioning

Care & Flair is not a generic handyman or cleaning company.

Care & Flair must be positioned as:

Property Turnover, Reset & Maintenance Specialist

The website must communicate that Care & Flair helps:

- landlords;
- letting agents;
- estate agents;
- Airbnb / short-let hosts;
- presentation-focused homeowners;
- property managers;

with:

- fast property resets;
- 24h / 48h / 72h readiness;
- end-of-tenancy recovery;
- mid-tenancy cosmetic resets;
- move-in / move-out preparation;
- cleaning + minor maintenance in one service;
- exterior and interior presentation upgrades;
- anti-mould / odour / carpet / silicone / pressure washing solutions;
- Guardian property oversight plans.

## Primary commercial objective

Generate qualified quote requests through a guided quote builder.

## Secondary objectives

- clearly present 24h / 48h / 72h reset packages;
- upsell optional upgrades;
- present Guardian plans as recurring / premium property oversight;
- create trust with landlords and agents;
- show before/after transformation;
- improve local SEO for Bromley, South East London, Kent, Medway, Rochester;
- make the site easy to manage from admin without code changes.

---

# 2. Target audience

## Main audiences

1. Letting / estate agents
 - want fast turnaround;
 - want reliable service;
 - want fewer contractors;
 - care about tenant-ready presentation;
 - care about deposit disputes and inspection readiness.

2. Landlords
 - want to reduce void periods;
 - want better presentation for rental;
 - want maintenance + cleaning in one place;
 - want predictable “from” pricing.

3. Airbnb / short-let hosts
 - want fast guest-ready recovery;
 - want presentation, hygiene and reliability;
 - may need recurring support.

4. Homeowners selling or preparing a property
 - want better visual presentation;
 - want “ready to list” or “ready for viewing” feel.

---

# 3. Tone and brand style

## Brand feel

Premium, reliable, practical, modern.

Not cheap handyman.
Not generic cleaner.
Not over-luxury nonsense.

Visual direction:

- dark / clean premium sections;
- white / light sections for clarity;
- strong before/after visuals;
- bento-style cards;
- Apple-like clean spacing;
- high contrast typography;
- clear CTA buttons;
- mobile-first layout;
- no clutter;
- no random stock-photo overload.

## Copy style

Use PSR style where useful:

- Problem
- Solution
- Result

Example:

Problem: Empty property means lost rent every day.
Solution: 24h reset with cleaning, touch-ups and rapid presentation fixes.
Result: Property ready for viewings faster.

Language:

- English for website UI;
- clear, professional, direct;
- no fake guarantees;
- no overpromising;
- conversion-focused.

---

# 4. Core site structure

## Required pages

Minimum:

1. Home
2. Services
3. Reset Packages
4. Quote Builder / Get Quote
5. Guardian Plans
6. Before & After
7. About
8. Contact
9. Areas Served
10. Admin

Optional later:

11. Service detail pages
12. Blog / Guides
13. Landing pages per location
14. Landing pages per service
15. Client portal
16. Worker portal

---

# 5. Homepage required sections

Homepage should be fully managed from admin.

## 5.1 Hero section

Admin-controllable fields:- eyebrow text;
- main headline;
- subheadline;
- primary CTA text;
- primary CTA behavior;
- secondary CTA text;
- secondary CTA behavior;
- hero image / video / background;
- trust badges;
- visible on/off;
- order position.

Suggested copy:

Eyebrow:
Property Turnover & Maintenance Specialist

Headline:
Make Your Property Ready in 24-72 Hours

Subheadline:
Fast cleaning, cosmetic repairs and presentation upgrades for landlords, agents and Airbnb hosts across Bromley, South East London and Kent.

Primary CTA:
Build Your Quote

Secondary CTA:
View Reset Packages

Trust badges:
- 24h / 48h / 72h readiness
- Cleaning + maintenance in one visit
- Ideal for landlords, agents and Airbnb hosts
- Bromley, South East London & Kent

---

## 5.2 Reset Packages section

Title:
The Reset Packages

Subtitle:
Choose the level of preparation your property needs.

Must support category-aware packages:

- Flats & Apartments
- Houses

Admin must control:

- package name;
- package slug/id;
- category availability;
- package description;
- starting price;
- included services;
- featured badge;
- order;
- visibility;
- CTA mapping;
- image;
- icon;
- micro-guarantees;
- PSR text.

### Package 1: 24h Express Reset

Public name:
24h Express Reset

Slogan:
Instant Market Readiness

Starting price:
from £595

Positioning:
Fast-track property reset for urgent viewing, listing or guest-readiness.

Problem:
The property is empty and every day costs rental income or booking potential.

Solution:
High-speed cleaning, hygiene recovery and minor presentation fixes in one visit.

Result:
A property that looks cleaner, sharper and ready for the next step.

Suggested included items:

- deep clean of all rooms;
- kitchen degreasing;
- appliance clean;
- bathroom descaling and sanitising;
- internal window cleaning;
- carpet extraction where required;
- minor plumbing refresh such as traps and taps;
- wall touch-ups;
- wet area silicone refresh;
- basic electrical and window mechanism check;
- light garden tidy where applicable;
- optional overnight dehumidifier treatment.

CTA:
Get Quote for 24h Reset

---

### Package 2: 48h Pro Flair Reset

Public name:
48h Pro Flair Reset

Slogan:
Our Signature Property Reset Experience

Starting price:
from £1195

Positioning:
The main recommended package for landlords and agents who want stronger presentation and ROI.

Problem:
The property needs more than cleaning. It needs a visible reset before listing, viewing or handover.

Solution:
Cleaning, anti-mould treatment, touch-ups, wall refresh and detail work combined into one coordinated service.

Result:
A sharper, fresher property with stronger market presentation.

Suggested included items:

- everything in 24h Express Reset;
- full wall and ceiling refresh, 1 coat where suitable;
- anti-mould removal and protective treatment;
- deep internal window and frame detailing;
- wet area silicone refresh;
- professional cleaning certificate / TDS-style completion note;
- photo-ready presentation finish.

CTA:
Get Quote for 48h Reset

---

### Package 3: 72h Ultimate Reset

Public name:
72h Ultimate Reset

Slogan:
Maximum ROI Property Presentation

Starting price:
from £1600

Positioning:
For properties that need the strongest visual reset and “new build feel”.

Problem:
The property feels tired, marked, neglected or below its income potential.

Solution:
A deeper cleaning, repainting, detailing, exterior base clean and bathroom/kitchen presentation recovery.

Result:
A stronger, fresher property ready for premium photos, viewings, tenants or guests.

Suggested included items:

- everything in 48h Pro Flair Reset;
- 2 coat repaint where required;
- woodwork detailing such as skirtings, frames, doors;
- grout refresh / replacement where suitable;
- bathroom face-lift options;
- exterior base clean such as patio or driveway pressure washing;
- external window cleaning where suitable;
- premium final detailing.

CTA:
Get Quote for 72h Reset

---

## 5.3 Flair Solutions section

This is a grid of optional upgrade cards.

Admin must control:- title;
- slug;
- category;
- image;
- icon;
- problem text;
- solution text;
- result text;
- starting price;
- visibility;
- visible for flats;
- visible for houses;
- CTA mapping;
- order;
- featured status.

Required solution cards:

1. Driveway & Patio Revival
 - Problem: moss, oil, algae and tired surfaces reduce curb appeal.
 - Solution: HD pressure washing and optional Bio-Shield treatment.
 - Result: sharper entrance and stronger first impression.

2. Window & Frame Detail
 - Problem: dirty frames and dull glass make the property feel neglected.
 - Solution: deep internal frame and glass detail, with external clean where suitable.
 - Result: brighter rooms and better viewing photos.

3. Anti-Mould Shield
 - Problem: visible mould damages trust and can delay letting or sale.
 - Solution: targeted mould removal, fungicidal treatment and moisture-control advice.
 - Result: cleaner, safer-looking wet areas.

4. Odour Elimination
 - Problem: smells from pets, damp, smoke or tenants make viewings difficult.
 - Solution: targeted cleaning, deodorising and controlled ozone treatment where appropriate.
 - Result: fresher first impression.

5. Carpet Extraction
 - Problem: carpets hold stains, odours and tenant history.
 - Solution: professional hot water extraction with Kärcher Puzzi-style workflow.
 - Result: cleaner, fresher carpets with faster presentation recovery.

6. Bathroom Face-Lift
 - Problem: mouldy silicone, tired grout and limescale make bathrooms look old.
 - Solution: silicone removal/reseal, grout refresh, descaling and detail clean.
 - Result: “new bathroom feel” without full renovation.

7. Kitchen Deep Reset
 - Problem: grease, appliances and cabinets can ruin the first impression.
 - Solution: degreasing, appliance clean, cabinet detail and hygiene reset.
 - Result: cleaner kitchen ready for photos, tenants or guests.

8. Deposit Saver Touch-Ups
 - Problem: small marks and defects can create inspection issues.
 - Solution: targeted wall, trim and minor repair touch-ups.
 - Result: fewer visible defects and better inspection readiness.

9. Efflorescence & Brick Restoration
 - Problem: white salts and stained brickwork look like damp or neglect.
 - Solution: controlled cleaning and neutralisation where suitable.
 - Result: cleaner external presentation.

10. Guardian Property Oversight
 - Problem: small issues become expensive when nobody checks regularly.
 - Solution: recurring inspections, reports and small fixes.
 - Result: less stress for landlords and better property control.

---

## 5.4 Before / After section

Admin must control:

- image pairs;
- title;
- category;
- service type;
- description;
- location;
- visible on/off;
- order;
- featured;
- slider settings.

Frontend requirements:

- before/after slider with draggable divider;
- mobile-friendly;
- no layout shift;
- optimized images;
- captions optional.

---

## 5.5 Guardian Plans section

Guardian must be positioned as recurring property oversight.

Admin controls:

- plan name;
- price;
- billing period;
- included checks;
- visible on/off;
- CTA mapping;
- recommended badge;
- order.

Suggested plans:

1. Guardian Basic
 - monthly light property check;
 - visual inspection;
 - issue report;
 - priority booking.

2. Guardian Plus
 - more detailed inspection;
 - small fixes allowance;
 - photo report;
 - seasonal maintenance reminder.

3. Guardian Pro
 - premium oversight for landlords / Airbnb hosts;
 - regular reporting;
 - minor maintenance coordination;
 - emergency priority.

---

## 5.6 Testimonials / trust section

Admin controls:

- testimonial text;
- client type;
- client name or anonymous label;
- rating;
- location;
- visibility;
- order.

Client type examples:

- Landlord
- Letting Agent
- Airbnb Host
- Homeowner

---

## 5.7 FAQ section

Admin controls:

- question;
- answer;
- category;
- visibility;
- order.

Required FAQ topics:- How fast can you prepare a property?
- Do you work with landlords and agents?
- Do you provide cleaning certificates?
- Do you do repairs and cleaning together?
- Are prices fixed or estimated?
- Do you cover Bromley / South East London / Kent?
- Can you help with Airbnb turnover?
- Can you remove mould?
- Can you pressure wash patios and driveways?
- Do you handle urgent jobs?

---

# 6. Quote Builder

This is the most important conversion feature.

## Goal

User should be able to build a quote quickly without confusion.

## Quote Builder steps

### Step 1: Choose service package

Options from admin:

- 24h Express Reset
- 48h Pro Flair Reset
- 72h Ultimate Reset
- Bathroom Face-Lift
- Kitchen Deep Reset
- Carpet Extraction
- Odour Elimination
- Driveway / Patio Revival
- Guardian Subscription
- Custom Service

Admin controls:

- package availability;
- default selected package;
- package description;
- package price;
- package image;
- package icon;
- visibility;
- CTA mapping.

---

### Step 2: Choose property category

Required categories:

1. Flats & Apartments
2. Houses

Admin can add/edit/hide categories.

---

### Step 3: Choose property type

Examples for Flats & Apartments:

- Studio
- 1-Bed Flat
- 2-Bed Flat
- 3-Bed Flat
- 4+ Bed Flat

Examples for Houses:

- 2-Bed House
- 3-Bed House
- 4-Bed House
- 5+ Bed House

Admin controls:

- property type name;
- category relation;
- order;
- visibility;
- pricing multiplier or direct matrix price.

---

### Step 4: Optional upgrades

Show only upgrades relevant to selected category and package.

Admin controls:

- upgrade title;
- description;
- base price;
- price override for flats;
- price override for houses;
- visible for flats;
- visible for houses;
- visible for package;
- order;
- icon;
- image.

Example upgrades:

- Carpet Extraction
- Anti-Mould Shield
- Window & Frame Detail
- Driveway & Patio Revival
- Odour Elimination
- Bathroom Face-Lift
- Kitchen Deep Reset
- Garden Tidy
- External Window Cleaning
- Dehumidifier Overnight Treatment

---

### Step 5: Contact and summary

Fields:

- name;
- phone;
- email;
- postcode;
- property address optional;
- preferred date;
- urgency;
- property access notes;
- upload photos;
- message;
- consent checkbox.

Admin controls:

- visible fields;
- required fields;
- field labels;
- helper text;
- placeholder text.

---

## Quote estimate logic

Use admin pricing matrix.

Required matrix:

```text
package × property category × property type = from price
```

---

# Visual System, Before/After, Carousels & Media-Driven Conversion Layer

## 1. Головний принцип

Care & Flair продає не просто послуги. Care & Flair продає видимий результат.

Сайт має бути максимально візуальним, тому що клієнти у Великій Британії, особливо landlords, letting agents, Airbnb hosts і homeowners, хочуть бачити доказ:

- як було before;
- що саме було зроблено;
- як стало after;
- чому це підвищує шанс здачі, продажу або кращої презентації property.

Текст не повинен бути головним доказом. Головний доказ - візуальна трансформація.

## 2. Обовʼязкові visual modules

Сайт повинен підтримувати такі візуальні модулі:

1. Hero visual block
2. Before/After draggable slider
3. Before/After carousel
4. Case study gallery
5. Service image cards
6. Reset Package visual cards
7. Flair Solutions visual grid
8. Triptych / 3-panel visual gallery
9. Image comparison cards
10. Featured transformation section
11. Mobile swipe carousel
12. Admin-managed media library
13. Visual CTA blocks
14. Location-based transformation gallery

Усі ці елементи мають бути admin-ready через data layer.

## 3. Hero visual requirements

Hero section має підтримувати:

- background image;
- background video optional later;
- main image;
- overlay gradient;
- trust badges;
- before/after mini-preview;
- CTA buttons;
- image alt text;
- mobile-specific image;
- visibility on/off;
- admin-controlled content.

Hero не має виглядати як generic handyman website.

Hero має передавати:

Property ready faster.
Better presentation.
Less void time.
Cleaning + maintenance + visual reset in one coordinated service.

## 4. Before/After draggable slider

Обовʼязкова функція:

Користувач має бачити один блок, де before і after накладені одне на одне, а посередині draggable divider / повзунок.

Requirements:

- draggable vertical divider;
- works on mobile touch;
- works on desktop mouse;
- labels: Before / After;
- image alt text;
- no layout shift;
- smooth interaction;
- fallback if one image missing;
- admin-controlled before image;
- admin-controlled after image;
- admin-controlled title, location, service type, description;
- CTA: “Get Quote for Similar Result”.

Fields:

- id
- title
- slug
- beforeImage
- afterImage
- beforeAlt
- afterAlt
- category
- serviceType
- propertyType
- location
- description
- resultSummary
- featured
- visible
- showOnHomepage
- order
- ctaLabel
- ctaPreset

## 5. Before/After carousel

Homepage має мати не просто одну before/after картинку, а carousel.

Requirements:

- swipeable on mobile;
- arrows on desktop;
- dots/pagination;
- featured transformations first;
- admin-controlled order;
- category filter optional;
- each item opens a larger view or links to /before-after;
- each card has CTA.

Carousel card має показувати:

- before/after preview;
- service type;
- location;
- short result line;
- CTA.

Example result lines:

- “Bathroom resealed and presentation-ready.”
- “Driveway cleaned for stronger curb appeal.”
- “Mould removed and wet area refreshed.”
- “Kitchen degreased and tenant-ready.”
- “Carpets extracted for fresher viewing presentation.”

## 6. Dedicated /before-after page

Create a dedicated page:

/before-after

This page must be a strong conversion page, not a small gallery.

Required sections:

1. Page hero
 - title
 - subtitle
 - CTA to quote builder

2. Filter bar
 - All
 - Bathroom
 - Kitchen
 - Mould
 - Carpet
 - Patio / Driveway
 - Full Property Reset
 - Windows / Frames
 - Garden / Exterior

3. Featured case slider
 - large draggable before/after

4. Case gallery grid
 - multiple before/after cards
