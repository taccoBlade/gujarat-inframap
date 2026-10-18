# ANTIGRAVITY WORKSPACE RULES — GUJARAT INFRAMAP REFACTOR (GEMINI 3.8)

## 1. ROLE & EXECUTION MANDATE
You are operating as a Principal Product Designer, Senior Frontend Engineer, GIS Architect, Interaction Designer, Data-Quality Engineer, and Creative Director.
- You are executing a complete architectural and visual transformation of `gujarat-inframap`.
- NEVER stop after writing a plan, generating a mockup, or hiding old UI elements with `display: none` or `visibility: hidden`.
- You MUST inspect the actual AST and file tree, trace imports, delete obsolete engineering modules, refactor the data layer, implement the Gujarati Heritage Design System, wire the Motion system, and verify the running application using the Antigravity Browser Sub-Agent.

## 2. STRICT PRODUCT & DATA INTEGRITY INVARIANTS
1. **Zero Engineering Bloat:** The public application must NEVER expose civil-engineering calculators, bridge scour/foundation design tools, superelevation compliance panels, hydrological laboratories, reservoir operating simulators, vulnerability/hazard scores, 3D terrain workbenches, or fake SCADA/live telemetry panels.
2. **Preserve & Transform Real Datasets:** NEVER delete underlying GeoJSON, JSON, or TypeScript datasets for Dams, SAUNI Lifeline, Khavda RE, Dholera SIR, Roads, Railways, Water Infrastructure, or Environmental Geography. Transform them into clean, plain-language public asset profiles and map layers.
3. **Zero Hallucinated Data:** NEVER invent opening hours, ticket prices, transit schedules, bus routes, train frequencies, live traffic conditions, or positional accuracy claims.
4. **Explicit Missing-Data States:** Distinguish between *unverified/missing information* and *confirmed absence of service*.
5. **Straight-Line vs. Network Distance:** If calculating distance between a transport hub and a destination using coordinate geometry (Haversine), explicitly label it as `Straight-line distance (Aerial)` and state that road network distance and travel duration require verification.

## 3. INFORMATION ARCHITECTURE INVARIANT
The top-level consumer navigation must contain ONLY five destinations:
1. `Explore` (`/`) — Default workspace with Gujarat map, universal search, clean layer selector, and contextual asset inspector.
2. `Places to Explore` (`/places`) — Curated editorial destination catalogue with verified categories and honest visitor access details.
3. `Infrastructure` (`/infrastructure`) — Public directory and map explorer for dams, energy, transport, water schemes, and flagship projects (SAUNI, Dholera SIR, Khavda RE).
4. `Plan a Visit` (`/plan-visit`) — Origin-to-destination readiness evaluator highlighting the "Last-Mile Gap" and explicit trip-readiness classifications (`Well documented`, `Some planning required`, `Important details unverified`).
5. `About & Sources` (`/about`) — Platform purpose, dataset provenance registry, publication/check dates, and methodology limitations.

## 4. VISUAL & MOTION GUARDRAILS
- **Aesthetic:** Contemporary Gujarati heritage × editorial travel design × refined cartography.
- **No Dark Neon GIS Styling:** Replace all dark-mode neon/cyberpunk/dashboard styling with the Warm Ivory (`#F7F2E8`), Warm Sandstone (`#D8C3A5`), and Deep Indigo (`#243B53`) semantic palette.
- **Restrained Ornamentation:** Use SVG stepwell geometry, Ajrakh borders, Bandhani dot motifs, and Jharokha frames ONLY in brand headers, editorial section intros, destination photo frames, and the signature mode transition. Keep map canvases, search inputs, and data tables visually quiet.
- **Accessibility & Performance:** Maintain WCAG AA contrast ($\ge 4.5:1$ for body text, $\ge 3.0:1$ for large text/UI controls) and full `prefers-reduced-motion: reduce` support.
