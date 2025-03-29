import { Text, View, StyleSheet, Image, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { Link } from "expo-router";

export default function About() {
  const [year, setYear] = useState("");

  useEffect(() => {
    const thisYear: string = new Date().getFullYear().toString();
    setYear(thisYear);
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.text}>
          Bloomer Tech, a subsidiary of Bloomer Inc, is an innovative company
          that brings cutting-edge educative and technological services your
          way.
        </Text>
        <Text style={styles.text}>
          The Temimart is an online shopping mart, where all sorts of household
          convieniences are sold
        </Text>

        <View style={styles.copyContainer}>
          <Text style={styles.copyright}>&copy;{year}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#25292e",
    minHeight: 800,
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
    marginBottom: 10,
  },
  copyright: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
});
