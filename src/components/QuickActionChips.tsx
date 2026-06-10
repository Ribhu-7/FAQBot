import React from 'react';

interface QuickActionChipsProps {
  onSelectChip: (question: string) => void;
}

export const QuickActionChips: React.FC<QuickActionChipsProps> = ({ onSelectChip }) => {
  const chips = [
    { label: 'Track Order', icon: 'local_shipping' },
    { label: 'Shipping Info', icon: 'info' },
    { label: 'Talk to Human', icon: 'support_agent' }
  ];

  return (
    <div className="flex flex-wrap gap-xs pl-10">
      {chips.map((chip, index) => (
        <button
          key={index}
          onClick={() => onSelectChip(chip.label)}
          className="px-sm py-xs bg-surface-container border border-outline-variant rounded-full font-label-sm text-[12px] text-on-surface-variant hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[14px]">{chip.icon}</span>
          {chip.label}
        </button>
      ))}
    </div>
  );
};
