import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { Store } from "@/Store";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getError } from "../utils";

import { useSigninMutation } from "@/hooks/userHooks";

const Signin = () => {
  const { state, dispatch } = useContext(Store);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const { mutateAsync: signin, isLoading } = useSigninMutation();

  const submit = async () => {
    try {
      const data = await signin({ email, password });

      dispatch({ type: "USER_SIGNIN", payload: data });
      await AsyncStorage.setItem("userInfo", JSON.stringify(data));
      Alert.alert("Logged In", "You're successfully logged in!");
      router.navigate("/");
    } catch (error) {
      Alert.alert("Error", getError(error));
    }
  };

  return isLoading ? (
    <ActivityIndicator
      size="large"
      color="#0000ff"
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  ) : (
    <View
      style={{
        margin: 12,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
      }}
    >
      <Text style={styles.title}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        keyboardType="email-address"
        textContentType="emailAddress"
        placeholder="Email"
        onChangeText={setEmail}
      />
      <Text style={styles.title}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        secureTextEntry
        placeholder="Password"
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#ff9900",
          padding: 15,
          borderRadius: 5,
          alignItems: "center",
        }}
        onPress={submit}
        disabled={isLoading}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Submit
        </Text>
      </TouchableOpacity>
      <Text style={{ marginTop: 6 }}>
        Not a member yet?{" "}
        <Link href="/signup">
          <Text
            style={{
              color: "blue",
              textDecorationLine: "underline",
              fontWeight: "bold",
            }}
          >
            Sign up
          </Text>
          &nbsp;instead
        </Link>
      </Text>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

export default Signin;

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
