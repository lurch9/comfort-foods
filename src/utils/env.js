// // src/utils/env.js
// /*Comment this function out for testing*/
// export function getEnv(key) {
//   if (process.env.NODE_ENV === 'test' && key === 'VITE_API_BASE_URL') {

//     return 'http://localhost:5000';
//   }

//   if (typeof process !== 'undefined' && process.env && process.env[key]) {

//     return process.env[key];
//   }

//   if (typeof import.meta.env !== 'undefined' && import.meta.env && import.meta.env[key]) {

//     return import.meta.env[key]; 
//   }

//   return undefined;
// }
// /*This ^ function is for production*/




// /*Use this function for testing, from what I've been able to find, it's a MAJOR headache getting jest to work with import.meta*/
// // export function getEnv(key) {
// //   if (key === 'VITE_API_BASE_URL') {
// //     return 'http://localhost:5000';
// //   }
// //   if (typeof process !== 'undefined' && process.env && process.env[key]) {
// //          return process.env[key];
// //      }

// //   return undefined;
// // }

/**
 * We'll work with this later. For now we'll use standard imports - frontend unit tests will not load environment variables
 */




