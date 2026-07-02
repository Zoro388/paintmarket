// "use client";
// import { useState } from "react";
// import { Calculator, Layers, ArrowRight, RotateCcw } from "lucide-react";

// // ── Paint Coverage Calculator ──────────────────────────────────────────────────
// function PaintCalculator() {
//   // const [length, setLength] = useState("");
//   const [width, setWidth] = useState("");
//   const [height, setHeight] = useState("");
//   const [coats, setCoats] = useState("2");
//   const [coverage, setCoverage] = useState("12"); // m² per litre (standard)
//   const [result, setResult] = useState<{ litres: number; tins4L: number; tins20L: number } | null>(null);

//   const inputCls =
//     "w-full bg-brand-black border border-brand-border text-white placeholder-brand-subtle px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 transition-all";

//   const calculate = () => {
//     const w = parseFloat(width);
//     const h = parseFloat(height);
//     const c = parseInt(coats);
//     const cov = parseFloat(coverage);

//     if ( !w || !h || isNaN(w) || isNaN(h)) return;

//     // Total wall area = perimeter × height (two lengths + two widths)
//     const wallArea = 2 * ( + w) * h;
//     const totalLitres = (wallArea * c) / cov;

//     setResult({
//       litres: Math.ceil(totalLitres),
//       tins4L: Math.ceil(totalLitres / 4),
//       tins20L: Math.ceil(totalLitres / 20),
//     });
//   };

//   const reset = () => {
//    ; setWidth(""); setHeight("");
//     setCoats("2"); setCoverage("12"); setResult(null);
//   };

//   return (
//     <div className="flex flex-col gap-5">
//       <div className="grid sm:grid-cols-3 gap-3">
//         {[
//           { label: "Wall Width (m)",  value: width,  set: setWidth,  ph: "e.g. 4" },
//           { label: "Wall Height (m)", value: height, set: setHeight, ph: "e.g. 3" },
//         ].map(({ label, value, set, ph }) => (
//           <div key={label} className="flex flex-col gap-1.5">
//             <label className="text-brand-lt-gray text-xs font-medium">{label}</label>
//             <input
//               type="number"
//               min="0"
//               step="0.1"
//               value={value}
//               onChange={(e) => { set(e.target.value); setResult(null); }}
//               placeholder={ph}
//               className={inputCls}
//             />
//           </div>
//         ))}
//       </div>

//       <div className="grid sm:grid-cols-2 gap-3">
//         <div className="flex flex-col gap-1.5">
//           <label className="text-brand-lt-gray text-xs font-medium">Number of Coats</label>
//           <select value={coats} onChange={(e) => { setCoats(e.target.value); setResult(null); }} className={inputCls}>
//             <option value="1">1 coat</option>
//             <option value="2">2 coats (recommended)</option>
//             <option value="3">3 coats</option>
//           </select>
//         </div>
//         <div className="flex flex-col gap-1.5">
//           <label className="text-brand-lt-gray text-xs font-medium">Paint Coverage (m² per litre)</label>
//           <select value={coverage} onChange={(e) => { setCoverage(e.target.value); setResult(null); }} className={inputCls}>
//             <option value="8">8 m²/L — Textured / Heavy</option>
//             <option value="10">10 m²/L — Exterior Gloss</option>
//             <option value="12">12 m²/L — Standard Emulsion</option>
//             <option value="14">14 m²/L — Silk / Matt</option>
//           </select>
//         </div>
//       </div>

//       <div className="flex gap-3">
//         <button
//           onClick={calculate}
//           className="flex-1 flex items-center justify-center gap-2 bg-brand-accent text-brand-black font-semibold py-2.5 rounded-lg hover:bg-brand-accent-lt transition-all text-sm"
//         >
//           <Calculator size={15} /> Calculate
//         </button>
//         <button
//           onClick={reset}
//           className="flex items-center justify-center gap-2 border border-brand-border text-brand-mid px-4 py-2.5 rounded-lg hover:text-white hover:border-brand-border-lt transition-all text-sm"
//         >
//           <RotateCcw size={14} /> Reset
//         </button>
//       </div>

