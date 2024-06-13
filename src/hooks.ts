import { useMemo } from "react";
export function useWebWorker<T extends (...args: any[]) => any>(func: T) {
  const worker = useMemo(() => {
    const funcStr = func.toString();
    const code = `
      const code = (${funcStr});
      self.onmessage = (event) => {
        const res = code(event.data);
        self.postMessage(res);
      };
    `;
    const blob = new Blob([`(${code})()`], { type: "application/javascript" });
    return new Worker(URL.createObjectURL(blob));
  }, [func]);
}
