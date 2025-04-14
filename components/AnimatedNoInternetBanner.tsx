// components/AnimatedNoInternetBanner.tsx
import React, { useEffect, useRef } from "react";
import { Animated, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  visible: boolean;
}

export default function AnimatedNoInternetBanner({ visible }: Props) {
  const slideAnim = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -60,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#ff4d4d",
        paddingVertical: 10,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        elevation: 3,
      }}
    >
      <Ionicons name="wifi" size={20} color="#fff" style={{ marginRight: 8 }} />
      <Text style={{ color: "#fff", fontWeight: "bold" }}>
        No internet connection
      </Text>
    </Animated.View>
  );
}
