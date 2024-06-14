import { useMemo } from "react";

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
  // wrapping this with useMemo call back to only execute this function when num has changed.
  const res = useMemo(() => {
    return getSumOfAllNumbersThroughN(num);
  }, [num]);

  return (
    <div>
      <h2>{compTitle}</h2>
      <p>
        Sum of all numbers from 0 to {num} equals {res}
      </p>
    </div>
  );
}
