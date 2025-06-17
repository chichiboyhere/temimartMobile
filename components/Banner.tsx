// Banner.tsx

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const slides = [
  {
    header: "Get a Refund",
    text: "Refund for any issues",
    icon: "delivery-van.png",
  },
  {
    header: "Delay compensation",
    text: "#1600 credit",
    icon: "delivery-van.png",
  },
  {
    header: "Return damaged items ",
    text: "Refund available",
    icon: "delivery-van.png",
  },
  {
    header: "Return within 90d",
    text: "From purchase date",
    icon: "return_box.png",
  },
  {
    header: "Price Adjustment",
    text: "Within 30 days",
    icon: "cash-refund.png",
  },
];

const iconMap: { [key: string]: any } = {
  "delivery-van.png": require("../assets/images/delivery-van.png"),
  "return_box.png": require("../assets/images/return_box.png"),
  "cash-refund.png": require("../assets/images/cash-refund.png"),
};

const extendedSlides = [...slides, slides[0]]; // This helps with smooth transition into the next cycle of slides

const SLIDE_HEIGHT = 70; // fixed banner height same as container height

const Banner = () => {
  const translateY = useRef(new Animated.Value(0)).current;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (paused) return;

      const nextSlide = currentSlide + 1;

      if (nextSlide < extendedSlides.length) {
        Animated.timing(translateY, {
          toValue: -nextSlide * SLIDE_HEIGHT,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          // If it's the ghost slide, reset immediately to slide 0
          if (nextSlide === extendedSlides.length - 1) {
            translateY.setValue(0); // no animation
            setCurrentSlide(0); // loop back cleanly
          } else {
            setCurrentSlide(nextSlide);
          }
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentSlide, paused]);

  return (
    <View style={styles.bannerContainer}>
      {/* Left static side */}
      <View style={styles.staticBanner}>
        <View style={styles.bannerHeader}>
          <Ionicons name="checkmark" size={24} color="green" />
          <Text style={styles.bannerHeaderText}>Free shipping</Text>
        </View>
        <View>
          <Text style={styles.bannerText}>Limited time offer</Text>
        </View>
      </View>

      {/* Divider line */}
      <View style={styles.divider} />

      {/* Right animated side */}

      <Pressable
        onPressIn={() => setPaused(true)}
        onPressOut={() => setPaused(false)}
        style={styles.animatedBanner}
      >
        <Animated.View
          style={{
            transform: [{ translateY }],
            height: extendedSlides.length * SLIDE_HEIGHT,
            flexDirection: "column",
          }}
        >
          {extendedSlides.map((slide, index) => (
            <View key={index} style={styles.slide}>
              {index < 3 ? (
                <>
                  <View style={styles.slideHeader}>
                    <Image
                      source={iconMap[slide.icon]}
                      style={{ width: 20, height: 20 }}
                      resizeMode="contain"
                    />

                    <Text style={styles.slideHeaderText}>{slide.header}</Text>
                  </View>
                  <Text style={styles.slideText}>{slide.text}</Text>
                </>
              ) : (
                <>
                  <View style={styles.slideHeaderPlain}>
                    <Image
                      source={iconMap[slide.icon]}
                      style={{ width: 20, height: 20 }}
                      resizeMode="contain"
                    />

                    <Text style={styles.slideHeaderPlainText}>
                      {slide.header}
                    </Text>
                  </View>
                  <Text style={styles.slidePlainText}>{slide.text}</Text>
                </>
              )}
            </View>
          ))}
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    flexDirection: "row",
    width: "95%",
    height: SLIDE_HEIGHT,
    borderRadius: 10,
    backgroundColor: "#FFD8B1",
    marginVertical: 8,
    alignSelf: "center",
    overflow: "hidden",
    elevation: 3, // subtle shadow on Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, // shadow for iOS
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  staticBanner: {
    flex: 1,
    paddingHorizontal: 6,
    justifyContent: "center",
  },
  bannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  bannerHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    marginLeft: 8,
  },

  bannerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  divider: {
    width: 1,
    backgroundColor: "black",
    marginVertical: 12,
  },

  animatedBanner: {
    flex: 1,
    width: "40%",
    paddingHorizontal: 12,
    height: SLIDE_HEIGHT,
    overflow: "hidden",
  },

  slide: {
    height: SLIDE_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  slideHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#004d00",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  slideHeaderPlain: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  slideHeaderText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
  slideHeaderPlainText: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
  slideText: {
    color: "green",
    fontSize: 12,
    paddingLeft: 4,
    fontWeight: "700",
  },
  slidePlainText: {
    fontSize: 12,
    paddingLeft: 4,
    fontWeight: "700",
  },
});

export default Banner;
