import React, { useContext, useEffect, useState, useReducer } from "react";
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
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { getError } from "@/utils";
import { ApiError } from "@/app/types/ApiError";
import { useGetOrderDetailsQuery } from "@/app/hooks/orderHooks";
import {
  CardField,
  useStripe,
  CardFieldInput,
} from "@stripe/stripe-react-native";
import { Order } from "@/app/types/Order";

import axios from "axios";

// ✅ Types for reducer
type Action =
  | { type: "FETCH_REQUEST" }
  | { type: "FETCH_SUCCESS"; payload: Order }
  | { type: "FETCH_FAIL"; payload: string }
  | { type: "DELIVER_REQUEST" }
  | { type: "DELIVER_SUCCESS" }
  | { type: "DELIVER_FAIL"; payload: string };

interface ReducerState {
  order: Order;
  loadingOrder: boolean;
  loadingDeliver: boolean;
  successDeliver: boolean;
  error: string;
}

const reducer = (state: ReducerState, action: Action): ReducerState => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loadingOrder: true };
    case "FETCH_SUCCESS":
      return { ...state, order: action.payload, loadingOrder: false };
    case "FETCH_FAIL":
      return { ...state, loadingOrder: false, error: action.payload };
    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true };
    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false, error: action.payload };
    default:
      return state;
  }
};

