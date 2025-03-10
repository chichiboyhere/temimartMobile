// import React, { useState, useReducer, useContext, useEffect } from "react";
// import axios from "axios";
// import { View, ActivityIndicator, Button, Alert, Text } from "react-native";
// import WebView from "react-native-webview";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import { getError } from "@/utils";
// import { Store } from "@/Store";

// function reducer(state, action) {
//   switch (action.type) {
//     case "FETCH_REQUEST":
//       return { ...state, loading: true, error: "" };
//     case "FETCH_SUCCESS":
//       return { ...state, loading: false, order: action.payload, error: "" };
//     case "FETCH_FAIL":
//       return { ...state, loading: false, error: action.payload };
//     case "PAY_REQUEST":
//       return { ...state, loadingPay: true };
//     case "PAY_SUCCESS":
//       return { ...state, loadingPay: false, successPay: true };
//     case "PAY_FAIL":
//       return { ...state, loadingPay: false };
//     case "PAY_RESET":
//       return { ...state, loadingPay: false, successPay: false };
//     case "DELIVER_REQUEST":
//       return { ...state, loadingDeliver: true };
//     case "DELIVER_SUCCESS":
//       return { ...state, loadingDeliver: false, successDeliver: true };
//     case "DELIVER_FAIL":
//       return { ...state, loadingDeliver: false };
//     case "DELIVER_RESET":
//       return {
//         ...state,
//         loadingDeliver: false,
//         successDeliver: false,
//       };
//     default:
//       return state;
//   }
// }

// const PayPalPayment = () => {
//   const { state } = useContext(Store);
//   const { userInfo } = state;
//   const { id: orderId } = useLocalSearchParams();
//   const router = useRouter();
//   const [payPalKey, setPayPalKey] = useState();

//   const [
//     { error, order, successPay, loadingPay, loadingDeliver, successDeliver },
//     dispatch,
//   ] = useReducer(reducer, {
//     order: {},
//     error: "",
//     successPay: false,
//     loadingPay: false,
//   });

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         dispatch({ type: "FETCH_REQUEST" });
//         const { data } = await axios.get(
//           `https://temimartapi.onrender.com/api/orders/${orderId}`,
//           {
//             headers: { authorization: `Bearer ${userInfo.token}` },
//           }
//         );
//         dispatch({ type: "FETCH_SUCCESS", payload: data });
//       } catch (err) {
//         dispatch({ type: "FETCH_FAIL", payload: getError(err) });
//       }

//       const fetchPayPalKey = async () => {
//         const { data: clientId } = await axios.get(
//           "https://temimartapi.onrender.com/api/keys/paypal",
//           {
//             headers: { authorization: `Bearer ${userInfo.token}` },
//           }
//         );
//         fetchPayPalKey();
//         setPayPalKey(clientId);
//       };
//     };

//     if (!userInfo) {
//       return router.navigate("/signin");
//     }

//     fetchOrder();
//   }, [order, userInfo, orderId, router]);

//   const PayPalClientID = payPalKey;
//   const PAYPAL_URL = "https://www.sandbox.paypal.com";

//   const onApprove = async () => {
//     try {
//       dispatch({ type: "PAY_REQUEST" });
//       const { data } = await axios.put(
//         `https://temimartapi.onrender.com/api/orders/${order._id}/pay`,
//         {
//           headers: { authorization: `Bearer ${userInfo.token}` },
//         }
//       );
//       dispatch({ type: "PAY_SUCCESS", payload: data });
//       Alert.alert("Order Paid", "Order is paid");
//     } catch (err) {
//       dispatch({ type: "PAY_FAIL", payload: getError(err) });
//       Alert.alert("Error", getError(err));
//     }
//   };

//   const [loading, setLoading] = useState(true);
//   //const PAYPAL_URL = `https://www.paypal.com/checkoutnow?token=${orderId}`;

//   const handleWebViewNavigationStateChange = (navState) => {
//     if (navState.url.includes("success")) {
//       Alert.alert(
//         "Payment Successful",
//         "Your payment was processed successfully!"
//       );
//       onApprove();
//       router.navigate(`/orderConfirmation/${orderId}`); // Redirect user
//     } else if (navState.url.includes("cancel")) {
//       Alert.alert("Payment Cancelled", "Your payment was not completed.");
//       router.navigate("/order");
//     }
//   };

//   // PayPal Payment URL
//   const createPayPalURL = () => {
//     return `${PAYPAL_URL}/checkout?client-id=${PayPalClientID}&currency=USD&amount=${order.totalPrice}`;
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       {loading && <ActivityIndicator size="large" color="#0000ff" />}
//       <Text style={{ textAlign: "center", fontSize: 18, marginVertical: 10 }}>
//         Pay ${order.totalPrice} via PayPal
//       </Text>
//       <WebView
//         source={{ uri: createPayPalURL() }}
//         onLoadEnd={() => setLoading(false)}
//         userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
//         onNavigationStateChange={handleWebViewNavigationStateChange}
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//       />
//     </View>
//   );
// };

// export default PayPalPayment;

import React, { useContext, useReducer, useEffect, useState } from "react";
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
} from "react-native";

