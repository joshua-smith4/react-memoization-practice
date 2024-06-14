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

  // adding state to keep track of previously entered values for checking against
  const [valueHistroy, setValueHistory] = useState<number[]>([]);
  // adding state to determine when to display error to user
  const [errMessage, setErrMessage] = useState("");
  // Debounce user input and only set value after TIME_TO_COMMIT_MS
  useEffect(() => {
    numHasBeenUsed();
  }, [parsedIntUserInput]);

  const numHasBeenUsed = () => {
    const valueToCheck = parseInt(rawUserInput);
    if (Number.isNaN(valueToCheck)) return;
    const valueUsed = valueHistroy.includes(valueToCheck);
    if (valueUsed) {
      setErrMessage(`${valueToCheck} has previous been used`);
      return;
    }
    setErrMessage("");
    setValueHistory([...valueHistroy, num]);
    executeOperations();
  };
  const executeOperations = () => {
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
  };
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

  // memoized child component to avoid re-rendering needlessly
  const childComp = useMemo(
    () => (
      <SumDisplay
        num={num}
        compTitle={compTitle}
        getSumOfAllNumbersThroughN={getSumOfAllNumbersThroughN}
      />
    ),
    [num, compTitle, getSumOfAllNumbersThroughN]
  );

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
        {errMessage ? <h1>{errMessage}</h1> : childComp}
      </div>
    </>
  );
}

export default App;
