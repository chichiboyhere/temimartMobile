import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import styles from "@/constants/styles";
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

      <TouchableOpacity
        style={{
          backgroundColor: "#ff9900",
          padding: 15,
          borderRadius: 5,
          alignItems: "center",
        }}
        onPress={submitHandler}
        // disabled={isLoading}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 10,
  },

  input: {
    borderWidth: 3,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginVertical: 10,
  },
  inputField: {
    marginBottom: 8,
  },
  timeInputContainer: {
    display: "flex",
    flexDirection: "row",
    marginHorizontal: 2,
    gap: 15,
  },
  timeInput: {
    borderWidth: 3,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 8,
    width: "45%",
  },
  text: {
    fontWeight: "bold",
    marginBottom: 4,
  },
});
