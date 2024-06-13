interface MinMaxDisplayProps {
  numbers: number[];
  numberListTitle: string;
  getMinAndMaxValue: (numbers: number[]) => { min: number; max: number };
}

export default function MinMaxDisplay({
  numbers,
  numberListTitle,
  getMinAndMaxValue,
}: MinMaxDisplayProps) {
  const { min, max } = getMinAndMaxValue(numbers);
  return (
    <div>
      <h2>{numberListTitle}</h2>
      <p>Min: {min}</p>
      <p>Max: {max}</p>
    </div>
  );
}
