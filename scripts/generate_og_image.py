"""
Open Graph Social Preview Generator for Gujarat InfraMap.
Generates both high-res 1200x630 PNG and SVG preview cards.
"""

import os
from PIL import Image, ImageDraw, ImageFont

def generate_svg(output_path: str):
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1120"/>
      <stop offset="50%" stop-color="#070c16"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>

    <!-- Glowing Grid Pattern -->
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="0.8" stroke-opacity="0.6"/>
    </pattern>

    <!-- Radial Glows -->
    <radialGradient id="cyanGlow" cx="75%" cy="35%" r="45%">
      <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.18"/>
      <stop offset="60%" stop-color="#0284c7" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="emeraldGlow" cx="25%" cy="80%" r="40%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    
    <!-- Linear Card Gradients -->
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.9"/>
    </linearGradient>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="630" fill="url(#bgGrad)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#cyanGlow)"/>
  <rect width="1200" height="630" fill="url(#emeraldGlow)"/>

  <!-- Border Frame -->
  <rect x="20" y="20" width="1160" height="590" rx="16" fill="none" stroke="#334155" stroke-width="1.5" stroke-opacity="0.8"/>
  <rect x="26" y="26" width="1148" height="578" rx="12" fill="none" stroke="#00f0ff" stroke-width="0.75" stroke-opacity="0.3"/>

  <!-- Corner Crosshairs -->
  <path d="M 35 45 L 55 45 M 45 35 L 45 55" stroke="#00f0ff" stroke-width="1.5" stroke-opacity="0.7"/>
  <path d="M 1145 45 L 1165 45 M 1155 35 L 1155 55" stroke="#00f0ff" stroke-width="1.5" stroke-opacity="0.7"/>
  <path d="M 35 585 L 55 585 M 45 575 L 45 595" stroke="#00f0ff" stroke-width="1.5" stroke-opacity="0.7"/>
  <path d="M 1145 585 L 1165 585 M 1155 575 L 1155 595" stroke="#00f0ff" stroke-width="1.5" stroke-opacity="0.7"/>

  <!-- Status Chip -->
  <g transform="translate(60, 60)">
    <rect width="260" height="36" rx="18" fill="#0f172a" stroke="#0284c7" stroke-width="1.5"/>
    <circle cx="20" cy="18" r="5" fill="#10b981"/>
    <circle cx="20" cy="18" r="9" fill="none" stroke="#10b981" stroke-width="1.5" stroke-opacity="0.5"/>
    <text x="36" y="23" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#38bdf8" letter-spacing="1.5">GIS OBSERVATORY • v1.0</text>
  </g>

  <!-- Right Status Badge -->
  <g transform="translate(940, 60)">
    <text x="200" y="24" text-anchor="end" font-family="'JetBrains Mono', monospace, sans-serif" font-size="13" font-weight="600" fill="#94a3b8" letter-spacing="1">EPSG:4326 | WGS 84</text>
  </g>

  <!-- Main Brand Title -->
  <text x="60" y="165" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="64" font-weight="800" fill="#ffffff" letter-spacing="-1.5">
    Gujarat <tspan fill="#38bdf8">InfraMap</tspan>
  </text>

  <!-- Subtitle -->
  <text x="60" y="215" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="500" fill="#94a3b8">
    Production Digital Infrastructure Twin &amp; Spatial Planning Observatory
  </text>

  <!-- Metric Cards Row -->
  <!-- Card 1: Districts -->
  <g transform="translate(60, 270)">
    <rect width="200" height="130" rx="12" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
    <text x="20" y="42" font-family="'JetBrains Mono', monospace" font-size="36" font-weight="800" fill="#38bdf8">33</text>
    <text x="20" y="72" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#f8fafc">Districts &amp; HQs</text>
    <text x="20" y="96" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#64748b">100% Boundary Audit</text>
  </g>

  <!-- Card 2: Highways -->
  <g transform="translate(280, 270)">
    <rect width="200" height="130" rx="12" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
    <text x="20" y="42" font-family="'JetBrains Mono', monospace" font-size="36" font-weight="800" fill="#f59e0b">43</text>
    <text x="20" y="72" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#f8fafc">NH Corridors</text>
    <text x="20" y="96" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#64748b">NE-1 &amp; GQ Unified</text>
  </g>

  <!-- Card 3: Railways -->
  <g transform="translate(500, 270)">
    <rect width="200" height="130" rx="12" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
    <text x="20" y="42" font-family="'JetBrains Mono', monospace" font-size="36" font-weight="800" fill="#a855f7">623</text>
    <text x="20" y="72" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#f8fafc">Rail Stations</text>
    <text x="20" y="96" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#64748b">4 WR Divisions (ADI/BRC)</text>
  </g>

  <!-- Card 4: Energy -->
  <g transform="translate(720, 270)">
    <rect width="200" height="130" rx="12" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
    <text x="20" y="42" font-family="'JetBrains Mono', monospace" font-size="36" font-weight="800" fill="#10b981">31.9<tspan font-size="20">GW</tspan></text>
    <text x="20" y="72" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#f8fafc">Power Generation</text>
    <text x="20" y="96" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#64748b">44 Plants (Khavda/Charanka)</text>
  </g>

  <!-- Card 5: Grid Corridors -->
  <g transform="translate(940, 270)">
    <rect width="200" height="130" rx="12" fill="url(#cardGrad)" stroke="#334155" stroke-width="1"/>
    <text x="20" y="42" font-family="'JetBrains Mono', monospace" font-size="36" font-weight="800" fill="#00f0ff">765<tspan font-size="20">kV</tspan></text>
    <text x="20" y="72" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#f8fafc">GETCO / PGCIL</text>
    <text x="20" y="96" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#64748b">12 Lines &amp; 10 Pooling Subs</text>
  </g>

  <!-- Bottom Features Bar -->
  <g transform="translate(60, 440)">
    <rect width="1080" height="120" rx="12" fill="#0b1329" fill-opacity="0.8" stroke="#1e293b" stroke-width="1"/>
    
    <!-- Feature 1 -->
    <g transform="translate(30, 25)">
      <circle cx="16" cy="16" r="14" fill="#0284c7" fill-opacity="0.2"/>
      <path d="M 12 16 L 15 19 L 21 13" fill="none" stroke="#38bdf8" stroke-width="2"/>
      <text x="40" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#f8fafc">7,344 Spatial Features</text>
      <text x="40" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#64748b">Multi-Token High-Speed Search</text>
    </g>

    <!-- Feature 2 -->
    <g transform="translate(300, 25)">
      <circle cx="16" cy="16" r="14" fill="#10b981" fill-opacity="0.2"/>
      <path d="M 12 16 L 15 19 L 21 13" fill="none" stroke="#10b981" stroke-width="2"/>
      <text x="40" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#f8fafc">Sub-Second Load Time</text>
      <text x="40" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#64748b">Zero-Backend Client-Side GIS</text>
    </g>

    <!-- Feature 3 -->
    <g transform="translate(570, 25)">
      <circle cx="16" cy="16" r="14" fill="#f59e0b" fill-opacity="0.2"/>
      <path d="M 12 16 L 15 19 L 21 13" fill="none" stroke="#f59e0b" stroke-width="2"/>
      <text x="40" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#f8fafc">Geodesic Measurement</text>
      <text x="40" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#64748b">Interactive Real-Time Tool</text>
    </g>

    <!-- Feature 4 -->
    <g transform="translate(840, 25)">
      <circle cx="16" cy="16" r="14" fill="#a855f7" fill-opacity="0.2"/>
      <path d="M 12 16 L 15 19 L 21 13" fill="none" stroke="#a855f7" stroke-width="2"/>
      <text x="40" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#f8fafc">2x Retina Map Export</text>
      <text x="40" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#64748b">One-Click Cartographic PNG</text>
    </g>

    <!-- Footer URL -->
    <text x="540" y="92" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600" fill="#38bdf8" letter-spacing="1">
      https://saumy.github.io/gujarat-inframap/
    </text>
  </g>
