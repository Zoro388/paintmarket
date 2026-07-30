
// "use client";
// import { useState } from "react";
// import { Calculator, Layers, ArrowRight, RotateCcw } from "lucide-react";

// // ── Color Constants ────────────────────────────────────────────────────────────
// const COLORS = {
//   bg: "#F8F5F0",
//   primaryText: "#1F1F1F",
//   secondaryText: "#7A7A7A",
//   accent: "#C59A46",
// };

// // ── Paint Coverage Calculator ──────────────────────────────────────────────────
// function PaintCalculator() {
//   const [width, setWidth] = useState("");
//   const [height, setHeight] = useState("");
//   const [coverage, setCoverage] = useState("4.5");
//   const [result, setResult] = useState<{ buckets: number; tins1B: number; tins4B: number } | null>(null);

//   const inputStyle = {
//     backgroundColor: "#FFFFFF",
//     borderColor: "rgba(197, 154, 70, 0.25)",
//     color: COLORS.primaryText,
//   };

//   const calculate = () => {
//     const w = parseFloat(width);
//     const h = parseFloat(height);
//     const cov = parseFloat(coverage);

//     if (!w || !h || isNaN(w) || isNaN(h)) return;

//     const wallArea = 2 * (w + w) * h;
//     const totalBuckets = wallArea / cov;

//     setResult({
//       buckets: Math.ceil(totalBuckets),
//       tins1B: Math.ceil(totalBuckets / 1),
//       tins4B: Math.ceil(totalBuckets / 4),
//     });
//   };

//   const reset = () => {
//     setWidth(""); 
//     setHeight("");
//     setResult(null);
//   };

//   return (
//     <div className="flex flex-col gap-5">
//       <div className="grid sm:grid-cols-2 gap-3">
//         {[
//           { label: "Wall Width (m)", value: width, set: setWidth, ph: "e.g. 4" },
//           { label: "Wall Height (m)", value: height, set: setHeight, ph: "e.g. 3" },
//         ].map(({ label, value, set, ph }) => (
//           <div key={label} className="flex flex-col gap-1.5">
//             <label className="text-xs font-medium" style={{ color: COLORS.secondaryText }}>{label}</label>
//             <input
//               type="number"
//               min="0"
//               step="0.1"
//               value={value}
//               onChange={(e) => { set(e.target.value); setResult(null); }}
//               placeholder={ph}
//               className="w-full border px-4 py-2.5 rounded-lg text-sm focus:outline-none transition-all placeholder:text-gray-400"
//               style={inputStyle}
//             />
//           </div>
//         ))}
//       </div>

//       <div className="grid sm:grid-cols-1 gap-3">
//         <div className="flex flex-col gap-1.5">
//           <label className="text-xs font-medium" style={{ color: COLORS.secondaryText }}>Paint Coverage (Product Class)</label>
//           <select 
//             value={coverage} 
//             onChange={(e) => { setCoverage(e.target.value); setResult(null); }} 
//             className="w-full border px-4 py-2.5 rounded-lg text-sm focus:outline-none transition-all"
//             style={inputStyle}
//           >
//             <option value="4.5">Gravitex (4–5 m²/bucket)</option>
//             <option value="4.5">Trowel Paint (4–5 m²/bucket)</option>
//             <option value="85">Penetrating Primer (80–90 m²/bucket)</option>
//             <option value="85">Alkali Primer (80–90 m²/bucket)</option>
//             <option value="78.5">Matt Paint (77–80 m²/bucket)</option>
//             <option value="116.5">Satin Paint (110–123 m²/bucket)</option>
//           </select>
//         </div>
//       </div>

//       <div className="flex gap-3">
//         <button
//           onClick={calculate}
//           className="flex-1 flex items-center justify-center gap-2 font-semibold py-2.5 rounded-lg transition-all text-sm shadow-sm hover:opacity-90"
//           style={{ backgroundColor: COLORS.accent, color: "#FFFFFF" }}
//         >
//           <Calculator size={15} /> Calculate
//         </button>
//         <button
//           onClick={reset}
//           className="flex items-center justify-center gap-2 border px-4 py-2.5 rounded-lg transition-all text-sm bg-white hover:bg-gray-50"
//           style={{ borderColor: "rgba(197, 154, 70, 0.3)", color: COLORS.secondaryText }}
//         >
//           <RotateCcw size={14} /> Reset
//         </button>
//       </div>

