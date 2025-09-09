import React from "react";

interface StatBarProps {
  className?: string;
  stat: string;
  label: string;
  baseValue: number;
  color: string;
  iv: number;
  ev: number;
  onIvChange: (newValue: number) => void;
  onEvChange: (newValue: number) => void;
  totalEvs: number;
}

const StatBar: React.FC<StatBarProps> = ({
  className,
  label,
  color,
  baseValue,
  iv,
  ev,
  onIvChange,
  onEvChange,
}) => {
  const level = 50;
  const value = Math.round(baseValue * (level / 50) + (iv * level) / 100 + (ev * level) / 400);

  return (
    <div className={`${className} flex gap-2`}>
      <div className="w-[80px] text-sm font-medium flex flex-shrink-1 items-center">
        {label}
      </div>
      <div className="flex-1 bg-gray-200 rounded-full overflow-hidden relative">
        <div
          className={`${color} opacity-60 absolute inset-0 rounded-full h-full`}
          style={{ width: `${(value / 255) * 100}%` }}
        />
        <div
          className={`${color} border-r border-white absolute inset-0 rounded-full h-full`}
          style={{ width: `${(baseValue / 255) * 100}%` }}
        />
      </div>
      <div className="w-6 text-sm font-medium text-right flex items-center">
        {baseValue}
      </div>
      <input
        type="number"
        min="0"
        max="31"
        value={iv}
        onChange={(e) => onIvChange(Number(e.target.value))}
        className="w-12 text-sm border rounded px-1"
      />
      <input
        type="range"
        min="0"
        max="252"
        value={ev}
        onChange={(e) => onEvChange(Number(e.target.value))}
        className="w-24"
      />
      <input
        type="number"
        min="0"
        max="252"
        value={ev}
        onChange={(e) => onEvChange(Number(e.target.value))}
        className="w-14 text-sm border rounded px-1"
      />
      <div className="w-6 text-sm font-medium text-right flex items-center">
        {value}
      </div>
    </div>
  );
};

export default StatBar;
