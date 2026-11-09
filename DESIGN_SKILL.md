---
name: agra-ui-system
description: Strict v2 UI/UX Design System for AGRA. Enforces 100% Onest font ONLY (zero monospace/JetBrains Mono), zero low-contrast grey text, zero unrequested status widgets/badges/overlines, 48x48dp buttons, and SalvaMedic editorial layout.
---

# AGRA — Strict v2 UI/UX Design Skill (Zero Mono, Zero Grey Text, Zero Unrequested Widgets)

## 1. ABSOLUTE BANS (NEVER DO THESE UNDER ANY CIRCUMSTANCES)
1. **NO `JetBrains Mono` OR `font-mono` ANYWHERE:**
   - NEVER use `font-mono` or `JetBrains Mono`. Numbers (`0`, `90%`, `01`, `30`) must NEVER have a dot or slash inside the `0`.
   - Use **ONLY 1 FONT across the entire website: `'Onest', sans-serif`**.
2. **NO UNREQUESTED ELEMENTS, OVERLINES, OR CORNER STATUS WIDGETS:**
   - NEVER invent fake status bars in corners (e.g., `STATUS RUANG UJIAN`, `• 73:53 CBT`, `Online/Offline` chips).
   - NEVER add uppercase robotic overlines above titles (e.g., `OTENTIKASI PESERTA DIDIK`, `PORTAL ASESMEN`, `PILIH DOMAIN`).
   - NEVER add uppercase text inside horizontal dividers (e.g., `—— ATAU KREDENSIAL AKUN ——`).
   - NEVER add role badges (`[ SISWA ]`, `[ AKTIF ]`, `[ FASE D ]`) or unrequested stat cards (`90% Ambang Lulus Mastery Learning`).
   - **Rule of Thumb:** Only render the exact functional UI elements the user asked for. Do NOT add "filler" UI to make a page look busy.
3. **NO LOW-CONTRAST / FADED GREY TEXT:**
   - NEVER use `text-slate-300`, `text-slate-400`, `text-slate-500`, `text-gray-400`, `text-gray-500`, or low-opacity text (`text-white/50`, `text-black/40`).
   - Every piece of text must have razor-sharp contrast:
     - On White / Light (`#FFFFFF`, `#F4F7FC`, `#EEF2FA`) backgrounds: Use **`text-[#0A0D14]`** (pure ink black) for headings/labels/numbers, and **`text-[#1E293B]`** (deep slate-800, contrast > 12:1) for body paragraphs.
     - On Electric Blue (`#1B68FF`) backgrounds: Use **100% solid `text-white` (`#FFFFFF`)**.
     - On Dark Ink (`#0A0D14`) backgrounds: Use **100% solid `text-white` (`#FFFFFF`)**.

---

## 2. Typography System (100% `Onest` Only)
- **Single Font Family:** `'Onest', sans-serif` (`weights: 400, 500, 600, 700`).
- **Minimum Font Size:** **`16px` (`text-[16px]`)** for all body text, descriptions, inputs, and buttons.
- **Line-Height:** **`155%` (`leading-[1.55]`)** on all paragraphs and descriptions.
- **Golden Ratio Scale (`1.618`):**
  - Body & Inputs: `text-[16px] sm:text-[17px] font-normal leading-[1.55] text-[#1E293B]`
  - Card Heading (H3): `text-[24px] sm:text-[26px] font-medium tracking-[-0.025em] leading-[1.3] text-[#0A0D14] text-balance`
  - Page / Section Heading (H1/H2): `text-[36px] sm:text-[52px] lg:text-[64px] font-normal tracking-[-0.04em] leading-[1.05] text-[#0A0D14] text-balance`
- **Numbers:** Always use `Onest` with `tabular-nums` (clean round `0`, never dotted `0`).
- **Casing:** Always use normal Title Case or Sentence case. NEVER use `uppercase` (`ALL CAPS`) on labels, dividers, overlines, or descriptions.

---

## 3. Button System (`≥ 48x48dp` Touch Targets)
- **Primary Button (Solid Electric Blue):**
  `min-h-[48px] min-w-[48px] px-7 py-3 rounded-[14px] bg-[#1B68FF] hover:bg-[#1454D6] active:translate-y-0.5 text-white text-[16px] font-semibold transition-all shadow-[0_10px_24px_rgba(27,104,255,0.28)] inline-flex items-center justify-center gap-2.5 cursor-pointer`
- **Secondary Button (High-Contrast Outline — Dark Text & Crisp Border):**
  `min-h-[48px] min-w-[48px] px-6 py-3 rounded-[14px] bg-white hover:bg-[#F4F7FC] active:translate-y-0.5 text-[#0A0D14] border-2 border-[#0A0D14]/20 hover:border-[#1B68FF] text-[16px] font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer`
- **Primary Button on Blue Background:**
  `min-h-[48px] min-w-[48px] px-7 py-3 rounded-[14px] bg-white text-[#1B68FF] hover:bg-blue-50 active:translate-y-0.5 text-[16px] font-semibold transition-all shadow-[0_12px_28px_rgba(0,0,0,0.16)] inline-flex items-center justify-center gap-2 cursor-pointer`

---

## 4. Card & Layout Rules
- **Inner Radius Math:** `Inner Radius = Outer Radius - Padding` (e.g., outer `rounded-[32px] p-3` -> inner `rounded-[20px] bg-white border border-slate-200`).
- **Keep Pages Clean & Minimal:**
  - **Login / Register:** Only the AGRA logo, a clean heading (`"Masuk ke Akun"` or `"Daftar Akun Baru"`), the necessary form inputs (`min-h-[48px] text-[16px] text-[#0A0D14]`), the primary submit button, and the link to switch between Login/Register. Zero extra status bars, zero fake timers, zero unrequested stat boxes!
  - **Dashboard:** Only the student's actual navigation, their real active learning progress, and direct action buttons.