//       {result && (
//         <div 
//           className="border rounded-xl p-5 animate-fade-in"
//           style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(197, 154, 70, 0.3)" }}
//         >
//           <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: COLORS.accent }}>
//             Estimated Paint Required
//           </p>
//           <div className="grid grid-cols-1 gap-3 text-center">
//             {[
//               { label: "Total Buckets", value: `${result.buckets}` },
//             ].map(({ label, value }) => (
//               <div 
//                 key={label} 
//                 className="border rounded-lg py-3 px-2"
//                 style={{ backgroundColor: COLORS.bg, borderColor: "rgba(197, 154, 70, 0.2)" }}
//               >
//                 <p className="font-bold text-3xl font-display" style={{ color: COLORS.accent }}>{value}</p>
//                 <p className="text-xs mt-1" style={{ color: COLORS.secondaryText }}>{label}</p>
//               </div>
//             ))}
//           </div>
//           <p className="text-[11px] mt-4 leading-relaxed italic" style={{ color: COLORS.secondaryText }}>
//             Coverage is approximate and based on one coat. Actual coverage may vary depending on surface condition and application method.
//           </p>
//           <a
//             href="/shop"
//             className="mt-4 flex items-center justify-center gap-2 border text-sm font-medium py-2.5 rounded-lg transition-all hover:bg-amber-50/50"
//             style={{ borderColor: COLORS.accent, color: COLORS.accent }}
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

//   const inputStyle = {
//     backgroundColor: "#FFFFFF",
//     borderColor: "rgba(197, 154, 70, 0.25)",
//     color: COLORS.primaryText,
//   };

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
//           <div 
//             key={idx} 
//             className="border rounded-xl p-4 flex flex-col gap-3"
//             style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(197, 154, 70, 0.2)" }}
//           >
//             <div className="flex items-center justify-between">
//               <input
//                 value={room.name}
//                 onChange={(e) => updateRoom(idx, "name", e.target.value)}
//                 className="bg-transparent text-sm font-medium outline-none w-32 focus:border-b"
//                 style={{ color: COLORS.primaryText, borderColor: COLORS.accent }}
//               />
//               {rooms.length > 1 && (
//                 <button onClick={() => removeRoom(idx)} className="text-red-500 hover:text-red-600 text-xs transition-colors">
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
//                   className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-none transition-all placeholder:text-gray-400"
//                   style={inputStyle}
//                 />
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       <button
//         onClick={addRoom}
//         className="text-sm font-medium flex items-center gap-1.5 transition-colors w-fit hover:opacity-80"
//         style={{ color: COLORS.accent }}
//       >
//         + Add Another Room
//       </button>

//       <button
//         onClick={calculate}
//         className="flex items-center justify-center gap-2 font-semibold py-2.5 rounded-lg transition-all text-sm shadow-sm hover:opacity-90"
//         style={{ backgroundColor: COLORS.accent, color: "#FFFFFF" }}
//       >
//         <Layers size={15} /> Calculate Total Area
//       </button>

//       {result !== null && (
//         <div 
//           className="border rounded-xl p-5 animate-fade-in text-center"
//           style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(197, 154, 70, 0.3)" }}
//         >
//           <p className="text-xs uppercase tracking-wider mb-2" style={{ color: COLORS.secondaryText }}>Total Wall Area</p>
//           <p className="font-bold text-4xl font-display" style={{ color: COLORS.accent }}>{result} m²</p>
//           <p className="text-xs mt-2" style={{ color: COLORS.secondaryText }}>
//             across {rooms.filter((r) => r.length && r.width && r.height).length} room(s)
//           </p>
//           <a
//             href="/site-estimator"
//             className="mt-4 flex items-center justify-center gap-2 border text-sm font-medium py-2.5 rounded-lg transition-all hover:bg-amber-50/50"
//             style={{ borderColor: COLORS.accent, color: COLORS.accent }}
//           >
//             Book a Site Estimate <ArrowRight size={13} />
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
//     <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: COLORS.bg }}>
//       <div className="max-w-5xl mx-auto">

//         {/* Header */}
//         <div className="text-center mb-14">
//           <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: COLORS.accent }}>
//             Tools
//           </p>
//           <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4" style={{ color: COLORS.primaryText }}>
//             Plan Your Project Smarter
//           </h2>
//           <p className="text-lg max-w-xl mx-auto" style={{ color: COLORS.secondaryText }}>
//             Use our calculators to estimate paint quantities and wall areas before you order — no guesswork.
//           </p>
//         </div>

