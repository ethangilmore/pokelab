import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/shallow";
import { persist } from "zustand/middleware";
import { runCalcJobs } from "@/workers/calcWorkerClient";
import type { TeamId, PokemonTeam } from "@/types/PokemonTeam";
import type { SetId, PokemonSet } from "@/types/PokemonSet";
import type { CalcId, DamageCalc } from "@/types/DamageCalc";
import type { StatName } from "@/types/Stats";
import type { CalcJobInput } from "@/workers/calcWorker";

function buildCalcJobs(state: Store, calcIds: CalcId[]): CalcJobInput[] {
  return calcIds.map((calcId) => {
    const calc = state.calcs[calcId];
    if (!calc?.attacker || !calc?.defender || !calc?.move) return;
    const attackerSet = state.sets[calc.attacker.setId];
    const defenderSet = state.sets[calc.defender.setId];
    return {
      calcId: calc.id,
      attacker: { set: {
        species: attackerSet.species,
        item: attackerSet.item,
        nature: attackerSet.nature,
        ivs: { ...attackerSet.ivs },
        evs: { ...attackerSet.evs },
      }},
      defender: { set: {
        species: defenderSet.species,
        item: defenderSet.item,
        nature: defenderSet.nature,
        ivs: { ...defenderSet.ivs },
        evs: { ...defenderSet.evs },
      }},
      move: calc.move,
    }
  }).filter((job) => job !== undefined);
}

function refreshCalcs(set: any, state: Store, calcIds: CalcId[] | undefined) {
  if (!calcIds) return;
  const calcJobs = buildCalcJobs(state, calcIds);
  runCalcJobs(calcJobs, (results) => {
    set((state: Store) => {
      for (const result of results) {
        state.calcs[result.calcId].cachedResult = { ...result };
      }
    });
  });
}

function addToArray<T>(array: T[] | undefined, item: T): T[] {
  const arr = array ?? [];
  return arr.includes(item) ? arr : [...arr, item];
}

function removeFromArray<T>(array: T[] | undefined, item: T): T[] {
  return (array ?? []).filter(x => x !== item);
}

function linkCalcToSet(state: Store, calcId: CalcId, setId?: SetId) {
  if (!setId) return;
  state.sets[setId].calcIds = addToArray(state.sets[setId].calcIds, calcId);
}

function unlinkCalcFromSet(state: Store, calcId: CalcId, setId?: SetId) {
  if (setId && state.sets[setId]) {
    state.sets[setId].calcIds = removeFromArray(state.sets[setId].calcIds, calcId);
  }
}

function linkSetToTeam(state: Store, setId: SetId, teamId?: TeamId) {
  if (!teamId) return;
  state.teams[teamId].sets = addToArray(state.teams[teamId].sets, setId);
}

function unlinkSetFromTeam(state: Store, setId: SetId, teamId?: TeamId) {
  if (teamId && state.teams[teamId]) {
    state.teams[teamId].sets = removeFromArray(state.teams[teamId].sets, setId);
  }
}

function linkCalcToTeam(state: Store, calcId: CalcId, teamId: TeamId) {
  state.teams[teamId].calcs = addToArray(state.teams[teamId].calcs, calcId);
}

function unlinkCalcFromTeam(state: Store, calcId: CalcId, teamId: TeamId) {
  if (state.teams[teamId]) {
    state.teams[teamId].calcs = removeFromArray(state.teams[teamId].calcs, calcId);
  }
}

type Store = {
  teams: Record<TeamId, PokemonTeam>;
  sets: Record<SetId, PokemonSet>;
  calcs: Record<CalcId, DamageCalc>;
  selectedTeamId?: TeamId;

  addTeam(name: string): TeamId;
  removeTeam(id: TeamId): void;
  selectTeam(id: TeamId): void;

  addSet(pokemonSet: Omit<PokemonSet,"id"|"teamid">, teamId?: TeamId): SetId;
  updateSet(setId: SetId, patch: Partial<PokemonSet>): void;
  updateSetIvs(setId: SetId, patch: Partial<Record<StatName, number>>): void;
  updateSetEvs(setId: SetId, patch: Partial<Record<StatName, number>>): void;
  removeSet(setId: SetId): void;

  addCalc(calc: Omit<DamageCalc,"id"|"teamId">, teamId: TeamId): CalcId;
  updateCalc(calcId: CalcId, patch: Partial<DamageCalc>): void;
  removeCalc(calcId: CalcId): void;
}

