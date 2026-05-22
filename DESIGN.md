---
name: Maha e-Seva Kendra
colors:
  surface: '#fcf8ff'
  surface-dim: '#dad7f3'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#efecff'
  surface-container-high: '#e8e5ff'
  surface-container-highest: '#e2e0fc'
  on-surface: '#1a1a2e'
  on-surface-variant: '#454650'
  inverse-surface: '#2f2e43'
  inverse-on-surface: '#f2efff'
  outline: '#757681'
  outline-variant: '#c5c5d1'
  surface-tint: '#4a5b9a'
  primary: '#000b35'
  on-primary: '#ffffff'
  primary-container: '#0a1f5c'
  on-primary-container: '#7889cb'
  inverse-primary: '#b7c4ff'
  secondary: '#755b00'
  on-secondary: '#ffffff'
  secondary-container: '#fed977'
  on-secondary-container: '#785d00'
  tertiary: '#001404'
  on-tertiary: '#ffffff'
  tertiary-container: '#002c0f'
  on-tertiary-container: '#00a249'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#324380'
  secondary-fixed: '#ffe08f'
  secondary-fixed-dim: '#e6c364'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#584400'
  tertiary-fixed: '#66ff8e'
  tertiary-fixed-dim: '#3de273'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005322'
  background: '#fcf8ff'
  on-background: '#1a1a2e'
  surface-variant: '#e2e0fc'
typography:
  display-hero:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-section:
    fontFamily: Playfair Display
    fontSize: 38px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-section-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
  body-main:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-marathi:
    fontFamily: Tiro Devanagari Marathi
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
  code-id:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding-desktop: 80px
  container-padding-mobile: 20px
  gutter: 24px
  section-gap: 120px
  decorative-underline-height: 3px
  decorative-underline-width: 48px
---

## Brand & Style

The design system is crafted for a prestigious government services portal that balances traditional authority with modern digital efficiency. The brand personality is **Institutional, Trustworthy, and Sophisticated**, designed to evoke a sense of reliability for citizens accessing essential services.

The design style is a blend of **Corporate Modern** and **Luxury Editorial**. It utilizes high-contrast typography and a rich, regal color palette to differentiate itself from standard utilitarian government portals. The aesthetic prioritizes clarity and dignity, ensuring that even complex bureaucratic processes feel accessible and high-end. Visual interest is maintained through purposeful gold accents and fluid section dividers that soften the structured navy layouts.

## Colors

The palette is anchored by **Primary Navy**, representing stability and governmental authority. **Deep Navy** is reserved for headers, footers, and high-emphasis containers to provide grounding depth. 

**Rich Gold** acts as the primary accent, used for interactive elements and decorative highlights to signify "Golden Service" quality. **Gold Glow** provides a soft, warm alternative to stark white for background surfaces, reducing eye strain and adding a premium feel. **WhatsApp Green** is integrated specifically for citizen support channels, while **Success Green** handles transactional confirmations. **Charcoal** is the exclusive color for body text to ensure maximum legibility against light backgrounds.

## Typography

This design system employs a multi-script typographic hierarchy. **Playfair Display** is used for high-level headings to convey elegance and tradition. For all Marathi script content, **Tiro Devanagari Marathi** is used at a slightly larger optical size (18px) to maintain parity with English legibility.

**DM Sans** serves as the workhorse for UI components and body copy, chosen for its neutral and modern geometric profile. For application IDs, tracking numbers, and technical codes, **JetBrains Mono** ensures character distinctness (e.g., distinguishing '0' from 'O'). All major headings should feature a **Gold Underline** (3px height, 48px width) aligned to the left or center based on the layout context.

## Layout & Spacing

The design system follows a **Fixed Grid** model for desktop (1200px max-width) and a **Fluid Grid** for mobile devices. 
- **Desktop:** 12-column grid with 24px gutters and 80px side margins.
- **Tablet:** 8-column grid with 20px gutters and 40px side margins.
- **Mobile:** 4-column grid with 16px gutters and 20px side margins.

A generous vertical rhythm is maintained with 120px gaps between major landing page sections to allow the elegant typography room to breathe. Section transitions are often marked by **SVG Wave Dividers** in Navy or Gold Glow to break the rigidity of the grid and symbolize the "flow" of public service.

## Elevation & Depth

Visual hierarchy is established using **Tonal Layers** combined with **Ambient Shadows** tinted with the primary brand color. 

Rather than neutral grey shadows, this system uses `rgba(10, 31, 92, 0.12)` for standard elevation. This creates a "submerged" depth effect that feels more integrated with the navy brand palette. 
- **Low Elevation:** Used for cards and input fields. Soft 4px blur with no offset.
- **High Elevation:** Used for floating action buttons and modals. 16px blur with an 8px vertical offset.
- **Gold Accents:** Surface borders may occasionally use a 1px solid Rich Gold stroke instead of a shadow to highlight featured service categories.

## Shapes

The shape language is "Mixed Geometric." While the core UI utilizes a standard **Rounded (2)** logic, specific components deviate to create a distinctive silhouette:
- **Buttons and Chips:** Use a full **Pill-shape (50px)** to feel approachable and modern.
- **Service Cards:** Use a **16px radius** to balance softness with the structured nature of the grid.
- **Icon Backdrops:** Use a **12px radius** to create a "squircle" effect that houses service icons within the Primary Navy or Rich Gold theme.

## Components

### Buttons
Primary buttons are Pill-shaped with a **Rich Gold (#C9A84C)** background and **Deep Navy (#061244)** text. Hover states should transition to **Light Gold (#E8C97A)**. Secondary buttons use a Primary Navy outline with a 2px stroke.

### Input Fields
Fields use a 1px stroke in Primary Navy (20% opacity) with a 12px corner radius. The focus state transitions the stroke to Rich Gold with a soft Navy glow shadow. Labels always use **DM Sans Bold** in Charcoal.

### Service Cards
Cards feature a white or Gold Glow background, a 16px corner radius, and a subtle Navy-tinted shadow. They include a 12px rounded icon container in the top-left and a "Learn More" link in DM Sans Bold with a Chevron icon.

### Status Chips
Used for application tracking (e.g., "Pending," "Approved"). These are small pill-shaped elements. "Approved" uses **Success Green** with white text; "Pending" uses **Rich Gold** with Navy text.

### WhatsApp Float
A persistent floating action button in **WhatsApp Green (#25D366)**, circular with a white icon, positioned in the bottom-right corner for immediate citizen assistance.