import $Blob from 'platformize/dist/base/Blob';

const $window = {
  setTimeout: setTimeout,
  Blob: $Blob,
}

export default $window;