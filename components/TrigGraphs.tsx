
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { COLORS } from '../constants';

interface TrigGraphsProps {
  currentAngle: number;
}

const TrigGraphs: React.FC<TrigGraphsProps> = ({ currentAngle }) => {
  const data = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 360; i += 5) {
      points.push({
        angle: i,
        sin: Math.sin((i * Math.PI) / 180),
        cos: Math.cos((i * Math.PI) / 180),
      });
    }
    return points;
  }, []);

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800 w-full h-full min-h-[400px]">
      <div className="flex justify-between items-center mb-6">
         <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Wave Function</h3>
         <div className="flex gap-4">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-400" /><span className="text-[9px] font-black text-slate-400">SIN</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-[9px] font-black text-slate-400">COS</span></div>
         </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="angle" hide />
            <YAxis domain={[-1.1, 1.1]} tick={{fontSize: 9, fill: '#475569'}} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
              itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
              labelStyle={{ color: '#94a3b8', fontSize: '10px', marginBottom: '4px' }}
              formatter={(value: number) => value.toFixed(3)}
              labelFormatter={(label) => `Angle: ${label}°`}
            />
            <ReferenceLine x={currentAngle} stroke={COLORS.primary} strokeWidth={2} strokeDasharray="3 3" />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
            <Line type="monotone" dataKey="sin" stroke={COLORS.secondary} strokeWidth={3} dot={false} animationDuration={400} />
            <Line type="monotone" dataKey="cos" stroke={COLORS.tertiary} strokeWidth={3} dot={false} animationDuration={400} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrigGraphs;
