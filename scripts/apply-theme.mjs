/**
 * apply-theme.mjs
 * Transforms LandingPage.tsx:
 *   1. Theme class: 'dark' → 'theme-dark'
 *   2. All Tailwind dark: variants → CSS-variable .t-* classes
 *   3. Gallery: 7 new fleet images
 *   4. Logo: h-24 in navbar, h-16 in footer
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, "../LandingPage.tsx");

let c = fs.readFileSync(FILE, "utf8");

// ── 1. Fix theme-class name in localStorage & classList calls ──────────
c = c.replace(/root\.classList\.add\("dark"\)/g, 'root.classList.add("theme-dark")');
c = c.replace(/root\.classList\.remove\("dark"\)/g, 'root.classList.remove("theme-dark")');
c = c.replace(/"dnr-theme"/g, '"dnr-theme"'); // already correct

// ── 2. Fix gallery data ────────────────────────────────────────────────
const newGallery = `[
    { src: "/images/fleet-1.jpg", caption: "First-Class Comfort — Luxury Pushback Seats with DNR branding" },
    { src: "/images/fleet-2.jpg", caption: "Personal Luggage Rack — Dedicated space for every passenger" },
    { src: "/images/fleet-3.jpg", caption: "Fast Charging USB Ports & Ergonomic Mobile Holders" },
    { src: "/images/fleet-4.jpg", caption: "Reading Lights & Sensor Air-Conditioning for every seat" },
    { src: "/images/fleet-5.jpg", caption: "The DNR Express premium fleet — experience the joy of travel" },
    { src: "/images/fleet-6.jpg", caption: "Luxury Sleeper Coach — USB & C-type fast charging ports" },
    { src: "/images/fleet-7.jpg", caption: "Luxury Sleeper — Reading Lights & Sensor Air-Conditioning" },
]`;
c = c.replace(/const GALLERY_IMAGES\s*=\s*\[[\s\S]*?\];/, `const GALLERY_IMAGES = ${newGallery};`);

// ── 3. Logo sizes ──────────────────────────────────────────────────────
// Navbar logo: h-20 → h-24
c = c.replace(/className="h-20 w-auto object-contain drop-shadow-lg/, 'className="h-24 w-auto object-contain drop-shadow-lg');
// Footer logo: h-14 → h-16
c = c.replace(/className="h-14 w-auto object-contain mb-5 dark:brightness-0 dark:invert dark:opacity-85"/, 'className="h-16 w-auto object-contain mb-5"');

// ── 4. Section backgrounds ─────────────────────────────────────────────
const bgMap = [
    // [regex, replacement]
    [/bg-slate-50 dark:bg-slate-950\b/g, "t-page t-transition"],
    [/bg-white dark:bg-slate-950\b/g, "t-page t-transition"],
    [/bg-slate-50 dark:bg-slate-900\b/g, "t-alt t-transition"],
    [/bg-white dark:bg-slate-900\b/g, "t-section t-transition"],
    [/bg-gradient-to-b from-slate-100 to-white dark:from-slate-950 dark:to-slate-900\b/g,
        "t-alt t-transition"],
    [/bg-slate-100 dark:bg-\[#050a14\]\b/g, "t-alt t-transition"],
    [/\bfont-sans antialiased bg-white dark:bg-slate-950 transition-colors duration-300\b/g,
        "font-sans antialiased t-page"],
];
for (const [rx, rep] of bgMap) c = c.replace(rx, rep);

// ── 5. Card / inner backgrounds ────────────────────────────────────────
const cardMap = [
    [/\bbg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800\b/g,
        "t-card border t-border"],
    [/\bbg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800\b/g,
        "t-card border t-border"],
    [/\bbg-white dark:bg-slate-900\b/g, "t-card"],
    [/\bbg-slate-50 dark:bg-slate-800\/60\b/g, "t-card-inner"],
    [/\bbg-slate-50 dark:bg-slate-800\b/g, "t-card-inner"],
    [/\bbg-slate-100 dark:bg-slate-800\b/g, "t-card-inner"],
    [/\bbg-slate-100 dark:bg-slate-700\b/g, "t-card-inner"],
    [/\bbg-slate-900 dark:bg-slate-900\b/g, "t-card"],
];
for (const [rx, rep] of cardMap) c = c.replace(rx, rep);

// ── 6. Text colours ────────────────────────────────────────────────────
const textMap = [
    [/\btext-slate-900 dark:text-white\b/g, "t-text-p t-transition"],
    [/\btext-slate-800 dark:text-white\b/g, "t-text-p t-transition"],
    [/\btext-slate-600 dark:text-slate-400\b/g, "t-text-s t-transition"],
    [/\btext-slate-500 dark:text-slate-400\b/g, "t-text-m t-transition"],
    [/\btext-slate-400 dark:text-slate-500\b/g, "t-text-m t-transition"],
    [/\btext-slate-500 dark:text-slate-500\b/g, "t-text-m t-transition"],
    [/\btext-slate-600 dark:text-slate-500\b/g, "t-text-m t-transition"],
    [/\btext-slate-500 dark:text-slate-600\b/g, "t-text-m t-transition"],
    [/\btext-slate-600 dark:text-slate-400\b/g, "t-text-s t-transition"],
    // Amber text (light gets deeper amber)
    [/\btext-amber-600 dark:text-amber-400\b/g, "t-amber t-transition"],
    [/\btext-amber-500 dark:text-amber-400\b/g, "t-amber t-transition"],
    // Heading text in footer
    [/\btext-slate-900 dark:text-white text-sm font-bold\b/g, "t-text-p t-transition text-sm font-bold"],
];
for (const [rx, rep] of textMap) c = c.replace(rx, rep);

// ── 7. Border colours ──────────────────────────────────────────────────
const borderMap = [
    [/\bborder-slate-200 dark:border-slate-800\b/g, "t-border"],
    [/\bborder-slate-100 dark:border-slate-800\b/g, "t-border"],
    [/\bborder-slate-200 dark:border-slate-900\b/g, "t-border"],
    [/\bborder-t border-slate-200 dark:border-slate-900\b/g, "border-t t-border"],
    [/\bhover:border-amber-200 dark:hover:border-amber-400\/20\b/g, ""],
    [/\bhover:border-amber-300 dark:hover:border-amber-400\/30\b/g, ""],
];
for (const [rx, rep] of borderMap) c = c.replace(rx, rep);

// ── 8. Amber badge pills ───────────────────────────────────────────────
c = c.replace(
    /\bbg-amber-50 dark:bg-amber-400\/10 border border-amber-200 dark:border-amber-400\/20 text-amber-600 dark:text-amber-400\b/g,
    "t-amber-bg t-amber-border border t-amber t-transition"
);
c = c.replace(
    /\bbg-amber-50 dark:bg-amber-400\/10 border border-amber-200 dark:border-amber-400\/20 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-widest\b/g,
    "t-amber-bg t-amber-border border t-amber rounded-full text-xs font-bold uppercase tracking-widest t-transition"
);
c = c.replace(
    /\bbg-amber-50 dark:bg-amber-400\/10\b/g, "t-amber-bg"
);
c = c.replace(
    /\bborder border-amber-200 dark:border-amber-400\/20\b/g, "border t-amber-border"
);

// ── 9. Icon wrappers ───────────────────────────────────────────────────
c = c.replace(
    /\btext-slate-500 dark:text-slate-300 group-hover:text-amber-600 dark:group-hover:text-amber-400\b/g,
    "t-text-m group-hover:text-[var(--amber)] t-transition"
);
c = c.replace(
    /\btext-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-300\b/g,
    "t-text-m group-hover:text-[var(--amber)] t-transition"
);

// ── 10. Gallery thumbnail ring-offset ─────────────────────────────────
c = c.replace(
    /ring-offset-white dark:ring-offset-slate-950/g,
    "ring-offset-transparent"
);

// ── 11. Gallery dot indicators ─────────────────────────────────────────
c = c.replace(
    /bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500/g,
    "bg-[var(--border-strong)] hover:bg-[var(--amber)]"
);

// ── 12. Footer social icon bg ──────────────────────────────────────────
c = c.replace(
    /\bw-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-900\b/g,
    "w-8 h-8 rounded-lg t-card-inner"
);

// ── 13. hover:text-amber-600 dark:hover:text-amber-400 in footer links ─
c = c.replace(
    /hover:text-amber-600 dark:hover:text-amber-400/g,
    "hover:text-[var(--amber)]"
);

// ── 14. Remove leftover spurious dark: classes ─────────────────────────
// Testimonial review text
c = c.replace(/\btext-slate-600 dark:text-slate-400 text-sm leading-relaxed relative z-10\b/g,
    "t-text-s text-sm leading-relaxed relative z-10");

// Amenities check list
c = c.replace(/\btext-slate-600 dark:text-slate-300\b/g, "t-text-s");

// Footer paragraph
c = c.replace(/\btext-slate-500 dark:text-slate-600\b/g, "t-text-m");

// More leftover dark: class pairs
c = c.replace(/ dark:[a-z0-9:\/\[\]()._-]+/g, " "); // strip remaining dark: classes

// Double spaces cleanup
c = c.replace(/  +/g, " ");
c = c.replace(/" "/g, '" "');

// ── 15. Gradient text accent – ensure from/to are single-theme amber ──
c = c.replace(
    /from-amber-500 to-amber-600 dark:from-amber-300 dark:to-amber-500/g,
    "from-[var(--amber)] to-amber-500"
);
c = c.replace(
    /from-amber-300 to-amber-500/g,
    "from-[var(--amber)] to-amber-500"
);

// ── Write ──────────────────────────────────────────────────────────────
fs.writeFileSync(FILE, c, "utf8");
console.log("✅  LandingPage.tsx rewritten with CSS-variable theme + 7 fleet images");
