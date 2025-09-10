import type { CalcId, DamageCalc, DamageCalcResult } from "@/types/DamageCalc";
import { getSpriteURL } from "@/utils/dex";
import type { SetId } from "@/types/PokemonSet";
import { importSets } from "@/utils/serialization";
import { useCalc, useCalcActions, useSelectedTeam, useSet, useSetActions, useTeamSetInfo } from "@/hooks/useStore";
import { Dropdown } from "./Dropdown";
import { getLearnSet } from "@/utils/dex";
import type { ReactNode } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Field, type State } from "@smogon/calc";
import type { Weather } from "@smogon/calc/dist/data/interface";

function SetDropdown({ setId, onSetChange }: { setId?: SetId, onSetChange: (setId: SetId) => void }) {
  const { addSet } = useSetActions();
  const set = useSet(setId);
  const selectedTeam = useSelectedTeam();
  const teamSetsInfo = useTeamSetInfo(selectedTeam?.id);
  const librarySetsInfo = useTeamSetInfo(undefined);

  return (
    <Dropdown className={`min-w-0 rounded shadow border ${set?.teamId ? "bg-gray-200 border-gray-300" : ""} h-10 sm:h-12 md:h-14`}>
      <Dropdown.Target>
        { set ? (
        <div className="m-1 flex gap-1 items-center">
          <img className="shrink-0 inline h-8 sm:h-10 md:h-12" src={getSpriteURL(set.species)}/>
          <span className="truncate">{set.species}</span>
        </div>
        ) : "Choose Set"}
      </Dropdown.Target>
      <Dropdown.Content>
        <Dropdown.Search />
        <Dropdown.Section label="New Set">
          <Dropdown.Item 
            onClick={async () => {
              const data = await navigator.clipboard.readText();
              importSets(data).forEach((set) => addSet(set));
            }}
          >
            Copy from clipboard
          </Dropdown.Item>
        </Dropdown.Section>
        <Dropdown.Section label="From Team" searchable>
          {Object.entries(teamSetsInfo).map(([setId, name]) => (
            <Dropdown.Item
              searchTerm={name}
              key={setId}
              onClick={() => onSetChange(setId)}
            >
              {name as ReactNode}
            </Dropdown.Item>
          ))}
        </Dropdown.Section>
        <Dropdown.Section label="From Library" searchable>
          {Object.entries(librarySetsInfo).map(([setId, name]) => (
            <Dropdown.Item
              searchTerm={name}
              key={setId}
              onClick={() => onSetChange(setId)}
            >
              {name as ReactNode}
            </Dropdown.Item>
          ))}
        </Dropdown.Section>
      </Dropdown.Content>
    </Dropdown>
  )
}

function MoveDropdown({ attackerId, move, onMoveChange }: { attackerId?: string, move?: string, onMoveChange: (move: string) => void }) {
  const set = useSet(attackerId);

  return (
    <Dropdown className="rounded border shadow text-center">
      <Dropdown.Target>{move ?? "Choose Move"}</Dropdown.Target>
      <Dropdown.Content>
        <Dropdown.Search />
        <Dropdown.Section label="From Set" searchable>
          { set && set.moves.map((move) => (
            <Dropdown.Item
              searchTerm={move}
              onClick={() => onMoveChange(move)}
            >
              {move}
            </Dropdown.Item>
          ))}
        </Dropdown.Section>
        <Dropdown.Section label="Legal Moves" searchable>
          { set && getLearnSet(set.species).filter(move => !set.moves.includes(move)).map((move) => (
            <Dropdown.Item
              searchTerm={move}
              onClick={() => onMoveChange(move)}
            >
              {move}
            </Dropdown.Item>
          ))}
        </Dropdown.Section>
      </Dropdown.Content>
    </Dropdown>
  );
}

const weatherConditions = Object.fromEntries(
  (["Sand", "Sun", "Rain", "Hail", "Snow"] as Weather[]).map((weather) => [
    weather,
    (field: Partial<State.Field>) => ({
      ...field,
      weather
    })
  ])
)

const sideConditions = Object.fromEntries(
  Object.keys(new Field().attackerSide).map((key) => [
    key,
    (field: Partial<State.Field>, side: "attackerSide"|"defenderSide") => ({
      ...field,
      [side]: {
        ...field[side],
        [key]: true
      }
    })
  ])
)

