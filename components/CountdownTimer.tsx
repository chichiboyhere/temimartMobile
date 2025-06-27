import { useEffect, useState } from "react";
import { Product } from "@/app/types/Product";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  item: Product;
  color?: string;
}
const CountdownTimer: React.FC<Props> = ({ item, color }) => {
  const [timeLeft, setTimeLeft] = useState(12 * 60 * 60); // 12 hours in seconds

  useEffect(() => {
    if (!item.discount) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Clean up on unmount
  }, [item.discount]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.countDownTimerContainer}>
      <Text style={[styles.countDownTimerText, { color: color }]}>
        {formatTime(timeLeft)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  countDownTimerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  countDownTimerText: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 6,
    color: "#D32F2F",
  },
});

export default CountdownTimer;