//         {/* Tool selector */}
//         <div className="grid sm:grid-cols-1 max-w-md mx-auto gap-4 mb-10">
//           {TOOLS.map(({ key, icon: Icon, label, desc }) => {
//             const isActive = activeTool === key;
//             return (
//               <button
//                 key={key}
//                 onClick={() => setActiveTool(key)}
//                 className="text-left p-5 rounded-2xl border transition-all duration-200 shadow-sm"
//                 style={{
//                   backgroundColor: isActive ? "#FFFFFF" : "#FFFFFF",
//                   borderColor: isActive ? COLORS.accent : "rgba(197, 154, 70, 0.2)",
//                   boxShadow: isActive ? "0 4px 12px rgba(197, 154, 70, 0.15)" : "none",
//                 }}
//               >
//                 <div 
//                   className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors"
//                   style={{
//                     backgroundColor: isActive ? "rgba(197, 154, 70, 0.15)" : COLORS.bg,
//                   }}
//                 >
//                   <Icon size={18} style={{ color: COLORS.accent }} />
//                 </div>
//                 <p className="font-semibold text-sm" style={{ color: COLORS.primaryText }}>
//                   {label}
//                 </p>
//                 <p className="text-xs mt-1 leading-relaxed" style={{ color: COLORS.secondaryText }}>{desc}</p>
//               </button>
//             );
//           })}
//         </div>

//         {/* Active tool panel */}
//         <div 
//           className="border rounded-2xl p-6 sm:p-8 shadow-sm"
//           style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(197, 154, 70, 0.2)" }}
//         >
//           <>
//             <h3 className="font-display text-xl font-bold mb-1" style={{ color: COLORS.primaryText }}>
//               Paint Coverage Calculator
//             </h3>
//             <p className="text-sm mb-6" style={{ color: COLORS.secondaryText }}>
//               Enter your room dimensions to find out how many buckets you need.
//             </p>
//             <PaintCalculator />
//           </>
//         </div>

//       </div>
//     </section>
//   );
// }

"use client";
import { useState } from "react";
import { Calculator, Layers, ArrowRight, RotateCcw } from "lucide-react";

// ── Color Constants ────────────────────────────────────────────────────────────
const COLORS = {
  bg: "#F8F5F0",
  primaryText: "#1F1F1F",
  secondaryText: "#7A7A7A",
  accent: "#C59A46",
};

