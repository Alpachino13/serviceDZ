// ─── Pure SVG Chart Components ────────────────────────────────────────────────
// Zero external dependencies. Uses design system colors.

import { useState } from 'react';

// ── BarChart ──────────────────────────────────────────────────────────────────
// data: [{label, value}]
export function BarChart({ data = [], color = '#0C5E47', height = 180, unit = '' }) {
  const [hovered, setHovered] = useState(null);
  if (!data.length) return null;

  const W = 560, H = height;
  const pad = { t: 10, r: 10, b: 40, l: 38 };
  const chartW = W - pad.l - pad.r;
  const chartH = H - pad.t - pad.b;
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const barW = (chartW / data.length) * 0.6;
  const gap  = (chartW / data.length) * 0.4;
  const yTicks = 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto',display:'block'}}>
      {/* Y grid + labels */}
      {Array.from({length: yTicks + 1}, (_, i) => {
        const val = Math.round((maxVal / yTicks) * (yTicks - i));
        const y = pad.t + (chartH / yTicks) * i;
        return (
          <g key={i}>
            <line x1={pad.l} x2={pad.l + chartW} y1={y} y2={y}
              stroke="#E2DDD5" strokeWidth="1" strokeDasharray="4 3" />
            <text x={pad.l - 6} y={y + 4} textAnchor="end"
              fontSize="11" fill="#8A8A82">{val}{unit}</text>
          </g>
        );
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const x = pad.l + (chartW / data.length) * i + gap / 2;
        const barH = (d.value / maxVal) * chartH;
        const y = pad.t + chartH - barH;
        const isHov = hovered === i;

        return (
          <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <rect x={x} y={y} width={barW} height={barH} rx="5"
              fill={isHov ? '#1A7A5E' : color} style={{transition:'fill 150ms'}} />
            {isHov && (
              <g>
                <rect x={x - 8} y={y - 30} width={barW + 16} height={22} rx="5" fill="#1C1C1A" />
                <text x={x + barW/2} y={y - 14} textAnchor="middle" fontSize="11"
                  fontWeight="600" fill="white">{d.value}{unit}</text>
              </g>
            )}
            <text x={x + barW/2} y={H - 8} textAnchor="middle" fontSize="11" fill="#8A8A82">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── LineChart ─────────────────────────────────────────────────────────────────
// data: [{label, value}]
export function LineChart({ data = [], color = '#0C5E47', height = 180, unit = '' }) {
  const [hovered, setHovered] = useState(null);
  if (!data.length) return null;

  const W = 560, H = height;
  const pad = { t: 14, r: 14, b: 40, l: 40 };
  const chartW = W - pad.l - pad.r;
  const chartH = H - pad.t - pad.b;
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const minVal = 0;
  const range  = maxVal - minVal || 1;
  const yTicks = 4;

  const px = (i) => pad.l + (chartW / (data.length - 1)) * i;
  const py = (v) => pad.t + chartH - ((v - minVal) / range) * chartH;

  const polyline = data.map((d, i) => `${px(i)},${py(d.value)}`).join(' ');
  const area = [
    `${px(0)},${pad.t + chartH}`,
    ...data.map((d, i) => `${px(i)},${py(d.value)}`),
    `${px(data.length - 1)},${pad.t + chartH}`,
  ].join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto',display:'block'}}>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Y grid */}
      {Array.from({length: yTicks + 1}, (_, i) => {
        const val = Math.round(minVal + (range / yTicks) * (yTicks - i));
        const y = pad.t + (chartH / yTicks) * i;
        return (
          <g key={i}>
            <line x1={pad.l} x2={pad.l + chartW} y1={y} y2={y}
              stroke="#E2DDD5" strokeWidth="1" strokeDasharray="4 3" />
            <text x={pad.l - 7} y={y + 4} textAnchor="end" fontSize="11" fill="#8A8A82">
              {val}{unit}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <polygon points={area} fill="url(#lg)" />

      {/* Line */}
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5"
        strokeLinejoin="round" strokeLinecap="round" />

      {/* Points + X labels */}
      {data.map((d, i) => {
        const x = px(i), y = py(d.value);
        const isHov = hovered === i;
        return (
          <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <circle cx={x} cy={y} r={isHov ? 6 : 4} fill={color}
              stroke="white" strokeWidth="2" style={{transition:'r 150ms'}} />
            {isHov && (
              <g>
                <rect x={x - 22} y={y - 32} width={44} height={22} rx="5" fill="#1C1C1A" />
                <text x={x} y={y - 16} textAnchor="middle" fontSize="11"
                  fontWeight="600" fill="white">{d.value}{unit}</text>
              </g>
            )}
            <text x={x} y={H - 6} textAnchor="middle" fontSize="11" fill="#8A8A82">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── DonutChart ─────────────────────────────────────────────────────────────────
// data: [{label, value, color}]
export function DonutChart({ data = [], size = 160 }) {
  const [hovered, setHovered] = useState(null);
  if (!data.length) return null;

  const total  = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = size / 2, cy = size / 2;
  const R = size * 0.36, r = size * 0.22;

  let angle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const slice = (d.value / total) * 2 * Math.PI;
    const startA = angle;
    angle += slice;
    return { ...d, startA, endA: angle, mid: startA + slice / 2, i };
  });

  const arc = (cx, cy, R, startA, endA, large) => {
    const x1 = cx + R * Math.cos(startA), y1 = cy + R * Math.sin(startA);
    const x2 = cx + R * Math.cos(endA),   y2 = cy + R * Math.sin(endA);
    const x3 = cx + r * Math.cos(endA),   y3 = cy + r * Math.sin(endA);
    const x4 = cx + r * Math.cos(startA), y4 = cy + r * Math.sin(startA);
    return `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}
            L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`;
  };

  return (
    <div style={{display:'flex',alignItems:'center',gap:20}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
        {slices.map(s => {
          const large = s.endA - s.startA > Math.PI ? 1 : 0;
          const isHov = hovered === s.i;
          const offset = isHov ? 4 : 0;
          const mx = Math.cos(s.mid) * offset;
          const my = Math.sin(s.mid) * offset;
          return (
            <path key={s.i}
              d={arc(cx + mx, cy + my, R, s.startA, s.endA, large)}
              fill={s.color} style={{transition:'transform 150ms'}}
              onMouseEnter={() => setHovered(s.i)}
              onMouseLeave={() => setHovered(null)} />
          );
        })}
        {/* Center label */}
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="20" fontWeight="800" fill="#1C1C1A"
          fontFamily="Syne, sans-serif">{total}</text>
        <text x={cx} y={cy + 13} textAnchor="middle" fontSize="11" fill="#8A8A82">total</text>
      </svg>

      {/* Legend */}
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {data.map((d, i) => (
          <div key={i} style={{display:'flex',alignItems:'center',gap:8,cursor:'default',
            opacity: hovered !== null && hovered !== i ? 0.45 : 1, transition:'opacity 150ms'}}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <span style={{width:10,height:10,borderRadius:3,background:d.color,flexShrink:0}} />
            <span style={{fontSize:12.5,color:'#4A4A45'}}>{d.label}</span>
            <span style={{fontSize:12.5,fontWeight:700,color:'#1C1C1A',marginLeft:'auto'}}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
