declare const Moves = Record<string, {
  num: number;
  accuracy: number | boolean;
  basePower: number;
  category: string;
  name: string;
  pp: number;
  priority: number;
  flags: Record<string, boolean>;
  secondary?: {
    chance: number;
    status?: string;
    boosts?: Record<string, number>;
    volatileStatus?: string;
    self?: {
      boosts?: Record<string, number>;
      volatileStatus?: string;
    };
  };
  target: string;
  type: string;
  contestType?: string;
  desc?: string;
  shortDesc?: string;
  zMovePower?: number;
  gmaxPower?: number;
  isNonstandard?: string;
  isZ?: string;
  maxMove?: { basePower: number };
}>;

export type Move = (typeof Moves)[string];

export default Moves;

