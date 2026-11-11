export interface SampleTemplate {
  id: string;
  name: string;
  recommendedFilename: string;
  html: string;
}

export const DEFAULT_SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Architectural Monograph &amp; Capital Specification</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: #121212;
      color: #F5F5F5;
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      line-height: 1.55;
      padding: 36px 44px;
    }
    .sheet {
      max-width: 100%;
      margin: 0 auto;
    }
    .masthead {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-bottom: 16px;
      border-bottom: 1px solid #2A2A2A;
      margin-bottom: 24px;
    }
    .kicker {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.14em;
      color: #C93B61;
      margin-bottom: 6px;
    }
    h1 {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 36px;
      font-weight: 600;
      line-height: 1.08;
      letter-spacing: -0.01em;
      color: #F5F5F5;
    }
    .meta-col {
      text-align: right;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #A3A3A3;
      line-height: 1.65;
    }
    .hero-banner {
      background: linear-gradient(135deg, #7F072B 0%, #3A0414 55%, #1A1A1A 100%);
      border: 1px solid #4A1525;
      padding: 24px 28px;
      margin-bottom: 24px;
      display: grid;
      grid-template-columns: 1.6fr 1fr;
      gap: 24px;
      align-items: center;
    }
    .hero-banner h2 {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 25px;
      font-weight: 600;
      margin-bottom: 10px;
      color: #FFFFFF;
    }
    .hero-banner p {
      font-size: 13px;
      color: #E5E5E5;
      line-height: 1.65;
    }
    .hero-metrics {
      border-left: 1px solid rgba(255, 255, 255, 0.18);
      padding-left: 24px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .metric-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 24px;
      font-weight: 600;
      color: #FFFFFF;
      font-variant-numeric: tabular-nums;
    }
    .metric-lbl {
      font-size: 11px;
      color: #D4D4D4;
    }
    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 28px;
      margin-bottom: 32px;
    }
    .section-title {
      font-size: 13px;
      font-weight: 600;
      color: #F5F5F5;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid #2A2A2A;
    }
    .prose {
      font-size: 12.5px;
      color: #BDBDBD;
      line-height: 1.7;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 28px;
      font-size: 12px;
    }
    th {
      text-align: left;
      padding: 10px 12px;
      background-color: #1A1A1A;
      border-top: 1px solid #2A2A2A;
      border-bottom: 1px solid #2A2A2A;
      color: #A3A3A3;
      font-weight: 500;
    }
    th.num, td.num {
      text-align: right;
      font-family: 'JetBrains Mono', monospace;
      font-variant-numeric: tabular-nums;
    }
    td {
      padding: 11px 12px;
      border-bottom: 1px solid #222222;
      color: #E5E5E5;
    }
    tr.total-row td {
      background-color: #1A1A1A;
      border-top: 1px solid #3A3A3A;
      border-bottom: 1px solid #3A3A3A;
      font-weight: 600;
      color: #FFFFFF;
    }
    .footer-signoff {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 18px;
      border-top: 1px solid #2A2A2A;
      font-size: 11px;
      color: #888888;
      font-family: 'JetBrains Mono', monospace;
    }
  </style>
