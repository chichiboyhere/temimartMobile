import { Text, View, Button, ScrollView, TextInput, Alert } from "react-native";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "@/constants/styles";
import { Store } from "@/Store";

export default function Shipping() {
  const router = useRouter();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  useEffect(() => {
    if (!userInfo) {
      router.navigate("/signin");
    }
    router.navigate("/shipping");
  }, [userInfo, router]);

  const submitHandler = async () => {
    if (!fullName || !address || !city || !postalCode || !country) {
      Alert.alert("Error", "Please fill out all the fields");
      return;
    }
    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });
    AsyncStorage.setItem(
      "shippingAddress",
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
      })
    );
    router.navigate("/order");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fullname</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        placeholder="Full name"
        onChangeText={setFullName}
      />
      <Text style={styles.title}>Address</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />
      <Text style={styles.title}>City</Text>
      <TextInput style={styles.input} value={city} onChangeText={setCity} />
      <Text style={styles.title}>Postal Code</Text>
      <TextInput
        style={styles.input}
        value={postalCode}
        onChangeText={setPostalCode}
      />
      <Text style={styles.title}>Country</Text>
      <TextInput
        style={styles.input}
        value={country}
        onChangeText={setCountry}
      />
      <Button title="Continue" onPress={submitHandler} />
    </View>
  );
}
