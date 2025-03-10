import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import styles from "../constants/styles";
import { Store } from "@/Store";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      console.log(data);
      dispatch({ type: "USER_SIGNIN", payload: data });
      await AsyncStorage.setItem("userInfo", JSON.stringify(data));
      Alert.alert("Logged In", "You're successfully logged in!");
      router.navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  };

  return (
    <View style={styles.container}>
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
      <Button disabled={isLoading} title="Submit" onPress={submit} />
      <Text>
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
      {isLoading && <Text>...loading</Text>}
    </View>
  );
};

export default Signin;