</head>
<body>
  <div class="sheet">
    <header class="masthead">
      <div>
        <div class="kicker">01 · ARCHITECTURAL SPECIFICATION DOSSIER</div>
        <h1>Krono Pavilion — Structural &amp; Acoustic Brief</h1>
      </div>
      <div class="meta-col">
        <div>DOC REF · KP-2026-089</div>
        <div>DATE · NOVEMBER 2026</div>
        <div>STATUS · APPROVED FOR ISSUE</div>
      </div>
    </header>

    <section class="hero-banner">
      <div>
        <h2>Executive Synthesis &amp; Material Palette</h2>
        <p>
          Designed for zero-reverberation chamber acoustics, the Krono Pavilion pairs anodized oxblood aluminum baffles with ultra-high-performance Basalt fiber concrete. Background color preservation guarantees dark surface fidelity across both vector print and direct raster PDF pipelines.
        </p>
      </div>
      <div class="hero-metrics">
        <div>
          <div class="metric-val">4,820 m²</div>
          <div class="metric-lbl">Net Conditioned Acoustic Span</div>
        </div>
        <div>
          <div class="metric-val">0.18 sec</div>
          <div class="metric-lbl">Measured RT60 Reverberation</div>
        </div>
      </div>
    </section>

    <section class="two-col">
      <div>
        <h3 class="section-title">01. Envelope Thermal Performance</h3>
        <p class="prose">
          Triple-glazed low-iron curtain wall assemblies achieve a center-of-glass U-value of 0.52 W/m²K. Integrated perimeter radiant micro-channels eliminate convective downdrafts along the 14-meter north gallery elevation without obstructing sightlines.
        </p>
      </div>
      <div>
        <h3 class="section-title">02. Acoustic Baffle Geometry</h3>
        <p class="prose">
          CNC-perforated oxblood alloy fins are suspended on tensioned stainless aircraft cables at 450mm centers. Each fin houses a 60kg/m³ mineral wool core encapsulated in acoustically transparent black glass-fiber fleece.
        </p>
      </div>
    </section>

    <h3 class="section-title">03. Schedule of Structural &amp; Architectural Allocations</h3>
    <table>
      <thead>
        <tr>
          <th>Package Code</th>
          <th>Assembly Specification</th>
          <th>Lead Engineer</th>
          <th class="num">Mass (t)</th>
          <th class="num">Allocation (EUR)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>STR-104</td>
          <td>Post-Tensioned Basalt Concrete Diagrid</td>
          <td>M. Vance, PE</td>
          <td class="num">1,420.0</td>
          <td class="num">€2,840,000</td>
        </tr>
        <tr>
          <td>FAC-208</td>
          <td>Low-Iron Triple Glazed Acoustic Curtain Wall</td>
          <td>H. Lindqvist</td>
          <td class="num">318.5</td>
          <td class="num">€1,965,400</td>
        </tr>
        <tr>
          <td>ACO-312</td>
          <td>Anodized Oxblood Aluminum Baffle Array</td>
          <td>S. Takahashi</td>
          <td class="num">84.2</td>
          <td class="num">€1,120,800</td>
        </tr>
        <tr>
          <td>MEP-401</td>
          <td>Displacement Sub-Floor Radiant Conditioning</td>
          <td>E. Rostova</td>
          <td class="num">112.8</td>
          <td class="num">€894,200</td>
        </tr>
        <tr class="total-row">
          <td colspan="3">Total Certified Phase I Capital Commitment</td>
          <td class="num">1,935.5</td>
          <td class="num">€6,820,400</td>
        </tr>
      </tbody>
    </table>

    <footer class="footer-signoff">
      <span>ATELIER VANCE &amp; PARTNERS · ZÜRICH / LONDON</span>
      <span>VECTOR &amp; RASTER PDF VERIFIED · PAGE 1 OF 1</span>
    </footer>
  </div>
