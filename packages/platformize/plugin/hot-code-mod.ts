//@ts-nocheck

const fireLog = {};
const fireError = new Set();

console.fireLog = fireLog;
console.fireError = fireError;

setInterval(() => {
  console.log(fireLog);
}, 3000);

export function fire(id: number) {
  if (fireLog[id] == undefined) fireLog[id] = 0;
  fireLog[id]++;
}

export function error(id: number) {
  fireError.add(id);
}
