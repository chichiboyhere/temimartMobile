import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function FlyToCartExample() {
  const animatedValue = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [showFlyImage, setShowFlyImage] = useState(false);

  const productImageLayout = useRef({ x: 0, y: 0 });
  const cartIconLayout = useRef({ x: 0, y: 0 });

  const productImageRef = useRef(null);
  const cartIconRef = useRef(null);

  const startFlyAnimation = () => {
    const from = productImageLayout.current;
    const to = cartIconLayout.current;

    animatedValue.setValue({ x: from.x, y: from.y });
    setShowFlyImage(true);

    Animated.timing(animatedValue, {
      toValue: { x: to.x, y: to.y },
      duration: 700,
      useNativeDriver: true,
    }).start(() => {
      setShowFlyImage(false);
    });
  };

  return (
    <View style={styles.container}>
      {/* Cart Icon */}
      <TouchableOpacity
        ref={cartIconRef}
        style={styles.cartIcon}
        onLayout={(e) => {
          cartIconLayout.current = e.nativeEvent.layout;
        }}
      >
        <Ionicons name="cart" size={28} color="black" />
      </TouchableOpacity>

      {/* Product Image */}
      <Image
        source={{ uri: "https://via.placeholder.com/150" }}
        style={styles.productImage}
        onLayout={(e) => {
          productImageLayout.current = e.nativeEvent.layout;
        }}
      />

      {/* Add to Cart Button */}
      <TouchableOpacity style={styles.addButton} onPress={startFlyAnimation}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>

      {/* Flying Image */}
      {showFlyImage && (
        <Animated.Image
          source={{ uri: "https://via.placeholder.com/150" }}
          style={[
            styles.flyImage,
            {
              transform: animatedValue.getTranslateTransform(),
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  cartIcon: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  productImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginTop: 150,
    alignSelf: "center",
  },
  addButton: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#0a84ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  flyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: "absolute",
    zIndex: 100,
  },
});
