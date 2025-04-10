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
      </View>
      <View style={styles.copyContainer}>
        <Text style={styles.copyright}>&copy;{year}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    // backgroundColor: "#25292e",
    minHeight: 800,
  },
  text: {
    color: "gray",
    fontWeight: "500",
    fontSize: 17,
  },

  copyContainer: {
    marginBottom: 10,
  },
  copyright: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    color: "gray",
  },
});
