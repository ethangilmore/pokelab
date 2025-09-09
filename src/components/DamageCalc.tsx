import type { CalcId, DamageCalc, DamageCalcResult } from "@/types/DamageCalc";
import { getSpriteURL } from "@/utils/dex";
import type { SetId } from "@/types/PokemonSet";
import { exportSets, importSets } from "@/utils/serialization";
import { useCalc, useCalcActions, useSelectedTeam, useSet, useSetActions, useTeamSetInfo } from "@/hooks/useStore";
import { Dropdown } from "./Dropdown";
import { getLearnSet } from "@/utils/dex";
import type { ReactNode } from "react";

// function PokemonSetCell({ setId, onSetChange }: { setId?: SetId, onSetChange: (set: Omit<PokemonSet,"id"|"teamId">) => void }) {
function PokemonSetCell({ setId, onSetChange }: { setId?: SetId, onSetChange: (setId: SetId) => void }) {
  const { addSet } = useSetActions();
  const set = useSet(setId);
  const selectedTeam = useSelectedTeam();
  const teamSetsInfo = useTeamSetInfo(selectedTeam?.id);
  const librarySetsInfo = useTeamSetInfo(undefined);

  return (
    <Dropdown className="w-full">
      <Dropdown.Target className="w-full">
        { set ? (
          <div className="m-2 gap-4 grid grid-cols-[auto_auto] items-center justify-center inline-block">
            <img className="w-24 h-24 m-auto object-contain" src={getSpriteURL(set.species)} />
            <div>
              {exportSets([set]).split('\n').filter((line) => !line.startsWith('-')).map((line, idx) => (
                <div key={idx} className="text-left">{line}</div>
              ))}
            </div>
          </div>
        ) : "Choose Set"}
      </Dropdown.Target>
      <Dropdown.Content>
        <Dropdown.Search />
        <Dropdown.Section label="New Set">
          <Dropdown.Item 
            onClick={async () => {
              const data = await navigator.clipboard.readText();
              importSets(data).forEach((set) => addSet(set, selectedTeam?.id));
            }}
          >
            Copy from clipboard
          </Dropdown.Item>
        </Dropdown.Section>
        <Dropdown.Section label="From Team">
          {Object.entries(teamSetsInfo).map(([setId, name]) => (
            <Dropdown.Item key={setId} onClick={() => onSetChange(setId)}>{name as ReactNode}</Dropdown.Item>
          ))}
        </Dropdown.Section>
        <Dropdown.Section label="From Library">
          {Object.entries(librarySetsInfo).map(([setId, name]) => (
            <Dropdown.Item key={setId} onClick={() => onSetChange(setId)}>{name as ReactNode}</Dropdown.Item>
          ))}
        </Dropdown.Section>
      </Dropdown.Content>
    </Dropdown>
  )
}

function MoveCell({ attackerId, move, onMoveChange }: { attackerId?: string, move?: string, onMoveChange: (move: string) => void }) {
  const set = useSet(attackerId);

  return (
    <Dropdown>
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

function ResultCell({ result }: { result?: DamageCalcResult }) {
  return (
    result ? (
      <div className="flex flex-col items-center justify-center">
        <span>{(100*result.percentRange[0]).toFixed(1)} - {(100*result.percentRange[1]).toFixed(1)}%</span>
        <span>{result.koChance}</span>
      </div>
    ) : (
      <></>
    )
  )
}

export function DamageCalc({ calcId }: { calcId: CalcId }) {
  const calc = useCalc(calcId);

  if (!calc) return <></>;
  const { updateCalc, removeCalc } = useCalcActions();

  return (
    <div className="mt-4 rounded border shadow grid grid-cols-[5fr_1fr] divide-x">
      <div className="grid grid-rows-[0pt_1fr_0pt] divide-y-1">
        <div className="px-2 grid grid-cols-2 divide-x-1">
          <div></div>
          <div></div>
        </div>
        <div className="grid grid-cols-[1fr_128pt_1fr] divide-x-1">
          <div className="p-4 flex justify-center items-center">
            <PokemonSetCell setId={calc.attacker?.setId} onSetChange={(setId) => {
              updateCalc(calcId, {
                attacker: { setId },
              });
            }}/>
          </div>
          <div className="p-4 flex justify-center items-center">
            <MoveCell attackerId={calc.attacker?.setId} move={calc.move} onMoveChange={(move) => {
              updateCalc(calcId, { move })
            }}/>
          </div>
          <div className="p-4 flex justify-center items-center">
            <PokemonSetCell setId={calc.defender?.setId} onSetChange={(setId) => {
              updateCalc(calcId, {
                defender: { setId }
              });
            }}/>
          </div>
        </div>
        <div className="px-2 flex justify-center">
        </div>
      </div>
      <div className="p-2 flex flex-col justify-center h-full">
        <div className="m-auto">
          <ResultCell result={calc.cachedResult} />
        </div>
        <button className="rounded border p-1" onClick={() => {removeCalc(calcId)}}>
          Delete
        </button>
      </div>
    </div>
  )
}
