function printTips() {
  console.log('a');
  tips.forEach((tip, i) => console.log(`Tip ${i}:` + tip));
}

const a = {
  b() {
    console.log('b');
  },
};

if (true) {
  console.log('c');
} else {
  console.log('d');
}

switch (2) {
  case '2':
    console.log('e');
    console.log('e1');
    break;
  default:
    console.log('f');
    console.log('f1');
    break;
}

1 ? 3 : 2;

if (1) console.log('g');

const fn = () => console.log('h');
const fn1 = () => {
  console.log('h');
};
