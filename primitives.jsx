/* global React */
const { useState, useEffect, useMemo, useRef } = React;

/* ====================================================================
   ICONS — minimal lucide-style stroke set, 18px viewBox
   ==================================================================== */
const Icon = ({ name, size = 16, color = "currentColor", strokeWidth = 2 }) => {
  const paths = {
    home:        "M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z",
    grid:        "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
    inbox:       "M22 12h-6l-2 3h-4l-2-3H2M5.5 5h13l3 7v6a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2v-6z",
    radar:       "M19.07 4.93A10 10 0 1 1 6.99 3.34M12 12l4-4M12 12 8 8M12 12v6",
    bell:        "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9zM10.3 21a1.94 1.94 0 0 0 3.4 0",
    file:        "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
    chart:       "M3 3v18h18M7 14l4-4 4 4 5-5",
    activity:    "M22 12h-4l-3 9-6-18-3 9H2",
    users:       "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    user:        "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
    settings:    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
    search:      "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
    plus:        "M12 5v14M5 12h14",
    arrow_right: "M5 12h14M13 5l7 7-7 7",
    arrow_up:    "M12 19V5M5 12l7-7 7 7",
    arrow_down:  "M12 5v14M19 12l-7 7-7-7",
    download:    "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
    chevron_r:   "m9 18 6-6-6-6",
    chevron_l:   "m15 18-6-6 6-6",
    chevron_d:   "m6 9 6 6 6-6",
    refresh:     "M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5",
    clock:       "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
    alert:       "M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
    check:       "M20 6 9 17l-5-5",
    x:           "M18 6 6 18M6 6l12 12",
    filter:      "M22 3H2l8 9.46V19l4 2v-8.54z",
    eye:         "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    key:         "M21 2 19 4M15 6l4-4M15 6a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM10 13l-7 7v3h3l7-7",
    sparkle:     "M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2 2M16.4 16.4l2 2M5.6 18.4l2-2M16.4 7.6l2-2",
    ai:          "M9 11h6M9 14h4M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7l-5 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
    play:        "M5 3v18l15-9z",
    pause:       "M6 4h4v16H6zM14 4h4v16h-4z",
    upload:      "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
    shield:      "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    receipt:     "M4 2h16v20l-3-2-3 2-3-2-3 2-3-2-3 2zM8 6h8M8 10h8M8 14h6",
    flask:       "M9 2h6M10 2v7l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V2",
    branch:      "M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9",
    code:        "m16 18 6-6-6-6M8 6l-6 6 6 6",
    layers:      "m12 2 10 6-10 6L2 8zM2 17l10 6 10-6M2 12l10 6 10-6",
    book:        "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
    history:     "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l4 2",
    pin:         "M12 2v4M5 10l-3 3M19 10l3 3M12 22v-7M5 10a7 7 0 0 1 14 0v0c0 5-7 12-7 12s-7-7-7-12z",
    flame:       "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
    gauge:       "M12 14l4-4M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14",
    zap:         "M13 2 3 14h9l-1 8 10-12h-9z",
    log_out:     "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
    folder:      "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
    list:        "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
    send:        "m22 2-7 20-4-9-9-4z M22 2 11 13",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}>
      <path d={paths[name] || paths.grid} />
    </svg>
  );
};

/* ====================================================================
   STATUS BADGE — canonical 6 states + variants
   ==================================================================== */
const StatusBadge = ({ state }) => {
  const map = {
    'localizado':    { c: 's-localizado',  l: 'Localizado' },
    'capturado':     { c: 's-capturado',   l: 'Capturado' },
    'enviado':       { c: 's-enviado',     l: 'Enviado' },
    'entregue':      { c: 's-entregue',    l: 'Entregue' },
    'falha-captura': { c: 's-falha-cap',   l: 'Falha de captura' },
    'falha-entrega': { c: 's-falha-ent',   l: 'Falha de entrega' },
    'pendente':      { c: 's-neutral',     l: 'Pendente' },
    'ativo':         { c: 's-entregue',    l: 'Ativo' },
    'inativo':       { c: 's-neutral',     l: 'Inativo' },
    'suspenso':      { c: 's-falha-cap',   l: 'Suspenso' },
  };
  const x = map[state] || { c: 's-neutral', l: state };
  return <span className={`status ${x.c}`}><span className="dot"/>{x.l}</span>;
};

/* ====================================================================
   SPARKLINE
   ==================================================================== */
const Sparkline = ({ data, color = '#075056', w = 100, h = 28, filled = true }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return [x, y];
  });
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const fill = `${d} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="spark">
      {filled && <path d={fill} fill={color} opacity="0.10"/>}
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="2.4" fill={color}/>
    </svg>
  );
};

/* ====================================================================
   METRIC CARD
   ==================================================================== */
const MetricCard = ({ label, value, delta, deltaTone = 'pos', spark, sparkColor }) => (
  <div className="card card-pad metric">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
      <div className="label">{label}</div>
      {spark && <Sparkline data={spark} color={sparkColor || '#075056'} />}
    </div>
    <div className="value">{value}</div>
    <div className={`delta delta-${deltaTone}`}>
      {deltaTone === 'pos'  && <Icon name="arrow_up" size={11} />}
      {deltaTone === 'neg'  && <Icon name="arrow_down" size={11} />}
      {deltaTone === 'warn' && <Icon name="alert" size={11} />}
      {delta}
    </div>
  </div>
);

window.SBKIcon = Icon;
window.SBKStatus = StatusBadge;
window.SBKSpark = Sparkline;
window.SBKMetric = MetricCard;
