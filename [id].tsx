import React, { useContext, useReducer, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";


import axios from "axios";
import { Store } from "@/Store";

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
    myDispatch,
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
        myDispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `https://temimartapi.onrender.com/api/orders/${orderId}`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        myDispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        myDispatch({ type: "FETCH_FAIL", payload: getError(err) });
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
        myDispatch({ type: "PAY_RESET" });
      }
      if (successDeliver) {
        myDispatch({ type: "DELIVER_RESET" });
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
      myDispatch({ type: "DELIVER_REQUEST" });
      const { data } = await axios.put(
        `https://temimartapi.onrender.com/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      myDispatch({ type: "DELIVER_SUCCESS", payload: data });
      Alert.alert("Order Delivered", "Order is delivered");
    } catch (err) {
      console.log(err);
      myDispatch({ type: "DELIVER_FAIL" });
    }
  }

  
    

    return (
      <View style={{ flex: 1, padding: 15, backgroundColor: "#fff" }}>
        <Text style={{ fontSize: 36, fontWeight: "300" }}>
          Order: {orderId}
        </Text>
        <Text style={{ fontSize: 24, fontWeight: "300" }}>Shipping</Text>
        <Text>Name: {order.shippingAddress.fullName} </Text>
        <Text>
          Address: {order.shippingAddress.address},{order.shippingAddress.city},{" "}
          {order.shippingAddress.postalCode},{order.shippingAddress.country}
        </Text>
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
            <Text
              style={{
                backgroundColor: "pink",
                paddingVertical: 4,
                paddingHorizontal: 6,
              }}
            >
              Not Delivered
            </Text>
          )}
        </View>
        {/* <View>
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
            <Text
              style={{
                backgroundColor: "pink",
                paddingVertical: 4,
                paddingHorizontal: 6,
              }}
            >
              Not Paid
            </Text>
          )}
        </View> */}
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
                    <Text style={{ marginHorizontal: 10 }}>
                      {item.quantity}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />
          {/* Order Summary */}
          <View>
            <Text style={{ fontSize: 24, fontWeight: "300" }}>
              Order Summary
            </Text>
            <View>
              <Text>Items</Text>
              <Text>${order.itemsPrice.toFixed(2)}</Text>

              <Text style={{ fontSize: 24, fontWeight: "300" }}>Shipping</Text>
              <Text>${order.shippingPrice.toFixed(2)}</Text>

              <View>
                <Text style={{ fontSize: 24, fontWeight: "300" }}>Tax</Text>
                <Text>${order.taxPrice.toFixed(2)}</Text>
              </View>

              <Text style={{ fontSize: 24, fontWeight: "300" }}>
                Order Total
              </Text>
              <Text style={{ fontSize: 24, fontWeight: "300" }}>
                ${order.totalPrice.toFixed(2)}
              </Text>
            </View>
            {/* Order summary ends */}

            {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <View>
                {loadingDeliver && <Text>...loading</Text>}

                <Button title=" Deliver Order" onPress={deliverOrderHandler} />
              </View>
            )}
          </View>
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

export default OrderConfirmation;
