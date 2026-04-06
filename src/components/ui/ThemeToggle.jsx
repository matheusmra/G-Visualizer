import { useTheme } from '../../context/ThemeContext.jsx';

export function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-xl text-sm transition-colors flex items-center justify-center ${className || 'bg-[#eceef0] dark:bg-slate-800 text-[#737686] dark:text-slate-400 hover:bg-[#e0e3e5] dark:hover:bg-slate-700'}`}
      title="Alternar tema"
      aria-label="Alternar tema claro e escuro"
    >
      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}
