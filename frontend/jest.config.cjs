module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['js', 'jsx'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@babel/runtime)/)', // Ensures transformations are applied correctly
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

  },
};




  