function ModifierDropdown({ calcId, side }: { calcId: CalcId, side: "attackerSide" | "defenderSide" }) {
  const calc = useCalc(calcId)
  const { updateCalc } = useCalcActions()

  if (!calc) return;

  return (
    <Dropdown className="text-base">
      <Dropdown.Target className="aspect-square bg-white rounded border p-1">
        <PlusIcon className="m-auto" />
      </Dropdown.Target>
      <Dropdown.Content>
        <Dropdown.Search />
        <Dropdown.Section label="Weather" searchable>
          {Object.entries(weatherConditions).map(([key, value]) => (
            <Dropdown.Item
              searchTerm={key}
              onClick={() => updateCalc(calc.id, { ...calc, field: value(calc?.field ?? {})})}
            >
              {key}
            </Dropdown.Item>
          ))}
        </Dropdown.Section>
        <Dropdown.Section label="Side Conditions" searchable>
          {Object.entries(sideConditions).map(([key, value]) => (
            <Dropdown.Item
              searchTerm={key}
              onClick={() => updateCalc(calc.id, { ...calc, field: value(calc?.field ?? {}, side)})}
            >
              {key}
            </Dropdown.Item>
          ))}
        </Dropdown.Section>
      </Dropdown.Content>
    </Dropdown>
  );
}

function ResultCell({ result }: { result?: DamageCalcResult }) {
  return (
    result ? (
      <div className="p-1 pt-2 text-center sm:text-sm">
        {(100*result.percentRange[0]).toFixed(1)} - {(100*result.percentRange[1]).toFixed(1)}%{result.koChance && " - "+result.koChance}
      </div>
    ) : (
      <></>
    )
  )
}

export function DamageCalc({ calcId }: { calcId: CalcId }) {
  const calc = useCalc(calcId);
  const { updateCalc } = useCalcActions();

  if (!calc) return <></>;
  const { attackerSide, defenderSide, ...field } = calc.field ?? {};

  return (
    <div className="m-[4px] shadow rounded bg-green-400 border border-gray-300 mt-2 text-xs sm:text-sm md:text-base">
      <div className="-m-[2px] rounded bg-gray-100 border border-gray-200 shadow">
        <div className="p-1 empty:p-0 empty:h-1 text-xs md:text-sm flex gap-1 overflow-x-hidden">
          {Object.values(field).map((effect) => (
            <div className="bg-white px-2 rounded align-middle p-1 min-w-max">{effect}</div>
          ))}
        </div>
        <div className="-mx-[2px] p-1 grid grid-cols-[2fr_8rem_2fr] gap-1 rounded bg-white shadow">
          <SetDropdown setId={calc.attacker?.setId} onSetChange={(setId) => {
            updateCalc(calcId, {
              attacker: { setId },
            });
          }}/>
          <MoveDropdown attackerId={calc.attacker?.setId} move={calc.move} onMoveChange={(move) => {
            updateCalc(calcId, { move })
          }}/>
          <SetDropdown setId={calc.defender?.setId} onSetChange={(setId) => {
            updateCalc(calcId, {
              defender: { setId }
            });
          }}/>
        </div>
        <div className="text-xs md:text-sm grid grid-cols-[auto_auto] justify-between gap-1 rounded">
          <div className="p-1 empty:p-0 empty:h-1 flex gap-1 overflow-x-hidden">
            <ModifierDropdown calcId={calcId} side="attackerSide"/>
            {Object.keys(attackerSide ?? {}).map((effect) => (
              <div className="bg-white md:px-2 rounded align-middle p-1 min-w-max">{effect}</div>
            ))}
          </div>
          <div className="p-1 empty:p-0 empty:h-1 flex flex-row-reverse gap-1 overflow-x-hidden">
            <ModifierDropdown calcId={calcId} side="defenderSide"/>
            {Object.keys(defenderSide ?? {}).map((effect) => (
              <div className="bg-white md:px-2 rounded align-middle p-1 min-w-max">{effect}</div>
            ))}
          </div>
        </div>
      </div>
      <ResultCell result={calc.cachedResult} />
    </div>
  )
}
