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
  case '3':
    const a = 0;
    console.log('e');
    console.log('e1');
    break;
  case '4': {
    const a = 0;
    console.log('e');
    console.log('e1');
    break;
  }
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

class A {
  m0() {
    console.log('i');
  }
  m1() {
    console.log('j');
    [0, 1].forEach(i => {
      console.log('k');
    });
    const m2 = () => {
      console.log('l');
    };

    if (2) {
      console.log('m');
      m2();
    } else {
      console.log('n');
    }
  }
}

const f = () => (console.log('o'), Date.now);
const f1 = () => Date.now;
const f2 = () => Date.now;

const fixRollupTreeShaking = function () {
  function a() {}
  return a;
};

fixRollupTreeShaking._temp = 0;
