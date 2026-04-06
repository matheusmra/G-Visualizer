export function TOPOPreview() {
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full" aria-hidden="true">
      <defs>
        <marker id="arrow-topo" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#004ac6" />
        </marker>
      </defs>
      {[20, 62, 104, 146].map((cx, i) => (
        <g key={cx}>
          {i < 3 && <line x1={cx + 14} y1="50" x2={cx + 34} y2="50" stroke="#004ac6" strokeWidth="1.5" markerEnd="url(#arrow-topo)" />}
          <circle cx={cx} cy="50" r="12" fill={i === 0 ? '#004ac6' : '#dbe1ff'} stroke={i === 0 ? '#004ac6' : '#004ac6'} strokeWidth={i === 0 ? 0 : 1.5} />
          <text x={cx} y="55" textAnchor="middle" fontSize="10" fill={i === 0 ? 'white' : '#004ac6'} fontWeight="600">
            {['A', 'B', 'C', 'D'][i]}
          </text>
        </g>
      ))}
    </svg>
  );
}