// ── Paint Coverage Calculator ──────────────────────────────────────────────────
function PaintCalculator() {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [coverageType, setCoverageType] = useState("gravitex");
  const [result, setResult] = useState<{ buckets: number; tins1B: number; tins4B: number } | null>(null);

  const inputStyle = {
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(197, 154, 70, 0.25)",
    color: COLORS.primaryText,
  };

  const calculate = () => {
    const w = parseFloat(width);
    const h = parseFloat(height);

    if (!w || !h || isNaN(w) || isNaN(h)) return;

    let totalBuckets = 0;

    // Custom area division based on specific instructions
    if (coverageType === "trowel") {
      // Trowel: (Width * Height) / 4
      totalBuckets = (w * h) / 4;
    } else if (coverageType === "gravitex") {
      // Gravitex: (Width * Height) / 5
      totalBuckets = (w * h) / 5;
    } else {
      // Standard product classes with coverage rates
      const cov = parseFloat(coverageType);
      const wallArea = 2 * (w + w) * h;
      totalBuckets = wallArea / cov;
    }

    setResult({
      buckets: Math.ceil(totalBuckets),
      tins1B: Math.ceil(totalBuckets / 1),
      tins4B: Math.ceil(totalBuckets / 4),
    });
  };

  const reset = () => {
    setWidth(""); 
    setHeight("");
    setResult(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { label: "Wall Width (m)", value: width, set: setWidth, ph: "e.g. 4" },
          { label: "Wall Height (m)", value: height, set: setHeight, ph: "e.g. 3" },
        ].map(({ label, value, set, ph }) => (
          <div key={label} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: COLORS.secondaryText }}>{label}</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={value}
              onChange={(e) => { set(e.target.value); setResult(null); }}
              placeholder={ph}
              className="w-full border px-4 py-2.5 rounded-lg text-sm focus:outline-none transition-all placeholder:text-gray-400"
              style={inputStyle}
            />
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-1 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: COLORS.secondaryText }}>Paint Coverage (Product Class)</label>
          <select 
            value={coverageType} 
            onChange={(e) => { setCoverageType(e.target.value); setResult(null); }} 
            className="w-full border px-4 py-2.5 rounded-lg text-sm focus:outline-none transition-all"
            style={inputStyle}
          >
            <option value="gravitex">Gravitex (Area / 5)</option>
            <option value="trowel">Trowel Paint (Area / 4)</option>
            <option value="85">Penetrating Primer (80–90 m²/bucket)</option>
            <option value="85">Alkali Primer (80–90 m²/bucket)</option>
            <option value="78.5">Matt Paint (77–80 m²/bucket)</option>
            <option value="116.5">Satin Paint (110–123 m²/bucket)</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={calculate}
          className="flex-1 flex items-center justify-center gap-2 font-semibold py-2.5 rounded-lg transition-all text-sm shadow-sm hover:opacity-90"
          style={{ backgroundColor: COLORS.accent, color: "#FFFFFF" }}
        >
          <Calculator size={15} /> Calculate
        </button>
        <button
          onClick={reset}
          className="flex items-center justify-center gap-2 border px-4 py-2.5 rounded-lg transition-all text-sm bg-white hover:bg-gray-50"
          style={{ borderColor: "rgba(197, 154, 70, 0.3)", color: COLORS.secondaryText }}
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {result && (
        <div 
          className="border rounded-xl p-5 animate-fade-in"
          style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(197, 154, 70, 0.3)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: COLORS.accent }}>
            Estimated Paint Required
          </p>
          <div className="grid grid-cols-1 gap-3 text-center">
            {[
              { label: "Total Buckets", value: `${result.buckets}` },
            ].map(({ label, value }) => (
              <div 
                key={label} 
                className="border rounded-lg py-3 px-2"
                style={{ backgroundColor: COLORS.bg, borderColor: "rgba(197, 154, 70, 0.2)" }}
              >
                <p className="font-bold text-3xl font-display" style={{ color: COLORS.accent }}>{value}</p>
                <p className="text-xs mt-1" style={{ color: COLORS.secondaryText }}>{label}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] mt-4 leading-relaxed italic" style={{ color: COLORS.secondaryText }}>
            Coverage is approximate and based on one coat. Actual coverage may vary depending on surface condition and application method.
          </p>
          <a
            href="/shop"
            className="mt-4 flex items-center justify-center gap-2 border text-sm font-medium py-2.5 rounded-lg transition-all hover:bg-amber-50/50"
            style={{ borderColor: COLORS.accent, color: COLORS.accent }}
          >
            Shop Paints Now <ArrowRight size={13} />
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
    <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: COLORS.bg }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: COLORS.accent }}>
            Tools
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4" style={{ color: COLORS.primaryText }}>
            Plan Your Project Smarter
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: COLORS.secondaryText }}>
            Use our calculators to estimate paint quantities and wall areas before you order — no guesswork.
          </p>
        </div>

        {/* Tool selector */}
        <div className="grid sm:grid-cols-1 max-w-md mx-auto gap-4 mb-10">
          {TOOLS.map(({ key, icon: Icon, label, desc }) => {
            const isActive = activeTool === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTool(key)}
                className="text-left p-5 rounded-2xl border transition-all duration-200 shadow-sm"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: isActive ? COLORS.accent : "rgba(197, 154, 70, 0.2)",
                  boxShadow: isActive ? "0 4px 12px rgba(197, 154, 70, 0.15)" : "none",
                }}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors"
                  style={{
                    backgroundColor: isActive ? "rgba(197, 154, 70, 0.15)" : COLORS.bg,
                  }}
                >
                  <Icon size={18} style={{ color: COLORS.accent }} />
                </div>
                <p className="font-semibold text-sm" style={{ color: COLORS.primaryText }}>
                  {label}
                </p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: COLORS.secondaryText }}>{desc}</p>
              </button>
            );
          })}
        </div>

        {/* Active tool panel */}
        <div 
          className="border rounded-2xl p-6 sm:p-8 shadow-sm"
          style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(197, 154, 70, 0.2)" }}
        >
          <>
            <h3 className="font-display text-xl font-bold mb-1" style={{ color: COLORS.primaryText }}>
              Paint Coverage Calculator
            </h3>
            <p className="text-sm mb-6" style={{ color: COLORS.secondaryText }}>
              Enter your room dimensions to find out how many buckets you need.
            </p>
            <PaintCalculator />
          </>
        </div>

      </div>
    </section>
  );
}