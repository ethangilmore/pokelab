type SpeciesKey = string;
type ItemKey = string;
type AbilityKey = string;
type Nature = string;
type Type = string;
type StatKey = string;
type Spread = Record<StatKey, number>;
type MoveKey = string;
type FormatKey = string;

type Set = {
  species: SpeciesKey;
  moves: MoveKey[];
  item?: ItemKey;
  ability?: AbilityKey;
  nature?: Nature;
  tera?: Type;
  spread?: Spread;
}

type Team = {
  name: string;
  members: Set[];
  format: FormatKey;
}

export { Set, Team }
