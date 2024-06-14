import { useEffect, useMemo, useState } from "react";

interface SumDisplayProps {
  num: number;
  compTitle: string;
  getSumOfAllNumbersThroughN: (n: number) => number;
}

export default function SumDisplay({
  num,
  compTitle,
  getSumOfAllNumbersThroughN,
}: SumDisplayProps) {
  const [valueHistory, setValueHistory] = useState<
    { number: number; res: number }[]
  >([]);

  // useMemo to cache the result of a calculation
  const res = useMemo(() => {
    // Check if we already have this number calculated
    const existingEntry = valueHistory.find((entry) => entry.number === num);
    if (existingEntry) {
      return existingEntry.res;
    } else {
      // Calculate and update history if it's a new number
      const result = getSumOfAllNumbersThroughN(num);
      setValueHistory((history) => [...history, { number: num, res: result }]);
      return result;
    }
  }, [num, valueHistory, getSumOfAllNumbersThroughN]);

  return (
    <div>
      <h2>{compTitle}</h2>
      <p>
        Sum of all numbers from 0 to {num} equals {res}
      </p>
    </div>
  );
}
