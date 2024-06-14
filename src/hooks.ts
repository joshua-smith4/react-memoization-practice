import { useCallback, useEffect, useMemo, useRef } from "react";
export function useWebWorker<T extends (...args: any[]) => any>(func: T) {
  const functionString = useMemo(() => {
    const funcStr = func.toString();
    const code = `
      const code = (${funcStr});
      self.onmessage = (event) => {
        const res = code(...event.data.parameters);
        self.postMessage(res);
      };
    `;
    return `(() => {${code}})()`;
  }, [func]);

  const workerReferences = useRef(new Map<Worker, (error: unknown) => void>());

  const createWorker = useCallback(() => {
    if (!window.Worker) {
      throw new Error("Web Worker is not supported");
    }
    const blob = new Blob([functionString], {
      type: "application/javascript",
    });
    const worker = new Worker(URL.createObjectURL(blob));
    return worker;
  }, [functionString]);

  const invoke = useCallback(
    async (...parameters: Parameters<T>) => {
      const worker = createWorker();
      let reject: (error: unknown) => void = () => {};
      const prom = new Promise<ReturnType<T>>((resolve, rej) => {
        const onMessage = (event: MessageEvent) => {
          resolve(event.data);
          workerReferences.current.delete(worker);
          worker.terminate();
        };
        reject = rej;
        worker.addEventListener("message", onMessage);
        worker.postMessage({ parameters });
      });
      workerReferences.current.set(worker, reject);
      return await prom;
    },
    [createWorker]
  );

  const invokeWithCallback = useCallback(
    (cb: (res: ReturnType<T>) => unknown) => {
      const worker = createWorker();
      workerReferences.current.set(worker, () => {});
      const state = { isCancelled: false, called: false };
      const terminate = () => {
        if (state.isCancelled) return;
        state.isCancelled = true;
        worker.terminate();
        workerReferences.current.delete(worker);
      };
      const onMessage = (event: MessageEvent) => {
        if (state.isCancelled) return;
        cb(event.data);
        terminate();
      };
      worker.addEventListener("message", onMessage);
      const callIt = (...parameters: Parameters<T>) => {
        if (state.called) throw new Error("Worker already invoked");
        state.called = true;
        worker.postMessage({ parameters });
      };
      return { invoke: callIt, cancel: terminate };
    },
    [createWorker]
  );

  const terminateAll = useCallback(() => {
    for (const [worker, reject] of workerReferences.current) {
      worker.terminate();
      reject(new Error("Worker terminated"));
    }
  }, []);

  useEffect(() => terminateAll, [terminateAll]);

  const retVal = useMemo(
    () => ({ invoke, invokeWithCallback, terminateAll }),
    [invoke, invokeWithCallback, terminateAll]
  );

  return retVal;
}
