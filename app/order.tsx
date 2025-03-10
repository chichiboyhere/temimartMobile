import React, { useContext, useReducer } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import axios from "axios";
import { Store } from "@/Store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

const OrdersScreen = () => {
  const route = useRoute();
  const router = useRouter();

  const { state } = useContext(Store);
  const { cart, userInfo } = state;
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  const placeOrderHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });

      const { data } = await axios.post(
        "https://temimartapi.onrender.com/api/orders",
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      dispatch({ type: "CREATE_SUCCESS" });
      await AsyncStorage.removeItem("cartItems");
      Alert.alert("Order Placed", "Order Successfully placed");
      router.navigate(`/orderDetail/${data.order._id}`);
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      console.log(err);
    }
  };

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: "#fff" }}>
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
        <Text style={{ fontSize: 17, color: "gray" }}>
          {cart.shippingAddress.fullName}
        </Text>
        <Text style={{ fontSize: 17, color: "gray" }}>
          {cart.shippingAddress.address}, {cart.shippingAddress.city}
        </Text>
        <Text style={{ fontSize: 17, color: "gray" }}>
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
      <View>
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
                <Text>${item.price.toFixed(2)}</Text>
              </View>
            </View>
          )}
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
        <Text style={{ fontSize: 17, fontWeight: "700", marginVertical: 10 }}>
          Shipping Cost: ${cart.shippingPrice.toFixed(2)}
        </Text>
        <Text style={{ fontSize: 17, fontWeight: "700", marginBottom: 10 }}>
          Tax: ${cart.taxPrice.toFixed(2)}
        </Text>
      </View>
      {/* Total & Payment Button */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Total: ${cart.totalPrice.toFixed(2)}
        </Text>
        <TouchableOpacity style={styles.button} onPress={placeOrderHandler}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Place Order
          </Text>
          {loading && <Text>...loading</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ff9900",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
});

export default OrdersScreen;