export const useStore = create(persist(
  immer<Store>((set) => ({
    teams: {},
    sets: {},
    calcs: {},

    addTeam: (name: string = "My Team") => {
      const id = crypto.randomUUID();
      set((state) => {
        state.teams[id] = { id, name, sets: [], calcs: [] }
      });
      return id;
    },
    removeTeam: (id: TeamId) => {
      set((state) => {
        delete state.teams[id];
      });
    },
    selectTeam: (id: TeamId) => {
      set((state) => {
        state.selectedTeamId = id;
      });
    },

    addSet: (pokemonSet: Omit<PokemonSet,"id"|"teamid">, teamId?: TeamId) => {
      const setId = crypto.randomUUID();
      set((state) => {
        state.sets[setId] = { id: setId, teamId: teamId, ...pokemonSet };
        linkSetToTeam(state, setId, teamId);
      });
      return setId;
    },
    updateSet: (setId: SetId, patch: Partial<PokemonSet>) => {
      set((state) => {
        Object.assign(state.sets[setId], patch);
        refreshCalcs(set, state, state.sets[setId].calcIds);
      });
    },
    updateSetIvs: (setId: SetId, patch: Partial<Record<StatName, number>>) => {
      set((state) => {
        Object.assign(state.sets[setId].ivs, patch);
        refreshCalcs(set, state, state.sets[setId].calcIds);
      });
    },
    updateSetEvs: (setId: SetId, patch: Partial<Record<StatName, number>>) => {
      set((state) => {
        Object.assign(state.sets[setId].evs, patch);
        refreshCalcs(set, state, state.sets[setId].calcIds);
      });
    },
    removeSet: (setId: SetId) => {
      set((state) => {
        unlinkSetFromTeam(state, setId, state.sets[setId].teamId);
        delete state.sets[setId];
      });
    },

    addCalc: (calc: Omit<DamageCalc,"id"|"teamId">, teamId: TeamId) => {
      const calcId = crypto.randomUUID();
      set((state) => {
        state.calcs[calcId] = {id: calcId, teamId, ...calc};
        linkCalcToSet(state, calcId, calc.attacker?.setId);
        linkCalcToSet(state, calcId, calc.defender?.setId);
        linkCalcToTeam(state, calcId, teamId);
        refreshCalcs(set, state, [calcId]);
      })
      return calcId;
    },
    updateCalc: (calcId: CalcId, patch: Partial<DamageCalc>) => {
      set((state) => {
        const calc = state.calcs[calcId];
        unlinkCalcFromSet(state, calcId, calc.attacker?.setId);
        unlinkCalcFromSet(state, calcId, calc.defender?.setId);
        Object.assign(state.calcs[calcId], patch);
        linkCalcToSet(state, calcId, calc.attacker?.setId);
        linkCalcToSet(state, calcId, calc.defender?.setId);
        refreshCalcs(set, state, [calcId]);
      });
    },
    removeCalc: (calcId: CalcId) => {
      set((state) => {
        const calc = state.calcs[calcId]
        unlinkCalcFromSet(state, calcId, calc.attacker?.setId);
        unlinkCalcFromSet(state, calcId, calc.defender?.setId);
        unlinkCalcFromTeam(state, calcId, calc.teamId);
        delete state.calcs[calcId];
      });
    },
  })),
  {
    name: 'tempname-store'
  }
));

export const useSet = (id?: SetId) => useStore(s => id ? s.sets[id] : undefined);

export const useCalc = (id?: CalcId) => useStore(s => id ? s.calcs[id] : undefined);

export const useTeam = (id?: TeamId) => useStore(s => id ? s.teams[id] : undefined);

export const useSelectedTeam = () => useStore(s => s.selectedTeamId ? s.teams[s.selectedTeamId] : undefined);

export const useTeamSetInfo = (id?: TeamId) => useStore(useShallow(s => {
  const result: Record<string, string> = {};
  for (const [setId, set] of Object.entries(s.sets)) {
    if (set.teamId === id) {
      result[setId] = set.species;
    }
  }
  return result;
}));

export const useSetActions = () => useStore(useShallow(s => ({
  addSet: s.addSet,
  updateSet: s.updateSet,
  updateSetIvs: s.updateSetIvs,
  updateSetEvs: s.updateSetEvs,
  removeSet: s.removeSet,
})));

export const useTeamActions = () => useStore(useShallow(s => ({
  addTeam: s.addTeam,
  selectTeam: s.selectTeam,
  removeTeam: s.removeTeam,
})));

export const useCalcActions = () => useStore(useShallow(s => ({
  addCalc: s.addCalc,
  updateCalc: s.updateCalc,
  removeCalc: s.removeCalc,
})));

