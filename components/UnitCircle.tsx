
import React, { useRef, useEffect, useState } from 'react';
import { CENTER, RADIUS, COLORS, UNIT_CIRCLE_SIZE } from '../constants';

interface UnitCircleProps {
  angle: number;
  onAngleChange: (angle: number) => void;
}

// تابعی برای تبدیل مقادیر به فرمت جزوه‌ای (Latex-style text)
// Fixed the return type to match the internal object structure (t for top, b for bottom, s for sign)
const getRadicalPart = (angle: number, type: 'sin' | 'cos' | 'tan' | 'cot'): { t: string, b?: string, s?: string } => {
  const norm = ((angle % 360) + 360) % 360;
  
  const mapping: Record<number, Record<string, any>> = {
    0:   { sin: {t:'0'}, cos: {t:'1'}, tan: {t:'0'}, cot: {t:'∞'} },
    30:  { sin: {t:'1', b:'2'}, cos: {t:'√3', b:'2'}, tan: {t:'√3', b:'3'}, cot: {t:'√3'} },
    45:  { sin: {t:'√2', b:'2'}, cos: {t:'√2', b:'2'}, tan: {t:'1'}, cot: {t:'1'} },
    60:  { sin: {t:'√3', b:'2'}, cos: {t:'1', b:'2'}, tan: {t:'√3'}, cot: {t:'√3', b:'3'} },
    90:  { sin: {t:'1'}, cos: {t:'0'}, tan: {t:'∞'}, cot: {t:'0'} },
    120: { sin: {t:'√3', b:'2'}, cos: {t:'1', b:'2', s:'-'}, tan: {t:'√3', s:'-'}, cot: {t:'√3', b:'3', s:'-'} },
    135: { sin: {t:'√2', b:'2'}, cos: {t:'√2', b:'2', s:'-'}, tan: {t:'1', s:'-'}, cot: {t:'1', s:'-'} },
    150: { sin: {t:'1', b:'2'}, cos: {t:'√3', b:'2', s:'-'}, tan: {t:'√3', b:'3', s:'-'}, cot: {t:'√3', s:'-'} },
    180: { sin: {t:'0'}, cos: {t:'1', s:'-'}, tan: {t:'0'}, cot: {t:'∞'} },
    210: { sin: {t:'1', b:'2', s:'-'}, cos: {t:'√3', b:'2', s:'-'}, tan: {t:'√3', b:'3'}, cot: {t:'√3'} },
    225: { sin: {t:'√2', b:'2', s:'-'}, cos: {t:'√2', b:'2', s:'-'}, tan: {t:'1'}, cot: {t:'1'} },
    240: { sin: {t:'√3', b:'2', s:'-'}, cos: {t:'1', b:'2', s:'-'}, tan: {t:'√3'}, cot: {t:'√3', b:'3'} },
    270: { sin: {t:'1', s:'-'}, cos: {t:'0'}, tan: {t:'∞'}, cot: {t:'0'} },
    300: { sin: {t:'√3', b:'2', s:'-'}, cos: {t:'1', b:'2'}, tan: {t:'√3', s:'-'}, cot: {t:'√3', b:'3', s:'-'} },
    315: { sin: {t:'√2', b:'2', s:'-'}, cos: {t:'√2', b:'2'}, tan: {t:'1', s:'-'}, cot: {t:'1', s:'-'} },
    330: { sin: {t:'1', b:'2', s:'-'}, cos: {t:'√3', b:'2'}, tan: {t:'√3', b:'3', s:'-'}, cot: {t:'√3', s:'-'} },
    360: { sin: {t:'0'}, cos: {t:'1'}, tan: {t:'0'}, cot: {t:'∞'} }
  };

  if (mapping[norm]) return mapping[norm][type];
  
  const r = (angle * Math.PI) / 180;
  let val = 0;
  if (type === 'sin') val = Math.sin(r);
  else if (type === 'cos') val = Math.cos(r);
  return { t: Math.abs(val).toFixed(2), s: val < 0 ? '-' : '' };
};

// کامپوننت نمایش کسر شبیه جزوه در SVG
const FractionText: React.FC<{ x: number, y: number, data: any, color: string, vertical?: boolean }> = ({ x, y, data, color, vertical }) => {
  if (!data) return null;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <text x={0} y={data.b ? -6 : 4} textAnchor="middle" className={`text-[13px] font-bold fill-[${color}]`} style={{ fill: color }}>
        {(data.s || '') + data.t}
      </text>
      {data.b && (
        <>
          <line x1="-12" y1="-2" x2="12" y2="-2" stroke={color} strokeWidth="1.5" />
          <text x={0} y={12} textAnchor="middle" className={`text-[13px] font-bold fill-[${color}]`} style={{ fill: color }}>
            {data.b}
          </text>
        </>
      )}
    </g>
  );
};

