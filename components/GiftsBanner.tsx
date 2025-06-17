// 01 GiftsBanner.tsx
// import { View, Text, StyleSheet, ScrollView } from "react-native";
// import GiftBox from "./GiftBox";

// import React from "react";

// const GiftsBanner = () => {
//   return (
//     <ScrollView
//       horizontal={true}
//       showsHorizontalScrollIndicator={false}
//       style={styles.container}
//     >
//       <GiftBox
//         style={{
//           backgroundColor: "green",
//           width: 80,
//           height: 50,
//           borderRadius: 5,
//         }}
//       />
//       <GiftBox style={{ backgroundColor: "blue", borderRadius: 50 }} />
//       <GiftBox style={{ backgroundColor: "red" }} />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     height: 150,
//     backgroundColor: "#f0f0f0",
//     marginBottom: 10,
//     paddingHorizontal: 15,
//   },
// });

// export default GiftsBanner;

// 02 GiftsBanner.tsx
import { Image, StyleSheet, ScrollView, Text } from "react-native";
import { Link } from "expo-router";

import GiftBox from "./GiftBox";
import React from "react";

const GiftsBanner = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      <Link href="/profile">
        <GiftBox
          style={{
            width: 80,
            height: 40,
            borderRadius: 5,
            backgroundColor: "purple",
          }}
        >
          <Image
            source={require("../assets/images/sticker2.png")}
            style={{ width: 80, height: 40 }}
            //resizeMode="contain"
          />
        </GiftBox>
      </Link>

      <GiftBox
        style={{
          backgroundColor: "#F8921B",
          borderRadius: 50,
          width: 50,
          height: 50,
        }}
      >
        {/* <Link href="/flyToCartAnimation"> */}
        <Image
          source={require("../assets/images/adaptive-icon-tem.png")}
          style={{ width: 50, height: 50 }}
          //resizeMode="contain"
        />
        {/* </Link> */}
      </GiftBox>

      <Link href="/profile">
        <GiftBox
          style={{
            width: 80,
            height: 40,
            borderRadius: 5,
            backgroundColor: "purple",
          }}
        >
          <Image
            source={require("../assets/images/sticker1.png")}
            style={{ width: 80, height: 40 }}
            // resizeMode="contain"
          />
        </GiftBox>
      </Link>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});

export default GiftsBanner;

// 03 GiftsBanner.tsx
// import React from "react";
// import { ScrollView, StyleSheet } from "react-native";
// import GiftBox from "./GiftBox";

// const GiftsBanner = () => {
//   const giftBoxes = [
//     { color: "green", radius: 5 },
//     { color: "blue", radius: 50 },
//     { color: "red", radius: 10 },
//     { color: "purple", radius: 15 },
//     { color: "orange", radius: 25 },
//   ];

//   return (
//     <ScrollView
//       horizontal
//       showsHorizontalScrollIndicator={false}
//       style={styles.container}
//     >
//       {giftBoxes.map((box, index) => (
//         <GiftBox
//           key={index}
//           style={{
//             backgroundColor: box.color,
//             borderRadius: box.radius,
//           }}
//           delay={index * 200} // <-- Wave delay
//         />
//       ))}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     height: 250,
//     backgroundColor: "#f0f0f0",
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//   },
// });

// export default GiftsBanner;

// 04 GiftsBanner.tsx
// import React, { useEffect, useRef } from "react";
// import {
//   Animated,
//   ScrollView,
//   StyleSheet,
//   Easing,
//   ViewStyle,
// } from "react-native";
// import GiftBox from "./GiftBox";

// const GiftsBanner = () => {
//   const waveAnim = useRef(new Animated.Value(0)).current;

//   // Start a looping animation that goes from 0 to 2π repeatedly
//   useEffect(() => {
//     Animated.loop(
//       Animated.timing(waveAnim, {
//         toValue: 2 * Math.PI,
//         duration: 3000,
//         easing: Easing.linear,
//         useNativeDriver: false, // false because we use interpolate
//       })
//     ).start();
//   }, [waveAnim]);

