import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter, Link } from "expo-router";

import { useGetOrderHistoryQuery } from "../hooks/orderHooks";
import { ApiError } from "../types/ApiError";
import { getError } from "../utils";

export default function OrderHistory() {
  const { data: orders, isLoading, error } = useGetOrderHistoryQuery();
  const router = useRouter();

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
  ) : error ? (
    <View>
      <Text>{getError(error as ApiError)}</Text>
    </View>
  ) : orders?.length == 0 ? (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 20 }}>You have not made any orders yet!</Text>
    </View>
  ) : (
    <ScrollView style={{ flex: 1, margin: 10 }} nestedScrollEnabled={true}>
      <ScrollView horizontal={true}>
        <FlatList
          data={orders}
          keyExtractor={(item, index) =>
            item._id ? item._id.toString() : index.toString()
          }
          extraData={orders}
          ListHeaderComponent={() => {
            return (
              <>
                <View style={styles.resultHeader}>
                  <Text style={styles.repaymentText}>ID</Text>
                  <Text style={styles.repaymentText}>Date</Text>
                  <Text style={styles.repaymentText}>Total</Text>
                  <Text style={styles.repaymentText}>Paid</Text>
                  <Text style={styles.repaymentText}>Delivered</Text>
                  <Text style={styles.repaymentText}>Action</Text>
                </View>
              </>
            );
          }}
          renderItem={({ item }) => (
            <View style={styles.resultDisplay}>
              <View style={styles.resultDisplayItem}>
                <Text style={styles.resultDisplayText}>{item._id}</Text>
              </View>
              <View style={styles.resultDisplayItem}>
                <Text style={styles.resultDisplayText}>
                  {item.createdAt.substring(0, 10)}
                </Text>
              </View>
              <View style={styles.resultDisplayItem}>
                <Text style={styles.resultDisplayText}>
                  {item.totalPrice.toFixed(2)}
                </Text>
              </View>
              <View style={styles.resultDisplayItem}>
                <Text style={styles.resultDisplayText}>
                  {item.isPaid ? item.paidAt.substring(0, 10) : "No"}
                </Text>
              </View>
              <View style={styles.resultDisplayItem}>
                <Text style={styles.resultDisplayText}>
                  {item.isDelivered ? item.deliveredAt.substring(0, 10) : "No"}
                </Text>
              </View>
              <View style={styles.resultDisplayItem}>
                <TouchableOpacity>
                  <Text
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "blue",
                      textDecorationLine: "underline",
                    }}
                  >
                    <Link href={`/orderDetail/${item._id}`}>Detail</Link>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          scrollEnabled={false}
        />
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  repaymentText: {
    fontWeight: "bold",
  },
  resultHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 6,
  },

  resultDisplay: {
    display: "flex",
    flexDirection: "row",
  },
  resultDisplayItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "gray",
    width: 110,
  },
  resultDisplayText: {
    color: "black",
  },
});
