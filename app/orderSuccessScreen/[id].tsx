// Temi/app/orderSuccessScreen/[id].tsx

import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Store } from "@/Store";
import ConfettiCannon from "react-native-confetti-cannon";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Link } from "expo-router";
import { Order } from "@/app/types/Order";

const OrderSuccessScreen = () => {
  const { id: orderIdParam } = useLocalSearchParams<{ id: string }>();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const confettiRef = useRef<any>(null);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (confettiRef.current) confettiRef.current.start();

    const fetchOrder = async () => {
      try {
        const { data } = await axios.get<Order>(
          `https://temimartapi.onrender.com/api/orders/${orderIdParam}`,
          {
            headers: { Authorization: `Bearer ${userInfo!.token}` },
          }
        );
        setOrder(data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  if (loading || !order) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading order details...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ConfettiCannon
        ref={confettiRef}
        count={120}
        origin={{ x: -10, y: 0 }}
        fadeOut
        autoStart
      />

      <Text style={styles.icon}>✅</Text>
      <Text style={styles.title}>Order Successful!</Text>
      <Text style={styles.orderId}>Order ID: {order._id}</Text>

      <Text style={styles.sectionHeader}>Shipping</Text>
      <Text style={styles.item}>{order.shippingAddress.fullName}</Text>
      <Text style={styles.item}>
        {order.shippingAddress.address}, {order.shippingAddress.city}
      </Text>
      <Text style={styles.item}>
        {order.shippingAddress.country}, {order.shippingAddress.postalCode}
      </Text>

      <View style={styles.paymentMethod}>
        <Text style={styles.sectionHeader}>Payment Method:</Text>
        <Text style={styles.item}>{order.paymentMethod}</Text>
      </View>

      <Text style={styles.sectionHeader}>Order Summary</Text>
      {order.orderItems.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <Text style={styles.item}>
            {item.name} x {item.quantity}
          </Text>
          <Text style={styles.item}>
            ₦{(item.price * item.quantity).toLocaleString("en-US")}
          </Text>
        </View>
      ))}
      <View style={styles.itemRow}>
        <Text style={styles.item}>Items Price:</Text>
        <Text style={styles.item}>
          ₦{order.itemsPrice.toLocaleString("en-US")}
        </Text>
      </View>
      <View style={styles.itemRow}>
        <Text style={styles.item}>Shipping:</Text>
        <Text style={styles.item}>
          ₦{order.shippingPrice.toLocaleString("en-US")}
        </Text>
      </View>
      <View style={styles.itemRow}>
        <Text style={styles.item}>Tax:</Text>
        <Text style={styles.item}>
          ₦{order.taxPrice.toLocaleString("en-US")}
        </Text>
      </View>
      <View style={styles.itemRow}>
        <Text style={[styles.item, { fontWeight: "bold" }]}>Total:</Text>
        <Text style={[styles.item, { fontWeight: "bold" }]}>
          ₦{order.totalPrice.toLocaleString("en-US")}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: "green" }]}>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 64,
    textAlign: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  sectionHeader: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 4,
  },
  item: {
    fontSize: 16,
  },
  paymentMethod: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    width: "100%",
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginVertical: 15,
  },
  orderId: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
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

export default OrderSuccessScreen;
