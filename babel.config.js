// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: ["babel-preset-expo"],
//     plugins: [
//       [
//         "babel-plugin-module-resolver",
//         {
//           alias: {
//             "react-native-vector-icons": "@expo/vector-icons",
//           },
//         },
//       ],
//     ],
//   };
// };
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
  };
};
