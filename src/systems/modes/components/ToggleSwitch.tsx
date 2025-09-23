// Reusable Toggle Switch Component

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
}

export default function ToggleSwitch({
  label,
  checked,
  onChange,
  ariaLabel
}: ToggleSwitchProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
          checked
            ? 'bg-blue-600 dark:bg-blue-500'
            : 'bg-gray-200 dark:bg-gray-600'
        }`}
        aria-pressed={checked}
        aria-label={ariaLabel || `Toggle ${label}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {checked ? 'ON' : 'OFF'}
      </span>
    </div>
  );
}