//   const giftBoxes: { color: string; radius: number }[] = [
//     { color: "green", radius: 5 },
//     { color: "blue", radius: 50 },
//     { color: "red", radius: 10 },
//     { color: "purple", radius: 15 },
//     { color: "orange", radius: 25 },
//   ];

//   return (
//     <ScrollView
//       horizontal
//       showsHorizontalScrollIndicator={false}
//       style={styles.container}
//     >
//       {giftBoxes.map((box, index) => {
//         const phase = (index / giftBoxes.length) * 2 * Math.PI;

//         const animatedScale = waveAnim
//           .interpolate({
//             inputRange: [0, 2 * Math.PI],
//             outputRange: [0, 2 * Math.PI], // we want waveAnim to output radians
//             extrapolate: "clamp",
//           })
//           .interpolate({
//             inputRange: [0, 2 * Math.PI],
//             outputRange: [0, 2 * Math.PI],
//           });

//         const finalScale = Animated.add(animatedScale, phase).interpolate({
//           inputRange: [0, 2 * Math.PI],
//           outputRange: [1, 1.5],
//           extrapolate: "extend",
//         });

//         return (
//           <GiftBox
//             key={index}
//             style={{
//               backgroundColor: box.color,
//               borderRadius: box.radius,
//             }}
//             animatedScale={finalScale}
//           />
//         );
//       })}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     height: 250,
//     backgroundColor: "#f0f0f0",
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//   },
// });

// export default GiftsBanner;

// 05 GiftsBanner.tsx
// import React, { useEffect, useRef } from "react";
// import {
//   Animated,
//   ScrollView,
//   StyleSheet,
//   Easing,
//   ViewStyle,
// } from "react-native";
// import GiftBox from "./GiftBox";

// const GiftsBanner = () => {
//   const waveAnim = useRef(new Animated.Value(0)).current;

//   // Start a looping animation that goes from 0 to 2π repeatedly
//   useEffect(() => {
//     Animated.loop(
//       Animated.timing(waveAnim, {
//         toValue: 2 * Math.PI,
//         duration: 3000,
//         easing: Easing.linear,
//         useNativeDriver: false, // false because we use interpolate
//       })
//     ).start();
//   }, [waveAnim]);

//   const giftBoxes: { color: string; radius: number }[] = [
//     { color: "green", radius: 5 },
//     { color: "blue", radius: 50 },
//     { color: "red", radius: 10 },
//     { color: "purple", radius: 15 },
//     { color: "orange", radius: 25 },
//   ];

//   return (
//     <ScrollView
//       horizontal
//       showsHorizontalScrollIndicator={false}
//       style={styles.container}
//     >
//       {giftBoxes.map((box, index) => {
//         const phase = (index / giftBoxes.length) * 2 * Math.PI;

//         const animatedScale = waveAnim
//           .interpolate({
//             inputRange: [0, 2 * Math.PI],
//             outputRange: [0, 2 * Math.PI], // we want waveAnim to output radians
//             extrapolate: "clamp",
//           })
//           .interpolate({
//             inputRange: [0, 2 * Math.PI],
//             outputRange: [0, 2 * Math.PI],
//           });

//         const finalScale = Animated.add(animatedScale, phase).interpolate({
//           inputRange: [0, 2 * Math.PI],
//           outputRange: [1, 1.5],
//           extrapolate: "extend",
//         });

//         return (
//           <GiftBox
//             key={index}
//             style={{
//               backgroundColor: box.color,
//               borderRadius: box.radius,
//             }}
//             animatedScale={finalScale}
//           />
//         );
//       })}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     height: 150,
//     backgroundColor: "#f0f0f0",
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//   },
// });

// export default GiftsBanner;
