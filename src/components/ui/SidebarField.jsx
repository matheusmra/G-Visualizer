export function SidebarField({ label, children }) {
  return (
    <div>
      <label className="text-[10px] tracking-widest uppercase text-[#737686] dark:text-slate-500 block mb-1.5 font-bold">
        {label}
      </label>
      {children}
    </div>
  );
}
