import { useEffect, useRef } from "react";
import { Animated, View, Text } from "react-native";

const Twirl = () => {
  const twirl = useRef(new Animated.Value(0)).current;
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const gestureState = useRef({ vx: 0, vy: 0 }).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        // decay, then spring to start and twirl
        Animated.decay(position, {
          // coast to a stop
          velocity: { x: gestureState.vx, y: gestureState.vy }, // velocity from gesture release
          deceleration: 0.997,
          useNativeDriver: true,
        }),
        Animated.parallel([
          // after decay, in parallel:
          Animated.spring(position, {
            toValue: { x: 0, y: 0 }, // return to start
            useNativeDriver: true,
          }),
          Animated.timing(twirl, {
            // and twirl
            toValue: 360,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [twirl, position, gestureState.vx, gestureState.vy]);
  return (
    <Animated.View
      style={{
        transform: [
          {
            rotate: twirl.interpolate({
              inputRange: [0, 360],
              outputRange: ["0deg", "360deg"],
            }),
          },
        ],
      }}
    >
      <View
        style={{
          height: 80,
          width: 100,
          backgroundColor: "green",
          margin: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 22,
          }}
        >
          Free
        </Text>
      </View>
    </Animated.View>
  );
};

export default Twirl;
