// GiftWaveBanner.tsx
import React, { useRef, useEffect } from "react";
import { Animated, View, StyleSheet, Text, Dimensions } from "react-native";
import { Link } from "expo-router";

const BOX_COUNT = 5;
const ANIMATION_DURATION = 3000; // in ms
const BOX_WIDTH = 80;
const BOX_HEIGHT = 80;
const PHASE_OFFSET = (2 * Math.PI) / BOX_COUNT;

const GiftBox = ({ scale }: { scale: Animated.AnimatedInterpolation }) => (
  <Animated.View
    style={[
      styles.box,
      {
        transform: [{ scale }],
      },
    ]}
  >
    <Link href="/profile">
      <Text style={styles.text}>Free</Text>
    </Link>
  </Animated.View>
);

const GiftWaveBanner = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 2 * Math.PI,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
        easing: () => 1, // linear timing
      })
    ).start();
  }, [animatedValue]);

  return (
    <View style={styles.container}>
      {Array.from({ length: BOX_COUNT }).map((_, i) => {
        const scale = animatedValue.interpolate({
          inputRange: [0, 2 * Math.PI],
          outputRange: [
            Math.sin(0 + i * PHASE_OFFSET) * 0.3 + 1,
            Math.sin(2 * Math.PI + i * PHASE_OFFSET) * 0.3 + 1,
          ],
        });

        return <GiftBox key={i} scale={scale} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 20,
  },
  box: {
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    borderRadius: 10,
    backgroundColor: "#4caf50",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default GiftWaveBanner;