</body>
</html>`;

export const SAMPLE_TEMPLATES: SampleTemplate[] = [
  {
    id: 'architectural-monograph',
    name: 'Architectural Monograph (A4 Dark)',
    recommendedFilename: 'krono-pavilion-spec.pdf',
    html: DEFAULT_SAMPLE_HTML,
  },
  {
    id: 'widescreen-deck',
    name: '16:9 Executive Keynote Slide',
    recommendedFilename: 'q4-board-deck.pdf',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Q4 Board Strategy Deck</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at 85% 15%, #4A051A 0%, #111111 55%);
      color: #F5F5F5;
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      padding: 64px 72px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #2A2A2A;
      padding-bottom: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #A3A3A3;
    }
    .headline-block {
      margin: 48px 0;
      max-width: 960px;
    }
    .eyebrow {
      font-family: 'JetBrains Mono', monospace;
      color: #D8436E;
      font-size: 13px;
      letter-spacing: 0.12em;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 52px;
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin-bottom: 20px;
    }
    p.lead {
      font-size: 18px;
      color: #C4C4C4;
      line-height: 1.6;
      max-width: 780px;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-top: 24px;
    }
    .kpi-card {
      background: rgba(26, 26, 26, 0.9);
      border: 1px solid #2A2A2A;
      padding: 24px;
    }
    .kpi-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 34px;
      font-weight: 600;
      color: #FFFFFF;
      margin-bottom: 8px;
    }
    .kpi-label {
      font-size: 13px;
      color: #A3A3A3;
    }
  </style>
</head>
<body>
  <div class="top-row">
    <span>OXBLOOD CAPITAL · Q4 INSTITUTIONAL BRIEFING</span>
    <span>SLIDE 01 / 16:9 WIDESCREEN FORMAT</span>
  </div>
  <div class="headline-block">
    <div class="eyebrow">01 · ANNUAL PERFORMANCE METRICS</div>
    <h1>Autonomous Infrastructure Yield Expanded +142% Year-Over-Year</h1>
    <p class="lead">
      Disciplined capital deployment across European low-latency fiber corridors drove record operating leverage while compressing unit compute overhead by 38 basis points.
    </p>
  </div>
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-value">$184.6M</div>
      <div class="kpi-label">Annualized Net Run-Rate</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-value">99.994%</div>
      <div class="kpi-label">SLA Cluster Availability</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-value">1.14x</div>
      <div class="kpi-label">Power Usage Effectiveness</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-value">14.2 mo</div>
      <div class="kpi-label">CAC Payback Velocity</div>
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: 'editorial-invoice',
    name: 'Commercial Settlement Statement',
    recommendedFilename: 'invoice-settlement.pdf',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Commercial Settlement Statement</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #161616;
      color: #F5F5F5;
      font-family: 'Plus Jakarta Sans', sans-serif;
      padding: 48px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #2A2A2A;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .brand { font-size: 22px; font-weight: 700; letter-spacing: -0.01em; }
    .inv-num { font-family: 'JetBrains Mono', monospace; color: #D8436E; font-size: 13px; margin-top: 4px; }
    .parties {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 36px;
      font-size: 13px;
      color: #BDBDBD;
      line-height: 1.65;
    }
    .party-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #888; margin-bottom: 6px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 32px; font-size: 13px; }
    th { text-align: left; padding: 12px; background: #1F1F1F; border-bottom: 1px solid #2A2A2A; color: #A3A3A3; }
    td { padding: 14px 12px; border-bottom: 1px solid #242424; }
    .right { text-align: right; font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
    .summary-box {
      margin-left: auto;
      width: 320px;
      background: #1A1A1A;
      border: 1px solid #2A2A2A;
      padding: 20px;
    }
    .sum-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 10px; color: #BDBDBD; }
    .sum-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: #FFF; border-top: 1px solid #2A2A2A; padding-top: 12px; margin-top: 12px; font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">VERIDIAN SYSTEMS AG</div>
      <div class="inv-num">INVOICE #VS-2026-4419</div>
    </div>
    <div style="text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #A3A3A3;">
      <div>ISSUE DATE: 2026-11-11</div>
      <div>TERMS: NET 15 WIRE</div>
    </div>
  </div>
  <div class="parties">
    <div>
      <div class="party-label">BILLED TO</div>
      <strong style="color:#FFF">Meridian Aerospace Holdings Ltd.</strong><br/>
      400 Bishopsgate, Level 18<br/>
      London EC2N 4AG, United Kingdom
    </div>
    <div>
      <div class="party-label">REMITTANCE COORDINATES</div>
      <strong style="color:#FFF">UBS Switzerland AG · Zürich</strong><br/>
      IBAN: CH93 0023 0230 1094 8821 0<br/>
      BIC / SWIFT: UBSWCHZH80A
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Deliverable Description</th>
        <th class="right">Hours / Qty</th>
        <th class="right">Rate</th>
        <th class="right">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>01</td>
        <td>Flight-Control Telemetry Kernel Audit &amp; Formal Verification</td>
        <td class="right">120</td>
        <td class="right">$240.00</td>
        <td class="right">$28,800.00</td>
      </tr>
      <tr>
        <td>02</td>
        <td>Redundant Bus Failover Load Simulation &amp; Stress Report</td>
        <td class="right">65</td>
        <td class="right">$220.00</td>
        <td class="right">$14,300.00</td>
      </tr>
      <tr>
        <td>03</td>
        <td>Dedicated Bare-Metal Hardware-in-the-Loop Test Rig</td>
        <td class="right">1</td>
        <td class="right">$6,500.00</td>
        <td class="right">$6,500.00</td>
      </tr>
    </tbody>
  </table>
  <div class="summary-box">
    <div class="sum-row"><span>Subtotal</span><span class="right">$49,600.00</span></div>
    <div class="sum-row"><span>Zero-Rated Export VAT (0%)</span><span class="right">$0.00</span></div>
    <div class="sum-total"><span>Total Due (USD)</span><span>$49,600.00</span></div>
  </div>
</body>
</html>`,
  },
];