//       {result && (
//         <div className="bg-brand-raised border border-brand-border rounded-xl p-5 animate-fade-in">
//           <p className="text-brand-accent text-xs font-semibold uppercase tracking-wider mb-4">
//             Estimated Paint Required
//           </p>
//           <div className="grid grid-cols-3 gap-3 text-center">
//             {[
//               { label: "Total Litres", value: `${result.litres}L` },
//               { label: "4L Tins", value: result.tins4L },
//               { label: "20L Tins", value: result.tins20L },
//             ].map(({ label, value }) => (
//               <div key={label} className="bg-brand-card border border-brand-border rounded-lg py-3 px-2">
//                 <p className="text-brand-accent font-bold text-2xl font-display">{value}</p>
//                 <p className="text-brand-mid text-xs mt-1">{label}</p>
//               </div>
//             ))}
//           </div>
//           <p className="text-brand-subtle text-[11px] mt-3 leading-relaxed">
//             * Estimate based on wall area only (ceiling not included). We recommend buying 10% extra as a buffer.
//           </p>
//           <a
//             href="/shop"
//             className="mt-4 flex items-center justify-center gap-2 border border-brand-accent/40 text-brand-accent text-sm font-medium py-2.5 rounded-lg hover:bg-brand-accent-muted transition-all"
//           >
//             Shop Paints Now <ArrowRight size={13} />
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Wall Area Estimator ────────────────────────────────────────────────────────
// function WallAreaEstimator() {
//   const [rooms, setRooms] = useState([{ name: "Living Room", length: "", width: "", height: "" }]);
//   const [result, setResult] = useState<number | null>(null);

//   const inputCls =
//     "w-full bg-brand-black border border-brand-border text-white placeholder-brand-subtle px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 transition-all";

//   const addRoom = () => {
//     setRooms((prev) => [...prev, { name: `Room ${prev.length + 1}`, length: "", width: "", height: "" }]);
//     setResult(null);
//   };

//   const updateRoom = (idx: number, field: string, value: string) => {
//     setRooms((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
//     setResult(null);
//   };

//   const removeRoom = (idx: number) => {
//     if (rooms.length === 1) return;
//     setRooms((prev) => prev.filter((_, i) => i !== idx));
//     setResult(null);
//   };

//   const calculate = () => {
//     let total = 0;
//     rooms.forEach((r) => {
//       const l = parseFloat(r.length);
//       const w = parseFloat(r.width);
//       const h = parseFloat(r.height);
//       if (l && w && h) total += 2 * (l + w) * h;
//     });
//     setResult(Math.round(total * 100) / 100);
//   };

//   return (
//     <div className="flex flex-col gap-4">
//       <div className="flex flex-col gap-3">
//         {rooms.map((room, idx) => (
//           <div key={idx} className="bg-brand-black border border-brand-border rounded-xl p-4 flex flex-col gap-3">
//             <div className="flex items-center justify-between">
//               <input
//                 value={room.name}
//                 onChange={(e) => updateRoom(idx, "name", e.target.value)}
//                 className="bg-transparent text-white text-sm font-medium outline-none w-32 focus:text-brand-accent"
//               />
//               {rooms.length > 1 && (
//                 <button onClick={() => removeRoom(idx)} className="text-brand-subtle hover:text-red-400 text-xs transition-colors">
//                   Remove
//                 </button>
//               )}
//             </div>
//             <div className="grid grid-cols-3 gap-2">
//               {[
//                 { field: "length", ph: "Length (m)" },
//                 { field: "width",  ph: "Width (m)" },
//                 { field: "height", ph: "Height (m)" },
//               ].map(({ field, ph }) => (
//                 <input
//                   key={field}
//                   type="number"
//                   min="0"
//                   step="0.1"
//                   value={(room as Record<string, string>)[field]}
//                   onChange={(e) => updateRoom(idx, field, e.target.value)}
//                   placeholder={ph}
//                   className={inputCls}
//                 />
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       <button
//         onClick={addRoom}
//         className="text-brand-accent text-sm font-medium flex items-center gap-1.5 hover:text-brand-accent-lt transition-colors w-fit"
//       >
//         + Add Another Room
//       </button>

//       <button
//         onClick={calculate}
//         className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black font-semibold py-2.5 rounded-lg hover:bg-brand-accent-lt transition-all text-sm"
//       >
//         <Layers size={15} /> Calculate Total Area
//       </button>

