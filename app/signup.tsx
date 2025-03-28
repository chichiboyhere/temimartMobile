import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import styles from "../constants/styles";
import { Store } from "@/Store";
import { Link, useRouter } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useSignupMutation } from "@/hooks/userHooks";

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
    }
    try {
      const data = await signup({ name, email, password });
      console.log(data);
      dispatch({ type: "USER_SIGNIN", payload: data });
      await AsyncStorage.setItem("userInfo", JSON.stringify(data));
      Alert.alert("Registered!", "You're successfully Registered!");
      router.navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  };

  return (
    <View style={styles.container}>
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
      <Button disabled={isLoading} title="Submit" onPress={submit} />
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
