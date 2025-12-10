// import { useTeamStore } from "@/hooks/useTeamStore";

// import { useTeamStore } from "@/hooks/useTeamStore";
import type { PokemonSet } from "@/types/PokemonSet";
import { getBaseStats, getSpriteURL } from "@/utils/dex";
import { useEffect, useRef, useState } from "react";

export function SpeedChart() {
  const ref = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState<number>(0);
  const [threshold, setThreshold] = useState<number | undefined>(undefined);
  const sets: PokemonSet[] = []

  useEffect(() => {
    const updateWidth = () => {
      if (ref.current) {
        setWidth(ref.current.getBoundingClientRect().width);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const species = [
    "Incineroar",
    "Miraidon",
    "Amoonguss",
    "Rillaboom",
    "Lunala",
    "Ragingbolt",
    "Volcarona",
    "Ursaluna",
    "Whimsicott",
  ]
    .map((pokemon) => {
      const base = getBaseStats(pokemon).spe;
      return {
        species: pokemon,
        speeds: {
          scarf: (base + 31 / 2 + 252 / 8) * 1.1 * 1.5,
          nature: (base + 31 / 2 + 252 / 8) * 1.1,
          evs: base + 31 / 2 + 252 / 8,
          ivs: base + 31 / 2,
          base,
        },
      };
    })
    .sort((a, b) => b.speeds.base - a.speeds.base);

  const colors: Record<string, string> = {
    base: "black",
    ivs: "green",
    evs: "yellow",
    nature: "orange",
    scarf: "red",
  };

  const rowHeight = 30;
  const height = 64 + rowHeight * species.length;

  const xMax = Math.max(
    ...species.flatMap((species) => Object.values(species.speeds)),
  );

  const x = (x: number) => {
    return (width * x) / xMax;
  };

  const y = (y: number) => {
    return 64 + rowHeight / 2 + rowHeight * y;
  };

  const getSpeed = (set: PokemonSet) => {
    const base = getBaseStats(set.species).spe;
    return Math.round(base + set.ivs.spe / 2 + set.evs.spe / 8);
  };

  return (
    <svg ref={ref} width={"100%"} height={height}>
      {sets.map((set, idx) => (
        <g key={idx} onMouseEnter={() => setThreshold(getSpeed(set))} onMouseLeave={() => setThreshold(undefined)}>
          <line
            x1={x(getSpeed(set))}
            x2={x(getSpeed(set))}
            y1={y(0) - 32}
            y2={y(100)}
            dominantBaseline="central"
            strokeLinecap="butt"
            stroke={"gray"}
            opacity={0.5}
            strokeWidth={2}
          />
          <image
            href={getSpriteURL(set.species)}
            x={x(getSpeed(set)) - 32}
            y={y(0) - 64}
            width={64}
            height={64}
          />
        </g>
      ))}
      {species.map((species, idx) => (
        <g key={idx}>
          <text
            x={x(species.speeds.base - 1)}
            y={y(idx)}
            fontSize={rowHeight * 0.5}
            dominantBaseline="central"
            textAnchor="end"
          >
            {species.species}
          </text>
          {Object.entries(species.speeds).map(([key, value]) => (
            <rect
              key={key}
              x={x(species.speeds.base)}
              y={y(idx)-rowHeight/4}
              width={x(value - species.speeds.base)}
              height={rowHeight/2}
              fill={!threshold || value > threshold ? colors[key] : "white"}
            />
            // <g>
            //   <line
            //     x1={x(species.speeds.base)}
            //     x2={x(value)}
            //     y1={y(idx)}
            //     y2={y(idx)}
            //     dominantBaseline="central"
            //     strokeLinecap="butt"
            //     stroke={!threshold || value > threshold ? "black" : "white"}
            //     strokeWidth={rowHeight * 0.6}
            //   />
            //   <line
            //     x1={x(species.speeds.base)}
            //     x2={x(value)}
            //     y1={y(idx)}
            //     y2={y(idx)}
            //     dominantBaseline="central"
            //     strokeLinecap="butt"
            //     stroke={!threshold || value > threshold ? colors[key] : "white"}
            //     strokeWidth={rowHeight * 0.5}
            //   />
            // </g>
          ))}
        </g>
      ))}
    </svg>
  );
}
