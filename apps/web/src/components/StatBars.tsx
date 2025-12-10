import React from "react";
import StatBar from "./StatBar";
import type { StatName } from "@/types/Stats";

// interface BaseStats {
//   hp: number;
//   atk: number;
//   def: number;
//   spa: number;
//   spd: number;
//   spe: number;
// }

interface StatBarsProps {
  baseStats: Record<StatName, number>;
  ivs: Record<StatName, number>;
  evs: Record<StatName, number>;
  onIvsChange: (ivs: Partial<Record<StatName, number>>) => void;
  onEvsChange: (ivs: Partial<Record<StatName, number>>) => void;
}

const StatBars: React.FC<StatBarsProps> = ({
  baseStats,
  ivs,
  evs,
  onIvsChange,
  onEvsChange,
}) => {
  const foregroundColors: Record<StatName, string> = {
    hp: "bg-red-500",
    atk: "bg-orange-500",
    def: "bg-yellow-500",
    spa: "bg-blue-500",
    spd: "bg-green-500",
    spe: "bg-purple-500",
  };

  const statLabels: Record<StatName, string> = {
    hp: "HP",
    atk: "Attack",
    def: "Defense",
    spa: "Sp. Attack",
    spd: "Sp. Defense",
    spe: "Speed",
  };

  const updateEv = (stat: StatName, newValue: number) => {
      const currentTotal = Object.values(evs).reduce(
        (sum, val) => sum + val,
        0,
      );
      const currentStatValue = evs[stat];
      const otherStatsTotal = currentTotal - currentStatValue;
      const maxAllowedForThisStat = Math.min(252, 508 - otherStatsTotal);
      onEvsChange({ [stat]: Math.min(newValue, maxAllowedForThisStat)});
  };

  const totalEvs = Object.values(evs).reduce((sum, val) => sum + val, 0);

  const STAT_NAMES = ["hp", "atk", "def", "spa", "spd", "spe"] as StatName[];

  return (
    <div className="h-full flex flex-col justify-between">
      {STAT_NAMES.map((stat) => (
        <StatBar
          key={stat}
          stat={stat}
          label={statLabels[stat]}
          baseValue={baseStats[stat]}
          color={foregroundColors[stat]}
          iv={ivs[stat]}
          ev={evs[stat]}
          onIvChange={(newValue) => onIvsChange({ [stat]: newValue })}
          onEvChange={(newValue) => updateEv(stat, newValue)}
          totalEvs={totalEvs}
        />
      ))}
    </div>
  );
};

export default StatBars;