const UnitCircle: React.FC<UnitCircleProps> = ({ angle, onAngleChange }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  
  const x = CENTER + RADIUS * cos;
  const y = CENTER - RADIUS * sin;

  const tanValue = Math.tan(rad);
  const cotValue = 1 / Math.tan(rad);
  const tanY = CENTER - RADIUS * tanValue;
  const cotX = CENTER + RADIUS * cotValue;

  const isTanDefined = Math.abs(angle % 180) !== 90;
  const isCotDefined = (angle % 180) !== 0;

  const handleInteraction = (clientX: number, clientY: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;
    const dx = mouseX - CENTER;
    const dy = CENTER - mouseY;
    let newAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (newAngle < 0) newAngle += 360;
    
    const special = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];
    let snapped = Math.round(newAngle);
    for (const s of special) {
      if (Math.abs(snapped - s) < 4) { snapped = s; break; }
    }
    onAngleChange(snapped % 360);
  };

  return (
    <div className="relative bg-slate-900/50 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col items-center select-none overflow-visible transition-all duration-500">
      
      <div className="absolute top-8 left-10 z-10">
        <div className="text-[10px] font-black text-blue-500/40 uppercase tracking-[0.4em] mb-1">دایره مثلثاتی پایه دهم</div>
        <div className="text-4xl font-black text-white italic tracking-tighter">
          θ = <span className="text-blue-400">{angle}°</span>
        </div>
      </div>

      <svg 
        ref={svgRef} 
        width={UNIT_CIRCLE_SIZE} 
        height={UNIT_CIRCLE_SIZE} 
        className="overflow-visible cursor-crosshair touch-none"
        onMouseDown={(e) => { setIsDragging(true); handleInteraction(e.clientX, e.clientY); }}
        onMouseMove={(e) => { if (isDragging) handleInteraction(e.clientX, e.clientY); }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Axes & Grid */}
        <line x1="0" y1={CENTER} x2={UNIT_CIRCLE_SIZE} y2={CENTER} stroke="white" strokeOpacity="0.1" />
        <line x1={CENTER} y1="0" x2={CENTER} y2={UNIT_CIRCLE_SIZE} stroke="white" strokeOpacity="0.1" />

        {/* Degree Markings */}
        {[0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330].map(deg => {
            const r = deg * Math.PI / 180;
            const x1 = CENTER + (RADIUS - 5) * Math.cos(r);
            const y1 = CENTER - (RADIUS - 5) * Math.sin(r);
            const x2 = CENTER + (RADIUS + 5) * Math.cos(r);
            const y2 = CENTER - (RADIUS + 5) * Math.sin(r);
            return (
                <g key={deg}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
                    <text 
                        x={CENTER + (RADIUS + 25) * Math.cos(r)} 
                        y={CENTER - (RADIUS + 25) * Math.sin(r)} 
                        textAnchor="middle" alignmentBaseline="middle" 
                        className="text-[10px] fill-slate-500 font-bold"
                    >
                        {deg}°
                    </text>
                </g>
            );
        })}

        {/* Main Unit Circle */}
        <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="2" />

        {/* Tangent Axis (x = 1) */}
        <line x1={CENTER + RADIUS} y1="0" x2={CENTER + RADIUS} y2={UNIT_CIRCLE_SIZE} stroke="rgba(251, 191, 36, 0.2)" strokeWidth="1.5" strokeDasharray="5 5" />
        <text x={CENTER + RADIUS + 10} y={20} className="text-[9px] font-black fill-amber-500/50 tracking-widest uppercase">محور تانژانت</text>

        {/* Cotangent Axis (y = 1) */}
        <line x1="0" y1={CENTER - RADIUS} x2={UNIT_CIRCLE_SIZE} y2={CENTER - RADIUS} stroke="rgba(129, 140, 248, 0.2)" strokeWidth="1.5" strokeDasharray="5 5" />

        {/* Ray Extension for Intersections */}
        {(isTanDefined || isCotDefined) && (
            <line x1={CENTER} y1={CENTER} x2={cos >= 0 ? CENTER + RADIUS * 2.5 : CENTER - RADIUS * 2.5} y2={cos >= 0 ? CENTER - RADIUS * 2.5 * tanValue : CENTER + RADIUS * 2.5 * tanValue} stroke="white" strokeOpacity="0.05" strokeDasharray="3 3" />
        )}

        {/* Tangent Intersection */}
        {isTanDefined && Math.abs(tanValue) < 5 && (
            <g>
                <line x1={CENTER + RADIUS} y1={CENTER} x2={CENTER + RADIUS} y2={tanY} stroke={COLORS.accent} strokeWidth="4" strokeLinecap="round" filter="url(#glow)" />
                <circle cx={CENTER + RADIUS} cy={tanY} r="5" fill={COLORS.accent} stroke="white" strokeWidth="1.5" filter="url(#glow)" />
                <FractionText x={CENTER + RADIUS + 25} y={tanY} data={getRadicalPart(angle, 'tan')} color={COLORS.accent} />
                <text x={CENTER + RADIUS + 15} y={tanY + 15} className="text-[10px] font-black fill-amber-600/60 uppercase">tan θ</text>
            </g>
        )}

        {/* Cotangent Intersection */}
        {isCotDefined && Math.abs(cotValue) < 5 && (
            <g>
                <line x1={CENTER} y1={CENTER - RADIUS} x2={cotX} y2={CENTER - RADIUS} stroke={COLORS.indigo} strokeWidth="4" strokeLinecap="round" filter="url(#glow)" />
                <circle cx={cotX} cy={CENTER - RADIUS} r="5" fill={COLORS.indigo} stroke="white" strokeWidth="1.5" filter="url(#glow)" />
                <FractionText x={cotX} y={CENTER - RADIUS - 25} data={getRadicalPart(angle, 'cot')} color={COLORS.indigo} />
                <text x={cotX} y={CENTER - RADIUS - 12} textAnchor="middle" className="text-[10px] font-black fill-indigo-600/60 uppercase">cot θ</text>
            </g>
        )}

        {/* Cosine (Fx) & Sine (Fy) Projections */}
        <line x1={CENTER} y1={CENTER} x2={x} y2={CENTER} stroke={COLORS.tertiary} strokeWidth="8" strokeLinecap="round" filter="url(#glow)" />
        <FractionText x={(CENTER + x) / 2} y={CENTER + (y > CENTER ? -25 : 30)} data={getRadicalPart(angle, 'cos')} color={COLORS.tertiary} />

        <line x1={x} y1={CENTER} x2={x} y2={y} stroke={COLORS.secondary} strokeWidth="6" strokeDasharray="6 3" strokeLinecap="round" filter="url(#glow)" />
        <g transform={`translate(${x + (x > CENTER ? 35 : -35)}, ${(CENTER + y) / 2})`}>
             <FractionText x={0} y={0} data={getRadicalPart(angle, 'sin')} color={COLORS.secondary} />
        </g>

        {/* Main Vector */}
        <line x1={CENTER} y1={CENTER} x2={x} y2={y} stroke={COLORS.primary} strokeWidth="6" strokeLinecap="round" filter="url(#glow)" />
        
        {/* Interaction Handle */}
        <g className="cursor-pointer group">
            <circle cx={x} cy={y} r="20" fill={COLORS.primary} fillOpacity="0.1" className="transition-all group-hover:fill-opacity-20" />
            <circle cx={x} cy={y} r="9" fill={COLORS.primary} stroke="white" strokeWidth="2.5" filter="url(#glow)" />
        </g>

        {/* Angle Arc */}
        <path d={`M ${CENTER + 40} ${CENTER} A 40 40 0 ${angle > 180 ? 1 : 0} 0 ${CENTER + 40 * cos} ${CENTER - 40 * sin}`} fill="none" stroke={COLORS.primary} strokeWidth="2.5" strokeOpacity="0.6" />
      </svg>

      {/* Numeric Results Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full">
        {[
          { l: 'sin θ (Fy)', v: getRadicalPart(angle, 'sin'), c: 'text-rose-400' },
          { l: 'cos θ (Fx)', v: getRadicalPart(angle, 'cos'), c: 'text-emerald-400' },
          { l: 'tan θ', v: getRadicalPart(angle, 'tan'), c: 'text-amber-400' },
          { l: 'cot θ', v: getRadicalPart(angle, 'cot'), c: 'text-indigo-400' }
        ].map((item, i) => (
          <div key={i} className="bg-slate-950/60 p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center">
            <span className="text-[9px] font-black text-slate-600 uppercase mb-3 tracking-widest">{item.l}</span>
            <div className="flex flex-col items-center">
               <span className={`text-xl font-bold ${item.c}`}>{(item.v.s || '') + item.v.t}</span>
               {item.v.b && <div className={`w-full h-0.5 my-0.5 bg-current ${item.c} opacity-50`} />}
               {item.v.b && <span className={`text-xl font-bold ${item.c}`}>{item.v.b}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnitCircle;
