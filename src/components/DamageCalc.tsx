import type { CalcId, DamageCalc, DamageCalcResult } from "@/types/DamageCalc";
import { getSpriteURL } from "@/utils/dex";
import type { SetId } from "@/types/PokemonSet";
import { importSets } from "@/utils/serialization";
import { useCalc, useCalcActions, useSelectedTeam, useSet, useSetActions, useTeamSetInfo } from "@/hooks/useStore";
import { Dropdown } from "./Dropdown";
import { getLearnSet } from "@/utils/dex";
import type { ReactNode } from "react";

function PokemonSetCell({ setId, onSetChange }: { setId?: SetId, onSetChange: (setId: SetId) => void }) {
  const { addSet } = useSetActions();
  const set = useSet(setId);
  const selectedTeam = useSelectedTeam();
  const teamSetsInfo = useTeamSetInfo(selectedTeam?.id);
  const librarySetsInfo = useTeamSetInfo(undefined);

  return (
    <Dropdown className={`min-w-0 rounded border ${set?.teamId && "border-black"} h-10 sm:h-12 md:h-14`}>
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
    <Dropdown className="rounded border text-center">
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
      <div className="m-1 text-center">
        {(100*result.percentRange[0]).toFixed(1)} - {(100*result.percentRange[1]).toFixed(1)}%{result.koChance && " - "+result.koChance}
      </div>
    ) : (
      <></>
    )
  )
}

export function DamageCalc({ calcId }: { calcId: CalcId }) {
  const calc = useCalc(calcId);

  if (!calc) return <></>;
  const { updateCalc } = useCalcActions();

  return (
    <div className="rounded border bg-green-400 mt-2 text-xs sm:text-sm md:text-base">
      <div className="p-1 grid grid-cols-[2fr_8rem_2fr] gap-1 rounded bg-white shadow">
        <PokemonSetCell setId={calc.attacker?.setId} onSetChange={(setId) => {
          updateCalc(calcId, {
            attacker: { setId },
          });
        }}/>
        <MoveCell attackerId={calc.attacker?.setId} move={calc.move} onMoveChange={(move) => {
          updateCalc(calcId, { move })
        }}/>
        <PokemonSetCell setId={calc.defender?.setId} onSetChange={(setId) => {
          updateCalc(calcId, {
            defender: { setId }
          });
        }}/>
      </div>
      <ResultCell result={calc.cachedResult} />
    </div>
  )
}
