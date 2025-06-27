import { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Store } from "@/Store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const PaymentMethod = () => {
  const [selectedMethod, setSelectedMethod] = useState("Cash on Delivery");
  const { state, dispatch } = useContext(Store);
  const router = useRouter();

  const selectPaymentMethod = async (method: string) => {
    setSelectedMethod(method);
    await AsyncStorage.setItem("paymentMethod", method);
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: method });
    router.navigate("/order");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => selectPaymentMethod("Cash on Delivery")}>
        <Text style={styles.payText}>
          {selectedMethod === "Cash on Delivery" ? "🔘" : "⚪️"} Cash on
          Delivery
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => selectPaymentMethod("Card Payment")}>
        <Text style={styles.payText}>
          {selectedMethod === "Card Payment" ? "🔘" : "⚪️"} Card Payment
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  payText: {
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default PaymentMethod;
