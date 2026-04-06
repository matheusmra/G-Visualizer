export function BFSPreview() {
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full" aria-hidden="true">
      <circle cx="80" cy="22" r="14" fill="#dbe1ff" stroke="#004ac6" strokeWidth="2" />
      <text x="80" y="27" textAnchor="middle" fontSize="11" fill="#004ac6" fontWeight="700">1</text>
      <line x1="56" y1="34" x2="44" y2="56" stroke="#c3c6d7" strokeWidth="1.5" />
      <line x1="104" y1="34" x2="116" y2="56" stroke="#c3c6d7" strokeWidth="1.5" />
      <circle cx="40" cy="66" r="12" fill="#f7f9fb" stroke="#c3c6d7" strokeWidth="1.5" />
      <text x="40" y="71" textAnchor="middle" fontSize="11" fill="#737686">2</text>
      <circle cx="120" cy="66" r="12" fill="#f7f9fb" stroke="#c3c6d7" strokeWidth="1.5" />
      <text x="120" y="71" textAnchor="middle" fontSize="11" fill="#737686">3</text>
    </svg>
  );
}
