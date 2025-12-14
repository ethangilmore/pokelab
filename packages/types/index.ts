export type SpeciesKey = string;
export type ItemKey = string;
export type AbilityKey = string;
export type Nature = string;
export type Type = string;
export type StatKey = string;
export type Spread = Record<StatKey, number>;
export type MoveKey = string;
export type FormatKey = string;

export type Set = {
  species: SpeciesKey;
  moves: MoveKey[];
  item?: ItemKey;
  ability?: AbilityKey;
  nature?: Nature;
  tera?: Type;
  spread?: Spread;
}

export type Team = {
  name: string;
  members: Set[];
  format: FormatKey;
}
