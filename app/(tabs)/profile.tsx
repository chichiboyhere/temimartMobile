// React Native Profile Screen
import React, { useContext, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ScrollView,
} from "react-native";

import { Store } from "@/Store";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import { getError } from "../utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(userInfo?.name || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [password, setPassword] = useState("");
  const [imageUri, setImageUri] = useState(userInfo?.profileImage || "");
  //const [imageBase64, setImageBase64] = useState("");

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

  const saveHandler = async () => {
    try {
      const { data } = await axios.put(
        "https://temimartapi.onrender.com/api/users/profile",
        {
          name,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo!.token}` },
        }
      );

      Alert.alert("Success", "Profile updated");
      console.log(data);
      setEditMode(false);
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert("Error", getError(err));
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {userInfo ? (
        <View style={styles.profile}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.initial}>{userInfo.name[0]}</Text>
          </View>

          {editMode ? (
            <>
              <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
              <TextInput
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
                style={styles.input}
              />
              <View style={styles.editModeBtns}>
                <TouchableOpacity
                  style={styles.cancelEdit}
                  onPress={() => setEditMode(false)}
                >
                  <Text style={styles.saveText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={saveHandler}>
                  <Text style={styles.saveText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.welcome}>{userInfo.name}</Text>
              <Text style={styles.email}>{userInfo.email}</Text>
              <TouchableOpacity onPress={() => setEditMode(true)}>
                <Text style={styles.editLink}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.historyLink}>
                <Text
                  style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                >
                  <Link href="/orderHistory">Order History</Link>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonLogout}
                onPress={signoutHandler}
              >
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </>
          )}
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
              style={{ color: "#318CE7", fontSize: 18, fontWeight: "bold" }}
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
              style={{ color: "#318CE7", fontSize: 18, fontWeight: "bold" }}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  profile: {
    alignItems: "center",
    width: "100%",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  initial: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    marginBottom: 10,
  },
  welcome: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "gray",
    marginBottom: 15,
  },
  editLink: {
    color: "#318CE7",
    fontWeight: "bold",
    marginBottom: 20,
  },
  saveBtn: {
    backgroundColor: "#318CE7",
    padding: 10,
    borderRadius: 10,
    width: "36%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelEdit: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
    width: "36%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  editModeBtns: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  saveText: {
    color: "white",
    fontWeight: "bold",
  },
  logoutBtn: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
  },

  historyLink: {
    backgroundColor: "green",
    width: 280,
    paddingHorizontal: 20,
    borderRadius: 10,
    paddingVertical: 12,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  auth: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  copyright: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  signinButton: {
    backgroundColor: "#318CE7",
    padding: 4,
    color: "white",
    borderRadius: 4,
  },
  signinButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  copyContainer: {
    marginTop: 20,
  },
  buttonLogout: {
    width: 280,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    paddingHorizontal: 20,
    borderRadius: 10,
    paddingVertical: 12,
  },
  logoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  // container: {
  //     flex: 1,
  //     // backgroundColor: "#25292e",
  //     justifyContent: "center",
  //     alignItems: "center",
  //     padding: 15,
  //     height: 780,
  //   },
  //   text: {
  //     color: "#fff",
  //     fontSize: 17,
  //   },

  //   list: {
  //     color: "white",
  //     fontSize: 16,
  //     marginTop: 15,
  //     width: "90%",
  //   },
  //   image: {
  //     width: 320,
  //     height: 440,
  //     borderRadius: 18,
  //     borderWidth: 2,
  //     borderColor: "white",
  //     marginBottom: 10,
  //   },
  //   copyContainer: {
  //     marginTop: 20,
  //   },
  //   copyright: {
  //     fontSize: 13,
  //     fontWeight: "bold",
  //     textAlign: "center",
  //     color: "white",
  //   },
  //   signinButton: {
  //     backgroundColor: "#318CE7",
  //     padding: 4,
  //     color: "white",
  //     borderRadius: 4,
  //   },
  //   signinButtonText: {
  //     color: "white",
  //     fontWeight: "bold",
  //     fontSize: 16,
  //   },
  //   buttonLogout: {
  //     width: 280,
  //     justifyContent: "center",
  //     alignItems: "center",
  //     backgroundColor: "red",
  //     paddingHorizontal: 20,
  //     borderRadius: 10,
  //     paddingVertical: 12,
  //   },
  //   logoutText: {
  //     color: "white",
  //     fontSize: 18,
  //     fontWeight: "bold",
  //   },
  //   welcome: {
  //     marginVertical: 10,
  //     fontSize: 17,
  //     fontWeight: "700",
  //   },
  //   profile: {
  //     display: "flex",
  //     flexDirection: "column",
  //     justifyContent: "center",
  //     alignItems: "center",
  //   },
  //   auth: {
  //     display: "flex",
  //     flexDirection: "column",
  //     gap: 10,
  //   },
  //   historyLink: {
  //     backgroundColor: "green",
  //     width: 280,

  //     paddingHorizontal: 20,
  //     borderRadius: 10,
  //     paddingVertical: 12,
  //     display: "flex",
  //     justifyContent: "center",
  //     alignItems: "center",
  //     marginBottom: 12,
  //   },
});
