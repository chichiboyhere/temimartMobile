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
import { Link, useRouter } from "expo-router";
import { Store } from "@/Store";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const router = useRouter();

  const signoutHandler = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout? Awwn, we'll miss you o!",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          onPress: () => {
            dispatch({ type: "USER_SIGNOUT" });
            AsyncStorage.removeItem("userInfo");
            AsyncStorage.removeItem("cartItems");
            AsyncStorage.removeItem("shippingAddress");
            AsyncStorage.removeItem("paymentMethod");
            Alert.alert("Logged Out", "You're logged out. Come back soon.");
          },
        },
      ]
    );

    router.navigate("/");
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {userInfo ? (
          <View style={styles.profile}>
            <Ionicons name={"person"} size={200} color={"white"} />
            <Text style={styles.welcome}>
              Welcome {userInfo.name} &nbsp;({userInfo.email})
            </Text>

            <TouchableOpacity style={styles.historyLink}>
              <Text style={{ color: "white" }}>
                <Link href="/orderHistory">Order History</Link>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={signoutHandler}
              style={styles.buttonLogout}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.auth}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 12,
                width: "80%",
              }}
            >
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
              >
                Member?
              </Text>
              <TouchableOpacity style={styles.signinButton}>
                <Link href="/signin">
                  <Text style={styles.signinButtonText}>Sign in</Text>
                </Link>
              </TouchableOpacity>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 12,
                width: "80%",
              }}
            >
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
              >
                Not a member yet?
              </Text>
              <TouchableOpacity style={styles.signinButton}>
                <Link href="/signup">
                  <Text style={styles.signinButtonText}>Sign up</Text>
                </Link>
              </TouchableOpacity>
            </View>
          </View>
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
    height: 780,
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
    backgroundColor: "green",
    padding: 4,
    color: "white",
    borderRadius: 4,
  },
  signinButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonLogout: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    paddingHorizontal: 20,
    borderRadius: 10,
    paddingVertical: 10,
  },
  logoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  welcome: {
    color: "white",
    marginVertical: 10,
  },
  profile: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  auth: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  historyLink: {
    backgroundColor: "green",
    width: "90%",
    borderRadius: 12,
    padding: 12,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
});
