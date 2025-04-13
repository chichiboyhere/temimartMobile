import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { Store } from "@/Store";
import { Link } from "expo-router";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getError } from "@/utils";
import { ApiError } from "@/types/ApiError";
import { useGetOrderDetailsQuery } from "@/hooks/orderHooks";

const OrderConfirmation = () => {
  const { id: orderId } = useLocalSearchParams();
  const router = useRouter();

  const { state } = useContext(Store);
  const { userInfo } = state;

  const {
    data: order,
    isLoading,
    error: isErr,
    refetch,
  } = useGetOrderDetailsQuery(orderId as string);

  async function deliverOrderHandler() {
    //todo
  }

  function dateFormat(dateTime: string | number | Date): string {
    return new Date(dateTime).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  }

  return isLoading ? (
    <ActivityIndicator
      size="large"
      color="#0000ff"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  ) : isErr ? (
    Alert.alert("Error", getError(isErr as ApiError))
  ) : !order ? (
    Alert.alert("Error", "Order Not Found")
  ) : (
    <ScrollView style={{ flex: 1, padding: 15, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Order: {orderId}</Text>

      <View
        style={{
          marginBottom: 15,
          padding: 10,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 5,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "600" }}>Shipping</Text>
        <Text style={{ display: "flex", flexDirection: "row" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Name: </Text>
          <Text style={{ fontSize: 17 }}>{order.shippingAddress.fullName}</Text>
        </Text>
        <Text style={{ display: "flex", flexDirection: "row" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Address: </Text>
          <Text style={{ fontSize: 17 }}>
            {order.shippingAddress.address},{order.shippingAddress.city},{" "}
            {order.shippingAddress.postalCode},{order.shippingAddress.country}
          </Text>
        </Text>
        <View style={{ marginVertical: 10 }}>
          {order.isDelivered ? (
            <Text
              style={{
                backgroundColor: "green",
                paddingVertical: 8,
                paddingHorizontal: 6,
                color: "white",
                borderRadius: 10,
              }}
            >
              Delivered at {dateFormat(order.deliveredAt)}
            </Text>
          ) : (
            <View
              style={{
                backgroundColor: "pink",
                paddingVertical: 10,
                paddingHorizontal: 6,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Not Delivered</Text>
            </View>
          )}
        </View>
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
        <Text style={{ fontSize: 24, fontWeight: "600" }}>Items</Text>
        <FlatList
          data={order.orderItems}
          keyExtractor={(item, index) =>
            item._id ? item._id.toString() : index.toString()
          }
          extraData={order.orderItems} // Ensures list updates when cartItems changes
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
                  <Text style={{ marginHorizontal: 10 }}>
                    x {item.quantity}
                  </Text>
                </View>
              </View>
            </View>
          )}
          scrollEnabled={false}
        />
      </View>

      {/* Order Summary */}

      <View
        style={{
          marginBottom: 20,
          padding: 10,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 5,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "600" }}>Order Summary</Text>
        <Text style={{ display: "flex", flexDirection: "row" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Items: </Text>
          <Text style={{ fontSize: 17 }}>${order.itemsPrice.toFixed(2)}</Text>
        </Text>
        <Text style={{ display: "flex", flexDirection: "row" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Shipping: </Text>
          <Text style={{ fontSize: 17 }}>
            ${order.shippingPrice.toFixed(2)}
          </Text>
        </Text>
        <Text style={{ display: "flex", flexDirection: "row" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Tax: </Text>
          <Text style={{ fontSize: 17 }}>${order.taxPrice.toFixed(2)}</Text>
        </Text>
        <Text style={{ display: "flex", flexDirection: "row" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Order Total:{" "}
          </Text>
          <Text style={{ fontSize: 17 }}>${order.totalPrice.toFixed(2)}</Text>
        </Text>
        <View>
          <View>
            {order.isPaid ? (
              <Text
                style={{
                  backgroundColor: "green",
                  paddingVertical: 8,
                  paddingHorizontal: 6,
                  color: "white",
                  borderRadius: 10,
                  marginTop: 10,
                  marginBottom: 5,
                }}
              >
                Paid at {dateFormat(order.paidAt)}
              </Text>
            ) : (
              <View
                style={{
                  backgroundColor: "pink",
                  paddingVertical: 10,
                  paddingHorizontal: 6,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                  marginBottom: 5,
                }}
              >
                <Link href="https://temimart.onrender.com">
                  <Text style={{ fontWeight: "bold" }}>
                    Go to your order and pay
                  </Text>
                </Link>
              </View>
            )}
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "green",
                width: "45%",
                borderRadius: 12,
                padding: 12,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Link href="/orderHistory">
                <Text style={{ color: "white", fontWeight: "700" }}>
                  See Your Orders
                </Text>
              </Link>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "blue",
                width: "45%",
                borderRadius: 12,
                padding: 12,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Link href="/">
                <Text style={{ color: "white", fontWeight: "700" }}>
                  shopping page
                </Text>
              </Link>
            </TouchableOpacity>
          </View>

          {userInfo!.isAdmin && order.isPaid && !order.isDelivered && (
            <View>
              <Button title=" Deliver Order" onPress={deliverOrderHandler} />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ff9900",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
});

export default OrderConfirmation;
