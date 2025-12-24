
import React, { useState, useCallback } from 'react';
import UnitCircle from './components/UnitCircle';
import { getTrigExplanation } from './services/geminiService';

const App: React.FC = () => {
  const [angle, setAngle] = useState<number>(45);
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFetchExplanation = useCallback(async () => {
    setIsLoading(true);
    const text = await getTrigExplanation(angle);
    setExplanation(text);
    setIsLoading(false);
  }, [angle]);

  const presets = [0, 30, 45, 60, 90, 180, 270, 360];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pb-20 font-sans selection:bg-blue-500/30">
      <header className="bg-slate-950/50 backdrop-blur-2xl border-b border-white/5 px-10 py-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-3 rounded-2xl shadow-2xl shadow-blue-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m12 12 7-5"/><circle cx="12" cy="12" r="10"/></svg>
          </div>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter">فیزیک <span className="text-blue-400">دهم</span></h1>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">پیشرفته - تجزیه بردارها</p>
          </div>
        </div>
        <div className="text-xl font-black text-blue-400 bg-blue-500/5 px-8 py-3 rounded-full border border-blue-500/10 italic shadow-inner">
          ∠θ = {angle}°
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-8 py-12 grid grid-cols-1 xl:grid-cols-12 gap-12">
        <div className="xl:col-span-8 space-y-12">
          <UnitCircle angle={angle} onAngleChange={setAngle} />
          
          <div className="bg-slate-900/40 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white/5 shadow-2xl">
            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mb-10 text-center italic">فرمول‌های کلیدی تجزیه بردار (فصل ۲ فیزیک ۱)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'مؤلفه افقی', formula: 'Fx = F · cosθ', color: 'text-emerald-400' },
                { label: 'مؤلفه عمودی', formula: 'Fy = F · sinθ', color: 'text-rose-400' },
                { label: 'تانژانت بردار', formula: 'tanθ = Fy / Fx', color: 'text-amber-400' },
                { label: 'اندازه کل (فیثاغورس)', formula: 'F = √(Fx² + Fy²)', color: 'text-cyan-400' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center p-8 rounded-3xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all group">
                  <span className="text-[10px] font-black text-slate-600 mb-4 uppercase tracking-widest">{item.label}</span>
                  <code className={`${item.color} font-black text-xl tracking-tighter`}>{item.formula}</code>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-12">
          <section className="bg-slate-900/30 backdrop-blur-2xl p-10 rounded-[3.5rem] border border-white/5 shadow-2xl">
            <h3 className="text-[11px] font-black text-blue-500/40 uppercase mb-8 tracking-[0.3em]">تنظیم دقیق زاویه</h3>
            <div className="flex justify-between items-end mb-10">
              <span className="text-7xl font-black text-white italic drop-shadow-2xl">{angle}°</span>
              <div className="grid grid-cols-3 gap-2">
                {presets.slice(1, 4).map(p => (
                  <button key={p} onClick={() => setAngle(p)} className="px-4 py-3 rounded-xl bg-slate-800 text-[11px] font-black hover:bg-blue-500 hover:text-slate-950 transition-all active:scale-90 shadow-lg">{p}°</button>
                ))}
              </div>
            </div>
            <input 
              type="range" min="0" max="360" value={angle} 
              onChange={(e) => setAngle(Number(e.target.value))} 
              className="w-full h-3 bg-slate-950 rounded-full appearance-none cursor-pointer accent-blue-500 border border-white/5 shadow-inner" 
            />
            <div className="flex justify-between mt-4 px-1 text-[10px] font-black text-slate-700">
               <span>0°</span><span>90°</span><span>180°</span><span>270°</span><span>360°</span>
            </div>
          </section>

          <section className="bg-gradient-to-br from-blue-700 via-indigo-900 to-slate-950 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 blur-3xl rounded-full"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-4 italic tracking-tighter">تحلیل هوشمند</h3>
              <p className="text-blue-100/70 text-sm font-medium mb-10 leading-relaxed italic">تحلیل بردار نیرو و کاربرد زاویه {angle} درجه در مسائل فیزیک دهم.</p>
              
              <button 
                onClick={handleFetchExplanation} disabled={isLoading}
                className="w-full py-6 bg-white text-slate-950 rounded-[2rem] font-black hover:bg-blue-50 transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 text-lg"
              >
                {isLoading ? <div className="w-5 h-5 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /> : 'تحلیل با هوش مصنوعی'}
              </button>

              {explanation && (
                <div className="mt-8 p-8 bg-black/30 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 text-sm text-blue-50 leading-loose text-right animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-xl">
                  {explanation}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
