export function FTIPreview() {
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full" aria-hidden="true">
      <defs>
        <marker id="arrow-fti" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#737686" />
        </marker>
        <marker id="arrow-fti-b" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#004ac6" />
        </marker>
      </defs>
      <line x1="68" y1="50" x2="32" y2="50" stroke="#004ac6" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#arrow-fti-b)" />
      <line x1="126" y1="50" x2="92" y2="50" stroke="#c3c6d7" strokeWidth="1.5" markerEnd="url(#arrow-fti)" />
      <circle cx="22" cy="50" r="13" fill="#dbe1ff" stroke="#004ac6" strokeWidth="2" />
      <text x="22" y="55" textAnchor="middle" fontSize="10" fill="#004ac6">A</text>
      <circle cx="80" cy="50" r="13" fill="#004ac6" />
      <text x="80" y="55" textAnchor="middle" fontSize="10" fill="white" fontWeight="700">T</text>
      <circle cx="138" cy="50" r="13" fill="#dbe1ff" stroke="#004ac6" strokeWidth="2" />
      <text x="138" y="55" textAnchor="middle" fontSize="10" fill="#004ac6">C</text>
    </svg>
  );
}
