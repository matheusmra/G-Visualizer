export function FTDPreview() {
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full" aria-hidden="true">
      <defs>
        <marker id="arrow-ftd" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#004ac6" />
        </marker>
      </defs>
      <line x1="30" y1="50" x2="68" y2="50" stroke="#004ac6" strokeWidth="1.5" markerEnd="url(#arrow-ftd)" />
      <line x1="90" y1="50" x2="126" y2="50" stroke="#004ac6" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#arrow-ftd)" />
      <line x1="80" y1="38" x2="80" y2="20" stroke="#c3c6d7" strokeWidth="1.5" markerEnd="url(#arrow-ftd)" />
      <circle cx="22" cy="50" r="13" fill="#004ac6" />
      <text x="22" y="55" textAnchor="middle" fontSize="10" fill="white" fontWeight="700">S</text>
      <circle cx="80" cy="50" r="13" fill="#dbe1ff" stroke="#004ac6" strokeWidth="2" />
      <text x="80" y="55" textAnchor="middle" fontSize="10" fill="#004ac6">B</text>
      <circle cx="138" cy="50" r="13" fill="#dbe1ff" stroke="#004ac6" strokeWidth="2" />
      <text x="138" y="55" textAnchor="middle" fontSize="10" fill="#004ac6">C</text>
      <circle cx="80" cy="14" r="11" fill="#f0f4ff" stroke="#c3c6d7" strokeWidth="1.5" />
      <text x="80" y="19" textAnchor="middle" fontSize="10" fill="#737686">D</text>
    </svg>
  );
}
