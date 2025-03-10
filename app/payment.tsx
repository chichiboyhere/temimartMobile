/** install webview to load PayPal **/

/** payment screen **/
import React, { useContext, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

import { Store } from "@/Store";
import { useRouter } from "expo-router";

const PayPalClientID =
  "PAYPAL_CLIENT_ID=AehyoWNIQTqisWEK1qkdsrL_l-54h4M9SuI6pHBpzxh3rY_KDct1blul422p2h3X0KOKi9c3i8BOmt95&currency=USD"; // Replace with your PayPal Client ID
const PAYPAL_URL = "https://www.sandbox.paypal.com"; // Use sandbox for testing
//https://www.paypal.com/sdk/js?client-id

const Payment = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Calculate Total Price
  const totalPrice = cart.cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  // PayPal Payment URL
  const createPayPalURL = () => {
    return `${PAYPAL_URL}/checkout?client-id=${PayPalClientID}&currency=USD&amount=${totalPrice}`;
  };

  // Handle Payment Success
  const handlePaymentSuccess = () => {
    ctxDispatch({ type: "CART_CLEAR" });
    router.navigate("/orderConfirmation"); // Navigate to Order Confirmation Page
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ textAlign: "center", fontSize: 18, marginVertical: 10 }}>
        Pay ${totalPrice} via PayPal
      </Text>

      {/* WebView to Load PayPal Checkout */}
      <WebView
        source={{ uri: createPayPalURL() }}
        onLoad={() => setLoading(false)}
        onNavigationStateChange={(event) => {
          if (event.url.includes("success")) {
            handlePaymentSuccess();
          }
        }}
      />

      {/* Loading Indicator */}
      {loading && (
        <ActivityIndicator
          size="large"
          color="#ff9900"
          style={{ position: "absolute", top: "50%", left: "50%" }}
        />
      )}
    </View>
  );
};

export default Payment;
