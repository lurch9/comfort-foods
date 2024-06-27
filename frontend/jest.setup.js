import '@testing-library/jest-dom';

import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

process.env.NODE_ENV = 'test';

import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.setImmediate = (callback) => {
  return setTimeout(callback, 0);
};


Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: global.importMetaEnv,
    },
  },
});
  




