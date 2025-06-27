import React, { useContext, useReducer } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";

import { Store } from "@/Store";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useRouter } from "expo-router";

import { useCreateOrderMutation } from "./hooks/orderHooks";
import { getError } from "./utils";
import { ApiError } from "@/app/types/ApiError";

const OrdersScreen = () => {
  const router = useRouter();
  const { mutateAsync: createOrder, isLoading } = useCreateOrderMutation();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const placeOrderHandler = async () => {
    try {
      const data = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      });
      dispatch({ type: "CART_CLEAR" });
      await AsyncStorage.removeItem("cartItems");
      Alert.alert("Order Placed", "Order Successfully placed");
      router.navigate(`/orderDetail/${data.order._id}`);
    } catch (err) {
      Alert.alert("Error creating order", getError(err as ApiError));
    }
  };

  const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.taxPrice; // + cart.shippingPrice // free shipping promo on

  return (
    <ScrollView style={{ flex: 1, padding: 15, backgroundColor: "#fff" }}>
      {/* Shipping Address */}
      <View
        style={{
          marginBottom: 15,
          padding: 10,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 5,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Shipping Address
        </Text>
        <Text style={{ fontSize: 17 }}>{cart.shippingAddress.fullName}</Text>
        <Text style={{ fontSize: 17 }}>
          {cart.shippingAddress.address}, {cart.shippingAddress.city}
        </Text>
        <Text style={{ fontSize: 17 }}>
          {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
        </Text>
        <Link
          href="/shipping"
          style={{
            color: "blue",
            textDecorationLine: "underline",
            fontWeight: "bold",
          }}
        >
          Edit
        </Link>
      </View>

      {/* Order Items */}

      <View
        style={{
          marginBottom: 15,
          padding: 10,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 5,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          Order Items
        </Text>
        <FlatList
          data={cart.cartItems}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                marginBottom: 10,
                borderBottomWidth: 1,
                paddingBottom: 10,
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{ width: 50, height: 50, marginRight: 10 }}
              />
              <View>
                <Text>{item.name}</Text>
                <Text>Quantity: {item.quantity}</Text>
                <Text>&#x20A6;{item.price.toFixed(2)}</Text>
              </View>
            </View>
          )}
          scrollEnabled={false}
        />
        <Link
          href="/cart"
          style={{
            color: "blue",
            textDecorationLine: "underline",
            fontWeight: "bold",
          }}
        >
          Edit
        </Link>
      </View>
      {/* Payment Method */}

      <View
        style={{
          marginBottom: 15,
          padding: 10,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 5,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          Payment Method
        </Text>
        <View
          style={{
            marginBottom: 10,
            paddingBottom: 10,
          }}
        >
          <Text>Payment Method: : {cart.paymentMethod}</Text>
        </View>
        <Link
          href="/paymentMethod"
          style={{
            color: "blue",
            textDecorationLine: "underline",
            fontWeight: "bold",
          }}
        >
          Edit
        </Link>
      </View>
      <View
        style={{
          marginBottom: 15,
          padding: 10,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 5,
        }}
      >
        <Text
          style={{ display: "flex", flexDirection: "row", marginVertical: 12 }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Shipping Cost:{" "}
          </Text>
          <Text style={{ fontSize: 17 }}>
            &#x20A6;{cart.shippingPrice.toFixed(2)}
          </Text>
        </Text>
        <Text
          style={{ display: "flex", flexDirection: "row", marginBottom: 12 }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Tax: </Text>
          <Text style={{ fontSize: 17 }}>
            &#x20A6;{cart.taxPrice.toFixed(2)}
          </Text>
        </Text>
        <Text style={{ display: "flex", flexDirection: "row" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Total: </Text>
          <Text style={{ fontSize: 17 }}>
            &#x20A6;{cart.totalPrice.toFixed(2)}
          </Text>
        </Text>
      </View>
      {/* Total & Payment Button */}
      <View
        style={{
          marginVertical: 20,
        }}
      >
        <TouchableOpacity style={styles.button} onPress={placeOrderHandler}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Place Order
          </Text>
          {isLoading && <ActivityIndicator color="#0000ff" />}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ff9900",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
});

export default OrdersScreen;
