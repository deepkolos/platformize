//@ts-nocheck

console.fireLog = {};
export function fire(id: number) {
  if (console.fireLog[id] == undefined) console.fireLog[id] = 0;
  console.fireLog[id]++;
}

export function error(id: number) {
  if (console.fireError == undefined) console.fireError = new Set();
  console.fireError.add(id);
}
