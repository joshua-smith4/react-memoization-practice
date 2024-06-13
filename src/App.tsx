import { useState, useEffect, useCallback, useMemo } from "react";
import MinMaxDisplay from "./MinMaxDisplay";
const generateRandomArrayWorker = import("./workers/generate-random-array");

function App() {
  const worker = useMemo(() => {
    return new Worker(generateRandomArrayWorker);
  }, []);

  const INITIAL_LIST_LENGTH = 5;

  // debounce time on list length input
  const TIME_TO_COMMIT_MS = 500;

  // user input state (raw)
  const [listLengthUserInput, setListLengthUserInput] = useState(() =>
    INITIAL_LIST_LENGTH.toString()
  );

  // debounced and validated list length
  const [listLength, setListLength] = useState(INITIAL_LIST_LENGTH);

  // function to parse and validate user input to integer
  const parseUserInputToInt = useCallback((userInput: string) => {
    const num = parseInt(userInput, 10);
    if (isNaN(num) || num <= 0) {
      return;
    }
    return num;
  }, []);

  // Debounce user input and only set value after TIME_TO_COMMIT_MS
  useEffect(() => {
    const timeout = setTimeout(() => {
      const newLength = parseUserInputToInt(listLengthUserInput);
      if (!newLength) return;
      setListLength(newLength);
    }, TIME_TO_COMMIT_MS);
    return () => clearTimeout(timeout);
  }, [listLengthUserInput, parseUserInputToInt]);

  const [randomNumbers, setRandomNumbers] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    console.log("sending message to worker");
    setIsGenerating(true);
    worker.postMessage(listLength);
  }, [listLength, worker]);

  useEffect(() => {
    if (window.Worker) {
      console.log("Web Worker is supported... registering event listener.");
      const onMessage = (event: MessageEvent) => {
        console.log("got message from worker", event.data.length);
        setRandomNumbers(event.data);
        setIsGenerating(false);
      };
      worker.addEventListener("message", onMessage);
      return () => worker.removeEventListener("message", onMessage);
    }
  }, [worker]);

  // Title to be displayed on the MinMaxDisplay component
  const [numberListTitle, setNumberListTitle] = useState("Random Numbers");

  // function implementing the min and max value calculation
  const getMinAndMaxValue = useCallback((numbers: number[]) => {
    if (!numbers.length) return { min: 0, max: 0 };
    const start = performance.now();
    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;
    numbers.forEach((num) => {
      num < min && (min = num);
      num > max && (max = num);
    });
    const end = performance.now();
    console.log("Time to calculate min and max values:", end - start, "ms");
    return { min, max };
  }, []);

  // memoized child component to avoid re-rendering needlessly
  const childComp = useMemo(
    () => (
      <MinMaxDisplay
        numbers={randomNumbers}
        numberListTitle={numberListTitle}
        getMinAndMaxValue={getMinAndMaxValue}
      />
    ),
    [randomNumbers, numberListTitle, getMinAndMaxValue]
  );

  return (
    <>
      <div>
        <label>Size of Number List</label>
        <br />
        <input
          onChange={(e) => setListLengthUserInput(e.target.value)}
          value={listLengthUserInput}
        ></input>
        <br />
        <label>Title of Number List</label>
        <br />
        <input
          onChange={(e) => setNumberListTitle(e.target.value)}
          value={numberListTitle}
        ></input>
        <p>{isGenerating ? "Generating random numbers..." : "Synced"}</p>
        {childComp}
      </div>
    </>
  );
}

export default App;
