---
name: Sahabat Belajar TKA
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#784b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#996100'
  on-tertiary-container: '#ffeedd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system is engineered for Indonesian Middle School (Sekolah Menengah Pertama / SMP, ages 12–15) students preparing for high-stakes Academic Potential Tests (Tes Kemampuan Akademik / TKA). The core brand archetype is an encouraging, trustworthy study mentor—approachable rather than authoritative, upbeat without being childish, and calm under exam anxiety.

### Aesthetic Direction
A modern, tactile, friendly clean-tech interface built specifically for 390px mobile screens. It pairs crisp, light surfaces with rounded, pill-like interactive elements, soft layered elevation, and a distinct gamified warmth. 

### Psychologically Safe Learning Environment
Exam preparation often induces acute test anxiety among young teens. The system establishes a strict **"Safe-to-Fail"** paradigm:
- The color red is completely banned from the product interface—even for failed questions, incorrect choices, or diagnostic drops.
- Negative states are replaced by warm, non-judgmental amber accents that frame mistakes as "Coba Lagi" (Try Again) opportunities rather than deficits.
- Cognitive load is minimized by compartmentalizing questions into digestible, single-focus cards with generous whitespace, eliminating visual clutter and timed panic cues.

## Colors
The color system emphasizes emotional stability, clear instructional cues, and psychological safety.

### Core Color Roles
- **Primary (Royal Blue - `#2563EB`)**: Anchors student focus, conveys institutional trust, and guides primary actions. Deep variant `#1D4ED8` serves for pressed states and dark text accents, `#3B82F6` for interactive elements, and `#EFF6FF` for card surfaces and subtle highlights.
- **Secondary / Mastery (Emerald Mint - `#10B981`)**: Signals progress, completion, correct logic, and mastery streaks. Supported by `#059669` for text contrast on light badges and `#ECFDF5` for success banner backgrounds.
- **Tertiary / Safe-to-Fail (Warm Amber - `#F59E0B`)**: Designates revision items, pending topics, and incorrect answer choices. Supported by `#D97706` for clear iconography and `#FFFBEB` for non-punitive feedback containers. **Red is never used anywhere in the platform.**
- **Neutrals (Slate Tones)**:
  - Base canvas: `#F8FAFC`
  - Elevated surfaces: `#FFFFFF`
  - Structural dividers and borders: `#E2E8F0`
  - Secondary/Locked metadata: `#94A3B8`
  - Main body text: `#1E293B`
  - Subheaders and supporting text: `#64748B`

### Accessibility & Contrast Rules
All text elements maintain WCAG AA compliance (minimum 4.5:1 for body copy and 3:1 for large headers). State indicators must never rely solely on color; they must pair color fills with clear microcopy (e.g., "Tepat Sekali!", "Perlu Ditinjau") and iconography (e.g., rounded checkmark, lightbulb cue).

## Typography
Plus Jakarta Sans delivers friendly geometric clarity, soft terminals, and legibility on mobile screens. Generous line heights accommodate early teens processing complex logical and verbal reasoning stems.

### Type Hierarchy Usage
- **headline-lg**: Reserved for celebration screens, score summaries, and home greetings ("Halo, Budi!").
- **headline-md**: Section titles, modular test units, and category headers.
- **headline-sm**: Card titles, question numbers ("Soal No. 12"), and dialog prompts.
- **body-lg**: Question stems, reading comprehension passages, and primary feedback explanations.
- **body-md**: Standard multiple-choice option text, explanatory tips, and modal details.
- **body-sm**: Timestamps, hints, and locked-module descriptions.
- **label-lg**: Primary button text, tab items, and bottom sheet action buttons.
- **label-md / label-sm**: Pill badges, XP counters, difficulty meters, and status tags.

## Layout & Spacing
The layout architecture is mobile-first, targeting an ideal baseline viewport of **390px** width.

### Layout System
- **Grid Structure**: 4-column fluid mobile grid with `16px` (`1rem`) margins and `16px` (`1rem`) gutters.
- **Desktop/Tablet Fallback**: On screens wider than 640px, the application centers in a dedicated single-column container capped at `440px` max-width, preserving the phone-native interaction model.
- **Vertical Rhythm**: Built upon a strict 4px/8px modular scale. Question workflows use `space-md` (`16px`) between multiple-choice options and `space-xl` (`32px`) between test segments to ensure comfortable thumb navigation.
- **Safe Area Insets**: Floating bottom navigation bars and fixed answer CTAs automatically account for iOS/Android home indicators by injecting a dynamic `env(safe-area-inset-bottom) + 16px` padding zone.

## Elevation & Depth
Depth is created through layered soft surfaces and tinted ambient shadows rather than stark drop-shadows, maintaining a light and cheerful tone.

