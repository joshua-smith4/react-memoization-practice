export default () => {
  const generateRandomNumberArray = (length: number) => {
    return Array.from({ length }, () =>
      Math.floor(Math.random() * 10000000000)
    );
  };
  self.addEventListener("message", (event) => {
    if (!event) return;
    const listLength = event.data as number;
    const res = generateRandomNumberArray(listLength);
    self.postMessage(res);
  });
};