//       {result !== null && (
//         <div className="bg-brand-raised border border-brand-border rounded-xl p-5 animate-fade-in text-center">
//           <p className="text-brand-mid text-xs uppercase tracking-wider mb-2">Total Wall Area</p>
//           <p className="text-brand-accent font-bold text-4xl font-display">{result} m²</p>
//           <p className="text-brand-mid text-xs mt-2">across {rooms.filter((r) => r.length && r.width && r.height).length} room(s)</p>
//           <a
//             href="/site-estimator"
//             className="mt-4 flex items-center justify-center gap-2 border border-brand-accent/40 text-brand-accent text-sm font-medium py-2.5 rounded-lg hover:bg-brand-accent-muted transition-all"
//           >
//             Book a  Site Estimate <ArrowRight size={13} />
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Main Tools Section ─────────────────────────────────────────────────────────
// const TOOLS = [
//   {
//     key: "coverage",
//     icon: Calculator,
//     label: "Paint Calculator",
//     desc: "Find out exactly how much paint you need for your room",
//   },
 
// ];

// export default function ToolsSection() {
//   const [activeTool, setActiveTool] = useState("coverage");

//   return (
//     <section className="bg-brand-surface py-24 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-5xl mx-auto">

//         {/* Header */}
//         <div className="text-center mb-14">
//           <p className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-3">
//             Tools
//           </p>
//           <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
//             Plan Your Project Smarter
//           </h2>
//           <p className="text-brand-mid text-lg max-w-xl mx-auto">
//             Use our calculators to estimate paint quantities and wall areas before you order — no guesswork.
//           </p>
//         </div>

//         {/* Tool selector */}
//         <div className="grid sm:grid-cols-2 gap-4 mb-10">
//           {TOOLS.map(({ key, icon: Icon, label, desc }) => (
//             <button
//               key={key}
//               onClick={() => setActiveTool(key)}
//               className={`text-left p-5 rounded-2xl border transition-all duration-200 ${
//                 activeTool === key
//                   ? "border-brand-accent bg-brand-accent-muted"
//                   : "border-brand-border bg-brand-card hover:border-brand-border-lt"
//               }`}
//             >
//               <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
//                 activeTool === key ? "bg-brand-accent/20" : "bg-brand-raised"
//               }`}>
//                 <Icon size={18} className={activeTool === key ? "text-brand-accent" : "text-brand-mid"} />
//               </div>
//               <p className={`font-semibold text-sm ${activeTool === key ? "text-white" : "text-brand-lt-gray"}`}>
//                 {label}
//               </p>
//               <p className="text-brand-mid text-xs mt-1 leading-relaxed">{desc}</p>
//             </button>
//           ))}
//         </div>

//         {/* Active tool panel */}
//         <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8">
//             <>
//               <h3 className="font-display text-xl font-bold text-white mb-1">Paint Coverage Calculator</h3>
//               <p className="text-brand-mid text-sm mb-6">Enter your room dimensions to find out how many litres and tins you need.</p>
//               <PaintCalculator />
//             </>
        
//         </div>

//       </div>
//     </section>
//   );
// }

"use client";
import { useState } from "react";
import { Calculator, Layers, ArrowRight, RotateCcw } from "lucide-react";