import axios from "axios";
import { Store } from "@/Store";
import { Link } from "expo-router";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getError } from "@/utils";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false };
    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true };
    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false };
    case "DELIVER_RESET":
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    default:
      return state;
  }
}

const OrderConfirmation = () => {
  const { id: orderId } = useLocalSearchParams();
  const router = useRouter();

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
    successPay: false,
    loadingPay: false,
  });

  //const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  // const [currency, setCurrency] = useState(options.currency);

  // const onCurrencyChange = ({ target: { value } }) => {
  //   setCurrency(value);
  //   dispatch({
  //     type: "resetOptions",
  //     value: {
  //       ...options,
  //       currency: value,
  //     },
  //   });
  // };
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function dateFormat(dateTime) {
    return new Date(dateTime).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  }

  function onError(err) {
    Alert.alert("Error", err);
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `https://temimartapi.onrender.com/api/orders/${orderId}`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    if (!userInfo) {
      return router.navigate("/signin");
    }
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
      if (successDeliver) {
        dispatch({ type: "DELIVER_RESET" });
      }
    }
    // else {
    //   const loadPaypalScript = async () => {
    //     const { data: clientId } = await axios.get(
    //       "https://temimartapi.onrender.com/api/keys/paypal",
    //       {
    //         headers: { authorization: `Bearer ${userInfo.token}` },
    //       }
    //     );
    //     dispatch({
    //       type: "resetOptions",
    //       value: {
    //         "client-id": clientId,
    //         // currency: 'USD',
    //       },
    //     });
    //     dispatch({ type: "setLoadingStatus", value: "pending" });
    //   };
    //   loadPaypalScript();
    // }
  }, [order, userInfo, orderId, router, successPay, successDeliver]);

  async function deliverOrderHandler() {
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      const { data } = await axios.put(
        `https://temimartapi.onrender.com/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "DELIVER_SUCCESS", payload: data });
      Alert.alert("Order Delivered", "Order is delivered");
    } catch (err) {
      console.log(err);
      dispatch({ type: "DELIVER_FAIL" });
    }
  }

  return loading ? (
    <Text>...loading</Text>
  ) : error ? (
    <Text>Error occured</Text>
  ) : (
    <ScrollView style={{ flex: 1, padding: 15, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 36, fontWeight: "300" }}>Order: {orderId}</Text>
      <Text style={{ fontSize: 24, fontWeight: "300" }}>Shipping</Text>
      <Text>Name: {order.shippingAddress.fullName} </Text>
      <Text>
        Address: {order.shippingAddress.address},{order.shippingAddress.city},{" "}
        {order.shippingAddress.postalCode},{order.shippingAddress.country}
      </Text>

      <View>
        <Text style={{ fontSize: 24, fontWeight: "300" }}>Items</Text>
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
                  <Text style={{ marginHorizontal: 10 }}>{item.quantity}</Text>
                </View>
              </View>
            </View>
          )}
          scrollEnabled={false}
        />
        {/* Order Summary */}
        <View>
          <Text style={{ fontSize: 24, fontWeight: "300" }}>Order Summary</Text>
          <View>
            <Text>Items</Text>
            <Text>${order.itemsPrice.toFixed(2)}</Text>

            <Text style={{ fontSize: 24, fontWeight: "300" }}>Shipping</Text>
            <Text>${order.shippingPrice.toFixed(2)}</Text>

            <View>
              <Text style={{ fontSize: 24, fontWeight: "300" }}>Tax</Text>
              <Text>${order.taxPrice.toFixed(2)}</Text>
            </View>

            <Text style={{ fontSize: 24, fontWeight: "300" }}>Order Total</Text>
            <Text style={{ fontSize: 24, fontWeight: "300" }}>
              ${order.totalPrice.toFixed(2)}
            </Text>
          </View>
          {/* Order summary ends */}
          <View style={{ marginVertical: 10 }}>
            {order.isDelivered ? (
              <Text
                style={{
                  backgroundColor: "green",
                  paddingVertical: 4,
                  paddingHorizontal: 6,
                }}
              >
                Delivered at {order.deliveredAt}
              </Text>
            ) : (
              <View
                style={{
                  backgroundColor: "pink",
                  paddingVertical: 5,
                  paddingHorizontal: 6,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Link href="https://temimart.onrender.com">
                  <Text style={{ fontWeight: "bold" }}>Not Delivered</Text>
                </Link>
              </View>
            )}
          </View>
          <View>
            {order.isPaid ? (
              <Text
                style={{
                  backgroundColor: "green",
                  paddingVertical: 4,
                  paddingHorizontal: 6,
                }}
              >
                Paid at {dateFormat(order.paidAt)}
              </Text>
            ) : (
              <View
                style={{
                  backgroundColor: "pink",
                  paddingVertical: 5,
                  paddingHorizontal: 6,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
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

          {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
            <View>
              {loadingDeliver && <Text>...loading</Text>}

              <Button title=" Deliver Order" onPress={deliverOrderHandler} />
            </View>
          )}
        </View>
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
    marginTop: 10,
  },
});

export default OrderConfirmation;
