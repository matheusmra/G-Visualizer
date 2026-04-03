import { PRESETS } from '../data/presets.js';

export default function PresetSelector({ current, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs text-slate-400 font-medium">Grafo:</span>

      {/* Preset graphs */}
      {Object.entries(PRESETS).map(([key, preset]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          title={preset.description}
          className={`px-3 py-1 rounded-lg text-sm font-semibold border transition-colors ${
            current === key
              ? 'bg-slate-200 text-slate-900 border-slate-200'
              : 'bg-slate-800 text-slate-300 border-slate-600 hover:border-slate-400 hover:text-slate-100'
          }`}
        >
          {preset.name}
          {preset.directed && (
            <span className="ml-1 text-[10px] text-sky-400 font-normal">direcionado</span>
          )}
        </button>
      ))}

      <span className="text-slate-700">|</span>

      {/* Custom graph */}
      <button
        onClick={() => onChange('custom')}
        title="Construa seu próprio grafo"
        className={`px-3 py-1 rounded-lg text-sm font-semibold border transition-colors ${
          current === 'custom'
            ? 'bg-indigo-600 text-white border-indigo-400'
            : 'bg-slate-800 text-indigo-300 border-indigo-800 hover:border-indigo-500 hover:text-indigo-200'
        }`}
      >
        ✏ Grafo Customizado
      </button>
    </div>
  );
}