### Elevation Hierarchy
- **Level 0 (Canvas Base)**: Flat `#F8FAFC`. Houses background scrolls and non-interactive layout boundaries.
- **Level 1 (Bite-Sized Cards & Panels)**: Pure `#FFFFFF` resting on Level 0. Outlined with a subtle, low-contrast stroke (`1px solid #E2E8F0`) and softened with an ambient shadow: `0px 4px 16px -2px rgba(100, 116, 139, 0.08)`.
- **Level 2 (Interactive Floating Controls & Pickers)**: Elevated question pills, active bottom sheets, and answer choice cards. Uses a double shadow: `0px 2px 4px rgba(37, 99, 235, 0.04), 0px 8px 24px -4px rgba(100, 116, 139, 0.12)`.
- **Level 3 (Modal Overlays & Reinforcement Sheets)**: Full bottom sheets for answer explanations and celebratory completion drawers: `0px -8px 32px rgba(15, 23, 42, 0.12)`.
- **Tactile Button Press State**: Key CTA buttons feature a 3D tactile bottom border (`3px solid #1D4ED8`) that depresses flat (`translateY(2px)`) on tap, providing immediate physical feedback.

## Shapes
Roundedness Level 2 sets the base curve at `0.5rem` (`8px`), scaling up to `1rem` (`16px`) for `rounded-lg` and `1.5rem` (`24px`) for `rounded-xl`.

### Corner Application
- **Bite-Sized Problem Cards**: `rounded-2xl` (`24px`) for a soft, friendly look.
- **Buttons and Selectable Options**: Fully rounded pill shapes (`rounded-full`) or `rounded-xl` (`16px`) to ensure touch-friendly interaction targets.
- **Badges and Gamified XP Counters**: Pill-shaped (`rounded-full`) with balanced internal padding (`py-1 px-3`).
- **Explanation Bottom Drawers**: Asymmetric rounding with `rounded-t-3xl` (`28px` top corners, `0px` bottom) to anchor upward content reveals smoothly.

## Components

### 1. Buttons
- **Primary CTA**: Height `52px`, `rounded-xl`, filled with `#2563EB`, text in `label-lg` white. Includes a subtle bottom tactile lip (`#1D4ED8`). Active tap compresses the lip with a 2px downward shift.
- **Safe-to-Fail Action ("Pelajari Lagi")**: Height `44px`, `rounded-xl`, filled with `#FFFBEB`, border `1.5px solid #F59E0B`, text in `#D97706`.
- **Ghost/Tertiary**: Height `40px`, `rounded-full`, transparent background, text in `#64748B`.

### 2. Multiple-Choice Option Cards
- Unselected: White background, `1.5px solid #E2E8F0`, `rounded-xl`, padding `16px`, option letter pill (`A`, `B`, `C`, `D`) set in a `#F1F5F9` circular container with `#475569` text.
- Selected (Pending): `#EFF6FF` background, `2px solid #2563EB`, option letter pill in `#2563EB` with white text.
- Correct Feedback State: `#ECFDF5` background, `2px solid #10B981`, checkmark icon inside an emerald badge, supportive text ("Hebat! Jawabanmu benar").
- Re-check State (Safe-to-Fail): `#FFFBEB` background, `2px solid #F59E0B`, subtle lightbulb icon inside a warm amber badge, text: "Ayo periksa kembali langkah ini". **Never displays red outlines or harsh cross icons.**

### 3. Gamification Badges & Chips
- XP / Streak Chip: `#FFFBEB` pill with `#F59E0B` text and fire/star glyph.
- Diagnostic Level Indicator: `#EFF6FF` pill, `#2563EB` text (`label-sm`), displaying test track indicators (e.g., "Penalaran Verbal", "Pola Barisan").
- Status: Locked modules feature `#F1F5F9` background, `#94A3B8` icon/label, and clean padlock graphic without alarming visual weights.

### 4. Input Fields
- Numeric/Math Reasoning Inputs: Height `52px`, `rounded-xl`, background `#FFFFFF`, border `1.5px solid #CBD5E1`. Focused state transitions to `2px solid #2563EB` with an ambient glow (`box-shadow: 0 0 0 4px #EFF6FF`).

### 5. Bite-Sized Cards
- Standard Question Container: Background `#FFFFFF`, padding `20px`, `rounded-2xl`, Level 1 ambient elevation. Contains question counter, hint trigger, question stem, and optional math diagram container framed with `#F8FAFC` rounded inner tiles.

### 6. Progress Bars & Micro-Feedback
- Track: Height `8px`, `#E2E8F0`, `rounded-full`.
- Fill: Smooth animated gradient (`#3B82F6` to `#10B981`), rounded end-caps. Includes an optional small floating pill showing question milestone completion (e.g., "8/10").