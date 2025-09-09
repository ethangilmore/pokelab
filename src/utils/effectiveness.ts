import {
  type Type,
  type Typing,
  type Effectiveness,
  TYPES,
  TYPE_CHART,
} from "@/types/Typing";

export function getEffectiveness(
  offense: Type,
  defense: Type | Typing,
): Effectiveness {
  if (typeof defense === "string") {
    return TYPE_CHART[offense][defense] ?? 1;
  }
  const [primary, secondary] = defense;
  return getEffectiveness(offense, primary) * (secondary ? getEffectiveness(offense, secondary) : 1) as Effectiveness
}

export function getOffensiveMatchups(
  offensive: Type,
): Partial<Record<Type, number>> {
  return Object.fromEntries(
    TYPES.map((type) => [type, getEffectiveness(offensive, type)]),
  );
}

export function getDefensiveMatchups(
  defensive: Typing,
): Partial<Record<Type, number>> {
  return Object.fromEntries(
    TYPES.map((type) => [type, getEffectiveness(type, defensive)]),
  );
}
