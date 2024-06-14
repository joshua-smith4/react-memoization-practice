import { useEffect, useMemo, useState, useRef, memo } from "react";

interface SumDisplayProps {
  num: number;
  compTitle: string;
  getSumOfAllNumbersThroughN: (n: number) => number;
}

function SumDisplay({
  num,
  compTitle,
  getSumOfAllNumbersThroughN,
}: SumDisplayProps) {
  // JavaScript Object
  // Map
  const valueHistory = useRef<{ number: number; res: number }[]>([]);

  // useMemo to cache the result of a calculation
  const res = useMemo(() => {
    // Check if we already have this number calculated
    const existingEntry = valueHistory.current.find((entry) => entry.number === num);
    if (existingEntry) {
      return existingEntry.res;
    } else {
      // Calculate and update history if it's a new number
      const result = getSumOfAllNumbersThroughN(num);
      valueHistory.current.push({ number: num, res: result });
      return result;
    }
  }, [num, getSumOfAllNumbersThroughN]);

  return (
    <div>
      <h2>{compTitle}</h2>
      <p>
        Sum of all numbers from 0 to {num} equals {res}
      </p>
    </div>
  );
}

export default memo(SumDisplay);