// ── Paint Coverage Calculator ──────────────────────────────────────────────────
function PaintCalculator() {
  // const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [coats, setCoats] = useState("2");
  const [coverage, setCoverage] = useState("5"); // m² per bucket (updated from 8m to 5m)
  const [result, setResult] = useState<{ buckets: number; tins1B: number; tins4B: number } | null>(null);

  const inputCls =
    "w-full bg-brand-black border border-brand-border text-white placeholder-brand-subtle px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 transition-all";

  const calculate = () => {
    const w = parseFloat(width);
    const h = parseFloat(height);
    const c = parseInt(coats);
    const cov = parseFloat(coverage);

    if (!w || !h || isNaN(w) || isNaN(h)) return;

    // Total wall area = perimeter × height (two lengths + two widths)
    const wallArea = 2 * (w + w) * h;
    const totalBuckets = (wallArea * c) / cov;

    setResult({
      buckets: Math.ceil(totalBuckets),
      tins1B: Math.ceil(totalBuckets / 1),
      tins4B: Math.ceil(totalBuckets / 4),
    });
  };

  const reset = () => {
    setWidth(""); setHeight("");
    setCoats("2"); setCoverage("5"); setResult(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: "Wall Width (m)",  value: width,  set: setWidth,  ph: "e.g. 4" },
          { label: "Wall Height (m)", value: height, set: setHeight, ph: "e.g. 3" },
        ].map(({ label, value, set, ph }) => (
          <div key={label} className="flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-xs font-medium">{label}</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={value}
              onChange={(e) => { set(e.target.value); setResult(null); }}
              placeholder={ph}
              className={inputCls}
            />
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-brand-lt-gray text-xs font-medium">Number of Coats</label>
          <select value={coats} onChange={(e) => { setCoats(e.target.value); setResult(null); }} className={inputCls}>
            <option value="1">1 coat</option>
            <option value="2">2 coats (recommended)</option>
            <option value="3">3 coats</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-brand-lt-gray text-xs font-medium">Paint Coverage (m² per bucket)</label>
          <select value={coverage} onChange={(e) => { setCoverage(e.target.value); setResult(null); }} className={inputCls}>
            <option value="5">5 m²/Bucket — Textured / Heavy</option>
            <option value="10">10 m²/Bucket — Exterior Gloss</option>
            <option value="12">12 m²/Bucket — Standard Emulsion</option>
            <option value="14">14 m²/Bucket — Silk / Matt</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={calculate}
          className="flex-1 flex items-center justify-center gap-2 bg-brand-accent text-brand-black font-semibold py-2.5 rounded-lg hover:bg-brand-accent-lt transition-all text-sm"
        >
          <Calculator size={15} /> Calculate
        </button>
        <button
          onClick={reset}
          className="flex items-center justify-center gap-2 border border-brand-border text-brand-mid px-4 py-2.5 rounded-lg hover:text-white hover:border-brand-border-lt transition-all text-sm"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {result && (
        <div className="bg-brand-raised border border-brand-border rounded-xl p-5 animate-fade-in">
          <p className="text-brand-accent text-xs font-semibold uppercase tracking-wider mb-4">
            Estimated Paint Required
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Total Buckets", value: `${result.buckets}B` },
              { label: "1B Buckets", value: result.tins1B },
              { label: "4B Buckets", value: result.tins4B },
            ].map(({ label, value }) => (
              <div key={label} className="bg-brand-card border border-brand-border rounded-lg py-3 px-2">
                <p className="text-brand-accent font-bold text-2xl font-display">{value}</p>
                <p className="text-brand-mid text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-brand-subtle text-[11px] mt-3 leading-relaxed">
            * Estimate based on wall area only (ceiling not included). We recommend buying 10% extra as a buffer.
          </p>
          <a
            href="/shop"
            className="mt-4 flex items-center justify-center gap-2 border border-brand-accent/40 text-brand-accent text-sm font-medium py-2.5 rounded-lg hover:bg-brand-accent-muted transition-all"
          >
            Shop Paints Now <ArrowRight size={13} />
          </a>
        </div>
      )}
    </div>
  );
}

// ── Wall Area Estimator ────────────────────────────────────────────────────────
function WallAreaEstimator() {
  const [rooms, setRooms] = useState([{ name: "Living Room", length: "", width: "", height: "" }]);
  const [result, setResult] = useState<number | null>(null);

  const inputCls =
    "w-full bg-brand-black border border-brand-border text-white placeholder-brand-subtle px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 transition-all";

  const addRoom = () => {
    setRooms((prev) => [...prev, { name: `Room ${prev.length + 1}`, length: "", width: "", height: "" }]);
    setResult(null);
  };

  const updateRoom = (idx: number, field: string, value: string) => {
    setRooms((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
    setResult(null);
  };

  const removeRoom = (idx: number) => {
    if (rooms.length === 1) return;
    setRooms((prev) => prev.filter((_, i) => i !== idx));
    setResult(null);
  };

  const calculate = () => {
    let total = 0;
    rooms.forEach((r) => {
      const l = parseFloat(r.length);
      const w = parseFloat(r.width);
      const h = parseFloat(r.height);
      if (l && w && h) total += 2 * (l + w) * h;
    });
    setResult(Math.round(total * 100) / 100);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {rooms.map((room, idx) => (
          <div key={idx} className="bg-brand-black border border-brand-border rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <input
                value={room.name}
                onChange={(e) => updateRoom(idx, "name", e.target.value)}
                className="bg-transparent text-white text-sm font-medium outline-none w-32 focus:text-brand-accent"
              />
              {rooms.length > 1 && (
                <button onClick={() => removeRoom(idx)} className="text-brand-subtle hover:text-red-400 text-xs transition-colors">
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { field: "length", ph: "Length (m)" },
                { field: "width",  ph: "Width (m)" },
                { field: "height", ph: "Height (m)" },
              ].map(({ field, ph }) => (
                <input
                  key={field}
                  type="number"
                  min="0"
                  step="0.1"
                  value={(room as Record<string, string>)[field]}
                  onChange={(e) => updateRoom(idx, field, e.target.value)}
                  placeholder={ph}
                  className={inputCls}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addRoom}
        className="text-brand-accent text-sm font-medium flex items-center gap-1.5 hover:text-brand-accent-lt transition-colors w-fit"
      >
        + Add Another Room
      </button>

      <button
        onClick={calculate}
        className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black font-semibold py-2.5 rounded-lg hover:bg-brand-accent-lt transition-all text-sm"
      >
        <Layers size={15} /> Calculate Total Area
      </button>

      {result !== null && (
        <div className="bg-brand-raised border border-brand-border rounded-xl p-5 animate-fade-in text-center">
          <p className="text-brand-mid text-xs uppercase tracking-wider mb-2">Total Wall Area</p>
          <p className="text-brand-accent font-bold text-4xl font-display">{result} m²</p>
          <p className="text-brand-mid text-xs mt-2">across {rooms.filter((r) => r.length && r.width && r.height).length} room(s)</p>
          <a
            href="/site-estimator"
            className="mt-4 flex items-center justify-center gap-2 border border-brand-accent/40 text-brand-accent text-sm font-medium py-2.5 rounded-lg hover:bg-brand-accent-muted transition-all"
          >
            Book a  Site Estimate <ArrowRight size={13} />
          </a>
        </div>
      )}
    </div>
  );
}

// ── Main Tools Section ─────────────────────────────────────────────────────────
const TOOLS = [
  {
    key: "coverage",
    icon: Calculator,
    label: "Paint Calculator",
    desc: "Find out exactly how much paint you need for your room",
  },
];

export default function ToolsSection() {
  const [activeTool, setActiveTool] = useState("coverage");

  return (
    <section className="bg-brand-surface py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Tools
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Plan Your Project Smarter
          </h2>
          <p className="text-brand-mid text-lg max-w-xl mx-auto">
            Use our calculators to estimate paint quantities and wall areas before you order — no guesswork.
          </p>
        </div>

        {/* Tool selector */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {TOOLS.map(({ key, icon: Icon, label, desc }) => (
            <button
              key={key}
              onClick={() => setActiveTool(key)}
              className={`text-left p-5 rounded-2xl border transition-all duration-200 ${
                activeTool === key
                  ? "border-brand-accent bg-brand-accent-muted"
                  : "border-brand-border bg-brand-card hover:border-brand-border-lt"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                activeTool === key ? "bg-brand-accent/20" : "bg-brand-raised"
              }`}>
                <Icon size={18} className={activeTool === key ? "text-brand-accent" : "text-brand-mid"} />
              </div>
              <p className={`font-semibold text-sm ${activeTool === key ? "text-white" : "text-brand-lt-gray"}`}>
                {label}
              </p>
              <p className="text-brand-mid text-xs mt-1 leading-relaxed">{desc}</p>
            </button>
          ))}
        </div>

        {/* Active tool panel */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8">
          <>
            <h3 className="font-display text-xl font-bold text-white mb-1">Paint Coverage Calculator</h3>
            <p className="text-brand-mid text-sm mb-6">Enter your room dimensions to find out how many buckets you need.</p>
            <PaintCalculator />
          </>
        </div>

      </div>
    </section>
  );
}