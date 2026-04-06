export function DFSPreview() {
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full" aria-hidden="true">
      <line x1="80" y1="16" x2="44" y2="46" stroke="#004ac6" strokeWidth="1.5" strokeDasharray="4,3" />
      <line x1="44" y1="46" x2="28" y2="76" stroke="#004ac6" strokeWidth="1.5" strokeDasharray="4,3" />
      <line x1="80" y1="16" x2="116" y2="46" stroke="#c3c6d7" strokeWidth="1.5" />
      <circle cx="80" cy="16" r="13" fill="#004ac6" />
      <text x="80" y="21" textAnchor="middle" fontSize="11" fill="white" fontWeight="700">A</text>
      <circle cx="44" cy="46" r="12" fill="#dbe1ff" stroke="#004ac6" strokeWidth="2" />
      <text x="44" y="51" textAnchor="middle" fontSize="11" fill="#004ac6">B</text>
      <circle cx="116" cy="46" r="12" fill="#f7f9fb" stroke="#c3c6d7" strokeWidth="1.5" />
      <text x="116" y="51" textAnchor="middle" fontSize="11" fill="#737686">C</text>
      <circle cx="28" cy="76" r="12" fill="#dbe1ff" stroke="#004ac6" strokeWidth="2" />
      <text x="28" y="81" textAnchor="middle" fontSize="11" fill="#004ac6">D</text>
    </svg>
  );
}