</svg>
"""
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(svg_content.strip())
    print(f"[OK] Generated SVG preview: {output_path}")

def generate_png(output_path: str):
    width, height = 1200, 630
    img = Image.new("RGBA", (width, height), (7, 12, 22, 255))
    draw = ImageDraw.Draw(img)

    # Background gradient simulation
    for y in range(height):
        ratio = y / height
        r = int(11 * (1 - ratio) + 3 * ratio)
        g = int(17 * (1 - ratio) + 7 * ratio)
        b = int(32 * (1 - ratio) + 18 * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b, 255))

    # Grid overlay
    grid_size = 40
    for x in range(0, width, grid_size):
        draw.line([(x, 0), (x, height)], fill=(30, 41, 59, 70), width=1)
    for y in range(0, height, grid_size):
        draw.line([(0, y), (width, y)], fill=(30, 41, 59, 70), width=1)

    # Frame border
    draw.rounded_rectangle([(20, 20), (1180, 610)], radius=16, outline=(51, 65, 85, 200), width=2)
    draw.rounded_rectangle([(26, 26), (1174, 604)], radius=12, outline=(0, 240, 255, 60), width=1)

    # Corner crosshairs
    ch_color = (0, 240, 255, 180)
    for cx, cy in [(45, 45), (1155, 45), (45, 585), (1155, 585)]:
        draw.line([(cx - 10, cy), (cx + 10, cy)], fill=ch_color, width=2)
        draw.line([(cx, cy - 10), (cx, cy + 10)], fill=ch_color, width=2)

    # Try loading system fonts or default
    try:
        title_font = ImageFont.truetype("arialbd.ttf", 62)
        subtitle_font = ImageFont.truetype("arial.ttf", 24)
        stat_val_font = ImageFont.truetype("arialbd.ttf", 36)
        stat_lbl_font = ImageFont.truetype("arialbd.ttf", 14)
        stat_sub_font = ImageFont.truetype("arial.ttf", 12)
        chip_font = ImageFont.truetype("arialbd.ttf", 12)
        mono_font = ImageFont.truetype("consola.ttf", 13)
    except Exception:
        title_font = subtitle_font = stat_val_font = stat_lbl_font = stat_sub_font = chip_font = mono_font = ImageFont.load_default()

    # Status Pill (top-left)
    draw.rounded_rectangle([(60, 55), (320, 92)], radius=18, fill=(15, 23, 42, 230), outline=(2, 132, 199, 255), width=1)
    draw.ellipse([(76, 68), (86, 78)], fill=(16, 185, 129, 255))
    draw.text((96, 65), "GIS OBSERVATORY • v1.0", fill=(56, 189, 248, 255), font=chip_font)

    # EPSG status (top-right)
    draw.text((950, 65), "EPSG:4326 | WGS 84", fill=(148, 163, 184, 255), font=mono_font)

    # Main Title
    draw.text((60, 115), "Gujarat InfraMap", fill=(255, 255, 255, 255), font=title_font)
    draw.text((60, 190), "Production Digital Infrastructure Twin & Spatial Planning Observatory", fill=(148, 163, 184, 255), font=subtitle_font)

    # 5 KPI Metric Cards
    metrics = [
        ("33", "Districts & HQs", "100% Boundary Audit", (56, 189, 248, 255), 60),
        ("43", "NH Corridors", "NE-1 & GQ Unified", (245, 158, 11, 255), 280),
        ("623", "Rail Stations", "4 WR Divisions (ADI/BRC)", (168, 85, 247, 255), 500),
        ("31.9 GW", "Power Generation", "44 Plants (Khavda)", (16, 185, 129, 255), 720),
        ("765 kV", "GETCO / PGCIL", "12 Lines & 10 Pooling Subs", (0, 240, 255, 255), 940)
    ]

    for val, lbl, sub, color, x_pos in metrics:
        draw.rounded_rectangle([(x_pos, 255), (x_pos + 200, 395)], radius=12, fill=(15, 23, 42, 220), outline=(51, 65, 85, 200), width=1)
        draw.text((x_pos + 18, 275), val, fill=color, font=stat_val_font)
        draw.text((x_pos + 18, 325), lbl, fill=(248, 250, 252, 255), font=stat_lbl_font)
        draw.text((x_pos + 18, 350), sub, fill=(100, 116, 139, 255), font=stat_sub_font)

    # Bottom summary container
    draw.rounded_rectangle([(60, 425), (1140, 560)], radius=12, fill=(11, 19, 41, 230), outline=(30, 41, 59, 255), width=1)
    
    features = [
        ("7,344 Spatial Features", "Multi-Token Search Engine", 90),
        ("Sub-Second Load Time", "Zero-Backend Client GIS", 360),
        ("Geodesic Measuring", "Real-Time Waypoint Tool", 630),
        ("2x Retina Map Export", "High-Resolution Carto PNG", 900)
    ]
    for title, desc, fx in features:
        draw.ellipse([(fx, 452), (fx + 16, 468)], fill=(16, 185, 129, 255))
        draw.text((fx + 24, 444), title, fill=(248, 250, 252, 255), font=stat_lbl_font)
        draw.text((fx + 24, 468), desc, fill=(100, 116, 139, 255), font=stat_sub_font)

    draw.text((450, 520), "https://saumy.github.io/gujarat-inframap/", fill=(56, 189, 248, 255), font=mono_font)

    img.save(output_path, "PNG", optimize=True)
    print(f"[OK] Generated PNG preview: {output_path} ({os.path.getsize(output_path)} bytes)")

if __name__ == "__main__":
    os.makedirs("assets", exist_ok=True)
    generate_svg("assets/og-preview.svg")
    generate_png("assets/og-preview.png")
