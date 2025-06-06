// components/ProductCard.tsx
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Link } from "expo-router";
import Rating from "./Rating";
import { Ionicons } from "@expo/vector-icons";

interface Product {
  _id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  rating: number;
  numReviews: number;
  discount?: number;
  numSold?: number;
}

interface Props {
  item: Product;
  onAddToCart: (item: Product) => void;
}

const ProductCard: React.FC<Props> = ({ item, onAddToCart }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [quantitySoldInThousands, setQuantitySoldInThousands] = useState(0);
  const [quantitySoldInLessThanThousands, setQuantitySoldInLessThanThousands] =
    useState(0);
  const [disCountInFigures, setDisCountInFigures] = useState(0);
  const [newPrice, setNewPrice] = useState(0);
  const [timeLeft, setTimeLeft] = useState(12 * 60 * 60); // 12 hours in seconds
  let quantitySold = 0;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (item.numSold) {
      if (item.numSold >= 1000) {
        quantitySold = item.numSold / 1000;
        setQuantitySoldInThousands(quantitySold);
      } else {
        quantitySold = item.numSold;
        setQuantitySoldInLessThanThousands(quantitySold);
      }
    }
  }, [quantitySold, item.numSold]);

  useEffect(() => {
    if (item.discount) {
      const discount = (item.discount * item.price) / 100;
      setDisCountInFigures(discount);
      const newPrice = item.price - discount;
      setNewPrice(newPrice);
    }
  }, [item.discount]);

  // useEffect(() => {
  //   function twelveHourCountDownTimer() {
  //     const now = new Date();
  //     const targetTime = new Date(
  //       now.getFullYear(),
  //       now.getMonth(),
  //       now.getDate(),
  //       12,
  //       0,
  //       0,
  //       0
  //     );
  //     const timeDifference = targetTime.getTime() - now.getTime();
  //     const seconds = Math.floor(timeDifference / 1000);
  //     const minutes = Math.floor(seconds / 60);
  //     const hours = Math.floor(minutes / 60);
  //     const remainingSeconds = seconds % 60;
  //     const remainingMinutes = minutes % 60;
  //     const remainingHours = hours % 24;
  //     const formattedTime = `${remainingHours
  //       .toString()
  //       .padStart(2, "0")}:${remainingMinutes
  //       .toString()
  //       .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  //     return formattedTime;
  //   } // Initialize the countDownTimer
  //   twelveHourCountDownTimer();
  // }, []);
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
    <Animated.View style={[styles.productItem, { opacity: fadeAnim }]}>
      <TouchableOpacity>
        <Link
          href={{
            pathname: "/productdetailscreen",
            params: { slug: item.slug },
          }}
        >
          <View style={styles.productContent}>
            {/* Discount Badge */}
            {item.discount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{item.discount}% OFF</Text>
              </View>
            )}

            {/* Product Image */}
            <Image
              source={{ uri: item.image }}
              style={styles.productImage}
              resizeMode="contain"
            />

            {/* Product Name */}
            <Text style={styles.productName}>{item.name}</Text>

            {/* Star Rating */}
            <Rating rating={item.rating} numReviews={item.numReviews} />

            {/* Discounted Price View */}
            {item.discount && (
              <View style={styles.discountViewPlusCountdown}>
                <View style={styles.discountedPriceContainer}>
                  <Text style={styles.saveText}>Save</Text>
                  <Text style={styles.nairaSymbolInDisc}>&#x20A6;</Text>
                  <Text style={styles.discountedPrice}>
                    {disCountInFigures}
                  </Text>
                  <Text style={styles.saveText}>extra</Text>
                </View>
                <View style={styles.countDownTimerContainer}>
                  <Text style={styles.countDownTimerText}>
                    {formatTime(timeLeft)}
                  </Text>
                </View>
              </View>
            )}

            {/* Price */}
            <View style={styles.priceContainer}>
              <Text style={styles.nairaSymbol}>&#x20A6;</Text>
              {item.discount ? (
                <Text style={styles.productPrice}>{newPrice}</Text>
              ) : (
                <Text style={styles.productPrice}>{item.price}</Text>
              )}

              {item.numSold && item.numSold >= 1000 ? (
                <Text style={styles.numSoldStyle}>
                  <Ionicons name="flame-sharp" size={12} color="red" />
                  {quantitySoldInThousands}k sold
                </Text>
              ) : item.numSold && item.numSold < 1000 && item.numSold > 0 ? (
                <Text style={styles.numSoldStyle}>
                  {quantitySoldInLessThanThousands} sold
                </Text>
              ) : null}
              <TouchableOpacity onPress={() => onAddToCart(item)}>
                <View style={styles.cartOutline}>
                  <View style={styles.addPlusSign}>
                    <Text style={styles.addPlusSignText}> + </Text>
                  </View>
                  <Ionicons name="cart-outline" size={18} color="black" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Link>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  productItem: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  productContent: {
    flexDirection: "column",
    alignItems: "flex-start",
    position: "relative",
  },
  discountBadge: {
    position: "absolute",
    top: 5,
    left: 5,
    // backgroundColor: "#FF5252",
    backgroundColor: "green",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },
  discountText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  productImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 8,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
    maxWidth: 160,
    display: "flex",
    flexWrap: "wrap",
    overflow: "hidden",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  discountViewPlusCountdown: {
    borderWidth: 1,
    borderColor: "#F8921B",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    height: 20,
    width: "100%",
    justifyContent: "space-between",
  },
  discountedPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8921B",
    paddingHorizontal: 4,
    height: "100%",
  },
  saveText: {
    color: "white",
    fontWeight: "600",
    fontSize: 10,
    marginRight: 4,
  },
  nairaSymbolInDisc: {
    color: "white",
    fontWeight: "600",
    fontSize: 10,
    marginRight: 2,
  },
  discountedPrice: {
    color: "white",
    fontWeight: "600",
    fontSize: 10,
    marginRight: 4,
  },
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
  nairaSymbol: {
    color: "#F8921B",
    fontWeight: "600",
    fontSize: 12,
    marginRight: 2,
  },
  productPrice: {
    color: "#F8921B",
    fontWeight: "600",
    fontSize: 16,
    marginRight: 4,
  },
  numSoldStyle: {
    color: "gray",
    fontSize: 12,
    marginTop: 4,
  },

  cartButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
  },
  cartOutline: {
    marginLeft: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderColor: "black",
    borderWidth: 1,
  },
  addPlusSign: {
    position: "absolute",
    top: -7,
    left: 10,
    zIndex: 1,
  },
  addPlusSignText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 15,
  },
});
