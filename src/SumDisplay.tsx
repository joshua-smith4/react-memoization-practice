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
  const res = getSumOfAllNumbersThroughN(num);
  return (
    <div>
      <h2>{compTitle}</h2>
      <p>
        Sum of all numbers from 0 to {num} equals {res}
      </p>
    </div>
  );
}
