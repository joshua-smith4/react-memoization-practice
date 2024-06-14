export default function generateRandomNumberArray(length: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10000000000));
}
