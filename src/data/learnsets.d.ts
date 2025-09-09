declare const learnsets: Record<string, {
  learnset: Record<string, string[]>;
  eventData?: Array<{
    generation: number;
    level?: number;
    moves: string[];
    pokeball?: string;
    nature?: string;
    ivs?: Record<string, number>;
    shiny?: boolean;
    gender?: string;
    ability?: string;
    isHidden?: boolean;
  }>;
  eventOnly?: boolean;
  encounters?: Array<{
    generation: number;
    level: number;
    maxLevel?: number;
    location?: string;
    pokeball?: string;
    nature?: string;
    ivs?: Record<string, number>;
    shiny?: boolean;
    gender?: string;
    ability?: string;
    isHidden?: boolean;
  }>;
}>;

export default learnsets; 