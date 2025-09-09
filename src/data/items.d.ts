declare const items: Record<string, {
  name: string;
  num: number;
  gen: number;
  desc?: string;
  shortDesc?: string;
  isNonstandard?: string;
  isPokeball?: boolean;
  isGem?: boolean;
  isBerry?: boolean;
  naturalGift?: {
    basePower: number;
    type: string;
  };
  fling?: {
    basePower: number;
    status?: string;
    volatileStatus?: string;
  };
  megaStone?: string;
  megaEvolves?: string;
  zMove?: string | boolean;
  zMoveFrom?: string;
  zMoveUser?: string[];
  itemUser?: string[];
  boosts?: Record<string, number>;
  ignoreKlutz?: boolean;
  forcedForme?: string;
  isChoice?: boolean;
  condition?: Record<string, any>;
}>;

export default items; 