const OrderConfirmation = () => {
  const { id: orderId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { state } = useContext(Store);
  const { cart, userInfo } = state;

  const [orderFrmBackend, setOrderFrmBackend] = useState<Order | null>(null);
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { confirmPayment } = useStripe();

  const {
    data: order,
    isLoading,
    error: isErr,
    refetch,
  } = useGetOrderDetailsQuery(orderId as string);

  const [
    { order: orderState, loadingOrder, loadingDeliver, successDeliver },
    dispatch,
  ] = useReducer<React.Reducer<ReducerState, Action>>(reducer, {
    order: {} as Order,
    loadingOrder: true,
    loadingDeliver: false,
    successDeliver: false,
    error: "",
  });

  const deliverOrderHandler = async () => {
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      const { data } = await axios.put(
        `https://temimartapi.onrender.com/api/orders/${orderId}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo!.token}` },
        }
      );
      dispatch({ type: "DELIVER_SUCCESS" });
      Alert.alert("Delivered!", "Order delivered successfully");
    } catch (err) {
      dispatch({ type: "DELIVER_FAIL", payload: getError(err) });
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data: fetchedOrder } = await axios.get<Order>(
          `https://temimartapi.onrender.com/api/orders/${orderId}`,
          {
            headers: { authorization: `Bearer ${userInfo?.token}` },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: fetchedOrder });
        setOrderFrmBackend(fetchedOrder);
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    fetchOrder();
  }, [orderId]);

  const dateFormat = (dateTime: string | number | Date): string => {
    return new Date(dateTime).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `https://temimartapi.onrender.com/api/orders/create-payment-intent`,
        { totalPrice: orderFrmBackend?.totalPrice },
        {
          headers: {
            Authorization: `Bearer ${userInfo!.token}`,
          },
        }
      );

      const clientSecret = data.clientSecret;

      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: "Card",
        paymentMethodData: {
          billingDetails: {
            name: cart.shippingAddress.fullName,
            email: userInfo!.email,
          },
        },
      });

      if (error) {
        Alert.alert("Payment failed", error.message);
        return;
      }

      if (paymentIntent && paymentIntent.status === "Succeeded") {
        await axios.put(
          `https://temimartapi.onrender.com/api/orders/${order!._id}/pay`,
          {
            paymentIntentId: paymentIntent.id,
          },
          {
            headers: {
              Authorization: `Bearer ${userInfo!.token}`,
            },
          }
        );

        Alert.alert("Success", "Payment successful and order placed!");
        router.navigate(`/orderSuccessScreen/${orderId}`);
      }
    } catch (err) {
      Alert.alert(
        "Error",
        "Something went wrong while processing your payment."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loadingOrder) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );
  }

  if (isErr) {
    Alert.alert("Error", getError(isErr as ApiError));
    return null;
  }

  if (!order) {
    Alert.alert("Error", "Order Not Found");
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Order: {orderId}</Text>

      {/* Shipping Section */}
      <View style={styles.itemsContainer}>
        <Text style={styles.orderHeader}>Shipping</Text>
        <View style={styles.orderTextContainer}>
          <Text style={styles.orderText}>Name: </Text>
          <Text style={{ marginLeft: 17 }}>
            {order.shippingAddress.fullName}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 6 }}>
          <Text style={styles.orderText}>Address: </Text>
          <View>
            <Text>{order.shippingAddress.address}</Text>
            <Text>{order.shippingAddress.city}</Text>
            <Text>
              {order.shippingAddress.postalCode},{" "}
              {order.shippingAddress.country}
            </Text>
          </View>
        </View>

        <View style={{ marginVertical: 10 }}>
          {successDeliver && order.isDelivered ? (
            <Text style={styles.greenPanel}>
              Delivered at {dateFormat(order.deliveredAt)}
            </Text>
          ) : (
            <View style={styles.pinkPanel}>
              <Text style={{ fontWeight: "bold" }}>Not Delivered</Text>
            </View>
          )}
        </View>
      </View>

      {/* Items List */}
      <View style={styles.itemsContainer}>
        <Text style={styles.orderHeader}>Items</Text>
        <FlatList
          data={order.orderItems}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                marginBottom: 15,
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{ width: 80, height: 80, borderRadius: 10 }}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {item.name}
                </Text>
                <Text style={{ fontSize: 16, color: "green" }}>
                  ₦{item.price.toLocaleString("en-US")}
                </Text>
                <Text>x {item.quantity}</Text>
              </View>
            </View>
          )}
          scrollEnabled={false}
        />
      </View>

      {/* Order Summary */}
      <View style={styles.itemsContainer}>
        <Text style={styles.orderHeader}>Order Summary</Text>
        <View style={styles.orderTextContainer}>
          <Text style={styles.orderText}>Items: </Text>
          <Text>₦{order.itemsPrice.toLocaleString("en-US")}</Text>
        </View>
        <View style={styles.orderTextContainer}>
          <Text style={styles.orderText}>Shipping: </Text>
          <Text>₦0</Text>
        </View>
        <View style={styles.orderTextContainer}>
          <Text style={styles.orderText}>Payment Method: </Text>
          <Text>{order.paymentMethod}</Text>
        </View>
        <View style={styles.orderTextContainer}>
          <Text style={styles.orderText}>Tax: </Text>
          <Text>₦{order.taxPrice.toLocaleString("en-US")}</Text>
        </View>
        <View style={styles.orderTextContainer}>
          <Text style={styles.orderText}>Order Total: </Text>
          <Text>₦{order.totalPrice.toLocaleString("en-US")}</Text>
        </View>

        {/* Payment Section */}
        {!order.isPaid && order.paymentMethod !== "Cash on Delivery" && (
          <View style={styles.cardContainer}>
            <CardField
              postalCodeEnabled={true}
              placeholders={{ number: "4242 4242 4242 4242" }}
              cardStyle={{ backgroundColor: "#FFFFFF", textColor: "#000000" }}
              style={{ width: "100%", height: 50, marginVertical: 30 }}
              onCardChange={(cardDetails) => setCardDetails(cardDetails)}
            />
            <Button
              title={loading ? "Processing..." : "Pay Now"}
              onPress={handlePay}
              disabled={loading}
            />
          </View>
        )}

        {order.isPaid && (
          <Text style={styles.greenPanel}>
            Paid at {dateFormat(order.paidAt)}
          </Text>
        )}

        {/* Admin Controls */}
        {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
          <View>
            {loadingDeliver && (
              <ActivityIndicator size="large" color="#007bff" />
            )}
            <Button title="Deliver Order" onPress={deliverOrderHandler} />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "green" }]}
          >
            <Link href="/orderHistory">
              <Text style={styles.buttonText}>Order History</Text>
            </Link>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#F8921B" }]}
          >
            <Link href="/">
              <Text style={styles.buttonText}>Shop More</Text>
            </Link>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  itemsContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    width: "100%",
  },
  orderHeader: {
    fontSize: 22,
    fontWeight: "bold",
  },
  orderTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  orderText: {
    fontSize: 17,
    fontWeight: "500",
  },
  pinkPanel: {
    backgroundColor: "pink",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  greenPanel: {
    backgroundColor: "green",
    color: "white",
    padding: 10,
    borderRadius: 10,
    textAlign: "center",
    marginVertical: 10,
  },
  cardContainer: {
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 8,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginVertical: 15,
  },
  button: {
    width: "45%",
    borderRadius: 12,
    paddingVertical: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
  },
});

export default OrderConfirmation;
