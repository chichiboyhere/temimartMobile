import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Store } from "@/Store";
import axios from "axios";
import { Link, useRouter } from "expo-router";

const Cart = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    userInfo,
  } = state;

  useEffect(() => {
    console.log(cartItems.map((item) => item._id));
  }, []);
  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const router = useRouter();

  const handleUpdateQuantity = async (item, quantity) => {
    const { data } = await axios.get(
      `https://temimartapi.onrender.com/api/products/${item._id}`
    );
    if (data.countInStock < quantity) {
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

  const handleRemoveItem = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
    Alert.alert("Removed", "Item has been removed from the cart.");
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
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        Your Cart
      </Text>

      {cartItems.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Your cart is empty.
        </Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            // keyExtractor={(item) => item._id}
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
                    ${item.price}
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

                  {/* Remove Button */}
                  {/* <TouchableOpacity
                    onPress={() => handleRemoveItem(item)}
                    style={{ marginTop: 5 }}
                  >
                    <Text style={{ color: "red" }}>Remove</Text>
                  </TouchableOpacity> */}
                </View>
              </View>
            )}
          />

          {/* Total and Checkout */}
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Total: ${getTotalPrice()}
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
