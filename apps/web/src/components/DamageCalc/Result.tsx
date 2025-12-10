import { ChevronDoubleDownIcon, ChevronDoubleUpIcon } from "@heroicons/react/16/solid";
import { useDamageCalc } from "./Context";

export function Result() {
  const { calc: { cachedResult: result }, isOpen, setIsOpen } = useDamageCalc();

  if (!result) return;

  return (
      <button className="size-full p-1 text-center sm:text-sm flex justify-between" onClick={() => setIsOpen(!isOpen)}>
        {isOpen
          ? <ChevronDoubleUpIcon className="h-4 text-white px-1" />
          : <ChevronDoubleDownIcon className="h-4 text-white px-1" />
        }
        <span>{result ? `${(100*result.percentRange[0]).toFixed(1)} - ${(100*result.percentRange[1]).toFixed(1)}%${result.koChance && " - "+result.koChance}` : "Select Move"}</span>
        {isOpen
          ? <ChevronDoubleUpIcon className="h-4 text-white px-1" />
          : <ChevronDoubleDownIcon className="h-4 text-white px-1" />
        }
      </button>
  )
}
