import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useEffect, useState, useContext } from "react";
import { Link } from "expo-router";
import { Store } from "@/Store";
// import { storage } from "@/utils";
// import { MMKV } from "react-native-mmkv";

// const storage = new MMKV();
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const signoutHandler = () => {
    dispatch({ type: "USER_SIGNOUT" });
    AsyncStorage.removeItem("userInfo");
    AsyncStorage.removeItem("cartItems");
    AsyncStorage.removeItem("shippingAddress");
    AsyncStorage.removeItem("paymentMethod");
    Alert.alert("Logged Out", "You've been successfully logged out");
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {userInfo ? (
          <TouchableOpacity onPress={signoutHandler}>
            <Text>Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.signinButton}>
            <Link href="/signin">
              <Text style={styles.signinButtonText}>Sign in</Text>
            </Link>
          </TouchableOpacity>
        )}

        <View style={styles.copyContainer}></View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  text: {
    color: "#fff",
    fontSize: 17,
  },

  list: {
    color: "white",
    fontSize: 16,
    marginTop: 15,
    width: "90%",
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "white",
    marginBottom: 10,
  },
  copyContainer: {
    marginTop: 20,
  },
  copyright: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  signinButton: {
    width: "85%",
    backgroundColor: "green",
    padding: 8,
    color: "white",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  signinButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
