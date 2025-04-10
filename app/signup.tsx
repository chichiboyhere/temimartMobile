import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Store } from "@/Store";
import { Link, useRouter } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useSignupMutation } from "@/hooks/userHooks";
import { ApiError } from "./types/ApiError";
import { getError } from "../utils";

const Signup = () => {
  const { state, dispatch } = useContext(Store);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const { mutateAsync: signup, isLoading } = useSignupMutation();

  const submit = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords mismatch!", "Passwords do not match");
      return;
    } else if (!name || !email || !password) {
      Alert.alert("Blank Fields!", "Please fill out all the fields!");
      return;
    }
    try {
      const data = await signup({ name, email, password });

      dispatch({ type: "USER_SIGNIN", payload: data });
      await AsyncStorage.setItem("userInfo", JSON.stringify(data));
      Alert.alert("Registered!", "You're successfully Registered!");
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
      <Text style={styles.title}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        placeholder="Name"
        onChangeText={setName}
      />
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
      <Text style={styles.title}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        secureTextEntry
        placeholder="Confirm Password"
        onChangeText={setConfirmPassword}
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
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      <Text>
        Already a member?{" "}
        <Link href="/signin">
          <Text
            style={{
              color: "blue",
              textDecorationLine: "underline",
              fontWeight: "bold",
            }}
          >
            Sign in
          </Text>
          &nbsp;instead
        </Link>
      </Text>
    </View>
  );
};

export default Signup;

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
});
