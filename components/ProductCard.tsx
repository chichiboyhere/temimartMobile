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
import { Product } from "@/app/types/Product";
import CountdownTimer from "./CountdownTimer";

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

  // useEffect(() => {
  //   if (typeof item.discount === 'number' && item.discount > 0) {
  //     const discount = (item.discount * item.price) / 100;
  //     setDisCountInFigures(discount);
  //     const newPrice = item.price - discount;
  //     setNewPrice(newPrice);
  //   }
  // }, [item.discount]);

  useEffect(() => {
    if (typeof item.discount === "number" && item.discount > 0) {
      const discount = (item.discount * item.price) / 100;
      setDisCountInFigures(discount);
      const newPrice = item.price - discount;
      setNewPrice(newPrice);
    } else {
      setDisCountInFigures(0);
      setNewPrice(item.price);
    }
  }, [item.discount, item.price]);

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
            {typeof item.discount === "number" && item.discount > 0 && (
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
            {/* {item.discount !== null && item.discount && item.discount > 0 && (
              <View style={styles.discountViewPlusCountdown}>
                <View style={styles.discountedPriceContainer}>
                  <Text style={styles.saveText}>Save</Text>
                  <Text style={styles.nairaSymbolInDisc}>&#x20A6;</Text>
                  <Text style={styles.discountedPrice}>
                   {typeof disCountInFigures === 'number'
  ? disCountInFigures.toLocaleString("en-US")
  : "0"}

                  </Text>
                  <Text style={styles.saveText}>extra</Text>
                </View>

                <CountdownTimer item={item} color="red" />
              </View>
            )} */}

            {typeof item.discount === "number" && item.discount > 0 && (
              <View style={styles.discountViewPlusCountdown}>
                <View style={styles.discountedPriceContainer}>
                  <Text style={styles.saveText}>Save</Text>
                  <Text style={styles.nairaSymbolInDisc}>&#x20A6;</Text>
                  <Text style={styles.discountedPrice}>
                    {typeof disCountInFigures === "number"
                      ? disCountInFigures.toLocaleString("en-US")
                      : "0"}
                  </Text>
                  <Text style={styles.saveText}>extra</Text>
                </View>
                <CountdownTimer item={item} color="red" />
              </View>
            )}

            {/* Price */}
            <View style={styles.priceContainer}>
              <Text style={styles.nairaSymbol}>&#x20A6;</Text>
              {typeof item.discount === "number" && item.discount > 0 ? (
                <Text style={styles.productPrice}>
                  {typeof newPrice === "number"
                    ? newPrice.toLocaleString("en-US")
                    : item.price.toLocaleString("en-US")}
                </Text>
              ) : (
                <Text style={styles.productPrice}>
                  {item.price.toLocaleString("en-US")}
                </Text>
              )}

              {item.numSold && item.numSold >= 1000 ? (
                <Text style={styles.numSoldStyle}>
                  🔥
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
