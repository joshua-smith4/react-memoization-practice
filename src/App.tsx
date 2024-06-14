import { useState, useEffect, useCallback, useMemo } from "react";
import SumDisplay from "./SumDisplay";

function App() {
  const INITIAL_NUMBER = 5;
  const MAX_NUMBER = 1000000000;

  // debounce time on list length input
  const TIME_TO_COMMIT_MS = 500;

  // user input state (raw)
  const [rawUserInput, setRawUserInput] = useState(INITIAL_NUMBER.toString());

  const parsedIntUserInput = useMemo(() => {
    const num = parseInt(rawUserInput, 10);
    if (isNaN(num)) {
      return;
    }
    return num;
  }, [rawUserInput]);

  // debounced and validated list length
  const [num, setNum] = useState(INITIAL_NUMBER);

  // Debounce user input and only set value after TIME_TO_COMMIT_MS
  useEffect(() => {
    const timeout = setTimeout(() => {
      const newNum = parsedIntUserInput;
      if (newNum === undefined) return;
      let clampedValue = Math.min(newNum, MAX_NUMBER);
      clampedValue = Math.max(clampedValue, 0);
      setNum(clampedValue);
      if (clampedValue === newNum) return;
      setRawUserInput(clampedValue.toString());
    }, TIME_TO_COMMIT_MS);
    return () => clearTimeout(timeout);
  }, [parsedIntUserInput]);

  const getSumOfAllNumbersThroughN = useCallback((n: number) => {
    const start = performance.now();
    let sum = 0;
    for (let i = 0; i <= n; i++) {
      sum += i;
    }
    const end = performance.now();
    console.log("Time taken to calculate sum:", end - start, "ms");
    return sum;
  }, []);

  const [compTitle, setCompTitle] = useState("Random Numbers");

  return (
    <>
      <div>
        <label>Size of Number List</label>
        <br />
        <input
          onChange={(e) => setRawUserInput(e.target.value)}
          value={rawUserInput}
        ></input>
        <br />
        <label>Title of Component</label>
        <br />
        <input
          onChange={(e) => setCompTitle(e.target.value)}
          value={compTitle}
        ></input>
        <SumDisplay
          num={num}
          compTitle={compTitle}
          getSumOfAllNumbersThroughN={getSumOfAllNumbersThroughN}
        />
      </div>
    </>
  );
}

export default App;
