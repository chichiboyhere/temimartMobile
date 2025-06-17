// 01 Gift Box
// import React, { Component, useEffect, useRef } from "react";
// import { Animated, View, Text, StyleSheet } from "react-native";
// import { Link } from "expo-router";
// import type { PropsWithChildren } from "react";
// import type { ViewStyle } from "react-native";

// type GiftBoxViewProps = PropsWithChildren<{ style: ViewStyle }>;

// const GiftBox: React.FC<GiftBoxViewProps> = (props) => {
//   const scaleAnim = useRef(new Animated.Value(1)).current;

//   useEffect(() => {
//     const animation = Animated.loop(
//       Animated.sequence([
//         Animated.timing(scaleAnim, {
//           toValue: 1.5,
//           duration: 750,
//           useNativeDriver: true,
//         }),
//         Animated.timing(scaleAnim, {
//           toValue: 1,
//           duration: 750,
//           useNativeDriver: true,
//         }),
//       ])
//     );
//     animation.start();

//     return () => animation.stop();
//   }, [scaleAnim]);

//   return (
//     <View style={styles.container}>
//       <Animated.View
//         style={[
//           styles.box,
//           { transform: [{ scale: scaleAnim }], ...props.style },
//         ]}
//       >
//         {props.children}
//         <Link href="/profile">
//           <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
//             {" "}
//             Free
//           </Text>
//         </Link>
//       </Animated.View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   box: {
//     width: 80,
//     height: 80,
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     marginHorizontal: 50,
//   },
// });

// export default GiftBox;

// 02 GiftBox.tsx
import React, { useEffect, useRef } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  Easing,
  ViewStyle,
  Dimensions,
} from "react-native";
import { Link } from "expo-router";
import type { PropsWithChildren } from "react";

type GiftBoxViewProps = PropsWithChildren<{
  style: ViewStyle;
}>;

const SCREEN_WIDTH = Dimensions.get("window").width;

const GiftBox: React.FC<GiftBoxViewProps> = (props) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;
  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(1)).current;

  const isCircular = props.style.borderRadius === 50;

  useEffect(() => {
    // Common pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    // Horizontal wave movement for non-circular ones
    if (!isCircular) {
      const wave = Animated.loop(
        Animated.sequence([
          Animated.timing(translateAnim, {
            toValue: 10,
            duration: 750,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(translateAnim, {
            toValue: 0,
            duration: 750,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(translateAnim, {
            toValue: -10,
            duration: 750,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(translateAnim, {
            toValue: 0,
            duration: 750,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
      wave.start();
    }

    // Ripple effect for circular box
    if (isCircular) {
      const ripple = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(rippleScale, {
              toValue: 2,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(rippleOpacity, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          //Animated.delay(500),
          Animated.parallel([
            Animated.timing(rippleScale, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(rippleOpacity, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      ripple.start();
    }

    return () => {
      pulse.stop();
    };
  }, [scaleAnim, translateAnim, rippleScale, rippleOpacity, isCircular]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.box,
          props.style,

          {
            // overflow: "hidden",
            transform: [
              { scale: scaleAnim },
              ...(isCircular ? [] : [{ translateX: translateAnim }]),
            ],
          },
        ]}
      >
        {isCircular && (
          <Animated.View
            style={[
              styles.ripple,
              {
                opacity: rippleOpacity,
                transform: [{ scale: rippleScale }],
              },
            ]}
          />
        )}
        {props.children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginHorizontal: 15,
  },
  box: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  ripple: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: "white",
    zIndex: 1,
  },
  planeWave: {
    position: "absolute",
    width: 5,
    height: 80,
    backgroundColor: "white",
    zIndex: -1,
  },

  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});

export default GiftBox;

// 03 GiftBox.tsx
// import React, { useEffect, useRef } from "react";
// import { Animated, View, Text, StyleSheet } from "react-native";
// import { Link } from "expo-router";
// import type { ViewStyle } from "react-native";

// type GiftBoxProps = {
//   style: ViewStyle;
//   delay?: number;
// };

// const GiftBox: React.FC<GiftBoxProps> = ({ style, delay = 0 }) => {
//   const scaleAnim = useRef(new Animated.Value(1)).current;

//   useEffect(() => {
//     const loop = Animated.loop(
//       Animated.sequence([
//         Animated.timing(scaleAnim, {
//           toValue: 1.2,
//           duration: 600,
//           delay,
//           useNativeDriver: true,
//         }),
//         Animated.timing(scaleAnim, {
//           toValue: 1,
//           duration: 600,
//           useNativeDriver: true,
//         }),
//       ])
//     );
//     loop.start();
//     return () => loop.stop();
//   }, [scaleAnim, delay]);

//   return (
//     <View style={styles.container}>
//       <Animated.View
//         style={[styles.box, { transform: [{ scale: scaleAnim }], ...style }]}
//       >
//         <Link href="/profile">
//           <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
//             Free
//           </Text>
//         </Link>
//       </Animated.View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   box: {
//     width: 80,
//     height: 80,
//     justifyContent: "center",
//     alignItems: "center",
//     marginHorizontal: 20,
//   },
// });

// export default GiftBox;

// 04 GiftBox.tsx
// import React from "react";
// import { Animated, View, Text, StyleSheet } from "react-native";
// import { Link } from "expo-router";
// import type { ViewStyle } from "react-native";

// type GiftBoxProps = {
//   style: ViewStyle;
//   animatedScale: Animated.AnimatedInterpolation<number>;
// };

// const GiftBox: React.FC<GiftBoxProps> = ({ style, animatedScale }) => {
//   return (
//     <View style={styles.container}>
//       <Animated.View
//         style={[
//           styles.box,
//           {
//             transform: [{ scale: animatedScale }],
//             ...style,
//           },
//         ]}
//       >
//         <Link href="/profile">
//           <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
//             Free
//           </Text>
//         </Link>
//       </Animated.View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: "center",
//     alignItems: "center",
//     marginHorizontal: 15,
//   },
//   box: {
//     width: 80,
//     height: 80,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// export default GiftBox;

// 05 GiftBox.tsx
// import React from "react";
// import { Animated, View, Text, StyleSheet } from "react-native";
// import { Link } from "expo-router";
// import type { ViewStyle } from "react-native";

// type GiftBoxProps = {
//   style: ViewStyle;
//   animatedScale: Animated.AnimatedInterpolation<number>;
// };

// const GiftBox: React.FC<GiftBoxProps> = ({ style, animatedScale }) => {
//   return (
//     <View style={styles.container}>
//       <Animated.View
//         style={[
//           styles.box,
//           {
//             transform: [{ scale: animatedScale }],
//             ...style,
//           },
//         ]}
//       >
//         <Link href="/profile">
//           <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
//             Free
//           </Text>
//         </Link>
//       </Animated.View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: "center",
//     alignItems: "center",
//     marginHorizontal: 15,
//   },
//   box: {
//     width: 80,
//     height: 80,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// export default GiftBox;
