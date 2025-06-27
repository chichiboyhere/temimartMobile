import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PromoStaticBanner = () => {
  return (
    <View style={styles.productImageBanner}>
      <View style={styles.productImageBannerInner}>
        <Ionicons name="checkmark" size={18} color="green" />
        <Text style={styles.productImageBannerText}>
          Free shipping on all orders
        </Text>
      </View>
      <View style={styles.productImageBannerMiddle}></View>
      <View style={styles.productImageBannerInner}>
        <Ionicons name="checkmark" size={18} color="green" />
        <Text style={styles.productImageBannerText}>
          &#x20A6; 1,600 Credit for delay
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productImageBanner: {
    // width: "100%",
    height: 30,
    paddingVertical: 3,
    backgroundColor: "#ffd580",
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  productImageBannerText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  productImageBannerMiddle: {
    width: 1,
    height: "90%",
    backgroundColor: "black",
    marginHorizontal: 5,
  },
  productImageBannerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default PromoStaticBanner;
