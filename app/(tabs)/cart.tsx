import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Store } from "@/Store";

import { Link, useRouter } from "expo-router";
import { CartItem } from "@/types/Cart";

const Cart = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const [numItemsInCart, setNumItemsInCart] = useState(0);
  const {
    cart: { cartItems },
    userInfo,
  } = state;

  useEffect(() => {
    setNumItemsInCart(cartItems.reduce((a, c) => a + c.quantity, 0));
  });
  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const router = useRouter();

  const handleUpdateQuantity = (item: CartItem, quantity: number) => {
    if (item.countInStock < quantity) {
      Alert.alert(
        "Stock Limit",
        "You have reached the maximum stock available."
      );
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
    if (quantity === 0) {
      ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
    }
  };

  const handleCheckout = () => {
    if (userInfo) {
      router.navigate("/shipping");
    } else {
      router.navigate("/signin");
    }
  };

  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: "#fff" }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        Cart ({numItemsInCart} {numItemsInCart === 1 ? "item" : "items"} )
      </Text>

      {cartItems.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Your cart is empty.
        </Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item, index) =>
              item._id ? item._id.toString() : index.toString()
            }
            extraData={cartItems} // Ensures list updates when cartItems changes
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 15,
                  alignItems: "center",
                }}
              >
                {/* Product Image */}
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 80, height: 80, borderRadius: 10 }}
                />

                {/* Product Details */}
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 16, color: "green" }}>
                    &#x20A6; {item.price}
                  </Text>

                  {/* Quantity Controls */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        padding: 8,
                        backgroundColor: "#ddd",
                        width: 35,
                        height: 35,
                        borderRadius: 50,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() =>
                        handleUpdateQuantity(item, item.quantity - 1)
                      }
                    >
                      <Text>-</Text>
                    </TouchableOpacity>

                    <Text style={{ marginHorizontal: 10 }}>
                      {item.quantity}
                    </Text>

                    <TouchableOpacity
                      style={{
                        padding: 8,
                        backgroundColor: "#ddd",
                        width: 35,
                        height: 35,
                        borderRadius: 50,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() =>
                        handleUpdateQuantity(item, item.quantity + 1)
                      }
                    >
                      <Text>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />

          {/* Total and Checkout */}
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Total: &#x20A6; {getTotalPrice()}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#ff9900",
                padding: 15,
                borderRadius: 5,
                alignItems: "center",
                marginTop: 10,
              }}
              onPress={handleCheckout}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Proceed to Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default Cart;
